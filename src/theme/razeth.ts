/* eslint-disable @typescript-eslint/no-empty-object-type */
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";
// import { LoginClasses } from "@/components/auth/login";
import { ClassKey, CustomComponents } from "@/types/classKey";
import { keyframes } from "@emotion/react";
import {
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";

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
    };
  }
  interface ThemeOptions {
    custom?: {
      sideImage?: SideImage;
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

const shake = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1px);
  }
  50% {
    transform: translateX(1px);
  }
  75% {
    transform: translateX(-1px);
  }
  100% {
    transform: translateX(0);
  }
    `;

const filt = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}`;

const wee = keyframes`
  0% {
    background-position:
      var(--p),
      800% 400%,
      1000% -400%,
      -1200% -600%,
      400% 41.5692194px;
  }
  to {
    background-position:
      var(--p),
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%;
  }
}`;

const globalStyles = (theme: Theme) => ({
  ":root": {
    "--app-sideImage-circleSize": "30%",
    "--app-sideImage-circleColor": "#1e40af",
    "--app-sideImage-logoOffset": "3%",
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
    sideImage: {
      circleSize: "30%",
      circleColor: "#1e40af",
      logoOffset: "3%",
    },
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
    background: { default: "#121212", paper: "#1d1d1d" },
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
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: props.theme.spacing(2),
          backgroundColor:
            props.theme.palette.mode === "dark"
              ? props.theme.palette.grey[900]
              : props.theme.palette.grey[100],
          backgroundImage: `
         repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
      `,
          backgroundSize: "24px 24px, 24px 24px, 8px 8px",
          background: `
       radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
       radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
       radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
       radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
       radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
       #000000
     `,
        }),

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
        }),

        card: (props: { theme: Theme }) => ({
          overflow: "hidden",
          borderRadius: props.theme.spacing(2),
          boxShadow: props.theme.shadows[3],
          // backgroundImage: `
          //  repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
          //       repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
          //       `,
          // backgroundSize: "44px 44px",
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

          // "& .card-content": {
          "& .MuiCardContent-root": {
            padding: props.theme.spacing(3),
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
          overflow: "hidden",
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

          // backgroundImage: `
          //  repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
          //       repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
          //       `,
          // backgroundSize: "44px 44px",

          // backgroundImage: `
          //   radial-gradient(circle at 50% 50%,
          //     rgba(220, 38, 38, 0.2) 0%,
          //     rgba(220, 38, 38, 0.12) 25%,
          //     rgba(220, 38, 38, 0.06) 35%,
          //     transparent 50%
          //   )
          // `,
          // backgroundSize: "100% 100%",

          // height: "100%",
          // backgroundColor:
          //   props.theme.palette.mode === "dark"
          //     ? "rgba(0, 0, 0, 0.2)"
          //     : props.theme.palette.grey[200],
          // inset: "-1em",
          "& img": {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...(props.theme.palette.mode === "dark" &&
              {
                // filter: "brightness(0.25) grayscale(1)",
                // filter:
                //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
              }),
          },
        }),
        content: (props: { theme: Theme }) => ({
          position: "absolute",
          // maxWidth: "300px",
          // maxHeight: "300px",
          // width: "25%",
          // height: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: props.theme.custom.sideImage.circleSize || "35%", // one-third of parent width
          // width: "var(--app-sideImage-circleSize)", // one-third of parent width
          aspectRatio: "1 / 1", // keep height equal to width
          // paddingTop: "var(--app-sideImage-circleSize)", // makes height equal to width
          // borderRadius: "50%",

          backgroundImage: `
         repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
      `,
          backgroundSize: "24px 24px, 24px 24px, 8px 8px",
          backgroundColor:
            props.theme.custom.sideImage.circleColor || "#02020280", // blue circle
          backgroundBlendMode: "multiply",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // center it
          // "&::before": {
          //   content: "''",
          //   position: "absolute",
          //   borderRadius: "50%",
          //   inset: 0,
          //   "--c": "7px",
          //   // backgroundColor: "#000",
          //   backgroundImage: `
          //     radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
          //     radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
          //     radial-gradient(circle at 50% 50%, #f00, #f000 60%),
          //     radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
          //     radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
          //     radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
          //   `,
          //   backgroundSize: `
          //     12px 20.7846097px,
          //     12px 20.7846097px,
          //     200% 200%,
          //     200% 200%,
          //     200% 200%,
          //     200% 20.7846097px
          //   `,
          //   "--p": "0px 0px, 6px 10.39230485px",
          //   backgroundPosition: `
          //     var(--p),
          //     0% 0%,
          //     0% 0%,
          //     0% 0px
          //   `,
          //   animation: `${wee} 40s linear infinite, ${filt} 6s linear infinite`,
          //   zIndex: 0,
          // },
        }),
        image: (props: { theme: Theme }) => ({
          position: "relative",
          zIndex: 2,
          // width: "120px", // fixed size, won’t scale with container
          // height: "120px",
          aspectRatio: "1 / 1",
          width:
            `calc(
              ${props.theme.custom.sideImage.circleSize} -
                ${props.theme.custom.sideImage.logoOffset}
            )` || "32%",
          objectFit: "cover",
          ...(props.theme.palette.mode === "dark" &&
            {
              // filter: "brightness(0.25) grayscale(1)",
              // filter:
              //   "grayscale(1) sepia(1) saturate(5) hue-rotate(315deg) brightness(1)",
            }),
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
            marginBottom: props.theme.spacing(1),
            backgroundColor: "#e72d32",
            position: "relative",
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
          gap: props.theme.spacing(0),
        }),
        footer: (props: { theme: Theme }) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 500,
          marginTop: "-0.5rem",
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
