// utils/colorStops.ts
import { StarfieldOptions } from "@/interfaces/css.interface";
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
  colors = ["#fff", "#9b40fc", "#4fc3f7", "#f06292", "#ff3300ff", "#40b809ff"]
): string {
  // static stars
  return Array.from({ length: count })
    .map(() => {
      const x = (Math.random() * 100).toFixed(2); // viewport width %
      const y = (Math.random() * 100).toFixed(2); // viewport height %
      const color = colors[Math.floor(Math.random() * colors.length)];
      return `${x}vw ${y}vh ${color}`;
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

function pickStyle(mix: { straight: number; shallow: number; deep: number }) {
  const r = Math.random();
  if (r < mix.straight) return "straight";
  if (r < mix.straight + mix.shallow) return "shallow";
  return "deep";
}

export function generateShootingStars(
  count: number,
  // minAngle: number = -20, // shallow
  // maxAngle: number = -70, // steep
  interval: number = 5, // seconds between streaks
  curveFactor: number,
  // trajectoryStyle: "straight" | "shallow" | "deep"
  mix: { straight: number; shallow: number; deep: number }
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

    const startX = starDirection === "left" ? width : 0;
    const startY = Math.random() * height;
    const endX = starDirection === "left" ? -100 : width + 100;
    const endY = Math.random() * height;

    const delay = `${Math.random() * interval}s`; // staggered by interval
    const duration = `${2 + Math.random() * 5}s`; // 2s to 7s duration
    // random angle between minAngle and maxAngle
    // const rot = `${
    //   minAngle - Math.random() * Math.abs(maxAngle - minAngle)
    // }deg`;

    const style = pickStyle(mix);

    if (style === "straight") {
      // straight line path
      return {
        // top,
        // right,
        delay,
        duration,
        // rot,
        // path: `path("M ${right} ${top} L -100vw ${Math.random() * 100}vh")`,
        path: `path("M ${startX} ${startY} L ${endX} ${endY}")`,
      };
    }

    // const controlX = `${Math.random() * curveFactor}vw`;
    const controlX = Math.random() * (curveFactor / 100) * width;
    // pick control point based on style
    const controlY =
      style === "shallow"
        ? Math.random() * (curveFactor / 200) * height
        : Math.random() * (curveFactor / 50) * height;
    // ? `${Math.random() * (curveFactor / 2)}vh`
    // : `${Math.random() * (curveFactor * 2)}vh`;

    // const color = colors[Math.floor(Math.random() * colors.length)];
    // const glow = `
    //   0 0 0 ${4 * glowIntensity}px ${color}20,
    //   0 0 0 ${8 * glowIntensity}px ${color}20,
    //   0 0 ${20 * glowIntensity}px ${color}
    // `;

    return {
      // top,
      // right,
      delay,
      duration,
      // rot,
      // path: `path("M ${right} ${top} Q ${controlX} ${controlY}, -100vw ${
      //   Math.random() * 100
      // }vh")`,
      path: `path("M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}")`,
    };
  });
}

import { useEffect, useState } from "react";

export function useResponsiveShootingStars(
  count: number,
  interval: number,
  curveFactor: number,
  mix: { straight: number; shallow: number; deep: number }
  // colors: string[],
  // glowIntensity: number
) {
  const [stars, setStars] = useState(() =>
    generateShootingStars(
      count,
      interval,
      curveFactor,
      mix
      // colors,
      // glowIntensity
    )
  );

  useEffect(() => {
    function handleResize() {
      setStars(
        generateShootingStars(
          count,
          interval,
          curveFactor,
          mix
          // colors,
          // glowIntensity
        )
      );
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [count, interval, curveFactor, mix]);

  return stars;
}
