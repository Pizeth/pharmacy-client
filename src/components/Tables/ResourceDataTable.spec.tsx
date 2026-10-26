import { act, fireEvent, render, screen } from "@testing-library/react";
import { ResourceDataTable } from "./ResourceDataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "@/components/DataTable/mui/table";
import type { MuiDataTableInstance } from "@/components/DataTable/mui/table";
const helper = createMuiDataTableColumnHelper<{ id: string; name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }];
let api: MuiDataTableInstance<{ id: string; name: string }>;
function Fixture({ loading = false }: { loading?: boolean }) {
  const table = useMuiDataTable({ data, columns, getRowId: row => row.id, enableGlobalFilter: true, enableRowSelection: true });
  api = table;
  return <ResourceDataTable resourceId="test/resource-standard" loading={loading} loadingMessage="Loading test records…" table={table} card={{ enableSelection: true, renderHeader: ({ row }) => row.original.name, renderBody: ({ row }) => row.original.name }} />;
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
