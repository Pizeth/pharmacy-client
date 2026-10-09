import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdCardCarousel } from "./HrdCardCarousel";

test("cycles all eleven cards, wraps both ways, and exposes the three flippable links", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  expect(screen.getByText("1 / 11")).toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(3);
  expect(document.querySelectorAll('[data-flippable="true"]')).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "ឯកសារមុន" }));
  expect(screen.getByText("11 / 11")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "ឯកសារបន្ទាប់" }));
  expect(screen.getByText("1 / 11")).toBeInTheDocument();
  for (const link of screen.getAllByRole("link")) expect(link).toHaveAttribute("href", "/hrd/documents");
});

test("only scene wheel input rotates the ring and five cards face forward", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  expect(document.querySelectorAll('[data-facing="true"]')).toHaveLength(5);
  fireEvent.scroll(window);
  fireEvent.wheel(document.body, { deltaY: 300 });
  expect(screen.getByText("1 / 11")).toBeInTheDocument();
  const scene = document.querySelector('[class*="RazethHrd-homeGalleryScene"]')!;
  const wheel = new WheelEvent("wheel", { deltaY: 300, bubbles: true, cancelable: true });
  fireEvent(scene, wheel);
  expect(wheel.defaultPrevented).toBe(true);
  expect(screen.getByText("2 / 11")).toBeInTheDocument();
  expect(document.querySelectorAll('[data-facing="true"]')).toHaveLength(5);
});

test("horizontal touch drags rotate and snap, while vertical drags do not", () => {
  const previous = window.PointerEvent;
  window.PointerEvent = MouseEvent as typeof PointerEvent;
  try {
    render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
    const scene = document.querySelector('[class*="RazethHrd-homeGalleryScene"]')!;
    Object.defineProperty(scene, "setPointerCapture", { value: jest.fn() });
    fireEvent.pointerDown(scene, { button: 0, clientX: 200, clientY: 100 });
    fireEvent.pointerMove(scene, { clientX: 195, clientY: 200 });
    fireEvent.pointerUp(scene);
    expect(screen.getByText("1 / 11")).toBeInTheDocument();
    fireEvent.pointerDown(scene, { button: 0, clientX: 200, clientY: 100 });
    fireEvent.pointerMove(scene, { clientX: 60, clientY: 105 });
    fireEvent.pointerUp(scene);
    expect(screen.getByText("2 / 11")).toBeInTheDocument();
  } finally { window.PointerEvent = previous; }
});

test("gallery presentation can be overridden through typed HRD theme slots", () => {
  render(<ThemeProvider theme={createTheme({ components: { RazethHrd: {
    styleOverrides: { homeGalleryScene: { height: "410px" } },
  } } })}><HrdCardCarousel /></ThemeProvider>);
  expect(document.querySelector('[class*="RazethHrd-homeGalleryScene"]')).toHaveStyle({ height: "410px" });
});

test("touch taps toggle a front card without rotating the gallery", () => {
  const previous = window.PointerEvent;
  window.PointerEvent = MouseEvent as typeof PointerEvent;
  try {
    render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
    const card = document.querySelector('article[data-index="0"]')!;
    const tap = () => {
      fireEvent.pointerDown(card, { button: 0, clientX: 200, clientY: 100 });
      fireEvent.pointerUp(card, { clientX: 200, clientY: 100 });
    };
    tap();
    expect(card).toHaveAttribute("data-flipped", "true");
    expect(screen.getByText("1 / 11")).toBeInTheDocument();
    tap();
    expect(card).toHaveAttribute("data-flipped", "false");
  } finally { window.PointerEvent = previous; }
});
