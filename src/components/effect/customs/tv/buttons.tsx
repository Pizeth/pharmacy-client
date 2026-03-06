import { styled } from "@mui/material/styles";
import Speakers from "./speaker";

const PREFIX = "RazethTVButtons";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    width: "4.25em",
    alignSelf: "center",
    height: "8em",
    backgroundColor: "#e69635",
    border: "2px solid #1d0e01",
    padding: "0.6em",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    rowGap: "0.75em",
    boxShadow: "3px 3px 0px #e69635",
}));

const ButtonKnob = styled("div", {
    name: PREFIX,
    slot: "Item",
    overridesResolver: (_props, styles) => styles.item,
})<{ variant?: "left" | "right" }>(({ variant = "left" }) => ({
    width: "1.65em",
    height: "1.65em",
    borderRadius: "50%",
    backgroundColor: "#7f5934",
    border: "2px solid black",
    boxShadow:
        "inset 2px 2px 1px #b49577, -2px 0px #513721, -2px 0px 0px 1px black",
    position: "relative",
    "&::before":
        variant === "left"
            ? {
                content: '""',
                position: "absolute",
                marginTop: "1em",
                marginLeft: "0.5em",
                transform: "rotate(47deg)",
                borderRadius: "5px",
                width: "0.1em",
                height: "0.4em",
                backgroundColor: "#000000",
            }
            : {
                content: '""',
                position: "absolute",
                marginTop: "1.05em",
                marginLeft: "0.8em",
                transform: "rotate(-45deg)",
                borderRadius: "5px",
                width: "0.15em",
                height: "0.4em",
                backgroundColor: "#000000",
            },
    "&::after":
        variant === "left"
            ? {
                content: '""',
                position: "absolute",
                marginTop: "0.9em",
                marginLeft: "0.8em",
                transform: "rotate(47deg)",
                borderRadius: "5px",
                width: "0.1em",
                height: "0.55em",
                backgroundColor: "#000000",
            }
            : {
                content: '""',
                position: "absolute",
                marginTop: "-0.1em",
                marginLeft: "0.65em",
                transform: "rotate(-45deg)",
                width: "0.15em",
                height: "1.5em",
                backgroundColor: "#000000",
            },
}));

const ButtonKnobInner = styled("div", {
    name: PREFIX,
    slot: "Effect",
    overridesResolver: (_props, styles) => styles.effect,
})(() => ({
    content: '""',
    position: "absolute",
    marginTop: "-0.1em",
    marginLeft: "0.65em",
    transform: "rotate(45deg)",
    width: "0.15em",
    height: "1.5em",
    backgroundColor: "#000000",
}));

const Buttons = () => {
    return (
        <Root>
            <ButtonKnob variant="left">
                <ButtonKnobInner />
            </ButtonKnob>
            <ButtonKnob variant="right">
            </ButtonKnob>
            <Speakers />
        </Root>
    );
};

export default Buttons;