import { createRef } from "react";
import { fireEvent, render } from "@testing-library/react";
import type { MuiDataTableInstance } from "../../table";
import { PerformanceTable, type DataTablePerformanceRow } from "./DataTablePerformanceAcceptance";

it("keeps first-row selection and reset consistent with select-sticky pinning", () => {
  let instance: MuiDataTableInstance<DataTablePerformanceRow> | undefined;
  const { getByRole, unmount } = render(<PerformanceTable
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
  const toggle = getByRole("button", { name: "Toggle first-row selection" });
  fireEvent.click(toggle);
  expect(first.getIsSelected()).toBe(true);
  expect(first.getIsPinned()).toBe("top");
  fireEvent.click(toggle);
  expect(first.getIsSelected()).toBe(false);
  expect(first.getIsPinned()).toBe(false);
  fireEvent.click(toggle);
  fireEvent.click(getByRole("button", { name: "Reset interactions" }));
  expect(first.getIsSelected()).toBe(false);
  expect(first.getIsPinned()).toBe(false);
  expect(instance.getIsSomeRowsPinned()).toBe(false);
  unmount();
});

