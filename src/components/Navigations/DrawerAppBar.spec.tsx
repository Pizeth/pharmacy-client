import type { NavigationDrawerProps, NavigationHeaderProps } from "./types";
import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DrawerAppBar } from "./DrawerAppBar";

jest.mock("@tsparticles/nextjs", () => ({ NextParticlesProvider: ({ children }: { children: React.ReactNode }) => children }));
jest.mock("./Navigation/useHeaderScrollState", () => ({ useHeaderScrollState: () => ({ headerRef: { current: null }, scrolled: true, headerHeight: 156 }) }));
jest.mock("./components/NavigationHeader", () => ({ NavigationHeader: ({ onToggle, open, compactDesktop, disabledMenu }: NavigationHeaderProps) =>
  <button onClick={onToggle} aria-expanded={open} data-compact={compactDesktop} data-disabled-menu={disabledMenu}>Toggle drawer</button> }));
jest.mock("./components/NavigationDrawer", () => ({ NavigationDrawer: ({ open, onNavigate }: NavigationDrawerProps & { open: boolean }) =>
  open ? <button onClick={onNavigate}>Navigate</button> : null }));

it("coordinates drawer navigation without losing the measured main offset or background", () => {
  const theme = createTheme({ cssVariables: true });
  const { container } = render(<ThemeProvider theme={theme}><DrawerAppBar backgroundColor="rgb(1, 2, 3)"><h1>Page content</h1></DrawerAppBar></ThemeProvider>);
  const main = screen.getByRole("main");
  expect(main.style.getPropertyValue("--Navigation-expanded-height")).toBe("156px");
  expect(getComputedStyle(main).backgroundColor).toBe("rgb(1, 2, 3)");
  fireEvent.click(screen.getByRole("button", { name: "Toggle drawer" }));
  expect(screen.getByRole("button", { name: "Toggle drawer" })).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: "Navigate" }));
  expect(screen.queryByRole("button", { name: "Navigate" })).not.toBeInTheDocument();
  expect(container.querySelector("h1")).toHaveTextContent("Page content");
});

it("keeps the compact desktop menu disabled when requested", () => {
  render(<ThemeProvider theme={createTheme()}><DrawerAppBar disabledMenu>Content</DrawerAppBar></ThemeProvider>);
  const toggle = screen.getByRole("button", { name: "Toggle drawer" });
  expect(toggle).toHaveAttribute("data-compact", "false");
  expect(toggle).toHaveAttribute("data-disabled-menu", "true");
});
