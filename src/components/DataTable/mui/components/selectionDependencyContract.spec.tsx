import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectionDependenciesFixture, type DependencyTable, type DependencyVariant } from "../dev/SelectionDependenciesAcceptance";

function setup(variant: DependencyVariant, controlled = false, direction: "ltr" | "rtl" = "ltr", snapshotCallbacks = false, conditionalDetail = false) {
  let table: DependencyTable;
  const outputCommit = jest.fn();
  const commit = jest.fn();
  const diagnostics = { commit, measureRowModel: <T,>(read: () => T) => read() };
  const view = render(<ThemeProvider theme={createTheme({ direction })}>
    <SelectionDependenciesFixture variant={variant} controlled={controlled} direction={direction} snapshotCallbacks={snapshotCallbacks}
      conditionalDetail={conditionalDetail}
      onTable={value => { table = value; }} commit={outputCommit} diagnostics={diagnostics} />
  </ThemeProvider>);
  return { ...view, table: () => table!, commit, outputCommit,
    row: (id: string) => view.container.querySelector<HTMLElement>(`[data-row-id="${id}"]`),
    select: (id: string, selected = true) => act(() => table!.getRow(id).toggleSelected(selected)),
    button: (name: string) => fireEvent.click(screen.getByRole("button", { name })),
  };
}

describe.each<DependencyVariant>(["default", "boundaries", "callbacks"])("%s dependency contract", variant => {
  it("D1–D8: count, cross-row guard and UNDECLARED callbacks update while local A can skip B", () => {
    const fixture = setup(variant);
    fixture.select("a");
    expect(fixture.row("a")).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("own-a")).toHaveTextContent("selected");
    expect(screen.getByTestId("global-a")).toHaveTextContent("1");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
    fixture.outputCommit.mockClear(); fixture.commit.mockClear();
    fixture.select("b");
    expect(fixture.table().store.get().rowSelection).toEqual({ a: true, b: true });
    expect(fixture.row("a")).toHaveAttribute("data-selected", "true");
    expect(fixture.row("b")).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    expect(screen.getByTestId("other-a")).toHaveTextContent("B selected");
    expect(screen.getByTestId("nested-a")).toHaveTextContent("2");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
    // Count committed output, not calls to a speculative React render function.
    expect(fixture.outputCommit).not.toHaveBeenCalledWith("own-a");
    if (variant === "boundaries") {
      expect(fixture.commit).not.toHaveBeenCalledWith("row", "a");
      expect(fixture.outputCommit).not.toHaveBeenCalledWith("parent-a");
    }
    expect(fixture.outputCommit).toHaveBeenCalledWith("global-a");
    expect(fixture.outputCommit).toHaveBeenCalledWith("nested-a");
    const rows = [...new Set(fixture.commit.mock.calls.filter(([layer]) => layer === "row").map(([, id]) => id))];
    const cells = new Set(fixture.commit.mock.calls.filter(([layer]) => layer === "cell").map(([, id]) => id));
    expect(rows.sort()).toEqual(variant !== "boundaries" ? ["a", "b"] : ["b"]);
    expect(cells.size).toBe(variant !== "boundaries" ? 14 : 7);
    expect(fixture.commit.mock.calls.filter(([layer]) => layer === "owner")).toHaveLength(variant !== "boundaries" ? 1 : 0);
    expect(fixture.commit.mock.calls.filter(([layer]) => layer === "body")).toHaveLength(variant !== "boundaries" ? 1 : 0);
    expect(fixture.outputCommit.mock.calls.filter(([id]) => id === "global-a")).toHaveLength(1);
    expect(fixture.outputCommit.mock.calls.filter(([id]) => id === "nested-a")).toHaveLength(1);
    fixture.select("b", false);
    expect(screen.getByTestId("other-a")).toHaveTextContent("B clear");
    expect(screen.getByTestId("global-a")).toHaveTextContent("1");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
    fixture.select("a", false);
    expect(fixture.row("a")).not.toHaveAttribute("data-selected");
    expect(screen.getByTestId("own-a")).toHaveTextContent("clear");
    expect(screen.getByTestId("global-a")).toHaveTextContent("0");
  });

  it("D9–D14: page clear retains off-page IDs; raw and filtered counts differ; IDs survive sorting", () => {
    const fixture = setup(variant);
    act(() => fixture.table().setRowSelection({ d: true, unloaded: true }));
    const all = screen.getByRole("checkbox", { name: /select all/i });
    fireEvent.click(all);
    expect(all).toBeChecked();
    expect(screen.getByTestId("raw-count")).toHaveTextContent("4");
    expect(screen.getByTestId("selected-ids")).toHaveTextContent("a,b,d,unloaded");
    fireEvent.click(all);
    expect(all).not.toBeChecked();
    expect(screen.getByTestId("selected-ids")).toHaveTextContent("d,unloaded");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    act(() => fixture.table().setGlobalFilter("Bravo"));
    expect(fixture.row("a")).toBeNull();
    expect(screen.getByTestId("raw-count")).toHaveTextContent("2");
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("0");
    expect(screen.getByTestId("global-b")).toHaveTextContent("2");
    act(() => { fixture.table().setGlobalFilter(""); fixture.table().setSorting([{ id: "name", desc: true }]); });
    expect(fixture.row("d")).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");
    expect(screen.getByTestId("selected-ids")).toHaveTextContent("d,unloaded");
  });

  it("D15–D17: controlled state, external policy and global eligibility invalidate independently", () => {
    const fixture = setup(variant, true);
    fixture.button("External select A and B");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
    fixture.button("External clear");
    fixture.button("Toggle external policy");
    expect(screen.getByTestId("raw-count")).toHaveTextContent("0");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
    fixture.button("Toggle external policy");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
    fixture.button("Toggle eligibility policy");
    expect(within(fixture.row("b")!).getByRole("checkbox")).toBeEnabled();
    fixture.select("a");
    expect(fixture.table().getRow("b").getCanSelect()).toBe(false);
    expect(within(fixture.row("b")!).getByRole("checkbox")).toBeDisabled();
    fixture.select("a", false);
    expect(within(fixture.row("b")!).getByRole("checkbox")).toBeEnabled();
  });

  it("D18–D22: detail and independent card outputs stay current across same-instance transitions", () => {
    const fixture = setup(variant);
    fixture.button("Expand A");
    expect(screen.getByTestId("detail-a")).toHaveTextContent("0");
    fixture.select("a"); fixture.select("b");
    expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
    fixture.select("b", false);
    fixture.button("Switch presentation");
    expect(fixture.table().store.get().rowSelection).toEqual({ a: true });
    fixture.outputCommit.mockClear(); fixture.commit.mockClear();
    fixture.select("b");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    expect(screen.getByTestId("nested-a")).toHaveTextContent("2");
    expect(screen.getByTestId("detail-a")).toHaveTextContent("2");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
    expect(fixture.outputCommit).not.toHaveBeenCalledWith("own-a");
    expect(fixture.commit).toHaveBeenCalledWith("row", "a");
    expect(fixture.commit).toHaveBeenCalledWith("row", "b");
    expect(fixture.commit.mock.calls.filter(([layer]) => layer === "cell")).toHaveLength(0);
    fixture.button("Switch presentation");
    expect(fixture.row("a")).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
  });

  it("D23–D26: reverse selection, logical pinning, columns and remount preserve current output", () => {
    const fixture = setup(variant, false, "rtl");
    fixture.select("b"); fixture.select("a");
    act(() => {
      fixture.table().setRowPinning({ top: ["b", "a"], bottom: [] });
      fixture.table().setColumnPinning({ start: ["name"], end: ["actions"] });
      fixture.table().setColumnVisibility({ other: false });
      fixture.table().setColumnOrder(["actions", "name", "global", "own", "nested", "select"]);
    });
    expect(screen.queryByTestId("other-a")).not.toBeInTheDocument();
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    expect(fixture.row("a")).toHaveAttribute("data-row-pinned", "top");
    expect(fixture.row("b")).toHaveAttribute("data-row-pinned", "top");
    expect([...fixture.container.querySelectorAll("tr[data-row-id]")].map(row => row.getAttribute("data-row-id"))).toEqual(["a", "b"]);
    expect(fixture.row("a")!.querySelector('[data-column-id="name"]')).toHaveAttribute("data-pinned", "start");
    fixture.button("Remount renderer");
    expect(screen.getByTestId("global-a")).toHaveTextContent("2");
    fixture.outputCommit.mockClear();
    fixture.select("b", false);
    expect(screen.getByTestId("global-a")).toHaveTextContent("1");
    expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
    expect(fixture.outputCommit.mock.calls.filter(([id]) => id === "global-a")).toHaveLength(1);
    fixture.unmount();
    fixture.outputCommit.mockClear();
    act(() => fixture.table().setRowSelection({}));
    expect(fixture.outputCommit).not.toHaveBeenCalled();
  });
});

