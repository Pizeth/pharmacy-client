/* eslint-disable @typescript-eslint/no-empty-object-type */
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";
// import { LoginClasses } from "@/components/auth/login";
import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  line,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";
import {
  buildResponsiveShadow,
  createStarfield,
  generateShootingStars,
  generateTwinkleStars,
  makePulseKeyframes,
  makePulseVars,
  useResponsiveShootingStars,
} from "@/utils/colorUtils";
// import "@fontsource/moul";
import { getSideImageConfig } from "@/configs/themeConfig";
import {
  wee,
  filt,
  hi,
  hii,
  earthRotate,
  shake,
  move,
  drop,
  glowingStars,
  shootingStar,
  cloudMove,
  shining,
  tail,
  moveBackgroundLeft,
  twinkle,
  twinkling,
} from "./keyframes";
import { backdropClasses } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: Theme) => string[]);
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: Theme) => string[]);
  }

  interface ThemeVars {
    sideImage?: SideImage;
  }
  interface Theme {
    custom: {
      sideImage: SideImage;
      lines: line[];
    };
  }
  interface ThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: line[];
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey
    extends Record<keyof RazethComponentsPropsList, ClassKey> {}

  // ComponentsPropsList directly extends our map.
  interface ComponentsPropsList extends RazethComponentsPropsList {}

  interface Components extends CustomComponents {
    // Your custom components are now automatically included
    // You can still add standard MUI component overrides here if needed
  }

  // interface Components {
  //   RazethLogin?: {
  //     defaultProps?: ComponentsPropsList["RazethLogin"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethLogin"];
  //     variants?: Array<{
  //       props: Partial<LoginProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  //   RazethSideImage?: {
  //     defaultProps?: ComponentsPropsList["RazethSideImage"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethSideImage"];
  //     variants?: Array<{
  //       props: Partial<SideImageProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  //   RazethAvatar?: {
  //     defaultProps?: ComponentsPropsList["RazethAvatar"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethAvatar"];
  //     variants?: Array<{
  //       props: Partial<AvatarProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  //   RazethDivider?: {
  //     defaultProps?: ComponentsPropsList["RazethDivider"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethDivider"];
  //     variants?: Array<{
  //       props: Partial<DividerProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  //   RazethSignUpLink?: {
  //     defaultProps?: ComponentsPropsList["RazethSignUpLink"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethSignUpLink"];
  //     variants?: Array<{
  //       props: Partial<SignUpProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  //   RazethFooter?: {
  //     defaultProps?: ComponentsPropsList["RazethFooter"];
  //     styleOverrides?: ComponentsOverrides<
  //       Omit<Theme, "components">
  //     >["RazethFooter"];
  //     variants?: Array<{
  //       props: Partial<FooterProps>;
  //       style: (props: { theme: Theme }) => unknown;
  //     }>;
  //   };
  // }
}

// declare module "@mui/material/LinearProgress" {
//   interface LinearProgressProps {
//     ownerState?: {
//       strength?: number;
//     };
//   }
// }

// const pulseSoftness = keyframes`
//   0%, 100% {
//     background: radial-gradient(circle at 50% 50%, var(--app-gradient-soft-min));
//   }
//   25% {
//     background: radial-gradient(circle at 50% 50%, var(--app-gradient-soft-quart));
//   }
//   50% {
//     background: radial-gradient(circle at 50% 50%, var(--app-gradient-soft-mid));
//   }
//   75% {
//     background: radial-gradient(circle at 50% 50%, var(--app-gradient-soft-max));
//   }
// `;

