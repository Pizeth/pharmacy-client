// src/features/i18n/translation-keys/schemas/index.ts

export {
  createTranslationInputSchema,
  createTranslationKeyInputSchema,
  deleteTranslationKeyResponseSchema,
  deleteTranslationResponseSchema,
  deletedTranslationKeySchema,
  deletedTranslationSchema,
  translationCategoriesResponseSchema,
  translationCategorySchema,
  translationKeyQueryResponseSchema,
  translationKeyResponseSchema,
  translationKeySchema,
  translationValueResponseSchema,
  translationValueSchema,
  updateTranslationInputSchema,
  updateTranslationKeyInputSchema,
} from "./translationKey.schema";

export type {
  CreateTranslationInput,
  CreateTranslationKeyInput,
  DeletedTranslation,
  DeletedTranslationKey,
  TranslationCategory,
  TranslationKey,
  TranslationValue,
  UpdateTranslationInput,
  UpdateTranslationKeyInput,
} from "./translationKey.schema";
