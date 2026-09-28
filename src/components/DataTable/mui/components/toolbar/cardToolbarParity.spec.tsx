import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../../table";
import { DataTable } from "../DataTable";

interface Row {
  readonly name: string;
  readonly category: string;
}

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
      filterLabel: "Name contains",
    },
  }),
  helper.accessor("category", {
    header: "Category",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "select",
      filterLabel: "Category",
      filterOptions: [
        { label: "Auth", value: "auth" },
        { label: "Common", value: "common" },
      ],
    },
  }),
]);

const data: readonly Row[] = [
  { name: "Beta", category: "common" },
  { name: "Alpha", category: "auth" },
];

function Fixture(props: {
  readonly mode?: "table" | "card";
  readonly filtersOpen?: boolean;
}) {
  const { mode = "card", filtersOpen = false } = props;

  const table = useMuiDataTable({
    columns,
    data: [...data],
  });

  return (
    <DataTable
      table={table}
      card={{
        renderBody: ({ row }) => <span>{row.original.name}</span>,
      }}
      defaultDisplayMode={mode}
      columnFilterDisplayMode="subheader"
      defaultShowColumnFilters={filtersOpen}
      toolbar={{
        search: false,
        showSelectionSummary: false,
        enableColumnManager: false,
        enableDensity: false,
        enableDisplayModeToggle: false,
        enableFullscreen: false,
      }}
      pagination={false}
    />
  );
}

it("exposes the same column-filter editors while card view is active", async () => {
  render(<Fixture />);

  expect(
    screen.queryByRole("region", { name: "Column filters" }),
  ).toBeNull();

  fireEvent.click(
    screen.getByRole("button", { name: "Show column filters" }),
  );

  const filters = screen.getByRole("region", { name: "Column filters" });

  expect(
    within(filters).getByRole("textbox", { name: "Name contains" }),
  ).toBeVisible();

  fireEvent.change(
    within(filters).getByRole("textbox", { name: "Name contains" }),
    {
      target: {
        value: "Alpha",
      },
    },
  );

  await waitFor(() => {
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  expect(screen.getByText("Alpha")).toBeVisible();
  expect(screen.queryByText("Beta")).toBeNull();
});

it("keeps the card filter panel out of table presentation", () => {
  render(<Fixture mode="table" filtersOpen />);

  expect(
    screen.queryByRole("region", { name: "Column filters" }),
  ).toBeNull();

  expect(
    screen.getByRole("textbox", { name: "Name contains" }),
  ).toBeVisible();
});

it("provides ascending, descending, and clear sorting in card view", async () => {
  render(<Fixture />);

  const list = screen.getByRole("list");
  let cards = within(list).getAllByRole("listitem");

  expect(cards[0]).toHaveTextContent("Beta");
  expect(cards[1]).toHaveTextContent("Alpha");

  fireEvent.click(
    screen.getByRole("button", { name: "Sort card view" }),
  );

  fireEvent.click(
    await screen.findByRole("menuitem", {
      name: "Sort by Name, ascending",
    }),
  );

  await waitFor(() => {
    cards = within(list).getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("Alpha");
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Sort card view" }),
  );

  fireEvent.click(
    await screen.findByRole("menuitem", {
      name: "Sort by Name, descending",
    }),
  );

  await waitFor(() => {
    cards = within(list).getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("Beta");
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Sort card view" }),
  );

  fireEvent.click(
    await screen.findByRole("menuitem", {
      name: "Clear sorting",
    }),
  );

  await waitFor(() => {
    cards = within(list).getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("Beta");
    expect(cards[1]).toHaveTextContent("Alpha");
  });
});

it("does not expose the card sort action while table view is active", () => {
  render(<Fixture mode="table" />);

  expect(
    screen.queryByRole("button", { name: "Sort card view" }),
  ).toBeNull();
});
