"use client";
import { useId } from "react";
import Typography from "@mui/material/Typography";
import { styled, keyframes } from "@mui/material/styles";

const rotation = keyframes({ to: { transform: "rotate(360deg)" } });
const textShimmer = keyframes({ to: { backgroundPosition: "200% center" } });
export const CloudLoaderMessage = styled(Typography, {
  name: "RazethCloudLoader", slot: "Message", overridesResolver: (_props, styles) => styles.message,
})(({ theme }) => ({
  fontWeight: 600, textAlign: "center",
  color: (theme.vars ?? theme).palette.primary.main,
  backgroundImage: `linear-gradient(90deg, ${(theme.vars ?? theme).palette.primary.main}, ${(theme.vars ?? theme).palette.error.main}, ${(theme.vars ?? theme).palette.primary.main})`,
  backgroundSize: "200% auto", backgroundClip: "text", WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent", animation: `${textShimmer} 3s linear infinite`,
  filter: `drop-shadow(0 0 6px ${theme.alpha((theme.vars ?? theme).palette.error.main, 0.3)})`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
}));
const lines = keyframes({ from: { transform: "translateY(-10px)" }, to: { transform: "translateY(8px)" } });
const cloud = keyframes({
  "0%, 100%": { cx: 20, cy: 60, r: 15 }, "50%": { cx: 50, cy: 45, r: 20 },
});
const Root = styled("svg", {
  name: "RazethCloudLoader", slot: "Root", overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  width: 100, height: 100, flexShrink: 0,
  color: (theme.vars ?? theme).palette.primary.light,
  "& [data-arrows]": { transformOrigin: "50% 72.8938%", fill: (theme.vars ?? theme).palette.primary.main, filter: `drop-shadow(0 0 8px ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.4)})`, animation: `${rotation} 1s linear infinite` },
  "& [data-cloud-circle]": { animation: `${cloud} 2s linear infinite` },
  "& [data-cloud-circle]:nth-child(2)": { animationDelay: "-0.666667s" },
  "& [data-cloud-circle]:nth-child(3)": { animationDelay: "-1.333333s" },
  "& line": { strokeWidth: 5, transformOrigin: "50% 50%", rotate: "-65deg", animation: `${lines} 0.75188s linear infinite` },
  "@media (prefers-reduced-motion: reduce)": { "& *": { animation: "none" } },
}));

/** Adapted from andrew-manzyk's MIT-licensed Uiverse cloud loader. */
export default function CloudLoader() {
  const id = useId();
  const roundness = `${id}-roundness`, shapes = `${id}-shapes`, clipping = `${id}-clipping`;
  return <Root viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <filter id={roundness}><feGaussianBlur in="SourceGraphic" stdDeviation="1.5" /><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" /></filter>
      <mask id={shapes}><g fill="white">
        <polygon points="50 37.5 80 75 20 75 50 37.5" /><circle cx="20" cy="60" r="15" /><circle cx="80" cy="60" r="15" />
        <g>{[0, 1, 2].map(index => <circle key={index} data-cloud-circle cx="20" cy="60" r="15" />)}</g>
      </g></mask>
      <mask id={clipping}><g filter={`url(#${roundness})`}><g mask={`url(#${shapes})`} stroke="white">
        {Array.from({ length: 21 }, (_, index) => <line key={index} x1="-50" y1={-40 + index * 9} x2="150" y2={-40 + index * 9} />)}
      </g></g></mask>
    </defs>
    <rect width="100" height="100" fill="currentColor" mask={`url(#${clipping})`} />
    <g data-arrows>
      <path d="M33.52,68.12 C35.02,62.8 39.03,58.52 44.24,56.69 C49.26,54.93 54.68,55.61 59.04,58.4 L56.24,60.53 C55.45,61.13 55.68,62.37 56.63,62.64 L67.21,65.66 C67.98,65.88 68.75,65.3 68.74,64.5 L68.68,53.5 C68.67,52.51 67.54,51.95 66.75,52.55 L64.04,54.61 C57.88,49.79 49.73,48.4 42.25,51.03 C35.2,53.51 29.78,59.29 27.74,66.49 C27.29,68.08 28.22,69.74 29.81,70.19 C30.09,70.27 30.36,70.31 30.63,70.31 C31.94,70.31 33.14,69.44 33.52,68.12Z" />
      <path d="M69.95,74.85 C68.35,74.4 66.7,75.32 66.25,76.92 C64.74,82.24 60.73,86.51 55.52,88.35 C50.51,90.11 45.09,89.43 40.73,86.63 L43.53,84.51 C44.31,83.91 44.08,82.67 43.13,82.4 L32.55,79.38 C31.78,79.16 31.02,79.74 31.02,80.54 L31.09,91.54 C31.09,92.53 32.22,93.09 33.01,92.49 L35.72,90.43 C39.81,93.63 44.77,95.32 49.84,95.32 C52.41,95.32 55,94.89 57.51,94.01 C64.56,91.53 69.99,85.75 72.02,78.55 C72.47,76.95 71.54,75.3 69.95,74.85Z" />
    </g>
  </Root>;
}
