import React from "react";
import { Box, BoxProps, styled } from "@mui/material";

const PREFIX = "RAZETH-FLIP-ICON-WRAPPER";

export type FlipDirection = "horizontal" | "vertical" | "both" | "none";
export type IconRotation = "right" | "down" | "left" | "up";

interface FlipIconWrapperProps extends BoxProps {
  children: React.ReactNode;
  direction?: FlipDirection; // Controls reflection / mirroring
  rotate?: IconRotation; // Controls facing direction (includes your custom spacing)
}

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "direction",
  overridesResolver: (_props, styles) => styles.root,
})<Omit<FlipIconWrapperProps, "children">>(({
  theme,
  direction = "horizontal",
  rotate = "right",
}) => {
  // Determine scale values based on the string direction
  let scaleX = 1;
  let scaleY = 1;

  if (direction === "horizontal" || direction === "both") {
    scaleX = -1;
  }
  if (direction === "vertical" || direction === "both") {
    scaleY = -1;
  }

  // Calculate Facing Direction (Degrees)
  let degrees = 0;
  if (rotate === "down") degrees = 90;
  if (rotate === "left") degrees = 180;
  if (rotate === "up") degrees = -90; // Uses your exact -90deg rotation target

  // Integrate custom alignment offsets if the icon is rotated or flipped
  const needsOffset = rotate !== "right" || direction !== "none";
  const translateX = needsOffset ? "-1px" : "0px";
  const baseScaleX = rotate === "up" ? 0.9 : 1; // Uses your exact 0.9 squish when turned up

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    // Combines all steps: Rotation -> Scale Axis Adjustment -> Squish -> Shift
    transform: `rotate(${degrees}deg) scale(${scaleX * baseScaleX}, ${scaleY}) translateX(${translateX})`,
    // Smoothly animates both flips and turns simultaneously
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  };
});

export function FlipIconWrapper({
  children,
  direction = "horizontal", // Default configuration
  rotate = "right",
  ...props
}: FlipIconWrapperProps) {
  return (
    <Root component="span" direction={direction} rotate={rotate} {...props}>
      {children}
    </Root>
  );
}

export default FlipIconWrapper;
