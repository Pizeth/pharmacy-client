import { borderAnimation } from "@/theme/keyframes";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const PREFIX = "RazethAvatarFrame";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: `max(50px, 5rem)`,
  height: `max(50px, 5rem)`,
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  // boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
  // boxShadow: "0px 0px 10px 1px #000000ee",
  boxShadow: "3px 3px 15px rgb(0, 0, 0), -3px -3px 15px rgb(58, 58, 58)",
  // overflow: "hidden",
  // margin: `${theme.spacing(1)}`,
  // width: `fill-available`,
  // height: `fill-available`,
  [theme.breakpoints.up("xs")]: {
    display: "flex",
  },
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}));

const Container = styled(Box, {
  name: PREFIX,
  slot: "Container",
  overridesResolver: (_props, styles) => styles.container,
})(({ theme }) => ({
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 300ms",
  boxShadow: "0px 0px 10px 1px #000000ee",
  borderRadius: "50%",
}));

const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",

  backfaceVisibility: "hidden",
  overflow: "hidden",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  borderRadius: "50%",
  "&::before": {
    content: '""',
    position: "absolute",
    // display: "block",
    width: "75%",
    height: "150%",
    borderRadius: "50%",
    background: `linear-gradient(
      90deg, 
      transparent,
      ${theme.palette.error.main},
      ${theme.palette.primary.main},
      transparent
    )`,
    transition: "0.5s",
    animation: `${borderAnimation} 3s linear infinite`,
  },
}));

const AvatarFrame = ({ children }: { children?: ReactNode }) => {
  return (
    <Root>
      {/* <Container> */}
      <Content>{children}</Content>
      {/* </Container> */}
    </Root>
  );
};

export default AvatarFrame;
