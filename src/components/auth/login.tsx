import React, { useEffect, useRef } from "react";
import { useCheckAuth } from "ra-core";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Theme,
  Avatar,
  Typography,
} from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";
import PasswordLogin from "./passwordLogin";
import SocialLogin from "./socialLogin";
import SideImage from "./sideImage";
import AvatarHeader from "./avatar";
import { LoginProps } from "@/interfaces/auth.interface";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { RazethDivider as Divider } from "./divider";
import SignupLink from "./ui/signUp";
import Footer from "./ui/footer";
import { StyleComponent } from "@/types/classKey";

const LoginOld = (inProps: LoginProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const {
    avatarIcon = defaultAvatar,
    children = defaultLoginForm,
    divider = defaultDivider,
    signUp = defaultSignUp,
    footer = defaultFooter,
    variant = "full",
    className,
    sx,
    // backgroundImage,
    // avatarIcon = defaultAvatar,
    ...rest
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const checkAuth = useCheckAuth();
  // const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate("/");
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);

  return (
    <Root
      ref={containerRef}
      variant={variant}
      className={className}
      sx={sx}
      {...rest}
      // sx={{
      //   minHeight: "100vh",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   p: 2,
      //   backgroundColor:
      //     theme.palette.mode === "dark"
      //       ? theme.palette.grey[900]
      //       : theme.palette.grey[100],
      // }}
    >
      <Box
        className={LoginClasses.content}
        // sx={{ width: "100%", maxWidth: { xs: "100%", md: "750px" } }}
      >
        <Card
          className={LoginClasses.card}
          // sx={{ overflow: "hidden", borderRadius: 2, boxShadow: 3 }}
        >
          <Grid container spacing={0}>
            {/* Image section - hidden on mobile */}
            <SideImage src="static/images/placeholder-mcs-orange.svg" />

            {/* Form section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CardContent
                className="card-content"
                // sx={{ p: { xs: 3, md: 4 } }}
              >
                <Box
                  className="card-box"
                  // sx={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  {avatarIcon}
                  {children}
                  {/* <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      my: 2,
                    }}
                  >
                    <Divider sx={{ flex: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        px: 2,
                        backgroundColor: theme.palette.background.paper,
                        color: "text.secondary",
                      }}
                    >
                      Or continue with
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box> */}
                  {divider}
                  {SocialLogin}

                  {/* <Box
                    sx={{
                      textAlign: "center",
                      mt: 1,
                      color: "text.secondary",
                    }}
                  >
                    Don&apos;t have an account?{" "}
                    <Link
                      href="#"
                      sx={{
                        color: "primary.main",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign up
                    </Link>
                  </Box> */}
                  {signUp}
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* <Box
          sx={{
            mt: 2,
            textAlign: "center",
            color: "text.secondary",
            fontSize: "0.75rem",
            a: {
              color: "primary.main",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          By clicking continue, you agree to our{" "}
          <Link href="#">Terms of Service</Link> and{" "}
          <Link href="#">Privacy Policy</Link>.
        </Box> */}
        {footer}
      </Box>
    </Root>
  );
};

const PREFIX = "RazethLogin";

export const LoginClasses = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
};

export const LoginStyles = (theme: Theme) => ({
  // [theme.breakpoints.up("md")]: {
  //   maxWidth: "750px",
  // },
  // [` .${LoginClasses.root}`]: {
  //   minHeight: "100vh",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   padding: theme.spacing(2),
  //   backgroundColor:
  //     theme.palette.mode === "dark"
  //       ? theme.palette.grey[900]
  //       : theme.palette.grey[100],
  // },
  [`& .${LoginClasses.content}`]: {
    width: "100%",
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "750px",
    },
    // maxWidth: { xs: "100%", md: "750px" },
    [`& .${LoginClasses.card}`]: {
      overflow: "hidden",
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[3],
      ["& .card-content"]: {
        padding: theme.spacing(3, 4),
        ["& .card-box"]: {
          display: "flex",
          flexDirection: "column",
          gap: 0,
        },
      },
    },
  },
  [`& .${LoginClasses.avatar}`]: {
    margin: theme.spacing(0, 0, 1.5, 0),
    display: "flex",
    justifyContent: "center",
    ["& .MuiAvatar-root"]: { backgroundColor: "#e72d32" },
    "& svg": {
      fill: "#fff",
    },
  },
  // [`& .MuiBox-root`]: {
  //   gap: theme.spacing(0),
  // },
  // [`& .${LoginClasses.content}`]: {
  //   minWidth: 300,
  //   padding: `${theme.spacing(0)}`,
  // },
  // [`& .${LoginClasses.button}`]: {
  //   // marginTop: theme.spacing(2),
  //   mt: 1,
  //   py: 1.5,
  //   fontWeight: 600,
  // },
  // [`& .${LoginClasses.icon}`]: {
  //   margin: theme.spacing(0.3),
  // },
});

