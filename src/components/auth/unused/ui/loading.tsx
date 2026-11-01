import { styled, Theme, useTheme, useThemeProps } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { CircularProgressProps } from "@mui/material/CircularProgress";
import { infiniteRotate } from "@/theme/keyframes";

const PREFIX = "RazethLoader";

const StyledWrapper1 = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({}) => ({
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: "100%",

  display: "inline-block",
  position: "relative",
  width: 60,
  height: 60,
  borderRadius: "50%",

  //   ".spinner::before",
  //   ".spinner::after": {
  //     content: "",
  //     position: "absolute",
  //     borderRadius: "inherit",
  //   },

  "::before": {
    content: "",
    position: "absolute",
    borderRadius: "inherit",
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(0deg, #e1232e 0%, #212121 50%)`,
    animation: `${infiniteRotate} 0.5s infinite linear`,
  },

  "::after": {
    content: "",
    position: "absolute",
    borderRadius: "inherit",
    width: "85%",
    height: "85%",
    // backgroundColor: "#212121",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  //   "@keyframes spin": {
  //     to {
  //       transform: "rotate(360deg)";
  //     }
  //   }
}));

const Loader = (inProps: CircularProgressProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const { classes, sx, ...rest } = props;
  return (
    <StyledWrapper className={classes?.root} sx={sx} {...rest}>
      {/* <div className="spinner" /> */}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({}) => ({
  position: "relative",
  width: 40,
  height: 40,
  borderRadius: "50%",

  "::before": {
    content: "",
    position: "absolute",
    borderRadius: "inherit",
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(0deg,  #e1232e 0%, #333399 100%)`,
    animation: `${infiniteRotate} 0.5s infinite linear`,
  },

  "::after": {
    content: "",
    position: "absolute",
    borderRadius: "inherit",
    width: "85%",
    height: "85%",
    backgroundColor: "#222",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export default Loader;
