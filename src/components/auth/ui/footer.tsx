import { Box, Link, styled, Theme, useThemeProps } from "@mui/material";
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
      <Box
        // sx={{
        //   mt: 2,
        //   textAlign: "center",
        //   color: "text.secondary",
        //   fontSize: "0.75rem",
        //   a: {
        //     color: "primary.main",
        //     textDecoration: "underline",
        //     textUnderlineOffset: "2px",
        //     "&:hover": {
        //       textDecoration: "underline",
        //     },
        //   },
        // }}
        className={FooterClasses.content}
      >
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </Box>
    </StyledFooter>
  );
};

const PREFIX = "RazethFooter";

export const FooterClasses = {
  content: `${PREFIX}-content`,
};

export const FooterStyles = (theme: Theme) => ({
  [`&.${FooterClasses.content}`]: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    // a: {
    //   color: "primary.main",
    //   textDecoration: "underline",
    //   textUnderlineOffset: "2px",
    //   "&:hover": {
    //     textDecoration: "underline",
    //   },
    // },
  },
});

const StyledFooter = styled("div", {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(FooterStyles);

export default Footer;
