import { createTheme, ThemeProvider } from "@mui/material/styles";

import { fireEvent, render, screen } from "@testing-library/react";

import { EditOutlined } from "@mui/icons-material";

import { DataTable } from "../../components";

import { dataTableClasses } from "../../styles";

import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";

import { createActionsColumn } from "./createActionsColumn";

import type { DataTableRowAction } from "./types";

type Row = {
  readonly id: string;

  readonly name: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const actions: readonly DataTableRowAction<Row>[] = [
  {
    id: "edit",

    label: "Edit",

    inline: true,

    renderIcon: () => <EditOutlined fontSize="small" />,

    onClick: () => undefined,
  },

  {
    id: "archive",

    label: "Archive",

    onClick: () => undefined,
  },
];

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
  }),

  createActionsColumn<Row>({
    actions,

    maxInlineActions: 1,
  }),
]);

function Fixture() {
  const table = useMuiDataTable({
    columns,

    data: [
      {
        id: "alpha",

        name: "Alpha",
      },
    ],

    getRowId: (row) => row.id,
  });

  return <DataTable table={table} toolbar={false} pagination={false} />;
}

it("exposes row-action surfaces as named RazethDataTable theme slots", () => {
  const theme = createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          rowActions: {
            backgroundColor: "rgb(10, 20, 30)",
          },

          rowActionButton: {
            borderRadius: "7px",
          },

          rowActionsMenuButton: {
            borderRadius: "9px",
          },

          rowActionsMenuItem: {
            minHeight: "41px",
          },
        },
      },
    },
  });

  const { container } = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );

  expect(
    container.querySelector(`.${dataTableClasses.rowActions}`),
  ).toHaveStyle({
    backgroundColor: "rgb(10, 20, 30)",
  });

  expect(
    screen.getByRole("button", {
      name: "Edit for row alpha",
    }),
  ).toHaveClass(dataTableClasses.rowActionButton);

  expect(
    screen.getByRole("button", {
      name: "Edit for row alpha",
    }),
  ).toHaveStyle({
    borderRadius: "7px",
  });

  const more = screen.getByRole("button", {
    name: "More actions for row alpha",
  });

  expect(more).toHaveClass(dataTableClasses.rowActionsMenuButton);

  fireEvent.click(more);

  const archive = screen.getByRole("menuitem", {
    name: "Archive",
  });

  expect(archive).toHaveClass(dataTableClasses.rowActionsMenuItem);

  expect(archive).toHaveStyle({
    minHeight: "41px",
  });
});
