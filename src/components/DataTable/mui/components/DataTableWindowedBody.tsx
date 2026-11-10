"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { shouldRestoreWindowForTab } from "./windowingFocus";
import type { DataTableDetailPanelRenderer } from "./detail-panel";
import type { DataTableRowClickHandler } from "./DataTableBodyRow";
import { styled, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const ref = useRef<HTMLTableSectionElement>(null);
  const [viewport, setViewport] = useState({ top: 0, height: 0, header: headerHeight });
  const [unsafeHeight, setUnsafeHeight] = useState(false);
  const [unsafeHeader, setUnsafeHeader] = useState(false);
  const headerGroups = table.getHeaderGroups();
  const [measuredHeight, setMeasuredHeight] = useState<number>();
  const itemHeight = measuredHeight ?? rowHeight;
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);
  const focusedControl = useRef<EventTarget | null>(null);

  useLayoutEffect(() => {
    if (!bodyFocused) return undefined;
    /** Releases keyboard fallback when the focused row control or owned portal is disconnected. */
    const releaseRemovedControl = () => {
      if (focusedControl.current instanceof Node && !focusedControl.current.isConnected) {
        focusedControl.current = null;
        setBodyFocused(false);
        setKeyboardMode(false);
      }
    };
    releaseRemovedControl();
    const root = ref.current?.ownerDocument.body;
    if (!root || typeof MutationObserver === "undefined") return undefined;
    const observer = new MutationObserver(releaseRemovedControl);
    observer.observe(root, { childList: true, subtree: true });
    return () => { observer.disconnect(); };
  }, [bodyFocused, rows]);

  useLayoutEffect(() => {
    const body = ref.current;
    if (!body) return undefined;
    const doc = body.ownerDocument;
    /** Restores omitted rows before native Tab navigation can move focus into the body. */
    const prepareTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.defaultPrevented || keyboardMode) return;
      if (shouldRestoreWindowForTab(body, event)) {
        // Native tab order must see every row before the browser moves focus.
        flushSync(() => { setKeyboardMode(true); });
      }
    };
    /** Clears keyboard fallback while the separate focus guard protects active row controls. */
    const resumePointerWindow = () => {
      setKeyboardMode(false);
      // React focus events also cover row-owned portals. Blur releases this guard.
    };
    /** Resumes bounded rendering after keyboard focus leaves the body. */
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
    /** Refreshes viewport and rendered-header geometry after resize, scrolling or relevant style changes. */
    const update = () => {
      const head = ref.current?.closest("table")?.querySelector("thead");
      const headers = head?.querySelectorAll("th");
      const header = head?.getBoundingClientRect().height ?? 0;
      setUnsafeHeader(!headers?.length || !Number.isFinite(header) || header <= 0 ||
        Array.from(headers).some(cell => getComputedStyle(cell).position !== "sticky"));
      const top = container.scrollTop;
      const height = container.clientHeight;
      setViewport(current => current.top === top && current.height === height && current.header === header ? current : { top, height, header });
    };
    update();
    container.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(container);
    const head = ref.current?.closest("table")?.querySelector("thead");
    if (head) observer.observe(head);
    const doc = container.ownerDocument;
    const styleObserver = typeof MutationObserver === "undefined" ? undefined : new MutationObserver(records => {
      if (records.some(record => record.type !== "attributes" || doc.head.contains(record.target) ||
        (head && record.target instanceof Element && (record.target.contains(head) || head.contains(record.target))))) update();
    });
    styleObserver?.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "style"], subtree: true });
    styleObserver?.observe(doc.head, { attributes: true, attributeFilter: ["media", "disabled"], childList: true, characterData: true, subtree: true });
    return () => {
      styleObserver?.disconnect();
      observer.disconnect();
      container.removeEventListener("scroll", update);
    };
  }, [headerGroups, theme]);

  const available = viewport.height > 0
    ? Math.max(0, viewport.height - viewport.header)
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
    /** Synchronizes uniform row heights and falls back when measurements are missing or inconsistent. */
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
      onFocusCapture: event => { focusedControl.current = event.target; setBodyFocused(true); },
      onBlurCapture: event => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          focusedControl.current = null;
          setBodyFocused(false);
        }
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
