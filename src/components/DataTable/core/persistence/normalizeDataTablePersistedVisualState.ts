// src/components/DataTable/core/persistence/normalizeDataTablePersistedVisualState.ts

import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
} from "@tanstack/table-core";

import type { MuiDataTableDensity } from "../density";
import type { DataTableDisplayMode } from "../presentation";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
  type DataTablePersistedVisualState,
  type DataTablePersistedVisualStateContext,
  type DataTablePersistedVisualStateParseResult,
} from "./types";

const DENSITIES = new Set<MuiDataTableDensity>([
  "compact",
  "comfortable",
  "spacious",
]);

const DISPLAY_MODES = new Set<DataTableDisplayMode>([
  "table",
  "card",
  "auto",
]);

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeColumnIds(
  columnIds: readonly string[],
): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const id of columnIds) {
    if (
      typeof id !== "string" ||
      id.length === 0 ||
      seen.has(id)
    ) {
      continue;
    }

    seen.add(id);
    normalized.push(id);
  }

  return normalized;
}

function normalizeVisibility(
  value: unknown,
  allowedIds: ReadonlySet<string>,
): ColumnVisibilityState | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const result: ColumnVisibilityState = {};

  for (const [id, visible] of Object.entries(value)) {
    if (
      allowedIds.has(id) &&
      typeof visible === "boolean"
    ) {
      result[id] = visible;
    }
  }

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

function normalizeOrder(
  value: unknown,
  currentColumnIds: readonly string[],
  allowedIds: ReadonlySet<string>,
): ColumnOrderState | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const entry of value) {
    if (
      typeof entry !== "string" ||
      !allowedIds.has(entry) ||
      seen.has(entry)
    ) {
      continue;
    }

    seen.add(entry);
    result.push(entry);
  }

  /**
   * Columns introduced after the preference was written are appended in their
   * current resource-definition order.
   */
  for (const id of currentColumnIds) {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }

  return result;
}

function normalizeSizing(
  value: unknown,
  allowedIds: ReadonlySet<string>,
): ColumnSizingState | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const result: ColumnSizingState = {};

  for (const [id, size] of Object.entries(value)) {
    if (
      allowedIds.has(id) &&
      typeof size === "number" &&
      Number.isFinite(size) &&
      size > 0
    ) {
      result[id] = size;
    }
  }

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

function normalizePinnedIds(
  value: unknown,
  allowedIds: ReadonlySet<string>,
  globallySeen: Set<string>,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: string[] = [];

  for (const entry of value) {
    if (
      typeof entry !== "string" ||
      !allowedIds.has(entry) ||
      globallySeen.has(entry)
    ) {
      continue;
    }

    globallySeen.add(entry);
    result.push(entry);
  }

  return result;
}

function normalizePinning(
  value: unknown,
  allowedIds: ReadonlySet<string>,
): ColumnPinningState | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const seen = new Set<string>();

  /**
   * A column may only occupy one logical pinned region.
   *
   * If malformed persisted data lists the same ID in both regions, logical
   * start wins deterministically because it is normalized first.
   */
  const start = normalizePinnedIds(
    value.start,
    allowedIds,
    seen,
  );

  const end = normalizePinnedIds(
    value.end,
    allowedIds,
    seen,
  );

  if (start.length === 0 && end.length === 0) {
    return undefined;
  }

  return {
    start,
    end,
  };
}

/**
 * Decode and sanitize one persisted visual-state payload against the current
 * leaf-column universe.
 *
 * This is intentionally a pure function:
 *
 * - no localStorage
 * - no URL reads/writes
 * - no table mutation
 * - no resource-specific column knowledge
 *
 * Unknown schema versions are rejected as a whole. Within the supported
 * version, malformed optional fields are ignored independently so one stale
 * preference cannot corrupt the entire table.
 */
export function normalizeDataTablePersistedVisualState(
  value: unknown,
  context: DataTablePersistedVisualStateContext,
): DataTablePersistedVisualStateParseResult {
  if (!isRecord(value)) {
    return undefined;
  }

  if (
    value.version !==
    DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION
  ) {
    return undefined;
  }

  const currentColumnIds =
    normalizeColumnIds(context.columnIds);

  const allowedIds =
    new Set(currentColumnIds);

  const density =
    typeof value.density === "string" &&
    DENSITIES.has(
      value.density as MuiDataTableDensity,
    )
      ? (value.density as MuiDataTableDensity)
      : undefined;

  const displayMode =
    typeof value.displayMode === "string" &&
    DISPLAY_MODES.has(
      value.displayMode as DataTableDisplayMode,
    )
      ? (value.displayMode as DataTableDisplayMode)
      : undefined;

  const columnVisibility =
    normalizeVisibility(
      value.columnVisibility,
      allowedIds,
    );

  const columnOrder =
    normalizeOrder(
      value.columnOrder,
      currentColumnIds,
      allowedIds,
    );

  const columnSizing =
    normalizeSizing(
      value.columnSizing,
      allowedIds,
    );

  const columnPinning =
    normalizePinning(
      value.columnPinning,
      allowedIds,
    );

  return {
    version:
      DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
    ...(density !== undefined
      ? { density }
      : {}),
    ...(displayMode !== undefined
      ? { displayMode }
      : {}),
    ...(columnVisibility !== undefined
      ? { columnVisibility }
      : {}),
    ...(columnOrder !== undefined
      ? { columnOrder }
      : {}),
    ...(columnSizing !== undefined
      ? { columnSizing }
      : {}),
    ...(columnPinning !== undefined
      ? { columnPinning }
      : {}),
  };
}
