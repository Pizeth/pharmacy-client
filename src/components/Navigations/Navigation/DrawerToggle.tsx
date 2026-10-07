"use client";

import { styled, useThemeProps } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import type { DrawerToggleProps } from "@/interfaces/component-props.interface";
import AvatarContainer from "@/components/Avatar/AvatarContainer";

const PREFIX = "RazethNavToggle";
const Root = styled(AvatarContainer, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  maxWidth: `calc(100% - ${theme.spacing(2)})`,
  margin: theme.spacing(1),
}));

export default function DrawerToggle(inProps: DrawerToggleProps) {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, icon = <MenuIcon />, neumorphic = false, softGlow = true, wrapper: _wrapper, circleSize: _circleSize,
    circleColor: _circleColor, logoOffset: _logoOffset, color: _color, ...rest } = props;
  return <Root {...rest} hoverIcon={icon} neumorphic={neumorphic} softGlow={softGlow}>{children}</Root>;
}
