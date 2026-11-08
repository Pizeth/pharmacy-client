"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { DataTableDetailPanelRenderer } from "./detail-panel";
import type { DataTableRowClickHandler } from "./DataTableBodyRow";
import { styled } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import { DataTableBodyRowGroup } from "./DataTableBodyRowGroup";
import { DataTableStickyRowMeasurements } from "./DataTableStickyRowMeasurements";

const SpacerCell = styled("td", {
  name: DATA_TABLE_COMPONENT_NAME, slot: "WindowSpacerCell",
  overridesResolver: (_props, styles) => styles.windowSpacerCell,
})({ padding: 0, border: 0 });
const overscan = 4;
const initialViewportRows = 12;

/** Keeps the same row subtree when pinning or keyboard focus requires a full body. */
export function DataTableWindowedBody<TData extends RowData>({
  table, rows, rowHeight, headerHeight, colSpan, pinned, stickyRowPinning, pinnedRowStickyTop, dualEdgeStickyRowPinning, stickyPinnedRowIds, onRowClick, rowClickSelectedOnly, renderDetailPanel,
}: {
  readonly table: MuiDataTableInstance<TData>;
  readonly rows: readonly Row<MuiDataTableFeatures, TData>[];
  readonly rowHeight: number;
  readonly headerHeight: number;
  readonly colSpan: number;
  readonly pinned: boolean;
  readonly stickyRowPinning: boolean;
  readonly pinnedRowStickyTop: number;
  readonly dualEdgeStickyRowPinning: boolean;
  readonly stickyPinnedRowIds: Readonly<Record<"top" | "bottom", readonly string[]>>;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
  readonly onRowClick?: DataTableRowClickHandler<TData>;
  readonly rowClickSelectedOnly?: boolean;
}) {
  const ref = useRef<HTMLTableSectionElement>(null);
  const [viewport, setViewport] = useState({ top: 0, height: 0 });
  const [unsafeHeight, setUnsafeHeight] = useState(false);
  const [unsafeHeader, setUnsafeHeader] = useState(false);
  const headerGroups = table.getHeaderGroups();
  const [measuredHeight, setMeasuredHeight] = useState<number>();
  const itemHeight = measuredHeight ?? rowHeight;
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);

  useLayoutEffect(() => {
    const body = ref.current;
    if (!body) return undefined;
    const doc = body.ownerDocument;
    const prepareTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.defaultPrevented || keyboardMode) return;
      const target = event.target;
      const container = body.closest(`.${dataTableClasses.container}`);
      const candidates = Array.from(doc.querySelectorAll<HTMLElement>(
        'a[href],button,input,select,textarea,[tabindex],summary',
      )).filter(element => element.tabIndex >= 0 && !element.matches(":disabled") &&
        !element.closest('[hidden],[inert],[aria-hidden="true"]') &&
        getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden")
        .sort((a, b) => (a.tabIndex || Number.MAX_SAFE_INTEGER) - (b.tabIndex || Number.MAX_SAFE_INTEGER));
      const stops = candidates.filter(element => {
        if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
        const group = candidates.filter((candidate): candidate is HTMLInputElement =>
          candidate instanceof HTMLInputElement && candidate.type === "radio" &&
          candidate.name === element.name && candidate.form === element.form &&
          candidate.getRootNode() === element.getRootNode());
        const selected = group.find(radio => radio.checked);
        return element === (selected ?? (event.shiftKey ? group.at(-1) : group.at(0)));
      });
      const current = stops.findIndex(element => element === doc.activeElement);
      const nextIndex = current < 0 ? (event.shiftKey ? stops.length - 1 : 0) : current + (event.shiftKey ? -1 : 1);
      const next = nextIndex < 0 ? undefined : stops.at(nextIndex);
      if ((target instanceof Node && container?.contains(target)) || (next && body.contains(next))) {
        // Native tab order must see every row before the browser moves focus.
        flushSync(() => { setKeyboardMode(true); });
      }
    };
    const resumePointerWindow = () => {
      setKeyboardMode(false);
      // React focus events also cover row-owned portals. Blur releases this guard.
    };
    const releaseOutsideKeyboardMode = (event: FocusEvent) => {
      if (event.target instanceof Node && !body.contains(event.target)) setKeyboardMode(false);
    };
    doc.addEventListener("focusin", releaseOutsideKeyboardMode, true);
    doc.addEventListener("keydown", prepareTab, true);
    doc.addEventListener("pointerdown", resumePointerWindow, true);
    return () => {
      doc.removeEventListener("focusin", releaseOutsideKeyboardMode, true);
      doc.removeEventListener("keydown", prepareTab, true);
      doc.removeEventListener("pointerdown", resumePointerWindow, true);
    };
  }, [keyboardMode]);

  useLayoutEffect(() => {
    const container = ref.current?.closest<HTMLElement>(`.${dataTableClasses.container}`);
    if (!container || typeof ResizeObserver === "undefined") {
      setUnsafeHeight(true);
      return undefined;
    }
    const update = () => {
      const headers = ref.current?.closest("table")?.querySelectorAll("thead th");
      setUnsafeHeader(!headers?.length || Array.from(headers).some(cell => getComputedStyle(cell).position !== "sticky"));
      const top = container.scrollTop;
      const height = container.clientHeight;
      setViewport(current => current.top === top && current.height === height ? current : { top, height });
    };
    update();
    container.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", update);
    };
  }, [headerGroups]);

  const available = viewport.height > 0
    ? Math.max(0, viewport.height - headerHeight)
    : initialViewportRows * itemHeight;
  const canWindow = rows.length > 25 && !unsafeHeight && !unsafeHeader && !pinned && !renderDetailPanel && !keyboardMode && !bodyFocused;
  const top = Math.min(viewport.top, Math.max(0, rows.length * itemHeight - available));
  const start = canWindow ? Math.max(0, Math.floor(top / itemHeight) - overscan) : 0;
  const end = canWindow ? Math.min(rows.length, Math.ceil((top + available) / itemHeight) + overscan) : rows.length;

  useLayoutEffect(() => {
    if (!canWindow || typeof ResizeObserver === "undefined") return undefined;
    const body = ref.current;
    if (!body) return undefined;
    const mounted = [...body.querySelectorAll<HTMLTableRowElement>(":scope > tr[data-row-id]")];
    const check = () => {
      // Empty headers can temporarily yield zero-height rows; header safety is recoverable.
      if (!body.closest("table")?.querySelector("thead th")) return;
      const firstHeight = mounted[0]?.getBoundingClientRect().height;
      if (!firstHeight || !Number.isFinite(firstHeight)) {
        setUnsafeHeight(true);
        return;
      }
      const expected = measuredHeight ?? firstHeight;
      if (mounted.some(row => Math.abs(row.getBoundingClientRect().height - expected) > 1)) {
        setUnsafeHeight(true);
      } else if (measuredHeight !== firstHeight) {
        setMeasuredHeight(firstHeight);
      }
    };
    check();
    const observer = new ResizeObserver(check);
    for (const row of mounted) observer.observe(row);
    return () => { observer.disconnect(); };
  }, [canWindow, start, end, rows, measuredHeight]);

  const useWindowRowHeight = rows.length > 25 && !unsafeHeight && !unsafeHeader && !pinned && !renderDetailPanel;
  const headerCount = headerGroups.length;
  return <DataTableStickyRowMeasurements
    forwardedRef={ref}
    enabled={pinned && stickyRowPinning}
    top={pinnedRowStickyTop}
    fallbackHeight={rowHeight}
    dualEdge={dualEdgeStickyRowPinning}
    bodyProps={{
      "data-window-row-height": useWindowRowHeight ? true : undefined,
      onFocusCapture: () => { setBodyFocused(true); },
      onBlurCapture: event => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setBodyFocused(false);
      },
      style: useWindowRowHeight ? { "--DataTable-window-row-height": `${rowHeight}px` } as React.CSSProperties : undefined,
    }}>
    {start > 0 && <tr aria-hidden="true"><SpacerCell colSpan={colSpan} style={{ height: start * itemHeight }} /></tr>}
    {rows.slice(start, end).map((row, index) => <DataTableBodyRowGroup
      key={row.id}
      table={table}
      row={row}
      onRowClick={onRowClick}
      rowClickSelectedOnly={rowClickSelectedOnly}
      ariaRowIndex={pinned || renderDetailPanel ? undefined : headerCount + start + index + 1}
      renderDetailPanel={renderDetailPanel}
      pinnedRowStickyTop={pinnedRowStickyTop}
      stickyRowPinning={stickyRowPinning}
      dualEdgeStickyRowPinning={dualEdgeStickyRowPinning}
      stickyPinnedRowIds={stickyPinnedRowIds[row.getIsPinned() || "top"]}
    />)}
    {end < rows.length && <tr aria-hidden="true"><SpacerCell colSpan={colSpan} style={{ height: (rows.length - end) * itemHeight }} /></tr>}
  </DataTableStickyRowMeasurements>;
}
