# 1.7.10.7.3 — TranslationKey delete/confirmation

## Scope and behavior

The TranslationKey resource owns the destructive command. No generic DataTable
infrastructure is added or changed in this slice. Existing local 7.2 changes are
preserved, including the `start: []` pinning fix.

Edit remains inline. The resource action column now has one inline slot, placing
Delete in its existing overflow menu. Choosing Delete only selects the record and
opens confirmation; it does not issue a request.

The confirmation identifies the key and states that deletion cannot be undone.
Cancel receives initial focus. Escape and backdrop clicks do not dismiss the
dialog. Cancel and X close it while idle. During DELETE, Cancel, X and Delete are
disabled, with an immediate ref guard preventing duplicate submissions.

The command reuses `deleteTranslationKey(id)` and its existing runtime-validated
response. Server errors remain in the confirmation and allow retry. Selecting a
different record or reopening resets the error. A completed request cannot call
the parent from an unmounted confirmation.

Success closes the dialog, uses the resource's existing success alert, and
refreshes the current query. Sorting, filters, search and page size are preserved.
Deleting the sole row on a later page moves back one page instead of issuing a
duplicate refresh for the empty page. Deleting the last row on page zero refreshes
page zero. The backend remains responsible for permissions and related-record
deletion policy; the client does not invent a cascade operation.

## Files

- Add `forms/TranslationKeyDeleteDialog.tsx`: resource-specific confirmation.
- Add `forms/TranslationKeyDeleteDialog.spec.tsx`: six dialog/mutation tests.
- Add `table/TranslationKeyDeleteCommand.spec.tsx`: four command orchestration tests.
- Modify `forms/index.ts`: export the new dialog and its props.
- Modify `table/TranslationKeyTable.tsx`: Delete row action, selected record, success handling.
- Modify `columns/translationKeyColumns.tsx`: `maxInlineActions: 1`.

All paths above are under `src/features/i18n/translation-keys`.

## Verification

- `npm run typecheck`: PASS.
- Delete dialog, delete command and column suites: 21/21 PASS.
- `npm run test:datatable -- --runInBand`: 224/224 PASS, 42 suites.
- New delete UI uses existing named `RazethTranslationKeyForm` slots and shared
  `FormDialog`. No new `sx`.
- Live `/admin/i18n` check: PASS for overflow Delete, correct key identity,
  Cancel initial focus, Escape/backdrop protection, Cancel/X dismissal, unchanged
  row after dismissal, and confirmation above the fullscreen table.
- Browser-discovered focus correction: defer Cancel focus by one animation frame
  to follow the closing menu's focus restoration. Cleanup cancels the frame.
  Both new test suites passed again after the correction (10/10).
- `git diff --check`: PASS.
- No live permanent deletion is claimed. Mutation success, failure, pending,
  duplicate-submit and last-row behavior were verified with mocked API responses.

## Complete implementation and tests

The following code is a snapshot of the completed resource files. Existing
create/edit code within the table is included so the integration is reviewable.



### src/features/i18n/translation-keys/forms/TranslationKeyDeleteDialog.tsx
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Typography, styled } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import { deleteTranslationKey } from "../api";
import type { DeletedTranslationKey, TranslationKey } from "../schemas";

