"use client";

import { Button, Typography } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";

const PREFIX = "RazethResourceActionButton";

const Root = styled(Button, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  borderRadius: 999,
  paddingInline: theme.spacing(2),
  fontWeight: 700,
  whiteSpace: "nowrap",
  boxShadow: theme.shadows[2],
}));

export interface ResourceActionButtonProps extends Omit<ButtonProps, "sx"> {}

/**
 * Resource-level action button.
 *
 * Keep the actual label inside MUI Typography rather than relying on the
 * Button's raw text line box. Our Khmer/Latin font stack has different ascent
 * metrics, and Typography gives the text the same body2 geometry everywhere:
 *
 *   icon  +  body2 label
 *
 * This is especially important in compact toolbars where a raw string can
 * appear a few pixels above the icon even though Button itself is centered.
 */
export function ResourceActionButton(inProps: ResourceActionButtonProps) {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const { children, ...rest } = props;

  return (
    <Root {...rest}>
      <Typography component="span" variant="body2">
        <strong>{children}</strong>
      </Typography>
    </Root>
  );
}
