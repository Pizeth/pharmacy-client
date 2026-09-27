"use client";

// src/components/DataTable/mui/live/useDataTableLiveServerResult.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerResult,
  DataTableServerResultLifecycle,
} from "../server-data";

import {
  normalizeDataTableLiveResourceId,
} from "./createDataTableLiveEvent";
import {
  createDataTableLiveEventDeduplicator,
} from "./createDataTableLiveEventDeduplicator";
import {
  reconcileDataTableLiveEvent,
} from "./reconcileDataTableLiveEvent";
import type {
  DataTableLiveEvent,
} from "./types";
import type {
  DataTableLiveEventHandlingResult,
  UseDataTableLiveServerResultOptions,
  UseDataTableLiveServerResultValue,
} from "./liveServerResultTypes";

interface LiveResultOverlay<TData extends RowData> {
  /**
   * Query/result references that established the base for this overlay.
   *
   * They let render synchronously reject an overlay after query/canonical
   * result replacement before the cleanup effect executes.
   */
  readonly query: UseDataTableLiveServerResultOptions<TData>["query"];
  readonly baseRows: readonly TData[];
  readonly result: DataTableServerResult<TData>;
}

/**
 * Generic executor for already-normalized live events.
 *
 * Responsibilities:
 *
 * - resource routing,
 * - bounded duplicate-event protection,
 * - invoking the pure refetch-vs-reconcile policy,
 * - keeping proven local row replacements visible,
 * - executing the caller's generic refresh command for refetch decisions.
 *
 * It has no transport knowledge and no TanStack row-selection/pinning logic.
 */
export function useDataTableLiveServerResult<
  TData extends RowData,
>(
  options: UseDataTableLiveServerResultOptions<TData>,
): UseDataTableLiveServerResultValue<TData> {
  const {
    resource,
    query,
    server,
    refresh,
    getRowId,
    canReconcileUpdatedRecord,
    maxDeduplicationEntries = 512,
  } = options;

  const normalizedResource =
    normalizeDataTableLiveResourceId(resource);

  const [overlay, setOverlay] =
    useState<LiveResultOverlay<TData> | undefined>(
      undefined,
    );

  const deduplicatorRef = useRef(
    createDataTableLiveEventDeduplicator({
      maxEntries: maxDeduplicationEntries,
    }),
  );

  const latestRef = useRef({
    normalizedResource,
    query,
    server,
    refresh,
    getRowId,
    canReconcileUpdatedRecord,
  });

  latestRef.current = {
    normalizedResource,
    query,
    server,
    refresh,
    getRowId,
    canReconcileUpdatedRecord,
  };

  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;

  /**
   * Canonical server result or semantic query replacement invalidates any
   * local overlay built on the old base result.
   */
  useEffect(() => {
    setOverlay((previous) => {
      if (
        previous === undefined ||
        (
          previous.query === query &&
          previous.baseRows === server.rows
        )
      ) {
        return previous;
      }

      return undefined;
    });
  }, [
    query,
    server.rows,
  ]);

  const handleEvent = useCallback(
    (
      event: DataTableLiveEvent<TData>,
    ): DataTableLiveEventHandlingResult<TData> => {
      const latest = latestRef.current;

      if (
        event.resource !==
        latest.normalizedResource
      ) {
        return {
          status: "ignored",
          reason: "resource-mismatch",
        };
      }

      if (
        !deduplicatorRef.current.accept(event)
      ) {
        return {
          status: "ignored",
          reason: "duplicate-event",
        };
      }

      const activeOverlay =
        overlayRef.current &&
        overlayRef.current.query === latest.query &&
        overlayRef.current.baseRows ===
          latest.server.rows
          ? overlayRef.current
          : undefined;

      /**
       * Local reconciliation while a replacement request is already running can
       * race a stale in-flight response. Withhold a patchable current result in
       * that case so the pure policy selects the conservative refetch path.
       */
      const currentResult =
        !latest.server.isPreviousResult &&
        !latest.server.isFetching &&
        latest.server.hasResult
          ? activeOverlay?.result ?? {
              rows: latest.server.rows,
              pagination:
                latest.server.pagination,
            }
          : undefined;

      const decision =
        reconcileDataTableLiveEvent({
          query: latest.query,
          result: currentResult,
          event,
          getRowId: latest.getRowId,
          canReconcileUpdatedRecord:
            latest.canReconcileUpdatedRecord,
        });

      if (decision.strategy === "reconcile") {
        const nextOverlay: LiveResultOverlay<TData> = {
          query: latest.query,
          baseRows: latest.server.rows,
          result: decision.result,
        };

        overlayRef.current = nextOverlay;
        setOverlay(nextOverlay);

        return {
          status: "reconciled",
          decision,
        };
      }

      latest.refresh();

      return {
        status: "refetch",
        decision,
      };
    },
    [],
  );

  const activeOverlay =
    overlay &&
    overlay.query === query &&
    overlay.baseRows === server.rows
      ? overlay.result
      : undefined;

  const presentationServer =
    useMemo<DataTableServerResultLifecycle<TData>>(
      () => {
        if (activeOverlay === undefined) {
          return server;
        }

        const rows = activeOverlay.rows;
        const hasRows = rows.length > 0;

        return {
          ...server,
          rows,
          pagination:
            activeOverlay.pagination,
          hasRows,
          isEmpty:
            server.hasResult && !hasRows,
        };
      },
      [
        activeOverlay,
        server,
      ],
    );

  const clearEventHistory = useCallback(() => {
    deduplicatorRef.current.clear();
  }, []);

  return {
    server: presentationServer,
    handleEvent,
    clearEventHistory,
  };
}
