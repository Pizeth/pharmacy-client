import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  CardContent,
  Box,
} from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
import { styled, useThemeProps } from "@mui/material/styles";
// import IconInput from "../CustomInputs/IconInput";
import {
  PermIdentity,
  Person,
  Password,
  Login,
  Badge,
  Email,
} from "@mui/icons-material";
import { useRequired } from "@/utils/validator";
// import PasswordValidationInput from "../CustomInputs/PasswordValidationInput";
import { LoginParams } from "@/interfaces/auth.interface";
import {
  AuthFormProps,
  LoginFormProps,
} from "@/interfaces/component-props.interface";
// import ValidatedButton from "./ui/validatedButton";
import { useIsAuthenticated, useLogin, useRegister } from "@refinedev/core";
import { AuthAction } from "@/theme";
import {
  loginSchema,
  registerSchema,
  LoginValues,
  RegisterValues,
} from "@/schema/auth.schema";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@/components/inputs/textfield";
import PasswordField from "@/components/inputs/passwordfield";
import ValidatedButton from "@/components/inputs/validatedButton";

const PREFIX = "RazethAuthForm";

const Root = styled("form", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthFormProps>(({ theme }) => ({
  ["& .MuiCardContent-root"]: {
    minWidth: 300,
    padding: `${theme.spacing(0)}`,
  },
}));

const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0),
  input: {
    transition: theme.transitions.create("color", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short,
    }),
    "&:focus": {
      // color: "#e1232e", // focused
      color: theme.palette.primary.main, // focused
    },
  },
  // Apply custom styles to the last child element inside this container
  "& > :last-child": {
    // For example, you could add extra margin to the button
    // if it's the last item. Let's override its default top margin.
    marginTop: theme.spacing(1),
  },
}));

const PasswordArea = styled(Box, {
  name: PREFIX,
  slot: "Password",
  overridesResolver: (_props, styles) => styles.password,
})<LoginFormProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: theme.spacing(0),
}));

const Footer = styled(Box, {
  name: PREFIX,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})<LoginFormProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 500,
  marginTop: "-0.5rem",
  marginBottom: "-0.5rem",
  width: "100%",
  gap: theme.spacing(0),
}));

const FormButton = styled(ValidatedButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})(() => ({}));

