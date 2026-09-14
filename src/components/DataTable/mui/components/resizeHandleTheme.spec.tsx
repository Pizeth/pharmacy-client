import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

const helper = createMuiDataTableColumnHelper<{
  name: string;
  fixed: string;
}>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    size: 100,
    minSize: 80,
    maxSize: 140,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
  helper.accessor("fixed", {
    header: "Fixed",
    enableResizing: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
]);
const data = [{ name: "A", fixed: "B" }];
function Fixture({
  direction = "ltr",
  enabled = true,
  mode = "onChange",
}: {
  direction?: "ltr" | "rtl";
  enabled?: boolean;
  mode?: "onChange" | "onEnd";
}) {
  const table = useMuiDataTable({
    columns,
    data,
    enableColumnResizing: enabled,
    columnResizeDirection: direction,
    columnResizeMode: mode,
  });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={table.getHeaderGroups()[0]}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
function mount(
  direction: "ltr" | "rtl" = "ltr",
  enabled = true,
  mode: "onChange" | "onEnd" = "onChange",
) {
  return render(
    <ThemeProvider
      theme={createTheme({
        direction,
        components: {
          RazethDataTable: {
            styleOverrides: {
              resizeHandle: { backgroundColor: "rgb(10, 20, 30)" },
            },
          },
        },
      })}
    >
      <Fixture direction={direction} enabled={enabled} mode={mode} />
    </ThemeProvider>,
  );
}
function handle() {
  return screen.getByRole("separator", { name: "Resize Name" });
}

describe("resize handle theme and TanStack interactions", () => {
  it("exposes the structural slot, theme override, and accessible size", () => {
    mount();
    expect(handle()).toHaveClass(dataTableClasses.resizeHandle);
    expect(handle()).toHaveStyle({
      position: "absolute",
      width: "8px",
      insetInlineEnd: "0",
      backgroundColor: "rgb(10, 20, 30)",
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "100");
    expect(handle()).toHaveAttribute("aria-valuemin", "80");
    expect(handle()).toHaveAttribute("aria-valuemax", "140");
    expect(handle()).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });
  it("omits handles when table resizing is disabled", () => {
    mount("ltr", false);
    expect(screen.queryByRole("separator")).toBeNull();
  });
  it.each(["ltr", "rtl"] as const)(
    "preserves keyboard steps, bounds and reset in %s",
    (direction) => {
      mount(direction);
      const grow = direction === "ltr" ? "ArrowRight" : "ArrowLeft";
      const shrink = direction === "ltr" ? "ArrowLeft" : "ArrowRight";
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "108");
      fireEvent.keyDown(handle(), { key: grow, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "80");
      expect(handle()).not.toHaveAttribute("data-resizing");
      fireEvent.doubleClick(handle());
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
      fireEvent.keyDown(handle(), { key: "Enter" });
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
    },
  );
  it.each(["onChange", "onEnd"] as const)(
    "delegates mouse lifecycle and %s commits to TanStack",
    (mode) => {
      mount("ltr", true, mode);
      fireEvent.mouseDown(handle(), { clientX: 100, button: 0 });
      expect(handle()).toHaveAttribute("data-resizing", "true");
      fireEvent.mouseMove(document, { clientX: 120 });
      expect(handle()).toHaveAttribute(
        "aria-valuenow",
        mode === "onChange" ? "120" : "100",
      );
      fireEvent.mouseUp(document, { clientX: 120 });
      expect(handle()).toHaveAttribute("aria-valuenow", "120");
      expect(handle()).not.toHaveAttribute("data-resizing");
    },
  );
  it("delegates touch resizing to TanStack", () => {
    mount();
    fireEvent.touchStart(handle(), { touches: [{ clientX: 100 }] });
    expect(handle()).toHaveAttribute("data-resizing", "true");
    fireEvent.touchMove(document, { touches: [{ clientX: 116 }] });
    fireEvent.touchEnd(document, {
      touches: [],
      changedTouches: [{ clientX: 116 }],
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "116");
    expect(handle()).not.toHaveAttribute("data-resizing");
  });
});