it("rollout blocker D6: independent invalidation does not refresh a narrow owner's callback snapshot", () => {
  const fixture = setup("boundaries", false, "ltr", true);
  fixture.select("a"); fixture.select("b");
  expect(fixture.table().store.get().rowSelection).toEqual({ a: true, b: true });
  expect(screen.getByTestId("global-a")).toHaveTextContent("2");
  // Deliberate expected counterexample: even independently rerendered actions
  // receive an old hook-wrapper snapshot. Do not approve this for production.
  expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
});

it("rollout blocker D21: broad card commits alone cannot repair callback table.state", () => {
  const fixture = setup("boundaries", false, "ltr", true);
  fixture.button("Switch presentation");
  fixture.select("a"); fixture.select("b");
  expect(screen.getByTestId("raw-count")).toHaveTextContent("2");
  expect(screen.getByTestId("global-a")).toHaveTextContent("2");
  expect(screen.getByTestId("snapshot-a")).toHaveTextContent("0");
});

it("legacy D6/D21 callback snapshots remain fresh with the full production owner", () => {
  const fixture = setup("default", false, "ltr", true);
  fixture.select("a"); fixture.select("b");
  expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
  fixture.button("Switch presentation");
  fixture.select("b", false); fixture.select("b");
  expect(screen.getByTestId("snapshot-a")).toHaveTextContent("2");
  expect(within(fixture.row("a")!).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
});

it.each<DependencyVariant>(["default", "boundaries", "callbacks"])("D19 nullable callback integration gate: %s", variant => {
  const fixture = setup(variant, false, "ltr", false, true);
  fixture.button("Expand A");
  expect(fixture.table().getRow("a").getIsExpanded()).toBe(true);
  expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  fixture.select("a");
  expect(screen.getByTestId("global-a")).toHaveTextContent("1");
  if (variant !== "boundaries") {
    expect(screen.getByTestId("detail-a")).toHaveTextContent("1");
  } else {
    // Nothing mounted means no descendant boundary can subscribe. The callback
    // invocation itself needs an independent boundary before owner narrowing.
    expect(screen.queryByTestId("detail-a")).not.toBeInTheDocument();
  }
});
