import { render, screen } from "@testing-library/react";
import { ResourceBadge, ResourceStatusBadge } from "./ResourceBadge";
import { RoleBadge } from "@/features/admin/users/UserIdentity";
it("uses the same pill geometry for roles, statuses and other resource badges", () => {
  render(<><RoleBadge role={{ id: 1, name: "EDITOR", color: "#112233" }} /><ResourceStatusBadge active /><ResourceBadge label="English" /></>);
  const badges = [screen.getByText("EDITOR"), screen.getByText("Active").closest(".MuiChip-root")!, screen.getByText("English").closest(".MuiChip-root")!];
  for (const badge of badges) {
    const style = getComputedStyle(badge);
    expect(style.borderRadius).toBe("999px");
    expect(style.padding).toBe("1px 6px");
    expect(style.boxShadow).toBe("none");
    expect(style.fontSize).toBe("0.6875rem");
  }
});
it("uses a consistent icon and label for inactive accounts", () => {
  render(<ResourceStatusBadge active={false} inactiveLabel="Banned" inactiveColor="error" />);
  expect(screen.getByText("Banned").closest(".MuiChip-root")?.querySelector("svg")).toBeInTheDocument();
});
