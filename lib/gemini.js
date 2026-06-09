// lib/gemini.js — Direct REST API client for Gemini with rate limiting, caching, key rotation, model fallback & circuit breaker
// Optimized for free-tier quota conservation

import { responseCache } from './cache';

// ──────────────────────────────────────────────
// MULTI-KEY SUPPORT
// Set GEMINI_API_KEYS (comma-separated) for multiple keys,
// or fall back to the single GEMINI_API_KEY.
// ──────────────────────────────────────────────
const API_KEYS = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

if (API_KEYS.length === 0) {
    console.error('[Gemini] No API key configured! Set GEMINI_API_KEY or GEMINI_API_KEYS in .env.local');
}

let _currentKeyIndex = 0;
function getNextApiKey() {
    const key = API_KEYS[_currentKeyIndex % API_KEYS.length];
    _currentKeyIndex++;
    return key;
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
const CIRCUIT_COOLDOWN_MS = 60_000; // 60-second cooldown after quota hit

function openCircuit(reason) {
    _circuitOpen = true;
    _circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    console.warn(`[Gemini Circuit Breaker] OPEN — ${reason}. Blocking all calls for ${CIRCUIT_COOLDOWN_MS / 1000}s until ${new Date(_circuitOpenUntil).toISOString()}`);
}

function isCircuitOpen() {
    if (!_circuitOpen) return false;
    if (Date.now() >= _circuitOpenUntil) {
        _circuitOpen = false;
        console.log('[Gemini Circuit Breaker] CLOSED — cooldown expired, allowing calls again.');
        return false;
    }
    return true;
}

// ──────────────────────────────────────────────
// GLOBAL SEQUENTIAL QUEUE + RATE LIMITER
// Only ONE Gemini API call runs at a time.
// Enforces a strict gap between calls.
// ──────────────────────────────────────────────
const _exhaustedKeysAndModels = new Set();

let _queue = Promise.resolve();
let _lastCallTime = 0;
const MIN_GAP_MS = 5000; // 5 second gap — stay well within 15 RPM (=12 per minute max)

function enqueue(fn) {
    return new Promise((resolve, reject) => {
        _queue = _queue
            .then(async () => {
                try {
                    // Check circuit breaker BEFORE waiting
                    if (isCircuitOpen()) {
                        throw Object.assign(
                            new Error(`Circuit breaker open. Quota exhausted. Try again after ${new Date(_circuitOpenUntil).toISOString()}`),
                            { status: 429, isCircuitBreaker: true }
                        );
                    }

                    const now = Date.now();
                    const elapsed = now - _lastCallTime;
                    if (elapsed < MIN_GAP_MS) {
                        const waitTime = MIN_GAP_MS - elapsed;
                        console.log(`[Gemini Queue] Waiting ${waitTime}ms before next call...`);
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
            maxOutputTokens: jsonMode ? 4096 : 1024,
        }
    };

    if (jsonMode) {
        body.generationConfig.responseMimeType = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout

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

/**
 * Try all models × all keys until one succeeds.
 * NO retries per combo — each model+key gets exactly 1 attempt to conserve quota.
 * Circuit breaker trips on 429/quota errors.
 */
async function callWithFallback(systemPrompt, userPrompt, jsonMode = false) {
    const errors = [];

    for (const model of MODELS) {
        for (let keyAttempt = 0; keyAttempt < API_KEYS.length; keyAttempt++) {
            const apiKey = getNextApiKey();
            const cacheKey = `${model}:${apiKey}`;

            if (_exhaustedKeysAndModels.has(cacheKey)) {
                continue;
            }

            // Check circuit breaker before each attempt
            if (isCircuitOpen()) {
                const error = new Error(`Circuit breaker open. Try again later.`);
                error.status = 429;
                error.isCircuitBreaker = true;
                throw error;
            }
            
            try {
                console.log(`[Gemini] Trying model=${model} key=...${apiKey.slice(-6)}`);
                const result = await callGeminiREST(systemPrompt, userPrompt, jsonMode, model, apiKey);
                console.log(`[Gemini] ✓ Success with model=${model}`);
                return result;
            } catch (error) {
                const msg = error?.message || '';
                const limitMatch = msg.match(/limit:\s*(\d+)/i);
                const isPermanentQuotaExhaustion = 
                    (limitMatch && limitMatch[1] === '0') ||
                    error?.status === 403;

                const is429 = error?.status === 429 || msg.includes('429') ||
                    msg.includes('Resource has been exhausted') ||
                    msg.includes('rate') || msg.includes('quota');

                errors.push(`${model}/${apiKey.slice(-6)}: ${msg}`);

                if (isPermanentQuotaExhaustion) {
                    console.warn(`[Gemini] Permanent quota exhaustion for ${model} key=...${apiKey.slice(-6)}. Blacklisting.`);
                    _exhaustedKeysAndModels.add(cacheKey);
                    continue; // try next combo, no wait
                }

                if (is429) {
                    // TRIP THE CIRCUIT BREAKER — don't retry, don't waste more quota
                    openCircuit(`429 on ${model} key=...${apiKey.slice(-6)}: ${msg}`);
                    const cbError = new Error(`Rate limited. Circuit breaker activated for ${CIRCUIT_COOLDOWN_MS / 1000}s. ${msg}`);
                    cbError.status = 429;
                    cbError.isCircuitBreaker = true;
                    throw cbError;
                }

                // Non-retryable error (400, 5xx etc.) — try next model
                continue;
            }
        }
    }

    // All models and keys exhausted
    const error = new Error(
        `All Gemini models and API keys exhausted. Last errors: ${errors.slice(-3).join(' | ')}`
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
        const text = await callWithFallback(systemPrompt, userPrompt, true);
        return parseJSON(text);
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
