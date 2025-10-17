import { Link, styled, useThemeProps } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { SignUpProps } from "@/interfaces/auth.interface";

const SignupLink = (inProps: SignUpProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    message = "Don't have an account?",
    title = "Sign Up",
    link = "#",
    icon = defaultIcon,
    sx,
    className,
    ...rest
  } = props;
  return (
    <StyledSignUpLink className={className} sx={sx} {...rest}>
      {message + " "}
      <Link href={link}>
        {title + " "} {icon}
      </Link>
    </StyledSignUpLink>
  );
};

const PREFIX = "RazethSignUpLink";

const defaultIcon = <PersonAddIcon />;

const StyledSignUpLink = styled("div", {
  name: PREFIX,
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
