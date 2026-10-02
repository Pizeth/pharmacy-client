"use client";

import type { ReactElement, ReactNode } from "react";
import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import type { ContainerProps, TypographyProps } from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Image from "next/image";
// import { ShieldCheck } from "lucide-react";

const PREFIX = "RazethResourcePage";

const Root = styled(Container, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  marginTop: theme.spacing(-5),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(-1.5),
  },
}));

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
  // background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
  background: `linear-gradient(
    135deg,
    #06006b 0%,
    #0d1a7d 15%,
    #14329a 33%,
    #1b4eb8 52%,
    #1943a5 70%,
    #102284 86%,
    #080091 100%
  )`,
  color: theme.vars.palette.common.white,
  // boxShadow: theme.vars.palette.customShadows.neumorphic,
  boxShadow: `
  -7px -7px 15px rgba(255, 255, 255, 0.12), 
  7px 7px 15px rgba(3, 2, 43, 0.6)
`,
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
            <Box
              sx={{
                display: { xs: "none", md: "inherit" },
                // display: "none",
                justifyContent: "space-between",
                mb: 7,
              }}
            >
              <Grid container spacing={0}>
                {/* Logo Section */}
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{
                    position: "relative",
                    /*** New CSS ***/
                    // overflow: "hidden", // prevents scrollbars
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,

                      aspectRatio: "1 / 1",

                      width: 100,
                      overflow: "visible",
                      inset: 0,
                      objectFit: "cover",
                    }}
                  >
                    <Image
                      src="/static/images/logo.svg"
                      alt="Logo"
                      preload={false}
                      loading="eager"
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: (theme) =>
                          `calc(100% + ${theme.custom.sideImage.captionOffset.xs})`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        // 👇 key changes
                        whiteSpace: "nowrap", // prevent wrapping
                        overflow: "visible", // allow text to extend beyond logo box
                        maxWidth: "none", // remove inherited width limit
                        color: "#edad54",
                        textAlign: "center",
                        fontSize: (theme) =>
                          theme.custom.sideImage.captionFontSize.xs,
                        textShadow: (theme) => `
                            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                            0    0   7px ${theme.custom.sideImage.captionGlowColor}
                          `,
                        WebkitTextStroke: (theme) =>
                          `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
                      }}
                    >
                      <Typography variant="h6">ក្រសួងមុខងារសាធារណៈ</Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* National Motto Section */}
                <Grid size={{ xs: 12, md: 3 }} offset={{ md: 7 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </Typography>
                    <Typography variant="h6">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
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
