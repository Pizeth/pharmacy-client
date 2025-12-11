// utils/colorStops.ts
import { StarfieldOptions } from "@/interfaces/css.interface";
import { MeteorConfig } from "@/interfaces/theme.interface";
import { GradientOptions, GradientPoint } from "@/types/theme";
import { alpha, keyframes } from "@mui/material/styles";

// export function makeSoftStops(color: string) {
//   return [
//     `${alpha(color, 0.3)} 0%`,
//     `${alpha(color, 0.15)} 25%`,
//     `${alpha(color, 0.1)} 50%`,
//     `${alpha(color, 0.05)} 75%`,
//     `${alpha(color, 0.025)} 100%`,
//     `transparent 100%`,
//   ].join(", ");
// }

// export function makeStops(color: string, count: number): string {
//   const stops: string[] = [];
//   for (let i = 0; i <= count; i++) {
//     const pct = (i / count) * 100;
//     const opacity = 0.3 * (1 - i / count); // fade from 0.3 → 0
//     stops.push(`${alpha(color, opacity)} ${pct}%`);
//   }
//   stops.push("transparent 100%");
//   return stops.join(", ");
// }

/**
 * Generate radial-gradient stops from a base color.
 * @param color - base hex or rgba color
 * @param count - number of intermediate stops
 * @param maxOpacity - starting opacity (default 0.3)
 */
export function makeRadialStops(
  color: string,
  count = 5,
  maxOpacity = 0.3
): string {
  const stops: string[] = [];
  for (let i = 0; i <= count; i++) {
    const pct = (i / count) * 100;
    const opacity = maxOpacity * (1 - i / count); // fade from 0.3 → 0
    stops.push(`${alpha(color, opacity)} ${pct}%`);
  }
  stops.push("transparent 100%");
  return stops.join(", ");
}

/**
 * Generate a symmetric pulse sequence.
 * @param ringCount - total number of steps (must be odd for symmetry)
 * @param min - lowest opacity
 * @param max - highest opacity
 */
export function makePulseSequence(
  ringCount: number,
  min: number,
  max: number
): number[] {
  // if (ringCount < 3) throw new Error("ringCount must be >= 3");
  // if (ringCount % 2 === 0)
  //   throw new Error("ringCount should be odd for symmetry");
  // number of frames = (rings * 2) - (rings % 2)
  const frameCount = ringCount * 2 - (ringCount % 2); // ensures symmetry

  // const half = (ringCount - 1) / 2;
  const half = (frameCount - 1) / 2;
  const seq: number[] = [];

  for (let i = 0; i <= half; i++) {
    const t = i / half; // 0 → 1
    const value = +(min + (max - min) * t).toFixed(2);
    seq.push(value);
  }

  // mirror the sequence (excluding the peak to avoid duplication)
  for (let i = half - 1; i >= 0; i--) {
    seq.push(seq[i]);
  }

  return seq;
}

export function makePulseVars(
  color: string,
  count: number,
  sequence: number[]
) {
  const vars: Record<string, string> = {};
  sequence.forEach((opacity, i) => {
    vars[`--app-gradient-soft-${i}`] = makeRadialStops(color, count, opacity);
  });

  return vars;
}

export function makePulseKeyframes(sequence: number[]) {
  const step = 100 / (sequence.length - 1);
  let frames = "";
  sequence.forEach((_, i) => {
    const pct = (i * step).toFixed(2);
    frames += `
      ${pct}% {
        background: radial-gradient(circle at 50% 50%, var(--app-gradient-soft-${i}));
      }
    `;
  });
  return keyframes`${frames}`;
}

