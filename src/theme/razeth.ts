"use client";
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import { createTheme, PaletteMode, Theme } from "@mui/material/styles";
import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  Line,
  Meteor,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";
import { makePulseVars } from "@/utils/themeUtils";
import { getMeteorConfig, getSideImageConfig } from "@/configs/themeConfig";
import { shake } from "./keyframes";
import {
  RazethAvatarOptimized,
  RazethLoginOptimized,
  RazethMeteorOptimized,
  RazethShootingStarOptimized,
  RazethSideImageOptimized,
  RazethTwinkleStarOptimized,
} from "@/theme/components";

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
      lines: Line[];
      meteor: Meteor;
    };
  }
  interface ThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: Line[];
      meteor?: Meteor;
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey extends Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {}

  // ComponentsPropsList directly extends our map.
  interface ComponentsPropsList extends RazethComponentsPropsList {}

  interface Components extends CustomComponents {
    // Your custom components are now automatically included
    // You can still add standard MUI component overrides here if needed
  }
}

const globalStyles = (theme: Theme) => ({
  "html, body, #__next": {
    height: "100%",
    margin: 0,
    padding: 0,
    fontFamily: [
      "Roboto",
      "Helvetica",
      "sans-serif",
      "var(--font-siemreap)",
    ].join(","),
  },

  main: {
    marginTop: "65px",
  },

  ":root": {
    ...makePulseVars(
      theme.custom.sideImage.circleColor,
      theme.custom.sideImage.circleStopCount,
      theme.custom.sideImage.circlePulseSequence,
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
});

const defaultThemeInvariants = {
  typography: {
    // fontFamily: "var(--font-siemreap)",
    // h5: {
    //   fontFamily: "var(--font-siemreap)",
    // },
    fontFamily: [
      "Roboto",
      "Helvetica",
      "sans-serif",
      "var(--font-siemreap)",
    ].join(","),
    h6: {
      fontWeight: 700,
      fontFamily: "var(--font-moul)", // Use Moul for headers like "Kingdom of Cambodia"
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

export const RazethBaseTheme = (mode: PaletteMode = "dark"): RaThemeOptions =>
  createTheme({
    cssVariables: {
      cssVarPrefix: "app",
      colorSchemeSelector: "class",
    },
    // cssVarPrefix: "app", // all vars will start with --app-
    custom: {
      sideImage: getSideImageConfig(),
      meteor: getMeteorConfig(),
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

      mode,
      // background: { default: "#121212", paper: "#1d1d1dbf" },
      background: {
        default: mode === "dark" ? "#121212" : "#f4f6f8",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      text: { primary: "#ffffff", secondary: "#aaaaaa" },
      passwordStrength: ["#aaaaaa", "#e76f51", "#f58700", "#0668d1", "#4caf50"],
    },
    colorSchemes: {
      light: true, // MUI's default mode
      dark: true,
    },
    shape: {
      borderRadius: 50,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: [
        "Roboto",
        "Helvetica",
        "sans-serif",
        "var(--font-siemreap)",
      ].join(","),
      h6: {
        fontFamily: "var(--font-moul)", // Use Moul for headers like "Kingdom of Cambodia"
        fontSize: "1rem",
      },
      h5: {
        fontFamily: "var(--font-moul)",
        fontSize: "1.15rem",
      },
    },
    components: {
      RazethLogin: RazethLoginOptimized,

      // ============================================ //
      // STAR COMPONENTS - MINIMAL OVERRIDES          //
      // ============================================ //
      RazethShootingStar: RazethShootingStarOptimized,
      RazethTwinkleStar: RazethTwinkleStarOptimized,
      RazethMeteor: RazethMeteorOptimized,

      // ============================================ //
      //          SIDE IMAGE - SIMPLIFIED             //
      // ============================================ //
      RazethSideImage: RazethSideImageOptimized,

      // ============================================ //
      //          AVATAR - KEEP ESSENTIALS            //
      // ============================================ //
      RazethAvatar: RazethAvatarOptimized,
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
            input: {
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
            marginBottom: "-0.5rem",
            width: "100%",
            gap: props.theme.spacing(0),
          }),
          // button: (props: { theme: Theme }) => ({
          //   marginTop: props.theme.spacing(1),
          //   fontWeight: 700,
          //   fontSize: "1rem",
          //   ["& .MuiSvgIcon-root"]: { margin: props.theme.spacing(0.3) },
          // }),
        },
      },
      RazethSignUpForm: {
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
            input: {
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
          // footer: (props: { theme: Theme }) => ({
          //   display: "flex",
          //   justifyContent: "space-between",
          //   alignItems: "center",
          //   fontWeight: 500,
          //   marginTop: "-0.5rem",
          //   width: "100%",
          //   gap: props.theme.spacing(0),
          // }),
          // button: (props: { theme: Theme }) => ({
          //   marginTop: props.theme.spacing(1),
          //   fontWeight: 700,
          //   ["& .MuiSvgIcon-root"]: {
          //     margin: props.theme.spacing(0.3),
          //     fontSize: 18,
          //   },
          // }),
        },
      },
      RazethValidatedButton: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            // fontWeight: 700,
            // fontSize: "0.9375rem",
            // fontSize: "2.5rem",
            button: {
              // borderRadius: "2.5rem",
              fontWeight: 700,
              fontSize: "0.9375rem",
              // fontSize: "2.5rem",
              // ["& .MuiSvgIcon-root"]: {
              //   margin: props.theme.spacing(0.3),
              //   // fontSize: 18,
              // },
            },
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
              transition: props.theme.transitions.create(
                ["transform", "background-color"],
                {
                  duration: props.theme.transitions.duration.standard,
                  easing: props.theme.transitions.easing.easeInOut,
                },
              ),
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
      RazethAuthNavigation: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: props.theme.spacing(0.5), // The space is now handled by the gap property
            textAlign: "center",
            marginTop: props.theme.spacing(2),
            color: props.theme.palette.text.secondary,
            button: {
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              svg: {
                marginLeft: props.theme.spacing(0.5),
                fontSize: "1rem",
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
            ["& .MuiTypography-root"]: {
              marginTop: props.theme.spacing(0.5),
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: props.theme.spacing(0.5), // The space is now handled by the gap property
              a: {
                margin: props.theme.spacing(0),
                display: "inline-flex",
                alignItems: "center",
              },
              "& > :last-child::after": {
                color: props.theme.palette.text.secondary,
                textDecoration: "none",
                marginLeft: props.theme.spacing(-0.5),
                content: '"."',
              },
              "& > :last-child:hover::after": {
                textDecoration: "none",
              },
            },
          }),
        },
      },

      /***** MUI's COMPONENTs *****/
      MuiAppBar: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
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
              position: "relative",
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
            // textAlign: "center",
            // label: {
            //   display: "flex",
            //   justifyContent: "center" /* Centers horizontally */,
            //   alignItems: "center" /* Centers vertically */,
            //   textAlign: "center",
            //   width: "100%",
            // },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginTop: "0.5em",
            marginBottom: "-0.5em",
            "&.hideHelper": {
              lineHeight: "0",
              marginTop: "0",
              marginBottom: "0",
            },
            "&.showHelper": {
              marginTop: "0.5em",
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
            fontFamily: [
              "Roboto",
              "Helvetica",
              "sans-serif",
              "var(--font-siemreap)",
            ].join(","),

            // h4: {
            //   fontFamily: "--fonts-moul",
            // },
            // h3: {
            //   fontFamily: "--fonts-moul",
            // },
            // h2: {
            //   fontFamily: "--fonts-moul",
            // },
            // h1: {
            //   fontFamily: "--fonts-moul",
            // },
            // "&.MuiTypography-caption": {},
            "&.MuiTypography-body1": {
              fontSize: "0.875rem",
            },
          },
          h6: {
            fontFamily: "var(--font-moul)",
          },
          h5: {
            fontFamily: "var(--font-moul)",
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
            "&:hover": {
              textDecoration: "underline",
              textUnderlineOffset: props.theme.spacing(0.5),
              color: "#9d1820ff",
            },
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: (theme) => globalStyles(theme),
      },
      MuiCard: {
        styleOverrides: {
          root: {
            "&.MuiBox-root": {
              margin: "0px",
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: ({ theme }) => ({
            height: 5,
            borderRadius: 5,
          }),
        },
      },
    },
  });

// Merge custom base theme with defaults const
export const darkTheme: RaThemeOptions = deepmerge(
  defaultThemeInvariants,
  RazethBaseTheme(),
);

export const lightTheme = deepmerge(defaultTheme, {
  palette: {
    primary: red,
    secondary: blue,
    error: {
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

      main: "#e60023",
      contrastText: "#fff",
    },
    secondary: { main: "#03dac6" },
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
          "&.Mui-focused .MuiSvgIcon-root": {
            color: props.theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: props.theme.palette.error.main,
          },
          // TARGET THE INPUT TEXT COLOR HERE
          "&.Mui-focused.Mui-error": {
            // Target the actual input element inside the root
            "& .MuiOutlinedInput-input": {
              color: props.theme.palette.error.main,
              // Use WebkitTextFillColor to ensure compatibility with some browser defaults
              WebkitTextFillColor: props.theme.palette.error.main,
            },
          },
        }),
      },
    },
  },
});
