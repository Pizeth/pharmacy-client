import { dataTableClasses } from "../../styles";

export type ProfilingDisplayMode = "table" | "card";

/** Check rendered output, not just the underlying TanStack state snapshot. */
function renderedRows(root: Element | null, mode: ProfilingDisplayMode): Element[] {
  if (!root) return [];
  const selector = mode === "table"
    ? "tbody tr[data-row-id]"
    : `.${dataTableClasses.cardItem}[data-row-id]`;
  return Array.from(root.querySelectorAll(selector));
}

export function hasRenderedFirstRow(
  root: Element | null, mode: ProfilingDisplayMode, rowId: string,
): boolean {
  return renderedRows(root, mode)[0]?.getAttribute("data-row-id") === rowId;
}

export function hasRenderedRowState(
  root: Element | null,
  mode: ProfilingDisplayMode,
  rowId: string,
  selected: boolean,
  expanded: boolean,
): boolean {
  const row = renderedRows(root, mode).find((item) => item.getAttribute("data-row-id") === rowId);
  if (!row || !root) return false;
  const renderedSelected = row.getAttribute("data-selected") === "true";
  const renderedDetail = Array.from(root.querySelectorAll("[data-detail-panel]"))
    .some((item) => item.getAttribute("data-detail-panel") === rowId);
  return renderedSelected === selected && renderedDetail === expanded;
}

/** A stopped or backgrounded profile is BLOCKED, including its final action. */
export function assertProfilingRunActive(cancelled: boolean, visibility: string): void {
  if (cancelled || visibility !== "visible") {
    throw new Error("BLOCKED: cancelled or hidden browser");
  }
}

/** Reject sparse or misordered windows before accepting profiling samples. */
export function hasViewportCoverage(view: HTMLElement | null | undefined, mounted: number, pageSize: number, expectedIds: readonly string[]) {
  if (!view || mounted <= 0 || mounted >= pageSize) return false;
  const rows = Array.from(view.querySelectorAll<HTMLTableRowElement>("tbody tr[data-row-id]"));
  const start = expectedIds.indexOf(rows[0]?.dataset.rowId ?? "");
  if (start < 0 || rows.length !== mounted) return false;
  const boxes = rows.map(row => row.getBoundingClientRect());
  if (!rows.every((row, index) => row.dataset.rowId === expectedIds.at(start + index))) return false;
  if (!boxes.every((box, index) => Number.isFinite(box.height) && box.height > 0 &&
    (index === 0 || Math.abs(box.top - (boxes.at(index - 1)?.bottom ?? NaN)) <= 1))) return false;
  const bounds = view.getBoundingClientRect();
  const headerHeight = view.querySelector("thead")?.getBoundingClientRect().height ?? 0;
  const rowHeight = boxes[0]?.height ?? 0;
  // Integrated windowing requires uniform rows; a tiny outlier must not inflate the limit.
  if (boxes.some(box => Math.abs(box.height - rowHeight) > 1)) return false;
  // Four overscan rows on each side, plus one partially visible row.
  const maximumMounted = Math.ceil(Math.max(0, view.clientHeight - headerHeight) / rowHeight) + 9;
  if (mounted > maximumMounted) return false;
  return (boxes[0]?.top ?? Infinity) <= bounds.top + headerHeight + 1 &&
    (boxes.at(-1)?.bottom ?? -Infinity) >= bounds.top + view.clientHeight - 1;
}
