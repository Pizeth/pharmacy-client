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

  const translate = useTranslate();
  return (
    <StyledFooter className={className} sx={sx} {...rest}>
      <Typography variant="body2" component="div">
        {description || translate("razeth.title.description")}
        <Link href={termsOfServiceUrl}>
          {termsOfService || translate("razeth.title.terms_of_service")}
        </Link>
        {ampersand || translate("razeth.title.ampersand")}
        <Link href={privacyPolicyUrl}>
          {privacyPolicy || translate("razeth.title.privacy_policy")}
        </Link>
      </Typography>
      <Typography variant="body2" component="span">
        {copyright || translate("razeth.title.copyright")}
      </Typography>
    </StyledFooter>
  );
};

const PREFIX = "RazethFooter";

const StyledFooter = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<FooterProps>((props: { theme: Theme }) => ({
  textAlign: "center",
  marginTop: props.theme.spacing(1),
  color: props.theme.palette.text.secondary,
  position: "relative",
  ["& .MuiTypography-root"]: {
    marginTop: props.theme.spacing(0.5),
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: props.theme.spacing(0.5), // The space is now handled by the gap property
    a: {
      margin: props.theme.spacing(0),
      display: "inline-flex",
      alignItems: "center",
    },
    "& > :last-child::after": {
      color: props.theme.palette.text.secondary,
      textDecoration: "none",
      marginLeft: props.theme.spacing(-0.5),
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
