import { shootingStar } from "@/theme/keyframes";
import { GradientPoint, GradientRow } from "@/types/theme";
import { buildGradients, makePulseSequence } from "@/utils/colorUtils";

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

/**
 * Returns a configuration object for the side image component.
 *
 * The configuration object is constructed from environment variables, and
 * provides sensible defaults if the environment variables are not set.
 *
 * The configuration object contains the following properties:
 *
 * - `circleSize`: The size of the circle as a percentage of the
 *   container height.
 * - `circleColor`: The color of the circle as a CSS color string.
 * - `logoOffset`: The offset of the logo from the center of the
 *   circle as a percentage of the container height.
 * - `logoSize`: The size of the logo as a CSS calc expression.
 * - `circleStopCount`: The number of gradient stops in the circle.
 * - `circlePulseMin`: The minimum pulse value of the circle.
 * - `circlePulseMax`: The maximum pulse value of the circle.
 * - `circlePulseSequence`: An array of pulse values for the circle.
 * - `circlePulseDuration`: The duration of the pulse animation in seconds.
 * - `maxOpacity`: The maximum opacity of the circle.
 * - `logoCaption`: The caption text of the logo.
 * - `captionOutlineColor`: The color of the caption outline as a CSS color
 *   string.
 * - `captionGlowColor`: The color of the caption glow as a CSS color
 *   string.
 * - `captionFontSize`: The size of the caption as a CSS calc expression.
 * - `captionShadowStrength`: The strength of the caption shadow.
 * - `captionOffset`: The offset of the caption from the center of the
 *   circle as a CSS calc expression.
 * - `animationBackground`: An object containing the gradient and streak
 *   styles for the animation background.
 */
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

  const options = parseEnvJson(process.env.NEXT_PUBLIC_SIDE_IMAGE_CONFIG, {
    dotSize: 1.5,
    streakWidth: 4,
    streakHeight: 100,
    color: "#09f",
  });

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
  const shootingStarCount = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_COUNT,
    15
  );
  const shootingStarInterval = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_INTERVAL,
    5
  );
  const shootingClass =
    process.env.NEXT_PUBLIC_SHOOTING_STAR_CLASS || "shooting-star";
  const starColors = parseEnvJson(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_COLORS,
    ["#fff", "#9b40fc", "#4fc3f7", "#f06292", "#ff3300ff", "#40b809ff"]
  );
  // console.log("Shooting star colors:", starColors);
  const glowIntensity = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_GLOW_INTENSITY,
    1
  );
  const baseSpeed = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_BASE_SPEED,
    20
  );
  const minAngle = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_MIN_ANGLE,
    -20
  );
  const maxAngle = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_MAX_ANGLE,
    -70
  );
  const curveFactor = getEnvNumber(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_CURVE_FACTOR,
    0.5
  );
  const trajectoryMix = parseEnvJson(
    process.env.NEXT_PUBLIC_SHOOTING_STAR_TRAJECTORY_MIX,
    { straight: 0.3, shallow: 0.4, deep: 0.3 }
  );

  return {
    circleSize,
    circleColor,
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
    animationBackground: buildGradients(points, options),
    shootingStarCount,
    shootingStarInterval,
    shootingClass,
    starColors,
    glowIntensity,
    baseSpeed,
    minAngle,
    maxAngle,
    curveFactor,
    trajectoryMix,
  };
}
