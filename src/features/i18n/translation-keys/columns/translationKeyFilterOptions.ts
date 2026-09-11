import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import type { TranslationCategory } from "../schemas";

/**
 * ------------------------------------------------------------------
 * TranslationKey locale filter options
 * ------------------------------------------------------------------
 *
 * These are resource/application values rather than generic DataTable
 * knowledge.
 *
 * The generic select filter only knows:
 *
 *   label
 *   value
 *
 * TranslationKey decides that:
 *
 *   English -> "en"
 *   Khmer   -> "km"
 *
 * Later, when the application's supported-locale configuration becomes
 * the canonical source, this constant can be replaced without changing
 * the generic DataTable filter implementation.
 */
export const TRANSLATION_KEY_LOCALE_FILTER_OPTIONS = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Khmer",
    value: "km",
  },
] as const satisfies readonly MuiDataTableFilterOption[];

/**
 * Convert TranslationCategory resources into the generic option shape
 * understood by DataTableSelectFilter.
 *
 * Important:
 *
 * The label is human-readable:
 *
 *   "auth"
 *
 * while the value is the stable database/API identifier:
 *
 *   2
 *
 * Therefore selecting:
 *
 *   auth
 *
 * puts:
 *
 *   2
 *
 * into TanStack's column-filter state.
 *
 * The resource semantic mapper can then safely produce:
 *
 *   {
 *     field: "categoryId",
 *     operator: "equals",
 *     value: 2
 *   }
 */
export function createTranslationKeyCategoryFilterOptions(
  categories: readonly TranslationCategory[],
): readonly MuiDataTableFilterOption[] {
  return [...categories]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((category) => ({
      label: category.name,
      value: category.id,
    }));
}
