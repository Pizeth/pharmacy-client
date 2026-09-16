import { createTheme, ThemeProvider } from "@mui/material/styles";

import { fireEvent, render, screen } from "@testing-library/react";

import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";

import { DataTableRowActionsMenu } from "./DataTableRowActionsMenu";

import type { DataTableRowAction } from "./types";

import type { ResolvedDataTableRowAction } from "./resolvedTypes";

type Row = {
  readonly id: string;

  readonly name: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
  }),
]);

const data: readonly Row[] = [
  {
    id: "alpha",

    name: "Alpha",
  },
];

function Fixture() {
  const table = useMuiDataTable({
    columns,

    data: [...data],

    getRowId: (row) => row.id,
  });

  const row = table.getRowModel().rows[0];

  if (!row) {
    throw new Error("Row-actions RTL fixture did not produce a row.");
  }

  const definition: DataTableRowAction<Row> = {
    id: "inspect",

    label: "Inspect",

    onClick: () => undefined,
  };

  const action: ResolvedDataTableRowAction<Row> = {
    definition,

    context: {
      table,
      row,
    },

    icon: null,

    color: "default",

    disabled: false,

    inline: false,
  };

  return (
    <ThemeProvider
      theme={createTheme({
        direction: "rtl",
      })}
    >
      <div dir="rtl">
        <DataTableRowActionsMenu actions={[action]} />
      </div>
    </ThemeProvider>
  );
}

it("passes RTL direction into the row-actions menu portal", () => {
  render(<Fixture />);

  fireEvent.click(
    screen.getByRole("button", {
      name: "More actions for row alpha",
    }),
  );

  const menu = screen.getByRole("menu", {
    name: "Actions for row alpha",
  });

  expect(menu.closest('[dir="rtl"]')).not.toBeNull();
});
