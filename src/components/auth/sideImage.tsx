import { SideImageProps } from "@/interfaces/auth.interface";
import {
  Box,
  Grid,
  styled,
  Theme,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import Image from "next/image";
import { Moul } from "next/font/google";

const moul = Moul({
  subsets: ["khmer", "latin"],
  weight: "400",
});

const PREFIX = "RazethSideImage";

const StyledSideImage = styled(Grid, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SideImageProps>(() => ({}));

const Content = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(() => ({}));

const Circle = styled("div", {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(() => ({}));

const LogoWrapper = styled(Box, {
  name: PREFIX,
  slot: "Image",
  overridesResolver: (_props, styles) => styles.image,
})(() => ({}));

const Caption = styled(Box, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})(() => ({}));

/* Image section - hidden on mobile */
const SideImage = (inProps: SideImageProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { src = "/static/images/piseth_chesda_logo.svg", ...rest } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) return null;

  return (
    <StyledSideImage size={{ xs: 12, md: 6 }} {...rest}>
      <SideImage.content>
        {/* Blue circle centered */}

        <SideImage.circle>
          {/* <div className="lines">
            {Array.from({ length: theme.custom.lines.length }).map((_, i) => (
              <div key={i} className="line" />
            ))}
          </div> */}
        </SideImage.circle>
      </SideImage.content>
      {/* Fixed-size logo in the middle */}
      {/* <SideImage.logo src={src} theme={theme} /> */}
      {/* Caption below logo */}
    </StyledSideImage>
  );
};

SideImage.content = Content;
SideImage.circle = Circle;
SideImage.logo = ({ src, theme }: { src: string; theme: Theme }) => (
  <LogoWrapper>
    <Image
      src={src}
      alt="Logo"
      fill
      style={{ objectFit: "contain" }}
      priority
    />
    <SideImage.caption
      caption={theme.custom.sideImage.logoCaption}
      className={moul.className}
    />
  </LogoWrapper>
);

// SideImage.caption = ({ caption }: { caption: string }) => {
//   return <Caption>{caption}</Caption>;
// };

SideImage.caption = ({
  caption,
  className,
}: {
  caption: string;
  className?: string;
}) => {
  return <Caption className={className}>{caption}</Caption>;
};

export default SideImage;

// const SideImage = (inProps: SideImageProps) => {
//   const props = useThemeProps({ props: inProps, name: PREFIX });
//   const {
//     src = `${process.env.NEXT_PUBLIC_PLACEHOLDER}` ||
//       "/static/images/placeholder-mcs-orange.svg",
//     ...rest
//   } = props;
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   return (
//     !isMobile && (
//       <StyledSideImage size={{ xs: 12, md: 6 }} {...rest}>
//         <Image
//           src={src}
//           placeholder="empty"
//           alt="Background"
//           fill
//           priority={true}
//           //   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//         />
//       </StyledSideImage>
//     )
//   );
// };

// const DefaultLogo = ({ src }: { src: string }) => (
//   <LogoWrapper>
//     <Image
//       src={src}
//       alt="Logo"
//       fill
//       style={{ objectFit: "contain" }}
//       priority
//     />
//   </LogoWrapper>
// );

// export const SideImageStyles = (theme: Theme) => ({
//   [`& .${SideImageClasses.content}`]: {
//     position: "relative",
//     // height: { xs: "auto", md: "auto" },
//     height: "100%",
//     backgroundColor:
//       theme.palette.mode === "dark"
//         ? "rgba(0, 0, 0, 0.2)"
//         : theme.palette.grey[200],
//     "& img": {
//       position: "absolute",
//       inset: 0,
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",
//       ...(theme.palette.mode === "dark" &&
//         {
//           // filter: "brightness(0.25) grayscale(1)",
//           // filter:
//           //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
//         }),
//     },
//   },
// });
