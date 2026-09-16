"use client";

import { useId, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { AddRounded, CloseRounded } from "@mui/icons-material";
import type { TranslationKey } from "../schemas";
import { TranslationKeyCreateForm } from "./TranslationKeyCreateForm";

export interface TranslationKeyCreateDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreated: (record: TranslationKey) => void;
}

/**
 * Resource-owned create surface.
 *
 * Generic DataTable knows nothing about:
 *
 * - this dialog
 * - TranslationKey schemas
 * - mutation requests
 * - category loading
 */
export function TranslationKeyCreateDialog(
  props: TranslationKeyCreateDialogProps,
) {
  const { open, onClose, onCreated } = props;

  const titleId = useId();

  const [pending, setPending] = useState(false);

  const close = (): void => {
    if (pending) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby={titleId}
      disableEscapeKeyDown={pending}
      onClose={() => {
        close();
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} minWidth={0}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "warning.main",
                color: "warning.contrastText",
                flexShrink: 0,
              }}
            >
              <AddRounded />
            </Box>

            <Box minWidth={0}>
              <Typography
                id={titleId}
                component="h2"
                variant="h6"
                fontWeight={700}
              >
                Create translation key
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Add metadata first. Translation values can be managed
                separately.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close create translation key dialog"
            disabled={pending}
            onClick={close}
          >
            <CloseRounded />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 3,
        }}
      >
        {open && (
          <TranslationKeyCreateForm
            onPendingChange={setPending}
            onCancel={close}
            onCreated={onCreated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
