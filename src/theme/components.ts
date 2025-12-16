// theme/components.ts - OPTIMIZED VERSION
// Remove heavy CSS, keep only essentials

import { Theme } from "@mui/material/styles";
import {
  earthRotate,
  shake,
  move,
  cloudMove,
  moveBackgroundLeft,
  twinkle,
  meteorStrike,
} from "./keyframes";

// ============================================ //
//          RAZETH LOGIN - SIMPLIFIED           //
// ============================================ //
export const RazethLoginOptimized = {
  styleOverrides: {
    root: (props: { theme: Theme }) => ({
      width: "100vw",
      height: "100vh",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: props.theme.palette.grey[900],
      // ✅ SIMPLIFIED: Single gradient background (instead of 5 complex ones)
      background: `radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.15), transparent 70%), #000000`,

      // ✅ REMOVED: Complex multi-layer ::before patterns
      // ✅ REMOVED: Complex multi-layer ::after patterns
      // backgroundColor:
      //   props.theme.palette.mode === "dark"
      //     ? props.theme.palette.grey[900]
      //     : props.theme.palette.grey[100],
      // background: `
      //   radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
      //   radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
      //   radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
      //   radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
      //   radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
      //   #000000
      // `,
      // "&::before": {
      //   content: '""',
      //   position: "absolute",
      //   inset: 0,
      //   backgroundImage: `
      //     repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
      //     repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
      //     repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
      //     repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
      //     radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
      //   `,
      //   backgroundSize:
      //     "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
      //   backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
      // },
      // "&::after": {
      //   content: '""',
      //   position: "absolute",
      //   inset: 0,
      //   pointerEvents: "none", // don't block interaction
      //   backgroundImage: `
      //     repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      //   `,
      // },
    }),
    overlay: (props: { theme: Theme }) => ({
      position: "relative",
      width: "100dvw",
      height: "100dvh",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      // fontFamily: "Montserrat",
      fontWeight: "bold",
      padding: "1em 2em 1em 1em",
      overflow: "hidden",
      zIndex: 1,
      // Ensure meteor layer is positioned correctly
      "& > *": {
        position: "relative",
      },
      // "&::before": {
      //   content: '""',
      //   position: "absolute",
      //   inset: 0,
      //   zIndex: -1,
      //   width: "3px",
      //   height: "3px",
      //   borderRadius: "50%",
      //   opacity: 1,
      //   transition: "1.5s ease",
      //   animationDelay: "0.4s",
      // },
      // "&::after": {
      //   content: '""',
      //   position: "absolute",
      //   inset: 0,
      //   zIndex: -1,
      //   width: "2px",
      //   height: "2px",
      //   borderRadius: "50%",
      //   opacity: 1,
      //   transition: "2s ease",
      //   animationDelay: "0.8s",
      // },
    }),
    ambient: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
      backgroundSize: "contain",
      animation: `${cloudMove} 150s linear infinite`,
      "::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
        backgroundSize: "contain",
        animation: `${moveBackgroundLeft} 500s linear infinite`,
      },
    },
    effect: (props: { theme: Theme }) => ({
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      zIndex: 0,
      // ✅ That's it! React components handle everything else
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
      //   zIndex: -1,
      //   transition: "3s ease",
      //   animation: `${twinkle} 5s linear alternate infinite`,
      //   animationDelay: "3s",
      //   pointerEvents: "none",
      // },
      // "&::after": {
      //   content: '""',
      //   position: "absolute",
      //   top: 0,
      //   left: 0,
      //   width: "2px",
      //   height: "2px",
      //   borderRadius: "50%",
      //   opacity: 1,
      //   inset: 0,
      //   zIndex: -1,
      //   transition: "5.5s ease",
      //   animation: `${twinkle} 7s linear alternate infinite`,
      //   animationDelay: "5s",
      // },
    }),
    image: (props: { theme: Theme }) => ({
      position: "absolute",
      width: "5em",
      height: "5em",
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
      // "&::after": {
      //   content: '""',
      //   position: "fixed",
      //   top: "-5rem",
      //   left: "-5rem",
      //   width: "10em",
      //   height: "10em",
      //   borderRadius: "50%",
      //   backgroundImage: `url('/static/images/full-moon.svg')`,
      //   backgroundRepeat: "no-repeat" /* Prevents image tiling */,
      //   backgroundSize: "cover",
      //   backgroundPosition: "left",
      //   bottom: 0,
      //   backgroundColor: "#f9f9fb",
      //   backgroundBlendMode: "multiply",
      //   boxShadow:
      //     "0px 0px 100px rgba(193,119,241,0.8), 0px 0px 100px rgba(135,42,211,0.8), inset #9b40fc 0px 0px 40px -12px",
      //   transition: "0.5s ease-in-out",
      //   zIndex: -1,
      // },
      // ✅ SIMPLIFIED: Single pseudo-element for glow
      "&::after": {
        content: '""',
        position: "fixed",
        top: "-5rem",
        left: "-5rem",
        width: "10em",
        height: "10em",
        borderRadius: "50%",
        backgroundImage: `url('/static/images/full-moon.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "left",
        backgroundBlendMode: "multiply",
        boxShadow:
          "0px 0px 100px rgba(193,119,241,0.8), 0px 0px 100px rgba(135,42,211,0.8)",
        transition: "0.5s ease-in-out",
        zIndex: -1,
      },
      // "&:hover::before": {
      //   filter: "blur(3px)",
      // },
      // "&:hover::after": {
      //   boxShadow:
      //     "0px 0px 200px rgba(193,119,241,1), 0px 0px 200px rgba(135,42,211,1), inset #9b40fc 0px 0px 40px -12px",
      // },
    }),
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
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
        // boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        "&:hover": {
          transform: "scale(1.5)",
        },
        borderRadius: "50%",
      },
    },

    content: (props: { theme: Theme }) => ({
      width: "100%",
      maxWidth: "100%",
      [props.theme.breakpoints.up("md")]: {
        maxWidth: "min(80%, 750px)",
      },
      [props.theme.breakpoints.up("lg")]: {
        maxWidth: "max(750px, 50%)",
      },
      "& .MuiFormControl-root": {},
    }),

    // Card - SIMPLIFIED (removed heavy texture patterns)
    card: (props: { theme: Theme }) => ({
      position: "relative",
      overflow: "visible",
      borderRadius: props.theme.spacing(2),
      boxShadow: props.theme.shadows[3],
      /*** Paper Texture ***/
      // backgroundImage: `
      //   radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
      //   repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
      //   repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      // `,
      backgroundSize: "8px 8px, 32px 32px, 32px 32px",
      backgroundColor: props.theme.palette.background.paper,
      // "& .MuiGrid-container": {
      //   position: "relative",
      //   zIndex: 1,
      //   backgroundImage: `
      //   repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
      //   repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
      //   `,
      //   backgroundSize: "44px 44px",
      // },
      // // "& .card-content": {
      // "& .MuiCardContent-root": {
      //   backgroundImage: `
      //     repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
      //     repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      //   `,
      // },
      // ✅ REMOVED: Heavy paper texture patterns
      // ✅ REMOVED: Complex grid patterns
      // ✅ REMOVED: Multiple repeating-linear-gradients
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
        // "& .MuiRazethLogin-card": {
        //   borderRadius: theme.spacing(1),
        //   boxShadow:
        //     theme.palette.mode === "dark"
        //       ? theme.shadows[2]
        //       : theme.shadows[1],
        //   backgroundColor:
        //     theme.palette.mode === "dark"
        //       ? theme.palette.grey[800]
        //       : theme.palette.background.paper,
        // },
      }),
    },
    {
      props: { variant: "full" },
      style: ({ theme }: { theme: Theme }) => ({
        "& .MuiRazethLogin-content": {
          [theme.breakpoints.up("md")]: {
            maxWidth: "75%",
          },
        },
        // "& .MuiRazethLogin-card": {
        //   borderRadius: theme.spacing(3),
        //   boxShadow:
        //     theme.palette.mode === "dark"
        //       ? theme.shadows[8]
        //       : theme.shadows[6],
        //   backgroundColor:
        //     theme.palette.mode === "dark"
        //       ? theme.palette.grey[900]
        //       : theme.palette.background.paper,
        // },
      }),
    },
  ],
};