export function buildGradients(
  points: GradientPoint[],
  opts: GradientOptions = {}
): {
  backgroundImage: string;
  backgroundSize: string;
} {
  const {
    dotSize = 1.5,
    streakWidth = 4,
    streakHeight = 100,
    color = "var(--c)",
  } = opts;

  // const gradients = points.map((p) =>
  //   p.small
  //     ? `radial-gradient(1.5px 1.5px at ${p.x}px ${p.y}px, var(--c) 100%, #0000 150%)`
  //     : `radial-gradient(4px 100px at ${p.x}px ${p.y}px, var(--c), #0000)`
  // );

  const gradients = points.map((p) =>
    p.small
      ? `radial-gradient(${dotSize}px ${dotSize}px at ${p.x}px ${p.y}px, ${color} 100%, #0000 150%)`
      : `radial-gradient(${streakWidth}px ${streakHeight}px at ${p.x}px ${p.y}px, ${color}, #0000)`
  );

  // const sizes = points.map((p) =>
  //   p.small ? `300px ${p.y}px` : `300px ${p.y}px`
  // );

  const sizes = points.map((p) => `300px ${p.y}px`);

  return {
    backgroundImage: gradients.join(", "),
    backgroundSize: sizes.join(", "),
  };
}

export function buildResponsiveShadow(sizeVar = "--avatar-size") {
  return `
    0 0 calc(var(${sizeVar}) * 0.08) rgba(255,255,255,0.2),
    calc(var(${sizeVar}) * -0.02) 0 calc(var(${sizeVar}) * 0.03) #c3f4ff inset,
    calc(var(${sizeVar}) * 0.06) calc(var(${sizeVar}) * 0.008) calc(var(${sizeVar}) * 0.1) #000 inset,
    calc(var(${sizeVar}) * -0.1) calc(var(${sizeVar}) * -0.008) calc(var(${sizeVar}) * 0.14) #c3f4ff99 inset,
    calc(var(${sizeVar}) * 1) 0 calc(var(${sizeVar}) * 0.18) #00000066 inset,
    calc(var(${sizeVar}) * 0.6) 0 calc(var(${sizeVar}) * 0.15) #000000aa inset
  `;
}

// export function createStarfield(count: number, color = "#fff"): string {
//   return Array.from({ length: count })
//     .map(() => {
//       const x = Math.floor(Math.random() * window.innerWidth);
//       const y = Math.floor(Math.random() * window.innerHeight);
//       return `${x}px ${y}px ${color}`;
//     })
//     .join(", ");
// }

// utils/starfield.ts
// export function createStarfield(
//   count: number,
//   colors: string[] = ["#fff", "#9b40fc", "#00f", "#ff3300ff"]
// ): string {
//   return Array.from({ length: count })
//     .map(() => {
//       const x = (Math.random() * 100).toFixed(2); // viewport width %
//       const y = (Math.random() * 100).toFixed(2); // viewport height %
//       const color = colors[Math.floor(Math.random() * colors.length)];
//       return `${x}vw ${y}vh ${color}`;
//     })
//     .join(", ");
// }

