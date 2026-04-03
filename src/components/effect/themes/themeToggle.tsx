// import { ThemeContext } from "@emotion/react";
import IconButton from "@mui/material/IconButton";
import { useThemeControl } from "./theme-wrapper";
import { Moon, Sun } from "lucide-react";
import { styled, useThemeProps } from "@mui/material/styles";
import { moonPhase, sunPulse, twinkleStar } from "@/theme/keyframes";
import { ThemeToggleProps } from "@/interfaces/component-props.interface";
import DayNightSwitch from "@/components/CustomComponents/DaynightSwitch";
// import { useContext } from "react";
// import { ThemeContext } from "./theme-wrapper";

// export const useThemeControl = () => useContext(ThemeContext);

const PREFIX = "RazethThemeToggle";

// ─── Shared prop types ────────────────────────────────────────────────────────

/**
 * `size` is in px and mirrors the MUI icon convention.
 * Default 24 matches MUI's default icon size.
 * The component uses `size / 3` as its internal em base so that
 * height === size px (since the original design is 3em tall).
 */
interface SwitchOwnerState {
  size?: number;
}

const Root = styled("label", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== "size",
})<SwitchOwnerState>(({ size = 24 }) => ({
  // base font-size drives all em values below
  // height = 3em → fontSize = size / 3
  fontSize: `${size / 3}px`,

  display: "inline-block",
  width: "6em",
  height: "3em",
  position: "relative",
  userSelect: "none",
  cursor: "pointer",
}));

// ─── Hidden input ─── //
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

// ─── Track (slider) ─── //

const SwitchTrack = styled("span", {
  name: PREFIX,
  slot: "Track",
  overridesResolver: (_props, styles) => styles.track,
})(({ theme }) => ({
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to right, #87ceeb, #e0f6ff)",
  borderRadius: "50px",
  transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1), inset 0 -5px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  transformStyle: "preserve-3d",
  perspective: "500px",

  // star dots
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    transition: "all 0.6s ease",
    opacity: 0,
  },
  "&::before": { top: "20%", left: "30%" },
  "&::after": { bottom: "25%", right: "25%" },

  // ── checked (night) state driven by sibling input ── //
  "input:checked + &": {
    background: "linear-gradient(to right, #1a237e, #3949ab)",
  },
  "input:checked + &::before, input:checked + &::after": {
    opacity: 1,
    animation: `${twinkleStar} 2s infinite`,
  },
  "input:checked + &::before": {
    animationDelay: "0.5s",
  },

  // hover
  "label:hover &": {
    background: "linear-gradient(to right, #64b5f6, #e3f2fd)",
  },
  "input:checked:hover + &": {
    background: "linear-gradient(to right, #283593, #5c6bc0)",
  },

  // focus
  "input:focus + &": {
    // outline: "2px solid #4a90e2",
    outline: `1px solid ${theme.palette.primary.main}`,
    outlineOffset: "1px",
  },

  // reduced motion
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&::before, &::after": { animation: "none" },
  },

  // high contrast
  "@media (forced-colors: active)": {
    background: "Canvas",
    border: "2px solid ButtonText",
    "input:checked + &": { background: "Highlight" },
  },
}));

// ─── Thumb (slider-inner) ─── //

const SwitchThumb = styled("span", {
  name: PREFIX,
  slot: "Thumb",
  overridesResolver: (_props, styles) => styles.thumb,
})(() => ({
  position: "absolute",
  top: "0.3em",
  left: "0.3em",
  height: "2.4em",
  width: "2.4em",
  borderRadius: "50%",
  backgroundColor: "#ffd700",
  transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 5px rgba(0,0,0,0.2)",
  transform: "translateZ(5px)",
  animation: `${sunPulse} 3s infinite`,

  // cloud puffs (day mode)
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "50%",
    transition: "all 0.6s ease",
  },
  "&::before": {
    width: "1em",
    height: "1em",
    top: "-0.5em",
    left: "-0.2em",
  },
  "&::after": {
    width: "1.2em",
    height: "1.2em",
    bottom: "-0.6em",
    right: "-0.3em",
  },

  // ── night state ────────────────────────────────────────────────────────────
  "input:checked + * > &": {
    transform: "translateX(3em) translateZ(5px) rotateY(180deg)",
    backgroundColor: "#ffffff",
    animation: `${moonPhase} 5s infinite`,
  },

  // crater overrides (night: hide clouds, show craters)
  "input:checked + * > &::before": {
    width: "0.6em",
    height: "0.6em",
    backgroundColor: "rgba(0,0,0,0.2)",
    top: "0.3em",
    left: "0.3em",
    opacity: 1,
  },
  "input:checked + * > &::after": {
    width: "0.4em",
    height: "0.4em",
    backgroundColor: "rgba(0,0,0,0.15)",
    bottom: "0.5em",
    right: "0.5em",
    opacity: 1,
  },

  // reduced motion
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    animation: "none",
    "input:checked + * > &": { animation: "none" },
  },

  // high contrast
  "@media (forced-colors: active)": {
    backgroundColor: "ButtonFace",
  },
}));

// ─── Component ────────────────────────────────────────────────────────────────

const DayNightSwitch1 = (
  inProps: ThemeToggleProps,
  //   {
  //   size = 24,
  //   checked = false,
  //   onChange,
  //   "aria-label": ariaLabel = "Toggle dark mode",
  // }: ThemeToggleProps
) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    size = 24,
    checked = false,
    onChange,
    ariaLabel = "Toggle dark mode",
    ...rest
  } = props;

  return (
    <Root
      color="inherit"
      size={size}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-haspopup="true"
      // checked={mode === "dark"}
      {...rest}
    >
      <SwitchInput
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <SwitchTrack>
        <SwitchThumb />
      </SwitchTrack>
    </Root>
  );
};

const ThemeToggle = () => {
  const { toggleTheme, mode } = useThemeControl();
  console.log(mode);

  return <DayNightSwitch checked={mode === "dark"} onChange={toggleTheme} />;

  // return (
  //   <IconButton
  //     color="inherit"
  //     size="large"
  //     // edge="end"
  //     aria-label="Theme toggle"
  //     aria-haspopup="true"
  //     onClick={toggleTheme}
  //     // sx={{
  //     //   position: "fixed",
  //     //   top: "2.5vmin",
  //     //   right: "2.5vmin",
  //     //   border: "1px solid",
  //     //   borderColor: "divider",
  //     //   mt: 0.5,
  //     //   // borderRadius: 2,
  //     //   opacity: 0.5,
  //     //   "&:hover": { opacity: 1 },
  //     // }}
  //   >
  //     {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
  //   </IconButton>
  // );
};

export default ThemeToggle;
