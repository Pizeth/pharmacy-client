import { RazethAvatarContainerProps } from "@/interfaces/component-props.interface";
import { LocalPoliceOutlined } from "@mui/icons-material";
import { Chip as MuiChip } from "@mui/material";
import Box from "@mui/material/Box";
import { alpha, styled, useThemeProps } from "@mui/material/styles";

const PREFIX = "RazethAvatarContainer";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "relative",
  display: "inline-grid",
  margin: "auto",
  // border: "1px solid #f0f0f0",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  justifyItems: "center",
  // padding: "0.75rem",
  // width: `max(50px, 5rem)`,
  // height: `max(50px, 5rem)`,
  marginBottom: theme.spacing(1.5),
  transition: "all 0.5s",
}));

const Chip = styled(MuiChip, {
  name: PREFIX,
  slot: "Chip",
  overridesResolver: (_props, styles) => styles.chip,
})(({ theme }) => ({
  // width: "fit-content",
  // display: "flex-content",
  // padding: theme.spacing(0),
  marginTop: theme.spacing(-3),
  height: "1.35rem",
  fontSize: "0.725rem",
  fontWeight: 900,
  textTransform: "uppercase",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.primary.main, 0.555),
  // color: theme.palette.primary.main,
  color: alpha(theme.palette.common.white, 0.925),
  border: "none",
  zIndex: 999,
}));

const AvatarContainer = (inProps: RazethAvatarContainerProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, icon = defaultIcon, role, size, ...rest } = props;
  return (
    <Root {...rest}>
      {/* <Wrapper> */}
      {children}
      <Chip icon={icon} label={role} size={size} />
      {/* </Wrapper> */}
    </Root>
  );
};

const defaultIcon = <LocalPoliceOutlined fontSize="inherit" color="inherit" />;

export default AvatarContainer;
