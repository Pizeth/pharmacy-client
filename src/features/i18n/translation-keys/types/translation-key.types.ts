// src/features/i18n/translation-keys/types/translation-key.types.ts

/**
 * Frontend representation of one TranslationCategory.
 *
 * This intentionally mirrors the HTTP resource contract rather than
 * importing generated Prisma types into the frontend.
 */
export interface TranslationCategory1 {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
}

/**
 * Frontend representation of one locale value belonging to a
 * TranslationKey.
 *
 * Dates remain ISO strings at the HTTP boundary.
 *
 * We should only turn them into Date instances in presentation code
 * when formatting is actually required.
 */
export interface TranslationValue1 {
  readonly id: number;
  readonly locale: string;
  readonly value: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Canonical frontend TranslationKey resource.
 *
 * The same shape is currently returned from:
 *
 *   POST /api/v1/i18n/keys/query
 *   GET  /api/v1/i18n/keys/:id
 *   POST /api/v1/i18n/keys
 *   PATCH /api/v1/i18n/keys/:id
 */
export interface TranslationKey1 {
  readonly id: number;
  readonly key: string;
  readonly description: string | null;
  readonly categoryId: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly translationCategory: TranslationCategory1;
  readonly translations: readonly TranslationValue1[];
}

/**
 * Lightweight category option returned by:
 *
 *   GET /api/v1/i18n/categories
 */
export interface TranslationCategoryOption1 {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
}

/**
 * ------------------------------------------------------------------
 * Mutation inputs
 * ------------------------------------------------------------------
 */

export interface CreateTranslationKeyInput {
  readonly key: string;
  readonly description?: string | null;
  readonly categoryId: number;
}

export interface UpdateTranslationKeyInput {
  readonly key?: string;
  readonly description?: string | null;
  readonly categoryId?: number;
}

export interface CreateTranslationInput {
  readonly locale: string;
  readonly value: string;
}

export interface UpdateTranslationInput {
  readonly value: string;
}

/**
 * ------------------------------------------------------------------
 * Mutation delete results
 * ------------------------------------------------------------------
 */

export interface DeletedTranslationKey {
  readonly id: number;
  readonly key: string;
}

export interface DeletedTranslation {
  readonly id: number;
  readonly keyId: number;
  readonly locale: string;
}

// /**
//  * Successful application response envelope emitted by the Nest
//  * StandardResponse interceptor.
//  */
// export interface StandardApiSuccessResponse<TData> {
//   readonly requestStatus: "SUCCESS";
//   readonly statusCode: number;
//   readonly statusText: string;
//   readonly message?: string;
//   readonly data: TData;
// }

// /**
//  * Backend pagination metadata.
//  *
//  * Important:
//  *
//  * backend pages are 1-based:
//  *
//  *   page = 1
//  *
//  * TanStack pagination remains:
//  *
//  *   pageIndex = 0
//  *
//  * That translation belongs to our generic DataTable query layer,
//  * not this resource.
//  */
// export interface ApiPageMetadata {
//   readonly currentPage: number;
//   readonly pageSize: number;
//   readonly totalItems: number;
//   readonly totalPages: number;
//   readonly hasNextPage: boolean;
//   readonly hasPreviousPage: boolean;
// }

// export interface ApiPage<TData> {
//   readonly data: readonly TData[];
//   readonly metadata: ApiPageMetadata;
// }

// export type TranslationKeyPage = ApiPage<TranslationKey>;

// export type TranslationKeyQueryResponse =
//   StandardApiSuccessResponse<TranslationKeyPage>;

// export type TranslationKeyResponse = StandardApiSuccessResponse<TranslationKey>;

// export type TranslationCategoriesResponse = StandardApiSuccessResponse<
//   readonly TranslationCategoryOption[]
// >;

// export type TranslationResponse = StandardApiSuccessResponse<TranslationValue>;

// export type DeleteTranslationKeyResponse =
//   StandardApiSuccessResponse<DeletedTranslationKey>;

// export type DeleteTranslationResponse =
//   StandardApiSuccessResponse<DeletedTranslation>;
