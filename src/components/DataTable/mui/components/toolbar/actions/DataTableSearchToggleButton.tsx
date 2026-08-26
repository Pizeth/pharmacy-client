// src/components/DataTable/mui/components/toolbar/actions/DataTableSearchToggleButton.tsx

"use client";

import { Badge, IconButton, Tooltip } from "@mui/material";
import { SearchOffOutlined, SearchOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { normalizeDataTableGlobalFilter } from "../../../utils/globalFilter";
import { useDataTableAccessibility } from "../../../accessibility";

export interface DataTableSearchToggleButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly open: boolean;
  readonly onToggle: () => void;
}

/**
 * Toggles only the visibility of the global-search control.
 *
 * Existing globalFilter state remains active when the input is hidden.
 */
export function DataTableSearchToggleButton<TData extends RowData>(
  props: DataTableSearchToggleButtonProps<TData>,
) {
  const { table, open, onToggle } = props;

  const { globalSearchId } = useDataTableAccessibility();

  return (
    <table.Subscribe selector={(state) => state.globalFilter}>
      {(globalFilter) => {
        const normalizedFilter = normalizeDataTableGlobalFilter(globalFilter);

        const active = normalizedFilter.length > 0;

        return (
          <Tooltip title={open ? "Hide search" : "Show search"}>
            <IconButton
              size="small"
              aria-label={open ? "Hide global search" : "Show global search"}
              //   aria-expanded={open}
              //   aria-pressed={open}
              aria-expanded={open}
              aria-controls={open ? globalSearchId : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onToggle();
              }}
            >
              <Badge color="primary" variant="dot" invisible={!active}>
                {open ? (
                  <SearchOffOutlined fontSize="small" />
                ) : (
                  <SearchOutlined fontSize="small" />
                )}
              </Badge>
            </IconButton>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
