import { render, screen } from "@testing-library/react";
import { DashboardAnalytics } from "./DashboardAnalytics";
it("clearly labels sample statistics and provides accessible chart summaries", () => {
  render(<DashboardAnalytics />);
  expect(screen.getByText("Sample data")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Sample visits by day" })).toHaveAccessibleDescription(/Mon: 124 visits/);
  expect(screen.getByRole("img", { name: /Sample translation coverage/ })).toBeInTheDocument();
  expect(screen.getByText("1,284")).toBeInTheDocument();
});
