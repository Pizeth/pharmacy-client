"use client";

// src/features/i18n/translation-keys/refine/useTranslationKeyRefineDataTableServerResult.ts

import type {
  HttpError,
} from "@refinedev/core";

import {
  useRefineDataTableServerResult,
} from "@/components/DataTable/adapters/refine";
import type {
  RefineDataTableServerLifecycle,
  RefineDataTableUseListQueryOptions,
} from "@/components/DataTable/adapters/refine";
import type {
  DataTableServerQueryState,
} from "@/components/DataTable/mui/server-state";

import type {
  TranslationKey,
} from "../schemas";
import {
  translationKeyRefineDataTableAdapter,
} from "./translationKeyRefineDataTableAdapter";

export interface UseTranslationKeyRefineDataTableServerResultOptions {
  readonly queryOptions?:
    RefineDataTableUseListQueryOptions<
      TranslationKey,
      HttpError
    >;
}

/**
 * Resource-owned production Refine execution wrapper.
 *
 * Keeping this wrapper narrow gives TranslationKey one replaceable point for
 * Refine/TanStack Query execution tuning while the main table controller stays
 * transport-agnostic after it receives the normalized server lifecycle.
 */
export function useTranslationKeyRefineDataTableServerResult(
  query:
    DataTableServerQueryState,
  options:
    UseTranslationKeyRefineDataTableServerResultOptions =
      {},
): RefineDataTableServerLifecycle<TranslationKey> {
  return useRefineDataTableServerResult<
    TranslationKey,
    HttpError
  >({
    query,
    adapter:
      translationKeyRefineDataTableAdapter,
    queryOptions:
      options.queryOptions,
    keepPreviousResult:
      true,
  });
}
