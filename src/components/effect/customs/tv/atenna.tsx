import { styled } from "@mui/material/styles";

const PREFIX = "RazethTVAntenna";
const Root = styled("div", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    width: "5em",
    height: "5em",
    borderRadius: "50%",
    border: "2px solid black",
    backgroundColor: "#f27405",
    marginBottom: "-6em",
    // zIndex: -1,
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        marginTop: "-9.4em",
        marginLeft: "0.4em",
        transform: "rotate(-25deg)",
        width: "1em",
        height: "0.5em",
        borderRadius: "50%",
        backgroundColor: "#f69e50",
    },
    "&::before": {
        content: '""',
        position: "absolute",
        marginTop: "0.2em",
        marginLeft: "1.25em",
        transform: "rotate(-20deg)",
        width: "1.5em",
        height: "0.8em",
        borderRadius: "50%",
        backgroundColor: "#f69e50",
    },
}));;

const AntennaShadow = styled("div", {
    name: PREFIX,
    slot: "Effect",
    overridesResolver: (_props, styles) => styles.effect,
})(() => ({
    position: "absolute",
    backgroundColor: "transparent",
    width: "50px",
    height: "56px",
    marginLeft: "1.68em",
    borderRadius: "45%",
    transform: "rotate(140deg)",
    border: "4px solid transparent",
    boxShadow:
        "inset 0px 16px #a85103, inset 0px 16px 1px 1px #a85103",
}));

const AntennaRod1 = styled("div", {
    name: PREFIX,
    slot: "AntennaRod1",
    overridesResolver: (_props, styles) => styles.antennaRod1,
})(() => ({
    position: "relative",
    top: "-102%",
    left: "-130%",
    width: "12em",
    height: "5.5em",
    borderRadius: "50px",
    backgroundImage:
        "linear-gradient(#171717, #171717, #353535, #353535, #171717)",
    transform: "rotate(-29deg)",
    clipPath: "polygon(50% 0%, 49% 100%, 52% 100%)",
}));

const AntennaRod1Dot = styled("div", {
    name: PREFIX,
    slot: "AntennaRod1Dot",
    overridesResolver: (_props, styles) => styles.antennaRod1Dot,
})(() => ({
    position: "relative",
    top: "-211%",
    left: "-35%",
    transform: "rotate(45deg)",
    width: "0.5em",
    height: "0.5em",
    borderRadius: "50%",
    border: "2px solid black",
    backgroundColor: "#979797",
    zIndex: 99,
}));

const AntennaRod2 = styled("div", {
    name: PREFIX,
    slot: "AntennaRod2",
    overridesResolver: (_props, styles) => styles.antennaRod2,
})(() => ({
    position: "relative",
    top: "-210%",
    left: "-10%",
    width: "12em",
    height: "4em",
    borderRadius: "50px",
    backgroundImage:
        "linear-gradient(#171717, #171717, #353535, #353535, #171717)",
    marginRight: "5em",
    clipPath:
        "polygon(47% 0, 47% 0, 34% 34%, 54% 25%, 32% 100%, 29% 96%, 49% 32%, 30% 38%)",
    transform: "rotate(-8deg)",
}));

const AntennaRod2Dot = styled("div", {
    name: PREFIX,
    slot: "AntennaRod2Dot",
    overridesResolver: (_props, styles) => styles.antennaRod2Dot,
})(() => ({
    position: "relative",
    top: "-294%",
    left: "94%",
    width: "0.5em",
    height: "0.5em",
    borderRadius: "50%",
    border: "2px solid black",
    backgroundColor: "#979797",
    zIndex: 99,
}));

const Antenna = () => {
    return (
        <Root>
            <AntennaShadow />
            <AntennaRod1 />
            <AntennaRod1Dot />
            <AntennaRod2 />
            <AntennaRod2Dot />
        </Root>
    );
}

export default Antenna