"use client";

import { useState, useEffect, useMemo, createContext, useContext } from "react";
import {
  ThemeProvider,
  ThemeProviderProps,
  useColorScheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DefaultTheme } from "@mui/system";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ResponsiveAppBar from "@/components/Navigations/AppBar"; // PrimarySearchAppBar,
import BackToTopFab from "@/components/Navigations/BackToTop";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import PersistentDrawerLeft from "@/components/fts/menu";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "light" as "light" | "dark",
  // mode: "light" as "light" | "dark" | "system" | undefined,
});

export const useThemeControl = () => useContext(ThemeContext);

export default function ThemeProviderWrapper<Theme = DefaultTheme>({
  theme,
  children,
  // ...props
}: ThemeProviderProps<Theme>) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  // const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial Theme Detection
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialMode = savedTheme || (systemDark ? "dark" : "light");

    setMode(initialMode);
    document.documentElement.classList.toggle("dark", initialMode === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    // document.documentElement.classList.toggle("dark", newMode === "dark");
    // Clean up and set the correct class for MUI CSS Variables
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newMode);
  };

  //   const theme = useMemo(() => getCustomTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <InitColorSchemeScript attribute="class" />
          {/* <ResponsiveAppBar /> */}
          {/* <PrimarySearchAppBar /> */}
          {/* <PersistentDrawerLeft /> */}
          {/* We use a fragment here because the html/body tags are in the Server Layout */}
          {mounted ? (
            children
          ) : (
            // <DrawerAppBar>{children}</DrawerAppBar>
            <div style={{ visibility: "hidden" }}>{children}</div>
          )}
          <BackToTopFab />
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext.Provider>
  );
}