const globalStyles = (theme: Theme) => ({
  // "*": {
  //   margin: 0,
  //   padding: 0,
  //   boxSizing: "border-box !important",
  // },
  "html, body, #__next": {
    height: "100%",
    margin: 0,
    padding: 0,
  },
  // body: {
  //   display: "table",
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: "#111",
  //   color: "#f2f2f2",
  //   lineHeight: 1.6,
  //   position: "relative",
  //   fontFamily: "sans-serif",
  //   overflow: "hidden",
  // },

  ":root": {
    ...makePulseVars(
      theme.custom.sideImage.circleColor,
      theme.custom.sideImage.circleStopCount,
      theme.custom.sideImage.circlePulseSequence
    ),
    "--app-sideImage-circleSize": theme.custom.sideImage.circleSize,
    // "--app-sideImage-circleColor": "#1e40af",
    "--app-sideImage-circleColor": theme.custom.sideImage.circleColor,
    "--app-sideImage-logoOffset": theme.custom.sideImage.logoOffset,
    "--app-circle-stop-count": theme.custom.sideImage.circleStopCount,
  },
  // Custom styles for a text field with an icon
  ".icon-input .MuiInputLabel-root": {
    marginLeft: "2em",
  },
  // Style for the shrunken label
  ".icon-input .MuiInputLabel-root.MuiInputLabel-shrink": {
    marginLeft: 0,
  },
  // Style for the icon button within the input
  ".icon-input .MuiIconButton-root": {
    padding: 0,
  },
  // Style for the password hint text
  ".passHint": {
    marginTop: "1em",
  },
  // Centering utility class
  ".text-center": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  /* Target ALL Boxes inside Stacks */
  ".MuiStack-root .MuiBox-root": {
    margin: `${theme.spacing(0)}`,
    padding: `${theme.spacing(0)}`,
    lineHeight: 0,
  },
  /* Specific to Password Strength Meter Box */
  ".MuiStack-root > .MuiBox-root:has(.MuiLinearProgress-root)": {
    marginTop: `${theme.spacing(0)}`,
    padding: `${theme.spacing(0)}`,
    // background-color: ${theme.palette.grey[100]};
  },
  /* For browsers without :has() support (fallback) */
  ".MuiStack-root > .MuiBox-root[data-pw-strength]": {
    marginTop: `${theme.spacing(0)}`,
    padding: `${theme.spacing(0)}`,
    // background-color: ${theme.palette.grey[100]};
  },
  // .MuiBox-root {
  //   // Default styles for all Box components
  //   margin: ${theme.spacing(0)};
  //   padding: ${theme.spacing(0)};

  //   // Specific styles for react-admin components
  //   &.RaFileInput-dropZone {
  //     border: 2px dashed ${theme.palette.divider};
  //     padding: ${theme.spacing(4)};
  //     text-align: center;
  //   }

  //   &.css-164r41r { // Password strength meter container
  //     margin-top: ${theme.spacing(0)};
  //     padding: ${theme.spacing(0)};
  //   }
  // }

  // .MuiStack-root > .MuiBox-root p.Mui-error {
  //   margin-bottom: -0.5em;
  // }
  // .MuiFormControl-root p.Mui-error {
  //   margin-bottom: -0.5em;
  // }

  ".lines": {
    position: "absolute",
    zIndex: 2,
    borderRadius: "50%",
    overflow: "hidden",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    margin: "auto",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  ".line": {
    position: "relative",
    width: "1px",
    height: "100%",
    overflow: "hidden",
  },
  ".line::after": {
    content: '""',
    display: "block",
    position: "absolute",
    height: "15vh",
    width: "100%",
    top: "-50%",
    left: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 75%, #ffffff 100%)",
    animation: `${drop} 7s 0s infinite`,
    animationFillMode: "forwards",
    animationTimingFunction: "cubic-bezier(0.4, 0.26, 0, 0.97)",
  },

  // Dynamically generated nth-child overrides
  ...Object.fromEntries(
    theme.custom.lines.map((line, i) => [
      `.line:nth-of-type(${i + 1})::after`,
      {
        background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${line.color} 75%, ${line.color} 100%)`,
        animationDelay: line.delay,
      },
    ])
  ),
});

const defaultThemeInvariants = {
  typography: {
    h6: {
      fontWeight: 400,
    },
  },
  sidebar: {
    width: 240,
    closedWidth: 50,
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        fullWidth: true,
      },
      variants: [
        {
          props: {},
          style: ({ theme }: { theme: Theme }) => ({
            [theme.breakpoints.down("sm")]: { width: "100%" },
          }),
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled" as const,
        margin: "dense" as const,
        size: "small" as const,
        fullWidth: true,
      },
      variants: [
        {
          props: {},
          style: ({ theme }: { theme: Theme }) => ({
            [theme.breakpoints.down("sm")]: { width: "100%" },
          }),
        },
      ],
    },
    MuiFormControl: {
      defaultProps: {
        variant: "filled" as const,
        margin: "dense" as const,
        size: "small" as const,
        fullWidth: true,
      },
    },
    RaSimpleFormIterator: {
      defaultProps: {
        fullWidth: true,
      },
    },
    RaTranslatableInputs: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
};

const customBaseTheme = createTheme({
  cssVariables: { cssVarPrefix: "app" },
  // cssVarPrefix: "app", // all vars will start with --app-
  custom: {
    sideImage: getSideImageConfig(),
    lines: [
      { color: "#FF4500", delay: "0.5s" },
      { color: "#32CD32", delay: "1s" },
      { color: "#1E90FF", delay: "1.5s" },
      { color: "#FFD700", delay: "2s" },
      { color: "#8A2BE2", delay: "2.5s" },
      { color: "#20B2AA", delay: "3s" },
      { color: "#DC143C", delay: "3.5s" },
      { color: "#00FA9A", delay: "4s" },
      { color: "#FF1493", delay: "4.5s" },
      { color: "#00BFFF", delay: "5s" },
    ],
  },
  palette: {
    primary: { main: "#e1232e", contrastText: "#fff" },
    secondary: { main: "#007bff" },
    error: { main: "#f58700" },
    warning: { main: "#FFD22B" },
    info: { main: "#f89696" },
    success: { main: "#2ece71" },
    // primary: { main: "#e1232e", contrastText: "#fff" },
    // secondary: { main: "#007bff", dark: "#0056b3" },
    // error: { main: "#f58700", dark: "#e76f51" },
    // warning: { main: "#FFD22B", dark: "#f58700" },
    // info: { main: "#f89696", dark: "#cc56e4" },
    // success: { main: "#2ece71", dark: "#079e0f" },
    mode: "dark",
    background: { default: "#121212", paper: "#1d1d1dbf" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
    // passwordStrength: ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"],
    passwordStrength: ["#aaaaaa", "#e76f51", "#f58700", "#0668d1", "#4caf50"],
    // passwordStrength: (theme) => [
    //   // This is a function that returns the array
    //   theme.palette.error.main,
    //   theme.palette.warning.main,
    //   theme.palette.info.main,
    //   theme.palette.success.main,
    //   theme.palette.success.dark,
    // ],
    // passwordStrength: (theme: Theme) => [
    //   theme.palette.error.main,
    //   theme.palette.warning.main,
    //   theme.palette.info.main,
    //   theme.palette.success.main,
    //   theme.palette.success.dark,
    // ],
  },
  components: {
    RazethLogin: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // padding: props.theme.spacing(2),
          backgroundColor:
            props.theme.palette.mode === "dark"
              ? props.theme.palette.grey[900]
              : props.theme.palette.grey[100],
          // backgroundImage: `
          //   repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
          //   repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
          //   repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
          // `,
          // backgroundSize: "24px 24px, 24px 24px, 8px 8px",
          background: `
            radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
            radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
            radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
            radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
            radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
            #000000
          `,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
              radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
            `,
            backgroundSize:
              "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
            backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none", // don't block interaction
            backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
          },
        }),
        overlay: (props: { theme: Theme }) => ({
          position: "relative",
          width: "100dvw",
          // maxWidth: "100%",
          // height: "100%",
          height: "100dvh",
          // maxHeight: "100%",
          // position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // width: "100%",
          // height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "#171717",
          color: "white",
          fontFamily: "Montserrat",
          fontWeight: "bold",
          padding: "1em 2em 1em 1em",
          // borderRadius: "20px",
          overflow: "hidden",
          zIndex: 1,
          // rowGap: "1em",
          "&::before": {
            content: '""',
            position: "absolute",
            /* */
            // width: "100%",
            // height: "100%",
            /* */
            // inset: "-3px",
            inset: 0,
            // borderRadius: "10px",
            // background: "radial-gradient(#858585, transparent, transparent)",
            // transform: "translate(-5px, 250px)",
            // transition: "0.4s ease-in-out",
            zIndex: -1,
            /* */
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            opacity: 1,
            // boxShadow:
            //   "140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff, 110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff, 220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff",
            // boxShadow: createStarfield(
            //   25,
            //   props.theme.custom.sideImage.starColors,
            //   props.theme.custom.sideImage.glowIntensity
            // ), // random stars
            transition: "1.5s ease",
            // animation: `${twinkle} 1s linear alternate infinite`,
            animationDelay: "0.4s",
          },
          // "&:hover::before": {
          //   width: "150%",
          //   height: "100%",
          //   marginLeft: "-4.25em",
          // },
          "&::after": {
            content: '""',
            position: "absolute",
            // inset: "2px",
            inset: 0,
            // borderRadius: "20px",
            // background: "rgba(23,23,23,0.7)",
            // transition: "all 0.4s ease-in-out",
            zIndex: -1,
            /* */
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            opacity: 1,
            // boxShadow:
            //   "490px 330px #fff, 420px 300px #fff, 320px 280px #fff, 380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff, 200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff, 120px 230px #fff, 350px -1px #fff, 150px 369px #fff",
            // boxShadow: createStarfield(
            //   25,
            //   props.theme.custom.sideImage.starColors,
            //   props.theme.custom.sideImage.glowIntensity
            // ), // random stars
            transition: "2s ease",
            // animation: `${twinkle} 1s linear alternate infinite`,
            animationDelay: "0.8s",
          },
        }),
        ambient: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          // top: 0,
          // bottom: 0,
          // right: 0,
          // background:
          //   "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
          background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
          backgroundSize: "contain",
          animation: `${cloudMove} 150s linear infinite`,
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            // background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
            background:
              "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
            backgroundSize: "contain",
            animation: `${moveBackgroundLeft} 500s linear infinite`,
          },
          // "::after": {
          //   content: '""',
          //   position: "absolute",
          //   inset: 0,
          //   background:
          //     "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
          //   backgroundSize: "contain",
          //   animation: `${moveBackgroundRight} 100s linear infinite`,
          // },
          // "&.MuiBox-root .stars": {
          //   background: `url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat`,
          //   position: "absolute",
          //   top: 0,
          //   bottom: 0,
          //   left: 0,
          //   right: 0,
          //   display: "block",
          //   // zIndex: 0,
          // },
          // "&.MuiBox-root .twinkling": {
          //   width: "10000px",
          //   height: "100%",
          //   background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png") repeat`,
          //   position: "absolute",
          //   right: 0,
          //   top: 0,
          //   bottom: 0,
          //   zIndex: 2,
          //   animation: `${moveBackgroundRight} 300s linear infinite`,
          // },
          // "&.MuiBox-root .clouds": {
          //   width: "10000px",
          //   height: "100%",
          //   background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
          //   backgroundSize: "contain",
          //   position: "absolute",
          //   right: 0,
          //   top: 0,
          //   bottom: 0,
          //   // zIndex: 3,
          //   animation: `${moveBackground} 150s linear infinite`,
          // },
        },
        effect: (props: { theme: Theme }) => ({
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          "& .shooting-star": {
            position: "absolute",
            // top: "-5vh", // random vertical
            // top: "-50%",
            // left: "15%",
            // left: "100vw", // start off-screen right
            // rotate: "315deg",
            // width: "5em",
            // width: "0.3vw",
            // height: `${props.theme.custom.sideImage.starSize}vh`,
            // borderRadius: "50%",
            // borderRadius: "100%",
            // boxShadow:
            //   "0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1)",
            // background: "linear-gradient(90deg, #fff, transparent)",
            // background: "#fff",
            // background: "linear-gradient(-45deg, #FFF, rgba(0, 0, 255, 0))",
            filter: "drop-shadow(0 0 7px var(--head-color))",
            animation: `${shootingStar} var(--glow-duration) linear infinite, ${tail} var(--glow-duration) linear infinite`,
            // animation: `${tail} 7s ease-in-out infinite`,
            animationFillMode: "backwards",
            // animationDirection: "reverse",
            willChange: "transform, opacity",
            offsetRotate: "auto" /* 👈 aligns with path direction */,
            // transition: "1s ease",
            // animationDelay: `${Math.random() * 10}s`,
            // "::before": {
            //   content: '""',
            //   position: "absolute",
            //   // top: "-50%",
            //   top: `calc(50% - 0.15vh)`,
            //   right: 0,
            //   // transform: "rotate(180deg) translateX(100%) translateY(-100%)",
            //   // width: "10em",
            //   height: "0.3vh",
            //   // offsetRotate: "auto",
            //   // background:
            //   //   "linear-gradient(90deg, var(--head-color), transparent)",
            //   background:
            //     "linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--head-color), rgba(0, 0, 255, 0))",
            //   borderRadius: "100%",
            //   transform: "translateX(50%) rotateZ(45deg)",
            //   animation: `${shining} 5s ease-in-out infinite`,
            //   animationFillMode: "backwards",
            // },
            // "::after": {
            //   content: '""',
            //   position: "absolute",
            //   top: `calc(50% - 0.15vh)`,
            //   right: 0,
            //   height: "0.3vh",
            //   background:
            //     "linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--head-color), rgba(0, 0, 255, 0))",
            //   borderRadius: "100%",
            //   transform: "translateX(50%) rotateZ(-45deg)",
            //   animation: `${shining} 5s ease-in-out infinite`,
            //   animationFillMode: "backwards",
            // },
          },
          // dynamically inject nth-of-type rules
          ...useResponsiveShootingStars(
            props.theme.custom.sideImage.shootingStarCount,
            // props.theme.custom.sideImage.minAngle,
            // props.theme.custom.sideImage.maxAngle,
            props.theme.custom.sideImage.shootingStarInterval,
            props.theme.custom.sideImage.curveFactor,
            props.theme.custom.sideImage.trajectoryMix,
            props.theme.custom.sideImage.starColors,
            props.theme.custom.sideImage.glowIntensity,
            props.theme.custom.sideImage.baseSpeed
          ).reduce((acc, star, i) => {
            acc[
              `& .${props.theme.custom.sideImage.shootingClass}:nth-of-type(${
                i + 1
              })`
            ] = {
              // Test Conent
              height: star.size,
              // top: star.top,
              // right: star.right,
              // left: "initial",
              // left: "100vw", // always start off-screen right
              animationDelay: star.delay,
              animationDuration: star.duration,
              animationFillMode: "forwards",
              // "--rot": star.rot, // per-star rotation variable
              offsetPath: star.path, // 👈 px-based, regenerated on resize
              // background: star.color,
              background: `linear-gradient(-45deg, ${star.color}, rgba(0, 0, 255, 0))`,
              "--head-color": star.color,
              "--trail-path": star.path,
              "--glow-duration": star.duration,
              boxShadow: star.glow,
              "::before": {
                content: '""',
                position: "absolute",
                // top: "-50%",
                top: `calc(50% - ${star.centerPoint})`,
                right: `calc(0% + ${star.centerPoint})`,
                // transform: "rotate(180deg) translateX(100%) translateY(-100%)",
                // width: "10em",
                height: star.size,
                // offsetRotate: "auto",
                // background:
                //   "linear-gradient(90deg, var(--head-color), transparent)",
                background:
                  "linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))",
                borderRadius: "100%",
                transform: "translateX(50%) rotateZ(45deg)",
                // animation: `${shining} 5s ease-in-out infinite`,
                animation: `${twinkling(
                  star.baseSize
                )} ${5} ease-in-out infinite`,
                animationFillMode: "backwards",
              },
              "::after": {
                content: '""',
                position: "absolute",
                top: `calc(50% - ${star.centerPoint})`,
                right: `calc(0% + ${star.centerPoint})`,
                height: star.size,
                background:
                  "linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--head-color), rgba(0, 0, 255, 0))",
                borderRadius: "100%",
                transform: "translateX(50%) rotateZ(-45deg)",
                // animation: `${shining} 5s ease-in-out infinite`,
                animation: `${twinkling(
                  star.baseSize
                )} ${5} ease-in-out infinite`,
                animationFillMode: "backwards",
              },
            };
            return acc;
          }, {} as Record<string, unknown>),
          ...generateTwinkleStars(
            props.theme.custom.sideImage.shootingStarCount,
            props.theme.custom.sideImage.starColors,
            props.theme.custom.sideImage.starSize
          ).reduce((acc, star, i) => {
            acc[
              `& .${props.theme.custom.sideImage.twinkleClass}:nth-of-type(${
                i + 1
              })`
            ] = {
              "--ray": "0.25vh",
              "--core": star.size,
              "--halo": "0.3vh",
              "--blurRay": `calc(${star.size}  * 3.5)`,
              position: "absolute",
              // left: `calc(${star.left} + ${star.centerPoint})`,
              // top: `calc(${star.top} + ${star.centerPoint})`,
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              boxShadow: star.glow,
              animation: `${twinkle} ${star.delay} linear alternate infinite`,
              pointerEvents: "none",
              "::before": {
                content: '""',
                position: "absolute",
                top: `calc(50% - ${star.centerPoint})`,
                right: `calc(0% + ${star.centerPoint})`,
                height: star.size,
                background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
                borderRadius: "100%",
                transform: "translateX(50%) rotateZ(45deg)",
                animation: `${twinkling(star.baseSize)} ${
                  star.delay
                } ease-in-out infinite`,
                // animationDelay: star.delay,
              },
              "::after": {
                content: '""',
                position: "absolute",
                top: `calc(50% - ${star.centerPoint})`,
                right: `calc(0% + ${star.centerPoint})`,
                height: star.size,
                background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
                borderRadius: "100%",
                transform: "translateX(50%) rotateZ(-45deg)",
                animation: `${twinkling(star.baseSize)} ${
                  star.delay
                } ease-in-out infinite`,
                // animationDelay: star.delay,
              },
            };
            return acc;
          }, {} as Record<string, unknown>),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "1px",
            height: "1px",
            borderRadius: "50%",
            opacity: 1,
            inset: 0,
            // boxShadow:
            //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
            // boxShadow: createStarfield(
            //   15,
            //   props.theme.custom.sideImage.starColors,
            //   props.theme.custom.sideImage.glowIntensity
            // ), // random stars
            zIndex: -1,
            transition: "3s ease",
            animation: `${twinkle} 5s linear alternate infinite`,
            // animation: `${twinkle} 1.5s linear alternate infinite`,
            animationDelay: "3s",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            opacity: 1,
            inset: 0,
            // boxShadow:
            //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
            // boxShadow: createStarfield(
            //   15,
            //   props.theme.custom.sideImage.starColors,
            //   props.theme.custom.sideImage.glowIntensity
            // ), // random stars
            zIndex: -1,
            transition: "5.5s ease",
            animation: `${twinkle} 7s linear alternate infinite`,
            // animation: `${twinkle} 1.5s linear alternate infinite`,
            animationDelay: "5s",
          },
        }),
        image: (props: { theme: Theme }) => ({
          position: "absolute",
          width: "5em",
          height: "5em",
          // marginRight: "1em",
          top: "2.5rem",
          left: "2.5rem",
          zIndex: 5,
          img: { animation: `${move} 10s ease-in-out infinite` },
          "&:hover": {
            cursor: "grab",
          },
          "&:active": {
            cursor: "grabbing",
          },
          // "&::before": {
          //   content: '""',
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   width: "1px",
          //   height: "1px",
          //   borderRadius: "50%",
          //   opacity: 1,
          //   inset: 0,
          //   // boxShadow:
          //   //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
          //   boxShadow: createStarfield(
          //     25,
          //     props.theme.custom.sideImage.starColors,
          //     props.theme.custom.sideImage.glowIntensity
          //   ), // random stars
          //   // zIndex: -1,
          //   transition: "1s ease",
          //   animation: `${glowingStars} 1s linear alternate infinite`,
          //   // animation: `${twinkle} 1.5s linear alternate infinite`,
          //   animationDelay: "0s",
          // },
          "&::after": {
            content: '""',
            position: "fixed",
            top: "-5rem",
            left: "-5rem",
            // top: 0,
            // left: 0,
            width: "10em",
            height: "10em",
            borderRadius: "50%",
            // background: "#f9f9fb",
            backgroundImage: `url('/static/images/full-moon.svg')`,
            // backgroundImage: `url('https://assets.science.nasa.gov/dynamicimage/assets/science/psd/lunar-science/2023/08/colormap_1500.jpg?w=1636&h=500&fit=clip&crop=faces%2Cfocalpoint')`,
            backgroundRepeat: "no-repeat" /* Prevents image tiling */,
            // backgroundPosition: "center" /* Centers the image */,
            backgroundSize: "cover",
            backgroundPosition: "left",
            bottom: 0,
            backgroundColor: "#f9f9fb",
            backgroundBlendMode: "multiply",
            boxShadow:
              "0px 0px 100px rgba(193,119,241,0.8), 0px 0px 100px rgba(135,42,211,0.8), inset #9b40fc 0px 0px 40px -12px",
            transition: "0.5s ease-in-out",
            // transition: "left 0.3s linear",
            // animation: `${moonRotate} 60s linear infinite`,
            zIndex: -1,
          },
          "&:hover::before": {
            filter: "blur(3px)",
          },
          "&:hover::after": {
            boxShadow:
              "0px 0px 200px rgba(193,119,241,1), 0px 0px 200px rgba(135,42,211,1), inset #9b40fc 0px 0px 40px -12px",
          },
        }),
        icon: {
          // postion: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          // columnGap: "0.5rem",
          zIndex: 1,
          button: {
            border: "none",
            padding: "0.75rem",
            margin: 0,
            minWidth: "1rem",
            borderRadius: "50%",
            // "&:hover": {
            //   transform: "scale(1.25)",
            // },
          },
          "& svg": {
            width: "1rem",
            height: "1rem",
            transition: "0.3s ease-in-out",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            "&:hover": {
              transform: "scale(1.5)",
            },
            borderRadius: "50%",
          },
          // "&::before": {
          //   content: '""',
          //   position: "absolute",
          //   width: "3px",
          //   height: "3px",
          //   borderRadius: "50%",
          //   opacity: 1,
          //   // boxShadow:
          //   //   "140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff, 110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff, 220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff",
          //   boxShadow: createStarfield(75), // random stars
          //   zIndex: -1,
          //   transition: "1.5s ease",
          //   animation: `${glowingStars} 1s linear alternate infinite`,
          //   animationDelay: "0.4s",
          // },
          // "&::after": {
          //   content: '""',
          //   position: "absolute",
          //   width: "3px",
          //   height: "3px",
          //   borderRadius: "50%",
          //   opacity: 1,
          //   // boxShadow:
          //   //   "490px 330px #fff, 420px 300px #fff, 320px 280px #fff, 380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff, 200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff, 120px 230px #fff, 350px -1px #fff, 150px 369px #fff",
          //   boxShadow: createStarfield(75), // random stars
          //   zIndex: -1,
          //   transition: "2s ease",
          //   animation: `${glowingStars} 1s linear alternate infinite`,
          //   animationDelay: "0.8s",
          // },
          // Specific provider color classes
          "& .web": {
            backgroundColor: "#ffffffff",
          },
          "& .meta::before": {
            content: '""',
            position: "absolute",
            zIndex: -1,
            // top: "10%",
            // left: "90%",
            top: "10vh" /* 10% of viewport height */,
            left: "100vw" /* start just outside right edge */,
            rotate: "-45deg",
            width: "5em",
            height: "1px",
            background: "linear-gradient(90deg, #fff, transparent)",
            animation: `${shootingStar} 4s ease-in-out infinite`,
            transition: "1s ease",
            animationDelay: "1s",
          },
          "& .meta": {
            // backgroundColor: "#0081FB",
          },
          "& .instagram": {
            background: "linear-gradient(45deg,#fd5,#ff543e,#c837ab,#3771c8)",
          },
          "& .telegram": {
            backgroundColor: "#229ed9",
          },
          "& .youtube": {
            backgroundColor: "#FF0000",
          },
          // // Provider-specific hover strokes
          // "& .web svg path": { stroke: "#2859c5" },
          // "& .meta svg path": { stroke: "#0081FB" },
          // "& .instagram svg path": { stroke: "#808080" },
          // "& .instagram:hover svg path": { stroke: "#cc39a4" },
          // "& .telegram svg path": { stroke: "#229ed9" },
          // "& .youtube svg path": { stroke: "#FF0000" },
          // // Scale effects
          // "& .instagram:hover svg": { transform: "scale(1.4)" },
          // "& .telegram:hover svg, & .youtube:hover svg": {
          //   transform: "scale(1.25)",
          // },
        },

        content: (props: { theme: Theme }) => ({
          width: "100%",
          maxWidth: "100%",
          // [props.theme.breakpoints.up("lg")]: {
          //   // maxWidth: "750px",
          //   maxWidth: "50%",
          // },
          [props.theme.breakpoints.up("md")]: {
            maxWidth: "min(80%, 750px)",
          },
          [props.theme.breakpoints.up("lg")]: {
            maxWidth: "max(750px, 50%)",
          },
          "& .MuiFormControl-root": {
            // marginTop: "0.5em",
            // marginBottom: "0",
          },
          // "& .MuiGrid-container": { gap: 0 },
          // zIndex: 1,
        }),

        card: (props: { theme: Theme }) => ({
          position: "relative",
          // zIndex: 2,
          overflow: "visible",
          borderRadius: props.theme.spacing(2),
          boxShadow: props.theme.shadows[3],
          /*** Paper Texture ***/
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
          `,
          backgroundSize: "8px 8px, 32px 32px, 32px 32px",
          backgroundColor: props.theme.palette.background.paper,

          /*** Gradient Glow Effect ***/
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          // userSelect: "none",
          // animation: `${gradientShift} 10s ease-in-out infinite` /* Faster animation */,

          // "&::before, &::after": {
          //   content: '""',
          //   position: "absolute",
          //   top: "calc(var(--size) / -2)",
          //   left: "calc(var(--size) / -2)",
          //   width: "calc(100% + var(--size))",
          //   height: "calc(100% + var(--size))",
          //   background: `
          //   radial-gradient(circle at 0 0, hsl(27deg 93% 60%), transparent),
          //   radial-gradient(circle at 100% 0, #00a6ff, transparent),
          //   radial-gradient(circle at 0 100%, #ff0056, transparent),
          //   radial-gradient(circle at 100% 100%, #6500ff, transparent)
          // `,
          // },
          // "&::after": {
          //   "--size": "2px",
          //   // zIndex: "-1",
          // },
          // "&::before": {
          //   "--size": "5px",
          //   // zIndex: "-2",
          //   filter: "blur(0.25vmin)",
          //   animation: `${blurAnimation} 3s ease-in-out alternate infinite`,
          // },

          // "&::before, &::after": {
          //   content: '""',
          //   position: "absolute",
          //   left: "-1px",
          //   top: "-1px",
          //   // borderRadius: "5%",
          //   background: `
          //   linear-gradient(
          //     45deg,
          //     hsl(27deg 93% 60%),
          //   #00a6ff,
          //   #ff0056,
          //   #6500ff
          //   )
          // `,

          //   //   // #fb0094,
          //   //   // #0000ff,
          //   //   // #00ff00,
          //   //   // #ffff00,
          //   //   // #ff0000,
          //   //   // #fb0094,
          //   //   // #0000ff,
          //   //   // #00ff00,
          //   //   // #ffff00,
          //   //   // #ff0000

          //   backgroundSize: "250%",
          //   width: "calc(100% + 2px)",
          //   height: "calc(100% + 2px)",
          //   // zIndex: -99,
          //   animation: `${steam} 60s linear infinite`,
          // },
          // "&::after": {
          //   filter: "blur(1vmin)",
          // },
          "& .MuiGrid-container": {
            position: "relative",
            zIndex: 1,
            // background: "linear-gradient(0deg, #000, #272727)",
            // backgroundImage: `
            //   repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            //   repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            //   repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
            // `,
            // backgroundSize: "24px 24px, 24px 24px, 8px 8px",

            backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
            `,
            backgroundSize: "44px 44px",
          },
          // "& .card-content": {
          "& .MuiCardContent-root": {
            backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
            // backgroundImage: `
            //   repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
            //   repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
            //   repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
            //   repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
            // `,
            // padding: props.theme.spacing(3),
            // "& .card-box": {
            //   display: "flex",
            //   flexDirection: "column",
            //   gap: 0,
            // },
          },
        }),
      },
      // 👇 Variants
      variants: [
        {
          props: { variant: "compact" },
          style: ({ theme }: { theme: Theme }) => ({
            // Target slots using their MUI-generated global class names
            // The format is '& .Mui[ComponentName]-[slotName]'
            "& .MuiRazethLogin-content": {
              [theme.breakpoints.up("md")]: {
                maxWidth: "500px",
              },
            },
            "& .MuiRazethLogin-card": {
              borderRadius: theme.spacing(1),
              boxShadow:
                theme.palette.mode === "dark"
                  ? theme.shadows[2]
                  : theme.shadows[1],
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.background.paper,
            },
          }),
        },
        {
          props: { variant: "full" },
          style: ({ theme }: { theme: Theme }) => ({
            "& .MuiRazethLogin-content": {
              [theme.breakpoints.up("md")]: {
                // maxWidth: "750px",
                maxWidth: "75%",
              },
            },
            "& .MuiRazethLogin-card": {
              borderRadius: theme.spacing(3),
              boxShadow:
                theme.palette.mode === "dark"
                  ? theme.shadows[8]
                  : theme.shadows[6],
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.background.paper,
            },
          }),
        },
      ],
    },
    RazethSideImage: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          position: "relative",
          /*** New CSS ***/
          overflow: "hidden", // prevents scrollbars
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "#f97316", // orange background
          "&::before": {
            content: "''",
            position: "absolute",
            inset: 0,
            "--c": "7px",
            // backgroundColor: "#000",
            backgroundImage: `
              radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
              radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
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

          // height: "100%",
          // backgroundColor:
          //   props.theme.palette.mode === "dark"
          //     ? "rgba(0, 0, 0, 0.2)"
          //     : props.theme.palette.grey[200],
          // inset: "-1em",
        }),
        content: (props: { theme: Theme }) => ({
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
        }),
        card: (props: { theme: Theme }) => ({
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: props.theme.custom.sideImage.circleSize || "35%", // one-third of parent width
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
          boxShadow: `0 0 20px 10px ${props.theme.palette.primary.main}50`,
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
              props.theme.custom.sideImage.circlePulseSequence
            )} ${
              props.theme.custom.sideImage.circlePulseDuration
            } ease-in-out infinite`,
            // backgroundSize: "100% 100%",
          },

          /*** Animation ***/
          // "--c": "#09f",
          backgroundColor: "#000",
          backgroundImage:
            props.theme.custom.sideImage.animationBackground.backgroundImage,
          backgroundSize:
            props.theme.custom.sideImage.animationBackground.backgroundSize,

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
            backgroundSize: "8px 8px",
            "--f": "blur(1em) brightness(6)",
            animation: `${hii} 10s linear infinite`,
          },
        }),
        image: (props: { theme: Theme }) => ({
          position: "relative",
          zIndex: 2,

          aspectRatio: "1 / 1",

          width: props.theme.custom.sideImage.logoSize,
          overflow: "visible",
          inset: 0,
          objectFit: "cover",
          ...(props.theme.palette.mode === "dark" &&
            {
              // filter: "brightness(0.25) grayscale(1)",
              // filter:
              //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
            }),
        }),
        caption: (props: { theme: Theme }) => ({
          position: "absolute",
          top: `calc(100% + ${props.theme.custom.sideImage.captionOffset.xs})`,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          // 👇 key changes
          whiteSpace: "nowrap", // prevent wrapping
          overflow: "visible", // allow text to extend beyond logo box
          maxWidth: "none", // remove inherited width limit
          color: "#edad54",
          textAlign: "center",
          fontSize: props.theme.custom.sideImage.captionFontSize.xs,
          textShadow: `
            -0.5px -0.5px 0 ${props.theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${props.theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${props.theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${props.theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${props.theme.custom.sideImage.captionGlowColor}
          `,
          // "-webkit-text-stroke": `0.125px ${props.theme.custom.sideImage.captionOutlineColor}`,
          WebkitTextStroke: `0.125px ${props.theme.custom.sideImage.captionOutlineColor}`,

          [props.theme.breakpoints.up("sm")]: {
            top: `calc(100% + ${props.theme.custom.sideImage.captionOffset.sm})`,
            fontSize: props.theme.custom.sideImage.captionFontSize.sm,
          },
          [props.theme.breakpoints.up("md")]: {
            top: `calc(100% + ${props.theme.custom.sideImage.captionOffset.md})`,
            fontSize: props.theme.custom.sideImage.captionFontSize.md,
          },
        }),
      },
    },
    RazethAvatar: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          margin: props.theme.spacing(0, 0, 0, 0),
          // display: "flex",
          // justifyContent: "center",
          display: "flex", // Use flexbox for alignment
          flexDirection: "column", // Arrange items vertically
          alignItems: "center", // Center items horizontally
          "& .MuiAvatar-root": {
            "--avatar-size": "min(12vmin, 70px)", // responsive size
            width: "var(--avatar-size)",
            height: "var(--avatar-size)",

            marginBottom: props.theme.spacing(1),
            backgroundImage: `url('https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg')`,
            // backgroundColor: "#e72d32",
            // background: "linear-gradient(135deg, #1e1e24 10%, #050505 60%)",
            color: props.theme.palette.primary.main,
            position: "relative",

            /*** Globe Animation ***/
            zIndex: 5,
            transition: "left 0.5s linear",
            backgroundSize: "cover",
            backgroundPosition: "left",
            bottom: 0,
            borderRadius: "50%",
            animation: `${earthRotate} 90s linear infinite`,
            // boxShadow: `
            //   0px 0 20px rgba(255, 255, 255, 0.2),
            //   -5px 0px 8px #c3f4ff inset,
            //   15px 2px 25px #000 inset,
            //   -24px -2px 34px #c3f4ff99 inset,
            //   250px 0px 44px #00000066 inset,
            //   150px 0px 38px #000000aa inset
            // `,
            // boxShadow: `0px 0 3px rgba(255,255,255,0.2),
            //   -1px 0px 1px #c3f4ff inset,
            //   2px 0px 4px #000 inset,
            //   -4px 0px 5px #c3f4ff99 inset,
            //   40px 0px 7px #00000066 inset,
            //   24px 0px 6px #000000aa inset;`,
            boxShadow: buildResponsiveShadow(),
            //   "&::before": {
            //     content: '""',
            //     position: "absolute",
            //     inset: 0,
            //     borderRadius: "50%",
            //     background: `
            //   radial-gradient(circle at 0 0, hsl(27deg 93% 60%), transparent),
            //   radial-gradient(circle at 100% 0, #00a6ff, transparent),
            //   radial-gradient(circle at 0 100%, #ff0056, transparent),
            //   radial-gradient(circle at 100% 100%, #6500ff, transparent)
            // `,
            //     // zIndex: -1,
            //     filter: "blur(100vmin)",
            //     animation: `${blurPulse} 3s ease-in-out alternate infinite`,
            //   },
          },
          "& svg": { fill: "#fff" },
        }),
      },
    },
    RazethLoginForm: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          ["& .MuiCardContent-root"]: {
            minWidth: 300,
            padding: `${props.theme.spacing(0)}`,
          },
        }),
        content: (props: { theme: Theme }) => ({
          display: "flex",
          flexDirection: "column",
          gap: props.theme.spacing(0),
          // justifyContent: "center" /* Centers items horizontally */,
          // alignItems: "center" /* Centers items vertically */,
          input: {
            // color: "#444", // default
            // transition: "color 0.3s ease",
            transition: props.theme.transitions.create("color", {
              easing: props.theme.transitions.easing.easeInOut,
              duration: props.theme.transitions.duration.short,
            }),
            "&:focus": {
              // color: "#e1232e", // focused
              color: props.theme.palette.primary.main, // focused
            },
          },
          // Apply custom styles to the last child element inside this container
          "& > :last-child": {
            // For example, you could add extra margin to the button
            // if it's the last item. Let's override its default top margin.
            marginTop: props.theme.spacing(1),
          },
        }),
        password: (props: { theme: Theme }) => ({
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: props.theme.spacing(0),
        }),
        footer: (props: { theme: Theme }) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 500,
          marginTop: "-0.5rem",
          width: "100%",
          gap: props.theme.spacing(0),
          // ["& a"]: {
          //   color: props.theme.palette.primary.main,
          //   textDecoration: "underline",
          //   textUnderlineOffset: "2px",
          //   "&:hover": {
          //     textDecoration: "underline",
          //   },
          // },
        }),
        button: (props: { theme: Theme }) => ({
          marginTop: props.theme.spacing(1),
          // paddingTop: theme.spacing(1.5),
          // paddingBottom: theme.spacing(1.5),
          // mt: 1,
          // py: 1.5,
          fontWeight: 700,
          // maxWidth: "100%",
          // [props.theme.breakpoints.up("sm")]: {
          //   maxWidth: "70%",
          // },
          // [props.theme.breakpoints.up("md")]: {
          //   maxWidth: "50%",
          // },
          ["& .MuiSvgIcon-root"]: { margin: props.theme.spacing(0.3) },
        }),
      },
    },
    RazethDivider: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginTop: props.theme.spacing(2),
          marginBottom: props.theme.spacing(2),
          ["& .MuiDivider-root"]: { flex: 1 },
          ["& .MuiTypography-root"]: {
            paddingLeft: props.theme.spacing(2),
            paddingRight: props.theme.spacing(2),
            backgroundColor: props.theme.palette.background.paper,
            color: props.theme.palette.text.secondary,
          },
        }),
      },
    },
    RazethSocialLogin: {
      styleOverrides: {
        content: (props: { theme: Theme }) => ({
          button: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: props.theme.spacing(1),
            width: "100%",
            padding: props.theme.spacing(1),
            textTransform: "none",
            border: `1px solid ${props.theme.palette.divider}`,
            // transition: "transform 0.3s ease-in-out", // smooth scaling
            // Use theme.transitions.create for consistency
            transition: props.theme.transitions.create(
              ["transform", "background-color"],
              {
                duration: props.theme.transitions.duration.standard,
                easing: props.theme.transitions.easing.easeInOut,
              }
            ),
            // "& .MuiTypography-root": {
            //   fontWeight: "500",
            //   display: "none", // Hide by default
            //   [props.theme.breakpoints.up("sm")]: {
            //     display: "block", // This applies for 'sm' and larger breakpoints
            //   },
            // },
            "&:hover": {
              border: `1px solid ${props.theme.palette.divider}`,
              backgroundColor: props.theme.palette.action.hover,
              transform: "scale(1.05)", // enlarge smoothly
              boxShadow: props.theme.shadows[3],
            },
            "& svg": {
              width: props.theme.spacing(2),
              height: props.theme.spacing(2),
            },
          },
        }),
      },
    },
    RazethSocialButton: {
      styleOverrides: {
        label: (props: { theme: Theme }) => ({
          fontWeight: "500",
          display: "none", // Hide by default
          [props.theme.breakpoints.up("sm")]: {
            display: "block", // This applies for 'sm' and larger breakpoints
          },
        }),
      },
    },
    RazethSignUpLink: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: props.theme.spacing(0.5), // The space is now handled by the gap property
          textAlign: "center",
          // fontSize: "0.875rem",
          marginTop: props.theme.spacing(2),
          color: props.theme.palette.text.secondary,
          button: {
            //   color: theme.palette.primary.main,
            //   textDecoration: "underline",
            //   textUnderlineOffset: "2px",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            svg: {
              marginLeft: props.theme.spacing(0.5),
              fontSize: "1rem",
              // paddingBottom: "3px",
            },
          },
        }),
      },
    },
    RazethFooter: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          textAlign: "center",
          marginTop: props.theme.spacing(1),
          color: props.theme.palette.text.secondary,
          position: "relative",
          // fontSize: "0.75rem",
          // ["& .MuiBox-root"]: {
          //   display: "flex",
          //   alignItems: "center",
          //   justifyContent: "center",
          //   gap: props.theme.spacing(0.5), // The space is now handled by the gap property
          //   marginBottom: props.theme.spacing(0.5),
          // },
          ["& .MuiTypography-root"]: {
            marginTop: props.theme.spacing(0.5),
            // paddingTop: props.theme.spacing(0.5),
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: props.theme.spacing(0.5), // The space is now handled by the gap property
            // marginBottom: props.theme.spacing(0.5),
            a: {
              margin: props.theme.spacing(0),
              display: "inline-flex",
              alignItems: "center",
            },
            // "& > :last-child": {
            //   // For example, you could add extra margin to the button
            //   // if it's the last item. Let's override its default top margin.
            //   marginRight: props.theme.spacing(-0.5),
            // },
            "& > :last-child::after": {
              color: props.theme.palette.text.secondary,
              textDecoration: "none",
              marginLeft: props.theme.spacing(-0.5),
              content: '"."',
            },
            "& > :last-child:hover::after": {
              textDecoration: "none",
              // content: '" - Hover Text!"' /* Text to be displayed on hover */,
              // opacity: 1 /* Make the text visible on hover */,
            },
          },
        }),
      },
    },

    /***** MUI's COMPONENTs *****/
    MuiAppBar: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          // backgroundColor: props.theme.palette.primary.main, // Customize the AppBar background color
          backgroundColor: "#c40316", // Customize the AppBar background color
          color: props.theme.palette.text.primary, // Customize font color
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          "&.shake span": {
            animation: `${shake} 0.5s ease-in-out`,
            display: "inline-block",
            /* vertical-align: middle; */
            position: "relative",
            /* font-size: 1rem; */
            /* transform: translateY(0); */
            /* transform: none !important; */
          },
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: "0.5em",
          marginBottom: "0.5em",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: "0.5em",
          marginBottom: "-0.5em",
          // "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
          // Apply styles when the helper text is in an error state
          "&.hideHelper": {
            lineHeight: "0",
            marginTop: "0",
            marginBottom: "0",
          },
          "&.showHelper": {
            // lineHeight: "0",
            marginTop: "0.5em",
            // marginBottom: "0",
          },
          "&.Mui-error": {
            marginBottom: "-0.5em", // Negative margin adjustment
            marginTop: "0.5em",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-caption": {
            // marginLeft: "0.25em",
            // weight: "bold",
            // fontWeight: "bold",
          },
          "&.MuiTypography-body1": {
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: props.theme.palette.error.main,
          // },
          // "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
          //   color: props.theme.palette.primary.main,
          // },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: props.theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: props.theme.palette.error.main,
          },
        }),
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          "&.MuiButton-root": {
            color: props.theme.palette.text.primary,
          },
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          color: props.theme.palette.primary.main,
          textDecoration: "none",
          // textUnderlineOffset: "2px",
          "&:hover": {
            textDecoration: "underline",
            textUnderlineOffset: props.theme.spacing(0.5),
            color: "#9d1820ff",
          },
        }),
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: (props: { theme: Theme }) => ({
    //       padding: "0",
    //     }),
    //   },
    // },
    MuiCssBaseline: {
      styleOverrides: (theme) => globalStyles(theme),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&.MuiBox-root": {
            // color: props.theme.palette.primary.main,
            margin: "0px",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        // Target the bar itself
        // bar: {
        //   backgroundColor: "#4caf50", // Custom color
        //   borderRadius: "4px", // Rounded corners
        //   height: "10px", // Adjust thickness
        // },
        // Optional: Override other states (e.g., buffer or query animation)
        // colorPrimary: {
        // backgroundColor: "#e0e0e0", // Background color of the progress track
        // backgroundColor: "#bd222a",
        // },

        root: ({ theme }) => ({
          height: 5,
          borderRadius: 5,
          // backgroundColor: "#bd222a",
          // backgroundColor: "#e0e0e0",
        }),
        // bar: ({ theme, ownerState }) => {
        //   // Resolve the passwordStrength array properly
        //   const strengthColors =
        //     typeof theme.palette.passwordStrength === "function"
        //       ? theme.palette.passwordStrength(theme)
        //       : theme.palette.passwordStrength || [];

        //   return {
        //     borderRadius: 4,
        //     backgroundColor:
        //       ownerState?.strength !== undefined
        //         ? strengthColors[
        //             Math.min(ownerState.strength, strengthColors.length - 1)
        //           ]
        //         : theme.palette.primary.main,
        //   };
        // },
        // bar: ({ theme, ownerState }) => {
        //   // Handle fallback for passwordStrength array
        //   const strengthColors = Array.isArray(theme.palette.passwordStrength)
        //     ? theme.palette.passwordStrength
        //     : ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"];

        //   const strength = ownerState?.strength ?? 0;

        //   return {
        //     borderRadius: 4,
        //     backgroundColor:
        //       strengthColors[Math.min(strength, strengthColors.length - 1)],
        //   };
        // },
        // Add this to fix the colorPrimary error
        // colorPrimary: ({ theme }) => ({
        //   backgroundColor: theme.palette.grey[300],
        // }),

        // bar: ({ theme, ownerState }) => ({
        //   borderRadius: 4,
        //   // Use ownerState to access custom props
        //   backgroundColor:
        //     ownerState?.strength !== undefined
        //       ? Array.isArray(theme.palette.passwordStrength)
        //         ? theme.palette.passwordStrength[
        //             Math.min(
        //               ownerState.strength as number,
        //               theme.palette.passwordStrength.length - 1,
        //             )
        //           ]
        //         : theme.palette.primary.main
        //       : theme.palette.primary.main,
        // }),
        // bar: ({ theme, ownerState }) => ({
        //   borderRadius: 4,
        //   backgroundColor:
        //     ownerState?.strength !== undefined &&
        //     Array.isArray(theme.palette.passwordStrength)
        //       ? theme.palette.passwordStrength[
        //           Math.min(
        //             ownerState.strength,
        //             theme.palette.passwordStrength.length - 1,
        //           )
        //         ]
        //       : theme.palette.primary.main,
        // }),
      },
    },
    // MuiFormHelperText: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       marginLeft: "2em",
    //       "&.MuiInputLabel-shrink": { marginLeft: "0" },
    //       "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
    //     },
    //   },
    // },
    // MuiInputBase: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error": {
    //         borderColor: (theme: Theme) => theme.palette.error.main,
    //       },
    //     },
    //     input: {
    //       "&::placeholder": {
    //         color: (theme: Theme) => theme.palette.error.main,
    //         transition: "color 0.5s",
    //       },
    //     },
    //   },
    // },
    // MuiInputAdornment: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.error.main,
    //       },
    //     },
    //   },
    // },
  },
});

