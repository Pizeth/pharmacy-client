import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  createSelectionColumn,
} from "../columns/selection";
import {
  dataTableClasses,
} from "../styles";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../table";
import {
  DataTable,
} from "./DataTable";

type Row = {
  readonly id: string;
  readonly name: string;
};

const helper =
  createMuiDataTableColumnHelper<Row>();

const columns =
  helper.columns([
    createSelectionColumn<Row>({
      size:
        48,
    }),
    helper.accessor(
      "name",
      {
        header:
          "Name",
      },
    ),
  ]);

const data: readonly Row[] =
  [
    {
      id:
        "1",
      name:
        "Alpha",
    },
  ];

function Fixture(
  props: {
    readonly cardAvailable?: boolean;
  },
) {
  const {
    cardAvailable =
      true,
  } = props;

  const table =
    useMuiDataTable({
      columns,
      data:
        [...data],
      getRowId:
        (
          row,
        ) =>
          row.id,
      enableRowSelection:
        true,
    });

  return (
    <DataTable
      table={
        table
      }
      pagination={
        false
      }
      toolbar={{
        search:
          false,
        enableFilterToggle:
          false,
        enableColumnManager:
          false,
        enableDensity:
          false,
        enableFullscreen:
          false,
      }}
      card={
        cardAvailable
          ? {
              enableSelection:
                true,
              renderBody:
                ({
                  row,
                }) => (
                  <span>
                    Card{" "}
                    {
                      row
                        .original
                        .name
                    }
                  </span>
                ),
            }
          : undefined
      }
    />
  );
}

const theme =
  createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          displayModeButton: {
            backgroundColor:
              "rgb(10, 20, 30)",
          },
        },
      },
    },
  });

describe(
  "DataTable display-mode toolbar action",
  () => {
    it(
      "switches the physical renderer without replacing TanStack row state",
      () => {
        const {
          container,
        } =
          render(
            <ThemeProvider
              theme={
                theme
              }
            >
              <Fixture />
            </ThemeProvider>,
          );

        const toggle =
          screen.getByRole(
            "button",
            {
              name:
                "Switch to card view",
            },
          );

        expect(
          toggle,
        ).toHaveStyle({
          backgroundColor:
            "rgb(10, 20, 30)",
        });

        expect(
          container.querySelector(
            `.${dataTableClasses.table}`,
          ),
        ).not.toBeNull();

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select row 1",
            },
          ),
        );

        fireEvent.click(
          toggle,
        );

        expect(
          screen.getByText(
            "Card Alpha",
          ),
        ).toBeVisible();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Switch to table view",
            },
          ),
        ).toHaveAttribute(
          "aria-pressed",
          "true",
        );

        expect(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select row 1",
            },
          ),
        ).toBeChecked();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Switch to table view",
            },
          ),
        );

        expect(
          container.querySelector(
            `.${dataTableClasses.table}`,
          ),
        ).not.toBeNull();

        expect(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select row 1",
            },
          ),
        ).toBeChecked();
      },
    );

    it(
      "does not expose the action when the resource has no card renderer",
      () => {
        render(
          <Fixture
            cardAvailable={
              false
            }
          />,
        );

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Switch to card view",
            },
          ),
        ).toBeNull();
      },
    );
  },
);
