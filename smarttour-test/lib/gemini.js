// lib/gemini.js — Direct REST API client for Gemini with rate limiting, caching, key rotation, model fallback & circuit breaker
// Optimized for free-tier quota conservation

import { responseCache } from './cache';

// ──────────────────────────────────────────────
// MULTI-KEY SUPPORT
// Set GEMINI_API_KEYS (comma-separated) for multiple keys,
// or fall back to the single GEMINI_API_KEY.
// ──────────────────────────────────────────────
function getApiKeys() {
    const raw = `${process.env.GEMINI_API_KEYS || ''},${process.env.GEMINI_API_KEY || ''}`;
    return Array.from(new Set(raw.split(',').map(k => k.trim()).filter(Boolean)));
}

// ──────────────────────────────────────────────
// MODEL FALLBACK CHAIN
// Try the primary model first, fall back to cheaper/lighter ones on 429.
// ──────────────────────────────────────────────
const MODELS = [
    'gemini-2.5-flash',       // 2.5 Flash works with this key
    'gemini-2.0-flash',       // 15 RPM free tier
    'gemini-2.0-flash-lite',  // Higher RPM free tier
];
const BASE_URL_PREFIX = 'https://generativelanguage.googleapis.com/v1beta/models/';

// Export for reference
export const MODEL_NAME = MODELS[0];

// ──────────────────────────────────────────────
// CIRCUIT BREAKER
// When quota is exhausted, stop ALL calls for a cooldown period
// instead of wasting remaining quota on retries.
// ──────────────────────────────────────────────
let _circuitOpen = false;
let _circuitOpenUntil = 0;

function isCircuitOpen() {
    return false; // Disabled global circuit breaker to prevent overblocking
}

// ──────────────────────────────────────────────
// GLOBAL SEQUENTIAL QUEUE + RATE LIMITER
// Only ONE Gemini API call runs at a time.
// Enforces a strict gap between calls.
// ──────────────────────────────────────────────
const _exhaustedKeysAndModels = new Set();

let _queue = Promise.resolve();
let _lastCallTime = 0;
const MIN_GAP_MS = 1500; // 1.5s gap

