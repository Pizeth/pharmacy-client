"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import type { TypographyProps } from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  Refresh,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { DataTable } from "@/components/DataTable";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/DataTable";
import { ResourceActionButton } from "@/components/buttons";
import { TranslationKeyApiError } from "../api";
import {
  TranslationKeyCreateDialog,
  TranslationKeyDeleteDialog,
  TranslationKeyEditDialog,
  TranslationValueCreateDialog,
  TranslationValueDeleteDialog,
  TranslationValueEditDialog,
} from "../forms";
import type { TranslationKey, TranslationValue } from "../schemas";
import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";
import { TranslationKeyTranslationsPanel } from "./TranslationKeyTranslationsPanel";

const COMPONENT_NAME = "RazethTranslationKeyTable";

const Root = styled("section", {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const LoadingRoot = styled(Paper, {
  name: COMPONENT_NAME,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})({});

const LoadingContentRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({});

const TableRegionRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Main",
  overridesResolver: (_props, styles) => styles.main,
})({});

const SelectionInfoRoot = styled(Typography, {
  name: COMPONENT_NAME,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})<TypographyProps>({});

/**
 * Convert an erased request/runtime error into appropriate UI text.
 *
 * The error remains `unknown` throughout the generic server lifecycle;
 * interpretation belongs here at the application/resource boundary.
 */
