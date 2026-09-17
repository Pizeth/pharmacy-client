"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import type { DialogProps } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { styled, useThemeProps } from "@mui/material/styles";

const PREFIX = "RazethFormDialog";

const Root = styled(Dialog, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const CardRoot = styled(Paper, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})({});

const HeaderRoot = styled(DialogTitle, {
  name: PREFIX,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})({});

const HeaderLayoutRoot = styled("div", {
  name: PREFIX,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 0,
});

const HeaderMainRoot = styled("div", {
  name: PREFIX,
  slot: "Main",
  overridesResolver: (_props, styles) => styles.main,
})({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
});

const HeaderIconRoot = styled("span", {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})({
  display: "inline-grid",
  placeItems: "center",
  flexShrink: 0,
});

const HeaderTextRoot = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({
  minWidth: 0,
});

const SubtitleRoot = styled(Typography, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})({});

const CloseButtonRoot = styled(IconButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})({});

const FormContentRoot = styled(DialogContent, {
  name: PREFIX,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({});

export interface FormDialogProps {
  readonly open: boolean;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly icon?: ReactNode;
  readonly pending?: boolean;
  readonly maxWidth?: DialogProps["maxWidth"];
  readonly fullWidth?: boolean;
  readonly closeAriaLabel?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

/**
 * Safe form dialog.
 *
 * Closure contract:
 *
 *   backdrop click   -> ignored
 *   Escape           -> ignored
 *   explicit X       -> closes
 *   explicit Close   -> caller/form closes
 *   successful save  -> caller closes
 *
 * This prevents accidental loss of partially entered form state.
 */
export function FormDialog(inProps: FormDialogProps) {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const {
    open,
    title,
    subtitle,
    icon,
    pending = false,
    maxWidth = "md",
    fullWidth = true,
    closeAriaLabel = "Close dialog",
    onClose,
    children,
  } = props;

  const titleId = useId();

  const subtitleId = useId();

  return (
    <Root
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      /**
       * Escape must never silently discard a form.
       */
      disableEscapeKeyDown
      /**
       * Dialog's onClose is intentionally NOT delegated to the caller.
       *
       * MUI currently reports backdropClick / escapeKeyDown here.
       * Both are presentation dismissals and are disallowed for forms.
       */
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      aria-labelledby={titleId}
      aria-describedby={subtitle ? subtitleId : undefined}
      slots={{
        paper: CardRoot,
      }}
    >
      <HeaderRoot>
        <HeaderLayoutRoot>
          <HeaderMainRoot>
            {icon && <HeaderIconRoot>{icon}</HeaderIconRoot>}

            <HeaderTextRoot>
              <Typography id={titleId} component="h2" variant="h6">
                {title}
              </Typography>

              {subtitle && (
                <SubtitleRoot id={subtitleId} variant="body2">
                  {subtitle}
                </SubtitleRoot>
              )}
            </HeaderTextRoot>
          </HeaderMainRoot>

          <CloseButtonRoot
            aria-label={closeAriaLabel}
            disabled={pending}
            onClick={onClose}
          >
            <CloseRounded />
          </CloseButtonRoot>
        </HeaderLayoutRoot>
      </HeaderRoot>

      <FormContentRoot dividers>{children}</FormContentRoot>
    </Root>
  );
}
