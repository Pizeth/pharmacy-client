import { act, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PulseLoader from "../loader";

jest.mock("@/components/Avatar/AvatarContainer", () => ({
  __esModule: true,
  default: ({ src, className, neumorphic, softGlow }: { src: string; className: string; neumorphic: boolean; softGlow: boolean }) =>
    <div className={className} data-neumorphic={neumorphic} data-soft-glow={softGlow}><img src={src} alt="" /></div>,
}));

test("uses the shared logo avatar inside an accessible, theme-overridable loading layer", () => {
  const theme = createTheme({ cssVariables: true, components: {
    RazethLoader: { styleOverrides: { root: { padding: "27px" } } },
  } });
  const view = render(<ThemeProvider theme={theme}><PulseLoader /></ThemeProvider>);
  const status = screen.getByRole("status");
  expect(status).toHaveAccessibleName("Loading…");
  expect(status).toHaveAttribute("aria-busy", "true");
  expect(status).toHaveStyle({ padding: "27px" });
  expect(status.querySelector("img")).toHaveAttribute("src", "/static/images/logo.svg");
  expect(status.querySelector("[data-neumorphic]")).toHaveAttribute("data-neumorphic", "true");
  expect(status.querySelector("[data-soft-glow]")).toHaveAttribute("data-soft-glow", "true");
  view.unmount();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("starts at a random message, cycles, and clears its timer on unmount", () => {
  jest.useFakeTimers();
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  try {
    const view = render(<ThemeProvider theme={createTheme({ cssVariables: true })}><PulseLoader /></ThemeProvider>);
    expect(screen.getByText("Initializing System")).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(2500); });
    expect(screen.getByText("Syncing Neural Interface")).toBeInTheDocument();
    view.unmount();
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    random.mockRestore();
    jest.useRealTimers();
  }
});