// ============================================ //
// STAR COMPONENTS - MINIMAL OVERRIDES          //
// ============================================ //
export const RazethShootingStarOptimized = {
  styleOverrides: {
    root: {
      // ✅ Minimal - Component handles all dynamic styles
      position: "absolute",
      // animationFillMode: "backwards",
      willChange: "transform, opacity", // ✅ GPU optimization
      // offsetRotate: "auto" /* 👈 aligns with path direction */,
      // offsetAnchor: "right center",
      // offsetDistance: "0%",
      // borderRadius: "500% 100% 100% 500%",
      // span: {
      //   position: "absolute",
      //   zIndex: 3,
      //   borderRadius: "50%",
      //   display: "flex",
      //   justifyContent: "center",
      //   alignItems: "center",
      //   /* Apply your background directly to the main container */
      //   background:
      //     'url("/static/images/moon_in_comic_style.svg") no-repeat center center',
      //   // backgroundColor: "#FFFFFF10",
      //   // backgroundBlendMode: "multiply",
      //   backgroundSize: "cover",
      //   willChange: "transform, opacity", // ✅ GPU optimization
      // },
      // "::before": {
      //   content: '""',
      //   position: "absolute",
      //   borderRadius: "100%",
      //   transform: "translateX(50%) rotateZ(45deg)",
      //   animationFillMode: "backwards",
      //   willChange: "width, transform", // ✅ GPU optimization
      // },
      // "::after": {
      //   content: '""',
      //   position: "absolute",
      //   borderRadius: "100%",
      //   transform: "translateX(50%) rotateZ(-45deg)",
      //   animationFillMode: "backwards",
      //   willChange: "width, transform", // ✅ GPU optimization
      // },
    },
  },
};

