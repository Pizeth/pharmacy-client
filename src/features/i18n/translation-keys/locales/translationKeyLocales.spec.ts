import { getTranslationKeyLocaleColor } from "./translationKeyLocales";
it("keeps English and Khmer tones distinct and stable across locale order and regional variants", () => {
  expect(getTranslationKeyLocaleColor("en")).toBe("primary");
  expect(getTranslationKeyLocaleColor("km")).toBe("secondary");
  expect(["km", "en"].map(getTranslationKeyLocaleColor)).toEqual(["secondary", "primary"]);
  expect(getTranslationKeyLocaleColor("en-GB")).toBe("primary");
  expect(getTranslationKeyLocaleColor("fr")).toBe(getTranslationKeyLocaleColor("fr"));
});
