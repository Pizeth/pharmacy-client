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
  // mode: "light" as "light" | "dark",
  mode: "light" as "light" | "dark" | "system" | undefined,
});

export const useThemeControl = () => useContext(ThemeContext);

// ── inner component — must be a child of ThemeProvider to use useColorScheme ──
function ThemeController({ children }: { children: React.ReactNode }) {
  // const [mode, setMode] = useState<"light" | "dark">("light");
  // const { mode, setMode, systemMode } = useColorScheme();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   // Initial Theme Detection
  //   // const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  //   // const systemDark = window.matchMedia(
  //   //   "(prefers-color-scheme: dark)",
  //   // ).matches;
  //   // const initialMode = savedTheme || (systemDark ? "dark" : "light");
  //   // const initialMode = systemMode || (systemDark ? "dark" : "light");

  //   // setMode(initialMode);
  //   // setMode(mode === "dark" ? "light" : "dark");
  //   // document.documentElement.classList.toggle("dark", initialMode === "dark");
  //   setMounted(true); // ← nothing else, MUI restores saved mode on its own
  // }, []);

  // const toggleTheme = () => {
  //   // const newMode = mode === "light" ? "dark" : "light";
  //   // console.log("Toggling theme to: ", newMode);
  //   // setMode(newMode);
  //   setMode(mode === "light" ? "dark" : "light"); // ← nothing else
  //   // localStorage.setItem("theme", newMode);
  //   // document.documentElement.classList.toggle("dark", newMode === "dark");
  //   // Clean up and set the correct class for MUI CSS Variables
  //   // document.documentElement.classList.remove("light", "dark");
  //   // document.documentElement.classList.add(newMode);
  // };

  //   const theme = useMemo(() => getCustomTheme(mode), [mode]);
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ← nothing else, MUI restores saved mode on its own
  }, []);

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light"); // ← nothing else
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      {mounted ? (
        children
      ) : (
        <div style={{ visibility: "hidden" }}>{children}</div>
      )}
      <BackToTopFab />
    </ThemeContext.Provider>
  );
}

export default function ThemeProviderWrapper<Theme = DefaultTheme>({
  theme,
  children,
  // ...props
}: ThemeProviderProps<Theme>) {
  return (
    // <ThemeContext.Provider value={{ toggleTheme, mode }}>
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode="dark" noSsr>
        <CssBaseline />
        {/* <InitColorSchemeScript attribute="class" /> */}
        {/* <ResponsiveAppBar /> */}
        {/* <PrimarySearchAppBar /> */}
        {/* <PersistentDrawerLeft /> */}
        {/* We use a fragment here because the html/body tags are in the Server Layout */}
        {/* {mounted ? (
            children
          ) : (
            // <DrawerAppBar>{children}</DrawerAppBar>
            <div style={{ visibility: "hidden" }}>{children}</div>
          )}
          <BackToTopFab /> */}
        <ThemeController>{children}</ThemeController>
      </ThemeProvider>
    </AppRouterCacheProvider>
    // </ThemeContext.Provider>
  );
}
