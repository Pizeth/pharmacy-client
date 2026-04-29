// validationCache.ts

type CacheEntry = {
  value: string;
  result: any;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

const TTL = 10_000; // 10s

export const getCached = (key: string, value: string) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.value === value && Date.now() - entry.timestamp < TTL) {
    return entry.result;
  }

  return null;
};

export const setCached = (key: string, value: string, result: any) => {
  cache.set(key, {
    value,
    result,
    timestamp: Date.now(),
  });
};
