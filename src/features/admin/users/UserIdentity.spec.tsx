import { render, screen } from "@testing-library/react";
import { RoleBadge, UserIdentity } from "./UserIdentity";
import { userDetailSchema } from "./api";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
it("renders optional role metadata and tolerates an unknown icon", () => {
  const { container, rerender } = render(<RoleBadge role={{ id: 1, name: "Administrator", icon: "shield-check", color: "#3578ab" }} />);
  expect(screen.getByText("Administrator")).toBeInTheDocument(); expect(container.querySelector("svg")).toBeInTheDocument();
  rerender(<RoleBadge role={{ id: 1, name: "Administrator", icon: "unknown", color: "not-a-color" }} />);
  expect(screen.getByText("Administrator")).toBeInTheDocument(); expect(container.querySelector("svg")).not.toBeInTheDocument();
});
it("shows the provided avatar and uses initials when absent", () => {
  const { rerender } = render(<UserIdentity user={{ id: "1", name: "Jane", email: "jane@example.com", image: "https://example.com/jane.png" }} />);
  expect(screen.getByRole("img", { name: "Jane" })).toHaveAttribute("src", "https://example.com/jane.png");
  rerender(<UserIdentity user={{ id: "1", name: "Jane", email: "jane@example.com" }} />); expect(screen.getByText("J")).toBeInTheDocument();
});
it("keeps credentials out of the user-detail view contract", () => {
  const detail = userDetailSchema.parse({ id: 1, name: "Jane", email: "jane@example.com", accounts: [{ id: 2, providerId: "google", accessToken: "private", password: "hash" }] });
  expect(detail.accounts[0]).toEqual({ id: "2", providerId: "google" });
});

it.each(["sys-admin", "SYS_ADMIN", "Sys Admin"])("uses primary for %s even with a custom role color", name => {
  render(<RoleBadge role={{ id: 1, name, color: "#3578ab" }} />);
  const badge = screen.getByText(name);
  expect(badge).toHaveAttribute("data-tone", "primary");
  expect(getComputedStyle(badge).borderRadius).toBe("999px");
  expect(getComputedStyle(badge).padding).toBe("1px 6px");
});
