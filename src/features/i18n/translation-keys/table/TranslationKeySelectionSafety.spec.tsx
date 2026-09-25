import { fireEvent, render, screen } from "@testing-library/react";

import type {
  DataTableBulkAction,
  DataTableRowAction,
  DataTableSelectionContext,
} from "@/components/DataTable";

import type { TranslationKey } from "../schemas";

import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";
import { TranslationKeyTable } from "./TranslationKeyTable";

jest.mock("./useTranslationKeyDataTable", () => ({
  useTranslationKeyDataTable: jest.fn(),
}));

jest.mock("../forms", () => ({
  TranslationKeyCreateDialog: () => null,
  TranslationKeyEditDialog: ({
    record,
  }: {
    record: TranslationKey | null;
  }) =>
    record ? (
      <div role="dialog" aria-label="Edit translation key">
        {record.key}
      </div>
    ) : null,
  TranslationKeyDeleteDialog: ({
    record,
  }: {
    record: TranslationKey | null;
  }) =>
    record ? (
      <div role="dialog" aria-label="Delete translation key">
        {record.key}
      </div>
    ) : null,
  TranslationValueCreateDialog: () => null,
  TranslationValueEditDialog: () => null,
  TranslationValueDeleteDialog: () => null,
}));

jest.mock("@/components/DataTable", () => ({
  DataTable: ({
    table,
    selectionBar,
  }: {
    table: {
      actions: readonly DataTableRowAction<TranslationKey>[];
      record: TranslationKey;
    };
    selectionBar: {
      actions: readonly DataTableBulkAction<TranslationKey>[];
      renderStartContent?: (
        context: DataTableSelectionContext<TranslationKey>,
      ) => React.ReactNode;
    };
  }) => {
    const selectedRow = {
      id: String(table.record.id),
      original: table.record,
      getIsSelected: () => true,
    };

    const unselectedRow = {
      id: String(table.record.id),
      original: table.record,
      getIsSelected: () => false,
    };

    const rowTable = {} as never;

    const selectedContext = {
      table: rowTable,
      row: selectedRow,
    } as never;

    const unselectedContext = {
      table: rowTable,
      row: unselectedRow,
    } as never;

    const oneSelectedContext: DataTableSelectionContext<TranslationKey> = {
      table: rowTable,
      selectedRowIds: [String(table.record.id)],
      selectedRows: [selectedRow] as never,
      selectedCount: 1,
    };

    const secondRow = {
      ...selectedRow,
      id: "32",
      original: {
        ...table.record,
        id: 32,
        key: "second_key",
      },
    };

    const manySelectedContext: DataTableSelectionContext<TranslationKey> = {
      table: rowTable,
      selectedRowIds: [String(table.record.id), "32"],
      selectedRows: [selectedRow, secondRow] as never,
      selectedCount: 2,
    };

    const oneSelectedStart =
      selectionBar.renderStartContent?.(oneSelectedContext);

    const manySelectedStart =
      selectionBar.renderStartContent?.(manySelectedContext);

    return (
      <>
        <div data-testid="one-selected-start">
          {oneSelectedStart}
        </div>

        <div data-testid="many-selected-start">
          {manySelectedStart}
        </div>

        {table.actions.map((action) => (
          <div key={action.id}>
            <button
              type="button"
              aria-label={`${action.label} unselected row`}
              disabled={action.isDisabled?.(unselectedContext) ?? false}
              onClick={() => action.onClick(unselectedContext)}
            >
              {action.label}
            </button>

            <button
              type="button"
              aria-label={`${action.label} selected row`}
              disabled={action.isDisabled?.(selectedContext) ?? false}
              onClick={() => action.onClick(selectedContext)}
            >
              {action.label}
            </button>
          </div>
        ))}

        {selectionBar.actions.map((action) => (
          <div key={action.id}>
            <button
              type="button"
              aria-label={`${action.label} one selected`}
              disabled={
                action.isDisabled?.(oneSelectedContext) ?? false
              }
              onClick={() => action.onClick(oneSelectedContext)}
            >
              {action.label}
            </button>

            <button
              type="button"
              aria-label={`${action.label} many selected`}
              disabled={
                action.isDisabled?.(manySelectedContext) ?? false
              }
              onClick={() => action.onClick(manySelectedContext)}
            >
              {action.label}
            </button>
          </div>
        ))}
      </>
    );
  },
}));

const controller = useTranslationKeyDataTable as jest.Mock;

const record: TranslationKey = {
  id: 31,
  key: "sequence_test",
  description: null,
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: {
    id: 1,
    name: "common",
    description: null,
  },
  translations: [],
};

beforeEach(() => {
  jest.resetAllMocks();

  controller.mockImplementation(({ rowActions }) => ({
    table: {
      actions: rowActions,
      record,
      setRowSelection: jest.fn(),
    },
    query: {
      state: {
        pagination: {
          pageIndex: 0,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      },
      onPaginationChange: jest.fn(),
    },
    server: {
      rows: [record],
      isInitialLoading: false,
      isRefreshing: false,
    },
    filterOptions: {},
    refresh: jest.fn(),
  }));
});

describe("TranslationKey row-selection mutation safety", () => {
  it("opts the resource into generic row selection", () => {
    render(<TranslationKeyTable />);

    expect(controller).toHaveBeenCalledWith(
      expect.objectContaining({
        enableRowSelection: true,
      }),
    );
  });

  it("disables Edit and Delete row commands until that row is selected", () => {
    render(<TranslationKeyTable />);

    expect(
      screen.getByRole("button", {
        name: "Edit unselected row",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Delete unselected row",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Edit selected row",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Delete selected row",
      }),
    ).toBeEnabled();
  });

  it("opens the existing edit command only for the explicitly selected row", () => {
    render(<TranslationKeyTable />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit selected row",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Edit translation key",
      }),
    ).toHaveTextContent(record.key);
  });

  it("shows the selected TranslationKey identity only for a single loaded selection", () => {
    render(<TranslationKeyTable />);

    expect(
      screen.getByTestId("one-selected-start"),
    ).toHaveTextContent(record.key);

    expect(
      screen.getByTestId("many-selected-start"),
    ).toBeEmptyDOMElement();
  });

  it("reuses the footer selection surface and allows mutations only for exactly one loaded row", () => {
    render(<TranslationKeyTable />);

    expect(
      screen.getByRole("button", {
        name: "Edit selected one selected",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Delete selected one selected",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Edit selected many selected",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Delete selected many selected",
      }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete selected one selected",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Delete translation key",
      }),
    ).toHaveTextContent(record.key);
  });
});
