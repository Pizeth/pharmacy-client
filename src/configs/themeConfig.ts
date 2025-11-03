import { makePulseSequence } from "@/utils/colorStop";

function getEnvNumber(key: string, fallback: number): number {
  const raw = process.env[key] ?? import.meta.env?.[key]; // works in CRA or Vite
  const parsed = raw !== undefined ? Number(raw) : NaN;
  return isNaN(parsed) ? fallback : parsed;
}

export function getSideImageConfig() {
  const circleSize = process.env.NEXT_PUBLIC_CIRCLE_SIZE || "30%";
  const circleColor =
    process.env.NEXT_PUBLIC_CIRCLE_COLOR || "rgba(220, 38, 38, 1)";
  const logoOffset = process.env.NEXT_PUBLIC_LOGO_OFFSET || "3%";
  const circleStopCount = getEnvNumber("NEXT_PUBLIC_CIRCLE_STOP_COUNT", 35);
  const circlePulseMin = getEnvNumber("NEXT_PUBLIC_CIRCLE_PULSE_MIN", 0.25);
  const circlePulseMax = getEnvNumber("NEXT_PUBLIC_CIRCLE_PULSE_MAX", 0.75);
  const circlePulseDuration =
    process.env.NEXT_PUBLIC_CIRCLE_PULSE_SPEED || "5s";
  const maxOpacity = parseFloat(process.env.NEXT_PUBLIC_MAX_OPACITY || "0.3");

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
  };
}
