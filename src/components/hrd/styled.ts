// src/components/hrd/styled.ts

import type { CSSInterpolation } from "@mui/material/styles";

/**
 * Stable MUI component-family name for every styled piece of the public
 * document directory.
 *
 * Each piece below is a styled() component registered under a slot, so
 * it can be restyled from the theme without touching component code:
 *
 *   theme.components.RazethPublicDocuments.styleOverrides.<slot>
 *
 * (TypeScript needs a `Components` augmentation in src/theme.d.ts before
 * the theme will accept that key; at runtime it already works.)
 */
export const PUBLIC_DOCUMENTS_COMPONENT_NAME = "RazethPublicDocuments" as const;

/**
 * styled() options for one slot, e.g. publicDocumentsSlot("Footer") is
 * overridable through styleOverrides.footer.
 */
export function publicDocumentsSlot(slot: string) {
  const key = slot.charAt(0).toLowerCase() + slot.slice(1);

  return {
    name: PUBLIC_DOCUMENTS_COMPONENT_NAME,
    slot,
    overridesResolver: (
      _props: unknown,
      styles: Record<string, CSSInterpolation>,
    ) => styles[key],
  };
}
