"use client";

import React from "react";
import { styled, keyframes } from "@mui/material/styles";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const sunPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 0 0 0 rgba(255, 215, 0, 0.7),
      0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow:
      0 0 5px 2.5px rgba(255, 215, 0, 0.7),
      0 0 10px 5px rgba(255, 215, 0, 0.4);
  }
`;

const moonPhase = keyframes`
  0%, 100% {
    box-shadow:
      inset -10px -5px 0 0 #ddd,
      0 0 20px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow:
      inset 0 0 0 0 #ddd,
      0 0 20px rgba(255, 255, 255, 0.5);
  }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50%       { opacity: 1; }
`;

// ─── Prefix ───────────────────────────────────────────────────────────────────

const PREFIX = "DayNightSwitch";

// ─── Root ─────────────────────────────────────────────────────────────────────

const SwitchRoot = styled("label", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== "size",
})<{ size?: number }>(({ size = 24 }) => ({
  fontSize: `${size / 3}px`,
  display: "inline-block",
  width: "6em",
  height: "3em",
  position: "relative",
  userSelect: "none",
  cursor: "pointer",
}));

// ─── Hidden input ─────────────────────────────────────────────────────────────

const SwitchInput = styled("input", {
  name: PREFIX,
  slot: "Input",
  overridesResolver: (_props, styles) => styles.input,
})(() => ({
  opacity: 0,
  width: 0,
  height: 0,
  position: "absolute",
}));

// ─── Track ────────────────────────────────────────────────────────────────────

const SwitchTrack = styled("span", {
  name: PREFIX,
  slot: "Track",
  overridesResolver: (_props, styles) => styles.track,
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked?: boolean }>(({ checked }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "50px",
  transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1), inset 0 -5px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  transformStyle: "preserve-3d",
  perspective: "500px",

  background: checked
    ? "linear-gradient(to right, #1a237e, #3949ab)"
    : "linear-gradient(to right, #87ceeb, #e0f6ff)",

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    transition: "all 0.6s ease",
    opacity: checked ? 1 : 0,
  },
  "&::before": {
    top: "20%",
    left: "30%",
    animation: checked ? `${twinkle} 2s 0.5s infinite` : "none",
  },
  "&::after": {
    bottom: "25%",
    right: "25%",
    animation: checked ? `${twinkle} 2s infinite` : "none",
  },

  "&:hover": {
    background: checked
      ? "linear-gradient(to right, #283593, #5c6bc0)"
      : "linear-gradient(to right, #64b5f6, #e3f2fd)",
  },

  "&:focus-within": {
    outline: "2px solid #4a90e2",
    outlineOffset: "2px",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&::before, &::after": { animation: "none" },
  },

  "@media (forced-colors: active)": {
    background: checked ? "Highlight" : "Canvas",
    border: "2px solid ButtonText",
  },
}));

// ─── Thumb ────────────────────────────────────────────────────────────────────

const SwitchThumb = styled("span", {
  name: PREFIX,
  slot: "Thumb",
  overridesResolver: (_props, styles) => styles.thumb,
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked?: boolean }>(({ checked }) => ({
  position: "absolute",
  top: "0.3em",
  left: "0.3em",
  height: "2.4em",
  width: "2.4em",
  borderRadius: "50%",
  transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 5px rgba(0,0,0,0.2)",

  backgroundColor: checked ? "#ffffff" : "#ffd700",
  transform: checked
    ? "translateX(3em) translateZ(5px) rotateY(180deg)"
    : "translateZ(5px)",
  animation: checked ? `${moonPhase} 5s infinite` : `${sunPulse} 3s infinite`,

  "&::before": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    transition: "all 0.6s ease",
    backgroundColor: checked ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
    width: checked ? "0.6em" : "1em",
    height: checked ? "0.6em" : "1em",
    top: checked ? "0.3em" : "-0.5em",
    left: checked ? "0.3em" : "-0.2em",
    opacity: 1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    transition: "all 0.6s ease",
    backgroundColor: checked ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.8)",
    width: checked ? "0.4em" : "1.2em",
    height: checked ? "0.4em" : "1.2em",
    bottom: checked ? "0.5em" : "-0.6em",
    right: checked ? "0.5em" : "-0.3em",
    opacity: 1,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    animation: "none",
  },

  "@media (forced-colors: active)": {
    backgroundColor: "ButtonFace",
  },
}));

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DayNightSwitchProps {
  size?: number;
  checked?: boolean;
  onChange?: () => void;
  "aria-label"?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DayNightSwitch = ({
  size = 24,
  checked = false,
  onChange,
  "aria-label": ariaLabel = "Toggle dark mode",
}: DayNightSwitchProps) => (
  <SwitchRoot size={size} aria-label={ariaLabel}>
    <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
    <SwitchTrack checked={checked}>
      <SwitchThumb checked={checked} />
    </SwitchTrack>
  </SwitchRoot>
);

export default DayNightSwitch;