const AuthForm = (inProps: AuthFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    mode = "signin",
    redirectTo,
    className,
    sx,
    forgotPassword,
    forgotPasswordUrl = "/forgot-password",
    termsUrl = "/terms",
    privacyUrl = "/privacy",
    children,
    ...rest
  } = props;

  // const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isFetching, data } = useIsAuthenticated();
  // State to track current mode (login or signup)
  // const [currentMode, setCurrentMode] = useState<AuthAction>(mode);
  const isLogin = mode === "signin";

  const schema = isLogin ? loginSchema : registerSchema;

  // useEffect(() => {
  //   // already authenticated, redirect to the home page
  //   // if (data) {
  //   //   console.log("User is authenticated, redirecting...", data);
  //   //   // already authenticated, redirect to the home page
  //   //   console.log("User is authenticated", data.authenticated);
  //   //   console.log(
  //   //     "Redirecting to:",
  //   //     data.authenticated ? redirectTo || "/fts" : "/login",
  //   //   );
  //   //   router.push(data.authenticated ? redirectTo || "/fts" : "/login");
  //   // }
  //   // console.log("Authentication check completed", { isFetching, data });
  //   if (!isFetching && data?.authenticated) {
  //     console.log("User is authenticated, redirecting to dashboard...");
  //     router.push(redirectTo || "/fts");
  //   }
  //   // not authenticated, stay on the login page
  // }, [data, isFetching, router, redirectTo]); // ✅ Added necessary dependencies

  // 1. Wait for loading to finish
  if (isFetching) return null;

  // 2. If already logged in, redirect away from login page
  if (data?.authenticated) {
    router.push("/admin"); // or your dashboard
    return null;
  }

  const { mutate: login, isPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } =
    useRegister<RegisterValues>();

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(
      schema,
      // {
      //   async: true, // 🔥 enable async validation
      // }
    ),
    mode: "onChange",
    defaultValues: isLogin
      ? { indentifier: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
  });

  const {
    control,
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (values: any) => {
    if (isLogin) {
      // Sends { identifier, password } to authProvider.login
      login(values); // 🔥 uses your authProvider automatically
    } else {
      // Sends { email, username, password, name } to authProvider.register
      register(values, {
        onSuccess: (data) => {
          if (!data.success) {
            // handle error
            console.error("Registration failed:", data.error);
            return;
          }
          login(values);
        },
      });
    }
  };

  const handleForgotPassword = useCallback(() => {
    // Navigate to forgot password page
    window.location.href = forgotPasswordUrl;
  }, [forgotPasswordUrl]);

  const handleTerms = useCallback(() => {
    // Navigate to terms of service page
    window.location.href = termsUrl;
  }, [termsUrl]);

  const handlePrivacy = useCallback(() => {
    // Navigate to privacy policy page
    window.location.href = privacyUrl;
  }, [privacyUrl]);

  return (
    <Root
      // component="form"
      onSubmit={handleSubmit(onSubmit)}
      // mode="onChange"
      // noValidate
      className={className}
      sx={sx}
      {...rest}
    >
      <CardContent>
        {children || (
          <AuthForm.content>
            {/* <IconInput
              source="credential"
              className="icon-input"
              iconStart={<Person />}
              fullWidth
              // helper={true}
              label={translate("razeth.auth.credentail")}
              autoComplete="username"
              validate={required()}
              resettable
            /> */}
            {isLogin ? (
              <TextField
                name="identifier"
                control={control}
                label="Username or Email"
                iconStart={<Person />}
                rules={{ required: "Username or Email is required" }}
                fullWidth
              />
            ) : (
              <>
                <TextField
                  name="name"
                  control={control}
                  label="Full Name"
                  iconStart={<Badge />}
                  rules={{ required: "Name is required" }}
                  fullWidth
                />
                <TextField
                  name="email"
                  control={control}
                  label="Email Address"
                  type="email"
                  iconStart={<Email />}
                  rules={{ required: "Email is required" }}
                  fullWidth
                />
                <TextField
                  name="username"
                  control={control}
                  label="Username"
                  iconStart={<Person />}
                  rules={{ required: "Username is required" }}
                  fullWidth
                />
              </>
            )}
            <AuthForm.password>
              {/* <PasswordValidationInput
                source="password"
                iconStart={<Password />}
                className="icon-input"
                // helper={true}
                label={translate("razeth.auth.password")}
                autoComplete="current-password"
                validate={required()}
                resettable
                fullWidth
                // strengthMeter
              /> */}
              <PasswordField
                name="password"
                control={control}
                label="Password"
                type="password"
              />

              {!isLogin && (
                <PasswordField
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                />
              )}
            </AuthForm.password>
            <AuthForm.footer>
              <Typography variant="body2">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  // label={translate("razeth.auth.remember_me")}
                  label={"Remember Me"}
                />
              </Typography>
              <Link
                // href={forgotPasswordUrl}
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
              >
                {/* {forgotPassword || translate("razeth.auth.forgot_password")} */}
                {forgotPassword}
                {/* {forgotPasswordIcon} */}
              </Link>
            </AuthForm.footer>
            <AuthForm.button
              loading={isPending || isRegisterPending}
              authType="signin"
            />
          </AuthForm.content>
        )}
      </CardContent>
    </Root>
  );
};

AuthForm.content = Content;
AuthForm.password = PasswordArea;
AuthForm.footer = Footer;
AuthForm.button = FormButton;

export default AuthForm;

{
  /* <ValidatedButton loading={loading} authType="login" /> */
}

{
  /* <PasswordLogin.button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              // fullWidth
              // className={LoginFormClasses.button}
            >
              {loading ? (
                <CircularProgress color="inherit" size={19} thickness={3} />
              ) : (
                translate("razeth.auth.sign_in")
              )}
              <Login />
            </PasswordLogin.button> */
}
{
  /* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"
              />
            </svg> */
}
