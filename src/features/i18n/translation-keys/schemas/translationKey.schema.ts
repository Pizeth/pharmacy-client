import { z } from "zod";

/**
 * ------------------------------------------------------------------
 * Shared transport scalars
 * ------------------------------------------------------------------
 */

const positiveIntegerSchema = z.number().int().positive();

/**
 * Keep timestamps as ISO strings at the HTTP boundary.
 *
 * JSON does not transport JavaScript Date instances.
 */
const apiDateTimeSchema = z.iso.datetime();

/**
 * ------------------------------------------------------------------
 * TranslationCategory
 * ------------------------------------------------------------------
 */

export const translationCategorySchema = z.strictObject({
  id: positiveIntegerSchema,
  name: z.string(),
  description: z.string().nullable(),
});

/**
 * ------------------------------------------------------------------
 * Translation locale value
 * ------------------------------------------------------------------
 */

export const translationValueSchema = z.strictObject({
  id: positiveIntegerSchema,
  locale: z.string(),
  value: z.string(),
  keyId: positiveIntegerSchema.optional(),
  createdAt: apiDateTimeSchema,
  updatedAt: apiDateTimeSchema,
});

/**
 * ------------------------------------------------------------------
 * TranslationKey
 * ------------------------------------------------------------------
 *
 * This mirrors the canonical backend shape returned by:
 *
 *   TRANSLATION_KEY_DATA_TABLE_SELECT
 */

export const translationKeySchema = z.strictObject({
  id: positiveIntegerSchema,
  key: z.string(),
  description: z.string().nullable(),
  categoryId: positiveIntegerSchema,
  createdAt: apiDateTimeSchema,
  updatedAt: apiDateTimeSchema,
  translationCategory: translationCategorySchema,
  translations: z.array(translationValueSchema),
});

/**
 * ------------------------------------------------------------------
 * Mutation inputs
 * ------------------------------------------------------------------
 */

export const createTranslationKeyInputSchema = z.strictObject({
  key: z.string().trim().min(1).max(100),
  description: z.string().trim().max(255).nullable().optional(),
  categoryId: positiveIntegerSchema,
});

export const updateTranslationKeyInputSchema = z
  .strictObject({
    key: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(255).nullable().optional(),
    categoryId: positiveIntegerSchema.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    error: "At least one field must be provided.",
  });

export const createTranslationInputSchema = z.strictObject({
  locale: z
    .string()
    .min(2)
    .max(35)
    .regex(/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/),
  value: z
    .string()
    .min(1)
    .max(10_000)
    .refine((value) => value.trim().length > 0, {
      error: "Translation value must not contain only whitespace.",
    }),
});

export const updateTranslationInputSchema = z.strictObject({
  value: z
    .string()
    .min(1)
    .max(10_000)
    .refine((value) => value.trim().length > 0, {
      error: "Translation value must not contain only whitespace.",
    }),
});

/**
 * ------------------------------------------------------------------
 * Delete result schemas
 * ------------------------------------------------------------------
 */

export const deletedTranslationKeySchema = z.strictObject({
  id: positiveIntegerSchema,
  key: z.string(),
});

export const deletedTranslationSchema = z.strictObject({
  id: positiveIntegerSchema,
  keyId: positiveIntegerSchema,
  locale: z.string(),
});

/**
 * ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------
 *
 * Runtime schema remains the single source of truth for resource
 * shapes.
 */

export type TranslationCategory = z.output<typeof translationCategorySchema>;

export type TranslationValue = z.output<typeof translationValueSchema>;

export type TranslationKey = z.output<typeof translationKeySchema>;

export type CreateTranslationKeyInput = z.output<
  typeof createTranslationKeyInputSchema
>;

export type UpdateTranslationKeyInput = z.output<
  typeof updateTranslationKeyInputSchema
>;

export type CreateTranslationInput = z.output<
  typeof createTranslationInputSchema
>;

export type UpdateTranslationInput = z.output<
  typeof updateTranslationInputSchema
>;

export type DeletedTranslationKey = z.output<
  typeof deletedTranslationKeySchema
>;

export type DeletedTranslation = z.output<typeof deletedTranslationSchema>;

/**
 * ------------------------------------------------------------------
 * Standard API response helpers
 * ------------------------------------------------------------------
 *
 * These schemas validate the already-established Standard API wire
 * format.
 *
 * They do NOT introduce a second TypeScript contract.
 */

const standardApiPaginationMetadataSchema = z.strictObject({
  currentPage: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

const translationKeyPaginatedDataSchema = z.strictObject({
  data: z.array(translationKeySchema),
  metadata: standardApiPaginationMetadataSchema,
});

export const translationKeyQueryResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: translationKeyPaginatedDataSchema,
});

export const translationKeyResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: translationKeySchema,
});

export const translationCategoriesResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: z.array(translationCategorySchema),
});

export const translationValueResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: translationValueSchema,
});

export const deleteTranslationKeyResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: deletedTranslationKeySchema,
});

export const deleteTranslationResponseSchema = z.strictObject({
  requestStatus: z.literal("SUCCESS"),
  statusCode: z.number().int(),
  statusText: z.string(),
  message: z.string().optional(),
  data: deletedTranslationSchema,
});

// /**
//  * ------------------------------------------------------------------
//  * Pagination
//  * ------------------------------------------------------------------
//  */

// export const apiPageMetadataSchema = z.strictObject({
//   currentPage: positiveIntegerSchema,
//   pageSize: positiveIntegerSchema,
//   totalItems: z.number().int().nonnegative(),
//   totalPages: z.number().int().nonnegative(),
//   hasNextPage: z.boolean(),
//   hasPreviousPage: z.boolean(),
// });

// export const translationKeyPageSchema = z.strictObject({
//   data: z.array(translationKeySchema),
//   metadata: apiPageMetadataSchema,
// });

// /**
//  * ------------------------------------------------------------------
//  * Standard API envelope
//  * ------------------------------------------------------------------
//  */

// export const translationKeyQueryResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: translationKeyPageSchema,
// });

// export const translationKeyResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: translationKeySchema,
// });

// export const translationCategoriesResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: z.array(translationCategorySchema),
// });

// export const translationValueResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: translationValueSchema,
// });

// export const deletedTranslationKeySchema = z.strictObject({
//   id: positiveIntegerSchema,
//   key: z.string(),
// });

// export const deleteTranslationKeyResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: deletedTranslationKeySchema,
// });

// export const deletedTranslationSchema = z.strictObject({
//   id: positiveIntegerSchema,
//   keyId: positiveIntegerSchema,
//   locale: z.string(),
// });

// export const deleteTranslationResponseSchema = z.strictObject({
//   requestStatus: z.literal("SUCCESS"),
//   statusCode: z.number().int(),
//   statusText: z.string(),
//   message: z.string().optional(),
//   data: deletedTranslationSchema,
// });

// /**
//  * ------------------------------------------------------------------
//  * Output types
//  * ------------------------------------------------------------------
//  */

// export type TranslationKeySchemaOutput = z.output<typeof translationKeySchema>;

// export type TranslationKeyPageSchemaOutput = z.output<
//   typeof translationKeyPageSchema
// >;
