import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import { resolveTableCellAlignment } from "./alignment";

const helper = createMuiDataTableColumnHelper<{
  start: string;
  end: string;
  center: string;
  fallback: string;
}>();
const columns = helper.columns([
  helper.accessor("start", { header: "Start", meta: { align: "start" } }),
  helper.accessor("end", { header: "End", meta: { align: "end" } }),
  helper.accessor("center", { header: "Center", meta: { align: "center" } }),
  helper.accessor("fallback", { header: "Default" }),
]);
const data = [{ start: "S", end: "E", center: "C", fallback: "F" }];
function Fixture({ direction }: { direction: "ltr" | "rtl" }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <ThemeProvider theme={createTheme({ direction })}>
      <DataTable table={table} toolbar={false} pagination={false} />
    </ThemeProvider>
  );
}
it.each(["ltr", "rtl"] as const)(
  "resolves logical cell and header alignment in %s",
  (direction) => {
    const { container } = render(<Fixture direction={direction} />);
    expect(
      container.querySelector(`.${dataTableClasses.root}`),
    ).toHaveAttribute("dir", direction);
    const start = direction === "rtl" ? "right" : "left";
    const end = direction === "rtl" ? "left" : "right";
    expect(screen.getByRole("cell", { name: "S" })).toHaveStyle({
      textAlign: start,
    });
    expect(screen.getByRole("cell", { name: "E" })).toHaveStyle({
      textAlign: end,
    });
    expect(screen.getByRole("cell", { name: "C" })).toHaveStyle({
      textAlign: "center",
    });
    expect(screen.getByRole("cell", { name: "F" })).toHaveStyle({
      textAlign: start,
    });
    for (const [id, physical, justifyContent] of [
      ["start", start, "flex-start"],
      ["end", end, "flex-end"],
    ]) {
      const header = container.querySelector(`th[data-column-id="${id}"]`)!;
      expect(header).toHaveStyle({ textAlign: physical });
      const content = header.querySelector(
        `.${dataTableClasses.headerContent}`,
      );
      expect(content).toHaveAttribute("data-align", physical);
      expect(content).toHaveStyle({ justifyContent });
    }
    for (const id of ["center", "fallback"]) {
      const content = container.querySelector(
        `th[data-column-id="${id}"] .${dataTableClasses.headerContent}`,
      );
      expect(content).toHaveAttribute("data-align", "center");
      expect(content).toHaveStyle({
        gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
      });
    }
  },
);
it("updates direction on an existing table without a remount", () => {
  const view = render(<Fixture direction="ltr" />);
  const cell = screen.getByRole("cell", { name: "S" });
  view.rerender(<Fixture direction="rtl" />);
  expect(screen.getByRole("cell", { name: "S" })).toBe(cell);
  expect(cell).toHaveStyle({ textAlign: "right" });
  view.rerender(<Fixture direction="ltr" />);
  expect(cell).toHaveStyle({ textAlign: "left" });
});
it("keeps the helper's default direction compatible with existing LTR callers", () => {
  expect(resolveTableCellAlignment(undefined)).toBe("left");
  expect(resolveTableCellAlignment("end")).toBe("right");
  expect(resolveTableCellAlignment("center", "rtl")).toBe("center");
});

it("passes RTL direction into portaled table menus", () => {
  function Menus() {
    const table = useMuiDataTable({ columns, data });
    return <ThemeProvider theme={createTheme({ direction: "rtl" })}><DataTable table={table} /></ThemeProvider>;
  }
  render(<Menus />);
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  const density = screen.getByRole("menu", { name: "Table density" });
  expect(density.closest('[dir="rtl"]')).not.toBeNull();
  fireEvent.keyDown(density, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: "Open options for column start" }));
  const column = screen.getByRole("menu", { name: "Actions for column start" });
  expect(column.closest('[dir="rtl"]')).not.toBeNull();
  fireEvent.keyDown(column, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: "Manage table columns" }));
  expect(screen.getByRole("dialog", { name: "Columns" }).closest('[dir="rtl"]')).not.toBeNull();
});
