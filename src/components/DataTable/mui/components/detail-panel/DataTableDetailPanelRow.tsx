"use client";

// src/components/DataTable/mui/components/detail-panel/DataTableDetailPanelRow.tsx

import { Box, styled, TableCell, TableRow } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import { useDataTableAccessibility } from "../../accessibility";
import type { MuiDataTableFeatures } from "../../features";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { MuiDataTableInstance } from "../../table";
import type { DataTableDetailPanelRenderer } from "./types";

/**
 * ------------------------------------------------------------------
 * DetailPanelRow
 * ------------------------------------------------------------------
 *
 * Physical table row containing one expanded detail panel.
 *
 * This is intentionally separate from BodyRow:
 *
 * - it does not represent one TanStack data-row presentation surface
 * - it does not own row hover/selection styling
 * - it does not participate in normal body-cell pinning
 * - it spans the complete visible table width
 */
const DetailPanelRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "DetailPanelRow",
  overridesResolver: (_props, styles) => styles.detailPanelRow,
})(({ theme }) => ({
  /**
   * Preserve the previous explicit row background.
   *
   * This prevents surrounding container/background presentation from
   * leaking through custom detail content.
   */
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));

/**
 * ------------------------------------------------------------------
 * DetailPanelCell
 * ------------------------------------------------------------------
 *
 * One native table cell spanning every currently visible leaf column.
 *
 * Detail content deliberately does NOT inherit ordinary BodyCell:
 *
 * - nowrap
 * - ellipsis
 * - TanStack column width
 * - pinned offsets
 * - density cell padding
 */
const DetailPanelCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "DetailPanelCell",
  overridesResolver: (_props, styles) => styles.detailPanelCell,
})(({ theme }) => ({
  padding: 0,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,

  /**
   * Detail content must be allowed to wrap naturally and may
   * contain arbitrary application UI.
   */
  whiteSpace: "normal",

  overflow: "visible",
}));

/**
 * ------------------------------------------------------------------
 * DetailPanel
 * ------------------------------------------------------------------
 *
 * Semantic region containing application-defined detail content.
 *
 * Accessibility:
 *
 *   expansion button
 *       aria-controls
 *            ↓
 *       DetailPanel id
 *
 *   DetailPanel
 *       aria-labelledby
 *            ↓
 *       expansion button id
 */
const DetailPanelRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "DetailPanel",
  overridesResolver: (_props, styles) => styles.detailPanel,
})({
  width: "100%",
  minWidth: 0,
});

export interface DataTableDetailPanelRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly renderDetailPanel: DataTableDetailPanelRenderer<TData>;
}

/**
 * Full-width renderer-owned detail panel beneath an expanded row.
 *
 * This is distinct from TanStack subRows.
 *
 * Ownership remains:
 *
 * TanStack:
 *   - expanded state
 *   - row identity
 *   - visible-column state
 *
 * MUI DataTable:
 *   - native detail row/cell
 *   - accessibility relationship
 *   - presentation slots
 *
 * Application:
 *   - detail-panel content
 */
export function DataTableDetailPanelRow<TData extends RowData>(
  props: DataTableDetailPanelRowProps<TData>,
) {
  const { table, row, renderDetailPanel } = props;

  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();

  const expandButtonId = getExpandButtonId(row.id);

  const detailPanelId = getDetailPanelId(row.id);

  return (
    <table.Subscribe
      selector={(state) => ({
        /**
         * colSpan depends on currently visible leaf columns.
         */
        columnVisibility: state.columnVisibility,

        /**
         * Keep the existing subscription contract intact in 6E.4.
         *
         * Pinning does not currently alter colSpan, but removing this
         * dependency is an optimization/audit concern rather than part
         * of the presentation migration.
         */
        columnPinning: state.columnPinning,

        /**
         * The row exists only while TanStack considers it expanded.
         */
        expanded: state.expanded,
      })}
    >
      {() => {
        /**
         * Important:
         *
         * Do not invoke application detail renderers for collapsed
         * rows.
         */
        if (!row.getIsExpanded()) {
          return null;
        }

        const visibleColumnCount = table.getVisibleLeafColumns().length;

        /**
         * Native colSpan must never be zero.
         *
         * This mirrors the same defensive invariant used by body-wide
         * loading/error/empty states.
         */
        const colSpan = Math.max(1, visibleColumnCount);

        const content = renderDetailPanel({
          table,
          row,
        });

        /**
         * React renderers commonly use false/null/undefined to mean
         * "render nothing".
         *
         * Preserve the existing contract exactly.
         *
         * Values such as:
         *
         *   0
         *   ""
         *
         * remain valid renderable content.
         */
        if (content === null || content === undefined || content === false) {
          return null;
        }

        return (
          <DetailPanelRowRoot
            className={dataTableClasses.detailPanelRow}
            data-detail-panel-row={row.id}
          >
            <DetailPanelCellRoot
              className={dataTableClasses.detailPanelCell}
              colSpan={colSpan}
            >
              <DetailPanelRoot
                className={dataTableClasses.detailPanel}
                id={detailPanelId}
                role="region"
                aria-labelledby={expandButtonId}
                data-detail-panel={row.id}
              >
                {content}
              </DetailPanelRoot>
            </DetailPanelCellRoot>
          </DetailPanelRowRoot>
        );
      }}
    </table.Subscribe>
  );
}
