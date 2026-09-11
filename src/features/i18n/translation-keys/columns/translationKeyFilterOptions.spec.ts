import {
  createTranslationKeyCategoryFilterOptions,
  TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
} from "./translationKeyFilterOptions";

describe("TranslationKey filter options", () => {
  describe("createTranslationKeyCategoryFilterOptions", () => {
    it("uses category name as label and category id as value", () => {
      const options = createTranslationKeyCategoryFilterOptions([
        {
          id: 1,
          name: "common",
          description: "Common application text",
        },
        {
          id: 2,
          name: "auth",
          description: "Authentication text",
        },
      ]);

      expect(options).toEqual([
        {
          label: "common",
          value: 1,
        },
        {
          label: "auth",
          value: 2,
        },
      ]);
    });

    it("supports an empty category collection", () => {
      expect(createTranslationKeyCategoryFilterOptions([])).toEqual([]);
    });

    // it("preserves the API category order", () => {
    //   const options = createTranslationKeyCategoryFilterOptions([
    //     {
    //       id: 5,
    //       name: "validation",
    //       description: null,
    //     },
    //     {
    //       id: 3,
    //       name: "navigation",
    //       description: null,
    //     },
    //   ]);

    //   expect(options.map((option) => option.value)).toEqual([5, 3]);
    // });

    it("sorts category options alphabetically by label", () => {
      const options = createTranslationKeyCategoryFilterOptions([
        {
          id: 5,
          name: "validation",
          description: null,
        },
        {
          id: 2,
          name: "auth",
          description: null,
        },
        {
          id: 3,
          name: "navigation",
          description: null,
        },
      ]);

      expect(options).toEqual([
        {
          label: "auth",
          value: 2,
        },
        {
          label: "navigation",
          value: 3,
        },
        {
          label: "validation",
          value: 5,
        },
      ]);
    });
  });

  describe("TRANSLATION_KEY_LOCALE_FILTER_OPTIONS", () => {
    it("contains the currently supported TranslationKey locales", () => {
      expect(TRANSLATION_KEY_LOCALE_FILTER_OPTIONS).toEqual([
        {
          label: "English",
          value: "en",
        },
        {
          label: "Khmer",
          value: "km",
        },
      ]);
    });
  });
});
