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

const TurnstileWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  margin: theme.spacing(1, 0),
  // padding: theme.spacing(1, 0),
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `0.5px solid ${theme.vars.palette.divider}`,
  background: theme.vars.palette.background.paper,
  overflow: "hidden",
  minHeight: "65px",
  position: "relative",
  // Match the neumorphic shadow your other inputs use
  boxShadow: theme.vars.palette.customShadows?.neumorphic,
  transition: theme.transitions.create(["border-color", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),
  // Iframe injected by Turnstile
  "& iframe": {
    display: "block",
    margin: "0 auto",
    borderRadius: theme.shape.borderRadius,
  },
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

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current) return;

    // Remove existing widget before re-rendering
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {}
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: turnstileTheme, // 👈 dynamic theme
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
      sx={{
        borderColor:
          status === "error"
            ? "error.main"
            : status === "success"
              ? "success.main"
              : "divider",
      }}
    >
      {/* Actual Turnstile iframe mounts here */}
      <Box ref={containerRef} sx={{ width: "100%" }} />

      {/* Subtle status label under the widget */}
      {status === "error" && (
        <StatusText color="error.main" pb={0.5}>
          Verification failed — please retry
        </StatusText>
      )}
      {status === "success" && (
        <StatusText color="success.main" pb={0.5}>
          ✓ Verified
        </StatusText>
      )}
    </TurnstileWrapper>
  );
};
