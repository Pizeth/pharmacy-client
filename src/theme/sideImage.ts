import type { Theme } from "@mui/material/styles";
import { wee } from "./keyframes";

/** Light adaptation of the moving dot field, with saturated color against neutral masks. */
export const RazethSideImageOptimized = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      ...theme.applyStyles("light", {
        backgroundColor: "#E4E7EC",
        backgroundImage: "linear-gradient(145deg, #F5F2EB, #E4E7EC 55%, #D4DBE5)",
        "&::before": {
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 1.5px, #E4E7EC 0 var(--c), transparent var(--c)),
            radial-gradient(circle at 50% 50%, transparent 1.5px, #E4E7EC 0 var(--c), transparent var(--c)),
            radial-gradient(circle at 50% 50%, #315AA8, transparent 60%),
            radial-gradient(circle at 50% 50%, #B47C20, transparent 60%),
            radial-gradient(circle at 50% 50%, #7650A0, transparent 60%),
            radial-gradient(ellipse at 50% 50%, #B65F3C, transparent 60%)`,
          // Neutral masks stay light during hue rotation; multiply gives the dots ink-like contrast.
          mixBlendMode: "multiply",
        },
        "&::after": {
          content: "''",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          // Platinum midtones remain visible on the light surface without washing out the dots.
          backgroundImage: `
            linear-gradient(transparent, transparent),
            linear-gradient(transparent, transparent),
            radial-gradient(circle, rgba(178,184,194,0.55), transparent 60%),
            radial-gradient(circle, rgba(205,209,216,0.45), transparent 60%),
            radial-gradient(circle, rgba(147,156,171,0.35), transparent 60%),
            radial-gradient(ellipse, rgba(192,198,207,0.4), transparent 60%)`,
          "--p": "0px 0px, 6px 10.39230485px",
          backgroundSize: "12px 20.7846097px, 12px 20.7846097px, 200% 200%, 200% 200%, 200% 200%, 200% 20.7846097px",
          mixBlendMode: "multiply",
          animation: `${wee} 40s linear infinite`,
        },
      }),
    }),
    content: ({ theme }: { theme: Theme }) => ({
      ...theme.applyStyles("light", {
        zIndex: 1,
        backgroundImage: `
          repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(38,36,123,0.045) 2px, rgba(38,36,123,0.045) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(211,137,68,0.06) 2px, rgba(211,137,68,0.06) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(96,165,250,0.05) 2px, rgba(96,165,250,0.05) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(240,197,76,0.06) 2px, rgba(240,197,76,0.06) 3px, transparent 3px, transparent 8px)`,
      }),
    }),
    card: ({ theme }: { theme: Theme }) => ({
      ...theme.applyStyles("light", {
        backgroundColor: "#34383E",
        boxShadow: "0 0 20px 7px rgba(52,56,62,0.42), 0 0 44px 16px rgba(176,113,27,0.32)",
        "&::before": {
          backgroundImage: "radial-gradient(circle, rgba(229,228,226,0.2), rgba(52,56,62,0.28) 55%, transparent 72%)",
        },
        "&::after": {
          // The logo retains its original rainbow hue animation against dark titanium.
          backgroundImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, rgba(52,56,62,0.92) 2px)",
          "--f": "blur(0.4em) brightness(3) saturate(1.6)",
        },
      }),
    }),
  },
};
