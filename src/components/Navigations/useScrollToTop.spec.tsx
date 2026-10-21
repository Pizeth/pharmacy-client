import { act, renderHook } from "@testing-library/react";
import { useScrollToTop } from "./useScrollToTop";

describe("GIF-timed back-to-top scrolling", () => {
  let frames: Map<number, FrameRequestCallback>;
  let sequence: number;
  let position: number;
  const originalY = Object.getOwnPropertyDescriptor(window, "scrollY");
  const originalMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");

  beforeEach(() => {
    frames = new Map(); sequence = 0; position = 0;
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => position });
    jest.spyOn(performance, "now").mockReturnValue(0);
    Object.defineProperty(window, "matchMedia", { configurable: true, value: jest.fn(() => ({ matches: false })) });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { frames.set(++sequence, callback); return sequence; });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
    jest.spyOn(window, "scrollTo").mockImplementation(((options: ScrollToOptions) => { position = options.top ?? position; }) as typeof window.scrollTo);
  });
  afterEach(() => {
    jest.restoreAllMocks();
    if (originalY) Object.defineProperty(window, "scrollY", originalY);
    if (originalMedia) Object.defineProperty(window, "matchMedia", originalMedia);
    else Reflect.deleteProperty(window, "matchMedia");
  });
  const tick = (time: number) => act(() => {
    const callbacks = [...frames.values()]; frames.clear();
    for (const callback of callbacks) callback(time);
  });

  it.each([200, 8000])("finishes a %ipx scroll in the same 1600ms GIF cycle", distance => {
    position = distance;
    const { result } = renderHook(useScrollToTop);
    act(() => result.current.scrollToTop());
    tick(800);
    expect(position).toBeCloseTo(distance / 8);
    expect(result.current.isScrolling).toBe(true);
    tick(1599);
    expect(result.current.isScrolling).toBe(true);
    tick(1600);
    expect(position).toBe(0);
    expect(result.current.isScrolling).toBe(false);
    expect(frames.size).toBe(0);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  });

  it("lets manual scrolling interrupt and cancels outstanding frames on unmount", () => {
    position = 3000;
    const view = renderHook(useScrollToTop);
    act(() => view.result.current.scrollToTop());
    tick(400);
    const interruptedAt = position;
    act(() => window.dispatchEvent(new WheelEvent("wheel")));
    expect(view.result.current.isScrolling).toBe(false);
    tick(1600);
    expect(position).toBe(interruptedAt);
    act(() => view.result.current.scrollToTop());
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
  });

  it("respects reduced motion and ignores repeat clicks during playback", () => {
    position = 1000;
    const { result } = renderHook(useScrollToTop);
    act(() => { result.current.scrollToTop(); result.current.scrollToTop(); });
    expect(frames.size).toBe(1);
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" })));
    jest.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    act(() => result.current.scrollToTop());
    expect(position).toBe(0);
    expect(result.current.isScrolling).toBe(false);
    expect(frames.size).toBe(0);
  });
});
