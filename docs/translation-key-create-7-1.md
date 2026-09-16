# 1.7.10.7.1 - TranslationKey create workflow

6F acceptance was recorded before this implementation. The first CRUD slice replaces the existing create placeholder and adds a create dialog to the table toolbar.

## Behavior

- The existing resource schema validates key, description, and category ID. Key/description trimming follows that schema; blank descriptions become null.
- Category options load independently through the existing resource hook. Loading, failure/retry, and empty-category states block submission.
- A category must exist in the loaded option set; no category is silently selected.
- A synchronous ref guards duplicate requests before React's disabled state renders.
- While saving, inputs and Cancel are disabled. The table dialog also ignores backdrop/Escape closure while the request is pending.
- Failed requests preserve input and show the API error; the user can retry.
- The existing createTranslationKey API client performs the cookie-backed POST and validates the response schema.
- Only a successful parsed response triggers onCreated.
- Table dialog success closes the form, announces the created key, and invokes the existing refresh function. The table/query controller stays mounted, preserving filters, sorting, and pagination. A newly created key may not appear on the current filtered/sorted page; the success message confirms the mutation separately.
- The standalone create route uses the same form and returns to the list on success or Cancel.

## Boundaries

No mutation logic was added to generic DataTable. The resource owns the form, API call, status message, and refresh. This slice creates TranslationKey metadata only; locale values, edit row actions, delete confirmation, and bulk mutation behavior remain later work. The form reuses the existing category-options lifecycle hook; it does not assume category labels are IDs.

Requests are not automatically retried. If a connection fails after the server commits, the UI cannot infer whether creation occurred; the user may need to refresh before retrying. Navigating away with browser controls is not intercepted. Cancel before submission discards the local draft without a confirmation prompt.

## Files

| File | Change |
| --- | --- |
| forms/TranslationKeyCreateForm.tsx | Reusable resource form and mutation lifecycle |
| forms/TranslationKeyCreateForm.spec.tsx | Four focused form tests |
| table/TranslationKeyTable.tsx | Toolbar entry, dialog, success status, query refresh |
| app/(app)/(protected)/admin/i18n/create/page.tsx | Real standalone form replacing placeholder |

## Validation

- Typecheck and TanStack feature synchronization passed.
- 38 suites / 203 tests passed.
- git diff --check passed with Windows line-ending warnings.
- Tests cover invalid input, normalized payload, duplicate-submit suppression, pending controls, successful callback, failed-request draft preservation, and category retry.
- Live table: create action and dialog rendered; category loading state disabled submission; categories loaded; empty submission produced field errors; Cancel closed the dialog.
- Live standalone route: heading, fields, category selector, Create key and Cancel rendered.
- No live record was created. Successful persistence and backend rejection were tested with a mocked mutation client. End-to-end backend write acceptance remains outstanding.

## Next slice

1.7.10.7.2: row edit actions and a detail-loaded editing workflow, preserving the same resource ownership and server validation boundaries. Keep delete as a separate explicit confirmation flow.

## Complete source

### src/features/i18n/translation-keys/forms/TranslationKeyCreateForm.tsx

