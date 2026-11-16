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

test("touch swipe beginning on a card rotates, but taps flip and vertical swipes retain the page", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const touch = (x: number, y: number) => [{ identifier: 1, clientX: x, clientY: y, target: card }];
  fireEvent.touchStart(card, { touches: touch(200, 100) });
  fireEvent.touchMove(card, { touches: touch(198, 180) });
  fireEvent.touchEnd(card, { touches: [], changedTouches: touch(198, 180) });
  expect(screen.getByText("1 / 11")).toBeInTheDocument();

  fireEvent.touchStart(card, { touches: touch(200, 100) });
  fireEvent.touchMove(card, { touches: touch(60, 105) });
  fireEvent.touchEnd(card, { touches: [], changedTouches: touch(60, 105) });
  expect(screen.getByText("2 / 11")).toBeInTheDocument();

  // A short touch remains a flip gesture, not a carousel rotation.
  const nextCard = document.querySelector<HTMLElement>('article[data-index="1"]')!;
  const nextTouch = [{ identifier: 2, clientX: 180, clientY: 100, target: nextCard }];
  fireEvent.touchStart(nextCard, { touches: nextTouch });
  fireEvent.touchEnd(nextCard, { touches: [], changedTouches: nextTouch });
  expect(nextCard).toHaveAttribute("data-flipped", "true");
});

test("a second finger interrupts and snaps a partly rotated card drag", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const assembly = document.querySelector<HTMLElement>('[class*="RazethHrd-homeGalleryAssembly"]')!;
  const point = (identifier: number, x: number, y: number) => ({
    identifier, clientX: x, clientY: y, target: card,
  });
  const first = point(1, 200, 100);
  const dragged = point(1, 120, 102);
  const second = point(2, 180, 108);

  fireEvent.touchStart(card, { touches: [first] });
  fireEvent.touchMove(card, { touches: [dragged] });
  expect(assembly.style.getPropertyValue("--Hrd-gallery-angle")).toBe("-20deg");

  fireEvent.touchStart(card, { touches: [dragged, second] });
  expect(assembly.style.getPropertyValue("--Hrd-gallery-angle")).toBe(
    `-${360 / 11}deg`,
  );
  fireEvent.touchEnd(card, { touches: [dragged], changedTouches: [second] });
  fireEvent.touchEnd(card, { touches: [], changedTouches: [dragged] });
  expect(screen.getByText("2 / 11")).toBeInTheDocument();
  expect(card).toHaveAttribute("data-flipped", "false");
});

test("touch cancellation settles a partially rotated gallery", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const assembly = document.querySelector<HTMLElement>('[class*="RazethHrd-homeGalleryAssembly"]')!;
  const point = (x: number, y: number) => [{ identifier: 1, clientX: x, clientY: y, target: card }];
  fireEvent.touchStart(card, { touches: point(200, 100) });
  fireEvent.touchMove(card, { touches: point(120, 100) });
  fireEvent.touchCancel(card, { touches: [] });
  expect(assembly.style.getPropertyValue("--Hrd-gallery-angle")).toBe(
    `-${360 / 11}deg`,
  );
});

test("touch taps on card content tolerate finger drift and still toggle the entire card", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const content = card.querySelector<HTMLElement>(".MuiTypography-root")!;
  const point = (x: number, y: number) => [{ identifier: 1, clientX: x, clientY: y, target: content }];

  fireEvent.touchStart(content, { touches: point(200, 100) });
  fireEvent.touchMove(content, { touches: point(207, 111) });
  fireEvent.touchEnd(content, { touches: [], changedTouches: point(207, 111) });
  expect(card).toHaveAttribute("data-flipped", "true");
  expect(screen.getByText("1 / 11")).toBeInTheDocument();

  fireEvent.touchStart(content, { touches: point(200, 100) });
  fireEvent.touchEnd(content, { touches: [], changedTouches: point(200, 100) });
  expect(card).toHaveAttribute("data-flipped", "false");
});

test("decorative side cards never intercept taps intended for interactive cards", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const center = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const side = document.querySelector<HTMLElement>('article[data-index="2"]')!;
  expect(center).toHaveAttribute("data-flippable", "true");
  expect(side).toHaveAttribute("data-flippable", "false");
  const styles = getComputedStyle(side);
  expect(styles.pointerEvents).toBe("none");
});

test.each([17, 18])("horizontal finger drift of %ipx remains a tap even with touchmove", (drift) => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const point = (x: number) => [{ identifier: 1, clientX: x, clientY: 100, target: card }];
  fireEvent.touchStart(card, { touches: point(200) });
  fireEvent.touchMove(card, { touches: point(200 - drift) });
  fireEvent.touchEnd(card, { touches: [], changedTouches: point(200 - drift) });
  expect(card).toHaveAttribute("data-flipped", "true");
  expect(screen.getByText("1 / 11")).toBeInTheDocument();
});

test("horizontal movement beyond tap tolerance remains a gallery swipe", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  const card = document.querySelector<HTMLElement>('article[data-index="0"]')!;
  const assembly = document.querySelector<HTMLElement>('[class*="RazethHrd-homeGalleryAssembly"]')!;
  const point = (x: number) => [{ identifier: 1, clientX: x, clientY: 100, target: card }];
  fireEvent.touchStart(card, { touches: point(200) });
  fireEvent.touchMove(card, { touches: point(180) });
  expect(assembly.style.getPropertyValue("--Hrd-gallery-angle")).toBe("-5deg");
  fireEvent.touchEnd(card, { touches: [], changedTouches: point(180) });
  expect(card).toHaveAttribute("data-flipped", "false");
  expect(assembly.style.getPropertyValue("--Hrd-gallery-angle")).toBe("0deg");
});
