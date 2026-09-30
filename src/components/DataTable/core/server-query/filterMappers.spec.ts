import {
  createDataTableBooleanServerFilter,
  createDataTableExactTextServerFilter,
  createDataTableNumberRangeServerFilter,
  createDataTableNumberServerFilter,
  createDataTableSelectServerFilter,
  createDataTableTextServerFilter,
} from "./filterMappers";

describe("DataTable server filter mappers", () => {
  describe("createDataTableTextServerFilter", () => {
    const mapper = createDataTableTextServerFilter("key");

    it("creates a contains filter", () => {
      expect(mapper("login")).toEqual([
        {
          field: "key",
          operator: "contains",
          value: "login",
        },
      ]);
    });

    it("trims textual values", () => {
      expect(mapper("  login  ")).toEqual([
        {
          field: "key",
          operator: "contains",
          value: "login",
        },
      ]);
    });

    it("ignores empty text", () => {
      expect(mapper("   ")).toEqual([]);
    });

    it("ignores non-string values", () => {
      expect(mapper(123)).toEqual([]);
    });
  });

  describe("createDataTableExactTextServerFilter", () => {
    const mapper = createDataTableExactTextServerFilter("locale");

    it("creates an equals filter", () => {
      expect(mapper("en")).toEqual([
        {
          field: "locale",
          operator: "equals",
          value: "en",
        },
      ]);
    });

    it("normalizes surrounding whitespace", () => {
      expect(mapper("  km  ")).toEqual([
        {
          field: "locale",
          operator: "equals",
          value: "km",
        },
      ]);
    });

    it("ignores empty values", () => {
      expect(mapper("")).toEqual([]);
      expect(mapper("   ")).toEqual([]);
    });

    it("ignores non-string values", () => {
      expect(mapper(true)).toEqual([]);
    });
  });

  describe("createDataTableNumberServerFilter", () => {
    const mapper = createDataTableNumberServerFilter("categoryId");

    it("creates an equals number filter", () => {
      expect(mapper(2)).toEqual([
        {
          field: "categoryId",
          operator: "equals",
          value: 2,
        },
      ]);
    });

    it("rejects non-numeric values", () => {
      expect(mapper("2")).toEqual([]);
    });

    it("rejects non-finite numbers", () => {
      expect(mapper(Number.POSITIVE_INFINITY)).toEqual([]);
    });
  });

  describe("createDataTableBooleanServerFilter", () => {
    const mapper = createDataTableBooleanServerFilter("enabled");

    it("preserves true", () => {
      expect(mapper(true)).toEqual([
        {
          field: "enabled",
          operator: "equals",
          value: true,
        },
      ]);
    });

    it("preserves false", () => {
      expect(mapper(false)).toEqual([
        {
          field: "enabled",
          operator: "equals",
          value: false,
        },
      ]);
    });
  });

  describe("createDataTableSelectServerFilter", () => {
    const mapper = createDataTableSelectServerFilter("locale");

    it("supports string values", () => {
      expect(mapper("en")).toEqual([
        {
          field: "locale",
          operator: "equals",
          value: "en",
        },
      ]);
    });

    it("supports numeric values", () => {
      expect(mapper(5)).toEqual([
        {
          field: "locale",
          operator: "equals",
          value: 5,
        },
      ]);
    });

    it("supports boolean values", () => {
      expect(mapper(false)).toEqual([
        {
          field: "locale",
          operator: "equals",
          value: false,
        },
      ]);
    });

    it("rejects unsupported values", () => {
      expect(
        mapper({
          value: "en",
        }),
      ).toEqual([]);
    });
  });

  describe("createDataTableNumberRangeServerFilter", () => {
    const mapper = createDataTableNumberRangeServerFilter("age");

    it("creates both range boundaries", () => {
      expect(mapper([18, 65])).toEqual([
        {
          field: "age",
          operator: "gte",
          value: 18,
        },
        {
          field: "age",
          operator: "lte",
          value: 65,
        },
      ]);
    });

    it("supports only minimum", () => {
      expect(mapper([18, undefined])).toEqual([
        {
          field: "age",
          operator: "gte",
          value: 18,
        },
      ]);
    });

    it("supports only maximum", () => {
      expect(mapper([undefined, 65])).toEqual([
        {
          field: "age",
          operator: "lte",
          value: 65,
        },
      ]);
    });
  });
});