const ContentRoot = styled("div", {
  name: "RazethTranslationKeyForm",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const ActionsRoot = styled("div", {
  name: "RazethTranslationKeyForm",
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({});

export interface TranslationKeyDeleteDialogProps {
  readonly record: TranslationKey | null;
  readonly onClose: () => void;
  readonly onDeleted: (record: DeletedTranslationKey) => void;
}

/** Mount each confirmation separately so errors cannot leak between records. */
export function TranslationKeyDeleteDialog({
  record,
  ...callbacks
}: TranslationKeyDeleteDialogProps) {
  return record ? (
    <DeleteConfirmation key={record.id} record={record} {...callbacks} />
  ) : null;
}

function DeleteConfirmation({
  record,
  onClose,
  onDeleted,
}: Omit<TranslationKeyDeleteDialogProps, "record"> & {
  readonly record: TranslationKey;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    // Let the closing overflow menu finish restoring focus before choosing the
    // safe initial action in the newly mounted modal.
    const frame = requestAnimationFrame(() => cancelButton.current?.focus());
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = () => {
    if (!inFlight.current) onClose();
  };

  const confirm = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(undefined);

    let deleted: DeletedTranslationKey;
    try {
      // Transport and runtime response validation already belong to this API.
      const response = await deleteTranslationKey(record.id);
      deleted = response.data;
    } catch (cause: unknown) {
      if (mounted.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to delete translation key. Please try again.",
        );
      }
      return;
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(false);
    }

    // Refresh errors must not be reported as failed DELETE requests.
    if (mounted.current) onDeleted(deleted);
  };

  return (
    <FormDialog
      open
      title="Delete translation key"
      subtitle={`Delete ${record.key}? This action cannot be undone.`}
      icon={<DeleteOutline />}
      maxWidth="sm"
      pending={pending}
      closeAriaLabel="Close delete translation key dialog"
      onClose={close}
    >
      <ContentRoot aria-busy={pending}>
        <Typography>
          Confirm deletion of translation key <strong>{record.key}</strong>.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <ActionsRoot>
          <Button
            ref={cancelButton}
            autoFocus
            variant="outlined"
            disabled={pending}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutline />}
            loading={pending}
            loadingPosition="start"
            disabled={pending}
            onClick={() => {
              void confirm();
            }}
          >
            {pending ? "Deleting…" : "Delete key"}
          </Button>
        </ActionsRoot>
      </ContentRoot>
    </FormDialog>
  );
}

```

### src/features/i18n/translation-keys/table/TranslationKeyTable.tsx
```tsx
"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  Refresh,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { DataTable } from "@/components/DataTable";
import type { DataTableRowAction } from "@/components/DataTable";
import { ResourceActionButton } from "@/components/buttons";
import { TranslationKeyApiError } from "../api";
import {
  TranslationKeyCreateDialog,
  TranslationKeyDeleteDialog,
  TranslationKeyEditDialog,
} from "../forms";
import type { TranslationKey } from "../schemas";
import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";

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

  const rowActions = useMemo<readonly DataTableRowAction<TranslationKey>[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        inline: true,
        color: "primary",
        renderIcon: () => <EditOutlined fontSize="small" />,
        onClick: ({ row }) => {
          setEditingRecord(row.original);
        },
      },
      {
        id: "delete",
        label: "Delete",
        color: "error",
        renderIcon: () => <DeleteOutline fontSize="small" />,
        onClick: ({ row }) => setDeletingRecord(row.original),
      },
    ],
    [],
  );

  // const [createdKey, setCreatedKey] = useState<string>();
  const { table, query, server, filterOptions, refresh } =
    useTranslationKeyDataTable({
      rowActions,
    });

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
           * No row bulk-selection UX for TranslationKey yet.
           */
          selectionBar={false}
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

```

### src/features/i18n/translation-keys/forms/index.ts
```tsx
export { TranslationKeyCreateDialog } from "./TranslationKeyCreateDialog";

export type { TranslationKeyCreateDialogProps } from "./TranslationKeyCreateDialog";

export { TranslationKeyCreateForm } from "./TranslationKeyCreateForm";

export type { TranslationKeyCreateFormProps } from "./TranslationKeyCreateForm";

export { TranslationKeyEditDialog } from "./TranslationKeyEditDialog";
export { TranslationKeyDeleteDialog } from "./TranslationKeyDeleteDialog";
export type { TranslationKeyDeleteDialogProps } from "./TranslationKeyDeleteDialog";

export type { TranslationKeyEditDialogProps } from "./TranslationKeyEditDialog";

export { TranslationKeyEditForm } from "./TranslationKeyEditForm";

export type { TranslationKeyEditFormProps } from "./TranslationKeyEditForm";

export { TranslationKeyFormShell } from "./TranslationKeyFormShell";

export type { TranslationKeyFormShellProps } from "./TranslationKeyFormShell";

export {
  EMPTY_TRANSLATION_KEY_FORM_VALUES,
  TranslationKeyFormFields,
} from "./TranslationKeyFormFields";

export type {
  TranslationKeyFormFieldsProps,
  TranslationKeyFormOption,
  TranslationKeyFormValues,
} from "./TranslationKeyFormFields";

```

### src/features/i18n/translation-keys/forms/TranslationKeyDeleteDialog.spec.tsx
```tsx
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { deleteTranslationKey } from "../api";
import type { TranslationKey } from "../schemas";
import { TranslationKeyDeleteDialog } from "./TranslationKeyDeleteDialog";

jest.mock("../api", () => ({ deleteTranslationKey: jest.fn() }));
const remove = deleteTranslationKey as jest.Mock;
const record: TranslationKey = {
  id: 31,
  key: "sequence_test",
  description: "Test key",
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: { id: 1, name: "common", description: null },
  translations: [],
};

beforeEach(() => jest.resetAllMocks());

it("identifies the target and requires explicit confirmation, with Cancel initially focused", () => {
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("sequence_test");
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(remove).not.toHaveBeenCalled();
});

it("ignores Escape and backdrop while allowing the explicit X", () => {
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );
  const dialog = screen.getByRole("dialog");
  fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
  fireEvent.click(dialog.parentElement!);
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Close delete translation key dialog" }),
  );
  expect(onClose).toHaveBeenCalledTimes(1);
});