export function createStarfield(
  count = 50,
  colors: string[],
  glowIntensity: number = 1
): string {
  // static stars
  return Array.from({ length: count })
    .map(() => {
      const x = (Math.random() * 100).toFixed(2); // viewport width %
      const y = (Math.random() * 100).toFixed(2); // viewport height %
      const color = colors[Math.floor(Math.random() * colors.length)];
      // const glow = `
      //   ${x}vw ${y}vh 0 ${1 * glowIntensity}px ${color}BF,
      //   ${x}vw ${y}vh 0 ${2 * glowIntensity}px ${color}10,
      //   ${x}vw ${y}vh ${1 * glowIntensity}px ${color}BF
      // `;

      //       ${x}vw ${y}vh 0 ${glowIntensity}px ${color}10,
      // ${x}vw calc(${y}vh - 8px) 6px -2px ${color}10,
      // ${x}vw calc(${y}vh + 8px) 6px -2px ${color}10,
      // calc(${x}vw - 8px) ${y}vh 6px -2px ${color}10,
      // calc(${x}vw + 8px) ${y}vh 6px -2px ${color}10,
      // ${x}vw ${y}vh 0 1px ${color}99
      // const glow = `
      //   ${x}vw ${y}vh 0 ${glowIntensity}px ${color}E6,
      //   ${x}vw calc(${y}vh - var(--ray)) var(--blurRay) 0 ${color}E6,
      //   ${x}vw calc(${y}vh + var(--ray)) var(--blurRay) 0 ${color}E6,
      //   calc(${x}vw - var(--ray)) ${y}vh var(--blurRay) 0 ${color}E6,
      //   calc(${x}vw + var(--ray)) ${y}vh var(--blurRay) 0 ${color}E6,
      //   ${x}vw ${y}vh var(--halo) 0 ${color}80
      // `;

      const glow = `
        /* center glow */
        ${x}vw ${y}vh 0 ${glowIntensity}px ${color}E6,
        /* cardinal rays */
        ${x}vw calc(${y}vh - var(--ray)) var(--blurRay) 0 ${color}E6,
        ${x}vw calc(${y}vh + var(--ray)) var(--blurRay) 0 ${color}E6,
        calc(${x}vw - var(--ray)) ${y}vh var(--blurRay) 0 ${color}E6,
        calc(${x}vw + var(--ray)) ${y}vh var(--blurRay) 0 ${color}E6,
        /* diagonal rays (approx 45°) */
        calc(${x}vw + var(--ray) * -0.707) calc(${y}vh + var(--ray) * -0.707) var(--blurRay) 0 ${color}E6,
        calc(${x}vw + var(--ray) * 0.707)  calc(${y}vh + var(--ray) * -0.707) var(--blurRay) 0 ${color}E6,
        calc(${x}vw + var(--ray) * -0.707) calc(${y}vh + var(--ray) * 0.707)  var(--blurRay) 0 ${color}E6,
        calc(${x}vw + var(--ray) * 0.707)  calc(${y}vh + var(--ray) * 0.707)  var(--blurRay) 0 ${color}E6,
        /* halo */
        0 0 var(--halo) 0 ${color}80
      `;

      // console.log("Star glow:", glow);
      return glow;
    })
    .join(", ");

  // JSX shooting star spans
  // const ShootingStars = (
  //   <>
  //     {Array.from({ length: shootingStars }).map((_, i) => (
  //       <span
  //         key={i}
  //         className="shooting-star"
  //         style={{
  //           position: "absolute",
  //           top: `${20 + i * 15}%`,
  //           left: `${80 - i * 10}%`,
  //           width: "5em",
  //           height: "1px",
  //           background: "linear-gradient(90deg, #fff, transparent)",
  //           animation: "shootingStar 4s ease-in-out infinite",
  //           animationDelay: `${i * 2}s`,
  //         }}
  //       />
  //     ))}
  //   </>
  // );

  // return { boxShadow: stars };
}

export function generateTwinkleStars(
  count = 12,
  colors: string[],
  baseSize: number = 1
) {
  return Array.from({ length: count }).map((_, i) => {
    const x = (Math.random() * 100).toFixed(2); // viewport width %
    const y = (Math.random() * 100).toFixed(2); // viewport height %
    const size = Math.max(Math.random() * baseSize, 0.125).toFixed(2);

    // const size = 0.3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = `${(Math.random() * i + 1.5).toFixed(2)}s`;
    const centerPoint = Number(size) / 2;
    const blurRay = Number(size) * 3.5;
    // const glow = `
    //   ${centerPoint}vh 0 0 var(--core) ${color}BF,
    //   /* cardinal rays */
    //   ${centerPoint}vh calc(var(--ray) * -1) var(--blurRay) 0 ${color}80,
    //   ${centerPoint}vh var(--ray) var(--blurRay) 0 ${color}80,
    //   calc(${centerPoint}vh + var(--ray) * -1) 0 var(--blurRay) 0 ${color}80,
    //   calc(${centerPoint}vh + var(--ray)) 0 var(--blurRay) 0 ${color}80,
    //   /* diagonal rays (approx 45°) */
    //   calc(${centerPoint}vh + var(--ray) * -0.707) calc(var(--ray) * -0.707) var(--blurRay) 0 ${color}80,
    //   calc(${centerPoint}vh + var(--ray) * 0.707) calc(var(--ray) * -0.707) var(--blurRay) 0 ${color}80,
    //   calc(${centerPoint}vh + var(--ray) * -0.707) calc(var(--ray) * 0.707) var(--blurRay) 0 ${color}80,
    //   calc(${centerPoint}vh + var(--ray) * 0.707) calc(var(--ray) * 0.707) var(--blurRay) 0 ${color}80,
    //   /* halo */
    //   ${centerPoint}vh 0 var(--halo) 0 ${color}BF
    // `;

    const glow = `
      0 0 0 var(--core) ${color}25,
      /* cardinal rays */
      0 calc(var(--ray) * -1) ${blurRay}vh 0 ${color},
      0 var(--ray) ${blurRay}vh 0 ${color},
      calc(var(--ray) * -1) 0 ${blurRay}vh 0 ${color},
      var(--ray) 0 ${blurRay}vh 0 ${color},
      /* diagonal rays (approx 45°) */
      calc(var(--ray) * -0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * 0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * -0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * 0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color},
      /* halo */
      0 0 var(--halo) 0 ${color}
    `;

    // const glow = `
    //   0 0 0 ${3 * glowIntensity}px ${color}FF,
    //   0 0 0 ${5 * glowIntensity}px ${color}80,
    //   0 0 ${5 * glowIntensity}px ${color}FF
    // `;
    return {
      top: `${y}vh`,
      left: `${x}vw`,
      size: `${size}vh`,
      centerPoint: `${centerPoint}vh`,
      baseSize: Number(size) * 0.85,
      delay,
      color,
      glow,
    };
  });
}

