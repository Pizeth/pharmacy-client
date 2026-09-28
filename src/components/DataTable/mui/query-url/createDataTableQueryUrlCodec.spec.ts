import {
  createDataTableServerQueryState,
} from "../server-state";
import {
  createDataTableQueryUrlCodec,
} from "./createDataTableQueryUrlCodec";

const defaultState =
  createDataTableServerQueryState(
    {
      pagination: {
        pageIndex:
          0,
        pageSize:
          25,
      },
      sorting:
        [],
      columnFilters:
        [],
      globalFilter:
        "",
    },
    25,
  );

const codec =
  createDataTableQueryUrlCodec({
    namespace:
      "dt",
    defaultState,
    fields: {
      sorting: {
        name:
          "name",
        category:
          "category",
      },
      filtering: {
        name: {
          field:
            "name",
          encode: (
            value,
          ) =>
            typeof value ===
            "string"
              ? value
              : undefined,
          decode: (
            value,
          ) =>
            typeof value ===
            "string"
              ? value
              : undefined,
        },
        category: {
          field:
            "categoryId",
          encode: (
            value,
          ) =>
            typeof value ===
              "number" &&
            Number.isInteger(
              value,
            ) &&
            value > 0
              ? value
              : undefined,
          decode: (
            value,
          ) =>
            typeof value ===
              "number" &&
            Number.isInteger(
              value,
            ) &&
            value > 0
              ? value
              : undefined,
        },
      },
    },
  });

describe(
  "createDataTableQueryUrlCodec",
  () => {
    it(
      "round-trips semantic query state with public field IDs and preserves unrelated params",
      () => {
        const params =
          codec.serialize(
            {
              pagination: {
                pageIndex:
                  2,
                pageSize:
                  50,
              },
              sorting: [
                {
                  id:
                    "category",
                  desc:
                    true,
                },
              ],
              columnFilters: [
                {
                  id:
                    "name",
                  value:
                    "auth",
                },
                {
                  id:
                    "category",
                  value:
                    2,
                },
              ],
              globalFilter:
                "login",
            },
            new URLSearchParams(
              "display=card",
            ),
          );

        expect(
          params.get(
            "display",
          ),
        ).toBe(
          "card",
        );

        expect(
          params.get(
            "dt.v",
          ),
        ).toBe(
          "1",
        );

        expect(
          JSON.parse(
            params.get(
              "dt.sort",
            ) ?? "[]",
          ),
        ).toEqual([
          {
            field:
              "category",
            direction:
              "desc",
          },
        ]);

        expect(
          JSON.parse(
            params.get(
              "dt.filters",
            ) ?? "[]",
          ),
        ).toEqual([
          {
            field:
              "name",
            value:
              "auth",
          },
          {
            field:
              "categoryId",
            value:
              2,
          },
        ]);

        expect(
          params.toString(),
        ).not.toContain(
          "%22id%22",
        );

        expect(
          codec.parse(
            params,
          ),
        ).toEqual({
          pagination: {
            pageIndex:
              2,
            pageSize:
              50,
          },
          sorting: [
            {
              id:
                "category",
              desc:
                true,
            },
          ],
          columnFilters: [
            {
              id:
                "name",
              value:
                "auth",
            },
            {
              id:
                "category",
              value:
                2,
            },
          ],
          globalFilter:
            "login",
        });
      },
    );

    it(
      "falls back safely for unsupported versions",
      () => {
        const params =
          new URLSearchParams();

        params.set(
          "dt.v",
          "2",
        );

        params.set(
          "dt.page",
          "9",
        );

        expect(
          codec.parse(
            params,
          ),
        ).toEqual(
          defaultState,
        );
      },
    );

    it(
      "sanitizes malformed values and unknown semantic fields independently",
      () => {
        const params =
          new URLSearchParams();

        params.set(
          "dt.v",
          "1",
        );

        params.set(
          "dt.page",
          "-5",
        );

        params.set(
          "dt.pageSize",
          "0",
        );

        params.set(
          "dt.sort",
          JSON.stringify([
            {
              field:
                "unknown",
              direction:
                "asc",
            },
            {
              field:
                "name",
              direction:
                "desc",
            },
            {
              field:
                "name",
              direction:
                "asc",
            },
          ]),
        );

        params.set(
          "dt.filters",
          JSON.stringify([
            {
              field:
                "categoryId",
              value:
                "not-a-number",
            },
            {
              field:
                "unknown",
              value:
                "ignored",
            },
            {
              field:
                "name",
              value:
                "safe",
            },
          ]),
        );

        params.set(
          "dt.search",
          "query",
        );

        expect(
          codec.parse(
            params,
          ),
        ).toEqual({
          pagination: {
            pageIndex:
              0,
            pageSize:
              25,
          },
          sorting: [
            {
              id:
                "name",
              desc:
                true,
            },
          ],
          columnFilters: [
            {
              id:
                "name",
              value:
                "safe",
            },
          ],
          globalFilter:
            "query",
        });
      },
    );

    it(
      "removes managed DataTable params when serializing the canonical default",
      () => {
        const current =
          codec.serialize(
            {
              ...defaultState,
              globalFilter:
                "temporary",
            },
            new URLSearchParams(
              "keep=yes",
            ),
          );

        const reset =
          codec.serialize(
            defaultState,
            current,
          );

        expect(
          reset.toString(),
        ).toBe(
          "keep=yes",
        );
      },
    );

    it(
      "does not serialize unmapped UI state",
      () => {
        const params =
          codec.serialize({
            ...defaultState,
            sorting: [
              {
                id:
                  "privateColumn",
                desc:
                  false,
              },
            ],
            columnFilters: [
              {
                id:
                  "privateFilter",
                value:
                  "secret",
              },
            ],
          });

        expect(
          JSON.parse(
            params.get(
              "dt.sort",
            ) ?? "[]",
          ),
        ).toEqual(
          [],
        );

        expect(
          JSON.parse(
            params.get(
              "dt.filters",
            ) ?? "[]",
          ),
        ).toEqual(
          [],
        );

        expect(
          params.toString(),
        ).not.toContain(
          "private",
        );
      },
    );

    it(
      "rejects duplicate public semantic field mappings",
      () => {
        expect(
          () =>
            createDataTableQueryUrlCodec(
              {
                defaultState,
                fields: {
                  sorting: {
                    first:
                      "name",
                    second:
                      "name",
                  },
                },
              },
            ),
        ).toThrow(
          'DataTable query URL sorting field "name" is mapped by multiple columns.',
        );
      },
    );
  },
);
