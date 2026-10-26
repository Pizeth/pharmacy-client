import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SiteBreadcrumbs } from "./SiteBreadcrumbs";
import { getSiteBreadcrumbs } from "./breadcrumbRoutes";
jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

it.each([
  ["/admin/dashboard", "Dashboard"],
  ["/admin/social-provider", "Social providers"],
  ["/admin/social-provider/create", "Create"],
  ["/admin/social-provider/edit/12", "Edit #12"],
  ["/admin/social-provider/delete/12", "Delete #12"],
  ["/admin/i18n/edit/7", "Edit #7"],
  ["/", "Home"],
])("marks one current page for %s", (pathname, current) => {
  jest.mocked(usePathname).mockReturnValue(pathname);
  const { container } = render(<SiteBreadcrumbs />);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(within(nav).getByText(current)).toHaveAttribute("aria-current", "page");
  expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  expect(within(nav).queryByRole("link", { name: current })).not.toBeInTheDocument();
});
it("links to the resource and dashboard without inventing intermediate edit pages", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/social-provider/edit/12");
  render(<SiteBreadcrumbs />);
  expect(screen.getByRole("link", { name: "Administration" })).toHaveAttribute("href", "/admin/dashboard");
  expect(screen.getByRole("link", { name: "Social providers" })).toHaveAttribute("href", "/admin/social-provider");
  expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
});
it("handles escaped and malformed route labels safely", () => {
  expect(getSiteBreadcrumbs("/example/hello%20world").at(-1)?.label).toBe("Hello World");
  expect(() => getSiteBreadcrumbs("/example/%broken")).not.toThrow();
});

it("supports the shared breadcrumb theme slots", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/social-provider");
  const theme = createTheme({ components: { RazethSiteBreadcrumbs: { styleOverrides: { root: { borderBottom: "3px solid rgb(1, 2, 3)" } } } } });
  render(<ThemeProvider theme={theme}><SiteBreadcrumbs /></ThemeProvider>);
  const root = screen.getByRole("navigation", { name: "Breadcrumb" }).parentElement!;
  expect(getComputedStyle(root).borderBottomColor).toBe("rgb(1, 2, 3)");
});

it("uses HRD's selected breadcrumb treatment and compact spacing", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/social-provider");
  render(<SiteBreadcrumbs />);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  const current = within(nav).getByText("Social providers");
  expect(getComputedStyle(current).boxShadow).toContain("inset 0 -2px");
  expect(getComputedStyle(current).padding).toBe("4px 8px");
  expect(getComputedStyle(nav.parentElement!).marginTop).toBe("12px");
  expect(getComputedStyle(nav.parentElement!).paddingBottom).not.toBe("12px");
});

it("uses an admin-panel icon for Administration and a dashboard icon for Dashboard", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/dashboard");
  render(<SiteBreadcrumbs />);
  expect(screen.getByTestId("AdminPanelSettingsIcon")).toBeInTheDocument();
  expect(screen.getByTestId("DashboardIcon")).toBeInTheDocument();
});

it("does not show breadcrumbs on sign-in", () => {
 jest.mocked(usePathname).mockReturnValue("/login"); render(<SiteBreadcrumbs />);
 expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
});
