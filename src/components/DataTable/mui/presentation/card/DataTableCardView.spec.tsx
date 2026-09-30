import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { EditOutlined } from "@mui/icons-material";

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

    const cardContainer = container.querySelector(
      `.${dataTableClasses.cardContainer}`,
    );

    expect(cardContainer).not.toBeNull();
    expect(cardContainer).toHaveStyle({
      flex: "1 1 auto",
      minHeight: "0",
      overflow: "auto",
    });

    expect(
      container.querySelector(`.${dataTableClasses.cardItem}`),
    ).not.toBeNull();

    expect(container.querySelector("table")).toBeNull();
  });

  it("preserves selection, actions, and expansion/detail state in card mode", () => {
    const onEdit = jest.fn();

    function ParityFixture() {
      const table = useMuiDataTable({
        columns,
        data: [{ id: 1, name: "Alpha" }],
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        getRowCanExpand: () => true,
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          displayMode="card"
          card={{
            enableSelection: true,
            enableExpansion: true,
            renderBody: ({ row }) => row.original.name,
            actions: [
              {
                id: "edit",
                label: "Edit",
                inline: true,
                renderIcon: () => <EditOutlined />,
                onClick: onEdit,
              },
            ],
          }}
          renderDetailPanel={({ row }) => (
            <span>{`Details ${row.original.name}`}</span>
          )}
        />
      );
    }

    const { container } = render(<ParityFixture />);

    const select = screen.getByRole("checkbox", {
      name: "Select row 1",
    });

    fireEvent.click(select);

    expect(select).toBeChecked();

    expect(
      container.querySelector(
        `.${dataTableClasses.cardItem}[data-selected="true"]`,
      ),
    ).not.toBeNull();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit for row 1",
      }),
    );

    expect(onEdit).toHaveBeenCalledTimes(1);

    const expand = screen.getByRole("button", {
      name: "Expand details for row 1",
    });

    fireEvent.click(expand);

    expect(
      screen.getByText("Details Alpha"),
    ).toBeInTheDocument();

    const detail = screen
      .getByText("Details Alpha")
      .closest('[role="region"]');

    expect(detail).not.toBeNull();

    expect(detail).toHaveAttribute(
      "aria-labelledby",
      expand.id,
    );

    /**
     * Expanded application content may be arbitrarily tall. Keep row commands
     * before the detail region so expansion cannot push the command surface out
     * of the visible card.
     */
    const cardItem = container.querySelector(
      `.${dataTableClasses.cardItem}`,
    );
    const cardActions = cardItem?.querySelector(
      `.${dataTableClasses.cardActions}`,
    );
    const cardDetail = cardItem?.querySelector(
      `.${dataTableClasses.cardDetail}`,
    );

    expect(cardItem).not.toBeNull();
    expect(cardActions).not.toBeNull();
    expect(cardDetail).not.toBeNull();

    const children = Array.from(cardItem?.children ?? []);

    expect(children.indexOf(cardActions!)).toBeLessThan(
      children.indexOf(cardDetail!),
    );
  });

  it("resolves auto to table above the configured card breakpoint", () => {
    const original = window.matchMedia;

    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }) as MediaQueryList;

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

    window.matchMedia = original;
  });

  it("resolves auto to cards at or below the configured breakpoint", () => {
    const original = window.matchMedia;

    window.matchMedia = (query: string) =>
      ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }) as MediaQueryList;

    function AutoCardFixture() {
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
          autoCardBreakpoint="md"
          card={{
            renderBody: ({ row }) => `Auto ${row.original.name}`,
          }}
        />
      );
    }

    const { container } = render(<AutoCardFixture />);

    expect(screen.getByText("Auto Alpha")).toBeInTheDocument();
    expect(
      container.querySelector(`.${dataTableClasses.cardContainer}`),
    ).not.toBeNull();
    expect(container.querySelector("table")).toBeNull();

    window.matchMedia = original;
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
