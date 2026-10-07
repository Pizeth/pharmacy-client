// src/features/hrd/styles/styled.ts

import type { CSSInterpolation } from "@mui/material/styles";
import type { HrdSlotKey } from "./hrdSlotKeys";

export const HRD_COMPONENT_NAME = "RazethHrd" as const;

/** Match the publicDocumentsSlot contract for HRD site presentation. */
export function hrdSlot(slot: Capitalize<HrdSlotKey>) {
  const key = slot.charAt(0).toLowerCase() + slot.slice(1);
  return {
    name: HRD_COMPONENT_NAME,
    slot,
    overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => styles[key],
  };
}

/**
 * Stable MUI component-family name for every styled piece of the public
 * document directory.
 *
 * Each piece below is a styled() component registered under a slot, so
 * it can be restyled from the theme without touching component code:
 *
 *   theme.components.RazethPublicDocuments.styleOverrides.<slot>
 *
 * The slot-key registry and src/theme.d.ts also type this theme contract.
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
