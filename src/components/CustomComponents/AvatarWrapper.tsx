import { hi, hii } from "@/theme/keyframes";
import { makePulseKeyframes } from "@/utils/themeUtils";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const PREFIX = "RazethAvatarWrapper";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
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
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    animation: `${makePulseKeyframes(
      theme.custom.sideImage.circlePulseSequence,
    )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
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

const AvatarWrapper = ({
  children,
  icon,
}: {
  children?: ReactNode;
  icon?: ReactNode;
}) => {
  return (
    <Root>
      {children}
      <IconWrapper>{icon}</IconWrapper>
    </Root>
  );
};

export default AvatarWrapper;
