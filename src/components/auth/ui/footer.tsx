import {
  Box,
  Fade,
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
  // return (
  //   <Root className={className} sx={sx} {...rest}>
  //     <Typography variant="body2" component="div">
  //       {description || "By clicking continue, you agree to our"}
  //       <Link component="button" type="button" onClick={handleTerms}>
  //         {termsOfService || "Terms of Service"}
  //       </Link>
  //       {ampersand || "and"}
  //       <Link component="button" type="button" onClick={handlePrivacy}>
  //         {privacyPolicy || "Privacy Policy"}
  //       </Link>
  //     </Typography>
  //     <Typography variant="body2" component="span">
  //       {copyright || "Copyright © 2025 Razeth Inc. All rights reserved."}
  //     </Typography>
  //   </Root>
  // );
  return (
    <Fade in={true} timeout={1000}>
      <Root className={className} sx={sx} {...rest}>
        <FooterContainer endStop={"."}>
          <Typography variant="body2">
            {description || "By clicking continue, you agree to our"}
          </Typography>
          <Link component="button" type="button" onClick={handleTerms}>
            {termsOfService || "Terms of Service"}
          </Link>
          <Typography variant="body2">{ampersand || "and"}</Typography>
          <Link component="button" type="button" onClick={handlePrivacy}>
            {privacyPolicy || "Privacy Policy"}
          </Link>
        </FooterContainer>
        <Typography variant="body2" component="div" sx={{ marginTop: 0.5 }}>
          {copyright || "Copyright © 2025 Razeth Inc. All rights reserved."}
        </Typography>
      </Root>
    </Fade>
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
  paddingLeft: theme.spacing(2), // Prevents text touching edge on small viewports
  paddingRight: theme.spacing(2), // Prevents text touching edge on small viewports
  ["& .MuiTypography-root"]: {
    marginTop: theme.spacing(0.5),
    fontSize: "0.75rem",
    // lineHeight: 1.5, // Improves spacing when lines wrap
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // gap: theme.spacing(0.5), // The space is now handled by the gap property
    // a,
    // Links and plain text elements inside Typography
    "& .MuiLink-root, & span": {
      display: "inline", // Force elements to behave like standard text words
      padding: 0,
      verticalAlign: "baseline",
    },
    button: {
      // margin: theme.spacing(0),
      // display: "inline-flex",
      // alignItems: "center",
      margin: theme.spacing(0),
      fontSize: "inherit", // Match base typography size
      minWidth: "auto", // Remove button padding bounds
      textTransform: "none", // Keep original text case
    },
    // "& > :last-child::after": {
    //   color: theme.custom.paper,
    //   textDecoration: "none",
    //   marginLeft: theme.spacing(-0.5),
    //   content: '"."',
    // },
    // "& > :last-child:hover::after": {
    //   textDecoration: "none",
    // },
  },
}));

const FooterContainer = styled(Box, {
  name: PREFIX,
  slot: "FooterContainer",
  overridesResolver: (_props, styles) => styles.footerContainer,
  shouldForwardProp: (prop) => prop !== "endStop",
})<{ endStop?: string }>(({ theme, endStop }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "baseline",
  rowGap: theme.spacing(0.5), // Dynamic gap between vertical lines when wrapped

  "& .MuiTypography-root": {
    marginTop: theme.spacing(0), // Reset default margins
  },
  // Selects all immediate child elements (Typography and Links)
  "& > *": {
    // fontSize: "0.75rem",
    // lineHeight: 1.5,
    marginRight: theme.spacing(0.5), // Uniform spacing between items instead of manual {" "}
  },
  "& > :last-child": {
    // marginRight: 0, // Cleans up trailing margin on the last item
    ":after": {
      color: theme.custom.paper,
      // marginLeft: theme.spacing(-0.5),
      content: `"${endStop || "."}"`,
      // textDecoration: "none",
    },
    "&:hover:after": {
      textDecoration: "none",
      display: "inline-block",
    },
  },
  "& .MuiLink-root": {
    padding: 0,
    // color: "#E53E3E",
    // textDecoration: "underline",
    // verticalAlign: "baseline",
    textTransform: "none",
    minWidth: "auto",
    marginRight: theme.spacing(0.5), // Space between links and text
    // "&:hover": {
    //   color: "#FFA8A8",
    // },
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
