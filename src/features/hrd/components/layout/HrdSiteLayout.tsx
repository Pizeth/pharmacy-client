"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { styled } from "@mui/material/styles";
import { HrdBreadcrumbs } from "./HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

const backgroundColor =
  "linear-gradient(135deg, #050057 0%, #0b126f 20%, #14298c 40%, #1a3da7 55%, #162fa0 75%, #0c147d 90%, #080091 100%)";

const BackgroundRoot = styled(
  "div",
  hrdSlot("LayoutRoot"),
)({
  display: "contents",
  "--Hrd-page-background": backgroundColor,
});
const Content = styled(
  "div",
  hrdSlot("LayoutContent"),
)(({ theme }) => ({
  display: "flow-root",
  maxWidth: theme.breakpoints.values.xl,
  marginInline: "auto",
  backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.75),
  // Crosshatch Art – Light, with theme-aware ink for the translucent surface.
  // https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
  backgroundImage: `
    repeating-linear-gradient(22.5deg, transparent 0 2px, ${theme.alpha(theme.vars.palette.text.primary, 0.06)} 2px 3px, transparent 3px 8px),
    repeating-linear-gradient(67.5deg, transparent 0 2px, ${theme.alpha(theme.vars.palette.text.primary, 0.05)} 2px 3px, transparent 3px 8px),
    repeating-linear-gradient(112.5deg, transparent 0 2px, ${theme.alpha(theme.vars.palette.text.primary, 0.04)} 2px 3px, transparent 3px 8px),
    repeating-linear-gradient(157.5deg, transparent 0 2px, ${theme.alpha(theme.vars.palette.text.primary, 0.03)} 2px 3px, transparent 3px 8px),
    linear-gradient(135deg, ${theme.alpha(theme.vars.palette.primary.main, 0.1)}, ${theme.alpha(theme.vars.palette.secondary.main, 0.1)})
  `,
  backdropFilter: "blur(20px) saturate(175%)",
  // Backdrop filters contain fixed descendants; release the viewport-sized shell.
  '&:has([data-fullscreen="true"])': {
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },
  WebkitBackdropFilter: "blur(20px) saturate(175%)",
  color: theme.vars.palette.text.primary,
}));
export function HrdSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundRoot lang="km">
      <DrawerAppBar backgroundColor="var(--Hrd-page-background)" breadcrumbs={null}>
        <Content>
          <HrdBreadcrumbs />
          {children}
        </Content>
      </DrawerAppBar>
    </BackgroundRoot>
  );
}
