import { styled } from "@mui/material/styles";

const PREFIX = "RazethTV404";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    columnGap: "6em",
    zIndex: 0,
    marginBottom: "2em",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
    fontFamily: "Montserrat",
    [theme.breakpoints.down("sm")]: {
        columnGap: "4em",
    },
}));

const Text404Digit = styled("div", {
    name: PREFIX,
    slot: "Content",
    overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
    transform: "scaleY(24.5) scaleX(9)",
    [theme.breakpoints.down("sm")]: {
        transform: "scaleY(25) scaleX(8)",
    },
}));

const Text404 = () => {
    return (
        <Root>
            <Text404Digit>4</Text404Digit>
            <Text404Digit>0</Text404Digit>
            <Text404Digit>4</Text404Digit>
        </Root>
    );
}

export default Text404