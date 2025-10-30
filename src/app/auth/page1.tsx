// // app/auth/callback/page.tsx - OAuth callback handler
// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { authProvider } from "@/lib/authProvider";
// import { Box, Typography, CircularProgress } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

// const theme = createTheme();

// export default function AuthCallbackPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         const result = await authProvider.handleOAuthCallback(searchParams!);

//         if (result) {
//           // Success - redirect to admin
//           router.push("/admin");
//         } else {
//           // No result, redirect to login
//           router.push("/admin"); // Let React Admin handle auth redirect
//         }
//       } catch (error) {
//         console.error("Callback handling failed:", error);
//         router.push(
//           `/admin?error=${encodeURIComponent(
//             error instanceof Error ? error.message : "Authentication failed"
//           )}`
//         );
//       }
//     };

//     if (searchParams) {
//       handleCallback();
//     }
//   }, [router, searchParams]);

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           textAlign: "center",
//         }}
//       >
//         <CircularProgress size={64} sx={{ mb: 2 }} />
//         <Typography variant="h6" color="text.primary" gutterBottom>
//           Processing authentication...
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Please wait while we complete your login
//         </Typography>
//       </Box>
//     </ThemeProvider>
//   );
// }
