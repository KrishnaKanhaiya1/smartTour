// lib/cache.js — In-memory response cache with extended TTL
// Prevents duplicate Gemini API calls for identical or similar queries
// Critical for conserving free-tier API quota

const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours — maximize cache hits on the free tier

class ResponseCache {
  constructor(ttlMs = DEFAULT_TTL_MS) {
    this._store = new Map();
    this._ttlMs = ttlMs;
  }

  /**
   * Generate a normalized cache key from the prompt strings.
   * Normalizes whitespace and case for better hit rates.
   */
  _makeKey(systemPrompt, userPrompt) {
    // Normalize: lowercase, collapse whitespace, trim
    const normalized = `${systemPrompt}|||${userPrompt}`
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized.charCodeAt(i);
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

    console.log(`[Cache] HIT — returning cached response (age: ${Math.round((Date.now() - entry.timestamp) / 1000)}s)`);
    return entry.value;
  }

  /**
   * Store a response in the cache.
   */
  set(systemPrompt, userPrompt, value) {
    const key = this._makeKey(systemPrompt, userPrompt);
    this._store.set(key, { value, timestamp: Date.now() });

    // Evict old entries if cache grows too large (max 200 entries)
    if (this._store.size > 200) {
      // Remove oldest entries
      const entries = [...this._store.entries()];
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, entries.length - 150); // trim down to 150
      for (const [k] of toRemove) {
        this._store.delete(k);
      }
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
