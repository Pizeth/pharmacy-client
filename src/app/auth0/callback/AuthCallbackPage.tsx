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
  // searchParams: Record<string, string>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Normalize to URLSearchParams if your authProvider expects it
        const urlParams = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => urlParams.append(key, v));
          } else if (value != null) {
            urlParams.append(key, value);
          }
        });
        const result = await authProvider.handleOAuthCallback(urlParams);

        // router.push("/admin");
        if (result) {
          router.push("/admin");
        } else {
          // router.push("/admin"); // Let React Admin handle auth redirect
          router.push("/auth/login"); // No result, redirect to login
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

<div className="min-h-screen w-full bg-white relative text-gray-800">
  {/* Crosshatch Art - Light Pattern */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
    }}
  />
  {/* Your Content/Components */}
</div>;

<div className="min-h-screen w-full bg-[#101014] relative text-white">
  {/* Complex Multiplier Pattern (Enhanced) */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
       repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
        radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
      `,
      backgroundSize: "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
      backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
    }}
  />
  {/* Your Content/Components */}
</div>;

<div className="min-h-screen w-full bg-white relative text-gray-800">
  {/* Crosshatch Art - Light Pattern */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
    }}
  />
  {/* Your Content/Components */}
</div>;

<div className="min-h-screen w-full bg-[#faf9f6] relative">
  {/* Paper Texture */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
      backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    }}
  />
  {/* Your Content/Components */}
</div>;

<div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
  {/* Crosshatch Art - Dark Pattern */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
      `,
    }}
  />
  {/* Your Content/Components */}
</div>;

<div className="min-h-screen w-full bg-[#000000] relative text-white">
  {/* Gradient Diagonal Lines Pattern */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
         repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
      `,
      backgroundSize: "24px 24px, 24px 24px, 8px 8px",
    }}
  />
  {/* Your Content/Components */}
</div>;
