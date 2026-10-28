"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import NextLink from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import type { DialogProps, DialogTitleProps, IconButtonProps } from "@mui/material";
import { CloseRounded, OpenInNewRounded } from "@mui/icons-material";
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
})({
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100dvh - 64px)",
  minHeight: 0,
  overflow: "hidden",
});

const HeaderRoot = styled(DialogTitle, {
  name: PREFIX,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})<DialogTitleProps>({});

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

const HeaderButtonRoot = styled(IconButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})({});

const HeaderLinkRoot = styled(IconButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})<IconButtonProps<"a">>({});

const HeaderActionsRoot = styled("div", {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})(({ theme }) => ({ display: "flex", alignItems: "center", flexShrink: 0, gap: theme.spacing(0.5) }));

const FormContentRoot = styled(DialogContent, {
  name: PREFIX,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({ minHeight: 0, overflowY: "auto" });

export interface FormDialogProps {
  readonly open: boolean;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly icon?: ReactNode;
  readonly pending?: boolean;
  readonly maxWidth?: DialogProps["maxWidth"];
  readonly fullWidth?: boolean;
  readonly closeAriaLabel?: string;
  readonly dedicatedPageHref?: string;
  readonly dedicatedPageLabel?: string;
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
    dedicatedPageHref,
    dedicatedPageLabel = "Open dedicated page",
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
      <HeaderRoot component="div">
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

          <HeaderActionsRoot>
            {dedicatedPageHref && <Tooltip title={dedicatedPageLabel}>
              <span>
                {pending ? <HeaderButtonRoot size="small" disabled aria-label={dedicatedPageLabel}><OpenInNewRounded fontSize="small" /></HeaderButtonRoot>
                  : <HeaderLinkRoot size="small" component={NextLink} href={dedicatedPageHref} aria-label={dedicatedPageLabel}><OpenInNewRounded fontSize="small" /></HeaderLinkRoot>}
              </span>
            </Tooltip>}
            <HeaderButtonRoot
              aria-label={closeAriaLabel}
              disabled={pending}
              onClick={onClose}
            >
              <CloseRounded />
            </HeaderButtonRoot>
          </HeaderActionsRoot>
        </HeaderLayoutRoot>
      </HeaderRoot>

      <FormContentRoot dividers>{children}</FormContentRoot>
    </Root>
  );
}
