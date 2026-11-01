import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useGetIdentity } from "@refinedev/core";
import { UserDashboard } from "./UserDashboard";

const mockReplace = jest.fn();
const mockRefetch = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@refinedev/core", () => ({ useGetIdentity: jest.fn() }));
const user = { name: "Jane Doe", email: "jane@example.com", role: "user", avatar: "/jane.png", isLinked: true, isVerified: true, isEnabled: true };
function mount(overrides: Record<string, unknown> = {}) {
  jest.mocked(useGetIdentity).mockReturnValue({ data: user, isLoading: false, refetch: mockRefetch, ...overrides } as unknown as ReturnType<typeof useGetIdentity>);
  return render(<ThemeProvider theme={createTheme({ cssVariables: true })}><UserDashboard /></ThemeProvider>);
}
beforeEach(() => jest.clearAllMocks());

it("shows the signed-in user's account, avatar and real status", () => {
  mount();
  expect(screen.getByRole("heading", { name: "Welcome back, Jane Doe" })).toBeInTheDocument();
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Jane Doe" })).toHaveAttribute("src", "/jane.png");
  for (const status of ["Active", "Verified", "Linked"]) expect(screen.getByText(status)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Documents/ })).toHaveAttribute("href", "/hrd/documents");
  expect(screen.queryByRole("link", { name: /Manage users/i })).not.toBeInTheDocument();
});

it.each(["sys-admin", "SYS_ADMIN", "super-admin", "user,superadmin"])("sends %s to the existing admin dashboard", role => {
  mount({ data: { ...user, role } });
  expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
  expect(screen.queryByText("Quick access")).not.toBeInTheDocument();
});

it("keeps ordinary admin roles on the personal dashboard", () => {
  mount({ data: { ...user, role: "admin" } });
  expect(mockReplace).not.toHaveBeenCalled();
  expect(screen.getByText("Quick access")).toBeInTheDocument();
});

it("does not show personal content or redirect while identity is loading", () => {
  mount({ isLoading: true, data: undefined });
  expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  expect(screen.queryByText("Quick access")).not.toBeInTheDocument();
  expect(mockReplace).not.toHaveBeenCalled();
});

it("offers retry when identity fails without exposing stale account content", () => {
  mount({ error: new Error("Unavailable") });
  expect(screen.getByRole("alert")).toHaveTextContent("could not be loaded");
  expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  expect(screen.queryByText("jane@example.com")).not.toBeInTheDocument();
});

it("does not invent verification or profile data when metadata is missing", () => {
  mount({ data: { name: "Jane", role: "user" } });
  expect(screen.getAllByText("Not available")).toHaveLength(2);
  expect(screen.getByText("Signed in")).toBeInTheDocument();
  expect(screen.queryByText("Verified")).not.toBeInTheDocument();
});

it("supports dashboard theme slot overrides", () => {
  jest.mocked(useGetIdentity).mockReturnValue({ data: user, isLoading: false } as ReturnType<typeof useGetIdentity>);
  const theme = createTheme({ cssVariables: true, components: { RazethDashboard: { styleOverrides: { quickLinks: { outline: "3px solid rgb(10, 20, 30)" } } } } });
  render(<ThemeProvider theme={theme}><UserDashboard /></ThemeProvider>);
  expect(screen.getByRole("link", { name: /Documents/ }).parentElement).toHaveStyle({ outline: "3px solid rgb(10, 20, 30)" });
});
