import { bAnimation } from "@/theme/keyframes";
import { styled } from "@mui/material/styles";

const PREFIX = "RazethTVDisplay";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: "15px",
    boxShadow: "3.5px 3.5px 0px #e69635",
}));

const ScreenOut = styled("div", {
    name: PREFIX,
    slot: "Content",
    overridesResolver: (_props, styles) => styles.content,
})(() => ({
    width: "auto",
    height: "auto",
    borderRadius: "10px",
}));

const ScreenItem = styled("div", {
    name: PREFIX,
    slot: "Main",
    overridesResolver: (_props, styles) => styles.main,
})(() => ({
    width: "11em",
    height: "7.75em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
}));

const Screen = styled("div", {
    name: PREFIX,
    slot: "Item",
    overridesResolver: (_props, styles) => styles.item,
})(({ theme }) => ({
    width: "13em",
    height: "7.85em",
    // fontFamily: "Montserrat",
    fontFamily: "var(--font-montserrat)",
    border: "2px solid #1d0e01",
    background: `
    repeating-radial-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 50% 0/2500px 2500px,
    repeating-conic-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 60% 60%/2500px 2500px
  `,
    backgroundBlendMode: "difference",
    animation: `${bAnimation} 0.2s infinite alternate`,
    borderRadius: "10px",
    zIndex: 99,
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#252525",
    letterSpacing: "0.15em",
    textAlign: "center",
    [theme.breakpoints.up("lg")]: {
        display: "flex",
    },
}));

const ScreenMobile = styled("div", {
    name: PREFIX,
    slot: "Mobile",
    overridesResolver: (_props, styles) => styles.mobile,
})(({ theme }) => ({
    width: "13em",
    height: "7.85em",
    position: "relative",
    // fontFamily: "Montserrat",
    fontFamily: "var(--font-montserrat)",
    background: `linear-gradient(
    to right,
    #002fc6 0%, #002bb2 14.2857142857%,
    #3a3a3a 14.2857142857%, #303030 28.5714285714%,
    #ff0afe 28.5714285714%, #f500f4 42.8571428571%,
    #6c6c6c 42.8571428571%, #626262 57.1428571429%,
    #0affd9 57.1428571429%, #00f5ce 71.4285714286%,
    #3a3a3a 71.4285714286%, #303030 85.7142857143%,
    white 85.7142857143%, #fafafa 100%
  )`,
    borderRadius: "10px",
    border: "2px solid black",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#252525",
    letterSpacing: "0.15em",
    textAlign: "center",
    overflow: "hidden",
    [theme.breakpoints.up("lg")]: {
        display: "none",
    },
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        height: "68.4782608696%",
        background: `linear-gradient(
      to right,
      white 0%, #fafafa 14.2857142857%,
      #ffe60a 14.2857142857%, #f5dc00 28.5714285714%,
      #0affd9 28.5714285714%, #00f5ce 42.8571428571%,
      #10ea00 42.8571428571%, #0ed600 57.1428571429%,
      #ff0afe 57.1428571429%, #f500f4 71.4285714286%,
      #ed0014 71.4285714286%, #d90012 85.7142857143%,
      #002fc6 85.7142857143%, #002bb2 100%
    )`,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        height: "21.7391304348%",
        background: `linear-gradient(
      to right,
      #006c6b 0%, #005857 16.6666666667%,
      white 16.6666666667%, #fafafa 33.3333333333%,
      #001b75 33.3333333333%, #001761 50%,
      #6c6c6c 50%, #626262 66.6666666667%,
      #929292 66.6666666667%, #888888 83.3333333333%,
      #3a3a3a 83.3333333333%, #303030 100%
    )`,
    },
}));

const NotFoundText = styled("span", {
    name: PREFIX,
    slot: "Caption",
    overridesResolver: (_props, styles) => styles.caption,
})(() => ({
    backgroundColor: "black",
    paddingLeft: "0.3em",
    paddingRight: "0.3em",
    fontSize: "0.75em",
    color: "white",
    letterSpacing: 0,
    borderRadius: "5px",
    zIndex: 10,
}));

const Display = () => {
    return (
        <Root>
            <ScreenOut>
                <ScreenItem>
                    <Screen>
                        <NotFoundText>NOT FOUND</NotFoundText>
                    </Screen>
                    <ScreenMobile>
                        <NotFoundText>NOT FOUND</NotFoundText>
                    </ScreenMobile>
                </ScreenItem>
            </ScreenOut>
        </Root>
    );
};

export default Display;