function getTranslationKeyTableErrorMessage(error: unknown): string {
  if (error instanceof TranslationKeyApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load translation keys.";
}

/**
 * First real production resource using the custom TanStack v9 + MUI
 * DataTable stack.
 */
export function TranslationKeyTable() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TranslationKey | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string>();
  const [deletingRecord, setDeletingRecord] = useState<TranslationKey | null>(
    null,
  );
  const [creatingTranslationFor, setCreatingTranslationFor] =
    useState<TranslationKey | null>(null);

  const [editingTranslation, setEditingTranslation] = useState<{
    readonly record: TranslationKey;
    readonly translation: TranslationValue;
  } | null>(null);

  const [deletingTranslation, setDeletingTranslation] = useState<{
    readonly record: TranslationKey;
    readonly translation: TranslationValue;
  } | null>(null);

  const rowActions = useMemo<readonly DataTableRowAction<TranslationKey>[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        inline: true,
        color: "primary",
        renderIcon: () => <EditOutlined fontSize="small" />,

        /**
         * Mutation safety:
         *
         * a row command is not authorized merely because the action
         * column is visible. The row must be explicitly selected.
         */
        isDisabled: ({ row }) => !row.getIsSelected(),

        onClick: ({ row }) => {
          setEditingRecord(row.original);
        },
      },
      {
        id: "delete",
        label: "Delete",
        color: "error",
        renderIcon: () => <DeleteOutline fontSize="small" />,

        /**
         * Keep destructive row commands aligned with the same explicit
         * selection contract as Edit.
         */
        isDisabled: ({ row }) => !row.getIsSelected(),

        onClick: ({ row }) => setDeletingRecord(row.original),
      },
    ],
    [],
  );

  const { table, query, server, filterOptions, refresh } =
    useTranslationKeyDataTable({
      rowActions,

      /**
       * TranslationKey is the first production resource to consume the
       * already-finished generic detail-panel architecture.
       */
      enableTranslationDetails: true,

      /**
       * Phase 1.7.10.7.5:
       *
       * opt into the generic TanStack selection feature/column without
       * moving any resource mutation behavior into DataTable.
       */
      enableRowSelection: true,
    });

  /**
   * Footer commands deliberately support exactly one selected loaded row.
   *
   * Multi-selection is still useful for status and future bulk workflows,
   * but 7.5 does not manufacture a bulk TranslationKey mutation API.
   */
  const selectionActions = useMemo<
    readonly DataTableBulkAction<TranslationKey>[]
  >(
    () => [
      {
        id: "edit-selected",
        label: "Edit selected",
        color: "primary",
        variant: "text",
        renderIcon: () => <EditOutlined fontSize="small" />,
        isDisabled: ({ selectedCount, selectedRows }) =>
          selectedCount !== 1 || selectedRows.length !== 1,
        onClick: ({ selectedRows }) => {
          const selected = selectedRows[0];

          if (selected) {
            setEditingRecord(selected.original);
          }
        },
      },
      {
        id: "delete-selected",
        label: "Delete selected",
        color: "error",
        variant: "text",
        renderIcon: () => <DeleteOutline fontSize="small" />,
        isDisabled: ({ selectedCount, selectedRows }) =>
          selectedCount !== 1 || selectedRows.length !== 1,
        onClick: ({ selectedRows }) => {
          const selected = selectedRows[0];

          if (selected) {
            setDeletingRecord(selected.original);
          }
        },
      },
    ],
    [],
  );

  /**
   * ================================================================
   * Initial blocking load
   * ================================================================
   *
   * Do not render the empty table for the first request.
   *
   * Once a successful result exists, later requests stay inside the
   * DataTable and use its non-blocking refresh indicator instead.
   */
  if (server.isInitialLoading) {
    return (
      <LoadingRoot variant="outlined">
        <LoadingContentRoot>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading translation keys…
          </Typography>
        </LoadingContentRoot>
      </LoadingRoot>
    );
  }

  /**
   * ================================================================
   * Blocking failure
   * ================================================================
   *
   * No usable result exists yet.
   */
  if (server.blockingError) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<Refresh />}
            onClick={refresh}
          >
            Retry
          </Button>
        }
      >
        {getTranslationKeyTableErrorMessage(server.blockingError)}
      </Alert>
    );
  }

  /**
   * ================================================================
   * Usable table
   * ================================================================
   *
   * At this point:
   *
   *   server.rows
   *
   * is either:
   *
   *   - the current successful page
   *   - the preserved previous page during a replacement request
   *
   * The renderer remains unaware of HTTP and query execution details.
   */
  return (
    <Root>
      <TranslationKeyCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(record) => {
          setCreateOpen(false);
          setSuccessMessage(`Created translation key: ${record.key}`);

          /**
           * Refresh the current server query without remounting the table.
           *
           * Existing:
           *
           * - sorting
           * - filters
           * - global search
           * - pagination
           *
           * remain intact.
           */
          refresh();
        }}
      />

      <TranslationKeyEditDialog
        record={editingRecord}
        onClose={() => {
          setEditingRecord(null);
        }}
        onUpdated={(record) => {
          setEditingRecord(null);
          setSuccessMessage(`Updated translation key: ${record.key}`);
          refresh();
        }}
      />

      <TranslationKeyDeleteDialog
        record={deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onDeleted={(record) => {
          setDeletingRecord(null);
          setSuccessMessage(`Deleted translation key: ${record.key}`);

          /**
           * A deleted entity can no longer remain selected.
           *
           * Remove only that stable server row ID so the cleanup is
           * correct even if future selection policy allows more than one
           * selected row at mutation time.
           */
          table.setRowSelection((previous) => {
            const next = {
              ...previous,
            };

            delete next[String(record.id)];

            return next;
          });

          const { pageIndex } = query.state.pagination;
          if (
            pageIndex > 0 &&
            server.rows.length === 1 &&
            server.rows[0].id === record.id
          ) {
            // Changing the resource query triggers its replacement request.
            query.onPaginationChange((previous) => ({
              ...previous,
              pageIndex: Math.max(0, previous.pageIndex - 1),
            }));
          } else {
            refresh();
          }
        }}
      />

      <TranslationValueCreateDialog
        record={creatingTranslationFor}
        onClose={() => {
          setCreatingTranslationFor(null);
        }}
        onCreated={(translation) => {
          const key = creatingTranslationFor?.key;

          setCreatingTranslationFor(null);

          setSuccessMessage(
            key
              ? `Added ${translation.locale.toLocaleUpperCase()} translation for: ${key}`
              : `Added ${translation.locale.toLocaleUpperCase()} translation.`,
          );

          /**
           * Preserve:
           *
           * - global search
           * - column filters
           * - sorting
           * - page size
           * - current page
           *
           * while refreshing the canonical TranslationKey row that
           * contains the new nested TranslationValue.
           */
          refresh();
        }}
      />

      <TranslationValueEditDialog
        record={editingTranslation?.record ?? null}
        translation={editingTranslation?.translation ?? null}
        onClose={() => {
          setEditingTranslation(null);
        }}
        onUpdated={(translation) => {
          const key = editingTranslation?.record.key;

          setEditingTranslation(null);

          setSuccessMessage(
            key
              ? `Updated ${translation.locale.toLocaleUpperCase()} translation for: ${key}`
              : `Updated ${translation.locale.toLocaleUpperCase()} translation.`,
          );

          refresh();
        }}
      />

      <TranslationValueDeleteDialog
        record={deletingTranslation?.record ?? null}
        translation={deletingTranslation?.translation ?? null}
        onClose={() => {
          setDeletingTranslation(null);
        }}
        onDeleted={(translation) => {
          const key =
            deletingTranslation?.record.key;

          setDeletingTranslation(null);

          setSuccessMessage(
            key
              ? `Deleted ${translation.locale.toLocaleUpperCase()} translation for: ${key}`
              : `Deleted ${translation.locale.toLocaleUpperCase()} translation.`,
          );

          /**
           * Nested deletion never changes the number of TranslationKey
           * rows in the current server page, so unlike TranslationKey
           * deletion there is no last-row/page-recovery branch here.
           *
           * Refresh only the current query and let canonical server data
           * replace row.original.translations.
           */
          refresh();
        }}
      />

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(undefined)}>
          {successMessage}
        </Alert>
      )}

      {Boolean(server.refreshError) && (
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={refresh}
            >
              Retry
            </Button>
          }
        >
          {getTranslationKeyTableErrorMessage(server.refreshError)}
        </Alert>
      )}

      <TableRegionRoot>
        {Boolean(filterOptions.error) && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<Refresh />}
                onClick={filterOptions.refresh}
              >
                Retry
              </Button>
            }
          >
            Category filter options could not be loaded. Other table filters
            remain available.
          </Alert>
        )}

        <DataTable
          table={table}
          /**
           * ----------------------------------------------------------
           * Nested translation values
           * ----------------------------------------------------------
           *
           * The current server row already contains:
           *
           *   row.original.translations
           *
           * so expansion is a pure presentation interaction.
           *
           * No detail HTTP request is manufactured here.
           */
          renderDetailPanel={({ row }) => (
            <TranslationKeyTranslationsPanel
              record={row.original}
              onCreate={(record) => {
                setCreatingTranslationFor(record);
              }}
              onEdit={(record, translation) => {
                setEditingTranslation({
                  record,
                  translation,
                });
              }}
              onDelete={(record, translation) => {
                setDeletingTranslation({
                  record,
                  translation,
                });
              }}
            />
          )}
          /**
           * Use the renderer's built-in non-blocking refresh indicator.
           *
           * When no explicit percentage is supplied, your renderer's
           * DataTableRefreshingIndicator already uses its simulated
           * YouTube/NProgress-style trickle.
           */
          refreshing={server.isRefreshing}
          /**
           * Standard toolbar is now connected to the REAL table.
           *
           * We will customize its resource-specific controls in
           * Phase 1.7.10.5.
           */
          toolbar={{
            // startContent: (
            //   <Button variant="contained" onClick={() => setCreateOpen(true)}>
            //     Create key
            //   </Button>
            // ),
            startContent: (
              <ResourceActionButton
                variant="contained"
                color="warning"
                startIcon={<AddRounded />}
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                Create key
              </ResourceActionButton>
            ),
            search: true,
            /**
             * MRT parity:
             *
             * - search is initially visible
             * - toolbar exposes a Show/Hide search action
             * - hiding search does NOT clear TanStack globalFilter
             *
             * search is shown initially but the toolbar action can collapse it.
             */
            searchMode: "collapsible",
            defaultSearchOpen: true,
            searchPosition: "center",
            searchPlaceholder: "Search translations…",

            /**
             * User sees every keystroke immediately.
             *
             * TanStack/global server query only changes after 300ms idle.
             */
            searchDebounceMs: 300,

            /**
             * Keep the standard filter-row visibility action.
             */
            enableFilterToggle: true,

            /**
             * Show:
             *
             *   "1 filter"
             *   "2 filters"
             *
             * and expose the existing clear-all-filter action.
             */
            showFilterStatus: true,
          }}
          /**
           * Real server-backed pagination.
           */
          pagination={{}}
          /**
           * Reuse the generic footer selection surface.
           *
           * It renders inside the left side of the existing pagination
           * footer, matching MRT's bottom selected-row status behavior.
           *
           * Resource mutation policy remains here:
           *
           * - status supports one or many selected rows
           * - Edit/Delete require exactly one loaded selected row
           * - Clear delegates to TanStack rowSelection state
           */
          selectionBar={{
            actions: selectionActions,
            clearable: true,

            /**
             * The generic selection bar owns the selected-count status.
             *
             * TranslationKey contributes resource identity only when
             * exactly one loaded row is selected, so the left footer
             * reads like:
             *
             *   1 row selected   auth_email   Edit selected   Delete selected
             *
             * Multi-selection intentionally falls back to count-only
             * status because 7.5 introduces no bulk mutation contract.
             */
            renderStartContent: ({ selectedCount, selectedRows }) => {
              const selected =
                selectedCount === 1 && selectedRows.length === 1
                  ? selectedRows[0]
                  : undefined;

              return selected ? (
                <SelectionInfoRoot component="span" variant="body2" noWrap>
                  {selected.original.key}
                </SelectionInfoRoot>
              ) : null;
            },
          }}
          // /**
          //  * We intentionally keep the filter row hidden until the
          //  * resource-aware category/locale controls are implemented.
          //  */
          // showColumnFilters={false}
          /**
           * Column filters render in the dedicated sticky filter row.
           */
          columnFilterDisplayMode="subheader"
          /**
           * Start closed while preserving toolbar ownership of subsequent
           * show/hide interaction.
           *
           * Do NOT use:
           *
           *   showColumnFilters={false}
           *
           * here unless we intentionally want controlled visibility.
           *
           * Hidden initially, but uncontrolled afterward.
           */
          defaultShowColumnFilters={false}
          /**
           * Sticky headers are now safe to enable through the renderer's
           * forwarded MUI Table props.
           */
          tableProps={{
            stickyHeader: true,
          }}
          // /**
          //  * Give the scrolling viewport useful vertical room without
          //  * forcing page-specific dimensions into the generic renderer.
          //  */
          // containerProps={{
          //   sx: {
          //     /**
          //      * Existing page-level runtime/layout styling.
          //      *
          //      * We can move this toward the new slot-based styling convention
          //      * during the visual audit.
          //      */
          //     maxHeight: "calc(100vh - 240px)",
          //     minHeight: 320,
          //   },
          // }}
        />
      </TableRegionRoot>
    </Root>
  );
}
