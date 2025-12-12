import { Meteor, MeteorConfig } from "@/interfaces/theme.interface";
import { shootingStar } from "@/theme/keyframes";
import { GradientPoint, GradientRow } from "@/types/theme";
import { buildGradients, makePulseSequence } from "@/utils/themeUtils";

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
  const twinkleClass =
    process.env.NEXT_PUBLIC_TWINKLE_STAR_CLASS || "twinkle-star";
  const starSize = getEnvNumber(process.env.NEXT_PUBLIC_SHOOTING_STAR_SIZE, 1);
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
    twinkleClass,
    starSize,
    starColors,
    glowIntensity,
    baseSpeed,
    minAngle,
    maxAngle,
    curveFactor,
    trajectoryMix,
  };
}

// export const getMeteorConfig = () => {
//   // const enabled = Boolean(process.env.NEXT_PUBLIC_METEOR_ENABLED) || false;
//   // const interval = getEnvNumber(process.env.NEXT_PUBLIC_METEOR_INTERVAL, 5);
//   const meteorVariant: MeteorVariant =
//     (process.env.NEXT_PUBLIC_METEOR_VARIANT as MeteorVariant) || "medium";
//   const meteorConfig = parseEnvJson(
//     process.env.NEXT_PUBLIC_METEOR_CONFIGS,
//     // { size: 600, speed: 5, maxCount: 2, count: 0, zIndex: 10 },
//     // { size: 300, speed: 10, maxCount: 3, count: 0, zIndex: 4 },
//     // { size: 150, speed: 15, maxCount: 5, count: 0, zIndex: 0 },
//     {
//       light: {
//         enabled: true,
//         interval: 750,
//         configs: [
//           { size: "3vh", speed: 5, maxCount: 7, count: 0, zIndex: 1 },
//           { size: "5vh", speed: 10, maxCount: 5, count: 0, zIndex: 2 },
//           { size: "7vh", speed: 15, maxCount: 3, count: 0, zIndex: 3 },
//         ],
//       },
//       medium: {
//         enabled: true,
//         interval: 500,
//         configs: [
//           { size: "3vh", speed: 5, maxCount: 9, count: 0, zIndex: 1 },
//           { size: "5vh", speed: 10, maxCount: 7, count: 0, zIndex: 2 },
//           { size: "7vh", speed: 15, maxCount: 5, count: 0, zIndex: 3 },
//           { size: "10vh", speed: 20, maxCount: 3, count: 0, zIndex: 5 },
//         ],
//       },
//       heavy: {
//         enabled: true,
//         interval: 300,
//         configs: [
//           { size: "3vh", speed: 5, maxCount: 12, count: 0, zIndex: 1 },
//           { size: "5vh", speed: 10, maxCount: 10, count: 0, zIndex: 2 },
//           { size: "7vh", speed: 15, maxCount: 7, count: 0, zIndex: 3 },
//           { size: "10vh", speed: 20, maxCount: 5, count: 0, zIndex: 5 },
//           { size: "50vh", speed: 25, maxCount: 3, count: 0, zIndex: 7 },
//         ],
//       },
//     }
//   );
//   const { enabled, interval, configs } =
//     meteorConfig[meteorVariant as keyof typeof meteorConfig] ||
//     meteorConfig.medium;

//   console.log("Meteor enabled:", enabled);
//   console.log("Meteor interval:", interval);
//   console.log("Meteor configs:", configs);
//   return { enabled, interval, configs };
// };

export const getMeteorConfig = () => {
  const enabled = process.env.NEXT_PUBLIC_METEOR_ENABLED === "true";

  // Default to 15 meteors if not set
  const intensity = Number(process.env.NEXT_PUBLIC_METEOR_INTENSITY) || 15;

  // 1. Calculate Interval based on Intensity
  // More meteors = spawn faster (lower interval).
  // 10 meteors = 800ms, 50 meteors = 200ms.
  const baseInterval = 1000000; // Arbitrary base constant
  const interval = Math.max(100, Math.floor(baseInterval / intensity));

  // 2. Generate Configs
  const configs = generateProceduralConfigs(intensity);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[Meteor] Generated ${intensity} meteors with interval ${interval}ms`
    );
  }

  return { enabled, interval, configs };
};

/**
 * Generates meteor configurations procedurally based on a total intensity.
 * @param totalMeteors Total number of meteors allowed on screen at once.
 */
const generateProceduralConfigs = (totalMeteors: number): MeteorConfig[] => {
  // 1. Define distinct buckets for variety (Small, Medium, Large, Giant)
  // Ratios determine density: 55% Small, 30% Medium, 10% Large, 5% Giant
  const buckets = [
    { label: "tiny", ratio: 0.2, minSize: 3, maxSize: 5 }, // vh
    { label: "small", ratio: 0.3, minSize: 5.5, maxSize: 7.5 }, // vh
    { label: "medium", ratio: 0.25, minSize: 8, maxSize: 10 }, // vh
    { label: "large", ratio: 0.15, minSize: 10.5, maxSize: 13.5 }, // vh
    { label: "giant", ratio: 0.1, minSize: 15, maxSize: 20 }, // vh
  ];

  return buckets.map((bucket) => {
    // A. Calculate Max Count for this bucket
    const maxCount = Math.max(1, Math.floor(totalMeteors * bucket.ratio));

    // B. Calculate Random Size for this bucket (average for consistent look)
    // const sizeVal = Math.floor((bucket.minSize + bucket.maxSize) / 2);
    const sizeVal = Math.floor(
      Math.random() * (bucket.maxSize - bucket.minSize + 1) + bucket.minSize
    );

    console.log(`[Meteor] ${bucket.label} meteors: ${maxCount} x ${sizeVal}vh`);

    // C. Calculate Speed (Larger = Slower)
    // Base speed 2s + factor based on size.
    // Small (3vh) ≈ 3s duration. Giant (40vh) ≈ 15s duration.
    // const speed = Math.floor(2 + sizeVal * 0.4);

    // C. SPEED CALCULATION (Velocity Factor)
    // Previously "5" meant 5 seconds. Now "5" means 5ms per pixel (slower).
    // Small meteors (size 3) -> Speed Factor 2 (Fast)
    // Giant meteors (size 40) -> Speed Factor 10 (Slow)
    const velocityFactor = 10 + sizeVal * 0.25;

    return {
      size: `${sizeVal}vh`,
      speed: velocityFactor, // Passed to component to calculate duration
      maxCount: maxCount,
      count: 0,
      // D. Visual Hierarchy: Larger meteors are "closer", so higher zIndex
      zIndex: sizeVal,
    };
  });
};
