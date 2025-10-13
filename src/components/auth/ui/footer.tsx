import { Box, Link, styled, Typography, useThemeProps } from "@mui/material";
import { FooterProps } from "@/interfaces/auth.interface";

const Footer = (inProps: FooterProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    description = "By clicking continue, you agree to our",
    termsOfService = "Terms of Service",
    termsOfServiceUrl = "#",
    privacyPolicy = "Privacy Policy",
    privacyPolicyUrl = "#",
    ampersand = "and",
    copyright = "Copyright © 2025 Razeth Inc. All rights reserved.",
    className,
    sx,
    ...rest
  } = props;
  return (
    <StyledFooter className={className} sx={sx} {...rest}>
      {description} <Link href={termsOfServiceUrl}>{termsOfService}</Link>{" "}
      {ampersand} <Link href={privacyPolicyUrl}>{privacyPolicy}</Link>.
      <Typography variant="body2">{copyright}</Typography>
    </StyledFooter>
  );
};

const PREFIX = "RazethFooter";

const StyledFooter = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<FooterProps>(() => ({}));

export default Footer;

// export const FooterStyles = (theme: Theme) => ({
//   [`& .${FooterClasses.content}`]: {
//     marginTop: theme.spacing(2),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//     fontSize: "0.75rem",
//     ["& .MuiTypography-root"]: {
//       marginTop: theme.spacing(1),
//       fontSize: "0.75rem",
//     },
//     // a: {
//     //   color: "primary.main",
//     //   textDecoration: "underline",
//     //   textUnderlineOffset: "2px",
//     //   "&:hover": {
//     //     textDecoration: "underline",
//     //   },
//     // },
//   },
// });
