// src/features/i18n/translation-keys/api/translationKeyApi.ts

import type { StandardApiDataTableQueryRequest } from "@/components/DataTable/adapters";
import {
  deleteTranslationKeyResponseSchema,
  deleteTranslationResponseSchema,
  translationCategoriesResponseSchema,
  translationKeyQueryResponseSchema,
  translationKeyResponseSchema,
  translationValueResponseSchema,
} from "../schemas";
import type {
  CreateTranslationInput,
  CreateTranslationKeyInput,
  TranslationKey,
  TranslationValue,
  UpdateTranslationInput,
  UpdateTranslationKeyInput,
} from "../schemas";
import type {
  DeleteTranslationKeyResponse,
  DeleteTranslationResponse,
  TranslationCategoriesResponse,
  TranslationKeyQueryResponse,
  TranslationKeyResponse,
  TranslationValueResponse,
} from "../types";
import { API_URL } from "@/types/constants";

/**
 * Error envelope produced by the Nest application error handler.
 *
 * We intentionally only model fields needed by generic frontend
 * handling.
 */
export interface ApiErrorPayload {
  readonly requestStatus?: string;
  readonly statusCode?: number;
  readonly statusText?: string;
  readonly message?: string;
  readonly code?: string;
  readonly field?: string;
  readonly operator?: string;
}

/**
 * ------------------------------------------------------------------
 * API error
 * ------------------------------------------------------------------
 */

export class TranslationKeyApiError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload | undefined;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "TranslationKeyApiError";
    this.status = status;
    this.payload = payload;
  }
}

/**
 * ------------------------------------------------------------------
 * Normalizes API base endpoint to avoid double-slash URL corruption.
 * ------------------------------------------------------------------
 */

function getTranslationApiBaseUrl(): string {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  /**
   * Prevent:
   *
   *   http://localhost:3000//api/v1/i18n
   */
  const normalizedApiUrl = API_URL.replace(/\/+$/, "");

  return `${normalizedApiUrl}/api/v1/i18n`;
}

/**
 * ------------------------------------------------------------------
 * Error-message extraction
 * ------------------------------------------------------------------
 */

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    ("message" in value || "statusCode" in value || "code" in value)
  );
}

async function readJsonPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    if (response.ok) return undefined;

    throw new TranslationKeyApiError(
      response.status,
      response.statusText || "Non-JSON API error response received.",
    );
  }

  return response.json();
}

/**
 * ------------------------------------------------------------------
 * Generic JSON request wrapper for I18n translation backend service
 * ------------------------------------------------------------------
 *
 * This helper deliberately returns unknown.
 *
 * Every endpoint must establish trust through its runtime schema.
 */
async function requestJson(
  endpoint: string,
  init: RequestInit,
): Promise<unknown> {
  const baseUrl = getTranslationApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...init,

    /**
     * Required for Better Auth's cookie-backed browser session.
     */
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  // const contentType = response.headers.get("content-type");

  // const payload: unknown = contentType?.includes("application/json")
  //   ? await response.json()
  //   : undefined;

  const payload = await readJsonPayload(response);

  if (!response.ok) {
    const errorPayload = isApiErrorPayload(payload) ? payload : undefined;
    const errorMessage =
      errorPayload?.message ?? response.statusText ?? "API request failed.";
    throw new TranslationKeyApiError(
      response.status,
      errorMessage,
      errorPayload,
    );
    // throw new TranslationKeyApiError(
    //   response.status,
    //   getApiErrorMessage(payload) ??
    //     response.statusText ??
    //     "API request failed.",
    //   payload,
    // );
  }

  return payload;
}

/**
 * ------------------------------------------------------------------
 * DataTable query
 * ------------------------------------------------------------------
 *
 * Input is the application's existing Standard API wire request.
 *
 * The resource API does NOT know about:
 *
 *   TanStack PaginationState
 *   SortingState
 *   ColumnFiltersState
 *
 * Query TranslationKey records using the already-established generic
 * DataTable query contract.
 *
 * No TanStack state conversion occurs here.
 *
 * That responsibility remains in the generic DataTable adapter.
 *
 * Those are translated before reaching this function.
 */
