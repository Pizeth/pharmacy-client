import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

export type DataTableColumnRegion = "start" | "center" | "end";
export type DataTableColumnMoveDirection = "before" | "after";

/**
 * Determine which logical ordering region owns a column.
 *
 * Pinned columns are ordered by columnPinning.start/end.
 *
 * Unpinned columns are ordered by columnOrder.
 */
export function getDataTableColumnRegion<
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<MuiDataTableFeatures, TData, TValue>): DataTableColumnRegion {
  const pinned = column.getIsPinned();

  if (pinned === "start") {
    return "start";
  }

  if (pinned === "end") {
    return "end";
  }

  return "center";
}

/**
 * Gets all leaf columns belonging to a logical region.
 *
 * Unlike visible-only APIs, these region APIs retain hidden columns,
 * which is essential for a column manager.
 */
export function getDataTableRegionColumns<TData extends RowData>(
  table: MuiDataTableInstance<TData>,

  region: DataTableColumnRegion,
) {
  switch (region) {
    case "start":
      return table.getStartLeafColumns();

    case "center":
      return table.getCenterLeafColumns();

    case "end":
      return table.getEndLeafColumns();
  }
}

/**
 * Build the current complete leaf-column order.
 *
 * `getAllLeafColumns()` reflects the effective ordered leaf columns
 * while retaining hidden columns.
 *
 * We commit a complete order array rather than attempting to mutate
 * state.columnOrder directly because the valid default state is `[]`.
 */
function getCurrentCompleteColumnOrder<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
): string[] {
  return table.getAllLeafColumns().map((column) => column.id);
}

/**
 * Reorder two CENTER columns.
 *
 * Center-column order is represented by TanStack columnOrder.
 */
function reorderCenterColumns<TData extends RowData>(
  table: MuiDataTableInstance<TData>,

  sourceId: string,

  targetId: string,
): void {
  const currentOrder = getCurrentCompleteColumnOrder(table);

  const nextOrder = moveIdBeforeTarget(currentOrder, sourceId, targetId);

  table.setColumnOrder(nextOrder);
}

/**
 * Reorder columns inside the start/end pinned regions.
 *
 * Their visible/rendered order is defined by the corresponding
 * columnPinning state array rather than columnOrder.
 */
function reorderPinnedColumns<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
  region: "start" | "end",
  sourceId: string,
  targetId: string,
): void {
  table.setColumnPinning((previous) => {
    const currentIds = previous[region];

    const nextIds = moveIdBeforeTarget(currentIds, sourceId, targetId);

    return {
      ...previous,

      [region]: nextIds,
    };
  });
}

/**
 * Reorder one column relative to another.
 *
 * Cross-region drag is intentionally rejected.
 *
 * Reordering and pinning are independent interactions.
 */
export function reorderDataTableColumn<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
  sourceId: string,
  targetId: string,
): boolean {
  if (sourceId === targetId) {
    return false;
  }

  const sourceColumn = table.getColumn(sourceId);

  const targetColumn = table.getColumn(targetId);

  if (!sourceColumn || !targetColumn) {
    return false;
  }

  const sourceRegion = getDataTableColumnRegion(sourceColumn);

  const targetRegion = getDataTableColumnRegion(targetColumn);

  /**
   * Do not silently change pinning as part of drag ordering.
   */
  if (sourceRegion !== targetRegion) {
    return false;
  }

  switch (sourceRegion) {
    case "center":
      reorderCenterColumns(table, sourceId, targetId);

      return true;

    case "start":
    case "end":
      reorderPinnedColumns(table, sourceRegion, sourceId, targetId);

      return true;
  }
}

/**
 * Move one array item relative to another.
 */
function moveIdBeforeTarget(
  ids: readonly string[],

  sourceId: string,

  targetId: string,
): string[] {
  if (sourceId === targetId) {
    return [...ids];
  }

  const sourceIndex = ids.indexOf(sourceId);

  const targetIndex = ids.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return [...ids];
  }

  const next = [...ids];

  const [source] = next.splice(sourceIndex, 1);

  /**
   * Removing an earlier item changes the target's index.
   */
  const insertionIndex =
    sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;

  next.splice(insertionIndex, 0, source);

  return next;
}

/**
 * Move a column one position forward/backward inside an id array.
 */
function moveIdByOffset(
  ids: readonly string[],

  columnId: string,

  offset: -1 | 1,
): string[] {
  const currentIndex = ids.indexOf(columnId);

  if (currentIndex === -1) {
    return [...ids];
  }

  const nextIndex = currentIndex + offset;

  if (nextIndex < 0 || nextIndex >= ids.length) {
    return [...ids];
  }

  const next = [...ids];

  const temporary = next[currentIndex];

  next[currentIndex] = next[nextIndex];

  next[nextIndex] = temporary;

  return next;
}

export function moveDataTableColumn<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
  columnId: string,
  direction: DataTableColumnMoveDirection,
): boolean {
  const column = table.getColumn(columnId);

  if (!column) {
    return false;
  }

  const region = getDataTableColumnRegion(column);

  const regionColumns = getDataTableRegionColumns(table, region);

  const ids = regionColumns.map((candidate) => candidate.id);

  const currentIndex = ids.indexOf(columnId);

  if (currentIndex === -1) {
    return false;
  }

  const offset: -1 | 1 = direction === "before" ? -1 : 1;

  const nextIndex = currentIndex + offset;

  if (nextIndex < 0 || nextIndex >= ids.length) {
    return false;
  }

  const targetId = ids[nextIndex];

  /**
   * A direct adjacent swap is easier and less ambiguous here than
   * the drag/drop "insert before target" behavior.
   */
  if (region === "center") {
    const currentOrder = getCurrentCompleteColumnOrder(table);

    table.setColumnOrder(moveIdByOffset(currentOrder, columnId, offset));

    return true;
  }

  table.setColumnPinning((previous) => ({
    ...previous,

    [region]: moveIdByOffset(previous[region], columnId, offset),
  }));

  return true;
}
