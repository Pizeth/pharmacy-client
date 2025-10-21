import { SocialButtonProps } from "@/interfaces/auth.interface";
import { Button, styled, Typography, useThemeProps } from "@mui/material";

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

const PREFIX = "RazethSocialButton";

// Custom styled button for social login
// const SocialButtonRoot = styled(Grid, {
//   name: PREFIX,
//   slot: "Root",
//   overridesResolver: (_props, styles) => styles.root,
// })<SocialButtonProps>(() => ({}));

// The main button component
const SocialButtonRoot = styled(Button, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SocialButtonProps>(() => ({
  /* base styles for the button */
}));

// The text/label part of the button
const SocialButtonLabel = styled(Typography, {
  name: PREFIX,
  slot: "Label",
  overridesResolver: (_props, styles) => styles.label,
})(() => ({
  /* base styles for the label, if any */
}));

// Custom styled button for social login
export const SocialButton = (inProps: SocialButtonProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const { className, sx, variant, icon, children, ...rest } = props;

  return (
    <SocialButtonRoot
      className={className}
      sx={sx}
      variant={variant || "outlined"}
      {...rest}
    >
      {icon}
      <SocialButtonLabel variant="body2">{children}</SocialButtonLabel>
    </SocialButtonRoot>
  );
};

export default SocialButton;
