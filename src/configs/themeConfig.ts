import { GradientPoint, GradientRow } from "@/types/theme";
import { buildGradients, makePulseSequence } from "@/utils/colorStop";

/**
 * Returns the parsed number or the fallback if parsing fails.
 *
 * @param {string|undefined} value The environment variable value.
 * @param {number} fallback A default value if parsing fails.
 * @returns {number} The parsed number or the fallback.
 */
export function getEnvNumber(
  value: string | undefined,
  fallback: number
): number {
  /**
   * The parsed number or NaN if parsing fails.
   */
  const parsed = value !== undefined ? Number(value) : NaN;
  /**
   * Returns the parsed number or the fallback if parsing fails.
   */
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * A small inline helper for parsing JSON, or returning a fallback.
 *
 * @param {string|undefined} value The environment variable value.
 * @param {T} fallback A default value if parsing fails.
 * @returns {T} The parsed JSON or the fallback.
 */
function parseEnvJson<T>(value: string | undefined, fallback: T): T {
  /**
   * If the value is undefined, return the fallback.
   */
  if (value === undefined) {
    return fallback;
  }

  try {
    /**
     * Attempt to parse the JSON string.
     * If parsing fails, return the fallback.
     */
    return JSON.parse(value) as T;
  } catch {
    /**
     * If not in production mode, log a warning message.
     * Return the fallback.
     */
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to parse env var JSON, using fallback.");
    }
    return fallback;
  }
}

export function getSideImageConfig() {
  const rows: GradientRow[] = [
    { y: 235, dotY: 117.5 },
    { y: 252, dotY: 126 },
    { y: 150, dotY: 75 },
    { y: 253, dotY: 126.5 },
    { y: 204, dotY: 102 },
    { y: 134, dotY: 67 },
    { y: 179, dotY: 89.5 },
    { y: 299, dotY: 149.5 },
    { y: 215, dotY: 107.5 },
    { y: 281, dotY: 140.5 },
    { y: 158, dotY: 79 },
    { y: 210, dotY: 105 },
  ];

  const points: GradientPoint[] = rows.flatMap((row) => [
    { x: 0, y: row.y },
    { x: 300, y: row.y },
    { x: 150, y: row.dotY, small: true },
  ]);

  // const points: GradientPoint[] = [
  //   // y = 235
  //   { x: 0, y: 235 },
  //   { x: 300, y: 235 },
  //   { x: 150, y: 117.5, small: true },

  //   // y = 252
  //   { x: 0, y: 252 },
  //   { x: 300, y: 252 },
  //   { x: 150, y: 126, small: true },

  //   // y = 150
  //   { x: 0, y: 150 },
  //   { x: 300, y: 150 },
  //   { x: 150, y: 75, small: true },

  //   // y = 253
  //   { x: 0, y: 253 },
  //   { x: 300, y: 253 },
  //   { x: 150, y: 126.5, small: true },

  //   // y = 204
  //   { x: 0, y: 204 },
  //   { x: 300, y: 204 },
  //   { x: 150, y: 102, small: true },

  //   // y = 134
  //   { x: 0, y: 134 },
  //   { x: 300, y: 134 },
  //   { x: 150, y: 67, small: true },

  //   // y = 179
  //   { x: 0, y: 179 },
  //   { x: 300, y: 179 },
  //   { x: 150, y: 89.5, small: true },

  //   // y = 299
  //   { x: 0, y: 299 },
  //   { x: 300, y: 299 },
  //   { x: 150, y: 149.5, small: true },

  //   // y = 215
  //   { x: 0, y: 215 },
  //   { x: 300, y: 215 },
  //   { x: 150, y: 107.5, small: true },

  //   // y = 281
  //   { x: 0, y: 281 },
  //   { x: 300, y: 281 },
  //   { x: 150, y: 140.5, small: true },

  //   // y = 158
  //   { x: 0, y: 158 },
  //   { x: 300, y: 158 },
  //   { x: 150, y: 79, small: true },

  //   // y = 210
  //   { x: 0, y: 210 },
  //   { x: 300, y: 210 },
  //   { x: 150, y: 105, small: true },
  // ];

  const circleSize = process.env.NEXT_PUBLIC_CIRCLE_SIZE || "30%";
  const circleColor =
    process.env.NEXT_PUBLIC_CIRCLE_COLOR || "rgba(220, 38, 38, 1)";
  const logoOffset = process.env.NEXT_PUBLIC_LOGO_OFFSET || "3%";
  const circleStopCount = getEnvNumber(
    process.env.NEXT_PUBLIC_CIRCLE_STOP_COUNT,
    35
  );
  const circlePulseMin = getEnvNumber(
    process.env.NEXT_PUBLIC_CIRCLE_PULSE_MIN,
    0.25
  );
  const circlePulseMax = getEnvNumber(
    process.env.NEXT_PUBLIC_CIRCLE_PULSE_MAX,
    0.95
  );
  const circlePulseDuration =
    process.env.NEXT_PUBLIC_CIRCLE_PULSE_SPEED || "5s";
  const maxOpacity = parseFloat(process.env.NEXT_PUBLIC_MAX_OPACITY || "0.3");
  const logoCaption =
    process.env.NEXT_PUBLIC_LOGO_CAPTION || "ក្រសួងមុខងារសាធារណៈ";
  const captionOutlineColor =
    process.env.NEXT_PUBLIC_CAPTION_OUTLINE_COLOR || "#000"; // black outline
  const captionGlowColor =
    process.env.NEXT_PUBLIC_CAPTION_GLOW_COLOR || "rgba(255,255,255,0.75)"; // white glow
  // const captionFontSize =
  //   process.env.NEXT_PUBLIC_CAPTION_FONT_SIZE || "0.75rem";
  const captionFontSize = parseEnvJson(
    process.env.NEXT_PUBLIC_CAPTION_FONT_SIZE,
    {
      xs: "0.55rem",
      sm: "0.65rem",
      md: "0.75rem",
    }
  );
  const captionShadowStrength =
    process.env.NEXT_PUBLIC_CAPTION_SHADOW_STRENGTH || 7.5;
  const captionOffset = parseEnvJson(process.env.NEXT_PUBLIC_CAPTION_OFFSET, {
    xs: "8px",
    sm: "12px",
    md: "16px",
  });

  return {
    circleSize,
    circleColor,
    // circleColor: "#1e40af",
    // circleColor: `radial-gradient(circle at 50% 50%,
    //     rgba(220, 38, 38, 0.3) 0%,
    //     rgba(220, 38, 38, 0.15) 25%,
    //     rgba(220, 38, 38, 0.1) 50%,
    //     rgba(220, 38, 38, 0.05) 75%,
    //     rgba(220, 38, 38, 0.025) 100%,
    //     transparent 50%
    //   )`,
    logoOffset,
    logoSize: `calc(${circleSize} - ${logoOffset})`, // 👈 new token
    circleStopCount,
    circlePulseMin,
    circlePulseMax,
    circlePulseSequence: makePulseSequence(
      circleStopCount,
      circlePulseMin,
      circlePulseMax
    ),
    circlePulseDuration,
    maxOpacity,
    logoCaption,
    captionOutlineColor,
    captionGlowColor,
    captionFontSize,
    captionShadowStrength,
    captionOffset,
    animationBackground: buildGradients(points, {
      dotSize: 1.5,
      streakWidth: 4,
      streakHeight: 100,
      color: "#09f", // or from env: process.env.NEXT_PUBLIC_GRADIENT_COLOR
    }),
  };
}
