"use client";
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import {
  createTheme,
  // CssVarsTheme,
  // PaletteMode,
  Theme,
  // ThemeOptions,
  // CssVarsThemeOptions,
} from "@mui/material/styles";

// import { makePulseVars } from "@/utils/themeUtils";
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
import { dataTableClasses } from "@/components/DataTable/mui/styles";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox"; // Optional

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
    // ...makePulseVars(
    //   theme.custom.sideImage.circleColor,
    //   theme.custom.sideImage.circleStopCount,
    //   theme.custom.sideImage.circlePulseSequence,
    // ),
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
    // lineHeight: 0,
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

  // ".shake": {
  //   animation: `${shake} 0.5s ease-in-out`,
  //   display: "inline-block",
  //   position: "relative",
  // },

  // Set the initial brown color here globally
  svg: {
    ".mcs-frame": {
      fill: "#7C3E1E",
      transition: "fill 0.3s ease-in-out",
    },
  },
});

const standardizedFormComponents = {
  /**
   * ================================================================
   * Standard text input
   * ================================================================
   */
  RazethTextField: {
    defaultProps: {
      variant: "outlined" as const,
      margin: "dense" as const,
      size: "small" as const,
      fullWidth: true,
      resettable: true,
    },

    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        /**
         * Label/adornment runtime geometry.
         *
         * Component logic consumes these values through CSS vars.
         */
        "--RazethTextField-label-offset-x":
          theme.direction === "rtl" ? "-45px" : "45px",
        "--RazethTextField-label-offset-y-small": "9px",
        "--RazethTextField-label-offset-y-medium": "16px",
        "& .MuiOutlinedInput-root": { borderRadius: 999 },

        /**
         * Multiline fields should be rounded panels rather than
         * enormous capsules.
         */
        '&[data-multiline="true"] .MuiOutlinedInput-root': {
          borderRadius: theme.spacing(3),
        },

        '&[data-validation-state="validating"] .MuiFormHelperText-root': {
          color: theme.vars.palette.primary.main,
        },

        '&[data-validation-state="success"] .MuiFormHelperText-root': {
          color: theme.vars.palette.success.main,
          fontWeight: 700,
        },
      }),

      icon: ({ theme }: { theme: Theme }) => ({
        color: theme.vars.palette.text.primary,
      }),

      button: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(0.5),
      }),
    },
  },

  /**
   * ================================================================
   * Standard password input
   * ================================================================
   *
   * PasswordField ultimately renders through the same BaseInput
   * surface as RazethTextField, but it resolves theme defaultProps
   * under its own component name:
   *
   *   RazethPasswordField
   *
   * Keep geometry defaults aligned so switching from a text field to
   * a password field never changes row height/padding.
   */
  RazethPasswordField: {
    defaultProps: {
      variant: "outlined" as const,
      margin: "dense" as const,
      size: "small" as const,
      fullWidth: true,
    },
  },

  /**
   * ================================================================
   * Standard select input
   * ================================================================
   */
  RazethSelectField: {
    defaultProps: {
      variant: "outlined" as const,
      margin: "dense" as const,
      size: "small" as const,
      fullWidth: true,
    },

    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        "--RazethSelectField-label-offset-x":
          theme.direction === "rtl" ? "-45px" : "45px",
        "--RazethSelectField-label-offset-y-small": "9px",
        "--RazethSelectField-label-offset-y-medium": "16px",
        "& .MuiOutlinedInput-root": { borderRadius: 999 },
      }),

      icon: ({ theme }: { theme: Theme }) => ({
        color: theme.vars.palette.text.secondary,
      }),
    },
  },

  /**
   * ================================================================
   * Form dialog
   * ================================================================
   */
  RazethFormDialog: {
    defaultProps: {
      maxWidth: "md" as const,
      fullWidth: true,
    },

    styleOverrides: {
      card: ({ theme }: { theme: Theme }) => ({
        borderRadius: theme.spacing(2.5),
        overflow: "hidden",
        backgroundImage: "none",
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
      }),

      heading: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(2, 3),
        borderBottom: `1px solid ${theme.vars.palette.warning.main}`,
      }),

      wrapper: ({ theme }: { theme: Theme }) => ({
        gap: theme.spacing(2),
      }),

      main: ({ theme }: { theme: Theme }) => ({
        gap: theme.spacing(1.5),
      }),

      icon: ({ theme }: { theme: Theme }) => ({
        width: 40,
        height: 40,
        borderRadius: "50%",
        color: theme.palette.warning.contrastText,
        backgroundColor: theme.vars.palette.warning.main,
      }),

      caption: ({ theme }: { theme: Theme }) => ({
        color: (theme.vars ?? theme).palette.text.secondary,
      }),

      footer: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(3),
      }),
    },
  },

  /**
   * ================================================================
   * Resource page
   * ================================================================
   */
  RazethResourcePage: {
    defaultProps: {
      maxWidth: "xl" as const,
    },

    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        paddingBlock: theme.spacing(3),
      }),

      wrapper: ({ theme }: { theme: Theme }) => ({
        marginBottom: theme.spacing(2.5),
        textAlign: "center",
      }),

      heading: {
        textAlign: "center",
      },

      caption: ({ theme }: { theme: Theme }) => ({
        marginTop: theme.spacing(0.5),
        color: (theme.vars ?? theme).palette.text.secondary,
        textAlign: "center",
      }),

      card: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2.5),
        backgroundImage: "none",
      }),
    },
  },

  /**
   * ================================================================
   * Primary resource toolbar action
   * ================================================================
   */
  RazethResourceActionButton: {
    defaultProps: {
      variant: "contained" as const,
    },

    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 999,
        paddingInline: theme.spacing(2),
        fontWeight: 700,
        whiteSpace: "nowrap",
      }),
    },
  },

  /**
   * ================================================================
   * TranslationKey create/edit form layout
   * ================================================================
   */
  RazethTranslationKeyForm: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
      }),

      footer: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column-reverse",
        },
      }),
    },
  },

  /**
   * ================================================================
   * TranslationKey table resource shell
   * ================================================================
   */
  RazethTranslationKeyTable: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
        minWidth: 0,
      }),

      card: ({ theme }: { theme: Theme }) => ({
        minHeight: 360,
        display: "grid",
        placeItems: "center",
        padding: theme.spacing(4),
      }),

      content: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
      }),

      keyCell: {
        fontFamily: "monospace",
        fontWeight: 600,
      },

      main: {
        minWidth: 0,

        /**
         * Resource-specific viewport geometry without caller sx.
         */
        [`& .${dataTableClasses.container}`]: {
          maxHeight: "calc(100vh - 290px)",
          minHeight: 320,
        },
      },
    },
  },

  /**
   * ================================================================
   * TranslationValue detail panel
   * ================================================================
   *
   * This is application/resource presentation rendered inside the
   * generic DataTable detail-panel region.
   *
   * No row/translation resource data is placed into ownerState.
   */
  RazethTranslationValuesPanel: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(1.5, 2),
        minWidth: 0,
        backgroundColor: theme.vars.palette.background.paper,
      }),

      heading: ({ theme }: { theme: Theme }) => ({
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        alignItems: "center",
        gap: theme.spacing(1.25),
        minWidth: 0,
        paddingBottom: theme.spacing(1.25),
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
        color: theme.vars.palette.text.primary,

        [theme.breakpoints.down("sm")]: {
          gridTemplateColumns: "auto minmax(0, 1fr)",
        },
      }),

      main: {
        minWidth: 0,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
      },

      content: {
        display: "grid",
        gap: 0,
      },

      item: ({ theme }: { theme: Theme }) => ({
        display: "grid",
        gridTemplateColumns:
          "minmax(96px, auto) minmax(0, 1fr) minmax(170px, auto) auto",
        alignItems: "center",
        gap: theme.spacing(2),
        padding: theme.spacing(1.25, 1),
        border: 0,
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
        borderRadius: 0,
        backgroundImage: "none",
        backgroundColor: "transparent",

        "&:hover": {
          backgroundColor: theme.alpha(
            theme.vars.palette.text.primary,
            0.06,
          ),
        },

        [theme.breakpoints.down("md")]: {
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
        },

        [theme.breakpoints.down("sm")]: {
          gridTemplateColumns: "auto minmax(0, 1fr)",
          gap: theme.spacing(0.75, 1.25),
        },
      }),

      wrapper: {
        minWidth: 0,
        // overflowWrap: "anywhere",
      },

      caption: ({ theme }: { theme: Theme }) => ({
        margin: 0,
        padding: 0,
        whiteSpace: "nowrap",
        color: theme.vars.palette.text.secondary,

        [theme.breakpoints.down("md")]: {
          gridColumn: "2 / -1",
        },

        [theme.breakpoints.down("sm")]: {
          gridColumn: "2",
        },

        '&[data-empty="true"]': {
          gridColumn: "auto",
          padding: theme.spacing(2),
          textAlign: "center",
          whiteSpace: "normal",
        },
      }),

      label: {
        justifySelf: "start",
      },

      button: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",

        [theme.breakpoints.down("sm")]: {
          gridColumn: "2",
          justifyContent: "flex-start",
        },
      }),
    },
  },
} as const;

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
      "var(--font-interkhmerloopless)",
      "var(--font-mef1)",
      "var(--font-mef2)",
      "var(--font-siemreap)",
    ].join(","),
    h6: {
      fontWeight: 700,
      fontFamily: "var(--font-mef2)", // Use Moul for headers like "Kingdom of Cambodia"
    },
  },
  sidebar: {
    width: 240,
    closedWidth: 50,
  },
  components: {
    ...standardizedFormComponents,

    /**
     * ==============================================================
     * DataTable application presentation
     * ==============================================================
     *
     * Renderer components expose structure and live TanStack state.
     * Product-level visual tuning belongs here so hover strength,
     * utility controls and footer layout can change without editing
     * table renderers.
     */
    RazethDataTable: {
      /**
       * Keep the application default aligned with the MRT table.
       *
       * DataTableDensityProvider still has its own compact fallback so
       * isolated/test themes behave consistently, while this remains
       * the public application-level default.
       */
      defaultProps: {
        density: "compact",
      },

      styleOverrides: {
        bodyRow: ({ theme }: { theme: Theme }) => ({
          /**
           * Keep hover parity with the existing MRT /fts table.
           *
           * Because DataTable body cells composite this value over the
           * opaque paper surface, the alpha behaves exactly as a row
           * hover tint rather than replacing the cell background.
           */
          "--DataTable-row-hover-background": "rgba(0, 0, 0, 0.04)",
          "--DataTable-row-selected-background": theme.alpha(
            theme.vars.palette.primary.main,
            0.16,
          ),
          "--DataTable-row-selected-hover-background": theme.alpha(
            theme.vars.palette.primary.main,
            0.24,
          ),
        }),

        expandRowButton: ({ theme }: { theme: Theme }) => ({
          opacity: 1,
          color: theme.vars.palette.text.primary,
          "&:hover": {
            color: theme.vars.palette.primary.main,
            backgroundColor: theme.alpha(
              theme.vars.palette.primary.main,
              0.12,
            ),
          },
        }),

        expandAllButton: ({ theme }: { theme: Theme }) => ({
          opacity: 1,
          color: theme.vars.palette.text.primary,
          "&:hover": {
            color: theme.vars.palette.primary.main,
            backgroundColor: theme.alpha(
              theme.vars.palette.primary.main,
              0.12,
            ),
          },
        }),

        paginationStart: {
          minWidth: 0,
          flex: "1 1 auto",
        },

        paginationControls: ({ theme }: { theme: Theme }) => ({
          marginInlineStart: "auto",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          rowGap: theme.spacing(0.5),
        }),
      },
    },

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

export const RazethBaseTheme = (): RaThemeOptions =>
  createTheme({
    cssVariables: {
      cssVarPrefix: "app",
      // nativeColor: true, // Uses CSS color-mix()
      colorSchemeSelector: "class",
    },
    // cssVariables: true,
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
      paper: "#aaaaaa",
    },
    palette: {
      // primary: {
      //   main: "#e1232e",
      //   dark: "#e1232e",
      //   light: "#DC143C",
      //   contrastText: "#fff",
      // },
      // secondary: { main: "#007bff" },
      // error: { main: "#f58700" },
      // warning: { main: "#FFD22B" },
      // info: { main: "#f89696" },
      // success: { main: "#2ece71", contrastText: "#fff" },
      primary: {
        dark: "#ef4444",
        main: "#dc2626",
        light: "#DC143C",
        contrastText: "#fff",
      },
      secondary: { dark: "#2563eb", main: "#3b82f6", contrastText: "#fff" },
      error: { dark: "#f58700", main: "#c26a00", contrastText: "#fff" },
      warning: { dark: "#eab308", main: "#ca8a04", contrastText: "#fff" },
      // info: { dark: "#9333ea", main: "#7e22ce", contrastText: "#fff" },
      info: { dark: "#6366f1", main: "#4338ca", contrastText: "#fff" },
      success: { dark: "#22c55e", main: "#16a34a", contrastText: "#fff" },
      common: {
        white: "#ffffff",
        whiteChannel: "255 255 255", // Add this
        black: "#000000",
        blackChannel: "0 0 0", // Add this
      },
      // divider: "rgba(0, 0, 0, 0.12)",

      // mode: "dark",
      action: {
        disabled: "rgba(0, 0, 0, 0.3)",
      },
      // background: { default: "#f4f6f8", paper: "#ecf0f3" },
      // background: { default: "#d1d9e6", paper: "#dfeafd" },
      background: { default: "#d3e1f7", paper: "#e0eafd" },
      // background: { default: "#d3e1f7", paper: "#e6e9ef" },
      customShadows: {
        neumorphic: `-7px -7px 15px rgba(255, 255, 255, 1), 7px 7px 15px rgba(174, 174, 192, 0.4)`,
        inset: `inset -5px -5px 10px rgba(255, 255, 255, 1), inset 5px 5px 10px rgba(174, 174, 192, 0.4)`,
        circleWell:
          // "inset 6px 6px 15px rgba(163, 177, 198, 0.5), inset -6px -6px 15px rgba(255, 255, 255, 1)",
          "-7px -7px 15px rgba(255,255,255,1), 7px 7px 15px rgba(174, 174, 192, 0.75)",
        // "-8px -8px 16px #ffffff, 8px 8px 16px #b8bcc2",
      },
      dynamic: {
        background: "#211111",
      },
      card: "#adc4eb", // White for dark mode
      // background: {
      //   default: mode === "dark" ? "#121212" : "#f4f6f8",
      //   paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      // },
      // text: { primary: "#ffffff", secondary: "#aaaaaa" },
      passwordStrength: ["#aaaaaa", "#e76f51", "#f58700", "#0668d1", "#4caf50"],
      link: {
        hover: "#b91c1c",
      },
    },
    // colorSchemes: {
    //   light: true, // MUI's default mode
    //   dark: true,
    // },
    // Move ALL mode-specific colors here
    // colorSchemes: {
    //   light: {
    //     palette: {
    //       background: {
    //         default: "#f4f6f8",
    //         paper: "#ffffff",
    //       },
    //       text: {
    //         primary: "#1A2027", // Dark text for light mode
    //         secondary: "#3E5060",
    //       },
    //     },
    //   },
    //   dark: {
    //     palette: {
    //       background: {
    //         default: "#121212",
    //         paper: "#1e1e1e",
    //       },
    //       text: {
    //         primary: "#ffffff",
    //         secondary: "#aaaaaa",
    //       },
    //     },
    //   },
    // },
    // ── colorSchemes: ALL color values go here so MUI generates
    //    the channel variables ──────────────────────────────────────────────────
    colorSchemes: {
      dark: {
        palette: {
          // primary: {
          //   main: "#e1232e",
          //   dark: "#e1232e",
          //   light: "#DC143C",
          //   contrastText: "#fff",
          // },
          // secondary: { main: "#007bff" },
          // error: { main: "#f58700" },
          // warning: { main: "#FFD22B" },
          // info: { main: "#f89696" },
          // success: { main: "#2ece71", contrastText: "#fff" },
          primary: {
            main: "#ef4444",
            dark: "#dc2626",
            light: "#DC143C",
            contrastText: "#fff",
          },
          secondary: { main: "#2563eb", dark: "#3b82f6", contrastText: "#fff" },
          error: { main: "#f58700", dark: "#c26a00", contrastText: "#fff" },
          warning: { main: "#eab308", dark: "#ca8a04", contrastText: "#fff" },
          // info: { main: "#9333ea", dark: "#7e22ce", contrastText: "#fff" },
          info: { main: "#6366f1", dark: "#4338ca", contrastText: "#fff" },
          success: { main: "#22c55e", dark: "#16a34a", contrastText: "#fff" },
          common: {
            white: "#ffffff",
            whiteChannel: "255 255 255", // Add this
            black: "#000000",
            blackChannel: "0 0 0", // Add this
          },
          action: {
            disabled: "rgba(255, 255, 255, 0.3)",
          },
          background: {
            // default: "#121212",
            // paper: "#1e1e1e",
            default: "#26282b",
            paper: "#31363b",
          },
          // Define custom shadow variables for dark mode
          customShadows: {
            neumorphic:
              "-7px -7px 15px rgba(255, 255, 255, 0.05), 7px 7px 15px rgba(0, 0, 0, 0.5)",
            inset:
              "inset -5px -5px 10px rgba(255, 255, 255, 0.05), inset 5px 5px 10px rgba(0, 0, 0, 0.5)",
            circleWell:
              // "inset 6px 6px 15px rgba(0, 0, 0, 0.6), inset -6px -6px 15px rgba(255, 255, 255, 0.05)",
              "-7px -7px 15px rgba(255,255,255,0.125), 7px 7px 15px rgba(0, 0, 0, 0.75)",
            // "-8px -8px 16px #4b5563, 8px 8px 16px #111827",
          },
          dynamic: {
            background: "#000",
          },
          text: {
            primary: "#ffffff",
            secondary: "#aaaaaa",
          },
          // divider: "rgba(255, 255, 255, 0.12)",
          card: "#272935", // Black for Dark mode
          link: {
            hover: "#f87171",
          },
        },
      },
      light: {
        palette: {
          // common: {
          //   white: "#ffffff",
          //   whiteChannel: "255 255 255",
          //   black: "#000000",
          //   blackChannel: "0 0 0",
          // },
          background: {
            // default: "#f4f6f8",
            default: "#d1d9e6",
            paper: "#dfeafd",
          },
          // Define custom shadow variables for light mode
          customShadows: {
            neumorphic:
              "-7px -7px 15px rgba(255, 255, 255, 1), 7px 7px 15px rgba(174, 174, 192, 0.4)",
            inset:
              "inset -5px -5px 10px rgba(255, 255, 255, 1), inset 5px 5px 10px rgba(174, 174, 192, 0.4)",
            circleWell: `
              inset 7px 7px 15px rgba(0, 0, 0, 0.6), 
              inset -7px -7px 15px rgba(255, 255, 255, 0.05)
            `,
          },
          text: {
            primary: "#111111",
            secondary: "#555555",
          },
          card: "#3a3e53", // White for dark mode
        },
      },
    },
    shape: {
      // borderRadius: 50,
    },
    // mixins: {
    //   toolbar: { marginTop: "65px" },
    // },
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
        // "var(--font-interkhmerloopless)",
        // "var(--font-google)",
        // "var(--font-interkhmer)",
        // "var(--font-mef1)",
        "var(--font-siemreap)",
        "var(--font-mef2)",
        "var(--font-moul)",
        "var(--font-kantumruy)",
      ].join(","),
      h6: {
        fontFamily: "var(--font-mef2)", // Use Moul for headers like "Kingdom of Cambodia"
        fontSize: "1rem",
      },
      h5: {
        fontFamily: "var(--font-mef2)", // Use Moul for headers like "Kingdom of Cambodia"
        fontSize: "1.15rem",
      },
      h4: {
        fontFamily: "var(--font-kantumruy)", // Use Moul for headers like "Kingdom of Cambodia"
        fontSize: "1.3rem",
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
            // ["& .MuiCardContent-root"]: {
            //   minWidth: 300,
            //   padding: `${props.theme.spacing(0)}`,
            // },
          }),
          content: (props: { theme: Theme }) => ({
            // display: "flex",
            // flexDirection: "column",
            // gap: props.theme.spacing(0),
            // input: {
            //   transition: props.theme.transitions.create("color", {
            //     easing: props.theme.transitions.easing.easeInOut,
            //     duration: props.theme.transitions.duration.short,
            //   }),
            //   "&:focus": {
            //     // color: "#e1232e", // focused
            //     color: props.theme.palette.primary.main, // focused
            //   },
            // },
            // // Apply custom styles to the last child element inside this container
            // "& > :last-child": {
            //   // For example, you could add extra margin to the button
            //   // if it's the last item. Let's override its default top margin.
            //   marginTop: props.theme.spacing(1),
            // },
          }),
          password: (props: { theme: Theme }) => ({
            // display: "flex",
            // flexDirection: "column",
            // width: "100%",
            // gap: props.theme.spacing(0),
          }),
          footer: (props: { theme: Theme }) => ({
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            // fontWeight: 500,
            // marginTop: "-0.5rem",
            // marginBottom: "-0.5rem",
            // width: "100%",
            // gap: props.theme.spacing(0),
          }),
          // button: (props: { theme: Theme }) => ({
          //   marginTop: props.theme.spacing(1),
          //   fontWeight: 700,
          //   fontSize: "1rem",
          //   ["& .MuiSvgIcon-root"]: { margin: props.theme.spacing(0.3) },
          // }),
        },
      },
      RazethAuthForm: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            // ["& .MuiCardContent-root"]: {
            //   minWidth: 300,
            //   padding: `${props.theme.spacing(0)}`,
            // },
          }),
          content: (props: { theme: Theme }) => ({
            // display: "flex",
            // flexDirection: "column",
            // gap: props.theme.spacing(0),
            // input: {
            //   transition: props.theme.transitions.create("color", {
            //     easing: props.theme.transitions.easing.easeInOut,
            //     duration: props.theme.transitions.duration.short,
            //   }),
            //   "&:focus": {
            //     // color: "#e1232e", // focused
            //     color: props.theme.palette.primary.main, // focused
            //   },
            // },
            // // Apply custom styles to the last child element inside this container
            // "& > :last-child": {
            //   // For example, you could add extra margin to the button
            //   // if it's the last item. Let's override its default top margin.
            //   marginTop: props.theme.spacing(1),
            // },
          }),
          password: (props: { theme: Theme }) => ({
            // display: "flex",
            // flexDirection: "column",
            // width: "100%",
            // gap: props.theme.spacing(0),
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
        // styleOverrides: {
        //   root: (props: { theme: Theme }) => ({
        //     // fontWeight: 700,
        //     // fontSize: "0.9375rem",
        //     // fontSize: "2.5rem",
        //     button: {
        //       // borderRadius: "2.5rem",
        //       fontWeight: 700,
        //       fontSize: "0.9375rem",
        //       // fontSize: "2.5rem",
        //       // ["& .MuiSvgIcon-root"]: {
        //       //   margin: props.theme.spacing(0.3),
        //       //   // fontSize: 18,
        //       // },
        //     },
        //   }),
        // },
      },
      RazethDivider: {
        // styleOverrides: {
        //   root: (props: { theme: Theme }) => ({
        //     position: "relative",
        //     display: "flex",
        //     alignItems: "center",
        //     marginTop: props.theme.spacing(2),
        //     marginBottom: props.theme.spacing(2),
        //     ["& .MuiDivider-root"]: { flex: 1 },
        //     ["& .MuiTypography-root"]: {
        //       paddingLeft: props.theme.spacing(2),
        //       paddingRight: props.theme.spacing(2),
        //       backgroundColor: props.theme.palette.background.paper,
        //       color: props.theme.palette.text.secondary,
        //     },
        //   }),
        // },
      },
      RazethSocialLogin: {
        styleOverrides: {
          content: (props: { theme: Theme }) => ({
            // button: {
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   gap: props.theme.spacing(1),
            //   width: "100%",
            //   padding: props.theme.spacing(1),
            //   textTransform: "none",
            //   border: `1px solid ${props.theme.palette.divider}`,
            //   transition: props.theme.transitions.create(
            //     ["transform", "background-color"],
            //     {
            //       duration: props.theme.transitions.duration.standard,
            //       easing: props.theme.transitions.easing.easeInOut,
            //     },
            //   ),
            //   "&:hover": {
            //     border: `1px solid ${props.theme.palette.divider}`,
            //     backgroundColor: props.theme.palette.action.hover,
            //     transform: "scale(1.05)", // enlarge smoothly
            //     boxShadow: props.theme.shadows[3],
            //   },
            //   "& svg": {
            //     width: props.theme.spacing(2),
            //     height: props.theme.spacing(2),
            //   },
            // },
          }),
        },
      },
      RazethSocialButton: {
        styleOverrides: {
          label: (props: { theme: Theme }) => ({
            // fontWeight: "500",
            // display: "none", // Hide by default
            // [props.theme.breakpoints.up("sm")]: {
            //   display: "block", // This applies for 'sm' and larger breakpoints
            // },
          }),
        },
      },
      RazethAuthNavigation: {
        // styleOverrides: {
        //   root: (props: { theme: Theme }) => ({
        //     display: "flex",
        //     alignItems: "center",
        //     justifyContent: "center",
        //     gap: props.theme.spacing(0.5), // The space is now handled by the gap property
        //     textAlign: "center",
        //     marginTop: props.theme.spacing(2),
        //     color: props.theme.palette.text.secondary,
        //     button: {
        //       textTransform: "uppercase",
        //       display: "inline-flex",
        //       alignItems: "center",
        //       svg: {
        //         marginLeft: props.theme.spacing(0.5),
        //         fontSize: "1rem",
        //       },
        //     },
        //   }),
        // },
      },
      RazethFooter: {
        // styleOverrides: {
        //   root: (props: { theme: Theme }) => ({
        //     textAlign: "center",
        //     marginTop: props.theme.spacing(1),
        //     color: props.theme.palette.text.secondary,
        //     position: "relative",
        //     ["& .MuiTypography-root"]: {
        //       marginTop: props.theme.spacing(0.5),
        //       fontSize: "0.75rem",
        //       display: "flex",
        //       alignItems: "center",
        //       justifyContent: "center",
        //       gap: props.theme.spacing(0.5), // The space is now handled by the gap property
        //       a: {
        //         margin: props.theme.spacing(0),
        //         display: "inline-flex",
        //         alignItems: "center",
        //       },
        //       "& > :last-child::after": {
        //         color: props.theme.palette.text.secondary,
        //         textDecoration: "none",
        //         marginLeft: props.theme.spacing(-0.5),
        //         content: '"."',
        //       },
        //       "& > :last-child:hover::after": {
        //         textDecoration: "none",
        //       },
        //     },
        //   }),
        // },
      },

      /***** MUI's COMPONENTs *****/
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            // backgroundColor: "#c40316", // Customize the AppBar background color
            backgroundColor: "#e1232e", // Customize the AppBar background color
            // backgroundImage: "linear-gradient(45deg, #190a05 0%, #870000 100%)",
            color: theme.vars.palette.common.white,
            // Optional: apply a different background image/color for light mode
            // ...(props.theme.palette.mode === "light" && {
            //   // Shorthand prevents the dark-mode elevation overlay bleeding in
            // background: `linear-gradient(45deg, rgb(187, 17, 17) 0%, #820000 100%)`,
            //   backgroundColor: `blue`,
            //   backgroundImage: "none",
            //   color: props.theme.palette.text.primary,
            // }),
            // // Apply the background image specifically for dark mode
            // ...(props.theme.palette.mode === "dark" && {
            //   // Shorthand resets backgroundColor + backgroundImage together
            // backgroundImage: `linear-gradient(45deg, ${theme.vars.palette.background.paper} 0%, ${theme.vars.palette.error.main} 50%, #870000 100%)`,
            backgroundImage: `linear-gradient(45deg, #870000 0%, ${theme.vars.palette.error.main} 50%, ${theme.vars.palette.background.paper} 100%)`,
            borderBottom: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
            // backgroundImage: `linear-gradient(45deg, #190a05 0%, #870000 100%)`,
            //   backgroundColor: "red",
            //   color: props.theme.palette.text.primary,
            // }),
            ...theme.applyStyles("dark", {
              color: theme.vars.palette.text.primary,
              // backgroundImage: `linear-gradient(45deg, #1e1e1e 0%, #870000 100%)`,
              backgroundImage: `linear-gradient(45deg, ${theme.vars.palette.background.paper} 0%, ${theme.vars.palette.error.main} 50%, #870000 100%)`,
            }),
          }),
          // colorPrimary: ({ theme }: { theme: Theme }) => ({
          //   ...(theme.palette.mode === "light" && {
          //     backgroundColor: theme.palette.primary.main,
          //     backgroundImage: "none",
          //   }),
          //   ...(theme.palette.mode === "dark" && {
          //     backgroundColor: "#481dac",
          //     // background: `linear-gradient(45deg, #190a05 0%, #870000 100%)`,
          //   }),
          // }),
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
            "&.Mui-disabled": {
              cursor: "not-allowed",
            },
          }),
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        // styleOverrides: {
        //   root: {
        //     // Use this to ensure the container itself has the radius
        //     "& .MuiOutlinedInput-root": {
        //       borderRadius: 50,
        //     },
        //   },
        // },
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
              "var(--font-interkhmerloopless)",
              "var(--font-google)",
              "var(--font-interkhmer)",
              "var(--font-mef1)",
              "var(--font-mef2)",
              "var(--font-siemreap)",
              "var(--font-moul)",
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
            fontFamily: [
              // "Roboto",
              // "Helvetica",
              // "sans-serif",
              "var(--font-moul)",
              "var(--font-google)",
            ].join(","),
          },
          h5: {
            fontFamily: [
              "Roboto",
              "Helvetica",
              "sans-serif",
              "var(--font-moul)",
            ].join(","),
          },
          h4: {
            fontFamily: [
              "Roboto",
              "Helvetica",
              "sans-serif",
              "var(--font-kantumruy)",
            ].join(","),
            fontWeight: "inherit",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            borderRadius: 50,
            "&.Mui-focused .MuiSvgIcon-root": {
              color: props.theme.palette.primary.main,
              borderRadius: 50,
            },
            "&.Mui-error .MuiSvgIcon-root": {
              color: props.theme.palette.error.main,
            },
          }),
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            borderRadius: 50,
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
            borderRadius: 50,
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
            // Targets the root container when disabled
            "&.Mui-disabled": {
              backgroundColor: "#7974745c",
              // 1. Set cursor for standard TextFields
              pointerEvents: "auto",
              cursor: "not-allowed",
              // Styles the inner input text
              "& .MuiOutlinedInput-input": {
                WebkitTextFillColor: "#666666",
                cursor: "not-allowed",
              },
              // 2. Set cursor specifically for Select components
              "& .MuiSelect-select": {
                cursor: "not-allowed",
              },
              // Styles the border
              "& .MuiOutlinedInput-notchedOutline": {
                // borderColor: "rgba(0, 0, 0, 0.12) !important",
              },
              // 3. Ensure the border doesn't react to hover
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.12) !important",
              },
            },
          }),
          notchedOutline: {
            // Target the border element for the outlined variant
            borderRadius: 50,
          },
        },
      },
      // MuiDateCalendar: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: 50,
      //     },
      //   },
      // },
      MuiButtonBase: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            "&.MuiButton-root": {
              color: props.theme.vars.palette.text.primary,
            },
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.vars.palette.primary.main,
            textDecoration: "none",
            transition: theme.transitions.create(["color"], {
              duration: theme.transitions.duration.short, // Fast, natural UI response (~250ms)
            }),
            "&:hover": {
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: theme.spacing(0.5),
              // color: "#9d1820ff",
              color: theme.vars.palette.link.hover,
            },
          }),
        },
      },
      // MuiCheckbox: {
      //   // defaultProps: {
      //   //   // Swap default square icons with rounded icons theme-wide
      //   //   icon: <RadioButtonUncheckedIcon />,
      //   //   checkedIcon: <CheckCircleIcon />,
      //   //   indeterminateIcon: <IndeterminateCheckBoxIcon />,
      //   // },
      //   styleOverrides: {
      //     root: ({ theme }) => ({
      //       // Add global styling like padding or base colors here
      //       borderRadius: "50%",
      //       // '&.Mui-checked': {
      //       //   // Target checked state globally if needed
      //       // },
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
      MuiTable: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            backgroundColor: props.theme.vars.palette.background.default, // Set your default table background
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            // Chain the class twice to increase specificity weight
            "&.MuiTableRow-root.MuiTableRow-root": {
              backgroundColor: props.theme.vars.palette.background.paper,
            },
            "&.MuiTableRow-root": {
              '& td[data-pinned="true"]': {
                "&:before": {
                  backgroundColor: props.theme.vars.palette.background.paper,
                },
              },
            },
          }),
          head: (props: { theme: Theme }) => ({
            backgroundColor: props.theme.vars.palette.background.paper, // Set your default table row background
          }),
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            // backgroundColor: props.theme.vars.palette.background.default, // Set your default table header background
            // Targets cells specifically within the header
            '& .MuiTableCell-root[data-pinned="true"]:before': {
              backgroundColor: props.theme.vars.palette.background.default,
              opacity: 1, // Ensures it's not semi-transparent
              backdropFilter: "none",
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: (props: { theme: Theme }) => ({
            backgroundColor: props.theme.vars.palette.background.paper, // Set your default table header background
            borderBottom: `1px solid ${props.theme.alpha(props.theme.vars.palette.text.primary, 0.125)}`,
            // Targets TableCell specifically when it is a 'head' cell
            "&.MuiTableCell-head": {
              backgroundColor: props.theme.vars.palette.background.default,
            },
            "&.MuiTableCell-body": {
              backgroundColor: props.theme.vars.palette.background.paper,
            },
            '[data-pinned="true"]:before': {
              backgroundColor: props.theme.vars.palette.background.paper,
            },
          }),
          head: (props: { theme: Theme }) => ({
            backgroundColor: props.theme.vars.palette.background.default, // Specific background for header cells
            color: props.theme.vars.palette.text.primary,
            // Targets the specific internal MRT class
            // "& .Mui-TableHeadCell-Content": {
            //   backgroundColor: props.theme.vars.palette.background.default, // Specific background for header cells
            //   color: props.theme.vars.palette.text.primary,
            // },
            // You can also target the label and actions specifically
            // "& .Mui-TableHeadCell-Content-Labels": {
            //   fontWeight: "bold",
            // },
          }),
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            // 1. Target the icon specifically to beat the library's !important
            "&.MuiTableSortLabel-root .MuiTableSortLabel-icon": {
              color: `${theme.vars.palette.text.secondary} !important`,
              // opacity: 0.5, // Default opacity for inactive icons
            },
            // // 2. Target the active state icon
            // "&.Mui-active .MuiTableSortLabel-icon": {
            //   color: `${theme.vars.palette.primary.main} !important`,
            //   opacity: 1,
            // },
            // // 3. Optional: Hover state for the icon
            // "&:hover .MuiTableSortLabel-icon": {
            //   opacity: 0.8,
            // },
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          // Target the 'list' slot specifically
          // list: ({ theme }) => ({
          //   // Double class to increase specificity without !important
          //   "&.MuiMenu-list": {
          //     backgroundColor: theme.vars.palette.background.paper,
          //   },
          // }),
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            "& .MuiMenu-list": {
              backgroundColor: "inherit", // Force the list to follow the paper color
            },
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
    ...standardizedFormComponents,
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
