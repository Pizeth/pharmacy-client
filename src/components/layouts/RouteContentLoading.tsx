"use client";

import { Container, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/material/styles";

export type RouteContentLoadingSlot = "root" | "heading" | "body" | "cards" | "card";
const slot = (name: Capitalize<RouteContentLoadingSlot>) => ({
  name: "RazethRouteContentLoading",
  slot: name,
  overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => styles[name.charAt(0).toLowerCase() + name.slice(1)],
});
const Root = styled(Container, slot("Root"))(({ theme }) => ({
  paddingBlock: theme.spacing(3),
  minHeight: "60vh",
  "@media (prefers-reduced-motion: reduce)": {
    "& .MuiSkeleton-root": { animation: "none" },
    "& .MuiSkeleton-root::after": { animation: "none" },
  },
}));
const Heading = styled(Skeleton, slot("Heading"))(({ theme }) => ({ width: "45%", height: theme.spacing(6) }));
const Body = styled(Skeleton, slot("Body"))(({ theme }) => ({ height: theme.spacing(18), marginBlock: theme.spacing(2) }));
const Cards = styled("div", slot("Cards"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
}));
const Card = styled(Skeleton, slot("Card"))(({ theme }) => ({ height: theme.spacing(24) }));

export function RouteContentLoading() {
  return (
    <Root maxWidth="xl" role="status" aria-live="polite" aria-busy="true">
      <Typography variant="body2">Loading page…</Typography>
      <div aria-hidden="true">
        <Heading animation="wave" />
        <Body variant="rounded" animation="wave" />
        <Cards>{[0, 1, 2].map(index => <Card key={index} variant="rounded" animation="wave" />)}</Cards>
      </div>
    </Root>
  );
}
