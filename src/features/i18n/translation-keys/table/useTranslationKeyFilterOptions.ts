"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import { getTranslationCategories } from "../api";
import {
  createTranslationKeyCategoryFilterOptions,
  TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
} from "../columns";
import type { TranslationCategory } from "../schemas";

/**
 * Resource-owned filter-option lifecycle.
 *
 * These options are NOT table rows and should not be mixed with the
 * main TranslationKey DataTable request lifecycle.
 */
export interface TranslationKeyFilterOptionsState {
  /**
   * Category values suitable for DataTable's generic select filter.
   *
   * Example:
   *
   *   {
   *     label: "auth",
   *     value: 2
   *   }
   */
  readonly categoryOptions: readonly MuiDataTableFilterOption[];

  /**
   * Current application TranslationKey locale options.
   */
  readonly localeOptions: readonly MuiDataTableFilterOption[];

  /**
   * Initial category-option request.
   */
  readonly loading: boolean;

  /**
   * Any category-option request currently running.
   */
  readonly fetching: boolean;

  /**
   * Non-abort request error.
   */
  readonly error: unknown;

  /**
   * Explicitly reload category options.
   */
  readonly refresh: () => void;
}

/**
 * Browser AbortController cancellation is normal lifecycle behavior,
 * not a user-visible error.
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Load resource-owned values needed by TranslationKey column filters.
 *
 * Current remote option source:
 *
 *   TranslationCategory[]
 *
 * Locale options are currently application-static and can later be
 * replaced by the application's canonical locale registry without
 * changing the DataTable layer.
 */
export function useTranslationKeyFilterOptions(): TranslationKeyFilterOptionsState {
  const [categories, setCategories] = useState<readonly TranslationCategory[]>(
    [],
  );

  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState<unknown>(undefined);

  /**
   * Distinguish:
   *
   *   first load
   *
   * from:
   *
   *   later refresh
   */
  const hasLoadedRef = useRef(false);

  /**
   * Prevent an obsolete request from committing even if a future
   * transport implementation ever ignores AbortSignal.
   */
  const requestIdRef = useRef(0);

  const [refreshRevision, setRefreshRevision] = useState(0);

  const refresh = useCallback((): void => {
    setRefreshRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;

    setFetching(true);
    setError(undefined);

    void getTranslationCategories(abortController.signal)
      .then((response) => {
        if (
          abortController.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setCategories(response.data);

        hasLoadedRef.current = true;
      })
      .catch((requestError: unknown) => {
        if (
          abortController.signal.aborted ||
          isAbortError(requestError) ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setError(requestError);
      })
      .finally(() => {
        if (
          abortController.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setFetching(false);
      });

    return () => {
      abortController.abort();
    };
  }, [refreshRevision]);

  /**
   * Keep option identity stable until the category resource actually
   * changes.
   *
   * This is useful because the result becomes part of our memoized
   * column definition.
   */
  const categoryOptions = useMemo(
    () => createTranslationKeyCategoryFilterOptions(categories),
    [categories],
  );

  const loading = fetching && !hasLoadedRef.current;

  return {
    categoryOptions,
    localeOptions: TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
    loading,
    fetching,
    error,
    refresh,
  };
}
