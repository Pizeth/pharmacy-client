import type {
  DataTableServerQueryState,
} from "@/components/DataTable/mui/server-state";

import {
  TRANSLATION_KEY_COLUMN_IDS,
} from "../server";
import {
  TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME,
  TRANSLATION_KEY_REFINE_RESOURCE,
  TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY,
  translationKeyRefineDataTableAdapter,
} from "./translationKeyRefineDataTableAdapter";

describe(
  "TranslationKey production Refine DataTable adapter",
  () => {
    it(
      "keeps Refine query identity semantic while carrying the canonical Standard API request in provider metadata",
      () => {
        const query:
          DataTableServerQueryState =
          {
            pagination: {
              pageIndex:
                1,
              pageSize:
                25,
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
            ],
            globalFilter:
              "  Save  ",
          };

        const request =
          translationKeyRefineDataTableAdapter.createRequest(
            query,
          );

        expect(
          request,
        ).toMatchObject({
          resource:
            TRANSLATION_KEY_REFINE_RESOURCE,
          dataProviderName:
            TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME,
          pagination: {
            currentPage:
              2,
            pageSize:
              25,
            mode:
              "server",
          },
          sorters: [
            {
              field:
                "key",
              order:
                "desc",
            },
          ],
        });

        expect(
          request.filters,
        ).toEqual([
          {
            field:
              "categoryId",
            operator:
              "eq",
            value:
              2,
          },
          {
            operator:
              "or",
            value: [
              {
                field:
                  "key",
                operator:
                  "contains",
                value:
                  "Save",
              },
              {
                field:
                  "description",
                operator:
                  "contains",
                value:
                  "Save",
              },
              {
                field:
                  "category",
                operator:
                  "contains",
                value:
                  "Save",
              },
            ],
          },
        ]);

        /**
         * The actual Standard API request still sends only search.term.
         * Refine's public search fields never cross the HTTP boundary.
         */
        expect(
          request.meta?.[
            TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY
          ],
        ).toEqual({
          page:
            2,
          pageSize:
            25,
          sorting: [
            {
              field:
                "key",
              direction:
                "desc",
            },
          ],
          filters: [
            {
              field:
                "categoryId",
              operator:
                "equals",
              value:
                2,
            },
          ],
          search: {
            term:
              "Save",
          },
        });
      },
    );
  },
);
