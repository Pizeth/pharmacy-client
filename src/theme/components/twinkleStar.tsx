import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { fadeIn, fadeOut, twinkle, twinkling } from "../keyframes";
import { TwinkleStarProps } from "@/interfaces/component-props.interface";

const PREFIX = "RazethTwinkleStar";

// Styled component - OPTIMIZED with pseudo-elements
const TwinkleStarRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) =>
    !["centerPoint", "baseSize", "isFadingOut"].includes(prop as string),
})<{
  top: string;
  left: string;
  size: string;
  glow: string;
  delay: string;
  centerPoint: string;
  color: string;
  baseSize: number;
  isFadingOut: boolean;
}>(
  ({
    top,
    left,
    size,
    glow,
    delay,
    centerPoint,
    color,
    baseSize,
    isFadingOut,
  }) => ({
    // position: "absolute",
    left,
    top,
    width: size,
    height: size,
    borderRadius: "50%",
    boxShadow: glow,
    animation: isFadingOut
      ? `${fadeOut} 0.8s ease-out forwards`
      : `${fadeIn} 0.5s ease-out, ${twinkle} ${delay} linear alternate infinite 0.5s`,
    pointerEvents: "none",
    background: "#FFF",
    // zIndex: 3,
    willChange: "transform, opacity", // ✅ GPU optimization

    // ✅ RAY 1: Using ::before pseudo-element (45° rotation)
    "::before": {
      //   content: '""',
      //   position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(45deg)",
      animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
      willChange: "width, transform", // ✅ GPU optimization
    },

    // ✅ RAY 2: Using ::after pseudo-element (-45° rotation)
    "::after": {
      //   content: '""',
      //   position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(-45deg)",
      animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
      willChange: "width, transform", // ✅ GPU optimization
    },
  })
);

/**
 * TwinkleStar is a React component that renders a single
 * twinkling star animation. It takes a single prop `star`
 * which is an object containing the following properties:
 * - top: string - the top position of the star
 * - left: string - the left position of the star
 * - size: string - the size of the star
 * - glow: string - the box-shadow glow effect
 * - delay: string - the animation delay
 * - centerPoint: string - the center point of the star
 * - color: string - the color of the star
 * - baseSize: number - the base size of the star
 * - isFadingOut: boolean - whether the star is fading out
 */
const TwinkleStar: React.FC<TwinkleStarProps> = ({ star }) => {
  return (
    <TwinkleStarRoot
      top={star.top}
      left={star.left}
      size={star.size}
      glow={star.glow}
      delay={star.delay}
      centerPoint={star.centerPoint}
      color={star.color}
      baseSize={star.baseSize}
      isFadingOut={star.isFadingOut}
    />
  );
};

export default TwinkleStar;
