"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button, Stack, styled, Table, TableContainer } from "@mui/material";
import { DataTableColumnGroup } from "../../components/DataTableColumnGroup";
import { DataTableHead } from "../../components/DataTableHead";
import { DataTableFilterDisplayProvider } from "../../filter-display";
import { DataTableBodyRowGroup } from "../../components/DataTableBodyRowGroup";
import { DataTableStickyRowMeasurements } from "../../components/DataTableStickyRowMeasurements";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider, getDataTableDensityMetrics } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import type { DataTablePerformanceRow } from "./DataTablePerformanceAcceptance";

const shortRowHeight = 48;
const tallRowHeight = 72;
const pairHeight = shortRowHeight + tallRowHeight;
const viewportHeight = 480;
const overscan = 4;

const noPinnedRows: readonly string[] = [];
const pinFixtures = [
  { id: "2", label: "second record to top", edge: "top" },
  { id: "4", label: "fourth record to top", edge: "top" },
  { id: "199", label: "record 199 to bottom", edge: "bottom" },
] as const;

/** Returns the cumulative offset for the alternating fixed-height fixture rows. */
function rowOffset(index: number) {
  return Math.floor(index / 2) * pairHeight + (index % 2) * shortRowHeight;
}

const detailRecords = [{ id: "1", label: "first" }, { id: "3", label: "third" }] as const;
type DetailHeights = ReadonlyMap<string, number>;

/** Computes row and detail offsets for the profiling-only mixed-height fixture. */
function windowGeometry(rows: readonly { id: string }[], heights: DetailHeights, mixedHeights: boolean) {
  const offsets = [0];
  rows.forEach((row, index) => {
    const height = mixedHeights ? rowOffset(index + 1) - rowOffset(index) : shortRowHeight;
    offsets.push((offsets.at(-1) ?? 0) + height + (heights.get(row.id) ?? 0));
  });
  const indexAt = (pixel: number) => {
    let low = 0;
    let high = rows.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if ((offsets.at(mid + 1) ?? 0) <= pixel) low = mid + 1;
      else high = mid;
    }
    return low;
  };
  return {
    offset: (index: number) => offsets.at(index) ?? 0,
    indexAt,
    range: (scrollTop: number) => ({
      start: Math.max(0, Math.min(rows.length - 1, indexAt(scrollTop)) - overscan),
      end: Math.min(rows.length, indexAt(scrollTop + viewportHeight) + 1 + overscan),
    }),
  };
}

const Viewport = styled(TableContainer)({
  height: viewportHeight,
  overflowAnchor: "none",
});

const WindowTable = styled(Table)({
  tableLayout: "fixed",
  "& tr[data-row-id]": { height: shortRowHeight },
  '& tr:is([aria-rowindex$="0"], [aria-rowindex$="2"], [aria-rowindex$="4"], [aria-rowindex$="6"], [aria-rowindex$="8"])': {
    height: tallRowHeight,
  },
});

const DetailContent = styled("div")(({ theme }) => ({ padding: theme.spacing(2) }));

const SpacerCell = styled("td")({ padding: 0, border: 0 });

