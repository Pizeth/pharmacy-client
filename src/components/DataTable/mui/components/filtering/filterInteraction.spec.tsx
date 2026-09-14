import { useState } from "react";
import type { ColumnFiltersState } from "@tanstack/table-core";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import type { MuiDataTableInstance } from "../../table";
import { DataTableAccessibilityProvider } from "../../accessibility";
import {
  DataTableFilterDisplayProvider,
  useDataTableFilterDisplay,
} from "../../filter-display";
import { DataTableFilterToggleButton } from "../toolbar/actions/DataTableFilterToggleButton";
import { DataTableToolbarFilterStatus } from "../toolbar/DataTableToolbarFilterStatus";
import { DataTableColumnFilter } from "./DataTableColumnFilter";
import { DataTableFilterIndicator } from "./DataTableFilterIndicator";
import { dataTableClasses } from "../../styles";

type Row = { category: number; locale: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("category", {
    meta: {
      filterVariant: "select",
      filterLabel: "Category",
      filterOptionsError: "Options unavailable",
      filterOptions: [],
    },
  }),
  helper.accessor("locale", {
    meta: {
      filterVariant: "select",
      filterLabel: "Locale",
      filterOptions: [{ label: "English", value: "en" }],
    },
  }),
]);
const data = [{ category: 2, locale: "en" }];

function FilterSurface({ table }: { table: MuiDataTableInstance<Row> }) {
  const { showColumnFilters } = useDataTableFilterDisplay();
  const category = table.getColumn("category");
  if (!category) throw new Error("Missing fixture Category column");
  return (
    <>
      <DataTableFilterToggleButton table={table} />
      <DataTableToolbarFilterStatus table={table} />
      <table.Subscribe
        selector={(state) => ({
          filters: state.columnFilters,
          search: state.globalFilter,
        })}
      >
        {(state) => (
          <>
            <DataTableFilterIndicator active={category.getIsFiltered()} />
            {showColumnFilters && <DataTableColumnFilter column={category} />}
            <output aria-label="Query state">{JSON.stringify(state)}</output>
          </>
        )}
      </table.Subscribe>
    </>
  );
}

it.each(["click", "keyboard"])(
  "clears all filters atomically via %s while hidden and unavailable",
  (method) => {
    const onUpdate = jest.fn();
    function Fixture() {
      const [filters, setFilters] = useState<ColumnFiltersState>([
        { id: "category", value: 2 },
        { id: "locale", value: "en" },
        { id: "removed-column", value: "old" },
      ]);
      const table = useMuiDataTable({
        columns,
        data,
        state: { columnFilters: filters, globalFilter: "hello" },
        onColumnFiltersChange: (updater) => {
          onUpdate();
          setFilters(updater);
        },
      });
      return (
        <DataTableAccessibilityProvider>
          <DataTableFilterDisplayProvider
            defaultColumnFilterDisplayMode="subheader"
            defaultShowColumnFilters
          >
            <FilterSurface table={table} />
          </DataTableFilterDisplayProvider>
        </DataTableAccessibilityProvider>
      );
    }
    const { container } = render(<Fixture />);
    expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      container.querySelector(`.${dataTableClasses.filterIndicator}`),
    ).not.toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Hide column filters" }),
    );
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(onUpdate).not.toHaveBeenCalled();
    const clear = screen.getByRole("button", {
      name: "Clear all column filters (3 active)",
    });
    if (method === "click") fireEvent.click(clear);
    else {
      /**
       * MUI ButtonBase updates internal focus-visible state when the
       * element receives focus.
       *
       * Direct HTMLElement.focus() is not automatically wrapped by
       * Testing Library's event helpers, so wrap the focus transition
       * explicitly.
       */
      act(() => {
        clear.focus();
      });
      fireEvent.keyDown(clear, { key: "Delete" });
      fireEvent.keyUp(clear, { key: "Delete" });
    }
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Query state")).toHaveTextContent(
      '{"filters":[],"search":"hello"}',
    );
    expect(
      screen.queryByRole("button", { name: /Clear all column filters/ }),
    ).toBeNull();
    expect(
      container.querySelector(`.${dataTableClasses.filterIndicator}`),
    ).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Show column filters" }),
    );
    expect(
      screen.getByRole("button", { name: "Hide column filters" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
);
