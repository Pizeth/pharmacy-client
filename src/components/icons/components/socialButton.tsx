import { SocialButtonProps } from "@/interfaces/auth.interface";
import { IconSize } from "@/theme";
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

import { normalizeIconSize } from "@/utils/themeUtils";

const PREFIX = "RazethSocialButton";

// The main button component
const SocialButtonRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  /* ─── FULL ROW BUTTON VARIANT (Desktop + Mobile) ─── */
  "& .MuiButton-root": {
    borderRadius: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Needed to anchor the absolute positioned icon
    // width: "100%",
    // padding: theme.spacing(1.25, 3),
    textTransform: "none",
    // color: theme.vars.palette.text.primary,
    // borderColor: theme.alpha(theme.vars.palette.text.primary, 0.15),
    // boxShadow: theme.vars.palette.customShadows?.neumorphic,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

    // "&:hover": {
    //   transform: "translateY(-1px)",
    //   backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.04),
    //   borderColor: theme.alpha(theme.vars.palette.text.primary, 0.3),
    // },
  },

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
  shouldForwardProp: (prop) => prop !== "preText",
})<{ preText?: string }>(({ theme, preText }) => ({
  /* base styles for the label, if any */
  fontWeight: "500",
  // display: "none", // Hide by default

  // 1. Target xs screens specifically
  [theme.breakpoints.down("sm")]: {
    display: "block", // Ensure label is visible on xs if that is your goal
    "&:before": {
      content: `"${preText}"`, // Injects "Continue with " on mobile
    },
  },

  // 2. Target sm screens and larger
  [theme.breakpoints.up("sm")]: {
    display: "block", // This applies for 'sm' and larger breakpoints
    "&:before": {
      content: '""', // Removes prefix on tablet/desktop layouts
    },
  },
}));

/* Icon placement controller inside full row button */
const IconButtonWrapper = styled(Box, {
  name: PREFIX,
  slot: "IconButtonWrapper",
  overridesResolver: (_props, styles) => styles.iconButtonWrapper,
  shouldForwardProp: (prop) => prop !== "size",
})<{ size?: IconSize }>(({ theme, size }) => {
  // Compute standard CSS string smoothly
  const finalSize = normalizeIconSize(size);
  return {
    display: "flex",
    alignItems: "center",

    // On small screens/mobile, pin it cleanly to the absolute left
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      left: theme.spacing(2.5),
      top: "50%",
      transform: "translateY(-50%)",
    },

    // On bigger screens, keep it inline next to the text
    // [theme.breakpoints.up("sm")]: {
    //   marginRight: theme.spacing(1.5),
    // },

    svg: {
      width: `${finalSize}`,
      height: `${finalSize}`,
    },
  };
});

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
    preText = "Continue with ",
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
        <Button variant={variant} disabled={disabled} fullWidth>
          {/* {icon} */}
          {/* {icon}
          <SocialButtonLabel variant="body2" preText={preText}>
            {children}
          </SocialButtonLabel> */}
          {/* Wrap the icon in a semantic class node for targeted layout scaling */}
          {/* <span className="social-icon-wrap">{icon}</span> */}
          <IconButtonWrapper size={size}>{icon}</IconButtonWrapper>
          <SocialButtonLabel variant="body2" preText={preText}>
            {label || children}
          </SocialButtonLabel>
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