/** Isolated scrolling experiment. Live pages use DataTableWindowedBody. */
export function WindowedPerformanceTable({ table, detailControls = false }: {
  readonly table: MuiDataTableInstance<DataTablePerformanceRow>;
  readonly detailControls?: boolean;
}) {
  const headerHeight = detailControls ? table.getHeaderGroups().length * getDataTableDensityMetrics("compact").headerHeight : 0;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [focusRequest, setFocusRequest] = useState<{ id: string } | null>(null);

  const expanded = table.state.expanded;
  const expandedIds = useMemo(() => expanded === true ? undefined : new Map(Object.entries(expanded)), [expanded]);
  const [longDetail, setLongDetail] = useState(false);
  const [detailHeights, setDetailHeights] = useState<DetailHeights>(new Map());
  const previousHeights = useRef<DetailHeights>(new Map());
  const activeHeights = useMemo(() => new Map(
    detailRecords.filter(({ id }) => expanded === true || expandedIds?.get(id) === true).map(({ id }) => [id, detailHeights.get(id) ?? 0]),
  ), [expanded, expandedIds, detailHeights]);

  /** Excludes pinned identities from the scrolling range. */
  function scrollingRows() {
    return detailControls ? table.getCenterRows() : table.getRowModel().rows;
  }

  /** Combines the current final order with cached expanded-detail measurements. */
  function geometry() {
    return windowGeometry(scrollingRows(), activeHeights, !detailControls);
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const previous = previousHeights.current;
    previousHeights.current = activeHeights;
    if (!viewport || previous === activeHeights || !detailControls) return;
    const rows = table.getCenterRows();
    const before = windowGeometry(rows, previous, false);
    const after = windowGeometry(rows, activeHeights, false);
    const anchor = before.indexAt(scrollTop);
    const delta = after.offset(anchor) - before.offset(anchor);
    if (delta) {
      viewport.scrollTop = scrollTop + delta;
      setScrollTop(viewport.scrollTop);
    }
  }, [activeHeights, detailControls, scrollTop, table]);

  /** Tracks content-driven detail-row height changes until the panel unmounts. */
  const observeDetail = useCallback((content: HTMLDivElement | null) => {
    const detail = content?.closest("tr");
    const id = detail?.dataset.detailPanelRow;
    if (!detail || !id) return;
    const measure = () => {
      const height = detail.getBoundingClientRect().height;
      setDetailHeights(previous => previous.get(id) === height ? previous : new Map(previous).set(id, height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(detail);
    return () => { observer.disconnect(); };
  }, []);

  useLayoutEffect(() => {
    if (!focusRequest) return;
    const row = viewportRef.current?.querySelector<HTMLTableRowElement>(
      `tr[data-row-id="${CSS.escape(focusRequest.id)}"]`,
    );
    if (!row) return;
    row.tabIndex = -1;
    row.focus({ preventScroll: true });
  }, [focusRequest]);

  /** Mounts an offscreen keyboard target before transferring focus to its row. */
  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target !== viewport && !target.matches("tr[data-row-id]")) return;
    const rows = scrollingRows();
    if (!rows.length) return;

    const { offset, indexAt } = geometry();
    const firstVisible = indexAt(viewport.scrollTop);
    const pinnedHeight = detailControls ? (table.getTopRows().length + table.getBottomRows().length) * shortRowHeight : 0;
    const page = Math.max(1, viewport.clientHeight - pinnedHeight - headerHeight);
    const current = rows.findIndex(row => row.id === target.dataset.rowId);
    let next: number;
    switch (event.key) {
      case "Home": next = 0; break;
      case "End": next = rows.length - 1; break;
      case "ArrowDown": next = current < 0 ? firstVisible : current + 1; break;
      case "ArrowUp": next = current < 0 ? firstVisible : current - 1; break;
      case "PageDown": next = indexAt(offset(Math.max(firstVisible, current)) + page); break;
      case "PageUp": next = indexAt(Math.max(0, offset(Math.max(firstVisible, current)) - page)); break;
      default: return;
    }
    event.preventDefault();
    const index = Math.max(0, Math.min(rows.length - 1, next));
    const targetRow = rows.at(index);
    if (!targetRow) return;
    const top = offset(index);
    const bottom = top + (detailControls ? shortRowHeight : rowOffset(index + 1) - rowOffset(index));
    if (top < viewport.scrollTop) viewport.scrollTop = top;
    else if (bottom > viewport.scrollTop + page) viewport.scrollTop = bottom - page;
    setScrollTop(viewport.scrollTop);
    setFocusRequest({ id: targetRow.id });
  }

  return <DataTableDensityProvider density="compact">
    <table.AppTable>
      <DataTableAccessibilityProvider>
      <DataTableFilterDisplayProvider showColumnFilters={false}>
      {detailControls && <Stack direction="row" spacing={1}>
        {detailRecords.map(({ id, label }) => {
          const isExpanded = expanded === true || expandedIds?.get(id) === true;
          return <Button key={id} aria-expanded={isExpanded} onClick={() => {
            table.getRow(id, true).toggleExpanded(!isExpanded);
          }}>{isExpanded ? "Collapse" : "Expand"} {label} record</Button>;
        })}
        <Button disabled={expanded !== true && !expandedIds?.get("1")} onClick={() => { setLongDetail(value => !value); }}>{longDetail ? "Show less detail" : "Show more detail"}</Button>
        <table.Subscribe selector={state => state.rowPinning}>
          {() => pinFixtures.map(({ id, label, edge }) => {
            const row = table.getRow(id, true);
            const pinned = row.getIsPinned() === edge;
            return <Button key={id} aria-pressed={pinned} onClick={() => row.pin(pinned ? false : edge)}>
              {pinned ? "Unpin" : "Pin"} {label}
            </Button>;
          })}
        </table.Subscribe>
      </Stack>}
      <Viewport
        ref={viewportRef}
        onKeyDown={moveFocus}
        tabIndex={0}
        aria-label="Performance table scroll viewport"
        onScroll={event => {
          const viewport = event.currentTarget;
          const rows = scrollingRows();
          const { start, end } = geometry().range(viewport.scrollTop);
          const active = viewport.ownerDocument.activeElement;
          const focusedRow = active?.closest("tr[data-row-id]");
          if (focusedRow && viewport.contains(focusedRow)) {
            const index = rows.findIndex(row => row.id === focusedRow.getAttribute("data-row-id"));
            if (index < start || index >= end) {
              viewport.focus({ preventScroll: true });
            }
          }
          setScrollTop(viewport.scrollTop);
        }}
      >
        <table.Subscribe selector={state => ({ sorting: state.sorting, pagination: state.pagination, expanded: state.expanded, rowPinning: state.rowPinning, globalFilter: state.globalFilter, columnFilters: state.columnFilters, columnSizing: state.columnSizing, columnVisibility: state.columnVisibility })}>
          {() => {
            const rows = scrollingRows();
            const columns = table.getVisibleLeafColumns();
            const topRows = detailControls ? table.getTopRows() : [];
            const bottomRows = detailControls ? table.getBottomRows() : [];
            const renderPinned = (pinnedRows: typeof topRows) => {
              const pinnedIds = pinnedRows.map(row => row.id);
              return pinnedRows.map(row => <DataTableBodyRowGroup
                  key={row.id}
                  table={table}
                  row={row}
                  pinnedRowStickyTop={headerHeight}
                  stickyRowPinning
                  dualEdgeStickyRowPinning={false}
                  stickyPinnedRowIds={pinnedIds}
                />);
            };
            const { offset: offsetAt, range } = geometry();
            const { start, end } = range(scrollTop);
            return <WindowTable aria-label="Windowed performance fixture" aria-rowcount={detailControls ? undefined : rows.length} style={{ width: table.getTotalSize() }}>
              <DataTableColumnGroup table={table} />
              {detailControls && <DataTableHead table={table} />}
              <DataTableStickyRowMeasurements enabled={detailControls} top={headerHeight} fallbackHeight={shortRowHeight} dualEdge={false}>
                {renderPinned(topRows)}
                {start > 0 && <tr aria-hidden="true"><SpacerCell colSpan={columns.length} style={{ height: offsetAt(start) }} /></tr>}
                {rows.slice(start, end).map((row, offset) => <DataTableBodyRowGroup
                  key={row.id}
                  ariaRowIndex={detailControls ? undefined : start + offset + 1}
                  table={table}
                  row={row}
                  pinnedRowStickyTop={0}
                  stickyRowPinning={false}
                  dualEdgeStickyRowPinning={false}
                  stickyPinnedRowIds={noPinnedRows}
                  renderDetailPanel={detailControls && detailRecords.some(record => record.id === row.id) ? () => <DetailContent ref={observeDetail}>
                    <p>Detail panel for {row.original.name}</p>
                    {longDetail && row.id === "1" && <><p>Additional fixture content.</p><p>This content changes the measured height.</p><p>End of the expanded detail.</p></>}
                  </DetailContent> : undefined}
                />)}
                {end < rows.length && <tr aria-hidden="true"><SpacerCell colSpan={columns.length} style={{ height: offsetAt(rows.length) - offsetAt(end) }} /></tr>}
                {renderPinned(bottomRows)}
              </DataTableStickyRowMeasurements>
            </WindowTable>;
          }}
        </table.Subscribe>
      </Viewport>
      </DataTableFilterDisplayProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  </DataTableDensityProvider>;
}
