// utils/colorStops.ts
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
