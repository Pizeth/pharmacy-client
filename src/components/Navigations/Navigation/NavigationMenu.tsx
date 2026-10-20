import { styled } from "@mui/material/styles";
import { NavItems } from "./NavItems";
const PREFIX = "RazethNav";
const NavRoot = styled("nav", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root
})(({
  theme
}) => ({
  flexGrow: 1,
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  alignSelf: "stretch",
  [theme.breakpoints.up("xs")]: {
    display: "none"
  },
  [theme.breakpoints.up("sm")]: {
    display: "block"
  },
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));
const Navigation = ({
  variant = "vertical"
}: {
  variant?: "vertical" | "horizontal";
}) => {
  return <NavRoot>

            <NavItems variant={variant} />
        </NavRoot>;
};
export default Navigation;
