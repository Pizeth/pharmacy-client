import { styled } from "@mui/material/styles";

const PREFIX = "RazethTVBottom";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "8.7em",
    position: "relative",
}));

const BaseLeg = styled("div", {
    name: PREFIX,
    slot: "Item",
    overridesResolver: (_props, styles) => styles.item,
})(() => ({
    height: "1em",
    width: "2em",
    border: "2px solid #171717",
    backgroundColor: "#4d4d4d",
    marginTop: "-0.15em",
    // zIndex: -1,
}));

const BaseBar = styled("div", {
    name: PREFIX,
    slot: "Effect",
    overridesResolver: (_props, styles) => styles.effect,
})(() => ({
    position: "absolute",
    height: "0.15em",
    width: "17.5em",
    backgroundColor: "#171717",
    marginTop: "0.8em",
}));

const Bottom = () => {
    return (
        <Root>
            <BaseLeg />
            <BaseLeg />
            <BaseBar />
        </Root>
    );
};

export default Bottom;