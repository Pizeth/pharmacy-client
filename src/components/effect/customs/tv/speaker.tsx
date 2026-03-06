import { styled } from "@mui/material/styles";

const PREFIX = "RazethTVSpeaker";

const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    display: "flex",
    flexDirection: "column",
    rowGap: "0.5em",
}));

const SpeakerRow = styled("div", {
    name: PREFIX,
    slot: "Wrapper",
    overridesResolver: (_props, styles) => styles.wrapper,
})(() => ({
    display: "flex",
    columnGap: "0.25em",
}));

const SpeakerDot = styled("div", {
    name: PREFIX,
    slot: "Item",
    overridesResolver: (_props, styles) => styles.item,
})(() => ({
    width: "0.65em",
    height: "0.65em",
    borderRadius: "50%",
    backgroundColor: "#7f5934",
    border: "2px solid black",
    boxShadow: "inset 1.25px 1.25px 1px #b49577",
}));

const SpeakerLine = styled("div", {
    name: PREFIX,
    slot: "Content",
    overridesResolver: (_props, styles) => styles.content,
})(() => ({
    width: "auto",
    height: "2px",
    backgroundColor: "#171717",
}));

const Speakers = () => {
    return (
        <Root>
            <SpeakerRow>
                <SpeakerDot />
                <SpeakerDot />
                <SpeakerDot />
            </SpeakerRow>
            <SpeakerLine />
            <SpeakerLine />
        </Root>
    );
}

export default Speakers