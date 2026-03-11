// lib/gemini.js — Direct REST API client for Gemini with rate limiting, caching, key rotation & model fallback
// Permanent fix for free-tier rate limits

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
    'gemini-2.0-flash',       // 15 RPM free tier, fast & capable
    'gemini-2.0-flash-lite',  // Higher RPM free tier, lighter
    'gemini-flash-latest',    // Fallback point
];
const BASE_URL_PREFIX = 'https://generativelanguage.googleapis.com/v1beta/models/';

// Export for reference
export const MODEL_NAME = MODELS[0];

// ──────────────────────────────────────────────
// GLOBAL SEQUENTIAL QUEUE + RATE LIMITER
// Only ONE Gemini API call runs at a time.
// Enforces a strict 6-second gap between calls.
// ──────────────────────────────────────────────
let _queue = Promise.resolve();
let _lastCallTime = 0;
const MIN_GAP_MS = 6000;

function enqueue(fn) {
    _queue = _queue
        .then(async () => {
            const now = Date.now();
            const elapsed = now - _lastCallTime;
            if (elapsed < MIN_GAP_MS) {
                const waitTime = MIN_GAP_MS - elapsed;
                console.log(`[Gemini Queue] Waiting ${waitTime}ms before next call...`);
                await new Promise(r => setTimeout(r, waitTime));
            }
            _lastCallTime = Date.now();
            return fn();
        })
        .catch(err => {
            throw err;
        });
    return _queue;
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
            temperature: 0.8,
            maxOutputTokens: jsonMode ? 4096 : 2048,
        }
    };

    if (jsonMode) {
        body.generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
}

/**
 * Try all models × all keys until one succeeds.
 * For each combination: up to 2 retries with exponential backoff.
 */
async function callWithFallback(systemPrompt, userPrompt, jsonMode = false) {
    const errors = [];

    for (const model of MODELS) {
        for (let keyAttempt = 0; keyAttempt < API_KEYS.length; keyAttempt++) {
            const apiKey = getNextApiKey();
            
            // Try up to 2 times per model+key combo
            for (let retry = 0; retry < 2; retry++) {
                try {
                    console.log(`[Gemini] Trying model=${model} key=...${apiKey.slice(-6)} attempt=${retry + 1}`);
                    const result = await callGeminiREST(systemPrompt, userPrompt, jsonMode, model, apiKey);
                    console.log(`[Gemini] ✓ Success with model=${model}`);
                    return result;
                } catch (error) {
                    const msg = error?.message || '';
                    const is429 = error?.status === 429 || msg.includes('429') ||
                        msg.includes('Resource has been exhausted') ||
                        msg.includes('rate') || msg.includes('quota');
                    const is5xx = error?.status >= 500 || msg.includes('503');

                    errors.push(`${model}/${apiKey.slice(-6)}: ${msg}`);

                    if (is429 || is5xx) {
                        // Wait before retrying this combo
                        const delay = (retry + 1) * 8000 + Math.random() * 4000;
                        console.warn(`[Gemini] ${error.status || 'error'} on ${model}. Waiting ${Math.round(delay)}ms...`);
                        await new Promise(r => setTimeout(r, delay));
                        continue; // retry same model+key
                    }

                    // Non-retryable error (400, 403, etc.) — skip to next model
                    break;
                }
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
 * Ask Gemini for a JSON response. Cache → Queue → Fallback pipeline.
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
 * Ask Gemini for a plain text response. Cache → Queue → Fallback pipeline.
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
