import { styled, keyframes } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import { NavItems } from "./NavItems";
// import Box from "@mui/material/Box";

// ─── Slot Prefix ──────────────────────────────────────────────────────────────

const PREFIX = "RazethNav";

// ─── Slots ────────────────────────────────────────────────────────────────────

const NavRoot = styled("nav", {
    name: PREFIX,
    slot: "Root",
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    // position: "relative",
    // width: "400px",
    // height: "70px",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    alignSelf: "stretch",
    // background: "#333",
    // borderRadius: "10px",
    [theme.breakpoints.up("xs")]: {
        display: "none",
    },
    [theme.breakpoints.up("sm")]: {
        display: "block",
    },
    [theme.breakpoints.up("md")]: {
        display: "flex",
    }
}));

// ─── Component ────────────────────────────────────────────────────────────────

const Navigation = ({ variant = "vertical" }: { variant?: "vertical" | "horizontal" }) => {
    return (
        <NavRoot>
            {/* <NavList>
                {NAV_ITEMS.map(({ label, Icon }, i) => (
                    <NavItem
                        key={label}
                        active={activeIndex === i}
                        onClick={() => setActiveIndex(i)}
                    >
                        <NavLink href="#" onClick={(e) => e.preventDefault()}>
                            <NavIcon className="nav-icon">
                                <Icon />
                            </NavIcon>
                            <NavText className="nav-text">{label}</NavText>
                        </NavLink>
                    </NavItem>
                ))}

                <Indicator activeIndex={activeIndex} />
            </NavList> */}
            <NavItems variant={variant} />  {/* client boundary is here, not at the layout level */}
        </NavRoot>
    );
};

export default Navigation;
