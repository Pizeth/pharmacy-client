"use client";

import { Box, Card, styled } from "@mui/material";
import type { AuthProps } from "@/interfaces/component-props.interface";
import { cloudMove, moveBackgroundLeft, move, twinkle, fadeIn, fadeOut } from "@/theme/keyframes";
import type { AuthAction } from "@/types/auth";

const PREFIX = "RazethAuth";
export const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthProps>(() => ({
  cursor: "url(/static/cursors/yellow.svg), auto",
  background: `
    radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
    radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
    radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
    radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
    radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
    #000000
  `,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `
      repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
      radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
    `,
    backgroundSize: "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
    backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    backgroundImage: `
      repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
    `,
  },
}));
export const Overlay = styled(Box, {
  name: PREFIX,
  slot: "Overlay",
  overridesResolver: (_props, styles) => styles.overlay,
})(() => ({
  position: "relative",
  width: "100%",
  minHeight: "100dvh",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontFamily: "Montserrat",
  fontWeight: "bold",
  padding: "1em",
  overflow: "hidden",
  zIndex: 1,
  "& > *": {
    position: "relative",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    opacity: 1,
    transition: "1.5s ease",
    animationDelay: "0.4s",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    opacity: 1,
    transition: "2s ease",
    animationDelay: "0.8s",
  },
}));
export const Ambient = styled(Box, {
  name: PREFIX,
  slot: "Ambient",
  overridesResolver: (_props, styles) => styles.ambient,
})(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  background: `transparent url("/static/textures/clouds_repeat.png") repeat`,
  backgroundSize: "1000px 1000px",
  animation: `${cloudMove} 150s linear infinite`,
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "url(https://www.transparenttextures.com/patterns/stardust.png) repeat",
    backgroundSize: "contain",
    animation: `${moveBackgroundLeft} 700s linear infinite`,
  },
}));
export const Effect = styled(Box, {
  name: PREFIX,
  slot: "Effect",
  overridesResolver: (_props, styles) => styles.effect,
})(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  zIndex: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "1px",
    height: "1px",
    borderRadius: "50%",
    opacity: 1,
    inset: 0,
    zIndex: -1,
    transition: "3s ease",
    animation: `${twinkle} 5s linear alternate infinite`,
    animationDelay: "3s",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    opacity: 1,
    inset: 0,
    zIndex: -1,
    transition: "5.5s ease",
    animation: `${twinkle} 7s linear alternate infinite`,
    animationDelay: "5s",
  },
}));
export const Astronaut = styled(Box, {
  name: PREFIX,
  slot: "Image",
  overridesResolver: (_props, styles) => styles.image,
})(() => ({
  display: "flex",
  position: "absolute",
  width: "5em",
  height: "5em",
  top: "2.5rem",
  left: "2.5rem",
  zIndex: 10,
  img: { animation: `${move} 10s ease-in-out infinite`, zIndex: 10 },
  "&:hover": {
    cursor: "grab",
  },
  "&:active": {
    cursor: "grabbing",
  },
  "&::after": {
    content: '""',
    position: "fixed",
    top: "-5rem",
    left: "-5rem",
    width: "10em",
    height: "10em",
    borderRadius: "50%",
    backgroundImage: `url('/static/images/full-moon.svg')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "left",
    bottom: 0,
    backgroundColor: "#f9f9fb",
    backgroundBlendMode: "multiply",
    boxShadow: "0px 0px 100px rgba(193,119,241,0.8), 0px 0px 100px rgba(135,42,211,0.8), inset #9b40fc 0px 0px 40px -12px",
    transition: "0.5s ease-in-out",
    zIndex: -1,
  },
  "&:hover::before": {
    filter: "blur(3px)",
  },
  "&:hover::after": {
    boxShadow: "0px 0px 200px rgba(193,119,241,1), 0px 0px 200px rgba(135,42,211,1), inset #9b40fc 0px 0px 40px -12px",
  },
}));
export const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  flexShrink: 0,
  width: "100%",
  maxWidth: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: "min(80%, 750px)",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "max(750px, 50%)",
  },
  "& .MuiFormControl-root": {},
}));
export const LoginCard = styled(Card, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(({ theme }) => {
  const alpha8 = theme.alpha(theme.vars.palette.background.default, 0.08);
  const alpha2 = theme.alpha(theme.vars.palette.background.default, 0.02);
  return {
    position: "relative",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    backgroundImage: `
            radial-gradient(circle at 1px 1px, ${alpha8} 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, ${alpha2} 2px, ${alpha2} 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, ${alpha2}2px, ${alpha2} 4px)
          `,
    backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    backgroundColor: theme.vars.palette.background.paper,
    "& .MuiGrid-container": {
      position: "relative",
      zIndex: 1,
      backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
            `,
      backgroundSize: "44px 44px",
    },
    "& .MuiCardContent-root": {
      backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
    },
  };
});
export const ThemeToggleWrapper = styled(Box, {
  name: PREFIX,
  slot: "ThemeToggleWrapper",
})(() => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "1em",
  margin: "-1em -1em -2.5em 0",
}));
export const FormTransition = styled(Box, { name: PREFIX, slot: 'FormTransition', shouldForwardProp: prop => prop !== 'mode' })<{ mode: AuthAction }>(({ mode }) => ({ animation: `${mode === 'signin' ? fadeIn : fadeOut} 0.75s ease` }));
