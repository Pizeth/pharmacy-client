"use client";

import Box from "@mui/material/Box";
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

const sunPulse1 = keyframes`
  0%, 100% {
    box-shadow:
      0 0 12px 2px rgba(255, 165, 0, 0.6),
      0 0 24px 6px rgba(255, 215, 0, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow:
      0 0 20px 6px rgba(255, 165, 0, 0.8),
      0 0 40px 12px rgba(255, 215, 0, 0.4),
      inset 0 -2px 6px rgba(0, 0, 0, 0.1);
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

const twinkleA = keyframes`
  0%, 100% { 
    opacity: 0.15; 
    transform: scale(0.95) translateZ(0); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.05) translateZ(0); 
  }
`;

const twinkleB = keyframes`
  0%, 100% { 
    opacity: 0.9; 
    transform: scale(1.05) translateZ(0); 
  }
  50% { 
    opacity: 0.2; 
    transform: scale(0.95) translateZ(0); 
  }
`;

// ─── Prefix ───────────────────────────────────────────────────────────────────

const PREFIX = "DayNightSwitch";

// ─── Root ─────────────────────────────────────────────────────────────────────

const SwitchRoot = styled("label", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== "size",
})<{ size?: number }>(({ size = 24, theme }) => ({
  fontSize: `${size / 3}px`,
  display: "flex",
  width: "6em",
  height: "3em",
  position: "relative",
  userSelect: "none",
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "50px",
  border: `0.5px solid ${theme.alpha(theme.vars.palette.text.primary, 0.0925)}`,
  boxShadow: theme.vars.palette.customShadows.neumorphic,
  // Sleek organic border integrating with your glassmorphism form card
  // border: `1px solid ${theme.alpha?.(theme.vars.palette.text.primary, 0.08) || "rgba(255,255,255,0.1)"}`,
  // boxShadow:
  //   theme.vars?.palette?.customShadows?.neumorphic ||
  //   "0 10px 25px -5px rgba(0,0,0,0.3)",
  // transition: "transform 0.2s ease",
  "&:active": {
    transform: "scale(0.95)", // Micro-haptic compression feedback when pressed
  },
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
  // transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  // boxShadow: "0 4px 8px rgba(0,0,0,0.1), inset 0 -5px 10px rgba(0,0,0,0.1)",
  // Ultra premium spring physics transition curve (removes backward-jerk overshoot)
  transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
  // boxShadow:
  //   "inset 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(255, 255, 255, 0.05)",
  boxShadow: checked
    ? "1px 1px 5px 0 #3949ab inset"
    : // : "inset 0 0 10px rgba(255, 140, 0, 0.3)",
      // : "1px 1px 5px 0 #e0f6ff inset",
      "1px 1px 5px 0 rgba(255, 140, 0, 0.3) inset",
  overflow: "hidden",
  transformStyle: "preserve-3d",
  perspective: "500px",

  // background: checked
  //   ? "linear-gradient(to right, #1a237e, #3949ab)"
  //   : "linear-gradient(to right, #87ceeb, #e0f6ff)",

  // Theme-informed cinematic track environments
  background: checked
    ? "linear-gradient(135deg, #0b0f19 0%, #161f33 50%, #22304d 100%)" // Cinematic Nebula Space
    : "linear-gradient(to right, #87ceeb 0%, #e0f6ff 60%, #eef7ff 100%)",
  // : "linear-gradient(135deg, #7ec4fc 0%, #bce3ff 60%, #eef7ff 100%)", // Crisp Morning Sky

  // "&::before, &::after": {
  //   content: '""',
  //   position: "absolute",
  //   width: "5px",
  //   height: "5px",
  //   backgroundColor: "#ffffff",
  //   borderRadius: "50%",
  //   transition: "all 0.55s ease",
  //   opacity: checked ? 1 : 0,
  // },
  // "&::before": {
  //   top: "20%",
  //   left: "30%",
  //   animation: checked ? `${twinkle} 2s 0.5s infinite` : "none",
  // },
  // "&::after": {
  //   bottom: "25%",
  //   right: "25%",
  //   animation: checked ? `${twinkle} 2s infinite` : "none",
  // },

  // High-fidelity Star Dust Rendering via pseudo-elements
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    transition: "all 0.55s ease",
    opacity: checked ? 1 : 0,
  },

  // Star Dust Cluster Alpha
  "&::before": {
    top: "15%",
    left: "35%",
    width: "3px",
    height: "3px",
    boxShadow:
      "22px 14px 0 -0.5px #fff, -8px 10px 0 0.5px rgba(255,255,255,0.4), 38px -2px 0 0 #fff",
    animation: checked ? `${twinkleA} 3s infinite ease-in-out` : "none",
  },

  // Star Dust Cluster Beta
  "&::after": {
    bottom: "15%",
    right: "55%",
    width: "1px",
    height: "1px",
    boxShadow:
      "-28px 2px 0 1px rgba(255,255,255,0.7), -14px -12px 0 0 #fff, 12px -10px 0 0.5px rgba(255,255,255,0.5)",
    animation: checked ? `${twinkleB} 2.5s infinite ease-in-out` : "none",
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
  // transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  // boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 5px rgba(0,0,0,0.2)",
  backgroundColor: checked ? "#ffffff" : "#ffd700",
  background: checked
    ? "#ffffff"
    : // : `radial-gradient(
      //       circle,
      //       #ff7f00,
      //       #ffa500
      //     )`,
      `radial-gradient(
          circle at 30% 20%,
          #ff4500 15%,
          #ff7f00 35%,
          #ff8c00 55%,
          #ffa500 75%,
          #ffd700 100%
        )`,
  transform: checked
    ? "translateX(3em) translateZ(5px) rotateY(180deg)"
    : "translateZ(5px)",
  animation: checked ? `${moonPhase} 5s infinite` : `${sunPulse} 2.5s infinite`,
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
    boxShadow: checked
      ? `
        inset 1px 1px 2px rgba(0,0,0,0.4),
        0.5px 0.5px 0 #fff,
        0.8em 0.7em 0 -0.05em rgba(0,0,0,0.12),
        0.8em 0.7em 0 0 rgba(255,255,255,0.4),
        0.8em 0.7em 0 0.05em rgba(0,0,0,0.2)
      `
      : "none",
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
    // Complex organic depth rendering for Crater 3 & 4
    boxShadow: checked
      ? `
          inset 1px 1px 2px rgba(0,0,0,0.4),
          0.5px 0.5px 0 #fff,
          -0.7em -0.6em 0 -0.08em rgba(0,0,0,0.15),
          -0.7em -0.6em 0 -0.05em rgba(255,255,255,0.5)
        `
      : "none",
  },

  transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Dynamic 3D lighting offsets depending on spatial position
  // transform: checked
  //   ? "translateX(3em) translateZ(10px) rotate(-140deg)"
  //   : "translateZ(10px) rotate(0deg)",
  // Spatial Object Properties
  // backgroundColor: checked ? "#d1d5db" : "#ffbd00",
  // animation: checked ? "none" : `${sunPulse} 4s infinite ease-in-out`,

  // Realistic Lunar Crater Mapping using Multi-layered Inset Shadows
  boxShadow: checked
    ? `
      inset -4px -4px 8px rgba(0, 0, 0, 0.4),
      inset 4px 4px 6px rgba(255, 255, 255, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.5)
    `
    : `
      0 0 30px rgba(255, 165, 0, 0.8),
      0 0 60px rgba(255, 165, 0, 0.4)
    `,
  // : `
  //   inset -3px -3px 6px rgba(0, 0, 0, 0.15),
  //   inset 3px 3px 6px rgba(255, 255, 255, 0.6),
  //   0 6px 16px rgba(255, 140, 0, 0.35)
  // `,

  // High-end Lunar surface topography craters via procedural shadow-mapping
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   borderRadius: "50%",
  //   width: "0.5em",
  //   height: "0.5em",
  //   top: "0.4em",
  //   left: "0.5em",
  //   backgroundColor: "transparent",
  //   transition: "all 0.4s ease",
  //   opacity: checked ? 1 : 0,
  //   // Complex organic depth rendering for Crater 1 & 2
  //   boxShadow: checked
  //     ? `
  //       inset 1px 1px 2px rgba(0,0,0,0.4),
  //       0.5px 0.5px 0 #fff,
  //       0.8em 0.7em 0 -0.05em rgba(0,0,0,0.12),
  //       0.8em 0.7em 0 0 rgba(255,255,255,0.4),
  //       0.8em 0.7em 0 0.05em rgba(0,0,0,0.2)
  //     `
  //     : "none",
  // },

  // "&::after": {
  //   content: '""',
  //   position: "absolute",
  //   borderRadius: "50%",
  //   width: "0.35em",
  //   height: "0.35em",
  //   bottom: "0.5em",
  //   right: "0.6em",
  //   backgroundColor: "transparent",
  //   transition: "all 0.4s ease",
  //   opacity: checked ? 1 : 0,
  //   // Complex organic depth rendering for Crater 3 & 4
  //   boxShadow: checked
  //     ? `
  //       inset 1px 1px 2px rgba(0,0,0,0.4),
  //       0.5px 0.5px 0 #fff,
  //       -0.7em -0.6em 0 -0.08em rgba(0,0,0,0.15),
  //       -0.7em -0.6em 0 -0.05em rgba(255,255,255,0.5)
  //     `
  //     : "none",
  // },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    animation: "none",
  },

  "@media (forced-colors: active)": {
    backgroundColor: "ButtonFace",
  },
}));

