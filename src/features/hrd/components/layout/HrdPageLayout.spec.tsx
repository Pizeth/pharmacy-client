import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { HrdBreadcrumbs } from "./HrdPageLayout";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
const pathname = jest.mocked(usePathname);

it.each([
  ["/hrd", "ទំព័រដើម", 0],
  ["/hrd/documents", "បណ្ដុំឯកសារ", 1],
  ["/hrd/contact", "ទំនាក់ទំនង", 1],
  ["/hrd/about/director", "អំពីប្រធាននាយកដ្ឋាន", 2],
  ["/hrd/about/overview", "ព័ត៌មានសង្ខេបនាយកដ្ឋាន", 2],
  ["/hrd/about/structure", "រចនាសម្ព័ន្ធ", 2],
  ["/hrd/about/staff", "ថ្នាក់ដឹកនាំ និងមន្រ្តី", 2],
])("renders the shared breadcrumb trail for %s", (route, label, linkCount) => {
  pathname.mockReturnValue(route as string);
  render(<HrdBreadcrumbs />);
  const trail = screen.getByRole("navigation", { name: "ទីតាំងទំព័រ" });
  expect(within(trail).getByText(label as string)).toHaveAttribute("aria-current", "page");
  expect(within(trail).queryAllByRole("link")).toHaveLength(linkCount as number);
  if (linkCount) expect(within(trail).getByRole("link", { name: "ទំព័រដើម" })).toHaveAttribute("href", "/hrd");
  if (linkCount === 2) expect(within(trail).getByRole("link", { name: "អំពីអង្គភាព" })).toHaveAttribute("href", "/hrd/about");
});
