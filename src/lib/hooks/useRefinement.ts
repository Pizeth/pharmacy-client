import { useEffect, useRef, useMemo } from "react";

export interface Refinement<T> {
  (data: T): Promise<boolean | string>;
  invalidate(): void;
  /** Get cached result without re-running (useful for UI) */
  getCached?(data: T): Promise<boolean | string> | null;
}

/** Type that Zod .refine() accepts */
// export type ZodRefineFn<T = any> = (value: T) => Promise<boolean> | boolean;

export interface RefinementCallback<T> {
  (
    data: T,
    ctx: { signal: AbortSignal },
  ): boolean | string | Promise<boolean | string>;
}

export interface UseRefinementOptions<T> {
  /** Debounce delay in milliseconds */
  debounce?: number;
  /** Enable caching based on input value (recommended for password/username checks) */
  cacheKey?: (data: T) => string | null;
  onStart?: () => void; // ← fires immediately on every call, before debounce
}

/**
 * A custom hook for creating efficient Zod refinements with caching and debouncing.
 *
 * Advanced version of useRefinement with per-input caching and improved abort handling.
 *
 * This solves the common performance issue where Zod runs refinements on every keystroke,
 * even when the relevant data hasn't changed.
 *
 * Features:
 * - Caches the result until `invalidate()` is called
 * - Supports debouncing
 * - Provides AbortSignal for cancellable async operations
 * - Fully compatible with React 19
 *
 * @param callback - The async/sync validation function
 * @param options - Configuration options
 * @returns A refinement function that can be used directly in Zod schemas
 *
 * @example
 * ```tsx
 * const checkUsername = useRefinement(async (username, { signal }) => {
 *   const res = await fetch(`/api/check?username=${username}`, { signal });
 *   const { available } = await res.json();
 *   return available;
 * }, { debounce: 500 });
 *
 * const schema = z.object({
 *   username: z.string().refine(checkUsername, "Username is already taken")
 * });
 * ```
 */
export default function useRefinement<T>(
  callback: RefinementCallback<T>,
  options: UseRefinementOptions<T> = {},
): Refinement<T> {
  const { debounce = 0, cacheKey, onStart } = options;

  // Keep latest callback and options
  const ctxRef = useRef({ callback, debounce, cacheKey, onStart });

  // Update context when callback or debounce changes
  useEffect(() => {
    ctxRef.current = { callback, debounce, cacheKey, onStart };
  }, [callback, debounce, cacheKey, onStart]);

  const refinement = useMemo(() => {
    const cache = new Map<string, Promise<boolean | string>>();
    let abortController: AbortController | null = null;
    // let cachedResult: Promise<boolean> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const abort = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      abortController?.abort();
      abortController = null;
    };

    const getCacheKey = (data: T): string | null => {
      if (cacheKey) return cacheKey(data);
      // Default: use JSON string (works well for primitives and simple objects)
      return typeof data === "string" ? data : JSON.stringify(data);
    };

    const start = async (data: T): Promise<boolean | string> => {
      // Cancel any previous ongoing refinement (Best Practice for forms)
      // Automatically abort any pending or running process before starting a new one
      abort();
      ctxRef.current.onStart?.(); // ← fires on every keystroke immediately
      abortController = new AbortController();
      const signal = abortController.signal;

      const key = getCacheKey(data);
      if (key && cache.has(key)) return cache.get(key)!;

      try {
        // Debounce if configured
        // if (debounce > 0) {
        //   await new Promise<void>((resolve) => {
        //     timeoutId = setTimeout(resolve, debounce);
        //   });
        // }

        if (ctxRef.current.debounce > 0) {
          await new Promise<void>((resolve, reject) => {
            timeoutId = setTimeout(resolve, ctxRef.current.debounce);
            // ✅ When abort() fires, reject immediately so start() throws AbortError
            // and the cached promise settles (then gets deleted by our .catch in refine)
            signal.addEventListener(
              "abort",
              () => {
                clearTimeout(timeoutId!);
                timeoutId = null;
                reject(new DOMException("Aborted", "AbortError"));
              },
              { once: true },
            );
          });
          // if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        }

        // const result = await ctxRef.current.callback(data, { signal });

        // ✅ KEY FIX: Wrap callback execution to defer any setState calls
        const result = await Promise.resolve().then(() =>
          ctxRef.current.callback(data, { signal }),
        );

        if (key) cache.set(key, Promise.resolve(result));
        return result;
        // return await ctxRef.current.callback(data, {
        //   signal: abortController!.signal,
        // });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        throw err;
      } finally {
        // timeoutId = null;
        // abortController = null;
        if (abortController?.signal === signal) {
          timeoutId = null;
          abortController = null;
        }
      }
    };

    const refine = async (data: T): Promise<boolean | string> => {
      // Return cached result if available
      //   if (cachedResult) {
      //     return cachedResult;
      //   }

      //   cachedResult = start(data);
      //   return cachedResult;
      const key = getCacheKey(data);
      if (key && cache.has(key)) return cache.get(key)!;

      // const promise = start(data);
      // Store pending promise so concurrent calls for same key share it
      const promise = start(data).catch((err) => {
        // ✅ Remove from cache so the next attempt re-runs cleanly
        if (key) cache.delete(key);
        throw err;
      });
      if (key) cache.set(key, promise);
      return promise;
    };

    // Attach invalidate method
    refine.invalidate = (): void => {
      abort();
      //   cachedResult = null;
      cache.clear();
    };

    refine.getCached = (data: T) => {
      const key = getCacheKey(data);
      return key ? (cache.get(key) ?? null) : null;
    };

    return { refine, abort };
  }, []); // Empty deps is fine because we use ctxRef

  // Cleanup on unmount
  useEffect(() => () => refinement.abort(), [refinement]);

  return refinement.refine;
}

// Helper to convert our Refinement into something Zod loves
// export const asZodRefine = <T>(refinement: Refinement<T>): ZodRefineFn<T> => {
//   return (value: T) => refinement(value);
// };

// Add this helper
export const createZodRefine = <T>(fn: Refinement<T>) => {
  const refineFn = (value: T) => fn(value);
  refineFn.invalidate = fn.invalidate; // optional
  return refineFn;
};
