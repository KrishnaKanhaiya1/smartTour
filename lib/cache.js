// lib/cache.js — Simple in-memory response cache with TTL
// Prevents duplicate Gemini API calls for identical queries

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

class ResponseCache {
  constructor(ttlMs = DEFAULT_TTL_MS) {
    this._store = new Map();
    this._ttlMs = ttlMs;
  }

  /**
   * Generate a simple hash key from the prompt strings.
   */
  _makeKey(systemPrompt, userPrompt) {
    // Simple string hash — good enough for in-memory dedup
    const str = `${systemPrompt}|||${userPrompt}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0; // Convert to 32-bit int
    }
    return `cache_${hash}`;
  }

  /**
   * Get a cached response if it exists and hasn't expired.
   */
  get(systemPrompt, userPrompt) {
    const key = this._makeKey(systemPrompt, userPrompt);
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this._ttlMs) {
      this._store.delete(key);
      return null;
    }

    console.log('[Cache] HIT — returning cached response');
    return entry.value;
  }

  /**
   * Store a response in the cache.
   */
  set(systemPrompt, userPrompt, value) {
    const key = this._makeKey(systemPrompt, userPrompt);
    this._store.set(key, { value, timestamp: Date.now() });

    // Evict old entries if cache grows too large (max 100 entries)
    if (this._store.size > 100) {
      const oldest = this._store.keys().next().value;
      this._store.delete(oldest);
    }
  }

  /**
   * Clear the entire cache.
   */
  clear() {
    this._store.clear();
  }

  get size() {
    return this._store.size;
  }
}

// Singleton instance shared across all modules
export const responseCache = new ResponseCache();
