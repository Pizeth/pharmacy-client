import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { meteorStrike } from "../keyframes";
import { MeteorElementProps } from "@/interfaces/auth.interface";
import { parseUnit } from "@/utils/themeUtils";
import { useEffect, useState } from "react";

const PREFIX = "RazethMeteor";

// Styled root container
const MeteorRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(() => ({
  //   position: "absolute",
  //   inset: 0,
  //   width: "100%",
  //   height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  //   zIndex: 1,
  willChange: "contents", // ✅ Optimize for dynamic content
}));

// Meteor item container
const MeteorItem = styled(Box, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})(() => ({
  //   position: "absolute",
  willChange: "transform", // ✅ GPU optimization for animations
  pointerEvents: "none",
}));

// Meteor sprite with animation
const MeteorSprite = styled(Box, {
  name: PREFIX,
  slot: "Content",
  // Prevent 'size' from being passed to the DOM element
  shouldForwardProp: (prop: string) => prop !== "size",
  overridesResolver: (_props, styles) => styles.content,
})<{ size: string | number }>(({ size }) => ({
  // We handle the dynamic size here because it changes per-meteor
  // but relies on the CSS-in-JS engine.
  width: size,
  height: size,
  backgroundImage:
    "url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/meteors-right/images/meteors-sprite.png)",
  backgroundSize: "4800% 100%", // 48 frames
  backgroundRepeat: "no-repeat",
  animation: `${meteorStrike} 2.5s steps(47) infinite`,
  transform: "rotate(45deg)",
  willChange: "background-position", // ✅ GPU optimization for sprite animation
}));

/**
 * MeteorElement
 * A React component that renders a single meteor item.
 *
 * @param {MeteorElementProps} props - Component props
 * @param {MeteorState} props.meteor - Meteor state object
 * @param {number} props.containerHeight - Height of the container in pixels
 * @returns {React.ReactElement} - A React element representing the meteor item
 *
 * This component will calculate the duration of the animation based on the distance
 * the meteor needs to travel. The animation will be triggered after the component has been mounted.
 * The component uses CSS Variables to pass data to the theme, which can then use it to style the
 * element. The theme is free to decide how to use the data.
 */

const MeteorElement: React.FC<MeteorElementProps> = ({
  meteor,
  containerHeight,
}) => {
  //   const [transform, setTransform] = useState(
  //     `translate(${meteor.size}px, -${meteor.size}px)`
  //   );

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       const distance =
  //         containerHeight - (meteor.startFromTop ? meteor.initialTop : 0);
  //       setTransform(`translate(-${distance}px, ${distance}px)`);
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }, [meteor, containerHeight]);

  // 1. Convert size to raw pixels for calculation
  const sizePx = parseUnit(meteor.size, containerHeight);

  // 2. Initial state: hidden slightly off-screen (top-right relative to spawn)
  // We use sizePx directly, no need to append 'px' manually if we assume pixels in transform
  const [transform, setTransform] = useState<string>(
    `translate3d(${sizePx}px, -${sizePx}px, 0)` // Use 3d for GPU acceleration
  );

  // State for dynamic duration
  const [duration, setDuration] = useState<string>("0s");

  useEffect(() => {
    // 3. Calculate Travel Distance
    // The meteor travels from its random start point down to the bottom of the container.
    // distanceToTravel = Height of Container - Start Position + Offset
    const startY = meteor.startFromTop ? meteor.initialTop : 0;

    // Total vertical distance to travel (Container + buffer to clear edge)
    const distanceY = containerHeight - startY + sizePx; // Add size to ensure it clears the bottom

    // 4. Calculate Duration based on Distance and Base Speed (Velocity)
    // meteor.speed now acts as "Velocity Factor" (Lower = Faster, Higher = Slower)
    // Formula: Time = Distance * (Slowness Factor)
    // We divide by 1000 to keep numbers manageable.
    // Example: 800px distance * 0.005 factor = 4s duration.

    // Velocity = Pixels per Second.
    // We increase base velocity for longer distances to add "energy".
    // Base speed comes from config (e.g., 5).
    const baseVelocity = meteor.speed * 0.001;

    // "The longer the distance, the faster the speed"
    // We can reduce the duration slightly for very long distances to simulate acceleration
    // const accelerationFactor = distanceY > 1500 ? 0.85 : 1;

    // If distance is huge (>1000px), we boost velocity by 20%
    // This makes long meteors zip across faster.
    const accelerationFactor = distanceY > 1500 ? 1.25 : 1;

    // const calculatedDuration = distanceY * baseVelocity * accelerationFactor;

    // Time = (Distance * Velocity) / Acceleration
    const calculatedDuration = (distanceY * baseVelocity) / accelerationFactor;

    // setDuration(calculatedDuration);

    setDuration(`${calculatedDuration.toFixed(2)}s`);

    // 5. Trigger Animation
    // Trigger animation after mount
    const timer = setTimeout(() => {
      // const distance =
      //   containerHeight - (meteor.startFromTop ? meteor.initialTop : 0);
      setTransform(`translate3d(-${distanceY}px, ${distanceY}px, 0)`);
    }, 100);

    return () => clearTimeout(timer);
  }, [meteor, containerHeight, sizePx]);

  return (
    <MeteorItem
      //   sx={{
      //     left: meteor.left,
      //     top: meteor.top,
      //     zIndex: meteor.zIndex,
      //     transform: transform,
      //     transition: `transform ${meteor.speed}s linear`,
      //   }}
      // We pass DATA via CSS Variables.
      // This is efficient and allows the Theme to decide how to use them.
      //   style={
      //     {
      //       "--m-left": meteor.left,
      //       "--m-top": meteor.top,
      //       // "--m-z": meteor.zIndex,
      //       "--m-transform": transform,
      //       "--m-duration": duration,
      //     } as MeteorVariables
      //   }
      style={{
        left: meteor.left,
        top: meteor.top,
        // zIndex: meteor.zIndex,
        transform: transform,
        // We only set the duration here. The Property and Easing are in the Theme.
        transitionDuration: duration,
      }}
    >
      <MeteorSprite size={meteor.size} />
    </MeteorItem>
  );
};

export { MeteorRoot, MeteorItem, MeteorSprite, MeteorElement };
