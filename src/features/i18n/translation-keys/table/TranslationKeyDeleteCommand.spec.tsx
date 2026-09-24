import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { DataTableRowAction } from "@/components/DataTable";
import type { TranslationKey } from "../schemas";
import { deleteTranslationKey } from "../api";
import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";
import { TranslationKeyTable } from "./TranslationKeyTable";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  deleteTranslationKey: jest.fn(),
}));
jest.mock("./useTranslationKeyDataTable", () => ({
  useTranslationKeyDataTable: jest.fn(),
}));
jest.mock("../forms/TranslationKeyCreateDialog", () => ({
  TranslationKeyCreateDialog: () => null,
}));
jest.mock("../forms/TranslationKeyEditDialog", () => ({
  TranslationKeyEditDialog: () => null,
}));
// Exercise resource command orchestration without coupling to generated table DOM.
jest.mock("@/components/DataTable", () => ({
  DataTable: ({
    table,
  }: {
    table: {
      actions: readonly DataTableRowAction<TranslationKey>[];
      record: TranslationKey;
      setRowSelection: jest.Mock;
    };
  }) => (
    <button
      onClick={() =>
        table.actions
          .find((action) => action.id === "delete")!
          .onClick({ row: { original: table.record } } as never)
      }
    >
      Delete row
    </button>
  ),
}));

const record: TranslationKey = {
  id: 31,
  key: "sequence_test",
  description: null,
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: { id: 1, name: "common", description: null },
  translations: [],
};
const remove = deleteTranslationKey as jest.Mock;
const controller = useTranslationKeyDataTable as jest.Mock;
const refresh = jest.fn();
const paginate = jest.fn();
const setRowSelection = jest.fn();
const queryState = {
  pagination: { pageIndex: 2, pageSize: 10 },
  sorting: [{ id: "key", desc: true }],
  columnFilters: [{ id: "category", value: 1 }],
  globalFilter: "test",
};

function setup(rows: TranslationKey[], pageIndex = 2) {
  controller.mockImplementation(({ rowActions }) => ({
    table: {
      actions: rowActions,
      record,
      setRowSelection,
    },
    query: {
      state: {
        ...queryState,
        pagination: { ...queryState.pagination, pageIndex },
      },
      onPaginationChange: paginate,
    },
    server: { rows, isInitialLoading: false, isRefreshing: false },
    filterOptions: {},
    refresh,
  }));
  remove.mockResolvedValue({ data: { id: record.id, key: record.key } });
  render(<TranslationKeyTable />);
}

beforeEach(() => {
  jest.resetAllMocks();
});

it("only opens confirmation from the row action and refreshes after successful deletion", async () => {
  setup([record, { ...record, id: 32 }]);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  expect(remove).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(setRowSelection).toHaveBeenCalledTimes(1);

  const selectionUpdater = setRowSelection.mock.calls[0][0] as (
    previous: Record<string, boolean>,
  ) => Record<string, boolean>;

  expect(
    selectionUpdater({
      [String(record.id)]: true,
      "99": true,
    }),
  ).toEqual({
    "99": true,
  });

  expect(paginate).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Deleted translation key: sequence_test",
  );
});

it("moves back one page when deleting the sole row on a later page, without a duplicate refresh", async () => {
  setup([record]);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(paginate).toHaveBeenCalledTimes(1));
  expect(paginate.mock.calls[0][0](queryState.pagination)).toEqual({
    pageIndex: 1,
    pageSize: 10,
  });
  expect(refresh).not.toHaveBeenCalled();
});

it("refreshes page zero after deleting its final row", async () => {
  setup([record], 0);
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(paginate).not.toHaveBeenCalled();
});

it("does not refresh or navigate on a failed deletion", async () => {
  setup([record]);
  remove.mockRejectedValue(new Error("Forbidden"));
  fireEvent.click(screen.getByRole("button", { name: "Delete row" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Forbidden");
  expect(refresh).not.toHaveBeenCalled();
  expect(paginate).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
