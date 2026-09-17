"use client";

import { Button } from "@mui/material";
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

export function ResourceActionButton(inProps: ResourceActionButtonProps) {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  return <Root {...props} />;
}
