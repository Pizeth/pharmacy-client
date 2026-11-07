"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { DataTableDetailPanelRenderer } from "./detail-panel";
import type { DataTableRowClickHandler } from "./DataTableBodyRow";
import { styled } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { dataTableClasses } from "../styles";
import { DataTableBodyRowGroup } from "./DataTableBodyRowGroup";
import { BodyRoot } from "./DataTableStickyRowMeasurements";

const WindowBody = styled(BodyRoot)({
  "& > tr[data-row-id]": { height: "var(--DataTable-window-row-height)" },
});
const SpacerCell = styled("td")({ padding: 0, border: 0 });
const noPins: readonly string[] = [];
const overscan = 4;
const initialViewportRows = 12;

export function DataTableWindowedBody<TData extends RowData>({
  table, rows, rowHeight, headerHeight, colSpan, interactive, onRowClick, rowClickSelectedOnly, renderDetailPanel,
}: {
  readonly table: MuiDataTableInstance<TData>;
  readonly rows: readonly Row<MuiDataTableFeatures, TData>[];
  readonly rowHeight: number;
  readonly headerHeight: number;
  readonly colSpan: number;
  readonly interactive: boolean;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
  readonly onRowClick?: DataTableRowClickHandler<TData>;
  readonly rowClickSelectedOnly?: boolean;
}) {
  const ref = useRef<HTMLTableSectionElement>(null);
  const [viewport, setViewport] = useState({ top: 0, height: 0 });
  const [unsafeHeight, setUnsafeHeight] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number>();
  const itemHeight = measuredHeight ?? rowHeight;
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);

  useLayoutEffect(() => {
    if (!interactive) return;
    const body = ref.current;
    if (!body) return;
    const doc = body.ownerDocument;
    const prepareTab = (event: KeyboardEvent) => {
      if (event.key === "Tab" && !event.defaultPrevented && !keyboardMode) {
        // Native tab order must see every row before the browser moves focus.
        flushSync(() => setKeyboardMode(true));
      }
    };
    const resumePointerWindow = () => {
      setKeyboardMode(false);
      if (!body.contains(doc.activeElement)) setBodyFocused(false);
    };
    doc.addEventListener("keydown", prepareTab, true);
    doc.addEventListener("pointerdown", resumePointerWindow, true);
    return () => {
      doc.removeEventListener("keydown", prepareTab, true);
      doc.removeEventListener("pointerdown", resumePointerWindow, true);
    };
  }, [interactive, keyboardMode]);

  useLayoutEffect(() => {
    const container = ref.current?.closest<HTMLElement>(`.${dataTableClasses.container}`);
    if (!container || typeof ResizeObserver === "undefined") {
      setUnsafeHeight(true);
      return;
    }
    const update = () => {
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
  }, []);

  const available = viewport.height > 0
    ? Math.max(0, viewport.height - headerHeight)
    : initialViewportRows * itemHeight;
  const canWindow = !unsafeHeight && !renderDetailPanel && (!interactive || (!keyboardMode && !bodyFocused));
  const top = Math.min(viewport.top, Math.max(0, rows.length * itemHeight - available));
  const start = canWindow ? Math.max(0, Math.floor(top / itemHeight) - overscan) : 0;
  const end = canWindow ? Math.min(rows.length, Math.ceil((top + available) / itemHeight) + overscan) : rows.length;

  useLayoutEffect(() => {
    if (!canWindow || typeof ResizeObserver === "undefined") return;
    const body = ref.current;
    if (!body) return;
    const mounted = [...body.querySelectorAll<HTMLTableRowElement>(":scope > tr[data-row-id]")];
    const check = () => {
      const firstHeight = mounted[0]?.getBoundingClientRect().height;
      if (!firstHeight) return;
      const expected = measuredHeight ?? firstHeight;
      if (mounted.some(row => Math.abs(row.getBoundingClientRect().height - expected) > 1)) {
        setUnsafeHeight(true);
      } else if (measuredHeight === undefined) {
        setMeasuredHeight(firstHeight);
      }
    };
    check();
    const observer = new ResizeObserver(check);
    for (const row of mounted) observer.observe(row);
    return () => observer.disconnect();
  }, [canWindow, start, end, rows, measuredHeight]);

  const headerCount = table.getHeaderGroups().length;
  return <WindowBody
    ref={ref}
    onFocusCapture={interactive ? () => setBodyFocused(true) : undefined}
    onBlurCapture={interactive ? event => {
      if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setBodyFocused(false);
    } : undefined}
    className={dataTableClasses.body} style={unsafeHeight || renderDetailPanel ? undefined : { "--DataTable-window-row-height": `${rowHeight}px` } as React.CSSProperties}>
    {start > 0 && <tr aria-hidden="true"><SpacerCell colSpan={colSpan} style={{ height: start * itemHeight }} /></tr>}
    {rows.slice(start, end).map((row, index) => <DataTableBodyRowGroup
      key={row.id}
      table={table}
      row={row}
      onRowClick={onRowClick}
      rowClickSelectedOnly={rowClickSelectedOnly}
      ariaRowIndex={renderDetailPanel ? undefined : headerCount + start + index + 1}
      renderDetailPanel={renderDetailPanel}
      pinnedRowStickyTop={headerHeight}
      stickyRowPinning={false}
      dualEdgeStickyRowPinning={false}
      stickyPinnedRowIds={noPins}
    />)}
    {end < rows.length && <tr aria-hidden="true"><SpacerCell colSpan={colSpan} style={{ height: (rows.length - end) * itemHeight }} /></tr>}
  </WindowBody>;
}
