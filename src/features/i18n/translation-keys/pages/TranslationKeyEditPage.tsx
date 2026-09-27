"use client";

import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { ResourcePage } from "@/components/layouts/ResourcePage";

import { getTranslationKey } from "../api";
import type { TranslationKey } from "../schemas";
import { TranslationKeyEditForm } from "../forms";

export interface TranslationKeyEditPageProps {
  readonly recordId: number;
  readonly onBack: () => void;
  readonly onUpdated: (record: TranslationKey) => void;
}

function isAbortFailure(failure: unknown): boolean {
  return (
    failure instanceof Error &&
    failure.name === "AbortError"
  );
}

/**
 * Dedicated TranslationKey edit-page content.
 *
 * The table dialog remains useful for inline work, but a real edit route is
 * also required for deep links, Refine resource navigation and visual
 * acceptance.
 *
 * This component owns only the detail-loading lifecycle. Mutation semantics
 * remain in TranslationKeyEditForm.
 */
export function TranslationKeyEditPage(
  props: TranslationKeyEditPageProps,
) {
  const {
    recordId,
    onBack,
    onUpdated,
  } = props;

  const [record, setRecord] = useState<TranslationKey>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setLoadError(undefined);

    void getTranslationKey(recordId, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        setRecord(response.data);
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted || isAbortFailure(failure)) {
          return;
        }

        setRecord(undefined);
        setLoadError(
          failure instanceof Error
            ? failure.message
            : "Unable to load translation key.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [recordId, reloadVersion]);

  const retry = useCallback(() => {
    setReloadVersion((value) => value + 1);
  }, []);

  return (
    <ResourcePage
      title="Edit translation key"
      subtitle={
        record
          ? `Update metadata for ${record.key}.`
          : "Load and update translation key metadata."
      }
      maxWidth="md"
      surface
    >
      {loading ? (
        <Stack
          role="status"
          aria-live="polite"
          aria-busy="true"
          spacing={2}
          alignItems="center"
        >
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Loading translation key…
          </Typography>
        </Stack>
      ) : loadError ? (
        <Stack spacing={2}>
          <Alert severity="error">{loadError}</Alert>

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            spacing={1}
            justifyContent="flex-end"
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onBack}
            >
              Back to translation keys
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={retry}
            >
              Retry
            </Button>
          </Stack>
        </Stack>
      ) : record ? (
        <TranslationKeyEditForm
          key={record.id}
          record={record}
          cancelLabel="Back to translation keys"
          onCancel={onBack}
          onUpdated={(updated) => {
            setRecord(updated);
            onUpdated(updated);
          }}
        />
      ) : (
        <Alert severity="error">
          Translation key data was not returned.
        </Alert>
      )}
    </ResourcePage>
  );
}
