import { useCallback, useState } from "react";
import { Form, useLogin, useNotify, useTranslate } from "ra-core";
import { SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Link,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  CardContent,
} from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
import { styled, useThemeProps } from "@mui/material/styles";
import IconInput from "../CustomInputs/IconInput";
import { PermIdentity, Person, Password, Login } from "@mui/icons-material";
import { useRequired } from "@/utils/validator";
import PasswordValidationInput from "../CustomInputs/PasswordValidationInput";
import { LoginParams } from "@/interfaces/auth.interface";
import { LoginFormProps } from "@/interfaces/component-props.interface";
import ValidatedButton from "./ui/validatedButton";

const PREFIX = "RazethLoginForm";

const StyledLoginForm = styled(Form, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<LoginFormProps>(() => ({}));

const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})<LoginFormProps>(() => ({}));

const PasswordArea = styled(Box, {
  name: PREFIX,
  slot: "Password",
  overridesResolver: (_props, styles) => styles.password,
})<LoginFormProps>(() => ({}));

const Footer = styled(Box, {
  name: PREFIX,
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})<LoginFormProps>(() => ({}));

const FormButton = styled(ValidatedButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})(() => ({}));

const PasswordLogin = (inProps: LoginFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });

  const {
    redirectTo,
    className,
    sx,
    forgotPassword,
    forgotPasswordUrl = "#",
    children,
    ...rest
  } = props;

  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const required = useRequired();

  const handleSubmit: SubmitHandler<FieldValues> = (values: LoginParams) => {
    setLoading(true);
    login(values, redirectTo)
      .then(() => {
        setLoading(false);
        notify("ra.auth.sign_in_success", { type: "success" });
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
          {
            type: "error",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                  ? error.message
                  : undefined,
            },
          }
        );
      });
  };

  const handleForgotPassword = useCallback(() => {
    // Navigate to forgot password page
    window.location.href = forgotPasswordUrl;
  }, [forgotPasswordUrl]);

  return (
    <StyledLoginForm
      onSubmit={handleSubmit}
      mode="onChange"
      noValidate
      className={className}
      sx={sx}
      {...rest}
    >
      <CardContent>
        {children || (
          <PasswordLogin.content>
            <IconInput
              source="credential"
              className="icon-input"
              iconStart={<Person />}
              fullWidth
              // helper={true}
              label={translate("razeth.auth.credentail")}
              autoComplete="username"
              validate={required()}
              resettable
            />
            <PasswordLogin.password>
              <PasswordValidationInput
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
              />
            </PasswordLogin.password>
            <PasswordLogin.footer>
              <Typography variant="body2">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={translate("razeth.auth.remember_me")}
                />
              </Typography>
              <Link
                // href={forgotPasswordUrl}
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
              >
                {forgotPassword || translate("razeth.auth.forgot_password")}
                {/* {forgotPasswordIcon} */}
              </Link>
            </PasswordLogin.footer>
            <PasswordLogin.button loading={loading} authType="login" />
            {/* <ValidatedButton loading={loading} authType="login" /> */}

            {/* <PasswordLogin.button
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
            </PasswordLogin.button> */}
            {/* <svg
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
            </svg> */}
          </PasswordLogin.content>
        )}
      </CardContent>
    </StyledLoginForm>
  );
};

PasswordLogin.content = Content;
PasswordLogin.password = PasswordArea;
PasswordLogin.footer = Footer;
PasswordLogin.button = FormButton;

// export const LoginFormClasses = {
//   content: `${PREFIX}-content`,
//   button: `${PREFIX}-button`,
//   icon: `${PREFIX}-icon`,
// };

// export const LoginFormStyles = (theme: Theme) => ({
//   [`& .${LoginFormClasses.content}`]: {
//     minWidth: 300,
//     padding: `${theme.spacing(0)}`,
//     ["& .box-body"]: {
//       display: "flex",
//       flexDirection: "column",
//       gap: 0,
//       ["& .password"]: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 0,
//         // ["& .box-input-footer"]: {
//         //   display: "flex",
//         //   justifyContent: "space-between",
//         //   alignItems: "center",
//         //   fontWeight: 500,
//         //   ["& a"]: {
//         //     color: "primary.main",
//         //     textDecoration: "underline",
//         //     textUnderlineOffset: "2px",
//         //     "&:hover": {
//         //       textDecoration: "underline",
//         //     },
//         //   },
//         // },
//       },
//       ["& .footer"]: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         fontWeight: 500,
//         marginTop: "-0.5rem",
//         ["& a"]: {
//           color: "primary.main",
//           textDecoration: "underline",
//           textUnderlineOffset: "2px",
//           "&:hover": {
//             textDecoration: "underline",
//           },
//         },
//       },
//     },
//   },
//   [`& .${LoginFormClasses.content}:last-child`]: {
//     paddingBottom: `${theme.spacing(0)}`,
//   },
//   [`& .${LoginFormClasses.button}`]: {
//     marginTop: theme.spacing(1),
//     // paddingTop: theme.spacing(1.5),
//     // paddingBottom: theme.spacing(1.5),
//     // mt: 1,
//     // py: 1.5,
//     fontWeight: 700,
//   },
//   [`& .${LoginFormClasses.icon}`]: {
//     margin: theme.spacing(0.3),
//   },
// });

export default PasswordLogin;
