import { makePulseSequence } from "@/utils/colorStop";

// function getEnvNumber(key: string, fallback: number): number {
//   const raw = process.env[key] ?? import.meta.env?.[key]; // works in CRA or Vite
//   const parsed = raw !== undefined ? Number(raw) : NaN;
//   return isNaN(parsed) ? fallback : parsed;
// }

/**
 * Parses an environment variable as a number.
 * * @param key The environment variable key.
 * (e.g., "DATABASE_PORT" on server, "NEXT_PUBLIC_ITEMS_PER_PAGE" on client/server)
 * @param fallback A default value if parsing fails.
 * @returns The parsed number or the fallback.
 */
export function getEnvNumber(key: string, fallback: number): number {
  // In Next.js, all env vars are on process.env
  const raw = process.env[key];

  const parsed = raw !== undefined ? Number(raw) : NaN;
  return isNaN(parsed) ? fallback : parsed;
}

// function getEnvObject<T>(key: string, fallback: T): T {
//   const raw = process.env[key];
//   if (!raw) return fallback;
//   try {
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }

function getEnvObject<T>(key: string, fallback: T): T {
  console.log(`Fetching env var for key: ${key}`);
  // const raw = process.env[key as keyof NodeJS.ProcessEnv]; // ensure exact key lookup
  const raw = process.env[key] ?? import.meta.env?.[key]; // ensure exact key lookup
  console.log(`Raw value for ${key}:`, raw);
  if (!raw) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`${key} missing; using fallback`);
    }
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Invalid JSON in ${key}: "${raw}" — using fallback`, e);
    return fallback;
  }
}

export function getSideImageConfig() {
  const a = getEnvObject("NEXT_PUBLIC_PULSE_MIN", 1);
  const circleSize = process.env.NEXT_PUBLIC_CIRCLE_SIZE || "30%";
  const circleColor =
    process.env.NEXT_PUBLIC_CIRCLE_COLOR || "rgba(220, 38, 38, 1)";
  const logoOffset = process.env.NEXT_PUBLIC_LOGO_OFFSET || "3%";
  const circleStopCount = getEnvNumber("NEXT_PUBLIC_CIRCLE_STOP_COUNT", 35);
  const circlePulseMin = getEnvNumber("NEXT_PUBLIC_CIRCLE_PULSE_MIN", 0.25);
  const circlePulseMax = getEnvNumber("NEXT_PUBLIC_CIRCLE_PULSE_MAX", 0.95);
  console.log("circlePulseMax:", circlePulseMax);
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
  const captionFontSize = getEnvObject("NEXT_PUBLIC_CAPTION_FONT_SIZE", {
    xs: "0.75rem",
    sm: "1.1rem",
    md: "1.3rem",
  });
  console.log("captionFontSize:", captionFontSize);
  const captionShadowStrength =
    process.env.NEXT_PUBLIC_CAPTION_SHADOW_STRENGTH || 7.5;
  const captionOffset = getEnvObject("NEXT_PUBLIC_CAPTION_OFFSET", {
    xs: "8px",
    sm: "12px",
    md: "16px",
  });
  console.log("captionOffset:", captionOffset);

  //   const circleStopCount = 35;
  //   const circlePulseMin = 0.25;
  //   const circlePulseMax = 0.75;
  //   const circlePulseDuration = "5s";
  //   const maxOpacity = "0.3";

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
  };
}
