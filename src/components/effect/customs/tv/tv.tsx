import { styled } from "@mui/material/styles";
import Antenna from "./atenna";
import Display from "./display";
import Lines from "./lines";
import Buttons from "./buttons";
import Bottom from "./bottom";
import Text404 from "./text404";

const PREFIX = "RazethTV";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
    // })(({ theme }) => ({
})<{ size?: number }>(({ theme, size = 100 }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // minHeight: "5vmin",
    // height: `${size}vmin`, // Dynamic height
    position: "relative",
    overflow: "visible",
    // height: "100vh",
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
}));

// ─── Wrapper ──────────────────────────────────────────────────────────────────

const TVWrapper = styled("div", {
    name: PREFIX,
    slot: "Wrapper",
    overridesResolver: (_props, styles) => styles.wrapper,
})(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30em",
    height: "30em",
    // backgroundColor: "#c7b29e",
}));

// ─── Main ─────────────────────────────────────────────────────────────────────

const Main = styled("div", {
    name: PREFIX,
    slot: "Main",
    overridesResolver: (_props, styles) => styles.main,
})(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5em",
}));

// ─── TV Body ──────────────────────────────────────────────────────────────────

const TVBody = styled("div", {
    name: PREFIX,
    slot: "Main",
    overridesResolver: (_props, styles) => styles.main,
})(() => ({
    width: "17em",
    height: "9em",
    marginTop: "3em",
    borderRadius: "15px",
    backgroundColor: "#d36604",
    display: "flex",
    justifyContent: "center",
    border: "2px solid #1d0e01",
    boxShadow: "inset 0.2em 0.2em #e69635",
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        width: "17em",
        height: "9em",
        borderRadius: "15px",
        background: `
      repeating-radial-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 50% 0/2500px 2500px,
      repeating-conic-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 60% 60%/2500px 2500px
    `,
        backgroundBlendMode: "difference",
        opacity: 0.09,
    },
}));

// ─── Curve ────────────────────────────────────────────────────────────────────

const CurveSVG = styled("svg", {
    name: PREFIX,
    slot: "CurveSVG",
    overridesResolver: (_props, styles) => styles.curveSVG,
})(() => ({
    position: "absolute",
    marginTop: "0.25em",
    marginLeft: "-0.25em",
    height: "12px",
    width: "12px",
}));

const TV = () => {
    return (
        <Root>
            <TVWrapper>
                <Main>
                    <Antenna />
                    <TVBody >
                        <div style={{ position: "relative" }}>
                            <CurveSVG
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 189.929 189.929"
                            >
                                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
                            </CurveSVG>
                        </div>
                        <Display />
                        <Lines />
                        <Buttons />
                    </TVBody>
                    <Bottom />
                </Main>
                {/* <Text404 /> */}
            </TVWrapper>
        </Root>
    )
}

export default TV