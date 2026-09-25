// src/components/DataTable/mui/components/selection/DataTableSelectionBar.tsx

"use client";

import { Box, Button, Divider, Stack, Typography, styled } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableBulkActions } from "./DataTableBulkActions";

import {
  getDataTableSelectedRowIds,
  getDataTableSelectedRows,
} from "./selectedRows";

import type {
  DataTableSelectionBarConfig,
  DataTableSelectionContext,
} from "./types";

const SelectionBarRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBar",
  overridesResolver: (_props, styles) => styles.selectionBar,
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  minHeight: 52,
  backgroundColor: (theme.vars ?? theme).palette.action.selected,
  flexWrap: "wrap",

  /**
   * Embedded mode is used by the shared bottom footer.
   *
   * The pagination/footer shell owns padding, divider and minimum
   * height there. Selection remains responsible only for its live
   * status and bulk commands.
   */
  '&[data-embedded="true"]': {
    flex: "0 1 auto",
    justifyContent: "flex-start",
    gap: theme.spacing(0.5),
    minHeight: 0,
    padding: 0,
    backgroundColor: "transparent",

    /**
     * MRT keeps the selected-row information and mutation commands as one
     * compact inline cluster in its bottom toolbar.
     *
     * SelectionBarStart normally grows in standalone mode so the status can
     * separate from trailing content. Inside PaginationStart that growth is
     * counterproductive: it consumes the remaining footer width and pushes
     * Edit/Delete/Clear away from the selected-row information.
     *
     * Embedded mode therefore keeps the start group content-sized while the
     * outer PaginationStart remains responsible for occupying the available
     * footer space and keeping pagination controls at the logical end.
     */
    [`& .${dataTableClasses.selectionBarStart}`]: {
      flex: "0 1 auto",
    },
  },
}));
const SelectionBarDividerRoot = styled(Divider, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarDivider",
  overridesResolver: (_props, styles) => styles.selectionBarDivider,
})({});
const SelectionBarStartRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarStart",
  overridesResolver: (_props, styles) => styles.selectionBarStart,
})({ minWidth: 0, flex: "1 1 auto", flexWrap: "wrap" });
const SelectionBarEndRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarEnd",
  overridesResolver: (_props, styles) => styles.selectionBarEnd,
})({ minWidth: 0, flexWrap: "wrap" });
const SelectionBarStatusRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarStatus",
  overridesResolver: (_props, styles) => styles.selectionBarStatus,
})({ whiteSpace: "nowrap" });
const SelectionClearButtonRoot = styled(Button, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionClearButton",
  overridesResolver: (_props, styles) => styles.selectionClearButton,
})({});

export interface DataTableSelectionBarProps<
  TData extends RowData,
> extends DataTableSelectionBarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Internal layout mode used when selection content shares the
   * pagination/footer row.
   *
   * This is intentionally not part of DataTableSelectionBarConfig:
   * consumers configure behavior, while DataTable owns composition.
   */
  readonly embedded?: boolean;
}

/**
 * High-level status and bulk-action surface for TanStack row selection.
 *
 * No independent selection state is stored here.
 */
export function DataTableSelectionBar<TData extends RowData>(
  props: DataTableSelectionBarProps<TData>,
) {
  const {
    table,
    actions = [],
    clearable = true,
    startContent,
    renderStartContent,
    endContent,
    renderEndContent,
    embedded = false,
  } = props;

  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {(rowSelection) => {
        const selectedRowIds = getDataTableSelectedRowIds(rowSelection);

        const selectedCount = selectedRowIds.length;

        /**
         * The selection bar should not consume vertical space while
         * no rows are selected.
         */
        if (selectedCount === 0) {
          return null;
        }

        const selectedRows = getDataTableSelectedRows(table, selectedRowIds);

        const context: DataTableSelectionContext<TData> = {
          table,
          selectedRowIds,
          selectedRows,
          selectedCount,
        };

        const renderedStartContent = renderStartContent
          ? renderStartContent(context)
          : startContent;

        const renderedEndContent = renderEndContent
          ? renderEndContent(context)
          : endContent;

        return (
          <>
            {!embedded && (
              <SelectionBarDividerRoot
                className={dataTableClasses.selectionBarDivider}
              />
            )}

            <SelectionBarRoot
              className={dataTableClasses.selectionBar}
              data-selection-bar="true"
              data-embedded={embedded ? "true" : undefined}
            >
              {/**
               * LEFT SIDE
               *
               * selected status + application content
               */}
              <SelectionBarStartRoot
                className={dataTableClasses.selectionBarStart}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <SelectionBarStatusRoot
                  className={dataTableClasses.selectionBarStatus}
                  variant="body2"
                  fontWeight={600}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {selectedCount === 1
                    ? "1 row selected"
                    : `${selectedCount} rows selected`}
                </SelectionBarStatusRoot>

                {renderedStartContent}
              </SelectionBarStartRoot>

              {/**
               * RIGHT SIDE
               *
               * custom content + application bulk actions + clear
               */}
              <SelectionBarEndRoot
                className={dataTableClasses.selectionBarEnd}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                {renderedEndContent}

                <DataTableBulkActions<TData>
                  actions={actions}
                  context={context}
                />

                {clearable && (
                  <SelectionClearButtonRoot
                    className={dataTableClasses.selectionClearButton}
                    size="small"
                    color="inherit"
                    aria-label="Clear all selected rows"
                    startIcon={<CloseOutlined fontSize="small" />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      table.setRowSelection({});
                    }}
                  >
                    Clear
                  </SelectionClearButtonRoot>
                )}
              </SelectionBarEndRoot>
            </SelectionBarRoot>
          </>
        );
      }}
    </table.Subscribe>
  );
}