```tsx
"use client";

import { useRef, useState } from "react";
import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { createTranslationKey } from "../api";
import {
  createTranslationKeyInputSchema,
  type TranslationKey,
} from "../schemas";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";

export interface TranslationKeyCreateFormProps {
  readonly onCreated: (record: TranslationKey) => void;
  readonly onCancel: () => void;
  readonly onPendingChange?: (pending: boolean) => void;
}

export function TranslationKeyCreateForm({
  onCreated,
  onCancel,
  onPendingChange,
}: TranslationKeyCreateFormProps) {
  const options = useTranslationKeyFilterOptions();
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const unavailable =
    options.fetching ||
    Boolean(options.error) ||
    options.categoryOptions.length === 0;

  return (
    <Stack
      component="form"
      noValidate
      spacing={2}
      aria-busy={pending}
      onSubmit={async (event) => {
        event.preventDefault();
        if (inFlight.current || unavailable) return;
        const parsed = createTranslationKeyInputSchema.safeParse({
          key,
          description: description.trim() || null,
          categoryId: Number(category),
        });
        if (!parsed.success) {
          setErrors(
            Object.fromEntries(
              parsed.error.issues.map((issue) => [
                String(issue.path[0]),
                issue.message,
              ]),
            ),
          );
          return;
        }
        if (
          !options.categoryOptions.some(
            (option) => String(option.value) === category,
          )
        ) {
          setErrors({ categoryId: "Choose an available category." });
          return;
        }
        setErrors({});
        setError(undefined);
        inFlight.current = true;
        setPending(true);
        onPendingChange?.(true);
        let record: TranslationKey;
        try {
          record = (await createTranslationKey(parsed.data)).data;
        } catch (failure) {
          setError(
            failure instanceof Error
              ? failure.message
              : "Unable to create translation key.",
          );
          return;
        } finally {
          inFlight.current = false;
          setPending(false);
          onPendingChange?.(false);
        }
        onCreated(record);
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {options.error ? (
        <Alert
          severity="error"
          action={<Button onClick={options.refresh}>Retry categories</Button>}
        >
          Categories could not be loaded.
        </Alert>
      ) : options.fetching ? (
        <Alert severity="info">Loading categories...</Alert>
      ) : options.categoryOptions.length === 0 ? (
        <Alert severity="warning">
          No categories are available. Create a category before adding a key.
        </Alert>
      ) : null}
      <TextField
        autoFocus
        label="Key"
        value={key}
        onChange={(event) => setKey(event.target.value)}
        required
        disabled={pending}
        error={Boolean(errors.key)}
        helperText={errors.key}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        minRows={2}
        disabled={pending}
        error={Boolean(errors.description)}
        helperText={errors.description}
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
        disabled={pending || unavailable}
        error={Boolean(errors.categoryId)}
        helperText={errors.categoryId}
      >
        <MenuItem value="">Choose a category</MenuItem>
        {options.categoryOptions.map((option) => (
          <MenuItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={1}>
        <Button
          type="submit"
          variant="contained"
          disabled={pending || unavailable}
        >
          {pending ? "Creating..." : "Create key"}
        </Button>
        <Button type="button" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

```

### src/features/i18n/translation-keys/forms/TranslationKeyCreateForm.spec.tsx

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TranslationKeyCreateForm } from "./TranslationKeyCreateForm";
import { createTranslationKey } from "../api";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";

