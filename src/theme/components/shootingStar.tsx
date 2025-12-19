import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  infiniteRotate,
  shootingStar,
  tail,
  twinkle,
  twinkling,
} from "../keyframes";
import { ShootingStarProps } from "@/interfaces/component-props.interface";

const PREFIX = "RazethShootingStar";

// Styled components - OPTIMIZED with pseudo-elements
const ShootingStarRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  // ✅ FIX: Filter out custom props so they don't reach the DOM
  shouldForwardProp: (prop) =>
    ![
      "path",
      "duration",
      "color",
      "size",
      "glow",
      "centerPoint",
      "halfHead",
      "head",
      "baseSize",
      "twinkleDuration",
    ].includes(prop as string),
})<{
  path: string;
  duration: string;
  // delay: string;
  color: string;
  size: string;
  glow: string;
  centerPoint: string;
  halfHead: string;
  head: string;
  baseSize: number;
  twinkleDuration: string;
}>(
  ({
    path,
    duration,
    // delay,
    color,
    size,
    glow,
    centerPoint,
    halfHead,
    head,
    baseSize,
    twinkleDuration,
  }) => ({
    // position: "absolute",
    filter: `drop-shadow(0 0 7px ${color})`,
    animation: `${shootingStar} ${duration} linear forwards, ${tail} ${duration} linear forwards`,
    animationFillMode: "forwards",
    willChange: "transform, opacity", // ✅ GPU optimization
    offsetRotate: "auto" /* 👈 aligns with path direction */,
    offsetAnchor: "right center",
    offsetDistance: "0%",
    offsetPath: path,
    height: size,
    borderRadius: "500% 100% 100% 500%",
    background: `linear-gradient(-45deg, ${color}, rgba(0, 0, 255, 0))`,
    "--head-color": color,
    "--trail-path": path,
    "--glow-duration": duration,

    // Head element (nested span)
    "& > span": {
      // position: "absolute",
      // zIndex: 3,
      boxShadow: glow,
      right: `calc(${centerPoint} - ${halfHead})`,
      top: `calc(50% - ${halfHead})`,
      transform: `translateY(calc(-50% + ${halfHead}))`,
      height: head,
      width: head,
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        'url("/static/images/moon_in_comic_style.svg") no-repeat center center',
      // backgroundColor: "#FFFFFF10",
      // backgroundBlendMode: "multiply",
      backgroundSize: "cover",
      animation: `${twinkle} ${twinkleDuration} linear alternate infinite, ${infiniteRotate} calc(${twinkleDuration} + 0.123s) linear infinite`,
      willChange: "transform, opacity", // ✅ GPU optimization
    },

    // ✅ TAIL 1: Using ::before pseudo-element
    "::before": {
      // content: '""',
      // position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(45deg)",
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      animationFillMode: "backwards",
      willChange: "width, transform", // ✅ GPU optimization
      // boxShadow: glow,
    },

    // ✅ TAIL 2: Using ::after pseudo-element
    "::after": {
      // content: '""',
      // position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(-45deg)",
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      animationFillMode: "backwards",
      willChange: "width, transform", // ✅ GPU optimization
      // boxShadow: glow,
    },
  })
);

/**
 * A React component that renders a shooting star animation.
 * It takes a `ShootingStarProps` object as a prop, which contains
 * the following properties:
 * - `path`: The SVG path for the star.
 * - `duration`: The duration of the animation in seconds.
 * - `delay`: The delay of the animation in seconds.
 * - `color`: The color of the star.
 * - `size`: The size of the star.
 * - `glow`: The glow effect of the star.
 * - `centerPoint`: The center point of the star.
 * - `halfHead`: The half of the head of the star.
 * - `head`: The head of the star.
 * - `baseSize`: The base size of the star.
 * - `twinkleDuration`: The duration of the twinkling effect in seconds.
 * @param {ShootingStarProps} star - The props for the shooting star.
 * @returns {React.ReactElement} - The rendered shooting star animation.
 */
const ShootingStar: React.FC<ShootingStarProps> = ({ star }) => {
  return (
    <ShootingStarRoot
      path={star.path}
      duration={star.duration}
      // delay={star.delay}
      color={star.color}
      size={star.size}
      glow={star.glow}
      centerPoint={star.centerPoint}
      halfHead={star.halfHead}
      head={star.head}
      baseSize={star.baseSize}
      twinkleDuration={star.twinkleDuration}
    >
      <span />
    </ShootingStarRoot>
  );
};

export default ShootingStar;
