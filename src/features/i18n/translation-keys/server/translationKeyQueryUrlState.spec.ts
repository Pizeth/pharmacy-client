import {
  TRANSLATION_KEY_COLUMN_IDS,
  TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,
  translationKeyQueryUrlCodec,
} from ".";

describe(
  "TranslationKey shareable query URL state",
  () => {
    it(
      "uses the resource public semantic categoryId field while restoring the UI category column",
      () => {
        const params =
          translationKeyQueryUrlCodec.serialize(
            {
              ...TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,
              pagination: {
                pageIndex:
                  1,
                pageSize:
                  50,
              },
              sorting: [
                {
                  id:
                    TRANSLATION_KEY_COLUMN_IDS.key,
                  desc:
                    true,
                },
              ],
              columnFilters: [
                {
                  id:
                    TRANSLATION_KEY_COLUMN_IDS.category,
                  value:
                    2,
                },
                {
                  id:
                    TRANSLATION_KEY_COLUMN_IDS.locale,
                  value:
                    "km",
                },
              ],
              globalFilter:
                "auth",
            },
          );

        expect(
          JSON.parse(
            params.get(
              "dt.filters",
            ) ?? "[]",
          ),
        ).toEqual([
          {
            field:
              "categoryId",
            value:
              2,
          },
          {
            field:
              "locale",
            value:
              "km",
          },
        ]);

        expect(
          translationKeyQueryUrlCodec.parse(
            params,
          ),
        ).toEqual({
          pagination: {
            pageIndex:
              1,
            pageSize:
              50,
          },
          sorting: [
            {
              id:
                TRANSLATION_KEY_COLUMN_IDS.key,
              desc:
                true,
            },
          ],
          columnFilters: [
            {
              id:
                TRANSLATION_KEY_COLUMN_IDS.category,
              value:
                2,
            },
            {
              id:
                TRANSLATION_KEY_COLUMN_IDS.locale,
              value:
                "km",
            },
          ],
          globalFilter:
            "auth",
        });
      },
    );

    it(
      "rejects an invalid category value without disturbing other query families",
      () => {
        const params =
          new URLSearchParams();

        params.set(
          "dt.v",
          "1",
        );
        params.set(
          "dt.page",
          "2",
        );
        params.set(
          "dt.pageSize",
          "25",
        );
        params.set(
          "dt.sort",
          "[]",
        );
        params.set(
          "dt.filters",
          JSON.stringify([
            {
              field:
                "categoryId",
              value:
                "2",
            },
            {
              field:
                "locale",
              value:
                "en",
            },
          ]),
        );
        params.set(
          "dt.search",
          "common",
        );

        expect(
          translationKeyQueryUrlCodec.parse(
            params,
          ),
        ).toEqual({
          pagination: {
            pageIndex:
              1,
            pageSize:
              25,
          },
          sorting:
            [],
          columnFilters: [
            {
              id:
                TRANSLATION_KEY_COLUMN_IDS.locale,
              value:
                "en",
            },
          ],
          globalFilter:
            "common",
        });
      },
    );
  },
);
