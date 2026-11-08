import { createRef } from "react";
import { fireEvent, render } from "@testing-library/react";
import type { MuiDataTableInstance } from "../../table";
import { PerformanceTable, type DataTablePerformanceRow } from "./DataTablePerformanceAcceptance";

const originalResizeObserver = window.ResizeObserver;
beforeEach(() => {
  window.ResizeObserver = class { observe = jest.fn(); unobserve = jest.fn(); disconnect = jest.fn(); };
  jest.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(185);
  jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 300, 48));
});
afterEach(() => { jest.restoreAllMocks(); window.ResizeObserver = originalResizeObserver; });
it("keeps first-row selection and reset consistent with select-sticky pinning", () => {
  window.ResizeObserver = class { observe = jest.fn(); unobserve = jest.fn(); disconnect = jest.fn(); };
  let instance: MuiDataTableInstance<DataTablePerformanceRow> | undefined;
  const { container, getByRole, unmount } = render(<PerformanceTable
    rowCount={50}
    columnCount={4}
    displayMode="table"
    narrowOwner={false}
    diagnostics={null}
    onProfile={jest.fn()}
    surfaceRef={createRef<HTMLElement>()}
    integratedWindow
    integratedInteractive
    onTable={table => { instance = table; }}
  />);
  if (!instance) throw new Error("Performance table did not mount");
  const first = instance.getRow("1");
  const mounted = () => container.querySelectorAll("tbody tr[data-row-id]");
  expect(mounted().length).toBeLessThan(50);
  const toggle = getByRole("button", { name: "Toggle first-row selection" });
  fireEvent.click(toggle);
  expect(first.getIsSelected()).toBe(true);
  expect(first.getIsPinned()).toBe("top");
  expect(mounted()).toHaveLength(50);
  expect(container.querySelector('tr[data-row-id="1"]')).toHaveAttribute("data-row-pinned", "top");
  fireEvent.click(toggle);
  expect(first.getIsSelected()).toBe(false);
  expect(first.getIsPinned()).toBe(false);
  fireEvent.click(toggle);
  fireEvent.click(getByRole("button", { name: "Reset interactions" }));
  expect(first.getIsSelected()).toBe(false);
  expect(first.getIsPinned()).toBe(false);
  expect(instance.getIsSomeRowsPinned()).toBe(false);
  expect(mounted().length).toBeLessThan(50);
  expect(container.querySelector('tr[data-row-id="1"]')).not.toHaveAttribute("data-row-pinned");
  unmount();
});

it("updates experimental detail controls with a narrow owner subscription", () => {
    const view = render(<PerformanceTable rowCount={200} columnCount={4} displayMode="table"
      narrowOwner diagnostics={null} onProfile={jest.fn()} surfaceRef={createRef<HTMLElement>()}
      windowed windowedDetails />);
    fireEvent.click(view.getByRole("button", { name: "Expand first record" }));
    expect(view.getByRole("button", { name: "Collapse first record" })).toHaveAttribute("aria-expanded", "true");
    expect(view.getByRole("button", { name: "Show more detail" })).toBeEnabled();
    fireEvent.click(view.getByRole("button", { name: "Collapse first record" }));
    expect(view.getByRole("button", { name: "Expand first record" })).toHaveAttribute("aria-expanded", "false");
    expect(view.getByRole("button", { name: "Show more detail" })).toBeDisabled();
    view.unmount();

});
