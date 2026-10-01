"use client";

import type { ReactElement, ReactNode } from "react";
import { Box, Chip, Container, Paper, Typography } from "@mui/material";
import type { ContainerProps, TypographyProps } from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
// import { ShieldCheck } from "lucide-react";

const PREFIX = "RazethResourcePage";

const Root = styled(Container, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const HeaderRoot = styled("header", {
  name: PREFIX,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})({});

const TitleRoot = styled(Typography, {
  name: PREFIX,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})<TypographyProps>({});

const SubtitleRoot = styled(Typography, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})<TypographyProps>({ opacity: 0.9, lineHeight: 1.6 });

const ContentRoot = styled("main", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({
  marginTop: 0,
});

const SurfaceRoot = styled(Paper, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})({});

/**
 * ------------------------------------------------------------------
 * A few small presentational pieces, kept local since this page is
 * deliberately self-contained.
 * ------------------------------------------------------------------
 */
const HeroBanner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
  color: theme.vars.palette.common.white,
  boxShadow: theme.vars.palette.customShadows.neumorphic,
  "& .MuiTypography-subtitle2": {
    color: theme.vars.palette.common.white,
    fontweight: 700,
  },
}));

const FormatBadge = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1, 1, 0, 0),
  fontWeight: 500,
  fontSize: "0.75rem",
  color: theme.vars.palette.common.white,
  bgcolor: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.3)",
}));

export interface ResourcePageProps {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly children: ReactNode;
  readonly maxWidth?: ContainerProps["maxWidth"];
  readonly disableGutters?: boolean;

  /**
   * false:
   *   children render directly in the resource page
   *
   * true:
   *   children receive a page-form/content Paper surface
   */
  readonly surface?: boolean;

  readonly hero?: boolean;

  readonly badgeIcon?: ReactElement<unknown> | undefined;

  readonly badgeLabel?: string;

  readonly className?: string;
}

export function ResourcePage(inProps: ResourcePageProps) {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const {
    title,
    subtitle,
    children,
    maxWidth = "xl",
    disableGutters = false,
    surface = false,
    className,
    hero = false,
    badgeIcon = <VerifiedUserOutlinedIcon fontSize="small" color="inherit" />,
    badgeLabel,
  } = props;

  return (
    <Root
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      className={className}
    >
      <HeaderRoot>
        {hero ? (
          <HeroBanner>
            <TitleRoot component="h4" variant="h6" gutterBottom>
              {title}
            </TitleRoot>
            {/* <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              {subtitle}
            </Typography> */}
            {subtitle && (
              <SubtitleRoot
                variant="subtitle2"
                // color="textPrimary"
                gutterBottom
              >
                {subtitle}
              </SubtitleRoot>
            )}
            {badgeLabel && <FormatBadge icon={badgeIcon} label={badgeLabel} />}
          </HeroBanner>
        ) : (
          <>
            <TitleRoot component="h4" variant="h6">
              {title}
            </TitleRoot>
            {subtitle && (
              <SubtitleRoot variant="body2">{subtitle}</SubtitleRoot>
            )}
          </>
        )}
      </HeaderRoot>

      <ContentRoot>
        {surface ? (
          <SurfaceRoot variant="outlined">{children}</SurfaceRoot>
        ) : (
          children
        )}
      </ContentRoot>
    </Root>
  );
}
