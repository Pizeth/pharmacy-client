import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTable } from "./DataTable";

const helper = createMuiDataTableColumnHelper<{ id: string; name: string }>();
const columns = helper.columns([
  helper.accessor("id", { size: 100 }),
  helper.accessor("name", { size: 120 }),
]);
const data = [{ id: "a", name: "Alpha" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        root: { borderTopWidth: "3px" },
        content: { paddingBottom: "5px" },
        container: { paddingTop: "7px" },
        table: { borderSpacing: "2px" },
      },
    },
  },
});
function Fixture({ fullscreen = false }: { fullscreen?: boolean }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <>
      <button onClick={() => table.setColumnSizing({ id: 160 })}>Resize</button>
      <button onClick={() => table.getColumn("name")?.toggleVisibility(false)}>
        Hide name
      </button>
      <DataTable
        table={table}
        toolbar={false}
        pagination={false}
        fullscreen={fullscreen}
        tableProps={{
          className: "custom-table",
          "aria-label": "Records",
          style: { opacity: 0.9 },
          sx: [{ borderSpacing: "4px" }],
        }}
        containerProps={{
          className: "custom-container",
          sx: () => ({ paddingTop: "9px" }),
        }}
      />
    </>
  );
}
function mount(fullscreen = false) {
  return render(
    <ThemeProvider theme={theme}>
      <Fixture fullscreen={fullscreen} />
    </ThemeProvider>,
  );
}
it("themes the shell and preserves caller classes, styles, and sx precedence", () => {
  const { container } = mount();
  expect(container.querySelector(`.${dataTableClasses.root}`)).toHaveStyle({
    borderTopWidth: "3px",
  });
  expect(container.querySelector(`.${dataTableClasses.content}`)).toHaveStyle({
    paddingBottom: "5px",
  });
  const viewport = container.querySelector(`.${dataTableClasses.container}`);
  expect(viewport).toHaveClass("custom-container");
  expect(viewport).toHaveStyle({ paddingTop: "9px", overflowX: "auto" });
  const table = screen.getByRole("table", { name: "Records" });
  expect(table).toHaveClass(dataTableClasses.table, "custom-table");
  expect(table).toHaveStyle({
    opacity: "0.9",
    borderSpacing: "4px",
    tableLayout: "fixed",
  });
});
it("updates total-width geometry through a CSS variable on resize and visibility changes", () => {
  mount();
  const table = screen.getByRole("table", { name: "Records" });
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("220px");
  fireEvent.click(screen.getByRole("button", { name: "Resize" }));
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("280px");
  fireEvent.click(screen.getByRole("button", { name: "Hide name" }));
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("160px");
});
it("applies fullscreen geometry to the shared outer root", () => {
  const { container } = mount(true);
  const root = container.querySelector(`.${dataTableClasses.root}`);
  expect(root).toHaveAttribute("data-fullscreen", "true");
  expect(root).toHaveStyle({
    position: "fixed",
    width: "100vw",
    borderRadius: "0",
    zIndex: String(theme.zIndex.modal + 1),
  });
});
