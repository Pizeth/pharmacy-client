import { createTranslationInputSchema } from "./translationKey.schema";

describe("TranslationValue mutation schema", () => {
  it("distinguishes a missing locale from a malformed locale", () => {
    const missing = createTranslationInputSchema.safeParse({
      locale: "   ",
      value: "Email",
    });

    expect(missing.success).toBe(false);

    if (!missing.success) {
      expect(missing.error.issues[0]?.message).toBe("Choose a locale.");
    }

    const malformed = createTranslationInputSchema.safeParse({
      locale: "@@@",
      value: "Email",
    });

    expect(malformed.success).toBe(false);

    if (!malformed.success) {
      expect(malformed.error.issues[0]?.message).toBe(
        "Choose a valid locale.",
      );
    }
  });

  it("normalizes surrounding locale whitespace before transport", () => {
    const parsed = createTranslationInputSchema.safeParse({
      locale: "  en  ",
      value: "Email",
    });

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.locale).toBe("en");
    }
  });
});
