import { createTranslationKeyColumns } from "./translationKeyColumns";
import { TRANSLATION_KEY_COLUMN_IDS } from "../server";
import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";
import { DATA_TABLE_SELECTION_COLUMN_ID } from "@/components/DataTable/mui/columns/selection";
import {
  DATA_TABLE_ACTIONS_COLUMN_ID,
  type DataTableRowAction,
} from "@/components/DataTable/mui/columns/actions";
import type { TranslationKey } from "../schemas";

describe("TranslationKey columns", () => {
  const categoryFilterOptions = [
    {
      label: "auth",
      value: 2,
    },
    {
      label: "common",
      value: 1,
    },
  ] as const;

  const localeFilterOptions = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Khmer",
      value: "km",
    },
  ] as const;

  const columns = createTranslationKeyColumns({
    categoryFilterOptions,
    localeFilterOptions,
  });

  function getColumn(id: string) {
    const column = columns.find((candidate) => candidate.id === id);

    if (!column) {
      throw new Error(`TranslationKey column "${id}" was not found.`);
    }

    return column;
  }

  it("defines the presentation-only row-number column", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.rowNumber);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(false);

    expect(column.enableHiding).toBe(false);

    expect(column.enableResizing).toBe(false);

    expect(column.meta?.enableColumnMenu).toBe(false);

    expect(column.meta?.align).toBe("center");

    expect(column.meta?.headerAlign).toBe("center");
  });

  it("adds the generic expansion utility column only when translation details are enabled", () => {
    expect(
      columns.find((column) => column.id === DATA_TABLE_EXPANSION_COLUMN_ID),
    ).toBeUndefined();

    const withDetails = createTranslationKeyColumns({
      categoryFilterOptions,
      localeFilterOptions,
      enableTranslationDetails: true,
    });

    const expansion = withDetails.find(
      (column) => column.id === DATA_TABLE_EXPANSION_COLUMN_ID,
    );

    expect(expansion).toBeDefined();

    expect(expansion?.enableSorting).toBe(false);

    expect(expansion?.enableColumnFilter).toBe(false);

    expect(expansion?.enableGlobalFilter).toBe(false);

    expect(expansion?.enableHiding).toBe(false);

    expect(expansion?.enableResizing).toBe(false);

    expect(expansion?.meta?.enableColumnMenu).toBe(false);

    expect(expansion?.meta?.align).toBe("center");
  });

  it("adds the generic selection utility column only when row selection is enabled", () => {
    expect(
      columns.find((column) => column.id === DATA_TABLE_SELECTION_COLUMN_ID),
    ).toBeUndefined();

    const selectable = createTranslationKeyColumns({
      categoryFilterOptions,
      localeFilterOptions,
      enableRowSelection: true,
    });

    const selection = selectable.find(
      (column) => column.id === DATA_TABLE_SELECTION_COLUMN_ID,
    );

    expect(selection).toBeDefined();
    expect(selection?.size).toBe(48);
    expect(selection?.enableSorting).toBe(false);
    expect(selection?.enableColumnFilter).toBe(false);
    expect(selection?.enableGlobalFilter).toBe(false);
    expect(selection?.enableHiding).toBe(false);
    expect(selection?.enableResizing).toBe(false);
    expect(selection?.enablePinning).toBe(true);
    expect(selection?.meta?.enableColumnMenu).toBe(false);
    expect(selection?.meta?.align).toBe("center");
    expect(selection?.meta?.headerAlign).toBe("center");
  });

  it("gives resource utility columns readable headers and enough action capacity", () => {
    const rowActions: readonly DataTableRowAction<TranslationKey>[] = [
      {
        id: "edit",
        label: "Edit",
        inline: true,
        onClick: () => undefined,
      },
      {
        id: "delete",
        label: "Delete",
        onClick: () => undefined,
      },
    ];

    const current = createTranslationKeyColumns({
      categoryFilterOptions,
      localeFilterOptions,
      rowActions,
      enableTranslationDetails: true,
    });

    const expansion = current.find(
      (column) => column.id === DATA_TABLE_EXPANSION_COLUMN_ID,
    );

    const actions = current.find(
      (column) => column.id === DATA_TABLE_ACTIONS_COLUMN_ID,
    );

    expect(expansion?.header).toBe("Details");
    expect(expansion?.size).toBe(72);
    expect(expansion?.meta?.label).toBe("Details");

    expect(actions?.header).toBe("Actions");
    expect(actions?.size).toBe(104);
    expect(actions?.meta?.label).toBe("Actions");
  });

  it("configures Key as sortable text filtering", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.key);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("text");

    expect(column.meta?.filterLabel).toBe("Key contains");
  });

  it("configures Description as filterable but not sortable", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.description);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("text");
  });

  it("configures Category as a numeric-value select filter", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.category);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("select");

    expect(column.meta?.filterOptions).toEqual(categoryFilterOptions);

    /**
     * This is the important part:
     *
     * labels are category names,
     * values are category IDs.
     */
    expect(column.meta?.filterOptions).toContainEqual({
      label: "auth",
      value: 2,
    });
  });

  it("configures Locale as an exact scalar select filter", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.locale);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("select");

    expect(column.meta?.filterOptions).toEqual(localeFilterOptions);
  });

  it.each([
    { fetching: true, error: undefined, disabled: false, message: undefined },
    {
      fetching: false,
      error: new Error("private transport details"),
      disabled: true,
      message: "Category options could not be loaded.",
    },
    { fetching: false, error: undefined, disabled: false, message: undefined },
  ])(
    "keeps option lifecycle local to Category ($fetching, $disabled)",
    ({ fetching, error, disabled, message }) => {
      const current = createTranslationKeyColumns({
        categoryFilterOptions,
        localeFilterOptions,
        categoryFilterOptionsFetching: fetching,
        categoryFilterOptionsError: error,
      });
      const category = current.find(
        (column) => column.id === TRANSLATION_KEY_COLUMN_IDS.category,
      )!;
      expect(category.meta).toMatchObject({
        filterOptionsLoading: fetching,
        filterDisabled: disabled,
        filterOptionsError: message,
        filterOptions: categoryFilterOptions,
      });
      expect(category.enableColumnFilter).toBe(true);
      for (const column of current.filter(
        (column) => column.id !== TRANSLATION_KEY_COLUMN_IDS.category,
      )) {
        expect(column.meta?.filterDisabled).toBeUndefined();
        expect(column.meta?.filterOptionsLoading).toBeUndefined();
        expect(column.meta?.filterOptionsError).toBeUndefined();
      }
    },
  );

  it("keeps the Translations preview presentation-only", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.translations);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(false);
  });

  it.each([
    TRANSLATION_KEY_COLUMN_IDS.createdAt,
    TRANSLATION_KEY_COLUMN_IDS.updatedAt,
  ])("allows server sorting but not date filtering for %s", (columnId) => {
    const column = getColumn(columnId);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(false);
  });
});
