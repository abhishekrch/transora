import type { CacheEntry } from '../types';
import { STORAGE_KEYS, WIDGET_DEFAULTS } from '../types';

function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(36);
}

export class WidgetCache {
  private readonly apiKey: string;
  private readonly ttlMs: number;

  constructor(apiKey: string, ttlMs: number = WIDGET_DEFAULTS.TTL_MS) {
    this.apiKey = apiKey;
    this.ttlMs = ttlMs;
  }

  private getFullKey(hash: string, targetLang: string): string {
    return `${STORAGE_KEYS.CACHE_PREFIX}${this.apiKey}_${targetLang}_${hash}`;
  }

  private getKeyPrefix(): string {
    return `${STORAGE_KEYS.CACHE_PREFIX}${this.apiKey}_`;
  }

  get(text: string, targetLang: string): string | null {
    const key = this.getFullKey(hashString(text), targetLang);
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const entry = JSON.parse(stored) as CacheEntry;
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  set(text: string, targetLang: string, value: string): void {
    const key = this.getFullKey(hashString(text), targetLang);
    const entry: CacheEntry = {
      value,
      expiry: Date.now() + this.ttlMs,
    };
    const serialized = JSON.stringify(entry);

    try {
      localStorage.setItem(key, serialized);
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      ) {
        this.evictExpired();
        try {
          localStorage.setItem(key, serialized);
        } catch {
          this.evictByAge(0.2);
          try {
            localStorage.setItem(key, serialized);
          } catch {
            
          }
        }
      }
    }
  }

  private evictExpired(): void {
    const prefix = this.getKeyPrefix();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;

      const stored = localStorage.getItem(key);
      if (!stored) continue;

      try {
        const entry = JSON.parse(stored) as CacheEntry;
        if (Date.now() > entry.expiry) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }

  private evictByAge(fraction: number): void {
    const prefix = this.getKeyPrefix();
    const entries: { key: string; expiry: number }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;

      const stored = localStorage.getItem(key);
      if (!stored) continue;

      try {
        const entry = JSON.parse(stored) as CacheEntry;
        entries.push({ key, expiry: entry.expiry });
      } catch {
        localStorage.removeItem(key);
      }
    }

    entries.sort((a, b) => a.expiry - b.expiry);

    const countToEvict = Math.ceil(entries.length * fraction);
    for (let i = 0; i < countToEvict; i++) {
      localStorage.removeItem(entries[i]!.key);
    }
  }
}
