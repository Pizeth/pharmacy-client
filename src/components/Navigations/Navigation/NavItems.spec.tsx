import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { NavItems } from "./NavItems";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
const pathname = jest.mocked(usePathname);
const theme = createTheme({ cssVariables: true });
Object.assign(theme, {
  custom: { sideImage: { captionOutlineColor: "black", captionGlowColor: "white" } },
});

beforeEach(() => pathname.mockReturnValue("/hrd"));

it.each(["vertical"] as const)(
  "renders the HRD menu and keyboard dropdown in the %s layout", async (variant) => {
    render(<ThemeProvider theme={theme}><NavItems variant={variant} /></ThemeProvider>);
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "ទំព័រដើម" })).toHaveAttribute("href", "/hrd");
    expect(screen.getByRole("link", { name: "បណ្ដុំឯកសារ" })).toHaveAttribute("href", "/hrd/documents");
    const trigger = screen.getByRole("button", { name: "អំពីអង្គភាព" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const menu = screen.getByRole("menu", { name: "អំពីអង្គភាព" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const children = within(menu).getAllByRole("menuitem");
    expect(children.map((child) => child.textContent)).toEqual([
      "អំពីប្រធាននាយកដ្ឋាន", "ព័ត៌មានសង្ខេបនាយកដ្ឋាន", "រចនាសម្ព័ន្ធ", "ថ្នាក់ដឹកនាំ និងមន្រ្តី",
    ]);
    expect(children[0]).toHaveAttribute("href", "/hrd/about/director");
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
);

it("closes the dropdown after navigation to another route", () => {
  const { rerender } = render(<ThemeProvider theme={theme}><NavItems /></ThemeProvider>);
  fireEvent.click(screen.getByRole("button", { name: "អំពីអង្គភាព" }));
  pathname.mockReturnValue("/hrd/news");
  rerender(<ThemeProvider theme={theme}><NavItems /></ThemeProvider>);
  expect(screen.getByRole("button", { name: "អំពីអង្គភាព" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("link", { name: "ព័ត៌មាន" })).toHaveAttribute("aria-current", "page");
});

it("opens on desktop hover and stays open while crossing into the dropdown", () => {
  jest.useFakeTimers();
  render(<ThemeProvider theme={theme}><NavItems /></ThemeProvider>);
  const trigger = screen.getByRole("button", { name: "អំពីអង្គភាព" });
  fireEvent.mouseEnter(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menu = screen.getByRole("menu");
  fireEvent.mouseLeave(trigger);
  fireEvent.mouseEnter(menu.parentElement!);
  act(() => jest.advanceTimersByTime(200));
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  fireEvent.mouseLeave(menu.parentElement!);
  act(() => jest.advanceTimersByTime(200));
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  jest.useRealTimers();
});

it("expands drawer children inline and notifies selection only for navigation links", async () => {
  const onNavigate = jest.fn();
  render(<ThemeProvider theme={theme}><NavItems variant="horizontal" onNavigate={onNavigate} /></ThemeProvider>);
  const trigger = screen.getByRole("button", { name: "អំពីអង្គភាព" });
  fireEvent.mouseEnter(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(onNavigate).not.toHaveBeenCalled();
  const child = screen.getByRole("link", { name: "អំពីប្រធាននាយកដ្ឋាន" });
  expect(child).toHaveAttribute("href", "/hrd/about/director");
  fireEvent.click(child);
  expect(onNavigate).toHaveBeenCalledTimes(1);
  fireEvent.click(trigger);
  await waitFor(() => expect(screen.queryByRole("link", { name: "អំពីប្រធាននាយកដ្ឋាន" })).toBeNull());
  fireEvent.click(screen.getByRole("link", { name: "ទំព័រដើម" }));
  expect(onNavigate).toHaveBeenCalledTimes(2);
});
