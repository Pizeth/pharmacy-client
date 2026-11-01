"use client";

import { Fragment, type HTMLAttributes } from "react";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { DataTableCallbackBoundary } from "../../components/DataTableCallbackBoundary";
import { isFromInteractiveDescendant } from "../../components/DataTableBodyRow";
import type { DataTableDetailPanelRenderer } from "../../components/detail-panel";
import { DataTableRowActions } from "../../columns/actions";
import { useDataTableAccessibility } from "../../accessibility";
import { useDataTableDensity } from "../../density";
import { DataTableDiagnosticCommit, useDataTableRenderDiagnostics } from "../../diagnostics/renderDiagnostics";
import { dataTableClasses } from "../../styles";
import { CardActionsRoot, CardBodyRoot, CardDetailRoot, CardExpansionRoot,
  CardHeaderContentRoot, CardHeaderRoot, CardItemRoot, CardMetadataRoot,
  CardSelectionRoot, hasRenderableContent } from "./cardSlots";
import { DataTableCardExpandRowButton } from "./DataTableCardExpandRowButton";
import { DataTableCardFlipItem } from "./DataTableCardFlipItem";
import { DataTableCardSelectRowCheckbox } from "./DataTableCardSelectRowCheckbox";
import type { DataTableCardConfig, DataTableCardRenderContext } from "./types";

/** One mounted invocation boundary owns all physical slot decisions for a card.
 * Kept broad: a callback receiving one row may still depend on the entire table.
 */
export function DataTableCardItem<TData extends RowData>({ row, config, renderDetailPanel }: {
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly config: DataTableCardConfig<TData>;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
}) {
  const { density } = useDataTableDensity();
  const diagnostics = useDataTableRenderDiagnostics();
  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();
  return <DataTableCallbackBoundary<TData> render={table => {
    const context: DataTableCardRenderContext<TData> = {
      table,
      row,
    };

    const selected = row.getIsSelected();
    const clickable = !!config.onClick && (!config.clickSelectedOnly || selected);
    const activationProps: HTMLAttributes<HTMLDivElement> = clickable ? {
      tabIndex: 0,
      onClick: event => {
        if (event.defaultPrevented || event.button !== 0 || isFromInteractiveDescendant(event)) return;
        config.onClick?.(context, event);
      },
      onKeyDown: event => {
        if (event.defaultPrevented || event.repeat || event.target !== event.currentTarget || !["Enter", " "].includes(event.key)) return;
        event.preventDefault(); config.onClick?.(context, event);
      },
    } : {};

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
        <Fragment>
        {diagnostics && <DataTableDiagnosticCommit layer="row" id={row.id} />}
        <DataTableCardFlipItem
          row={row}
          activationProps={activationProps}
          clickable={clickable}
          expanded={row.getIsExpanded()}
          selected={selected}
          density={density}
          compactCard={config.compactCard}
          selection={selection}
          header={header}
          body={body}
          metadata={metadata}
          actions={actions}
          renderDetail={() => detailRenderer(context)}
          flip={config.flip}
        />
        </Fragment>
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
        {...activationProps}
        data-row-clickable={clickable ? "true" : undefined}
        variant="outlined"
        className={dataTableClasses.cardItem}
        role="listitem"
        data-row-id={row.id}
        data-selected={selected ? "true" : undefined}
        data-density={density}
        data-compact={config.compactCard ? "true" : undefined}
      >
        {diagnostics && <DataTableDiagnosticCommit layer="row" id={row.id} />}
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

        {(!config.compactCard || !hasRenderableContent(header)) && (
          <CardBodyRoot className={dataTableClasses.cardBody}>
            {body}
          </CardBodyRoot>
        )}

        {!config.compactCard && hasRenderableContent(metadata) && (
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
  }} />;
}