export const RazethTwinkleStarOptimized = {
  styleOverrides: {
    root: {
      // ✅ Minimal - Component handles all dynamic styles
      position: "absolute",
      // borderRadius: "50%",
      // pointerEvents: "none",
      // background: "#FFF",
      willChange: "transform, opacity", // ✅ GPU optimization
      // zIndex: 3,
      // "::before": {
      //   content: '""',
      //   position: "absolute",
      //   borderRadius: "100%",
      //   transform: "translateX(50%) rotateZ(45deg)",
      //   willChange: "width, transform", // ✅ GPU optimization
      // },
      // "::after": {
      //   content: '""',
      //   position: "absolute",
      //   borderRadius: "100%",
      //   transform: "translateX(50%) rotateZ(-45deg)",
      //   willChange: "width, transform", // ✅ GPU optimization
      // },
    },
  },
};

export const RazethMeteorOptimized = {
  styleOverrides: {
    root: (props: { theme: Theme }) => ({
      position: "absolute",
      inset: 0,
      // width: "100%",
      // height: "100%",
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 1,
      willChange: "contents",
      // You can add custom styles here that will apply to all meteors
      // Example: Add a subtle glow effect
      // filter:
      //   props.theme.palette.mode === "dark"
      //     ? "drop-shadow(0 0 10px #ffffff1a)"
      //     : "none",
    }),
    item: {
      // Styles for individual meteor items
      position: "absolute",
      // pointerEvents: "none",
      // STATIC TRANSITION RULES:
      // We define WHAT animates and HOW here.
      // The component only defines HOW LONG (duration).
      // transitionProperty: "transform",
      // transitionTimingFunction: "linear",
      willChange: "transform", // Performance optimization

      // HERE IS THE DYNAMIC STYLE, DEFINED IN THE THEME:
      // We tell the browser: "Use the value provided in the variable --m-left"
      // left: "var(--m-left, 0)",
      // top: "var(--m-top, 0)",
      // // zIndex: "var(--m-z, 1)",
      // transform: "var(--m-transform)",
      // transitionDuration: "var(--m-duration, 0s)",
    },
    content: {
      // Base visual styles
      // backgroundImage: "url(static/images/meteors-sprite.png)",
      // backgroundSize: "4800% 100%", // 48 frames
      // backgroundRepeat: "no-repeat",
      // animation: `${meteorStrike} 2.5s steps(47) infinite`,
      // transform: "rotate(45deg)",
      willChange: "background-position",
    },
    sprite: {
      // Styles for meteor sprites
      // You can override animation timing, filters, etc.
    },
  },
  defaultProps: {
    // Default props for all MeteorShower instances
    enabled: true,
    interval: 500,
  },
};

