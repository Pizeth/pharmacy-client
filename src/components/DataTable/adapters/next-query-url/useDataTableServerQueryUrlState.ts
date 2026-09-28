// src/components/DataTable/adapters/next-query-url/useDataTableServerQueryUrlState.ts

"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  areDataTableServerQueryStatesEqual,
} from "../../mui/query-url";
import {
  useDataTableServerState,
} from "../../mui/server-state";
import type {
  DataTableServerQueryState,
  DataTableServerStateController,
} from "../../mui/server-state";
import type {
  UseDataTableServerQueryUrlStateOptions,
} from "./types";

function createHref(
  pathname: string,
  search: string,
): string {
  const hash =
    typeof window ===
    "undefined"
      ? ""
      : window.location.hash;

  return (
    pathname +
    (
      search.length > 0
        ? `?${search}`
        : ""
    ) +
    hash
  );
}

/**
 * Next.js App Router binding for DataTableServerQueryState.
 *
 * This adapter deliberately sits outside the generic MUI query codec.
 *
 * Ownership remains:
 *
 * DataTableServerQueryState
 *      ↓
 * useDataTableServerState()
 *      ↓
 * resource request lifecycle
 *
 * The Next adapter only mirrors that semantic query state into browser URL
 * state and re-applies browser back/forward navigation to the same controller.
 *
 * Saved visual preferences remain completely separate.
 */
export function useDataTableServerQueryUrlState(
  options:
    UseDataTableServerQueryUrlStateOptions,
): DataTableServerStateController {
  const {
    codec,
    historyMode =
      "replace",
    enabled =
      true,
    onStateChange,
    resetPageOnSortingChange =
      true,
    resetPageOnColumnFiltersChange =
      true,
    resetPageOnGlobalFilterChange =
      true,
  } = options;

  const pathname =
    usePathname();

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const currentSearch =
    searchParams.toString();

  const currentSearchRef =
    useRef(
      currentSearch,
    );

  currentSearchRef.current =
    currentSearch;

  const initialStateRef =
    useRef<DataTableServerQueryState | null>(
      null,
    );

  if (
    initialStateRef.current ===
    null
  ) {
    initialStateRef.current =
      enabled
        ? codec.parse(
            new URLSearchParams(
              currentSearch,
            ),
          )
        : codec.defaultState;
  }

  /**
   * Search string expected from the most recent local table interaction.
   *
   * App Router navigation is asynchronous. While this value is pending, an
   * intermediate URL commit from an older replace/push must not overwrite a
   * newer optimistic table state.
   */
  const pendingSearchRef =
    useRef<
      string | null
    >(null);

  /**
   * Applying browser history must not immediately write the same state back to
   * history through onStateChange.
   */
  const applyingUrlRef =
    useRef(false);

  const handleStateChange =
    useCallback(
      (
        nextState:
          DataTableServerQueryState,
      ): void => {
        onStateChange?.(
          nextState,
        );

        if (
          !enabled ||
          applyingUrlRef.current
        ) {
          return;
        }

        const nextParams =
          codec.serialize(
            nextState,
            new URLSearchParams(
              currentSearchRef.current,
            ),
          );

        const nextSearch =
          nextParams.toString();

        if (
          nextSearch ===
          currentSearchRef.current
        ) {
          pendingSearchRef.current =
            null;

          return;
        }

        pendingSearchRef.current =
          nextSearch;

        const href =
          createHref(
            pathname,
            nextSearch,
          );

        if (
          historyMode ===
          "push"
        ) {
          router.push(
            href,
            {
              scroll:
                false,
            },
          );

          return;
        }

        router.replace(
          href,
          {
            scroll:
              false,
          },
        );
      },
      [
        codec,
        enabled,
        historyMode,
        onStateChange,
        pathname,
        router,
      ],
    );

  const controller =
    useDataTableServerState({
      defaultState:
        initialStateRef.current,
      defaultPageSize:
        initialStateRef.current
          .pagination
          .pageSize,
      onStateChange:
        handleStateChange,
      resetPageOnSortingChange,
      resetPageOnColumnFiltersChange,
      resetPageOnGlobalFilterChange,
    });

  const stateRef =
    useRef(
      controller.state,
    );

  stateRef.current =
    controller.state;

  const setState =
    controller.setState;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const pending =
      pendingSearchRef.current;

    if (
      pending !== null
    ) {
      if (
        pending ===
        currentSearch
      ) {
        pendingSearchRef.current =
          null;
      }

      /**
       * Ignore intermediate App Router navigation commits while a newer local
       * query string is still expected.
       */
      return;
    }

    const nextState =
      codec.parse(
        new URLSearchParams(
          currentSearch,
        ),
      );

    if (
      areDataTableServerQueryStatesEqual(
        nextState,
        stateRef.current,
      )
    ) {
      return;
    }

    applyingUrlRef.current =
      true;

    try {
      setState(
        nextState,
      );
    } finally {
      applyingUrlRef.current =
        false;
    }
  }, [
    codec,
    currentSearch,
    enabled,
    setState,
  ]);

  return controller;
}
