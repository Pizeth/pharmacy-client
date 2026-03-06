import { styled } from "@mui/material/styles";

const PREFIX = "RazethTVLines";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    display: "flex",
    columnGap: "0.1em",
    alignSelf: "flex-end",
}));

const LineShort = styled("div", {
    name: PREFIX,
    slot: "Item",
    overridesResolver: (_props, styles) => styles.item,
})(() => ({
    width: "2px",
    height: "0.5em",
    backgroundColor: "black",
    borderRadius: "25px 25px 0px 0px",
    marginTop: "0.5em",
}));

const LineTall = styled("div", {
    name: PREFIX,
    slot: "Effect",
    overridesResolver: (_props, styles) => styles.effect,
})(() => ({
    flexGrow: 1,
    width: "2px",
    height: "1em",
    backgroundColor: "black",
    borderRadius: "25px 25px 0px 0px",
}));

const Lines = () => {
    return (
        <Root>
            <LineShort />
            <LineTall />
            <LineShort />
        </Root>
    )
};

export default Lines;