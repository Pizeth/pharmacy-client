import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Siemreap, Moul } from "next/font/google";
import { darkTheme } from "@/theme/razeth";
import ThemeProviderWrapper from "@/components/effect/themes/theme-wrapper";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import RefineContext from "./refineContext";
import Script from "next/script";
import { Suspense } from "react";
import { RouteContentLoading } from "@/components/layouts/RouteContentLoading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ប្រព័ន្ធគ្រប់គ្រងការងាររបស់នាយកដ្ឋានធនធានមនុស្ស",
  description:
    "ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងការងាររបស់នាយកដ្ឋានធនធានមនុស្ស នៃក្រសួងមុខងារសាធារណៈ",
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

const tactieng = localFont({
  src: [
    {
      path: "../../public/fonts/Tacteing.ttf",
      style: "normal",
    },
  ],
  variable: "--font-tactieng",
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

const kantumruy = localFont({
  src: [
    {
      path: "../../public/fonts/kantumruy/KantumruyPro-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-kantumruy",
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

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* React Scan monitoring script */}
      {/* <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          strategy="beforeInteractive"
        />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mef1.variable} ${mef2.variable} ${interKhmerLooped.variable} ${interKhmerLoopless.variable} ${googleSans.variable}  ${siemreap.variable} ${moul.variable} ${kantumruy.variable} ${montserrat.variable} ${tactieng.variable} antialiased`}
      >
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive" // 👈 loads right after hydration, not lazily
        />
        {/* <AppRouterCacheProvider>{children}+ </AppRouterCacheProvider> */}
        {/* <InitColorSchemeScript attribute="class" /> ← before everything */}
        <ThemeProviderWrapper theme={darkTheme}>
          <Suspense fallback={<RouteContentLoading />}>
            {/* <RefineContext>{children}</RefineContext> */}
            {children}
          </Suspense>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

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
