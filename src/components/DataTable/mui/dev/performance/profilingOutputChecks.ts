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
