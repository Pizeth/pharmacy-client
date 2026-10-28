import { useScrollTrigger } from "@mui/material";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import BackToTop from "./BackToTop";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useScrollTrigger: jest.fn(() => true),
}));

it("fills the ring only at the bottom and recalculates after page height changes", () => {
  const root = document.documentElement;
  const descriptors = [
    [window, "scrollY"], [root, "scrollHeight"], [root, "clientHeight"],
  ] as const;
  const originals = descriptors.map(([target, key]) => Object.getOwnPropertyDescriptor(target, key));
  let y = 500;
  let height = 2000;
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => y });
  Object.defineProperty(root, "scrollHeight", { configurable: true, get: () => height });
  Object.defineProperty(root, "clientHeight", { configurable: true, value: 1000 });
  let pending: FrameRequestCallback | undefined;
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { pending = callback; return 1; });
  const cancel = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  jest.mocked(usePathname).mockReturnValue("/hrd");
  const view = render(<BackToTop />);
  const progress = () => screen.getByRole("button").style.getPropertyValue("--BackToTop-progress");
  const update = (event: string) => act(() => { fireEvent(window, new Event(event)); pending?.(0); });
  try {
    expect(progress()).toBe("0.5");
    y = 999;
    update("scroll");
    expect(progress()).toBe("0.999");
    y = 1000;
    update("scroll");
    expect(progress()).toBe("1");
    height = 3000;
    update("resize");
    expect(progress()).toBe("0.5");
    y = -10;
    update("scroll");
    expect(progress()).toBe("0");
    fireEvent.scroll(window);
    view.unmount();
    expect(cancel).toHaveBeenCalledWith(1);
  } finally {
    view.unmount();
    jest.restoreAllMocks();
    descriptors.forEach(([target, key], index) => {
      const descriptor = originals[index];
      if (descriptor) Object.defineProperty(target, key, descriptor);
      else Reflect.deleteProperty(target, key);
    });
  }
});

it("releases the old route animation and resets the GIF/busy state on navigation", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let sequence = 0;
  const originalY = Object.getOwnPropertyDescriptor(window, "scrollY");
  const originalMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 3000 });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false }) });
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
    frames.set(++sequence, callback); return sequence;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
  const remove = jest.spyOn(window, "removeEventListener");
  jest.mocked(usePathname).mockReturnValue("/hrd");
  const view = render(<BackToTop />);
  try {
    fireEvent.click(screen.getByRole("button", { name: "scroll back to top" }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByAltText("Scrolling...")).toHaveAttribute("src", "/static/images/shoryuken.gif");
    expect(frames.size).toBe(1);
    jest.mocked(usePathname).mockReturnValue("/hrd/documents");
    view.rerender(<BackToTop />);
    expect(frames.size).toBe(0);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "false");
    expect(screen.queryByAltText("Scrolling...")).not.toBeInTheDocument();
    for (const type of ["wheel", "touchstart", "keydown"]) {
      expect(remove).toHaveBeenCalledWith(type, expect.any(Function));
    }
    act(() => window.dispatchEvent(new Event("touchstart")));
    fireEvent.click(screen.getByRole("button"));
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
  } finally {
    view.unmount();
    jest.restoreAllMocks();
    if (originalY) Object.defineProperty(window, "scrollY", originalY);
    if (originalMedia) Object.defineProperty(window, "matchMedia", originalMedia);
    else Reflect.deleteProperty(window, "matchMedia");
  }
});

it("shows the logo only on reaching the top, during the button exit", () => {
  let y = 400;
  const originalY = Object.getOwnPropertyDescriptor(window, "scrollY");
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => y });
  jest.mocked(useScrollTrigger).mockImplementation(options => y > (options?.threshold ?? 100));
  jest.mocked(usePathname).mockReturnValue("/admin/users/1");
  const view = render(<BackToTop />);
  try {
    expect(screen.getByTestId("ArrowUpwardIcon")).toBeInTheDocument();
    y = 60;
    view.rerender(<BackToTop />);
    expect(screen.getByTestId("ArrowUpwardIcon")).toBeInTheDocument();
    y = 0;
    view.rerender(<BackToTop />);
    expect(screen.queryByTestId("ArrowUpwardIcon")).not.toBeInTheDocument();
    expect(view.container.querySelector('img[src="/static/images/logo.svg"]')).toBeInTheDocument();
  } finally {
    view.unmount();
    jest.mocked(useScrollTrigger).mockReturnValue(true);
    if (originalY) Object.defineProperty(window, "scrollY", originalY);
    else Reflect.deleteProperty(window, "scrollY");
  }
});
