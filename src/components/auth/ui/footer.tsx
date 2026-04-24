import {
  Box,
  Link,
  styled,
  Theme,
  Typography,
  useThemeProps,
} from "@mui/material";
import { FooterProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";
import { useCallback } from "react";

const Footer = (inProps: FooterProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    description,
    termsOfService,
    termsOfServiceUrl = "#",
    privacyPolicy,
    privacyPolicyUrl = "#",
    ampersand,
    copyright,
    className,
    sx,
    ...rest
  } = props;

  const handleTerms = useCallback(() => {
    // Navigate to terms of service page
    window.location.href = termsOfServiceUrl;
  }, [termsOfServiceUrl]);

  const handlePrivacy = useCallback(() => {
    // Navigate to privacy policy page
    window.location.href = privacyPolicyUrl;
  }, [privacyPolicyUrl]);

  // const translate = useTranslate();
  return (
    <Root className={className} sx={sx} {...rest}>
      <Typography variant="body2" component="div">
        {description || "By clicking continue, you agree to our"}
        <Link component="button" type="button" onClick={handleTerms}>
          {termsOfService || "Terms of Service"}
        </Link>
        {ampersand || "and"}
        <Link component="button" type="button" onClick={handlePrivacy}>
          {privacyPolicy || "Privacy Policy"}
        </Link>
      </Typography>
      <Typography variant="body2" component="span">
        {copyright || "Copyright © 2025 Razeth Inc. All rights reserved."}
      </Typography>
    </Root>
  );
};

const PREFIX = "RazethFooter";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<FooterProps>(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(1),
  color: theme.custom.paper,
  position: "relative",
  ["& .MuiTypography-root"]: {
    marginTop: theme.spacing(0.5),
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(0.5), // The space is now handled by the gap property
    // a,
    button: {
      margin: theme.spacing(0),
      display: "inline-flex",
      alignItems: "center",
    },
    "& > :last-child::after": {
      color: theme.custom.paper,
      textDecoration: "none",
      marginLeft: theme.spacing(-0.5),
      content: '"."',
    },
    "& > :last-child:hover::after": {
      textDecoration: "none",
    },
  },
}));

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
