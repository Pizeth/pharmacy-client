"use client";

import { Box, styled } from "@mui/material";
import type { Breakpoint } from "@mui/material/styles";
import type { RowData } from "@tanstack/table-core";

import { useDataTableAccessibility } from "../../accessibility";
import { useDataTableFilterDisplay } from "../../filter-display";
import { useDataTableResolvedDisplayMode } from "../../presentation";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../styles";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnFilter } from "../filtering";

const ToolbarCardFiltersRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarCardFilters",
  overridesResolver: (_props, styles) => styles.toolbarCardFilters,
})(({ theme }) => ({
  width: "100%",
  minWidth: 0,
  paddingTop: theme.spacing(0.5),
}));

const ToolbarCardFilterGridRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarCardFilterGrid",
  overridesResolver: (_props, styles) => styles.toolbarCardFilterGrid,
})(({ theme }) => ({
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: theme.spacing(1),
  width: "100%",
  minWidth: 0,
}));

const ToolbarCardFilterFieldRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarCardFilterField",
  overridesResolver: (_props, styles) => styles.toolbarCardFilterField,
})({
  minWidth: 0,
});

export interface DataTableToolbarCardFilterPanelProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly autoCardBreakpoint?: Breakpoint;
}

/**
 * Column-filter surface for card presentation.
 *
 * The table renderer puts "subheader" filters inside DataTableHead. Cards have
 * no physical header, so this surface reuses the same DataTableColumnFilter
 * editors and writes the same TanStack columnFilters state from the toolbar.
 */
export function DataTableToolbarCardFilterPanel<TData extends RowData>(
  props: DataTableToolbarCardFilterPanelProps<TData>,
) {
  const { table, autoCardBreakpoint } = props;
  const resolvedDisplayMode =
    useDataTableResolvedDisplayMode(autoCardBreakpoint);
  const { columnFilterDisplayMode, showColumnFilters } =
    useDataTableFilterDisplay();
  const { filterRowId } = useDataTableAccessibility();

  if (
    resolvedDisplayMode !== "card" ||
    columnFilterDisplayMode !== "subheader" ||
    !showColumnFilters
  ) {
    return null;
  }

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnFilters: state.columnFilters,
      })}
    >
      {() => {
        const filterableColumns = table
          .getVisibleLeafColumns()
          .filter((column) => column.getCanFilter());

        if (filterableColumns.length === 0) {
          return null;
        }

        return (
          <ToolbarCardFiltersRoot
            id={filterRowId}
            className={dataTableClasses.toolbarCardFilters}
            role="region"
            aria-label="Column filters"
          >
            <ToolbarCardFilterGridRoot
              className={dataTableClasses.toolbarCardFilterGrid}
            >
              {filterableColumns.map((column) => (
                <ToolbarCardFilterFieldRoot
                  key={column.id}
                  className={dataTableClasses.toolbarCardFilterField}
                  data-column-id={column.id}
                >
                  <DataTableColumnFilter column={column} />
                </ToolbarCardFilterFieldRoot>
              ))}
            </ToolbarCardFilterGridRoot>
          </ToolbarCardFiltersRoot>
        );
      }}
    </table.Subscribe>
  );
}
