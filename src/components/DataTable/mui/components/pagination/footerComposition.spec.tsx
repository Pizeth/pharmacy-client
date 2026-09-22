import { render, screen, within } from "@testing-library/react";

import { DataTable } from "../DataTable";
import { dataTableClasses } from "../../styles";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../../table";

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
    manualPagination: true,
    pageCount: 3,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      rowSelection: {
        alpha: true,
      },
    },
  });

  return (
    <DataTable
      table={table}
      toolbar={false}
      selectionBar={{}}
      pagination={{
        pageSizeOptions: [10, 25],
      }}
    />
  );
}

it("shares one bottom footer between selection status and pagination", () => {
  const { container } = render(<Fixture />);

  const footers = container.querySelectorAll(
    `.${dataTableClasses.pagination}`,
  );

  expect(footers).toHaveLength(1);

  const footer = footers[0];

  expect(
    within(footer as HTMLElement).getByRole("status"),
  ).toHaveTextContent("1 row selected");

  expect(
    within(footer as HTMLElement).getByRole("combobox", {
      name: "Rows per page",
    }),
  ).toBeVisible();

  expect(
    within(footer as HTMLElement).getByText("Page 1 of 3"),
  ).toBeVisible();

  /**
   * Embedded selection content must not create its old independent
   * top divider. The pagination footer owns the single footer divider.
   */
  expect(
    footer.querySelector(
      `.${dataTableClasses.selectionBarDivider}`,
    ),
  ).toBeNull();

  expect(
    footer.querySelector(
      `.${dataTableClasses.paginationStart}`,
    ),
  ).toContainElement(
    within(footer as HTMLElement).getByRole("status"),
  );
});

it("keeps the footer start reserved when no row is selected", () => {
  function EmptySelectionFixture() {
    const table = useMuiDataTable({
      columns,
      data: [
        {
          id: "alpha",
          name: "Alpha",
        },
      ],
      getRowId: (row) => row.id,
      manualPagination: true,
      pageCount: 1,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    });

    return (
      <DataTable
        table={table}
        toolbar={false}
        selectionBar={{}}
        pagination={{}}
      />
    );
  }

  const { container } = render(
    <EmptySelectionFixture />,
  );

  const footerStart = container.querySelector(
    `.${dataTableClasses.paginationStart}`,
  );

  expect(footerStart).toBeInTheDocument();
  expect(screen.queryByRole("status")).toBeNull();

  const footer = container.querySelector(
    `.${dataTableClasses.pagination}`,
  ) as HTMLElement;

  expect(
    within(footer).getByRole("combobox", {
      name: "Rows per page",
    }),
  ).toBeVisible();

  expect(
    within(footer).getByText("Page 1 of 1"),
  ).toBeVisible();
});
