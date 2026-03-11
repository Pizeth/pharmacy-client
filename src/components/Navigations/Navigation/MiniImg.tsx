import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";

const PREFIX = "RazethMiniImg";
const Root = styled(Box, {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    // display: { xs: "flex", sm: "block" },
    // mr: 1,
    // position: "relative",
    // width: `max(40px, 7vmin)`,
    // height: `max(40px, 7vmin)`,
    top: 0,
    left: 0,
    // width: "100%",
    // height: "100%",
    [theme.breakpoints.up("xs")]: {
        display: "flex",
    },
    [theme.breakpoints.up("sm")]: {
        display: "block",
    },
    img: {
        p: 0.5,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        transition: "0.75s",
        pointerEvents: "none",
        zIndex: 3,
    },
}));

const MiniImg = ({ src = "/static/images/logo.svg" }) => {
    return (
        <Root>
            <Image
                src={src}
                alt="Logo"
                preload={false}
                loading="eager"
                fill
                style={{ objectFit: "contain" }}
                unoptimized
            />
        </Root>
    )
};

export default MiniImg;

{/* <Box
    sx={{
        flexGrow: 1,
        display: { xs: "flex", sm: "block" },
        // mr: 1,
        position: "relative",
        width: `max(40px, 7vmin)`,
        height: `max(40px, 7vmin)`,
        img: {
            p: 0.5,
        },
    }}
>
    <Image
        src="/static/images/logo.svg"
        alt="Logo"
        preload={false}
        loading="eager"
        fill
        style={{ objectFit: "contain" }}
        unoptimized
    />
</Box> */}