"use client";

import type { RazethAvatarContainerProps } from "@/interfaces/component-props.interface";
import { AccountCircleOutlined, LocalPoliceOutlined } from "@mui/icons-material";
import { Avatar, Chip as MuiChip } from "@mui/material";
import type { ReactNode } from "react";
import AvatarFrame from "@/components/CustomComponents/AvatarFrame";
import AvatarWrapper from "@/components/CustomComponents/AvatarWrapper";
import Box from "@mui/material/Box";
import { alpha, styled, useThemeProps } from "@mui/material/styles";

const PREFIX = "RazethAvatarContainer";
export interface AvatarContainerProps extends RazethAvatarContainerProps {
  fallback?: ReactNode;
  hoverIcon?: ReactNode;
  neumorphic?: boolean;
  softGlow?: boolean;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "relative",
  display: "inline-grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  width: "max(50px, 5rem)",
  maxWidth: "100%",
  flexShrink: 0,
  margin: "auto",
  // border: "1px solid #f0f0f0",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  justifyItems: "center",
  // padding: "0.75rem",
  // width: `max(50px, 5rem)`,
  // height: `max(50px, 5rem)`,
  transition: "all 0.5s",
  '&[data-soft-glow="true"]': {
    boxShadow: `0 0 20px 10px ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.3)}`,
  },
  '&[data-hover-icon="true"]:hover img, &[data-hover-icon="true"]:focus-within img': { opacity: 0 },
  '&[data-hover-icon="true"]:hover .MuiAvatar-root, &[data-hover-icon="true"]:focus-within .MuiAvatar-root': { opacity: 0 },
  'button:focus-visible &[data-hover-icon="true"] img, button:focus-visible &[data-hover-icon="true"] .MuiAvatar-root': { opacity: 0 },
}));

const Chip = styled(MuiChip, {
  name: PREFIX,
  slot: "Chip",
  overridesResolver: (_props, styles) => styles.chip,
})(({ theme }) => ({
  // width: "fit-content",
  // display: "flex-content",
  // padding: theme.spacing(0),
  marginTop: theme.spacing(-3),
  height: "1.35rem",
  fontSize: "0.725rem",
  fontWeight: 900,
  textTransform: "uppercase",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.primary.main, 0.555),
  // color: theme.palette.primary.main,
  color: alpha(theme.palette.common.white, 0.925),
  border: "none",
  zIndex: 999,
}));

const Foreground = styled(Avatar, {
  name: PREFIX,
  slot: "Foreground",
  overridesResolver: (_props, styles) => styles.foreground,
})(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  zIndex: 3,
  backgroundColor: "transparent",
  color: (theme.vars ?? theme).palette.common.white,
  transition: theme.transitions.create("opacity"),
  "& .MuiAvatar-img": { objectFit: "contain" },
  "& > .MuiSvgIcon-root": { fontSize: "3rem" },
}));

const AvatarContainer = (inProps: AvatarContainerProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, src, alt = "Avatar", fallback = <AccountCircleOutlined />, hoverIcon, neumorphic = true, softGlow = false,
    icon = defaultIcon, role, size = "small", color, variant, fontSize: _fontSize, ...rest } = props;
  return (
    <Root {...rest} data-hover-icon={hoverIcon != null} data-soft-glow={softGlow}>
      {/* <Wrapper> */}
      <AvatarFrame neumorphic={neumorphic}>
        <AvatarWrapper icon={hoverIcon}>
          {children ?? <Foreground src={src} alt={alt} role="img" aria-label={alt} slotProps={{ img: { "aria-hidden": true } }}>{fallback}</Foreground>}
        </AvatarWrapper>
      </AvatarFrame>
      {role != null && <Chip icon={icon} label={role} size={size} color={color} variant={variant} />}
      {/* </Wrapper> */}
    </Root>
  );
};

const defaultIcon = <LocalPoliceOutlined fontSize="inherit" color="inherit" />;

export default AvatarContainer;
