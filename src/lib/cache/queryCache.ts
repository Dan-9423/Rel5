import { createCache } from './createCache';

interface QueryCacheConfig {
  defaultTTL?: number;
  storage?: Storage;
}

class QueryCache {
  private cache;
  private querySubscriptions: Map<string, Set<() => void>>;

  constructor(config: QueryCacheConfig = {}) {
    this.cache = createCache({
      key: 'query_cache',
      ttl: config.defaultTTL,
      storage: config.storage,
    });
    this.querySubscriptions = new Map();
  }

  setQueryData(queryKey: string, data: any): void {
    const queries = this.cache.get() || {};
    queries[queryKey] = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(queries);
    this.notifySubscribers(queryKey);
  }

  getQueryData(queryKey: string): any {
    const queries = this.cache.get() || {};
    return queries[queryKey]?.data;
  }

  invalidateQuery(queryKey: string): void {
    const queries = this.cache.get() || {};
    delete queries[queryKey];
    this.cache.set(queries);
    this.notifySubscribers(queryKey);
  }

  invalidateQueries(predicate?: (queryKey: string) => boolean): void {
    const queries = this.cache.get() || {};
    Object.keys(queries).forEach(queryKey => {
      if (!predicate || predicate(queryKey)) {
        delete queries[queryKey];
        this.notifySubscribers(queryKey);
      }
    });
    this.cache.set(queries);
  }

  subscribe(queryKey: string, callback: () => void): () => void {
    if (!this.querySubscriptions.has(queryKey)) {
      this.querySubscriptions.set(queryKey, new Set());
    }
    this.querySubscriptions.get(queryKey)!.add(callback);

    return () => {
      this.querySubscriptions.get(queryKey)?.delete(callback);
      if (this.querySubscriptions.get(queryKey)?.size === 0) {
        this.querySubscriptions.delete(queryKey);
      }
    };
  }

  private notifySubscribers(queryKey: string): void {
    this.querySubscriptions.get(queryKey)?.forEach(callback => callback());
  }
}

export const queryCache = new QueryCache();