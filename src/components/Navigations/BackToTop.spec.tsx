import { act, fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import BackToTop from "./BackToTop";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useScrollTrigger: () => true,
}));

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