// const Root = styled("div", {
//   name: PREFIX,
//   slot: "Root",
//   overridesResolver: (_props, styles) => styles.root,
// })<LoginProps>(({ theme }) => LoginStyles(theme));

// Root styled component
const Root = styled("div", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<LoginProps>(() => ({}));

// Slot components
const Content = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(() => ({}));

const LoginCard = styled("div", {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(() => ({}));

const LoginAvatar = styled(Box, {
  name: PREFIX,
  slot: "Avatar",
  overridesResolver: (_props, styles) => styles.avatar,
})(() => ({}));

// Main component + slot API
// export const Login: React.FC<React.PropsWithChildren<LoginProps>> & {
//   Content: typeof LoginContent;
//   Card: typeof LoginCard;
//   Avatar: typeof LoginAvatar;
// } = (props) => {
//   const { children, ...rest } = props;
//   return <Root {...rest}>{children}</Root>;
// };

export const Login = (
  inProps: LoginProps & {
    Content?: StyleComponent;
    Card?: StyleComponent;
    CardContent?: StyleComponent;
    // Form?: StyleComponent;
    // Avatar?: StyleComponent;
  }
) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });
  const {
    sideImage = defaultSideImage,
    title = "Welcome back",
    avatarIcon = defaultAvatar,
    children = defaultLoginForm,
    divider = defaultDivider,
    signUp = defaultSignUp,
    footer = defaultFooter,
    variant = "full",
    className,
    sx,
    // backgroundImage,
    // avatarIcon = defaultAvatar,
    ...rest
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const checkAuth = useCheckAuth();
  // const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate("/");
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);
  return (
    <Root
      ref={containerRef}
      variant={variant}
      className={className}
      sx={sx}
      {...rest}
    >
      <Login.Content>
        <Login.Card>
          <Grid container>
            {/* Image section - hidden on mobile */}
            {sideImage}

            {/* Form section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CardContent className="card-content">
                <Box className="card-box">
                  <LoginAvatar>
                    {/* <LoginAvatar> */}
                    <Avatar>{avatarIcon}</Avatar>
                    {/* </LoginAvatar> */}
                    <Typography
                      align="center"
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {title}
                    </Typography>
                  </LoginAvatar>
                  {/* <Box>
                    <LoginAvatar>
                      <Avatar>{avatarIcon}</Avatar>
                    </LoginAvatar>
                    <Typography
                      align="center"
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Welcome back
                    </Typography>
                  </Box> */}
                  {children}
                  {divider}
                  {SocialLogin}
                  {signUp}
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Login.Card>
        {footer}
      </Login.Content>
    </Root>
  );
};

Login.Content = Content;
Login.Card = LoginCard;
Login.Avatar = LoginAvatar;

const defaultLoginForm = <PasswordLogin />;
const defaultSideImage = (
  <SideImage src="static/images/placeholder-mcs-orange.svg" />
);
const defaultAvatar = <PersonIcon />;
const defaultDivider = <Divider />;
const defaultSignUp = <SignupLink />;
const defaultFooter = <Footer />;

// ✅ Named exports (optional, for tree-shaking)
export {
  // Header as LoginHeader,
  Content as LoginContent,
  LoginCard,
  LoginAvatar,
};

export default Login;

// export default function LoginPage() {
//   return (
//     <Login Content={LoginContent} Card={LoginCard} Avatar={LoginAvatar}>
//       <Login.Content>
//         <Login.Card>
//           {/* <Login.Header>Welcome back</Login.Header> */}
//           <Login.Avatar>{/* Avatar here */}</Login.Avatar>
//           {/* Form goes here */}
//         </Login.Card>
//       </Login.Content>
//     </Login>
//   );
// }
