"use client";
import { Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
const Root = styled("div", { name: "RazethResourceRecord", slot: "FormLoading", overridesResolver: (_, styles) => styles.formLoading })(({ theme }) => ({ display: "grid", gap: theme.spacing(2), paddingBlock: theme.spacing(1), width: "100%", minWidth: 0 }));
export function ResourceFormLoading({ message = "Loading form…" }: { message?: string }) {
  return <Root role="status" aria-busy="true" aria-label={message}><Typography variant="caption" color="text.secondary">{message}</Typography>{[40, 40, 80, 40].map((height, index) => <Skeleton key={index} variant="rounded" height={height} animation="pulse" aria-hidden="true" />)}</Root>;
}
