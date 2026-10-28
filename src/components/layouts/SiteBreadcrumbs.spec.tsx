import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SiteBreadcrumbs } from "./SiteBreadcrumbs";
import { useBreadcrumbLabel } from "./breadcrumbLabels";
import { getSiteBreadcrumbs } from "./breadcrumbRoutes";
jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

it.each([
  ["/admin/dashboard", "Dashboard"],
  ["/admin/social-provider", "Social providers"],
  ["/admin/social-provider/create", "Create"],
  ["/admin/social-provider/edit/12", "Edit social provider"],
  ["/admin/social-provider/delete/12", "Delete social provider"],
  ["/admin/i18n/edit/7", "Edit translation key"],
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

function RecordLabel({ path, name }: { path: string; name?: string }) {
  useBreadcrumbLabel(path, name);
  return null;
}
it("shows the loaded user's exact name and updates it without changing the route", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/users/12");
  const { rerender } = render(<><SiteBreadcrumbs /><RecordLabel path="/admin/users/12" name="Seth Razeth" /></>);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(within(nav).getByText("Seth Razeth")).toHaveAttribute("aria-current", "page");
  expect(within(nav).queryByText("12")).not.toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: "Users" })).toHaveAttribute("href", "/admin/users");
  rerender(<><SiteBreadcrumbs /><RecordLabel path="/admin/users/12" name="Updated name" /></>);
  expect(within(nav).getByText("Updated name")).toHaveAttribute("aria-current", "page");
});
it("uses a loading fallback and removes a name when its page unmounts", () => {
  jest.mocked(usePathname).mockReturnValue("/admin/users/12");
  const { rerender } = render(<><SiteBreadcrumbs /><RecordLabel path="/admin/users/12" name="Previous user" /></>);
  rerender(<SiteBreadcrumbs />);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(within(nav).getByText("User profile")).toHaveAttribute("aria-current", "page");
  expect(within(nav).queryByText("Previous user")).not.toBeInTheDocument();
  jest.mocked(usePathname).mockReturnValue("/admin/users/13");
  rerender(<SiteBreadcrumbs />);
  expect(within(nav).getByText("User profile")).toBeInTheDocument();
});
it("replaces user edit/delete IDs while preserving other resource labels", () => {
  expect(getSiteBreadcrumbs("/admin/users/edit/12").at(-1)?.label).toBe("Edit user");
  expect(getSiteBreadcrumbs("/admin/users/delete/12").at(-1)?.label).toBe("Delete user");
  jest.mocked(usePathname).mockReturnValue("/admin/users/edit/12");
  render(<><SiteBreadcrumbs /><RecordLabel path="/admin/users/edit/12" name="Edit Seth Razeth" /></>);
  expect(within(screen.getByRole("navigation", { name: "Breadcrumb" })).getByText("Edit Seth Razeth")).toHaveAttribute("aria-current", "page");
});

it.each([["/admin/roles/987", "Role details"], ["/admin/social-provider/987", "Social provider details"], ["/admin/i18n/987", "Translation key details"], ["/admin/documents/secret-uuid", "Document tracking"]])("does not expose internal identifiers in %s breadcrumb labels", (path, fallback) => {
  expect(getSiteBreadcrumbs(path).at(-1)?.label).toBe(fallback);
});
