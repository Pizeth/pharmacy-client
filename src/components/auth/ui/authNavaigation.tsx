import { Box, Link, styled, Typography, useThemeProps } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthNavigationProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";
import { useCallback, useState } from "react";
import { Login } from "@mui/icons-material";

const AuthNavigationLink = (inProps: AuthNavigationProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { sx, className, ...rest } = props;

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const handleToggle = () => setIsSignUpMode(!isSignUpMode);
  // const handleCreateAccount = useCallback(() => {
  //   // Navigate to registration page
  //   window.location.href = link;
  // }, [link]);

  const translate = useTranslate();
  const icon = isSignUpMode ? <PersonAddIcon /> : <Login />;
  return (
    <StyledSignUpLink className={className} sx={sx} {...rest}>
      {/* We wrap the message in a Typography component for consistency */}
      <Typography variant="body2" component="span">
        {isSignUpMode
          ? translate("razeth.auth.no_account")
          : translate("razeth.auth.have_account")}
      </Typography>
      <Link
        component="button"
        type="button"
        variant="body2"
        onClick={handleToggle}
        // href={link}
      >
        {isSignUpMode
          ? translate("razeth.auth.sign_up")
          : translate("razeth.auth.sign_in")}
        {icon}
      </Link>
    </StyledSignUpLink>
  );
};

const PREFIX = "RazethSignUpLink";
// const defaultIcon = <PersonAddIcon />;

const StyledSignUpLink = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthNavigationProps>(() => ({}));

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
