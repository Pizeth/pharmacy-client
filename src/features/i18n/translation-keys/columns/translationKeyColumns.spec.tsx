import { createTranslationKeyColumns } from "./translationKeyColumns";

import { TRANSLATION_KEY_COLUMN_IDS } from "../server";

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
