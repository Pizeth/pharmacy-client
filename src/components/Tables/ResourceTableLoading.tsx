"use client";
import { Box, Paper } from "@mui/material";
import { styled, type CSSInterpolation } from "@mui/material/styles";
import CloudLoader, { CloudLoaderMessage } from "@/components/effect/loaders/CloudLoader/CloudLoader";
export type ResourceTableLoadingSlot = "root" | "content";
function slot(name: Capitalize<ResourceTableLoadingSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return { name: "RazethResourceTableLoading", slot: name, overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) => styles[key] };
}
const Root = styled(Paper, slot("Root"))(({ theme }) => ({ minHeight: 360, display: "grid", placeItems: "center", padding: theme.spacing(4) }));
const Content = styled(Box, slot("Content"))(({ theme }) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: theme.spacing(2) }));
/** Shared initial-load surface. Refreshes retain the populated table and its state. */
export function ResourceTableLoading({ message = "Loading records…" }: { readonly message?: string }) {
  return <Root variant="outlined"><Content role="status" aria-live="polite" aria-busy="true"><CloudLoader /><CloudLoaderMessage variant="body2">{message}</CloudLoaderMessage></Content></Root>;
}
