"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { styled, TableBody } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import { getStickyRowOffsets } from "../row-pinning/stickyHeights";

interface Props {
  readonly children: ReactNode;
  readonly enabled?: boolean;
  readonly top: number;
  readonly fallbackHeight: number;
  readonly dualEdge: boolean;
}

export const BodyRoot = styled(TableBody, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Body",
  overridesResolver: (_props, styles) => styles.body,
})({});

/** Renderer geometry only. TanStack remains the sole owner of pin identity/order. */
export function DataTableStickyRowMeasurements({
  children, enabled = true, top, fallbackHeight, dualEdge,
}: Props) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const heightsRef = useRef(new Map<HTMLTableRowElement, number>());
  useLayoutEffect(() => () => heightsRef.current.clear(), []);
  // Reconcile after every parent commit: sorting/filtering/paging may replace or
  // reorder the mounted rows even when TanStack's pin arrays are unchanged.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const heights = heightsRef.current;
    if (!body || !enabled) {
      heights.clear();
      return;
    }
    const rows = Array.from(body.querySelectorAll<HTMLTableRowElement>(
      ':scope > tr[data-row-pinning-sticky="true"]',
    ));
    const mounted = new Set(rows);
    for (const row of heights.keys()) {
      if (!mounted.has(row)) heights.delete(row);
    }
    if (!rows.length) return;
    const readHeight = (row: HTMLTableRowElement) => {
      const height = row.getBoundingClientRect().height;
      return Number.isFinite(height) && height > 0 ? height : undefined;
    };
    // One initial layout read per relevant row, never on scroll or in render.
    for (const row of rows) {
      if (!heights.has(row)) {
        const height = readHeight(row);
        if (height !== undefined) heights.set(row, height);
      }
    }
    const apply = () => {
      const offsets = getStickyRowOffsets(rows.map((row) => ({
        id: row.dataset.rowId!,
        edge: row.dataset.rowPinned === "bottom" ? "bottom" : "top",
        height: heights.get(row) ?? fallbackHeight,
      })), top, dualEdge);
      for (const row of rows) {
        const offset = offsets.get(row.dataset.rowId!);
        if (!offset) continue;
        const set = (name: string, value: number) => {
          const next = `${value}px`;
          if (row.style.getPropertyValue(name) !== next) row.style.setProperty(name, next);
        };
        set("--DataTable-row-pinned-offset", offset.offset);
        if (offset.bottom !== undefined) set("--DataTable-row-pinned-bottom-offset", offset.bottom);
      }
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    let active = true;
    const observer = new ResizeObserver((entries) => {
      if (!active) return;
      let changed = false;
      for (const entry of entries) {
        const row = rows.find((candidate) => candidate === entry.target);
        if (!row || !row.isConnected) continue;
        // Border-box block size is physical vertical height in the table's
        // horizontal writing mode, including RTL. Modern observers need no
        // layout read; older implementations fall back only on notification.
        const observedHeight = entry.borderBoxSize?.[0]?.blockSize;
        const height = observedHeight !== undefined && Number.isFinite(observedHeight) && observedHeight > 0
          ? observedHeight
          : readHeight(row);
        if (height === undefined) {
          if (heights.delete(row)) changed = true;
        } else if (heights.get(row) !== height) {
          heights.set(row, height);
          changed = true;
        }
      }
      // Sticky offsets do not affect row size, so this cannot feed a resize loop.
      if (changed) apply();
    });
    for (const row of rows) observer.observe(row, { box: "border-box" });
    return () => {
      active = false;
      observer.disconnect();
    };
  });
  return <BodyRoot ref={bodyRef} className={dataTableClasses.body}>{children}</BodyRoot>;
}
