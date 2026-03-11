import { borderAnimation } from "@/theme/keyframes";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';

const PREFIX = "RazethNavToggle";
const Root = styled(Box, {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    position: "relative",
    // width: "250px",
    // height: "250px",
    width: `max(40px, 7vmin)`,
    height: `max(40px, 7vmin)`,
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        inset: "-1px clamp(10px, 2vmin, 2.5vmin)",
        // inset: "0",
        // background: "linear-gradient(315deg, #00ccff, #d400d4)",
        background: `linear-gradient(315deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
        // background: "linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent)",
        transition: "0.5s",
        animation: `${borderAnimation} 3s linear infinite`,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        inset: "1px",
        // background: "#162052",
        background: theme.palette.background.paper,
        borderRadius: "50%",
        zIndex: 1,
    },
    "&:hover": {
        img: {
            opacity: 0,
        },
        // svg: {
        //     opacity: 0,
        // }
    },
    "&:hover::before": {
        inset: "-20px 0px"
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
        // opacity: 0,
    },
}))

const Wrapper = styled(Box, {
    name: PREFIX,
    slot: "Wrapper",
    overridesResolver: (_props, styles) => styles.wrapper,
})(() => ({
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    inset: "0.25vmin",
    border: "3px solid #070a1c",
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: 3,
}))

const IconWrapper = styled(Box, {
    name: PREFIX,
    slot: "Icon",
    overridesResolver: (_props, styles) => styles.icon,
})(({ theme }) => ({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
    padding: "0.75rem",
    // background: theme.palette.error.main,
    // color: "white",
    color: theme.palette.error.main,
    borderRadius: "50%",
    // fontSize: "1.25rem",
    // font - weight: 500;
    textTransform: "uppercase",
    letterSpacing: "0.05rem",
    textDecoration: "none",
    transition: " 0.5s",
    opacity: 0,
    "&:hover": {
        opacity: 1,
    }
}));

const DrawerToggle = ({ children, icon = <MenuIcon /> }: { children?: React.ReactNode, icon?: React.ReactNode }) => {
    return (
        <Root>
            <Wrapper>
                {children}
                <IconWrapper>{icon}</IconWrapper>
            </Wrapper>
        </Root>
    );
}

export default DrawerToggle