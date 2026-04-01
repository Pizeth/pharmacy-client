import { borderAnimation } from "@/theme/keyframes";
import Box from "@mui/material/Box";
import { styled, useThemeProps } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { DrawerToggleProps } from "@/interfaces/component-props.interface";
import { ReactNode } from "react";
import AvatarWrapper from "@/components/CustomComponents/AvatarWrapper";

const PREFIX = "RazethNavToggle";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<DrawerToggleProps>(({ theme }) => ({
  // flexGrow: 1,
  position: "relative",
  width: `max(50px, 5rem)`,
  height: `max(50px, 5rem)`,
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  overflow: "hidden",
  margin: `${theme.spacing(1)}`,
  boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
  [theme.breakpoints.up("xs")]: {
    display: "flex",
  },
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-1px clamp(10px, 2vmin, 2.5vmin)",
    background: `linear-gradient(315deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
    // background: "linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent)",
    transition: "0.5s",
    animation: `${borderAnimation} 3s linear infinite`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "1px",
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
  [`&:hover .${PREFIX}-Wrapper`]: {
    [`&. ${PREFIX}-Icon`]: {
      opacity: 1,
    },
  },

  // [`&:hover .${PREFIX}-Icon::after`]: {
  //   animation: `${makePulseKeyframes([
  //     { offset: 0, opacity: 0.5, scale: 1 },
  //     { offset: 1, opacity: 0, scale: 1.5 },
  //   ])} 1.5s infinite`,
  // },
}));

// const Wrapper = styled(Box, {
//   name: PREFIX,
//   slot: "Wrapper",
//   overridesResolver: (_props, styles) => styles.wrapper,
// })(({ theme }) => ({
//   position: "absolute",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   inset: "0.25vmin",
//   border: "3px solid #070a1c",
//   borderRadius: "50%",
//   overflow: "hidden",
//   zIndex: 3,
//   "&::before": {
//     content: "''",
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     animation: `${makePulseKeyframes(
//       theme.custom.sideImage.circlePulseSequence,
//     )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
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

// const IconWrapper = styled(Box, {
//   name: PREFIX,
//   slot: "Icon",
//   overridesResolver: (_props, styles) => styles.icon,
// })(({ theme }) => ({
//   position: "relative",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   justifyItems: "center",
//   padding: "0.75rem",
//   width: "100%",
//   height: "100%",
//   // background: theme.palette.error.main,
//   // color: "white",
//   color: theme.palette.error.main,
//   borderRadius: "50%",
//   // fontSize: "1.25rem",
//   // font - weight: 500;
//   textTransform: "uppercase",
//   letterSpacing: "0.05rem",
//   textDecoration: "none",
//   // transition: " 0.5s",
//   transition: "all 0.5s ease-in-out",
//   opacity: 0,
//   zIndex: 5,
//   "&:hover": {
//     opacity: 1,
//   },
//   // The Pulse Ripple Effect
//   // "&::after": {
//   //   content: '""',
//   //   position: "absolute",
//   //   width: "100%",
//   //   height: "100%",
//   //   borderRadius: "50%",
//   //   border: `2px solid ${theme.palette.error.main}`,
//   //   opacity: 0,
//   // },
// }));

const DrawerToggle = (inProps: DrawerToggleProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, icon = defaultIcon, ...rest } = props;
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Root {...rest}>
      {/* <Logo /> */}
      <DrawerToggle.wrapper children={children} icon={icon} />
    </Root>
  );
};

DrawerToggle.wrapper = ({
  children,
  icon,
}: {
  children?: ReactNode;
  icon?: ReactNode;
}) => (
  <AvatarWrapper icon={icon}>
    {children}
    {/* <DrawerToggle.icon icon={icon} /> */}
  </AvatarWrapper>
);

// DrawerToggle.icon = ({ icon = <MenuIcon /> }: { icon?: ReactNode }) => {
//   return <IconWrapper>{icon}</IconWrapper>;
// };

const defaultIcon = <MenuIcon />;

export default DrawerToggle;
