import { render, screen, within } from "@testing-library/react";
import { SocialProviderDetail } from "./SocialProviderDetail";
const record = { id: 1, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: true };
it.each(["table", "card"] as const)("uses sectioned provider facts and an intrinsic status badge in %s view", view => {
  const { container } = render(<SocialProviderDetail record={record} view={view} />);
  const identity = screen.getByRole("region", { name: "Provider identity" });
  const status = within(identity).getByText("Enabled").closest(".MuiChip-root");
  expect(status).not.toBeNull();
  expect(getComputedStyle(status!).width).toBe("fit-content");
  expect(container.querySelector(`[data-view="${view}"]`)).toBeInTheDocument();
  expect(within(screen.getByRole("region", { name: "Configuration" })).getByRole("link")).toHaveAttribute("href", "https://t.me/");
});
