import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableSelectionBar } from "./DataTableSelectionBar";

const helper = createMuiDataTableColumnHelper<{ id: string }>();
const columns = helper.columns([helper.accessor("id", {})]);
const data = [{ id: "a" }, { id: "b" }];
const slots = [
  "selectionBar",
  "selectionBarDivider",
  "selectionBarStart",
  "selectionBarEnd",
  "selectionBarStatus",
  "selectionClearButton",
  "bulkActions",
  "bulkActionButton",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: Object.fromEntries(
        slots.map((slot) => [slot, { borderTopWidth: "3px" }]),
      ),
    },
  },
});
function mount({
  empty = false,
  offPage = false,
  clearable = true,
  hidden = false,
  disabled = false,
  embedded = false,
} = {}) {
  const onAction = jest.fn();
  function Fixture() {
    const table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      initialState: {
        rowSelection: empty
          ? {}
          : offPage
            ? { a: true, missing: true }
            : { a: true, b: true },
      },
    });
    return (
      <table.AppTable>
        <DataTableSelectionBar
          table={table}
          embedded={embedded}
          clearable={clearable}
          renderStartContent={(context) => (
            <span>
              {context.selectedRows.map((row) => row.original.id).join(",")}
            </span>
          )}
          endContent={<span>Custom end</span>}
          actions={[
            {
              id: "inspect",
              label: "Inspect",
              isHidden: () => hidden,
              isDisabled: () => disabled,
              onClick: onAction,
            },
          ]}
        />
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, onAction };
}
it("themes all selection surfaces and preserves live status and custom content", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      borderTopWidth: "3px",
    });
  expect(screen.getByRole("status")).toHaveTextContent("2 rows selected");
  expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  expect(screen.getByText("a,b")).toBeVisible();
  expect(screen.getByText("Custom end")).toBeVisible();
});
it("passes the current selection context to a bulk action", () => {
  const { onAction } = mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect for 2 selected rows" }),
  );
  expect(onAction).toHaveBeenCalledTimes(1);
  expect(onAction.mock.calls[0][0].selectedRowIds).toEqual(["a", "b"]);
  expect(onAction.mock.calls[0][0].selectedCount).toBe(2);
});
it("clears selection and removes the complete bar including its divider", () => {
  const { container } = mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Clear all selected rows" }),
  );
  expect(screen.queryByRole("status")).toBeNull();
  expect(
    container.querySelector(`.${dataTableClasses.selectionBarDivider}`),
  ).toBeNull();
});
it("preserves disabled actions and optional clearing", () => {
  const { onAction } = mount({ disabled: true, clearable: false });
  const button = screen.getByRole("button", {
    name: "Inspect for 2 selected rows",
  });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(onAction).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: "Clear all selected rows" }),
  ).toBeNull();
});
it("omits hidden actions", () => {
  mount({ hidden: true });
  expect(
    screen.queryByRole("button", { name: "Inspect for 2 selected rows" }),
  ).toBeNull();
});
it("renders nothing for empty selection", () => {
  const { container } = mount({ empty: true });
  expect(
    container.querySelector(`.${dataTableClasses.selectionBar}`),
  ).toBeNull();
});

it("preserves off-page IDs and supplies only loaded rows to actions", () => {
  const { onAction } = mount({ offPage: true });
  expect(screen.getByRole("status")).toHaveTextContent("2 rows selected");
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect for 2 selected rows" }),
  );
  const context = onAction.mock.calls[0][0];
  expect(context.selectedRowIds).toEqual(["a", "missing"]);
  expect(context.selectedRows.map((row: { id: string }) => row.id)).toEqual([
    "a",
  ]);
  expect(context.selectedCount).toBe(2);
});

it("keeps embedded selection information and commands in one compact cluster", () => {
  const { container } = mount({ embedded: true });

  const selectionBar = container.querySelector(
    `.${dataTableClasses.selectionBar}`,
  );
  const selectionStart = container.querySelector(
    `.${dataTableClasses.selectionBarStart}`,
  );

  expect(selectionBar).not.toBeNull();
  expect(selectionStart).not.toBeNull();

  expect(selectionBar).toHaveAttribute("data-embedded", "true");

  /**
   * Embedded selection information must not consume PaginationStart's
   * remaining width and push its actions away from the status.
   */
  expect(selectionStart).toHaveStyle({
    flex: "0 1 auto",
  });

  /**
   * Compact geometry must not remove any selection capability.
   */
  expect(screen.getByRole("status")).toHaveTextContent("2 rows selected");
  expect(screen.getByText("a,b")).toBeVisible();
  expect(
    screen.getByRole("button", {
      name: "Inspect for 2 selected rows",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", {
      name: "Clear all selected rows",
    }),
  ).toBeVisible();
});
