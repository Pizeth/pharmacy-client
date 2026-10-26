import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectionDependenciesFixture, type DependencyTable, type SelectionDependenciesFixtureProps } from "../dev/SelectionDependenciesAcceptance";

function setup(props: Partial<SelectionDependenciesFixtureProps> = {}) {
  let table: DependencyTable;
  const outputCommit = jest.fn();
  const commit = jest.fn();
  const view = render(<ThemeProvider theme={createTheme()}><SelectionDependenciesFixture
    variant="callbacks" snapshotCallbacks conditionalDetail commit={outputCommit}
    diagnostics={{ commit, measureRowModel: read => read() }}
    {...props} onTable={value => { table = value; }} /></ThemeProvider>);
  return { ...view, outputCommit, commit, table: () => table!,
    select: (id: string, value = true) => act(() => table!.getRow(id).toggleSelected(value)),
    click: (name: string) => fireEvent.click(screen.getByRole("button", { name })),
    row: (id: string) => view.container.querySelector<HTMLElement>(`[data-row-id="${id}"]`)!,
  };
}

it("N1–N5: genuine callback state, aggregate guards and global cells update while local output skips B", () => {
  const f = setup();
  f.select("a");
  f.outputCommit.mockClear(); f.commit.mockClear();
  f.select("b");
  expect(f.table().state.rowSelection).toEqual({ a: true, b: true });
  expect(screen.getByTestId("global-a")).toHaveTextContent("2");
  expect(screen.getByTestId("nested-a")).toHaveTextContent("2");
  expect(within(f.row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
  expect(f.outputCommit).not.toHaveBeenCalledWith("own-a");
  expect(f.outputCommit).toHaveBeenCalledWith("global-a");
  expect(f.commit).toHaveBeenCalledWith("row", "a");
});

it.each(["null", "undefined", "false", "fragment"] as const)("N6–N8: %s → visible → empty without replacing the table", emptyOutput => {
  const f = setup({ emptyOutput });
  const store = f.table().store;
  f.click("Expand A");
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  f.select("a");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("1");
  f.outputCommit.mockClear();
  f.select("b");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
  expect(f.outputCommit).not.toHaveBeenCalledWith("detail-parent-a");
  f.select("b", false);
  f.select("a", false);
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  f.click("Toggle external policy"); f.select("a");
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  f.click("Toggle external policy");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("1");
  expect(f.table().store).toBe(store);
});

it("N9: all independent custom card slots see full selection and external policy", () => {
  const f = setup({ customSlots: true });
  f.click("Switch presentation"); f.click("Expand A");
  f.select("a"); f.select("b");
  for (const slot of ["header", "selection", "metadata", "expansion", "snapshot", "global", "detail"]) {
    expect(screen.getByTestId(`${slot}-a`)).toHaveTextContent("2");
  }
  expect(screen.getByTestId("custom-action-a")).toBeDisabled();
  f.select("b", false);
  expect(screen.getByTestId("custom-action-a")).toBeEnabled();
  f.click("Toggle external policy");
  expect(screen.getByTestId("custom-action-a")).toBeDisabled();
});

it("N9/N15: absent optional card callbacks retain controls, action guards and selection across modes", () => {
  const f = setup(); const store = f.table().store;
  f.select("a"); f.click("Switch presentation"); f.select("b");
  expect(screen.getByTestId("snapshot-a")).toHaveTextContent("2");
  expect(within(f.row("a")).getByRole("checkbox")).toBeChecked();
  expect(within(f.row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
  f.click("Switch presentation");
  expect(f.table().store).toBe(store);
  expect(f.row("a")).toHaveAttribute("data-selected", "true");
  expect(within(f.row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
});

it("N10: flip detail can appear and disappear with current callback state", () => {
  const f = setup({ flip: true }); f.click("Switch presentation");
  fireEvent.click(within(f.row("a")).getByRole("button", { name: "Show details" }));
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  f.select("a"); f.select("b");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
  expect(screen.getByTestId("snapshot-a")).toHaveTextContent("2");
  f.select("a", false); f.select("b", false);
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
});

it("N11–N14: controlled/off-page state, models and external policy retain genuine context", () => {
  const f = setup({ controlled: true }); f.click("Expand A");
  f.click("External select A and B");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
  act(() => f.table().setRowSelection({ a: true, unloaded: true }));
  expect(screen.getByTestId("selected-ids")).toHaveTextContent("a,unloaded");
  expect(f.table().state.rowSelection).toEqual({ a: true, unloaded: true });
  act(() => { f.table().setSorting([{ id: "name", desc: true }]); f.table().setPageSize(4); f.table().setColumnVisibility({ other: false }); f.table().setRowPinning({ top: ["a"], bottom: [] }); });
  expect(f.row("a")).toHaveAttribute("data-row-pinned", "top");
  expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
  f.click("Toggle external policy");
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  expect(within(f.row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
});

it("N16: remount cleans subscriptions and leaves no ghost committed output", () => {
  const f = setup(); f.click("Expand A"); f.select("a"); f.click("Remount renderer");
  f.outputCommit.mockClear(); f.select("b");
  expect(f.outputCommit.mock.calls.filter(([id]) => id === "detail-a")).toHaveLength(1);
  f.unmount(); f.outputCommit.mockClear();
  act(() => f.table().setRowSelection({}));
  expect(f.outputCommit).not.toHaveBeenCalled();
});
