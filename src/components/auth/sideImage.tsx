import { SideImageProps } from "@/interfaces/auth.interface";
import {
  Box,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import Image from "next/image";
import { Moul } from "next/font/google";
import { filt, hi, hii, wee } from "@/theme/keyframes";
import { makePulseVars, makePulseKeyframes } from "@/utils/themeUtils";
import Icons from "../icons/components/socials";

const moul = Moul({
  subsets: ["khmer", "latin"],
  weight: "400",
});

const CAPTION = process.env.NEXT_PUBLIC_LOGO_CAPTION || "ក្រសួងមុខងារសាធារណៈ";

const PREFIX = "RazethSideImage";

const Root = styled(Grid, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SideImageProps>(({ theme }) => ({
  position: "relative",
  /*** New CSS ***/
  overflow: "hidden", // prevents scrollbars
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "#f97316", // orange background
  // ...makePulseVars(
  //   props.theme.custom.sideImage.circleColor,
  //   props.theme.custom.sideImage.circleStopCount,
  //   props.theme.custom.sideImage.circlePulseSequence,
  // ),
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    "--c": "7px",
    // backgroundColor: "#000",
    // backgroundImage: `
    //           radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
    //           radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
    //           radial-gradient(circle at 50% 50%, #f00, #f000 60%),
    //           radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
    //           radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
    //           radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
    //         `,
    backgroundImage: `
              radial-gradient(circle at 50% 50%, #0000 1.5px, ${theme.vars.palette.dynamic.background} 0 var(--c), #0000 var(--c)),
              radial-gradient(circle at 50% 50%, #0000 1.5px, ${theme.vars.palette.dynamic.background} 0 var(--c), #0000 var(--c)),
              radial-gradient(circle at 50% 50%, #f00, #f000 60%),
              radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
              radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
              radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
            `,
    backgroundSize: `
              12px 20.7846097px,
              12px 20.7846097px,
              200% 200%,
              200% 200%,
              200% 200%,
              200% 20.7846097px
            `,
    "--p": "0px 0px, 6px 10.39230485px",
    backgroundPosition: `
              var(--p),
              0% 0%,
              0% 0%,
              0% 0px
            `,
    animation: `${wee} 40s linear infinite, ${filt} 6s linear infinite`,
    zIndex: 0,
  },
}));

const Content = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(() => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  // width:
  //   `calc(${props.theme.custom.sideImage.circleSize} * 2)` || "70%",
  // height:
  //   `calc(${props.theme.custom.sideImage.circleSize} * 2)` || "70%",
  // background: "#000000",
  backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
          `,
}));

const Circle = styled("div", {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(({ theme }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  width: theme.custom.sideImage.circleSize || "35%", // one-third of parent width
  aspectRatio: "1 / 1", // keep height equal to width
  // paddingTop: "var(--app-sideImage-circleSize)", // makes height equal to width
  // backgroundImage:
  //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle
  // backgroundSize: "100% 100%",
  // backgroundBlendMode: "multiply",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // center it
  // boxShadow: "0 0 20px 10px rgba(30, 64, 175, 0.5)",
  boxShadow: `0 0 20px 10px ${theme.alpha(theme.vars.palette.primary.main, 0.25)}`,
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    // backgroundImage:
    //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle

    // zIndex: 0, // keep it behind children
    // pointerEvents: "none", // don’t block clicks
    // background: `radial-gradient(
    //   circle,
    //       ${props.theme.custom.sideImage.circleColor} ${
    //   props.theme.custom.sideImage.circleSoftStop
    // },
    //   transparent ${props.theme.custom.sideImage.circleSoftFade}
    //   // ${props.theme.custom.sideImage.circleColor || "#1e40af"} 70%,
    //   // transparent 100%
    // )`,
    // backgroundImage: `radial-gradient(
    //   circle at 50% 50%,
    //   ${makeRadialStops(
    //     props.theme.custom.sideImage.circleColor,
    //     props.theme.custom.sideImage.circleStopCount,
    //     props.theme.custom.sideImage.maxOpacity
    //   )}
    // )`,
    animation: `${makePulseKeyframes(
      theme.custom.sideImage.circlePulseSequence,
    )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
    // backgroundSize: "100% 100%",
  },

  /*** Animation ***/
  // "--c": "#09f",
  backgroundColor: "#000",
  // backgroundColor: theme.vars.palette.background.default,
  backgroundImage: theme.custom.sideImage.animationBackground.backgroundImage,
  backgroundSize: theme.custom.sideImage.animationBackground.backgroundSize,

  animation: `${hi} 150s linear infinite`,
  "&::after": {
    content: "''",
    borderRadius: "50%",
    position: "absolute",
    inset: 0,
    zIndex: 1,
    backgroundImage: `radial-gradient(
                circle at 50% 50%,
                #0000 0,
                #0000 2px,
                hsl(0 0 4%) 2px
              )`,
    // backgroundImage: `radial-gradient(
    //             circle at 50% 50%,
    //             #0000 0,
    //             #0000 2px,
    //             ${theme.vars.palette.dynamic.background}2px
    //           )`,
    backgroundSize: "8px 8px",
    "--f": "blur(1em) brightness(6)",
    animation: `${hii} 10s linear infinite`,
  },
}));