function pickStyle(mix: { straight: number; shallow: number; deep: number }) {
  const r = Math.random();
  if (r < mix.straight) return "straight";
  if (r < mix.straight + mix.shallow) return "shallow";
  return "deep";
}

function pathLength(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) {
  // rough quadratic Bézier length via sampling
  const steps = 20;
  let length = 0;
  let prevX = x1,
    prevY = y1;
  for (let t = 1; t <= steps; t++) {
    const u = t / steps;
    const x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2;
    const y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2;
    length += Math.hypot(x - prevX, y - prevY);
    prevX = x;
    prevY = y;
  }
  return length;
}

export function generateShootingStars(
  count: number,
  // minAngle: number = -20, // shallow
  // maxAngle: number = -70, // steep
  interval: number = 5, // seconds between streaks
  curveFactor: number,
  // trajectoryStyle: "straight" | "shallow" | "deep"
  mix: { straight: number; shallow: number; deep: number },
  colors: string[],
  glowIntensity: number = 1,
  baseSpeed: number = 20, // % per second (normalized)
  baseSize: number = 1
) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return Array.from({ length: count }).map((_, i) => {
    // const top = `${Math.random() * 100}vh`; // random vertical position
    // const right = `${Math.random() * 100}vw`; // start off-screen right
    // const top = `${Math.random() * 100}%`;
    // const right = `${Math.random() * 100}%`;
    // const left = `${Math.random() * 100}vw`; // start off-screen right
    const starDirection = Math.random() < 0.5 ? "left" : "right";

    // const startX = Math.random() * width;
    // // const startX = 0;
    // const startY = Math.random() * height;
    // const endX = -100; // off-screen left
    // // const endX = width + 100; // off-screen left
    // const endY = Math.random() * height;

    const startX =
      starDirection === "left"
        ? width / 2 + (Math.random() * width) / 2
        : width / 2 - (Math.random() * width) / 2;
    const startY = Math.random() * height;
    const endX = starDirection === "left" ? -100 : width + 100;
    const endY = Math.random() * height;

    // console.log(
    //   `Star ${i} Directtion: ${starDirection} - From (${startX.toFixed(
    //     2
    //   )}, ${startY.toFixed(2)}) to (${endX.toFixed(2)}, ${endY.toFixed(2)})`
    // );

    // const delay = `${i * interval}s`; // staggered by interval
    // const duration = `${3 + Math.random() * 10}s`; // 3s to 10s duration
    // random angle between minAngle and maxAngle
    // const rot = `${
    //   minAngle - Math.random() * Math.abs(maxAngle - minAngle)
    // }deg`;

    const style = pickStyle(mix);
    let len: number;
    let path: string;

    if (style === "straight") {
      // straight line path
      path = `path("M ${startX} ${startY} L ${endX} ${endY}")`;
      len = Math.hypot(endX - startX, endY - startY);
      // return {
      //   // top,
      //   // right,
      //   delay,
      //   duration,
      //   // rot,
      //   // path: `path("M ${right} ${top} L -100vw ${Math.random() * 100}vh")`,
      //   path: `path("M ${startX} ${startY} L ${endX} ${endY}")`,
      // };
    } else {
      // const controlX = `${Math.random() * curveFactor}vw`;
      const controlX = Math.random() * (curveFactor / 100) * width;
      // pick control point based on style
      const controlY =
        style === "shallow"
          ? Math.random() * (curveFactor / 200) * height
          : Math.random() * (curveFactor / 50) * height;
      // ? `${Math.random() * (curveFactor / 2)}vh`
      // : `${Math.random() * (curveFactor * 2)}vh`;
      path = `path("M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}")`;
      len = pathLength(startX, startY, controlX, controlY, endX, endY);
    }

    // const baseSpeed = 20; // % per second (normalized)
    const duration = `${(len / (len * baseSpeed)).toFixed(2)}s`;
    // const duration = `${(len / 50).toFixed(2)}s`;
    const delay = `${(i === 0
      ? Math.floor(Math.random() * interval)
      : Math.random() + interval + i + (i / interval) * interval
    ).toFixed(2)}s`; // staggered by interval

    // console.log(
    //   `Star ${i} - Style: ${style}, Length: ${len.toFixed(
    //     2
    //   )}, Duration: ${duration}, Delay: ${delay}`
    // );

    const size = Math.max(Math.random() * baseSize, 0.125).toFixed(2);
    const centerPoint = Number(size) / 2;
    const head = Number(size) * 1.5;
    const blurRay = Number(size) * 3.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    // const glow = `
    //   0 0 0 ${1 * glowIntensity}px ${color}40,
    //   0 0 0 ${2 * glowIntensity}px ${color}10,
    //   0 0 ${1 * glowIntensity}px ${color}10
    // `;
    const glow = `
      0 0 0 calc(var(--core) * 1.25) ${color}80,
      /* cardinal rays */
      0 calc(var(--ray) * -1) ${blurRay}vh 0 ${color}40,
      0 var(--ray) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * -1) 0 ${blurRay}vh 0 ${color}40,
      var(--ray) 0 ${blurRay}vh 0 ${color}40,
      /* diagonal rays (approx 45°) */
      calc(var(--ray) * -0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * 0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * -0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * 0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color}40,
      /* halo */
      0 0 var(--halo) 0 ${color}
    `;

    return {
      // top,
      // right,
      size: `${size}vh`,
      centerPoint: `${centerPoint}vh`,
      head: `${head}vh`,
      halfHead: `${head / 2}vh`,
      baseSize: Number(size) * 0.85,
      delay,
      duration,
      twinkleDuration: `${(len / (len * baseSpeed) / 5).toFixed(2)}s`,
      // rot,
      // path: `path("M ${right} ${top} Q ${controlX} ${controlY}, -100vw ${
      //   Math.random() * 100
      // }vh")`,
      path,
      color,
      glow,
    };
  });
}