const SwitchDecoration = styled("span", {
  name: PREFIX,
  slot: "Decoration",
  overridesResolver: (_props, styles) => styles.decoration,
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked?: boolean }>(({ checked }) => ({
  position: "absolute",
  content: '""',
  transform: checked ? "translateX(-20px)" : "none",
  height: checked ? "1px" : "7px",
  width: checked ? "1px" : "7px",
  borderRadius: "50%",
  right: "5%",
  top: "10%",
  background: "#FFF",
  backdropFilter: "blur(10px)",
  transition: "all 0.5s",
  boxShadow: checked
    ? `
      -7px 10px 0 #e5f041e6,
      8px 15px 0 #e5f041e6,
      -17px 1px 0 #e5f041e6,
      -20px 10px 0 #e5f041e6,
      -7px 23px 0 #e5f041e6,
      -15px 25px 0 #e5f041e6
    `
    : `
      -12px 0 0 #FFF,
      -6px 0 0 1.75px #FFF,
      -19px 12px 0 1px #FFF,
      -23px 15px 0 #FFF,
      -14px 15px 0 #FFF
    `,
}));

const SwitchGlow = styled(Box, {
  name: PREFIX,
  slot: "Glow",
  overridesResolver: (_props, styles) => styles.glow,
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked?: boolean }>(({ checked }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255, 140, 0, 0.3), transparent)",
  boxShadow:
    " 5px 5px 10px rgba(0, 0, 0, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.7), inset 0 2px 5px rgba(255, 255, 255, 0.3), 2px 2px 3px rgba(255, 255, 255, 0.2)",
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
      <SwitchThumb checked={checked}>
        <SwitchGlow />
      </SwitchThumb>
    </SwitchTrack>
    <SwitchDecoration checked={checked} />
  </SwitchRoot>
);

export default DayNightSwitch;
