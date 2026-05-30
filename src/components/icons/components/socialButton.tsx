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
    backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.0925),
    boxShadow: `
      inset 0 0 20px ${theme.alpha(theme.vars.palette.background.paper, 0.3)}, 
      inset 0 0 5px ${theme.alpha(theme.vars.palette.background.default, 0.5)}, 
      0 5px 5px ${theme.alpha(theme.vars.palette.text.primary, 0.175)}`,
    transition: "background 0.3s ease-in-out",
    overflow: "hidden",
    // maxWidth: "3rem",
    // maxHeight: "3rem",
    ":before": {
      content: '""',
      position: "absolute",
      borderRadius: "50%",
      top: "90%",
      left: "-110%",
      width: "120%",
      height: "120%",
      transform: "rotate(45deg)",
      transition:
        "top 0.3s ease-in-out, left 0.3s ease-in-out, background 0.3s ease-in-out",
    },
    "&:hover:before": {
      top: "-10%",
      left: "-10%",
    },

    svg: {
      transition: "fill 0.3s ease-in-out, opacity 0.3s ease-in-out",
      fill: { transition: "fill 0.3s ease-in-out, opacity 0.3s ease-in-out" },
      path: {
        transition: "fill 0.3s ease-in-out, opacity 0.3s ease-in-out",
      },
    },

    "&:hover": {
      svg: {
        transform: "scale(1.25)",
        // transition: "fill 0.3s ease-in-out",
        // path: { transition: "fill 5s ease-in-out, opacity 5s ease-in-out" },
        // outline: "none",
        // background: "linear-gradient(#fff, #fff)",
        // "-webkit-background-clip": "text",
        // "-webkit-text-fill-color": "transparent",
      },
    },
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
