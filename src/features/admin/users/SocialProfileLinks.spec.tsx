import { render, screen } from "@testing-library/react";
import { SocialProfileLinks } from "./SocialProfileLinks";
import type { SocialProfile } from "../social/api";
const profiles: SocialProfile[] = [{ id: 123456, providerId: 654321, handle: "personal-handle", url: "https://t.me/personal", provider: { id: 654321, key: "telegram", name: "Telegram", websiteUrl: null, icon: null, isEnabled: true } }];
it("makes the social icon itself an accessible profile link with no visible labels or IDs", () => {
  const { container } = render(<SocialProfileLinks profiles={profiles} />);
  const link = screen.getByRole("link", { name: "Telegram profile: personal-handle" });
  expect(link).toHaveAttribute("href", "https://t.me/personal");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(link.querySelector("svg")).toBeInTheDocument();
  expect(container.textContent).toBe("");
  expect(screen.queryByText("Open profile")).not.toBeInTheDocument();
});
it("does not turn an unsafe or missing profile URL into a link", () => {
  render(<SocialProfileLinks profiles={[{ ...profiles[0], url: "javascript:alert(1)" }]} />);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /no valid URL/ })).toBeDisabled();
});
