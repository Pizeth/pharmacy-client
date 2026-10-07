import { act, render, screen } from "@testing-library/react";
import { useHomeScrollReveal } from "./useHomeScrollReveal";

const originalMedia = window.matchMedia;
beforeEach(() => {
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })) as unknown as typeof window.matchMedia;
});
afterEach(() => { window.matchMedia = originalMedia; });

function Example() {
  const reveal = useHomeScrollReveal();
  return <section ref={reveal} aria-label="Reveal section" />;
}

test("reveals offscreen content once and disconnects on unmount", () => {
  let callback: IntersectionObserverCallback = () => {};
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();
  const original = window.IntersectionObserver;
  window.IntersectionObserver = jest.fn((next) => {
    callback = next;
    return { observe, unobserve, disconnect };
  }) as unknown as typeof IntersectionObserver;
  const bounds = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 2000 } as DOMRect);
  try {
    const view = render(<Example />);
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("data-reveal-state", "waiting");
    act(() => callback([{
      target: section, isIntersecting: true, intersectionRatio: 1, time: 0,
      boundingClientRect: section.getBoundingClientRect(),
      intersectionRect: section.getBoundingClientRect(), rootBounds: null,
    }], {} as IntersectionObserver));
    expect(section).toHaveAttribute("data-reveal-state", "visible");
    expect(unobserve).toHaveBeenCalledWith(section);
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  } finally {
    bounds.mockRestore();
    window.IntersectionObserver = original;
  }
});

test("keeps content visible when reduced motion is preferred", () => {
  const media = jest.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  try {
    render(<Example />);
    expect(screen.getByRole("region")).not.toHaveAttribute("data-reveal-state");
  } finally {
    media.mockRestore();
  }
});
