import type {
  GetListParams,
} from "@refinedev/core";

import {
  queryTranslationKeys,
} from "../api";
import type {
  TranslationKey,
} from "../schemas";
import {
  TRANSLATION_KEY_REFINE_RESOURCE,
  TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY,
} from "./translationKeyRefineDataTableAdapter";
import {
  createTranslationKeyRefineDataProvider,
} from "./translationKeyRefineDataProvider";

jest.mock(
  "../api",
  () => ({
    queryTranslationKeys:
      jest.fn(),
  }),
);

const query =
  queryTranslationKeys as jest.MockedFunction<
    typeof queryTranslationKeys
  >;

const row:
  TranslationKey = {
    id:
      31,
    key:
      "auth.login.title",
    description:
      "Login title",
    categoryId:
      1,
    createdAt:
      "2026-09-01T00:00:00.000Z",
    updatedAt:
      "2026-09-01T00:00:00.000Z",
    translationCategory: {
      id:
        1,
      name:
        "auth",
      description:
        null,
    },
    translations:
      [],
  };

beforeEach(() => {
  jest.resetAllMocks();

  query.mockResolvedValue({
    requestStatus:
      "SUCCESS",
    statusCode:
      200,
    statusText:
      "OK",
    data: {
      data: [
        row,
      ],
      metadata: {
        currentPage:
          2,
        pageSize:
          25,
        totalItems:
          60,
        totalPages:
          3,
        hasNextPage:
          true,
        hasPreviousPage:
          true,
      },
    },
  });
});

describe(
  "TranslationKey named Refine provider",
  () => {
    it(
      "executes the canonical Standard API POST query contract and returns Refine list data",
      async () => {
        const provider =
          createTranslationKeyRefineDataProvider();

        const standardRequest = {
          page:
            2,
          pageSize:
            25,
          sorting: [
            {
              field:
                "key",
              direction:
                "asc" as const,
            },
          ],
          filters:
            [],
          search: {
            term:
              "auth",
          },
        };

        const result =
          await provider.getList<
            TranslationKey
          >({
            resource:
              TRANSLATION_KEY_REFINE_RESOURCE,
            pagination: {
              currentPage:
                2,
              pageSize:
                25,
              mode:
                "server",
            },
            sorters:
              [],
            filters:
              [],
            meta: {
              [TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY]:
                standardRequest,
            },
          });

        expect(
          query,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          query,
        ).toHaveBeenCalledWith(
          standardRequest,
        );

        expect(
          result,
        ).toEqual({
          data: [
            row,
          ],
          total:
            60,
        });
      },
    );

    it(
      "rejects missing/invalid provider metadata before executing the API",
      async () => {
        const provider =
          createTranslationKeyRefineDataProvider();

        const params: GetListParams =
          {
            resource:
              TRANSLATION_KEY_REFINE_RESOURCE,
            pagination: {
              currentPage:
                1,
              pageSize:
                25,
              mode:
                "server",
            },
            sorters:
              [],
            filters:
              [],
            meta: {
              [TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY]:
                {
                  page:
                    Number.MAX_VALUE,
                },
            },
          };

        await expect(
          provider.getList(
            params,
          ),
        ).rejects.toThrow(
          "requires a valid canonical Standard API DataTable request",
        );

        expect(
          query,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects an unrelated Refine resource",
      async () => {
        const provider =
          createTranslationKeyRefineDataProvider();

        await expect(
          provider.getList({
            resource:
              "documents",
            pagination: {
              currentPage:
                1,
              pageSize:
                25,
              mode:
                "server",
            },
            sorters:
              [],
            filters:
              [],
            meta: {
              [TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY]:
                {
                  page:
                    1,
                  pageSize:
                    25,
                  sorting:
                    [],
                  filters:
                    [],
                },
            },
          }),
        ).rejects.toThrow(
          'cannot serve resource "documents"',
        );

        expect(
          query,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
