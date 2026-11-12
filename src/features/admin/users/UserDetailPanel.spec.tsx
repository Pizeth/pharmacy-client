import { render, screen, within } from "@testing-library/react";
import { UserDetailContent } from "./UserDetailPanel";
import { userDetailSchema, type AdminUserDetail } from "./api";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
const data: AdminUserDetail = { id: "1", name: "Jane", email: "jane@example.com", role: "sys-admin", emailVerified: true, userRole: { id: 1, name: "SYS_ADMIN", icon: "shield" }, accounts: [{ id: "1", providerId: "google" }, { id: "2", providerId: "credential" }], profile: { firstName: "Jane", lastName: "Doe", bio: "Administrator profile." } };
it.each(["table", "card"] as const)("separates role, accounts and profile in %s details", view => {
  const { container } = render(<UserDetailContent data={data} view={view} />);
  expect(container.querySelector('[data-view]')).toHaveAttribute("data-view", view);
  expect(screen.getByRole("region", { name: "User role" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "User accounts" })).toBeInTheDocument();
  expect(within(screen.getByRole("region", { name: "User profile" })).getByText("Jane Doe")).toBeInTheDocument();
  const status = screen.getByText("Active");
  expect(getComputedStyle(status.closest("dd")!.parentElement!).textAlign).toBe("left");
  const verification = screen.getByRole("img", { name: "Email verified" });
  expect(verification).toHaveTextContent(""); expect(screen.queryByText(/^Verified$/)).not.toBeInTheDocument();
  expect(getComputedStyle(verification.closest("dd")!.parentElement!).textAlign).toBe("left");
  const providers = screen.getByRole("list", { name: "Linked sign-in providers" });
  expect(getComputedStyle(providers).paddingTop).toBe("16px"); expect(within(providers).getByText("Google")).toBeInTheDocument();
});
it("preserves banned status when email is unverified", () => {
  render(<UserDetailContent data={{ ...data, banned: true, isLinked: false, emailVerified: false, profile: null, accounts: [] }} view="card" />);
  expect(screen.getByText("Banned")).toBeInTheDocument();
  expect(screen.queryByText("Active")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Email not verified" })).toBeInTheDocument();
  expect(screen.getByText("No linked accounts.")).toBeInTheDocument();
  expect(screen.getByText("No profile linked to this user.")).toBeInTheDocument();
});

it("accepts an unknown ID status from the API", () => {
  const record = userDetailSchema.parse({ ...data, isLinked: null });
  render(<UserDetailContent data={record} view="table" />);
  expect(screen.getByText("Active")).toBeInTheDocument();
});

it("keeps the verification badge circular and card labels inline", () => {
  render(<UserDetailContent data={data} view="card" />);
  const badge = screen.getByRole("img", { name: "Email verified" });
  const style = getComputedStyle(badge);
  expect(style.width).toBe("20px"); expect(style.height).toBe("20px"); expect(style.padding).toBe("0px"); expect(style.borderRadius).toBe("50%");
  const email = screen.getByText("jane@example.com");
  expect(getComputedStyle(email).display).toBe("inline");
  expect(getComputedStyle(email.previousElementSibling!).display).toBe("inline");
});

it("shows unverified email for a Telegram account without an ID status", () => {
  render(<UserDetailContent data={{ ...data, role: "user", isLinked: null, emailVerified: false, accounts: [{ id: "3", providerId: "telegram" }] }} view="table" />);
  expect(screen.getByText("Email not verified")).toBeInTheDocument();
  expect(screen.queryByText("Active")).not.toBeInTheDocument();
});
