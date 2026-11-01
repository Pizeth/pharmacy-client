"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataTableDiagnosticCommit, useDataTableRenderDiagnostics } from "../../diagnostics/renderDiagnostics";
import type { RowData } from "@tanstack/table-core";

import type { DataTableDetailPanelRenderer } from "../../components/detail-panel";
import { normalizeDataTableGlobalFilter } from "../../utils";
import { useDataTableDensity } from "../../density";
import {
  getDataTableRowsForPinningDisplay,
  type DataTableRowPinningDisplayMode,
} from "../../row-pinning";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../styles";
import type { MuiDataTableInstance } from "../../table";

import { DataTableCardItem } from "./DataTableCardItem";
import type { DataTableCardConfig } from "./types";

const CardContainerRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardContainer",
  overridesResolver: (_props, styles) => styles.cardContainer,
})({
  /**
   * Card mode needs the same ownership model as table mode:
   *
   *   flex viewport -> intrinsic presentation content
   *
   * Do not make the scroll viewport itself a CSS grid. When a grid is also a
   * shrinkable flex item, browser track sizing can compress implicit rows
   * against the bounded viewport and visually stack cards on top of each
   * other. The outer slot owns scrolling; CardGrid owns layout.
   */
  flex: "1 1 auto",
  minWidth: 0,
  minHeight: 0,
  overflow: "auto",
});

const CardGridRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardGrid",
  overridesResolver: (_props, styles) => styles.cardGrid,
})(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
  '&[data-compact="true"]': {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
  gridAutoRows: "max-content",
  alignItems: "start",
  alignContent: "start",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  minWidth: 0,
  minHeight: "min-content",
}));

const CardStateRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardState",
  overridesResolver: (_props, styles) => styles.cardState,
})(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: 180,
  padding: theme.spacing(4),
}));

const CardLoadingStateRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "LoadingState",
  overridesResolver: (_props, styles) => styles.loadingState,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const CardEmptyStateRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "EmptyState",
  overridesResolver: (_props, styles) => styles.emptyState,
})(({ theme }) => ({
  color: (theme.vars ?? theme).palette.text.secondary,
  textAlign: "center",
}));

const CardErrorStateRoot = styled(Alert, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ErrorState",
  overridesResolver: (_props, styles) => styles.errorState,
})({});

export interface DataTableCardViewProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly config: DataTableCardConfig<TData>;
  readonly rowPinningDisplayMode: DataTableRowPinningDisplayMode;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
}

/**
 * Generic card renderer over the table's already-resolved row model.
 *
 * It never creates, transforms, or refetches resource data.
 */
export function DataTableCardView<TData extends RowData>(
  props: DataTableCardViewProps<TData>,
) {
  const {
    table,
    config,
    rowPinningDisplayMode,
    renderDetailPanel,
  } = props;

  const { density } = useDataTableDensity();
  const diagnostics = useDataTableRenderDiagnostics();

  return (
    <table.Subscribe
      selector={(state) => ({
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        rowSelection: state.rowSelection,
        expanded: state.expanded,
        rowPinning: state.rowPinning,
      })}
    >
      {(state) => {
        const rows = getDataTableRowsForPinningDisplay(
          table,
          rowPinningDisplayMode,
        );

        const meta = table.options.meta;

        const hasActiveFilters =
          state.columnFilters.length > 0 ||
          normalizeDataTableGlobalFilter(state.globalFilter).length > 0;

        if (meta?.error) {
          return (
            <CardStateRoot className={dataTableClasses.cardState}>
              <CardErrorStateRoot
                className={dataTableClasses.errorState}
                severity="error"
                role="alert"
                aria-live="assertive"
              >
                {meta.error}
              </CardErrorStateRoot>
            </CardStateRoot>
          );
        }

        if (meta?.loading) {
          return (
            <CardStateRoot className={dataTableClasses.cardState}>
              <CardLoadingStateRoot
                className={dataTableClasses.loadingState}
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <CircularProgress size={28} />
                {meta.loadingContent ?? (
                  <Typography variant="body2">Loading…</Typography>
                )}
              </CardLoadingStateRoot>
            </CardStateRoot>
          );
        }

        if (rows.length === 0) {
          return (
            <CardStateRoot className={dataTableClasses.cardState}>
              <CardEmptyStateRoot
                className={dataTableClasses.emptyState}
                role="status"
                aria-live="polite"
                data-filtered={hasActiveFilters ? "true" : undefined}
              >
                {hasActiveFilters
                  ? meta?.noResultsContent ?? "No matching rows"
                  : meta?.emptyContent ?? "No rows to display"}
              </CardEmptyStateRoot>
            </CardStateRoot>
          );
        }

        return (
          <CardContainerRoot
            className={dataTableClasses.cardContainer}
            data-density={density}
          >
            <CardGridRoot
              className={dataTableClasses.cardGrid}
              role="list"
              data-compact={config.compactCard ? "true" : undefined}
            >
            {diagnostics && <DataTableDiagnosticCommit layer="body" id="card-body" />}
            {rows.map((row) => {
              return <DataTableCardItem key={row.id} row={row} config={config}
                renderDetailPanel={renderDetailPanel} />;
            })}
            </CardGridRoot>
          </CardContainerRoot>
        );
      }}
    </table.Subscribe>
  );
}