const LogoWrapper = styled(Box, {
  name: PREFIX,
  slot: "Image",
  overridesResolver: (_props, styles) => styles.image,
})(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  aspectRatio: "1 / 1",
  width: theme.custom.sideImage.logoSize,
  overflow: "visible",
  inset: 0,
  objectFit: "cover",
  ...(theme.palette.mode === "dark" &&
    {
      // filter: "brightness(0.25) grayscale(1)",
      // filter:
      //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
    }),
}));

const Caption = styled(Box, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})(({ theme }) => ({
  position: "absolute",
  top: `calc(100% + ${theme.custom.sideImage.captionOffset.xs})`,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  // 👇 key changes
  whiteSpace: "nowrap", // prevent wrapping
  overflow: "visible", // allow text to extend beyond logo box
  maxWidth: "none", // remove inherited width limit
  color: "#edad54",
  textAlign: "center",
  fontFamily: "var(--font-moul)",
  fontSize: theme.custom.sideImage.captionFontSize.xs,
  fontWeight: 400,
  textShadow: `
            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${theme.custom.sideImage.captionGlowColor}
          `,
  // "-webkit-text-stroke": `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
  WebkitTextStroke: `0.125px ${theme.custom.sideImage.captionOutlineColor}`,

  [theme.breakpoints.up("sm")]: {
    top: `calc(100% + ${theme.custom.sideImage.captionOffset.sm})`,
    fontSize: theme.custom.sideImage.captionFontSize.sm,
  },
  [theme.breakpoints.up("md")]: {
    top: `calc(100% + ${theme.custom.sideImage.captionOffset.md})`,
    fontSize: theme.custom.sideImage.captionFontSize.md,
  },
}));

const FooterWrapper = styled(Box, {
  name: PREFIX,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})(({ theme }) => ({
  color: "#edad54",
  textShadow: `
            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${theme.custom.sideImage.captionGlowColor}
          `,
  // "-webkit-text-stroke": `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
  WebkitTextStroke: `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  // paddingBottom: theme.spacing(1),
  // backgroundColor: "#00000050",
}));

const IconsWrapper = styled(Box, {
  name: PREFIX,
  slot: "Icons",
  overridesResolver: (_props, styles) => styles.icons,
})(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  // "& .MuiBox-root": {
  //   borderRadius: "50px",
  //   backgroundColor: alpha(theme.palette.background.default, 0.725),
  // },
}));

/* Image section - hidden on mobile */
const SideImage = (inProps: SideImageProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    src = "/static/images/piseth_chesda_logo.svg",
    title = "បណ្ដាញសង្គមផ្លូវការ",
    ...rest
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) return null;

  return (
    <Root size={{ xs: 12, md: 6 }} {...rest}>
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
      <SideImage.logo src={src} caption={CAPTION} />
      <SideImage.footer title={title}>
        <Icons />
      </SideImage.footer>
      {/* Caption below logo */}
    </Root>
  );
};

SideImage.content = Content;
SideImage.circle = Circle;
SideImage.logo = ({ src, caption }: { src: string; caption: string }) => (
  <LogoWrapper>
    <Image
      preload={false}
      loading="eager"
      src={src}
      alt="logo"
      fill
      style={{ objectFit: "contain" }}
      unoptimized
    />
    <Caption>{caption}</Caption>
    {/* <SideImage.caption caption={caption} className={moul.className} /> */}
  </LogoWrapper>
);

SideImage.footer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <FooterWrapper>
    <Typography variant="subtitle2" fontWeight={700} align="center">
      {title}
    </Typography>
    <IconsWrapper>{children}</IconsWrapper>
  </FooterWrapper>
);

// SideImage.caption = ({ caption }: { caption: string }) => {
//   return <Caption>{caption}</Caption>;
// };

// SideImage.caption = ({
//   caption,
//   className,
// }: {
//   caption: string;
//   className?: string;
// }) => {
//   return <Caption className={className}>{caption}</Caption>;
// };

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
