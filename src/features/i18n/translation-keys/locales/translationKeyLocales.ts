/**
 * ------------------------------------------------------------------
 * TranslationKey supported locales
 * ------------------------------------------------------------------
 *
 * Resource/application-level locale registry.
 *
 * This is deliberately NOT DataTable-specific.
 *
 * Consumers include:
 *
 * - Locale column filter options
 * - Translation create forms
 * - Translation detail presentation
 *
 * When the application eventually gains a global locale registry,
 * this file can delegate to that source without changing those
 * consumers.
 */

export const TRANSLATION_KEY_LOCALE_OPTIONS = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Khmer",
    value: "km",
  },
] as const;

export type TranslationKeyLocale =
  (typeof TRANSLATION_KEY_LOCALE_OPTIONS)[number]["value"];

/**
 * Resolve the human-readable locale label.
 *
 * Unknown locales are still renderable because the backend schema
 * accepts valid BCP-47-style locale strings beyond the two currently
 * exposed by the UI.
 */
export function getTranslationKeyLocaleLabel(locale: string): string {
  return (
    TRANSLATION_KEY_LOCALE_OPTIONS.find((option) => option.value === locale)
      ?.label ?? locale.toLocaleUpperCase()
  );
}