jest.mock("../api", () => ({ createTranslationKey: jest.fn() }));
jest.mock("../table/useTranslationKeyFilterOptions", () => ({
  useTranslationKeyFilterOptions: jest.fn(),
}));
const create = createTranslationKey as jest.Mock;
const options = useTranslationKeyFilterOptions as jest.Mock;
beforeEach(() => {
  jest.resetAllMocks();
  options.mockReturnValue({
    fetching: false,
    error: undefined,
    categoryOptions: [{ value: 2, label: "auth" }],
    refresh: jest.fn(),
  });
});
async function fill() {
  fireEvent.change(screen.getByRole("textbox", { name: /Key/ }), {
    target: { value: "  new_key  " },
  });
  fireEvent.mouseDown(screen.getByRole("combobox", { name: /Category/ }));
  fireEvent.click(await screen.findByRole("option", { name: "auth" }));
}
it("validates locally and does not submit blank input", () => {
  render(
    <TranslationKeyCreateForm onCreated={jest.fn()} onCancel={jest.fn()} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(create).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: /Key/ })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
it("normalizes input, blocks duplicate submission, and reports server success", async () => {
  let resolve!: (value: unknown) => void;
  create.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onCreated = jest.fn();
  render(
    <TranslationKeyCreateForm onCreated={onCreated} onCancel={jest.fn()} />,
  );
  await fill();
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  fireEvent.submit(
    screen.getByRole("textbox", { name: /Key/ }).closest("form")!,
  );
  expect(create).toHaveBeenCalledTimes(1);
  expect(create).toHaveBeenCalledWith({
    key: "new_key",
    description: null,
    categoryId: 2,
  });
  resolve({ data: { id: 9, key: "new_key" } });
  await waitFor(() =>
    expect(onCreated).toHaveBeenCalledWith({ id: 9, key: "new_key" }),
  );
});
it("preserves input and permits retry after a rejected request", async () => {
  create.mockRejectedValue(new Error("Key already exists"));
  const onCreated = jest.fn();
  render(
    <TranslationKeyCreateForm onCreated={onCreated} onCancel={jest.fn()} />,
  );
  await fill();
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Key already exists",
  );
  expect(screen.getByRole("textbox", { name: /Key/ })).toHaveValue(
    "  new_key  ",
  );
  expect(screen.getByRole("button", { name: "Create key" })).toBeEnabled();
  expect(onCreated).not.toHaveBeenCalled();
});
it("disables creation during category failures and exposes retry", () => {
  const refresh = jest.fn();
  options.mockReturnValue({
    fetching: false,
    error: new Error("offline"),
    categoryOptions: [],
    refresh,
  });
  render(
    <TranslationKeyCreateForm onCreated={jest.fn()} onCancel={jest.fn()} />,
  );
  expect(screen.getByRole("button", { name: "Create key" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Retry categories" }));
  expect(refresh).toHaveBeenCalledTimes(1);
});

```

### src/features/i18n/translation-keys/table/TranslationKeyTable.tsx

```tsx
"use client";

import { useState } from "react";
import { TranslationKeyCreateForm } from "../forms/TranslationKeyCreateForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { Refresh } from "@mui/icons-material";

import { DataTable } from "@/components/DataTable";

import { TranslationKeyApiError } from "../api";

import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";

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
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string>();
  const { table, server, filterOptions, refresh } =
    useTranslationKeyDataTable();

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
      <Paper
        variant="outlined"
        sx={{
          minHeight: 360,
          display: "grid",
          placeItems: "center",
          p: 4,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />

          <Typography variant="body2" color="text.secondary">
            Loading translation keys…
          </Typography>
        </Stack>
      </Paper>
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
    <Stack
      spacing={1}
      sx={{
        minWidth: 0,
      }}
    >
      <Dialog
        open={createOpen}
        onClose={() => {
          if (!creating) setCreateOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="create-key-title"
      >
        <DialogTitle id="create-key-title">Create translation key</DialogTitle>
        <DialogContent>
          {createOpen && (
            <TranslationKeyCreateForm
              onPendingChange={setCreating}
              onCancel={() => setCreateOpen(false)}
              onCreated={(record) => {
                setCreateOpen(false);
                setCreatedKey(record.key);
                refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {createdKey && (
        <Alert severity="success" onClose={() => setCreatedKey(undefined)}>
          Created translation key: {createdKey}
        </Alert>
      )}
      {server.refreshError ? (
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
      ) : null}

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        {filterOptions.error ? (
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
        ) : null}

        <DataTable
          // variant="plain"
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
            startContent: (
              <Button variant="contained" onClick={() => setCreateOpen(true)}>
                Create key
              </Button>
            ),
            search: true,
            searchMode: "always",
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
          /**
           * Give the scrolling viewport useful vertical room without
           * forcing page-specific dimensions into the generic renderer.
           */
          containerProps={{
            sx: {
              /**
               * Existing page-level runtime/layout styling.
               *
               * We can move this toward the new slot-based styling convention
               * during the visual audit.
               */
              maxHeight: "calc(100vh - 240px)",
              minHeight: 320,
            },
          }}
        />
      </Box>
    </Stack>
  );
}

```

### src/app/(app)/(protected)/admin/i18n/create/page.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Paper, Typography } from "@mui/material";
import { TranslationKeyCreateForm } from "@/features/i18n/translation-keys/forms/TranslationKeyCreateForm";

export default function CreateTranslationPage() {
  const router = useRouter();
  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create translation key
      </Typography>
      <TranslationKeyCreateForm
        onCancel={() => router.push("/admin/i18n")}
        onCreated={() => {
          router.replace("/admin/i18n");
          router.refresh();
        }}
      />
    </Paper>
  );
}

```