it("sends one DELETE and locks every action until the validated result arrives", async () => {
  let resolve!: (value: unknown) => void;
  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onDeleted = jest.fn();
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={onDeleted}
    />,
  );
  const button = screen.getByRole("button", { name: "Delete key" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(31);
  expect(screen.getByRole("button", { name: /Deleting/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Close delete translation key dialog" }),
  ).toBeDisabled();
  expect(onDeleted).not.toHaveBeenCalled();
  await act(async () => {
    resolve({ data: { id: 31, key: "sequence_test" } });
  });
  expect(onDeleted).toHaveBeenCalledWith({ id: 31, key: "sequence_test" });
  expect(onClose).not.toHaveBeenCalled();
});

it("keeps the confirmation and target after failure and allows retry", async () => {
  remove.mockRejectedValueOnce(new Error("Deletion is not allowed"));
  remove.mockResolvedValueOnce({ data: { id: 31, key: "sequence_test" } });
  const onDeleted = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Deletion is not allowed",
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("sequence_test");
  expect(onDeleted).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
  expect(remove).toHaveBeenCalledTimes(2);
});

it("clears errors when selecting another record and renders nothing when closed", async () => {
  remove.mockRejectedValue("unknown failure");
  const props = { onClose: jest.fn(), onDeleted: jest.fn() };
  const view = render(
    <TranslationKeyDeleteDialog record={record} {...props} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to delete translation key",
  );
  view.rerender(
    <TranslationKeyDeleteDialog
      record={{ ...record, id: 32, key: "another_key" }}
      {...props}
    />,
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("dialog")).toHaveTextContent("another_key");
  view.rerender(<TranslationKeyDeleteDialog record={null} {...props} />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("does not notify an unmounted confirmation after the request completes", async () => {
  let resolve!: (value: unknown) => void;
  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onDeleted = jest.fn();
  const view = render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  view.unmount();
  await act(async () => {
    resolve({ data: { id: 31, key: "sequence_test" } });
  });
  expect(onDeleted).not.toHaveBeenCalled();
});

```

### src/features/i18n/translation-keys/table/TranslationKeyDeleteCommand.spec.tsx
```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { DataTableRowAction } from "@/components/DataTable";
import type { TranslationKey } from "../schemas";
import { deleteTranslationKey } from "../api";
import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";
import { TranslationKeyTable } from "./TranslationKeyTable";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  deleteTranslationKey: jest.fn(),
}));
jest.mock("./useTranslationKeyDataTable", () => ({
  useTranslationKeyDataTable: jest.fn(),
}));
jest.mock("../forms/TranslationKeyCreateDialog", () => ({
  TranslationKeyCreateDialog: () => null,
}));
jest.mock("../forms/TranslationKeyEditDialog", () => ({
  TranslationKeyEditDialog: () => null,
}));
// Exercise resource command orchestration without coupling to generated table DOM.
jest.mock("@/components/DataTable", () => ({
  DataTable: ({
    table,
  }: {
    table: {
      actions: readonly DataTableRowAction<TranslationKey>[];
      record: TranslationKey;
    };
  }) => (
    <button
      onClick={() =>
        table.actions
          .find((action) => action.id === "delete")!
          .onClick({ row: { original: table.record } } as never)
      }
    >
      Delete row
    </button>
  ),
}));

const record: TranslationKey = {
  id: 31,
  key: "sequence_test",
  description: null,
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: { id: 1, name: "common", description: null },
  translations: [],
};
const remove = deleteTranslationKey as jest.Mock;
const controller = useTranslationKeyDataTable as jest.Mock;
const refresh = jest.fn();
const paginate = jest.fn();
const queryState = {
  pagination: { pageIndex: 2, pageSize: 10 },
  sorting: [{ id: "key", desc: true }],
  columnFilters: [{ id: "category", value: 1 }],
  globalFilter: "test",
};

function setup(rows: TranslationKey[], pageIndex = 2) {
  controller.mockImplementation(({ rowActions }) => ({
    table: { actions: rowActions, record },
    query: {
      state: {
        ...queryState,
        pagination: { ...queryState.pagination, pageIndex },
      },
      onPaginationChange: paginate,
    },
    server: { rows, isInitialLoading: false, isRefreshing: false },
    filterOptions: {},
    refresh,
  }));
  remove.mockResolvedValue({ data: { id: record.id, key: record.key } });
  render(<TranslationKeyTable />);
}

beforeEach(() => jest.resetAllMocks());

it("only opens confirmation from the row action and refreshes after successful deletion", async () => {
  setup([record, { ...record, id: 32 }]);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  expect(remove).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(paginate).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Deleted translation key: sequence_test",
  );
});

it("moves back one page when deleting the sole row on a later page, without a duplicate refresh", async () => {
  setup([record]);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(paginate).toHaveBeenCalledTimes(1));
  expect(paginate.mock.calls[0][0](queryState.pagination)).toEqual({
    pageIndex: 1,
    pageSize: 10,
  });
  expect(refresh).not.toHaveBeenCalled();
});

it("refreshes page zero after deleting its final row", async () => {
  setup([record], 0);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(paginate).not.toHaveBeenCalled();
});

it("does not refresh or navigate on a failed deletion", async () => {
  setup([record]);
  remove.mockRejectedValue(new Error("Forbidden"));
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Forbidden");
  expect(refresh).not.toHaveBeenCalled();
  expect(paginate).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

```
