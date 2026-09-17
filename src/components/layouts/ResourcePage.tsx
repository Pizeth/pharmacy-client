"use client";

import type { ReactNode } from "react";
import { Container, Paper, Typography } from "@mui/material";
import type { ContainerProps, TypographyProps } from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";

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
})<TypographyProps>({});

const ContentRoot = styled("main", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({});

const SurfaceRoot = styled(Paper, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})({});

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
  } = props;

  return (
    <Root
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      className={className}
    >
      <HeaderRoot>
        <TitleRoot component="h1" variant="h6">
          {title}
        </TitleRoot>

        {subtitle && <SubtitleRoot variant="body2">{subtitle}</SubtitleRoot>}
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