// Merge custom base theme with defaults const
export const darkTheme: RaThemeOptions = deepmerge(
  defaultThemeInvariants,
  customBaseTheme
);

export const lightTheme = deepmerge(defaultTheme, {
  palette: {
    // primary: {
    //   light: "#fb402f",
    //   main: "#ba000d",
    //   // main: "#F70019",
    //   dark: "#e60023",
    //   contrastText: "#fff",
    // },
    // secondary: {
    //   light: "##348dce",
    //   main: "#226fb0",
    //   dark: "#0d4280",
    //   contrastText: "#000",
    // },
    primary: red,
    secondary: blue,
    error: {
      // main: "#d32f2f", // Custom color for error
      // main: "#e76f51", // Custom color for error
      main: "#ffa000",
      light: "#f58700",
      dark: "#FFD22B",
    },
    warning: {
      main: "#ffa000", // Custom color for warning
    },
    success: {
      main: "#079e0f", // Custom color for success
    },
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
  },
});

export const darkTheme1 = deepmerge(defaultDarkTheme, {
  palette: {
    primary: {
      mode: "dark",
      // main: "#ba000d",
      // main: "#F70019",
      main: "#e60023",
      contrastText: "#fff",
    },
    secondary: { main: "#03dac6" },
    error: {
      // main: "#d32f2f", // Custom color for error
      // main: "#e76f51", // Custom color for error
      main: "#ffa000",
      // main: "#FFD22B",
      // light: "#f58700",
      // dark: "#FFD22B",
    },
    // background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
    background: { default: "#313131" },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          borderColor: props.theme.palette.error.main,
          "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: props.theme.palette.error.main,
          // },
          // "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
          //   color: props.theme.palette.primary.main,
          // },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: props.theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: props.theme.palette.error.main,
          },
        }),
      },
    },

    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderColor: (theme: Theme) => theme.palette.error.main,
    //       "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.primary.main,
    //       },
    //       // Focus state
    //       "&.Mui-focused .MuiSvgIcon-root": {
    //         color: "#e60023",
    //       },

    //       // Error state
    //       "&.Mui-error .MuiSvgIcon-root": {
    //         color: "#ffa000",
    //       },
    //     },
    //   },
    // },
  },
});
