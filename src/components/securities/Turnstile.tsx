// src/components/turnstile/Turnstile.tsx
"use client";

import { TurnstileProps } from "@/interfaces/cloudflare.interface";
import { Status } from "@/types/auth";
import Box from "@mui/material/Box";
import { styled, useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: object) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const PREFIX = "RazethTurnstile";

const TurnstileWrapper = styled(Box, {
  name: PREFIX,
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "status",
  overridesResolver: (_props, styles) => styles.root,
})<{ status: Status }>(({ theme, status }) => ({
  display: "flex",
  margin: theme.spacing(1, 0),
  // padding: theme.spacing(1, 0),
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "auto",
  // FIX: Force line-height to 0 so the container strictly collapses to the iframe
  lineHeight: 0,
  fontSize: 0,
  borderRadius: "15px",
  border: `0.5px solid ${theme.vars.palette.divider}`,
  borderColor:
    status === "error"
      ? theme.vars.palette.error.main
      : status === "success"
        ? theme.vars.palette.primary.main
        : theme.vars.palette.divider,
  background: theme.vars.palette.background.paper,
  overflow: "hidden",
  position: "relative",
  // Match the neumorphic shadow your other inputs use
  boxShadow: theme.vars.palette.customShadows?.neumorphic,
  transition: theme.transitions.create(["border-color", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),

  // 1️⃣ Target the container div containing the iframe to match the sizing scale
  "& > div": {
    width: "100%",
    borderRadius: "15px",
    // padding: theme.spacing(1),
    clipPath: `inset(1.5px round 15px)`,
    overflow: "hidden",
    // transform: "scale(1.01)", // Scale up slightly to force clipped edges into layout bounds
  },

  // 2️⃣ Apply the clip-path directly onto the injected iframe
  "& iframe": {
    display: "block",
    margin: "0 auto",
    padding: 0,
    borderRadius: "15px",
    border: 0,
    verticalAlign: "bottom",
    transform: "translateY(-1px)",

    // 👇 The Fix: Trim Cloudflare's default 1px border.
    // Uses the component's theme border radius to align edges cleanly.
    // clipPath: `inset(5px round ${theme.shape.borderRadius}px)`,
  },

  // // Iframe injected by Turnstile
  // "& iframe": {
  //   display: "block",
  //   margin: "0 auto",
  //   borderRadius: theme.shape.borderRadius,
  //   border: "none",
  //   verticalAlign: "bottom", // FIX: Removes default inline baseline spacing
  // },
}));

const StatusText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.vars.palette.text.secondary,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
}));

export const Turnstile = ({
  siteKey,
  onSuccess,
  onExpire,
  onError,
}: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  // 👇 Read MUI color scheme — works with both light and dark
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;
  const turnstileTheme = resolvedMode === "dark" ? "dark" : "light";
  // Map Material-UI mode values to Cloudflare theme specs ("light", "dark", or "auto")
  const resolvedTheme = mode === "dark" || mode === "light" ? mode : "auto";

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current) return;

    // Remove existing widget before re-rendering
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {
        console.error("Failed to remove old Turnstile widget", e);
      }
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: resolvedTheme, // 👈 Dynamically forces dark styling to remove bright borders
      size: "flexible",
      callback: (token: string) => {
        setStatus("success");
        onSuccess?.(token);
      },
      "expired-callback": () => {
        setStatus("idle");
        onExpire?.();
      },
      "error-callback": () => {
        setStatus("error");
        onError?.();
      },
      "before-interactive-callback": () => setStatus("idle"),
      "after-interactive-callback": () => setStatus("success"),
    });

    setStatus("idle");
  }, [siteKey, turnstileTheme, onSuccess, onExpire, onError]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.turnstile) {
      // Script already loaded — render immediately
      renderWidget();
    } else {
      // 👇 Poll until turnstile is available (handles lazyOnload timing)
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);

      return () => clearInterval(interval);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  // 👇 Re-render widget when theme changes
  useEffect(() => {
    if (widgetIdRef.current) {
      renderWidget();
    }
  }, [turnstileTheme, renderWidget]);

  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const renderWidget = () => {
  //     if (!window.turnstile || !containerRef.current) return;

  //     // Clean up existing widget if any
  //     if (widgetIdRef.current) {
  //       window.turnstile.remove(widgetIdRef.current);
  //     }

  //     widgetIdRef.current = window.turnstile.render(containerRef.current, {
  //       sitekey: siteKey,
  //       theme: "dark",
  //       size: "flexible", // 👈 stretches to fill container width
  //       callback: (token: string) => {
  //         setStatus("success");
  //         onSuccess?.(token);
  //       },
  //       "expired-callback": () => {
  //         setStatus("idle");
  //         onExpire?.();
  //       },
  //       "error-callback": () => {
  //         setStatus("error");
  //         onError?.();
  //       },
  //       "before-interactive-callback": () => setStatus("idle"),
  //       "after-interactive-callback": () => setStatus("success"),
  //       // "expired-callback": onExpire,
  //       // "error-callback": onError,
  //     });
  //     setStatus("idle");
  //   };

  //   // If turnstile already loaded
  //   if (window.turnstile) {
  //     renderWidget();
  //   } else {
  //     // Wait for script to load
  //     const script = document.querySelector(
  //       'script[src*="turnstile"]',
  //     ) as HTMLScriptElement;
  //     if (script) {
  //       script.addEventListener("load", renderWidget);
  //       return () => script.removeEventListener("load", renderWidget);
  //     }
  //   }

  //   return () => {
  //     if (widgetIdRef.current && window.turnstile) {
  //       window.turnstile.remove(widgetIdRef.current);
  //     }
  //   };
  // }, [siteKey, onSuccess, onExpire, onError]);

  // return <div ref={containerRef} />;
  return (
    <TurnstileWrapper
      // sx={{
      //   borderColor:
      //     status === "error"
      //       ? "error.main"
      //       : status === "success"
      //         ? "success.main"
      //         : "divider",
      // }}
      status={status}
    >
      {/* Actual Turnstile iframe mounts here */}
      <Box ref={containerRef} width="100%" />

      {/* Subtle status label under the widget */}
      {/* {status === "error" && (
        <StatusText color="error.main" pb={0.5}>
          Verification failed — please retry
        </StatusText>
      )}
      {status === "success" && (
        <StatusText color="success.main" pb={0.5}>
          ✓ Verified
        </StatusText>
      )} */}
    </TurnstileWrapper>
  );
};
