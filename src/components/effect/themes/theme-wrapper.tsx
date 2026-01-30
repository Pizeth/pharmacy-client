"use client";

import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { ThemeProvider, ThemeProviderProps } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DefaultTheme } from "@mui/system";
// import { getCustomTheme } from "../theme";

const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "light" as "light" | "dark",
});
export const useThemeControl = () => useContext(ThemeContext);

export default function ThemeProviderWrapper<Theme = DefaultTheme>({
  theme,
  children,
  ...props
}: ThemeProviderProps<Theme>) {
  const [mode, setMode] = useState<"light" | "dark">("light");
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
    document.documentElement.classList.toggle("dark", newMode === "dark");
  };

  //   const theme = useMemo(() => getCustomTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme} {...props}>
        <CssBaseline />
        {/* We use a fragment here because the html/body tags are in the Server Layout */}
        {mounted ? (
          children
        ) : (
          <div style={{ visibility: "hidden" }}>{children}</div>
        )}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
