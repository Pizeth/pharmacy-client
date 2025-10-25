// app/auth/callback/AuthCallbackPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authProvider } from "@/lib/authProvider";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

export default function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await authProvider.handleOAuthCallback(searchParams);

        if (result) {
          router.push("/admin");
        } else {
          router.push("/admin"); // Let React Admin handle auth redirect
        }
      } catch (error) {
        console.error("Callback handling failed:", error);
        router.push(
          `/admin?error=${encodeURIComponent(
            error instanceof Error ? error.message : "Authentication failed"
          )}`
        );
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={64} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Processing authentication...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we complete your login
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
