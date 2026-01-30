import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { Siemreap, Moul } from "next/font/google";
import { darkTheme } from "@/theme/razeth";
import ThemeProviderWrapper from "@/components/effect/themes/theme-wrapper";
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
        className={`${geistSans.variable} ${geistMono.variable} ${siemreap.variable} ${moul.variable} antialiased`}
      >
        {/* <ThemeProvider theme={darkTheme}>{children}</ThemeProvider> */}
        <ThemeProviderWrapper theme={darkTheme}>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
