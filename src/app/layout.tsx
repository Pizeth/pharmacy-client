import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { Siemreap, Moul } from "next/font/google";
import { darkTheme, RazethBaseTheme } from "@/theme/razeth";
import ThemeProviderWrapper from "@/components/effect/themes/theme-wrapper";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to Razeth Systems",
  description: "The Ultimate Pharmacy Management Solution",
};

// Load Khmer Fonts
const siemreap = Siemreap({
  subsets: ["khmer"],
  weight: "400",
  display: "swap",
  variable: "--font-siemreap",
});

const moul = Moul({
  subsets: ["khmer"],
  weight: "400",
  display: "swap",
  variable: "--font-moul",
});

const FONT_PATH = "../../public/fonts/";

const mef1 = localFont({
  src: [
    {
      path: "../../public/fonts/KHMERMEF1.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mef1",
});

const mef2 = localFont({
  src: [
    {
      path: "../../public/fonts/KHMERMEF2.ttf",
      // weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-mef2",
});

const interKhmerLooped = localFont({
  src: [
    {
      path: "../../public/fonts/interkhmer/InterKhmerLooped[wght].ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/interkhmer/InterKhmerLooped-Italic[wght].ttf",
      style: "italic",
    },
  ],
  variable: "--font-interkhmer",
});

const interKhmerLoopless = localFont({
  src: [
    {
      path: "../../public/fonts/interkhmer/InterKhmerLoopless[wght].ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/interkhmer/InterKhmerLoopless-Italic[wght].ttf",
      style: "italic",
    },
  ],
  variable: "--font-interkhmerloopless",
});

const googleSans = localFont({
  src: [
    {
      path: "../../public/fonts/googlesan/GoogleSans-VariableFont_GRAD,opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/googlesan/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-google",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [mode, setMode] = useState("light");
  // // Logic to toggle dark mode automatically based on official Tailwind guide
  // useEffect(() => {
  //   const isDark =
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches);

  //   setMode(isDark ? "dark" : "light");

  //   if (isDark) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mef1.variable} ${mef2.variable} ${interKhmerLooped.variable} ${interKhmerLoopless.variable} ${googleSans.variable}  ${siemreap.variable} ${moul.variable} antialiased`}
      >
        {/* {children} */}
        {/* <ThemeProvider theme={darkTheme}>{children}</ThemeProvider> */}
        {/* <AppRouterCacheProvider>{children}+ </AppRouterCacheProvider> */}
        <ThemeProviderWrapper theme={darkTheme}>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