// ============================================ //
//          SIDE IMAGE - SIMPLIFIED             //
// ============================================ //
export const RazethSideImageOptimized = {
  styleOverrides: {
    root: (props: { theme: Theme }) => ({
      position: "relative",
      /*** New CSS ***/
      overflow: "hidden", // prevents scrollbars
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      // ✅ REMOVED: Heavy animated gradient patterns in ::before
      // "&::before": {
      //   content: "''",
      //   position: "absolute",
      //   inset: 0,
      //   "--c": "7px",
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
    content: (props: { theme: Theme }) => ({
      position: "absolute",
      width: "100%",
      height: "100%",

      // ✅ REMOVED: Heavy repeating-linear-gradients
      // backgroundImage: `
      //   repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
      // `,
    }),
    card: (props: { theme: Theme }) => ({
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      width: props.theme.custom.sideImage.circleSize || "35%", // one-third of parent width
      aspectRatio: "1 / 1",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // center it
      // boxShadow: "0 0 20px 10px rgba(30, 64, 175, 0.5)",
      boxShadow: `0 0 20px 10px ${props.theme.palette.primary.main}50`,
      // "&::before": {
      //   content: "''",
      //   position: "absolute",
      //   inset: 0,
      //   borderRadius: "50%",
      //   animation: `${makePulseKeyframes(
      //     props.theme.custom.sideImage.circlePulseSequence
      //   )} ${
      //     props.theme.custom.sideImage.circlePulseDuration
      //   } ease-in-out infinite`,
      // },

      /*** Animation ***/
      backgroundColor: "#000",
      // ✅ Keep essential animations only
      backgroundImage:
        props.theme.custom.sideImage.animationBackground.backgroundImage,
      backgroundSize:
        props.theme.custom.sideImage.animationBackground.backgroundSize,

      // animation: `${hi} 150s linear infinite`,
      // "&::after": {
      //   content: "''",
      //   borderRadius: "50%",
      //   position: "absolute",
      //   inset: 0,
      //   zIndex: 1,
      //   backgroundImage: `radial-gradient(
      //     circle at 50% 50%,
      //     #0000 0,
      //     #0000 2px,
      //     hsl(0 0 4%) 2px
      //   )`,
      //   backgroundSize: "8px 8px",
      //   "--f": "blur(1em) brightness(6)",
      //   animation: `${hii} 10s linear infinite`,
      // },
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
};

// ============================================ //
//          AVATAR - KEEP ESSENTIALS            //
// ============================================ //
export const RazethAvatarOptimized = {
  styleOverrides: {
    root: (props: { theme: Theme }) => ({
      margin: props.theme.spacing(0, 0, 0, 0),
      display: "flex", // Use flexbox for alignment
      flexDirection: "column", // Arrange items vertically
      alignItems: "center", // Center items horizontally
      "& .MuiAvatar-root": {
        "--avatar-size": "min(12vmin, 70px)", // responsive size
        width: "var(--avatar-size)",
        height: "var(--avatar-size)",

        marginBottom: props.theme.spacing(1),
        backgroundImage: `url('https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg')`,
        // color: props.theme.palette.primary.main,
        // position: "relative",

        /*** Globe Animation ***/
        // zIndex: 5,
        // transition: "left 0.5s linear",
        backgroundSize: "cover",
        backgroundPosition: "left",
        // bottom: 0,
        borderRadius: "50%",
        animation: `${earthRotate} 90s linear infinite`,
        // boxShadow: buildResponsiveShadow(),
        boxShadow: `
              0 0 calc(var(--avatar-size) * 0.08) rgba(255,255,255,0.2),
              calc(var(--avatar-size) * -0.02) 0 calc(var(--avatar-size) * 0.03) #c3f4ff inset
            `,
      },
      "& svg": { fill: "#fff" },
    }),
  },
};

// ============================================
// EXPORT OPTIMIZED COMPONENT OVERRIDES
// ============================================
export const optimizedComponentOverrides = {
  RazethLogin: RazethLoginOptimized,
  RazethShootingStar: RazethShootingStarOptimized,
  RazethTwinkleStar: RazethTwinkleStarOptimized,
  RazethMeteor: RazethMeteorOptimized,
  RazethSideImage: RazethSideImageOptimized,
  RazethAvatar: RazethAvatarOptimized,

  // Keep your other component overrides as-is
  // RazethLoginForm, RazethDivider, RazethSocialLogin, etc.
};
