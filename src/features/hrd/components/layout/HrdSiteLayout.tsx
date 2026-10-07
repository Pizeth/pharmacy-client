"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { styled } from "@mui/material/styles";
import { HrdFooter } from "../footer/HrdFooter";
import { HrdBreadcrumbs } from "./HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

const backgroundColor =
  "linear-gradient(135deg, #050057 0%, #0b126f 20%, #14298c 40%, #1a3da7 55%, #162fa0 75%, #0c147d 90%, #080091 100%)";

const BackgroundRoot = styled(
  "div",
  hrdSlot("LayoutRoot"),
)(({ theme }) => ({
  display: "contents",
  "--Hrd-page-background": backgroundColor,
  ...theme.applyStyles("dark", {
    "--Hrd-page-background":
      "linear-gradient(135deg, #101720 0%, #172331 40%, #1d2c3d 55%, #172331 75%, #101720 100%)",
  }),
}));
const Content = styled(
  "div",
  hrdSlot("LayoutContent"),
)(({ theme }) => ({
  display: "flow-root",
  maxWidth: theme.breakpoints.values.xl,
  marginInline: "auto",
  backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.75),
  backgroundImage: `linear-gradient(135deg, ${theme.alpha(theme.vars.palette.primary.main, 0.1)}, ${theme.alpha(theme.vars.palette.secondary.main, 0.1)})`,
  backdropFilter: "blur(20px) saturate(175%)",
  WebkitBackdropFilter: "blur(20px) saturate(175%)",
  color: theme.vars.palette.text.primary,
}));
export function HrdSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundRoot lang="km">
      <DrawerAppBar backgroundColor="var(--Hrd-page-background)">
        <Content>
          <HrdBreadcrumbs />
          {children}
        </Content>
        <HrdFooter />
      </DrawerAppBar>
    </BackgroundRoot>
  );
}
