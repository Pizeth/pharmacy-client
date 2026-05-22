import { SocialButtonProps } from "@/interfaces/auth.interface";
import {
  Box,
  Button,
  IconButton,
  styled,
  Theme,
  Tooltip,
  Typography,
  useThemeProps,
} from "@mui/material";

const PREFIX = "RazethSocialButton";

// The main button component
const SocialButtonRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  borderRadius: "50px",

  /* base styles for the button */
  "& .MuiIconButton-root": {
    border: "none",
    padding: "0.575rem",
    margin: theme.spacing(0.25),
    minWidth: "1rem",
    borderRadius: "50%",
  },

  // button: {
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: theme.spacing(1),
  //   width: "100%",
  //   padding: theme.spacing(1),
  //   textTransform: "none",
  //   border: `1px solid ${theme.palette.divider}`,
  //   boxShadow: theme.vars.palette.customShadows.neumorphic,
  //   transition: theme.transitions.create(["transform", "background-color"], {
  //     duration: theme.transitions.duration.standard,
  //     easing: theme.transitions.easing.easeInOut,
  //   }),
  //   "&:hover": {
  //     border: `1px solid ${theme.vars.palette.divider}`,
  //     backgroundColor: theme.palette.action.hover,
  //     transform: "scale(1.05)", // enlarge smoothly
  //     boxShadow: theme.shadows[3],
  //   },
  //   "& svg": {
  //     width: theme.spacing(2),
  //     height: theme.spacing(2),
  //   },
  // },
}));

// The text/label part of the button
const SocialButtonLabel = styled(Typography, {
  name: PREFIX,
  slot: "Label",
  overridesResolver: (_props, styles) => styles.label,
})((props: { theme: Theme }) => ({
  /* base styles for the label, if any */
  fontWeight: "500",
  display: "none", // Hide by default
  [props.theme.breakpoints.up("sm")]: {
    display: "block", // This applies for 'sm' and larger breakpoints
  },
}));

// Custom styled button for social login
export const SocialButton = (inProps: SocialButtonProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const {
    className,
    sx,
    variant = "outlined",
    buttonType = "button",
    icon,
    label,
    href = "#",
    size = "small",
    disabled = false,
    children,
    ...rest
  } = props;

  return (
    <SocialButtonRoot className={className} sx={sx} {...rest}>
      {buttonType === "iconButton" ? (
        <Tooltip title={label}>
          <IconButton
            href={href}
            target="_blank"
            size={size}
            color="inherit"
            disabled={disabled}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant={variant} disabled={disabled}>
          {icon}
          <SocialButtonLabel variant="body2">{children}</SocialButtonLabel>
        </Button>
      )}
    </SocialButtonRoot>
  );
};

export default SocialButton;

// Custom styled button for social login
// const SocialButton = styled(Button)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: theme.spacing(1),
//   width: "100%",
//   padding: theme.spacing(1),
//   textTransform: "none",
//   border: `1px solid ${theme.palette.divider}`,
//   "&:hover": {
//     border: `1px solid ${theme.palette.divider}`,
//     backgroundColor: theme.palette.action.hover,
//   },
//   "& svg": {
//     width: 16,
//     height: 16,
//   },
// }));

// export default SocialButton;
