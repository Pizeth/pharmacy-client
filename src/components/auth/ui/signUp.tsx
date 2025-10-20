import { Box, Link, styled, Typography, useThemeProps } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { SignUpProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";

const SignupLink = (inProps: SignUpProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    message,
    title,
    link = "#",
    icon = defaultIcon,
    sx,
    className,
    ...rest
  } = props;

  const translate = useTranslate();
  return (
    <StyledSignUpLink className={className} sx={sx} {...rest}>
      {/* We wrap the message in a Typography component for consistency */}
      <Typography variant="body2" component="span">
        {message || translate("razeth.auth.no_account")}
      </Typography>
      <Link variant="body2" href={link}>
        {title || translate("razeth.auth.sign_up")} {icon}
      </Link>
    </StyledSignUpLink>
  );
};

const PREFIX = "RazethSignUpLink";
const defaultIcon = <PersonAddIcon />;

const StyledSignUpLink = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SignUpProps>(() => ({}));

export default SignupLink;

// export const SingupLinktyles = (theme: Theme) => ({
//   [`& .${RazethSignUpLinkClasses.content}`]: {
//     textAlign: "center",
//     marginTop: theme.spacing(1),
//     color: theme.palette.text.secondary,
//     a: {
//       //   color: theme.palette.primary.main,
//       //   textDecoration: "underline",
//       //   textUnderlineOffset: "2px",
//       textTransform: "uppercase",
//       svg: {
//         paddingBottom: "2px",
//       },
//     },
//   },
// });
