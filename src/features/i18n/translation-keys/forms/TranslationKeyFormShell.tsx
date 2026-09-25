"use client";

import type { ReactNode, SubmitEventHandler } from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import { CloseRounded, SaveRounded } from "@mui/icons-material";

const COMPONENT_NAME = "RazethTranslationKeyForm";

const FormRoot = styled("form", {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const FooterRoot = styled(Box, {
  name: COMPONENT_NAME,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({});

export interface TranslationKeyFormShellProps {
  readonly children: ReactNode;
  readonly pending: boolean;
  readonly submitDisabled?: boolean;
  readonly cancelLabel: string;
  readonly submitLabel: string;
  readonly pendingLabel: string;
  readonly onCancel: () => void;
  readonly onSubmit: SubmitEventHandler<HTMLFormElement>;
}

/**
 * Shared TranslationKey create/edit form structure.
 *
 * Visual layout belongs to:
 *
 *   theme.components.RazethTranslationKeyForm
 *
 * This component owns only:
 *
 * - native form semantics
 * - pending semantics
 * - standard action controls
 */
export function TranslationKeyFormShell(props: TranslationKeyFormShellProps) {
  const {
    children,
    pending,
    submitDisabled = false,
    cancelLabel,
    submitLabel,
    pendingLabel,
    onCancel,
    onSubmit,
  } = props;

  return (
    <FormRoot noValidate aria-busy={pending} onSubmit={onSubmit}>
      {children}

      <FooterRoot>
        <Button
          type="button"
          variant="outlined"
          startIcon={<CloseRounded />}
          disabled={pending}
          onClick={onCancel}
        >
          <Typography variant="body2">
            <strong>{cancelLabel}</strong>
          </Typography>
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="success"
          startIcon={<SaveRounded />}
          loading={pending}
          loadingPosition="start"
          disabled={pending || submitDisabled}
        >
          <Typography variant="body2">
            <strong>{pending ? pendingLabel : submitLabel}</strong>
          </Typography>
        </Button>
      </FooterRoot>
    </FormRoot>
  );
}
