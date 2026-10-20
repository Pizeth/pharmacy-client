import { act, render } from "@testing-library/react";
import { useHeaderScrollState } from "./useHeaderScrollState";

let mockPathname = "/hrd";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

describe("responsive header measurement and restoration", () => {
  let frames: Map<number, FrameRequestCallback>;
  let sequence: number;
  let resizeObserver: ResizeObserverCallback;
  let disconnect: jest.Mock;
  let observe: jest.Mock;
  let height: number;
  let scrollY: number;
  let footerTop: number;
  const originalObserver = global.ResizeObserver;
  const originalScroll = Object.getOwnPropertyDescriptor(window, "scrollY");

  beforeEach(() => {
    mockPathname = "/hrd";
    frames = new Map(); sequence = 0; height = 212; scrollY = 0; footerTop = 2000;
    disconnect = jest.fn(); observe = jest.fn();
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
      frames.set(++sequence, callback); return sequence;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
    global.ResizeObserver = jest.fn(callback => {
      resizeObserver = callback;
      return { observe, unobserve: jest.fn(), disconnect };
    }) as unknown as typeof ResizeObserver;
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return new DOMRect(0, this.tagName === "NAV" ? 0 : footerTop, 100,
        this.tagName === "NAV"
          ? this.hasAttribute("data-desktop-compact") || this.hasAttribute("data-mobile-scrolled") ? 64 : height
          : 500);
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    global.ResizeObserver = originalObserver;
    if (originalScroll) Object.defineProperty(window, "scrollY", originalScroll);
  });
  const flush = () => act(() => {
    const pending = [...frames.values()]; frames.clear();
    for (const callback of pending) callback(0);
  });
  const event = (name: string) => act(() => { window.dispatchEvent(new Event(name)); });
  function Fixture({ mobile = false }: { mobile?: boolean }) {
    const { scrolled, footerVisible, headerRef, headerHeight } = useHeaderScrollState();
    return <>
      <nav ref={headerRef} data-testid="header" data-expanded-height={headerHeight}
        data-desktop-compact={!mobile && scrolled ? "true" : undefined}
        data-mobile-scrolled={mobile && scrolled ? "true" : undefined} />
      <output data-testid="state">{JSON.stringify({ scrolled, footerVisible })}</output>
      <footer data-site-footer />
    </>;
  }

  it("remeasures a compact header across md in both directions without a scroll event", () => {
    scrollY = 150;
    const view = render(<Fixture mobile />);
    height = 112; event("resize"); flush();
    expect(view.getByTestId("header")).toHaveAttribute("data-mobile-scrolled", "true");
    expect(view.getByTestId("header")).toHaveAttribute("data-expanded-height", "112");
    height = 212;
    view.rerender(<Fixture />); event("resize"); flush();
    expect(view.getByTestId("header")).not.toHaveAttribute("data-desktop-compact");
    expect(view.getByTestId("header")).toHaveAttribute("data-expanded-height", "212");
    height = 112;
    view.rerender(<Fixture mobile />); event("resize"); flush();
    expect(view.getByTestId("header")).toHaveAttribute("data-mobile-scrolled", "true");
    expect(view.getByTestId("header")).not.toHaveAttribute("data-header-measuring");
  });

  it("updates width-dependent expanded geometry while retaining compact hysteresis", () => {
    const view = render(<Fixture />);
    scrollY = 240; event("scroll"); flush();
    expect(view.getByTestId("header")).toHaveAttribute("data-desktop-compact");
    height = 300; event("resize"); flush();
    expect(view.getByTestId("header")).not.toHaveAttribute("data-desktop-compact");
    scrollY = 301; event("scroll"); flush();
    for (let i = 0; i < 3; i++) {
      act(() => resizeObserver([], {} as ResizeObserver)); flush();
      expect(view.getByTestId("header")).toHaveAttribute("data-desktop-compact");
    }
    scrollY = 290; event("scroll"); flush();
    expect(view.getByTestId("header")).toHaveAttribute("data-desktop-compact");
    scrollY = 283; event("scroll"); flush();
    expect(view.getByTestId("header")).not.toHaveAttribute("data-desktop-compact");
  });

  it("reads restored scroll and replacement footer after pathname/pageshow/popstate", () => {
    scrollY = 600; footerTop = 200;
    const view = render(<Fixture />);
    expect(view.getByTestId("state")).toHaveTextContent('"footerVisible":true');
    mockPathname = "/hrd/contact"; scrollY = 0; footerTop = 2000;
    view.rerender(<Fixture />);
    expect(view.getByTestId("state")).toHaveTextContent('"scrolled":false,"footerVisible":false');
    scrollY = 600; footerTop = 100;
    event("popstate"); event("pageshow"); flush();
    expect(view.getByTestId("state")).toHaveTextContent('"scrolled":true,"footerVisible":true');
    scrollY = 0; footerTop = -600;
    event("pageshow"); flush();
    expect(view.getByTestId("state")).toHaveTextContent('"scrolled":false,"footerVisible":false');
  });

  it("coalesces notifications and cancels the pending frame, observer and listeners", () => {
    const remove = jest.spyOn(window, "removeEventListener");
    const view = render(<Fixture />);
    expect(observe).toHaveBeenCalledWith(document.body);
    expect(observe).toHaveBeenCalledWith(view.getByTestId("header"));
    event("scroll"); event("scroll"); event("pageshow");
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalledTimes(1);
    for (const name of ["scroll", "resize", "pageshow", "popstate"]) {
      expect(remove).toHaveBeenCalledWith(name, expect.any(Function));
    }
    event("scroll"); event("resize");
    expect(frames.size).toBe(0);
  });
});
