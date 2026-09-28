import type {
  DataProvider,
} from "@refinedev/core";
import {
  Refine,
} from "@refinedev/core";
import {
  renderHook,
  waitFor,
} from "@testing-library/react";
import type {
  ReactNode,
} from "react";

import {
  queryTranslationKeys,
} from "../api";
import type {
  TranslationKey,
} from "../schemas";
import {
  TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,
} from "../server";
import {
  TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME,
} from "./translationKeyRefineDataTableAdapter";
import {
  translationKeyRefineDataProvider,
} from "./translationKeyRefineDataProvider";
import {
  useTranslationKeyRefineDataTableServerResult,
} from "./useTranslationKeyRefineDataTableServerResult";

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

const unsupported =
  async (): Promise<never> => {
    throw new Error(
      "Default Refine provider must not receive the TranslationKey DataTable request.",
    );
  };

const defaultProvider:
  DataProvider = {
    getList:
      unsupported as DataProvider["getList"],
    getOne:
      unsupported as DataProvider["getOne"],
    create:
      unsupported as DataProvider["create"],
    update:
      unsupported as DataProvider["update"],
    deleteOne:
      unsupported as DataProvider["deleteOne"],
    getApiUrl:
      () =>
        "https://default.example.test",
  };

function Wrapper(
  props: {
    readonly children:
      ReactNode;
  },
) {
  return (
    <Refine
      dataProvider={{
        default:
          defaultProvider,
        [TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME]:
          translationKeyRefineDataProvider,
      }}
      options={{
        disableTelemetry:
          true,
      }}
    >
      {
        props.children
      }
    </Refine>
  );
}

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
          1,
        pageSize:
          25,
        totalItems:
          1,
        totalPages:
          1,
        hasNextPage:
          false,
        hasPreviousPage:
          false,
      },
    },
  });
});

describe(
  "TranslationKey production Refine integration",
  () => {
    it(
      "selects the named provider and exposes the generic DataTable server lifecycle",
      async () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useTranslationKeyRefineDataTableServerResult(
                TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,
                {
                  queryOptions: {
                    retry:
                      false,
                  },
                },
              ),
            {
              wrapper:
                Wrapper,
            },
          );

        await waitFor(
          () => {
            expect(
              result.current
                .server
                .hasResult,
            ).toBe(
              true,
            );
          },
        );

        expect(
          query,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          result.current
            .server
            .rows,
        ).toEqual([
          row,
        ]);

        expect(
          result.current
            .server
            .pagination,
        ).toEqual({
          pageIndex:
            0,
          pageSize:
            25,
          rowCount:
            1,
          pageCount:
            1,
          hasNextPage:
            false,
          hasPreviousPage:
            false,
        });
      },
    );
  },
);
