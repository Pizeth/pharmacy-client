import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import type { TranslationCategory } from "../schemas";
import { TRANSLATION_KEY_LOCALE_OPTIONS } from "../locales";

/**
 * ------------------------------------------------------------------
 * TranslationKey locale filter options
 * ------------------------------------------------------------------
 *
 * DataTable gets its generic:
 *
 *   label
 *   value
 *
 * representation from the resource-level locale registry.
 */
export const TRANSLATION_KEY_LOCALE_FILTER_OPTIONS =
  TRANSLATION_KEY_LOCALE_OPTIONS satisfies readonly MuiDataTableFilterOption[];

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
