"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";

import type { DataTableDetailPanelRenderer } from "../../components/detail-panel";
import { normalizeDataTableGlobalFilter } from "../../components/utils";
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

import type {
  DataTableCardConfig,
  DataTableCardRenderContext,
} from "./types";

const CardContainerRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardContainer",
  overridesResolver: (_props, styles) => styles.cardContainer,
})(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
  alignItems: "start",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  minWidth: 0,
}));

const CardItemRoot = styled(Paper, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardItem",
  overridesResolver: (_props, styles) => styles.cardItem,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
  backgroundImage: "none",
  '&[data-selected="true"]': {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: -2,
  },
}));

const CardHeaderRoot = styled("header", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardHeader",
  overridesResolver: (_props, styles) => styles.cardHeader,
})(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  minWidth: 0,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

const CardHeaderContentRoot = styled("div")({
  flex: 1,
  minWidth: 0,
});

const CardSelectionRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardSelection",
  overridesResolver: (_props, styles) => styles.cardSelection,
})({
  display: "inline-flex",
  flexShrink: 0,
});

const CardBodyRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardBody",
  overridesResolver: (_props, styles) => styles.cardBody,
})(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 0,
}));

const CardMetadataRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardMetadata",
  overridesResolver: (_props, styles) => styles.cardMetadata,
})(({ theme }) => ({
  padding: theme.spacing(0, 2, 2),
  minWidth: 0,
}));

const CardActionsRoot = styled("footer", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardActions",
  overridesResolver: (_props, styles) => styles.cardActions,
})(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

const CardExpansionRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardExpansion",
  overridesResolver: (_props, styles) => styles.cardExpansion,
})(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2, 1),
}));

const CardDetailRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardDetail",
  overridesResolver: (_props, styles) => styles.cardDetail,
})(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  minWidth: 0,
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

function hasRenderableContent(content: ReactNode): boolean {
  return content !== null && content !== undefined && content !== false;
}

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
            role="list"
            data-density={density}
          >
            {rows.map((row) => {
              const context: DataTableCardRenderContext<TData> = {
                table,
                row,
              };

              const selected = Boolean(state.rowSelection?.[row.id]);

              const selection = config.renderSelection?.(context);
              const header = config.renderHeader?.(context);
              const body = config.renderBody(context);
              const metadata = config.renderMetadata?.(context);
              const actions = config.renderActions?.(context);
              const expansion = config.renderExpansion?.(context);

              const detailRenderer =
                config.renderDetail ?? renderDetailPanel;

              const detail =
                row.getIsExpanded() && detailRenderer
                  ? detailRenderer(context)
                  : undefined;

              const showHeader =
                hasRenderableContent(selection) ||
                hasRenderableContent(header);

              return (
                <CardItemRoot
                  key={row.id}
                  component="article"
                  variant="outlined"
                  className={dataTableClasses.cardItem}
                  role="listitem"
                  data-row-id={row.id}
                  data-selected={selected ? "true" : undefined}
                  data-density={density}
                >
                  {showHeader && (
                    <CardHeaderRoot className={dataTableClasses.cardHeader}>
                      {hasRenderableContent(selection) && (
                        <CardSelectionRoot
                          className={dataTableClasses.cardSelection}
                        >
                          {selection}
                        </CardSelectionRoot>
                      )}

                      {hasRenderableContent(header) && (
                        <CardHeaderContentRoot>
                          {header}
                        </CardHeaderContentRoot>
                      )}
                    </CardHeaderRoot>
                  )}

                  <CardBodyRoot className={dataTableClasses.cardBody}>
                    {body}
                  </CardBodyRoot>

                  {hasRenderableContent(metadata) && (
                    <CardMetadataRoot
                      className={dataTableClasses.cardMetadata}
                    >
                      {metadata}
                    </CardMetadataRoot>
                  )}

                  {hasRenderableContent(expansion) && (
                    <CardExpansionRoot
                      className={dataTableClasses.cardExpansion}
                    >
                      {expansion}
                    </CardExpansionRoot>
                  )}

                  {hasRenderableContent(detail) && (
                    <CardDetailRoot
                      className={dataTableClasses.cardDetail}
                      role="region"
                      data-detail-panel={row.id}
                    >
                      {detail}
                    </CardDetailRoot>
                  )}

                  {hasRenderableContent(actions) && (
                    <CardActionsRoot className={dataTableClasses.cardActions}>
                      {actions}
                    </CardActionsRoot>
                  )}
                </CardItemRoot>
              );
            })}
          </CardContainerRoot>
        );
      }}
    </table.Subscribe>
  );
}