function enqueue(fn) {
    return new Promise((resolve, reject) => {
        _queue = _queue
            .then(async () => {
                try {
                    const now = Date.now();
                    const elapsed = now - _lastCallTime;
                    if (elapsed < MIN_GAP_MS) {
                        const waitTime = MIN_GAP_MS - elapsed;
                        await new Promise(r => setTimeout(r, waitTime));
                    }
                    _lastCallTime = Date.now();
                    const result = await fn();
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Make a single REST call to a specific model + key.
 */
async function callGeminiREST(systemPrompt, userPrompt, jsonMode, model, apiKey) {
    const url = `${BASE_URL_PREFIX}${model}:generateContent?key=${apiKey}`;

    const body = {
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: [{
            parts: [{ text: userPrompt }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: jsonMode ? 8192 : 2048,
        }
    };

    if (jsonMode) {
        body.generationConfig.responseMimeType = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000); // 35s timeout for complete JSON generation

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(
                errorData?.error?.message || `Gemini API error: ${response.status} ${response.statusText}`
            );
            error.status = response.status;
            throw error;
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const text = parts.map(p => p.text || '').join('').trim();

        if (!text) {
            throw new Error('Gemini returned an empty response.');
        }

        return text;
    } finally {
        clearTimeout(timeout);
    }
}

const _tempCooldowns = new Map(); // key -> timestamp when cooldown ends

function isKeyEligible(model, key) {
    if (_exhaustedKeysAndModels.has(`${model}:${key}`)) return false;
    const cooldownUntil = _tempCooldowns.get(`${model}:${key}`) || 0;
    if (Date.now() < cooldownUntil) return false;
    return true;
}

function setKeyCooldown(model, key, durationMs = 60_000) {
    _tempCooldowns.set(`${model}:${key}`, Date.now() + durationMs);
}

/**
 * Try all models, racing all available keys in PARALLEL for each model.
 * If a key fails with 429, it enters a temporary 60s cooldown while other keys continue working.
 */
async function callWithFallback(systemPrompt, userPrompt, jsonMode = false) {
    const modelErrors = [];

    for (const model of MODELS) {
        const allKeys = getApiKeys();
        // Get eligible keys (not permanently blacklisted and not on 60s cooldown)
        let availableKeys = allKeys.filter(key => isKeyEligible(model, key));
        
        // If all keys are on temporary cooldown, clear expired ones or fallback to all non-blacklisted
        if (availableKeys.length === 0) {
            availableKeys = allKeys.filter(key => !_exhaustedKeysAndModels.has(`${model}:${key}`));
        }

        if (availableKeys.length === 0) {
            modelErrors.push(`${model}: all keys permanently exhausted`);
            continue;
        }

        try {
            console.log(`[Gemini] Racing ${availableKeys.length} keys on model=${model}`);
            const result = await Promise.any(
                availableKeys.map(async (apiKey) => {
                    console.log(`[Gemini] Trying model=${model} key=...${apiKey.slice(-6)}`);
                    try {
                        const text = await callGeminiREST(systemPrompt, userPrompt, jsonMode, model, apiKey);
                        console.log(`[Gemini] ✓ Success with model=${model} key=...${apiKey.slice(-6)}`);
                        return text;
                    } catch (error) {
                        const msg = error?.message || '';
                        const limitMatch = msg.match(/limit:\s*(\d+)/i);
                        const isPermanentQuotaExhaustion =
                            (limitMatch && limitMatch[1] === '0') || error?.status === 403;
                        const is429 = error?.status === 429 || msg.includes('429') ||
                            msg.includes('Resource has been exhausted') ||
                            msg.includes('rate') || msg.includes('quota');

                        if (isPermanentQuotaExhaustion) {
                            console.warn(`[Gemini] Permanent quota exhaustion for ${model} key=...${apiKey.slice(-6)}. Blacklisting.`);
                            _exhaustedKeysAndModels.add(`${model}:${apiKey}`);
                        } else if (is429) {
                            console.warn(`[Gemini] Temporarily rate limited: ${model} key=...${apiKey.slice(-6)}. Cooling down for 60s.`);
                            setKeyCooldown(model, apiKey, 60_000);
                        } else {
                            console.warn(`[Gemini] Failed: ${model} key=...${apiKey.slice(-6)}: ${msg.slice(0, 100)}`);
                        }
                        throw error;
                    }
                })
            );
            return result;
        } catch (aggregateError) {
            const reasons = (aggregateError?.errors || []).map(e => (e?.message || 'unknown').slice(0, 60));
            modelErrors.push(`${model}: all ${availableKeys.length} keys failed [${reasons.join('; ')}]`);
            continue;
        }
    }

    const error = new Error(
        `All Gemini models and API keys exhausted. Errors: ${modelErrors.slice(-3).join(' | ')}`
    );
    error.status = 429;
    throw error;
}

/**
 * Parse JSON from Gemini response text.
 */
function parseJSON(text) {
    // Direct parse
    try { return JSON.parse(text); } catch {}

    // Extract from code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        try { return JSON.parse(codeBlockMatch[1]); } catch {}
    }

    // Find JSON object/array in text
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[1]); } catch {}
    }

    console.error('[Gemini] Failed to parse JSON. Raw text:', text.substring(0, 500));
    throw new Error('Gemini did not return valid JSON.');
}

/**
 * Ask Gemini for a JSON response. Cache → Circuit Breaker → Queue → Fallback pipeline.
 */
export async function askGeminiJSON(systemPrompt, userPrompt) {
    const cached = responseCache.get(systemPrompt, userPrompt);
    if (cached) return cached;

    const result = await enqueue(async () => {
        // responseMimeType requests JSON, but a model can still produce an
        // incomplete response if it hits an output boundary. Retry once with an
        // explicit compactness instruction before surfacing a failure.
        for (let attempt = 0; attempt < 2; attempt++) {
            const retryPrompt = attempt === 0
                ? userPrompt
                : `${userPrompt}\n\nReturn compact, valid JSON only. Keep every field concise and finish the entire object.`;
            const text = await callWithFallback(systemPrompt, retryPrompt, true);
            try {
                return parseJSON(text);
            } catch (error) {
                if (attempt === 1) throw error;
                console.warn('[Gemini] Invalid JSON received; retrying once with a compact response request.');
            }
        }
    });

    responseCache.set(systemPrompt, userPrompt, result);
    return result;
}

/**
 * Ask Gemini for a plain text response. Cache → Circuit Breaker → Queue → Fallback pipeline.
 */
export async function askGeminiText(systemPrompt, userPrompt) {
    const cached = responseCache.get(systemPrompt, userPrompt);
    if (cached) return cached;

    const result = await enqueue(async () => {
        return await callWithFallback(systemPrompt, userPrompt, false);
    });

    responseCache.set(systemPrompt, userPrompt, result);
    return result;
}
