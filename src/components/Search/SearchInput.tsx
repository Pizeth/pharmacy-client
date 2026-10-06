"use client";
import { OutlinedInput, InputLabel, alpha, styled } from "@mui/material";
const PREFIX = "RazethSearch";
export const SearchInput = styled(OutlinedInput, {
  name: PREFIX,
  slot: "Input",
  overridesResolver: (_props, styles) => styles.input,
})(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 1),
  "&.Mui-focused .MuiSvgIcon-root": {
    color: theme.palette.error.main,
  },

  transition: theme.transitions.create(["background-color", "width"]),

  backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.05),
  backdropFilter: "blur(10px) saturate(150%)",
  border: `1px solid ${theme.alpha((theme.vars ?? theme).palette.text.primary, 0.075)}`,
  input: {
    fontFamily: "'Roboto Mono', monospace, var(--font-interkhmerloopless)", // Different font for input if desired
    fontSize: "0.925rem",
    color: (theme.vars ?? theme).palette.text.primary,
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create("width"),
    "&:focus": {
      color: theme.palette.error.main,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.25),
    svg: {
      fill: theme.palette.error.main,
      color: theme.palette.error.main,
      transition: "color 0.25s ease-in-out",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&.Mui-focused": {
    backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.07),
    boxShadow: `0 8px 32px 0 ${theme.alpha((theme.vars ?? theme).palette.common.black, 0.25)}`,
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
  },
  "& .MuiInputAdornment-root": {
    "&.MuiInputAdornment-positionStart": {
      opacity: 0.5,
      transform: "scaleX(-1)",
    },
    "&.MuiInputAdornment-positionEnd": {
      margin: theme.spacing(1),
      svg: {
        color: (theme.vars ?? theme).palette.text.primary,
      },
    },
    "&:hover": {
      svg: {
        fill: theme.palette.primary.main,
      },
    },
  },
}));

export const SearchLabel = styled(InputLabel, {
  name: PREFIX,
  slot: "Label",
  overridesResolver: (_props, styles) => styles.label,
})<{ shrink?: boolean }>(({ theme, shrink }) => ({
  left: shrink ? 0 : theme.spacing(4),
  padding: shrink ? theme.spacing(0, 1) : "none",
  fontFamily: "var(--font-interkhmerloopless)",
  // color: alpha(theme.palette.text.primary, 0.5),
  transform: !shrink
    ? "translate(14px, 9px) scale(1)"
    : "translate(14px, -9px) scale(0.75)",
  pointerEvents: "none",
  // color: theme.palette.error.main,
  borderRadius: "var(--app-border-radius)",
  // backgroundColor: shrink ? theme.palette.background.paper : "transparent",
  backgroundColor: shrink
    ? theme.alpha((theme.vars ?? theme).palette.background.default, 0.05)
    : "transparent",
  backdropFilter: "blur(10px) saturate(150%)",
  // border: `1px solid ${alpha(theme.palette.common.white, 0.075)}`,
  // Color when focused
  "&:hover": {
    color: theme.palette.error.main,
  },
  "&.Mui-focused": {
    color: theme.palette.error.main,
  },
}));

