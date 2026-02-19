import {
  Box,
  Link,
  styled,
  Theme,
  Typography,
  useThemeProps,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthNavigationProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";
import { Login } from "@mui/icons-material";

const AuthNavigationLink = (inProps: AuthNavigationProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { mode = "signin", onToggle, sx, className, ...rest } = props;

  // const [isSignUpMode, setIsSignUpMode] = useState(false);
  // const handleToggle = () => setIsSignUpMode(!isSignUpMode);

  const translate = useTranslate();

  // Determine the text and icon based on current mode
  const isLoginMode = mode === "signin";
  const message = isLoginMode
    ? translate("razeth.auth.no_account") || "Don't have an account?"
    : translate("razeth.auth.have_account") || "Already have an account?";

  const linkText = isLoginMode
    ? translate("razeth.auth.sign_up") || "Sign Up"
    : translate("razeth.auth.sign_in") || "Sign In";

  // const icon = isLoginMode ? <Login /> : <PersonAddIcon />;
  const icon = isLoginMode ? <PersonAddIcon /> : <Login />;
  // const icon = isLoginMode ? <PersonAddIcon /> : <Login />;
  return (
    <StyledAuthNavigation className={className} sx={sx} {...rest}>
      {/* We wrap the message in a Typography component for consistency */}
      <Typography variant="body2" component="span">
        {message}
      </Typography>
      <Link component="button" type="button" variant="body2" onClick={onToggle}>
        {linkText} {icon}
      </Link>
    </StyledAuthNavigation>
  );
};

const PREFIX = "RazethAuthNavigation";

const StyledAuthNavigation = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})((props: { theme: Theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: props.theme.spacing(0.5), // The space is now handled by the gap property
  textAlign: "center",
  marginTop: props.theme.spacing(2),
  color: props.theme.palette.text.secondary,
  button: {
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    svg: {
      marginLeft: props.theme.spacing(0.5),
      fontSize: "1rem",
    },
  },
}));

export default AuthNavigationLink;

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
