import NextLink from "next/link";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RecordPageActionsProvider } from "@/components/Tables/recordPageActions";
import { UserProfileHeader } from "./UserProfileHeader";
import type { AdminUserDetail } from "./api";
const user: AdminUserDetail = { id: "1", name: "Jane Doe", username: "jane", email: "jane@example.com", image: "https://example.com/jane.jpg", accounts: [], profile: { firstName: "Jane", lastName: "Doe", phone: "+855 12 345 678" } };
function mount(record = user) { return render(<ThemeProvider theme={createTheme()}><UserProfileHeader user={record} isSelf /></ThemeProvider>); }
it("presents a personal profile with an accessible portrait and actionable contact information", () => {
  mount();
  expect(screen.getByRole("heading", { name: "Jane Doe", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Jane Doe's profile photo" })).toHaveAttribute("src", user.image);
  expect(screen.getByText("@jane")).toBeInTheDocument();
  expect(screen.getByText("Your profile")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "jane@example.com" })).toHaveAttribute("href", "mailto:jane%40example.com");
  expect(screen.getByRole("link", { name: "+855 12 345 678" })).toHaveAttribute("href", "tel:+85512345678");
});
it("uses initials instead of an unsafe image URL and omits missing optional identity fields", () => {
  mount({ ...user, image: "javascript:alert(1)", username: null, profile: null });
  expect(screen.getByRole("img", { name: "Jane Doe's profile photo" })).toHaveTextContent("JD");
  expect(screen.queryByText("@jane")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "+855 12 345 678" })).not.toBeInTheDocument();
});

it("keeps record navigation within the profile cover without a duplicate page title", () => {
  render(<ThemeProvider theme={createTheme()}><RecordPageActionsProvider value={<><NextLink href="/admin/users">Back to list</NextLink><NextLink href="/admin/users/edit/1">Edit</NextLink></>}><UserProfileHeader user={user} isSelf /></RecordPageActionsProvider></ThemeProvider>);
  const profile = screen.getByRole("banner", { name: "Personal profile" });
  const actions = within(profile).getByRole("navigation", { name: "Record actions" });
  expect(within(actions).getByRole("link", { name: "Edit" })).toHaveAttribute("href", "/admin/users/edit/1");
  expect(within(actions).getByRole("link", { name: "Back to list" })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});
