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
