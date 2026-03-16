import { borderAnimation, filt, hi, hii, wee } from "@/theme/keyframes";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { makePulseKeyframes } from "@/utils/themeUtils";

const PREFIX = "RazethNavToggle";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "relative",
  // width: "250px",
  // height: "250px",
  width: `max(50px, 10vmin)`,
  height: `max(50px, 10vmin)`,
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  overflow: "hidden",
  margin: `${theme.spacing(1)}`,
  boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-1px clamp(10px, 2vmin, 2.5vmin)",
    // inset: "0",
    // background: "linear-gradient(315deg, #00ccff, #d400d4)",
    background: `linear-gradient(315deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
    // background: "linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent)",
    transition: "0.5s",
    animation: `${borderAnimation} 3s linear infinite`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "1px",
    // background: "#162052",
    background: theme.palette.background.paper,
    borderRadius: "50%",
    zIndex: 1,
  },
  "&:hover": {
    img: {
      opacity: 0,
    },
    wrapper: {
      icon: {
        svg: {
          opacity: 1,
        },
      },
    },
  },
  "&:hover::before": {
    inset: "-20px 0px",
  },
  img: {
    p: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "0.75s",
    pointerEvents: "none",
    zIndex: 3,
    // opacity: 0,
  },
  // TARGETING THE SLOT:
  // MUI automatically generates the class .RazethNavToggle-Icon
  // because you named the slot "Icon" in the styled() config.
  [`&:hover .${PREFIX}-Icon`]: {
    opacity: 1,
  },

  // [`&:hover .${PREFIX}-Icon::after`]: {
  //   animation: `${makePulseKeyframes([
  //     { offset: 0, opacity: 0.5, scale: 1 },
  //     { offset: 1, opacity: 0, scale: 1.5 },
  //   ])} 1.5s infinite`,
  // },
}));

const Wrapper = styled(Box, {
  name: PREFIX,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})(({ theme }) => ({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  inset: "0.25vmin",
  border: "3px solid #070a1c",
  borderRadius: "50%",
  overflow: "hidden",
  zIndex: 3,
  // "&::before": {
  //   content: "''",
  //   position: "absolute",
  //   inset: 0,
  //   "--c": "7px",
  //   backgroundColor: "#000",
  //   backgroundImage: `
  //                 radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
  //                 radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
  //                 radial-gradient(circle at 50% 50%, #f00, #f000 60%),
  //                 radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
  //                 radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
  //                 radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
  //               `,
  //   backgroundSize: `
  //                 12px 20.7846097px,
  //                 12px 20.7846097px,
  //                 200% 200%,
  //                 200% 200%,
  //                 200% 200%,
  //                 200% 20.7846097px
  //               `,
  //   "--p": "0px 0px, 6px 10.39230485px",
  //   backgroundPosition: `
  //                 var(--p),
  //                 0% 0%,
  //                 0% 0%,
  //                 0% 0px
  //               `,
  //   animation: `${wee} 40s linear infinite, ${filt} 6s linear infinite`,
  //   zIndex: 0,
  // },
  // boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
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
    backgroundSize: "8px 8px",
    "--f": "blur(1em) brightness(6)",
    animation: `${hii} 10s linear infinite`,
  },
}));

const IconWrapper = styled(Box, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  justifyItems: "center",
  padding: "0.75rem",
  width: "100%",
  height: "100%",
  // background: theme.palette.error.main,
  // color: "white",
  color: theme.palette.error.main,
  borderRadius: "50%",
  // fontSize: "1.25rem",
  // font - weight: 500;
  textTransform: "uppercase",
  letterSpacing: "0.05rem",
  textDecoration: "none",
  // transition: " 0.5s",
  transition: "all 0.5s ease-in-out",
  opacity: 0,
  zIndex: 5,
  "&:hover": {
    opacity: 1,
  },
  // The Pulse Ripple Effect
  // "&::after": {
  //   content: '""',
  //   position: "absolute",
  //   width: "100%",
  //   height: "100%",
  //   borderRadius: "50%",
  //   border: `2px solid ${theme.palette.error.main}`,
  //   opacity: 0,
  // },
}));

// const Logo = styled(Box)(({ theme }) => ({
//   // flexGrow: 1,
//   // display: { xs: "flex", sm: "block" },
//   // mr: 1,
//   // position: "relative",
//   // width: `max(40px, 7vmin)`,
//   // height: `max(40px, 7vmin)`,
//   // img: {
//   //   p: 0.5,
//   // },

//   position: "absolute",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "50%",
//   // width: "7.5%", // one-third of parent width
//   height: "97.5%",
//   aspectRatio: "1 / 1", // keep height equal to width
//   // paddingTop: "var(--app-sideImage-circleSize)", // makes height equal to width
//   // backgroundImage:
//   //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle
//   // backgroundSize: "100% 100%",
//   // backgroundBlendMode: "multiply",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)", // center it
//   // boxShadow: "0 0 20px 10px rgba(30, 64, 175, 0.5)",
//   boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
//   "&::before": {
//     content: "''",
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     // backgroundImage:
//     //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle

//     // zIndex: 0, // keep it behind children
//     // pointerEvents: "none", // don’t block clicks
//     // background: `radial-gradient(
//     //   circle,
//     //       ${props.theme.custom.sideImage.circleColor} ${
//     //   props.theme.custom.sideImage.circleSoftStop
//     // },
//     //   transparent ${props.theme.custom.sideImage.circleSoftFade}
//     //   // ${props.theme.custom.sideImage.circleColor || "#1e40af"} 70%,
//     //   // transparent 100%
//     // )`,
//     // backgroundImage: `radial-gradient(
//     //   circle at 50% 50%,
//     //   ${makeRadialStops(
//     //     props.theme.custom.sideImage.circleColor,
//     //     props.theme.custom.sideImage.circleStopCount,
//     //     props.theme.custom.sideImage.maxOpacity
//     //   )}
//     // )`,
//     animation: `${makePulseKeyframes(
//       theme.custom.sideImage.circlePulseSequence,
//     )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
//     // backgroundSize: "100% 100%",
//   },

//   /*** Animation ***/
//   // "--c": "#09f",
//   backgroundColor: "#000",
//   backgroundImage: theme.custom.sideImage.animationBackground.backgroundImage,
//   backgroundSize: theme.custom.sideImage.animationBackground.backgroundSize,

//   animation: `${hi} 150s linear infinite`,
//   "&::after": {
//     content: "''",
//     borderRadius: "50%",
//     position: "absolute",
//     inset: 0,
//     zIndex: 1,
//     backgroundImage: `radial-gradient(
//                 circle at 50% 50%,
//                 #0000 0,
//                 #0000 2px,
//                 hsl(0 0 4%) 2px
//               )`,
//     backgroundSize: "8px 8px",
//     "--f": "blur(1em) brightness(6)",
//     animation: `${hii} 10s linear infinite`,
//   },
// }));

const DrawerToggle = ({
  children,
  icon = <MenuIcon />,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <Root>
      {/* <Logo /> */}
      <Wrapper>
        {children}
        <IconWrapper>{icon}</IconWrapper>
      </Wrapper>
    </Root>
  );
};

export default DrawerToggle;