import { useEffect, useState } from "react";

export function useResponsiveShootingStars(
  count: number,
  interval: number,
  curveFactor: number,
  mix: { straight: number; shallow: number; deep: number },
  colors: string[],
  glowIntensity: number,
  baseSpeed: number,
  baseSize: number
) {
  const [stars, setStars] = useState(() =>
    generateShootingStars(
      count,
      interval,
      curveFactor,
      mix,
      colors,
      glowIntensity,
      baseSpeed,
      baseSize
    )
  );

  useEffect(() => {
    function handleResize() {
      setStars(
        generateShootingStars(
          count,
          interval,
          curveFactor,
          mix,
          colors,
          glowIntensity,
          baseSpeed,
          baseSize
        )
      );
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    count,
    interval,
    curveFactor,
    mix,
    colors,
    glowIntensity,
    baseSpeed,
    baseSize,
  ]);

  return stars;
}

export const parseUnit = (
  value: string | number,
  containerHeight: number
): number => {
  if (typeof value === "number") return value;
  if (value.endsWith("px")) return parseFloat(value);
  if (value.endsWith("vh"))
    return (parseFloat(value) / 100) * window.innerHeight;
  if (value.endsWith("vw"))
    return (parseFloat(value) / 100) * window.innerWidth;
  // Container-relative percentage
  if (value.endsWith("%")) return (parseFloat(value) / 100) * containerHeight; // <-- Needs containerHeight
  // Fallback for simple strings
  return parseFloat(value);
};