export async function queryTranslationKeys(
  request: StandardApiDataTableQueryRequest,
  signal?: AbortSignal,
): Promise<TranslationKeyQueryResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/query`,
    {
      method: "POST",
      signal,
      body: JSON.stringify(request),
    },
  );

  return translationKeyQueryResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * Categories
 * ------------------------------------------------------------------
 */

export async function getTranslationCategories(
  signal?: AbortSignal,
): Promise<TranslationCategoriesResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/categories`,
    {
      method: "GET",
      signal,
    },
  );

  return translationCategoriesResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * TranslationKey detail
 * ------------------------------------------------------------------
 */

export async function getTranslationKey(
  id: number,
  signal?: AbortSignal,
): Promise<TranslationKeyResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${id}`,
    {
      method: "GET",
      signal,
    },
  );

  return translationKeyResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * TranslationKey create
 * ------------------------------------------------------------------
 */

export async function createTranslationKey(
  input: CreateTranslationKeyInput,
  signal?: AbortSignal,
): Promise<TranslationKeyResponse> {
  const payload = await requestJson(`${getTranslationApiBaseUrl()}/keys`, {
    method: "POST",
    signal,
    body: JSON.stringify(input),
  });

  return translationKeyResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * TranslationKey update
 * ------------------------------------------------------------------
 */

export async function updateTranslationKey(
  id: number,
  input: UpdateTranslationKeyInput,
  signal?: AbortSignal,
): Promise<TranslationKeyResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${id}`,
    {
      method: "PATCH",
      signal,
      body: JSON.stringify(input),
    },
  );

  return translationKeyResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * TranslationKey delete
 * ------------------------------------------------------------------
 */

export async function deleteTranslationKey(
  id: number,
  signal?: AbortSignal,
): Promise<DeleteTranslationKeyResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${id}`,
    {
      method: "DELETE",
      signal,
    },
  );

  return deleteTranslationKeyResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * Translation create
 * ------------------------------------------------------------------
 */

export async function createTranslation(
  keyId: number,
  input: CreateTranslationInput,
  signal?: AbortSignal,
): Promise<TranslationValueResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${keyId}/translations`,
    {
      method: "POST",
      signal,
      body: JSON.stringify(input),
    },
  );

  return translationValueResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * Translation update
 * ------------------------------------------------------------------
 */

export async function updateTranslation(
  keyId: number,
  locale: string,
  input: UpdateTranslationInput,
  signal?: AbortSignal,
): Promise<TranslationValueResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${keyId}/translations/${encodeURIComponent(locale)}`,
    {
      method: "PATCH",
      signal,
      body: JSON.stringify(input),
    },
  );

  return translationValueResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * Translation delete
 * ------------------------------------------------------------------
 */

export async function deleteTranslation(
  keyId: number,
  locale: string,
  signal?: AbortSignal,
): Promise<DeleteTranslationResponse> {
  const payload = await requestJson(
    `${getTranslationApiBaseUrl()}/keys/${keyId}/translations/${encodeURIComponent(locale)}`,
    {
      method: "DELETE",
      signal,
    },
  );

  return deleteTranslationResponseSchema.parse(payload);
}

/**
 * ------------------------------------------------------------------
 * Convenience unwrapped readers
 * ------------------------------------------------------------------
 *
 * CRUD callers may prefer the resource directly.
 *
 * DataTable should NOT use these for query responses because the
 * generic response adapter needs the StandardApiPaginatedResponse.
 */

export async function readTranslationKey(
  id: number,
  signal?: AbortSignal,
): Promise<TranslationKey> {
  const response = await getTranslationKey(id, signal);

  return response.data;
}

export async function readTranslationValue(
  keyId: number,
  locale: string,
  signal?: AbortSignal,
): Promise<TranslationValue | undefined> {
  const response = await getTranslationKey(keyId, signal);

  return response.data.translations.find(
    (translation) => translation.locale === locale,
  );
}
