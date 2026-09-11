import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";

describe("DataTable select filter value codec", () => {
  it("preserves string values", () => {
    const encoded = encodeDataTableSelectFilterValue("auth");

    expect(encoded).toBe("string:auth");

    expect(decodeDataTableSelectFilterValue(encoded)).toBe("auth");
  });

  it("preserves numeric values", () => {
    const encoded = encodeDataTableSelectFilterValue(12);

    expect(encoded).toBe("number:12");

    expect(decodeDataTableSelectFilterValue(encoded)).toBe(12);
  });

  it("preserves true", () => {
    expect(
      decodeDataTableSelectFilterValue(encodeDataTableSelectFilterValue(true)),
    ).toBe(true);
  });

  it("preserves false", () => {
    expect(
      decodeDataTableSelectFilterValue(encodeDataTableSelectFilterValue(false)),
    ).toBe(false);
  });

  it("distinguishes numeric 1 from textual 1", () => {
    expect(encodeDataTableSelectFilterValue(1)).not.toBe(
      encodeDataTableSelectFilterValue("1"),
    );
  });
});
