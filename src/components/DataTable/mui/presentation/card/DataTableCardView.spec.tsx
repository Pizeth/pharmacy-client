import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import {
  render,
  screen,
} from "@testing-library/react";

import { DataTable } from "../../components/DataTable";
import { dataTableClasses } from "../../styles";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../../table";

interface Row {
  readonly id: number;
  readonly name: string;
}

const columnHelper = createMuiDataTableColumnHelper<Row>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
]);

function Fixture() {
  const table = useMuiDataTable({
    columns,
    data: [{ id: 1, name: "Alpha" }],
    getRowId: (row) => String(row.id),
  });

  return (
    <DataTable
      table={table}
      toolbar={false}
      pagination={false}
      displayMode="card"
      card={{
        renderHeader: ({ row }) => `Header ${row.original.name}`,
        renderBody: ({ row }) => `Body ${row.original.name}`,
        renderMetadata: () => "Metadata",
        renderActions: () => "Actions",
        renderSelection: () => "Selection",
        renderExpansion: () => "Expansion",
      }}
    />
  );
}

describe("DataTable card presentation", () => {
  it("renders resource content through stable themeable card slots", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          styleOverrides: {
            cardContainer: { paddingTop: "7px" },
            cardItem: { borderTopWidth: "3px" },
            cardHeader: { minHeight: "41px" },
            cardSelection: { minWidth: "17px" },
            cardBody: { paddingBottom: "19px" },
            cardMetadata: { marginTop: "5px" },
            cardActions: { minHeight: "37px" },
            cardExpansion: { minHeight: "23px" },
          },
        },
      },
    });

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    expect(screen.getByText("Header Alpha")).toBeInTheDocument();
    expect(screen.getByText("Body Alpha")).toBeInTheDocument();
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Selection")).toBeInTheDocument();
    expect(screen.getByText("Expansion")).toBeInTheDocument();

    expect(
      container.querySelector(`.${dataTableClasses.cardContainer}`),
    ).not.toBeNull();

    expect(
      container.querySelector(`.${dataTableClasses.cardItem}`),
    ).not.toBeNull();

    expect(container.querySelector("table")).toBeNull();
  });

  it("keeps auto on the table renderer until responsive resolution exists", () => {
    function AutoFixture() {
      const table = useMuiDataTable({
        columns,
        data: [{ id: 1, name: "Alpha" }],
        getRowId: (row) => String(row.id),
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          displayMode="auto"
          card={{
            renderBody: ({ row }) => row.original.name,
          }}
        />
      );
    }

    const { container } = render(<AutoFixture />);

    expect(container.querySelector("table")).not.toBeNull();
    expect(
      container.querySelector(`.${dataTableClasses.cardContainer}`),
    ).toBeNull();
  });

  it("fails clearly when card mode has no resource card composition", () => {
    function InvalidFixture() {
      const table = useMuiDataTable({
        columns,
        data: [],
        getRowId: (row) => String(row.id),
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          displayMode="card"
        />
      );
    }

    expect(() => render(<InvalidFixture />)).toThrow(
      'DataTable card presentation requires a "card" configuration.',
    );
  });
});
