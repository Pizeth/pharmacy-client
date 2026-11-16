import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { ResourceDataTable } from "./ResourceDataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "@/components/DataTable/mui/table";
import type { MuiDataTableInstance } from "@/components/DataTable/mui/table";
const helper = createMuiDataTableColumnHelper<{ id: string; name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }];
let api: MuiDataTableInstance<{ id: string; name: string }>;
function Fixture({ loading = false, onViewRecord, flip = false }: { flip?: boolean; loading?: boolean; onViewRecord?: (record: { id: string; name: string }) => void }) {
  const table = useMuiDataTable({ data, columns, getRowId: row => row.id, enableGlobalFilter: true, enableRowSelection: true, getRowCanExpand: () => true });
  useEffect(() => { api = table; }, [table]);
  return <ResourceDataTable resourceId="test/resource-standard" onViewRecord={onViewRecord} loading={loading} loadingMessage="Loading test records…" table={table} card={{ detailMode: flip ? "flip" : "inline", flip: { flipOnHover: false }, renderDetail: () => "Expanded details", enableExpansion: true, enableSelection: true, renderHeader: ({ row }) => row.original.name, renderBody: ({ row }) => row.original.name }} />;
}
beforeEach(() => localStorage.clear());
it("offers shared controls and retains semantic state across card changes", () => {
  render(<Fixture />);
  expect(screen.getByRole("button", { name: "Manage table columns" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enter fullscreen table" })).toBeInTheDocument();
  act(() => { api.setGlobalFilter("Alpha"); api.setRowSelection({ a: true }); });
  fireEvent.click(screen.getByRole("button", { name: "Switch to card view" }));
  fireEvent.click(screen.getByLabelText("Compact cards"));
  expect(api.store.get().globalFilter).toBe("Alpha");
  expect(api.store.get().rowSelection).toEqual({ a: true });
  expect(screen.getByLabelText("Compact cards")).toBeChecked();
});

it("defaults to cards on small screens and permits a manual table switch", () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query.includes("max-width") && query.includes("899.95px"), media: query,
    onchange: null, addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
  }));
  try {
    render(<Fixture />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to table view" }));
    expect(screen.getByRole("button", { name: "Switch to card view" })).toBeInTheDocument();
  } finally {
    window.matchMedia = original;
  }
});

it("uses the universal loader before initial rows are ready", () => {
 const { rerender } = render(<Fixture loading />);
 expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
 expect(screen.getByText("Loading test records…")).toBeInTheDocument();
 expect(screen.queryByRole("table")).not.toBeInTheDocument();
 rerender(<Fixture />);
 expect(screen.queryByText("Loading test records…")).not.toBeInTheDocument();
 expect(screen.getByRole("button", { name: "Manage table columns" })).toBeInTheDocument();
});

it("opens details only from selected table and card surfaces", () => {
  const view = jest.fn();
  const { container } = render(<Fixture onViewRecord={view} />);
  let row = container.querySelector<HTMLElement>('tr[data-row-id="a"]')!;
  fireEvent.click(row);
  expect(view).not.toHaveBeenCalled();
  act(() => api.setRowSelection({ a: true }));
  fireEvent.keyDown(row, { key: "Enter" });
  expect(view).toHaveBeenCalledWith(data[0]);
  view.mockClear();
  fireEvent.click(screen.getByRole("button", { name: "Switch to card view" }));
  row = container.querySelector<HTMLElement>('[role="listitem"][data-row-id="a"]')!;
  expect(row).toHaveAttribute("tabindex", "0");
  fireEvent.click(screen.getByRole("checkbox", { name: "Select row a" }));
  expect(view).not.toHaveBeenCalled();
  expect(row).not.toHaveAttribute("tabindex");
  fireEvent.click(row);
  expect(view).not.toHaveBeenCalled();
  act(() => api.setRowSelection({ a: true }));
  fireEvent.click(row);
  expect(view).toHaveBeenCalledWith(data[0]);
});

it("keeps flip-card controls independent from selected-card navigation on both faces", () => {
  const view = jest.fn();
  const { container } = render(<Fixture flip onViewRecord={view} />);
  fireEvent.click(screen.getByRole("button", { name: "Switch to card view" }));
  const card = container.querySelector<HTMLElement>('[role="listitem"][data-row-id="a"]')!;
  fireEvent.click(card); expect(view).not.toHaveBeenCalled();
  act(() => api.setRowSelection({ a: true }));
  fireEvent.click(screen.getAllByRole("button", { name: "Show details" })[0]);
  expect(view).not.toHaveBeenCalled();
  expect(card).toHaveAttribute("data-flipped", "true");
  fireEvent.keyDown(card, { key: "Enter" });
  expect(view).toHaveBeenCalledWith(data[0]);
});
