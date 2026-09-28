// src/features/i18n/translation-keys/refine/translationKeyRefineDataProvider.ts

import type {
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";

import type {
  StandardApiDataTableFilter,
  StandardApiDataTableQueryRequest,
  StandardApiDataTableSort,
} from "@/components/DataTable/adapters/standard-api";
import {
  API_URL,
} from "@/types/constants";

import {
  queryTranslationKeys,
} from "../api";
import type {
  TranslationKey,
} from "../schemas";
import {
  translationKeyStandardResponseAdapter,
} from "../server/translationKeyDataTableServerAdapter";
import {
  TRANSLATION_KEY_REFINE_RESOURCE,
  TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY,
} from "./translationKeyRefineDataTableAdapter";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function isPositiveSafeInteger(
  value: unknown,
): value is number {
  return (
    typeof value ===
      "number" &&
    Number.isSafeInteger(
      value,
    ) &&
    value >
      0
  );
}

function isFilterScalar(
  value: unknown,
): value is
  | string
  | number
  | boolean {
  return (
    typeof value ===
      "string" ||
    typeof value ===
      "boolean" ||
    (
      typeof value ===
        "number" &&
      Number.isFinite(
        value,
      )
    )
  );
}

function isStandardApiSort(
  value: unknown,
): value is StandardApiDataTableSort {
  return (
    isRecord(
      value,
    ) &&
    typeof value.field ===
      "string" &&
    (
      value.direction ===
        "asc" ||
      value.direction ===
        "desc"
    )
  );
}

function isStandardApiFilter(
  value: unknown,
): value is StandardApiDataTableFilter {
  if (
    !isRecord(
      value,
    ) ||
    typeof value.field !==
      "string" ||
    typeof value.operator !==
      "string"
  ) {
    return false;
  }

  switch (
    value.operator
  ) {
    case "equals":
      return isFilterScalar(
        value.value,
      );

    case "contains":
      return typeof value.value ===
        "string";

    case "gte":
    case "lte":
      return (
        typeof value.value ===
          "number" &&
        Number.isFinite(
          value.value,
        )
      );

    case "in":
      return (
        Array.isArray(
          value.value,
        ) &&
        value.value.every(
          isFilterScalar,
        )
      );

    default:
      return false;
  }
}

/**
 * Runtime validation at the provider boundary.
 *
 * The metadata is normally produced by
 * translationKeyRefineDataTableAdapter. Treating it as unknown here prevents a
 * manually constructed Refine request from smuggling an arbitrary object into
 * the Standard API executor.
 */
export function isTranslationKeyStandardApiQueryRequest(
  value: unknown,
): value is StandardApiDataTableQueryRequest {
  if (
    !isRecord(
      value,
    ) ||
    !isPositiveSafeInteger(
      value.page,
    ) ||
    !isPositiveSafeInteger(
      value.pageSize,
    ) ||
    !Array.isArray(
      value.sorting,
    ) ||
    !value.sorting.every(
      isStandardApiSort,
    ) ||
    !Array.isArray(
      value.filters,
    ) ||
    !value.filters.every(
      isStandardApiFilter,
    )
  ) {
    return false;
  }

  if (
    value.search ===
      undefined
  ) {
    return true;
  }

  return (
    isRecord(
      value.search,
    ) &&
    typeof value.search.term ===
      "string"
  );
}

function readStandardApiRequest(
  params:
    GetListParams,
): StandardApiDataTableQueryRequest {
  const request =
    params.meta?.[
      TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY
    ];

  if (
    !isTranslationKeyStandardApiQueryRequest(
      request,
    )
  ) {
    throw new Error(
      "TranslationKey Refine provider requires a valid canonical Standard API DataTable request in provider metadata.",
    );
  }

  return request;
}

/**
 * Named production Refine DataProvider for TranslationKey list execution.
 *
 * It intentionally supports only the list lifecycle used by the DataTable.
 * TranslationKey/TranslationValue mutations continue through their explicit
 * resource API functions, which already own validation, dialogs, error
 * handling and post-mutation refresh policy.
 */
export function createTranslationKeyRefineDataProvider(): DataProvider {
  const getList =
    async (
      params:
        GetListParams,
    ): Promise<
      GetListResponse<TranslationKey>
    > => {
      if (
        params.resource !==
        TRANSLATION_KEY_REFINE_RESOURCE
      ) {
        throw new Error(
          `TranslationKey Refine provider cannot serve resource "${params.resource}".`,
        );
      }

      const request =
        readStandardApiRequest(
          params,
        );

      const response =
        await queryTranslationKeys(
          request,
        );

      const normalized =
        translationKeyStandardResponseAdapter.readResponse(
          response,
        );

      return {
        data:
          normalized.rows,
        total:
          normalized.pagination
            .rowCount,
      };
    };

  const unsupported =
    async (): Promise<never> => {
      throw new Error(
        "TranslationKey named Refine provider supports only the DataTable getList lifecycle. Resource mutations use the explicit TranslationKey API.",
      );
    };

  return {
    getList:
      getList as DataProvider["getList"],
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
        `${API_URL.replace(/\/+$/, "")}/api/v1/i18n/keys/query`,
  };
}

export const translationKeyRefineDataProvider =
  createTranslationKeyRefineDataProvider();
