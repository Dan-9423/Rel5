import { useCallback, useEffect, useRef } from 'react';

interface CacheConfig<T> {
  key: string;
  ttl?: number; // Time to live in milliseconds
  storage?: Storage;
  serialize?: (data: T) => string;
  deserialize?: (data: string) => T;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function createCache<T>({
  key,
  ttl = 5 * 60 * 1000, // 5 minutes default
  storage = localStorage,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: CacheConfig<T>) {
  const CACHE_KEY = `cache_${key}`;

  const get = (): T | null => {
    try {
      const cached = storage.getItem(CACHE_KEY);
      if (!cached) return null;

      const entry: CacheEntry<T> = deserialize(cached);
      const now = Date.now();

      if (now - entry.timestamp > ttl) {
        storage.removeItem(CACHE_KEY);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const set = (data: T): void => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      storage.setItem(CACHE_KEY, serialize(entry));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const remove = (): void => {
    try {
      storage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  };

  const clear = (): void => {
    try {
      Object.keys(storage).forEach(key => {
        if (key.startsWith('cache_')) {
          storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return { get, set, remove, clear };
}

export function useCache<T>(config: CacheConfig<T>) {
  const cache = useRef(createCache(config));

  const invalidate = useCallback(() => {
    cache.current.remove();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  return {
    ...cache.current,
    invalidate,
  };
}