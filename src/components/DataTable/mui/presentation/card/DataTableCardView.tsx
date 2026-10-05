"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";

import type { DataTableDetailPanelRenderer } from "../../components/detail-panel";
import { DataTableRowActions } from "../../columns/actions";
import { useDataTableAccessibility } from "../../accessibility";
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

import {
  CardActionsRoot,
  CardBodyRoot,
  CardDetailRoot,
  CardExpansionRoot,
  CardHeaderContentRoot,
  CardHeaderRoot,
  CardItemRoot,
  CardMetadataRoot,
  CardSelectionRoot,
  hasRenderableContent,
} from "./cardSlots";
import { DataTableCardExpandRowButton } from "./DataTableCardExpandRowButton";
import { DataTableCardFlipItem } from "./DataTableCardFlipItem";
import { DataTableCardSelectRowCheckbox } from "./DataTableCardSelectRowCheckbox";
import type {
  DataTableCardConfig,
  DataTableCardRenderContext,
} from "./types";

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

  const {
    getExpandButtonId,
    getDetailPanelId,
  } = useDataTableAccessibility();

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
            >
            {rows.map((row) => {
              const context: DataTableCardRenderContext<TData> = {
                table,
                row,
              };

              const selected = Boolean(state.rowSelection?.[row.id]);

              const selection =
                config.renderSelection?.(context) ??
                (config.enableSelection ? (
                  <DataTableCardSelectRowCheckbox
                    row={row}
                  />
                ) : undefined);

              const header = config.renderHeader?.(context);
              const body = config.renderBody(context);
              const metadata = config.renderMetadata?.(context);

              const actions =
                config.renderActions?.(context) ??
                (config.actions?.length ? (
                  <DataTableRowActions
                    row={row}
                    actions={config.actions}
                    maxInlineActions={
                      config.maxInlineActions ?? 2
                    }
                  />
                ) : undefined);

              const usingDefaultExpansion =
                !config.renderExpansion &&
                Boolean(config.enableExpansion);

              const expansion =
                config.renderExpansion?.(context) ??
                (config.enableExpansion ? (
                  <DataTableCardExpandRowButton
                    row={row}
                  />
                ) : undefined);

              const detailRenderer =
                config.renderDetail ?? renderDetailPanel;

              if (
                config.detailMode === "flip" &&
                detailRenderer &&
                row.getCanExpand()
              ) {
                return (
                  <DataTableCardFlipItem
                    key={row.id}
                    row={row}
                    expanded={row.getIsExpanded()}
                    selected={selected}
                    density={density}
                    selection={selection}
                    header={header}
                    body={body}
                    metadata={metadata}
                    actions={actions}
                    renderDetail={() => detailRenderer(context)}
                    flip={config.flip}
                  />
                );
              }

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

                  {hasRenderableContent(actions) && (
                    <CardActionsRoot className={dataTableClasses.cardActions}>
                      {actions}
                    </CardActionsRoot>
                  )}

                  {hasRenderableContent(detail) && (
                    <CardDetailRoot
                      className={dataTableClasses.cardDetail}
                      id={
                        usingDefaultExpansion
                          ? getDetailPanelId(row.id)
                          : undefined
                      }
                      role="region"
                      aria-labelledby={
                        usingDefaultExpansion
                          ? getExpandButtonId(row.id)
                          : undefined
                      }
                      data-detail-panel={row.id}
                    >
                      {detail}
                    </CardDetailRoot>
                  )}
                </CardItemRoot>
              );
            })}
            </CardGridRoot>
          </CardContainerRoot>
        );
      }}
    </table.Subscribe>
  );
}
