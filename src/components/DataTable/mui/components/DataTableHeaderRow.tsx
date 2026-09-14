"use client";

// src/components/DataTable/mui/components/DataTableHeaderRow.tsx

import { styled, TableRow } from "@mui/material";
import type { HeaderGroup, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { MuiDataTableInstance } from "../table";
import { DataTableHeaderCell } from "./DataTableHeaderCell";

export interface DataTableHeaderRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly headerGroup: HeaderGroup<MuiDataTableFeatures, TData>;

  /**
   * Zero-based visual header row position.
   *
   * Used by each physical HeaderCell to calculate its vertical sticky
   * offset.
   */
  readonly headerRowIndex: number;
}

/**
 * ------------------------------------------------------------------
 * HeaderRow structural slot
 * ------------------------------------------------------------------
 *
 * This slot intentionally owns no runtime geometry.
 *
 * Individual HeaderCell instances own:
 *
 * - sticky top
 * - column size
 * - pinned offset
 *
 * HeaderRow exists as a structural MUI theme surface so applications
 * can configure:
 *
 *   theme.components.RazethDataTable.styleOverrides.headerRow
 *
 * without modifying the renderer.
 */
const HeaderRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderRow",
  overridesResolver: (_props, styles) => styles.headerRow,
})({});

/**
 * Render one TanStack header group.
 *
 * Header-group structure remains entirely TanStack-owned.
 *
 * This component only maps the current header group into the physical
 * MUI table row.
 */
export function DataTableHeaderRow<TData extends RowData>(
  props: DataTableHeaderRowProps<TData>,
) {
  const { table, headerGroup, headerRowIndex } = props;

  return (
    <HeaderRowRoot
      className={dataTableClasses.headerRow}
      data-header-group-id={headerGroup.id}
      data-header-row-index={headerRowIndex}
    >
      {headerGroup.headers.map((header) => (
        <DataTableHeaderCell
          key={header.id}
          table={table}
          header={header}
          headerRowIndex={headerRowIndex}
        />
      ))}
    </HeaderRowRoot>
  );
}
