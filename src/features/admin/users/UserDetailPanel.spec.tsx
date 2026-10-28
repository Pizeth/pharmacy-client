import { render, screen, within } from "@testing-library/react";
import { UserDetailContent } from "./UserDetailPanel";
import type { AdminUserDetail } from "./api";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
const data: AdminUserDetail = { id: "1", name: "Jane", email: "jane@example.com", role: "sys-admin", emailVerified: true, userRole: { id: 1, name: "SYS_ADMIN", icon: "shield" }, accounts: [{ id: "1", providerId: "google" }, { id: "2", providerId: "credential" }], profile: { firstName: "Jane", lastName: "Doe", bio: "Administrator profile." } };
it.each(["table", "card"] as const)("separates role, accounts and profile in %s details", view => {
  const { container } = render(<UserDetailContent data={data} view={view} />);
  expect(container.querySelector('[data-view]')).toHaveAttribute("data-view", view);
  expect(screen.getByRole("region", { name: "User role" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "User accounts" })).toBeInTheDocument();
  expect(within(screen.getByRole("region", { name: "User profile" })).getByText("Jane Doe")).toBeInTheDocument();
  const active = screen.getByText("Active");
  expect(getComputedStyle(active.closest("dd")!).justifyContent).toBe(view === "card" ? "flex-start" : "center");
  const verification = screen.getByRole("img", { name: "Email verified" });
  expect(verification).toHaveTextContent(""); expect(screen.queryByText(/^Verified$/)).not.toBeInTheDocument();
  expect(getComputedStyle(verification.parentElement!).justifyContent).toBe(view === "card" ? "flex-start" : "center");
  const providers = screen.getByRole("list", { name: "Linked sign-in providers" });
  expect(getComputedStyle(providers).paddingTop).toBe("16px"); expect(within(providers).getByText("Google")).toBeInTheDocument();
});
it("provides an accessible unverified icon and empty profile message", () => {
  render(<UserDetailContent data={{ ...data, emailVerified: false, profile: null, accounts: [] }} view="card" />);
  expect(screen.getByRole("img", { name: "Email not verified" })).toBeInTheDocument();
  expect(screen.getByText("No linked accounts.")).toBeInTheDocument();
  expect(screen.getByText("No profile linked to this user.")).toBeInTheDocument();
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
