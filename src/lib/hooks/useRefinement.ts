import { useEffect, useRef, useMemo } from "react";

export interface Refinement<T> {
  (data: T): Promise<boolean>;
  invalidate(): void;
  /** Get cached result without re-running (useful for UI) */
  getCached?(data: T): Promise<boolean> | null;
}

/** Type that Zod .refine() accepts */
export type ZodRefineFn<T = any> = (value: T) => Promise<boolean> | boolean;

export interface RefinementCallback<T> {
  (data: T, ctx: { signal: AbortSignal }): boolean | Promise<boolean>;
}

export interface UseRefinementOptions<T> {
  /** Debounce delay in milliseconds */
  debounce?: number;
  /** Enable caching based on input value (recommended for password/username checks) */
  cacheKey?: (data: T) => string | null;
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
  const { debounce = 0, cacheKey } = options;

  // Keep latest callback and options
  const ctxRef = useRef({ callback, debounce, cacheKey });

  // Update context when callback or debounce changes
  useEffect(() => {
    ctxRef.current = { callback, debounce, cacheKey };
  }, [callback, debounce, cacheKey]);

  const refinement = useMemo(() => {
    const cache = new Map<string, Promise<boolean>>();
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

    const start = async (data: T): Promise<boolean> => {
      // Cancel any previous ongoing refinement (Best Practice for forms)
      // Automatically abort any pending or running process before starting a new one
      abort();
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
          await new Promise<void>((resolve) => {
            timeoutId = setTimeout(resolve, ctxRef.current.debounce);
          });
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
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

    const refine = async (data: T): Promise<boolean> => {
      // Return cached result if available
      //   if (cachedResult) {
      //     return cachedResult;
      //   }

      //   cachedResult = start(data);
      //   return cachedResult;
      const key = getCacheKey(data);
      if (key && cache.has(key)) return cache.get(key)!;

      const promise = start(data);
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
export const asZodRefine = <T>(refinement: Refinement<T>): ZodRefineFn<T> => {
  return (value: T) => refinement(value);
};

// Add this helper
export const createZodRefine = <T>(fn: Refinement<T>) => {
  const refineFn = (value: T) => fn(value);
  refineFn.invalidate = fn.invalidate; // optional
  return refineFn;
};
