// src/components/DataTable/mui/query-url/useDataTableServerQueryUrlState.ts

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
  useDataTableServerState,
} from "../server-state";
import type {
  DataTableServerQueryState,
  DataTableServerStateController,
} from "../server-state";
import {
  areDataTableServerQueryStatesEqual,
} from "./createDataTableQueryUrlCodec";
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
      : window.location
          .hash;

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
 * Next.js browser-history integration for DataTableServerQueryState.
 *
 * The generic server-state controller remains the owner of live query state.
 * This hook only:
 *
 * - hydrates its initial/default state from the URL,
 * - mirrors later local query changes into the URL,
 * - applies browser back/forward URL changes back into that same controller.
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
   * Next navigation is asynchronous. While this value is pending, an
   * intermediate URL commit from an older replace/push must not overwrite the
   * newer optimistic DataTable state.
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
       * Ignore intermediate Next navigation commits while a newer local query
       * is still expected.
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
