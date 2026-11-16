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

test("replays the reveal after leaving and re-entering the viewport", () => {
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
    act(() => callback([{
      target: section, isIntersecting: false,
      intersectionRatio: 0, time: 0, boundingClientRect: section.getBoundingClientRect(),
      intersectionRect: section.getBoundingClientRect(), rootBounds: null,
    }], {} as IntersectionObserver));
    expect(section).toHaveAttribute("data-reveal-state", "waiting");
    act(() => callback([{
      target: section, isIntersecting: true,
      intersectionRatio: 1, time: 0, boundingClientRect: section.getBoundingClientRect(),
      intersectionRect: section.getBoundingClientRect(), rootBounds: null,
    }], {} as IntersectionObserver));
    expect(section).toHaveAttribute("data-reveal-state", "visible");
    expect(observe).toHaveBeenCalledWith(section);
    expect(unobserve).not.toHaveBeenCalled();
    const scrollPosition = jest.replaceProperty(window, "scrollY", 100);
    try {
      act(() => window.dispatchEvent(new Event("scroll")));
      scrollPosition.replaceValue(0);
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        callback([{
          target: section, isIntersecting: true, intersectionRatio: 1, time: 0,
          boundingClientRect: section.getBoundingClientRect(),
          intersectionRect: section.getBoundingClientRect(), rootBounds: null,
        }], {} as IntersectionObserver);
      });
      expect(section).toHaveAttribute("data-reveal-state", "static");
      scrollPosition.replaceValue(100);
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        callback([{
          target: section, isIntersecting: true, intersectionRatio: 1, time: 0,
          boundingClientRect: section.getBoundingClientRect(),
          intersectionRect: section.getBoundingClientRect(), rootBounds: null,
        }], {} as IntersectionObserver);
      });
      expect(section).toHaveAttribute("data-reveal-state", "visible");
    } finally {
      scrollPosition.restore();
    }
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  } finally {
    bounds.mockRestore();
    window.IntersectionObserver = original;
  }
});

test("keeps content visible when reduced motion is preferred", () => {
  const media = jest.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as MediaQueryList);
  try {
    render(<Example />);
    expect(screen.getByRole("region")).not.toHaveAttribute("data-reveal-state");
  } finally {
    media.mockRestore();
  }
});

test("observes initially visible sections and responds to motion preference changes", () => {
  let changeMotion = () => {};
  const preference = {
    matches: false,
    addEventListener: jest.fn((_event: string, listener: () => void) => { changeMotion = listener; }),
    removeEventListener: jest.fn(),
  };
  window.matchMedia = jest.fn(() => preference) as unknown as typeof window.matchMedia;
  const original = window.IntersectionObserver;
  const observe = jest.fn();
  const disconnect = jest.fn();
  window.IntersectionObserver = jest.fn(() => ({ observe, disconnect })) as unknown as typeof IntersectionObserver;
  const bounds = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 100, bottom: 200 } as DOMRect);
  try {
    const view = render(<Example />);
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("data-reveal-state", "visible");
    expect(observe).toHaveBeenCalledWith(section);
    act(() => { preference.matches = true; changeMotion(); });
    expect(section).not.toHaveAttribute("data-reveal-state");
    act(() => { preference.matches = false; changeMotion(); });
    expect(section).toHaveAttribute("data-reveal-state", "visible");
    expect(observe).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(preference.removeEventListener).toHaveBeenCalledWith("change", changeMotion);
  } finally {
    bounds.mockRestore();
    window.IntersectionObserver = original;
  }
});
