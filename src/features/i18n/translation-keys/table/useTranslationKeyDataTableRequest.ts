"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DataTableServerQueryState,
  DataTableServerResult,
} from "@/components/DataTable";
import type { TranslationKey } from "../schemas";
import { loadTranslationKeyDataTableResult } from "../server";

/**
 * Primitive request state owned by the TranslationKey resource.
 *
 * This is intentionally different from:
 *
 *   DataTableServerResultLifecycle
 *
 * The generic DataTable layer derives its presentation lifecycle from
 * these lower-level request values.
 */
export interface TranslationKeyDataTableRequestState {
  /**
   * Result belonging to the current successful request.
   *
   * During a replacement request this becomes undefined so the generic
   * DataTable lifecycle can expose the previous successful result.
   */
  readonly result: DataTableServerResult<TranslationKey> | undefined;

  /**
   * Initial blocking loading state.
   *
   * Once at least one successful result has been received, later
   * requests are background refreshes instead.
   */
  readonly loading: boolean;

  /**
   * True while any TranslationKey DataTable request is in flight.
   */
  readonly fetching: boolean;

  /**
   * Current non-abort request error.
   */
  readonly error: unknown;

  /**
   * Explicitly re-run the current query without changing query state.
   *
   * Useful for:
   *
   * - refresh button
   * - post-mutation refresh
   * - retry
   */
  readonly refresh: () => void;
}

/**
 * Test whether an unknown caught value represents request cancellation.
 *
 * AbortController uses DOMException("AbortError") in browsers.
 *
 * Cancellation is a normal request-lifecycle event and must not be
 * surfaced to the table as a user-visible error.
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Execute TranslationKey DataTable requests for one controlled server
 * query state.
 *
 * Responsibilities:
 *
 * DataTableServerQueryState
 *        ↓
 * cancel obsolete request
 *        ↓
 * loadTranslationKeyDataTableResult()
 *        ↓
 * expose result/loading/fetching/error
 *
 * It deliberately knows nothing about:
 *
 * - MUI rendering
 * - table creation
 * - pagination widgets
 * - preserved-result presentation
 * - toolbar state
 *
 * Those responsibilities already belong to other layers.
 */
export function useTranslationKeyDataTableRequest(
  query: DataTableServerQueryState,
): TranslationKeyDataTableRequestState {
  const [result, setResult] = useState<
    DataTableServerResult<TranslationKey> | undefined
  >(undefined);

  /**
   * Start as true.
   *
   * The first request is guaranteed to begin after mount. Starting at
   * false would allow one initial render where the table appears empty
   * before the effect has a chance to mark the request as fetching.
   */
  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState<unknown>(undefined);

  /**
   * Once true, later requests should be treated as refresh/replacement
   * requests rather than blocking initial loads.
   */
  const hasSuccessfulResultRef = useRef(false);

  /**
   * Monotonically increasing request identifier.
   *
   * Additional protection against stale requests committing state.
   *
   * AbortController already cancels old fetches, but the identifier
   * also guarantees that an obsolete request cannot commit state even
   * if a transport implementation ever ignores AbortSignal.
   */
  const requestIdRef = useRef(0);

  /**
   * Incrementing this value forces the current query to execute again.
   */
  const [refreshRevision, setRefreshRevision] = useState(0);

  const refresh = useCallback((): void => {
    setRefreshRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;

    /**
     * Remove the current result while its replacement is loading.
     *
     * This is intentional.
     *
     * useDataTableServerResult() already stores and exposes the
     * previous successful normalized result, so previous-result
     * preservation must not be duplicated here.
     */
    setResult(undefined);

    setError(undefined);

    setFetching(true);

    void loadTranslationKeyDataTableResult(query, abortController.signal)
      .then((nextResult) => {
        if (
          abortController.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        hasSuccessfulResultRef.current = true;

        setResult(nextResult);
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

    /**
     * A query change or component unmount invalidates this request.
     */
    return () => {
      abortController.abort();
    };
  }, [query, refreshRevision]);

  /**
   * Loading is deliberately narrower than fetching.
   *
   * First request:
   *
   *   loading  = true
   *   fetching = true
   *
   * Later query/refetch:
   *
   *   loading  = false
   *   fetching = true
   *
   * which lets useDataTableServerResult() distinguish blocking load
   * from background refresh.
   */
  const loading = fetching && !hasSuccessfulResultRef.current;

  return {
    result,
    loading,
    fetching,
    error,
    refresh,
  };
}
