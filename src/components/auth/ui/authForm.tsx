import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import {
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  CardContent,
} from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import {
  PermIdentity,
  Person,
  Password,
  Login,
  Badge,
  Email,
} from "@mui/icons-material";
import { AuthFormProps } from "@/interfaces/component-props.interface";
import { useLogin, useRegister } from "@refinedev/core";
import {
  loginSchema,
  registerSchema,
  LoginValues,
  RegisterValues,
} from "@/schema/auth.schema";
import TextField from "@/components/inputs/textfield";
import PasswordField from "@/components/inputs/passwordfield";
import ValidatedButton from "@/components/inputs/validatedButton";
// ✅ Real-time async email uniqueness check — debounced, cancellable
import {
  useAsyncFieldRule,
  usePasswordValidation,
} from "@/lib/hooks/useFieldValidation";
import hybridResolver from "@/lib/validations/hybridResolver";
// import { useFormOrchestrator } from "@/lib/hooks/useFormOrchestrator";
import { AsyncMap } from "@/types/auth";
import { Root, Content, PasswordArea, Footer } from "../styles/authForm.style";

// ─── Styled slots ─────────────────────────────────────────────────────────────

const PREFIX = "RazethAuthForm";

// ─── Confirm password — needs watch("password") from FormProvider context ─────
const ConfirmPasswordFieldOld = () => {
  const { watch } = useFormContext();
  const passwordValue: string = watch("password") ?? "";
  return (
    <PasswordField
      name="confirmPassword"
      label="Confirm Password"
      matchPassword={passwordValue}
    />
  );
};

// ─── Register fields — extracted so hooks run inside FormProvider ─────────────
const RegisterFieldsOld = () => {
  // const asyncEmailRule = useAsyncFieldRule("email");
  // const asyncUsernameRule = useAsyncFieldRule("username");
  // console.log("RegisterFields rendered, async rules created", {
  //   asyncEmailRule,
  //   asyncUsernameRule,
  // });
  return (
    <>
      <TextField
        name="name"
        label="Full Name"
        iconStart={<Badge />}
        // rules={{ required: "Name is required" }}
        fullWidth
      />
      <TextField
        name="email"
        label="Email Address"
        type="email"
        iconStart={<Email />}
        // rules={{
        //   required: "Email is required",
        //   validate: asyncEmailRule.validate,
        // }}
        fullWidth
      />
      <TextField
        name="username"
        label="Username"
        iconStart={<Person />}
        // rules={{
        //   required: "Username is required",
        //   validate: asyncUsernameRule.validate,
        // }}
        fullWidth
      />
      <AuthForm.password>
        <PasswordField name="password" label="Password" strengthMeter />
        <ConfirmPasswordField />
      </AuthForm.password>
    </>
  );
};

// ─── Confirm password — needs watch("password") from context ──────────────────
const ConfirmPasswordField = () => {
  const { watch } = useFormContext();
  const passwordValue: string = watch("password") ?? "";
  return (
    <PasswordField
      name="confirmPassword"
      label="Confirm Password"
      required
      matchPassword={passwordValue} // wires match validation via useEffect
    />
  );
};

// ─── Register fields ──────────────────────────────────────────────────────────
const RegisterFields = ({ invalidate }: { invalidate: () => void }) => (
  <>
    <TextField
      name="name"
      label="Full Name"
      required
      iconStart={<Badge />}
      fullWidth
    />
    <TextField
      name="email"
      label="Email Address"
      type="email"
      required
      iconStart={<Email />}
      // asyncValidate triggers the side-effect channel (useEffect → setError)
      // which works even though useForm has a zodResolver.
      // asyncValidate
      fullWidth
    />
    <TextField
      name="username"
      label="Username"
      required
      iconStart={<Person />}
      // asyncValidate // checks username availability against the API
      fullWidth
    />
    <AuthForm.password>
      {/* strengthMeter wires zxcvbn strength check via useEffect → setError */}
      <PasswordField
        name="password"
        label="Password"
        required
        strengthMeter
        // onChange={(e) => {
        //   // checkStrength(e.target.value);
        //   if (!e.target.value) invalidate(); // ✅ bust cache when cleared
        // }}
        // onChange={() => invalidate()}
      />
      <ConfirmPasswordField />
    </AuthForm.password>
  </>
);

// Mini Helpers
const getDefaults = (
  mode: "signin" | "signup",
): LoginValues | RegisterValues =>
  mode === "signin"
    ? { identifier: "", password: "" }
    : {
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      };

// ─── Component ────────────────────────────────────────────────────────────────

const AuthForm = (inProps: AuthFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    mode = "signin",
    redirectTo,
    className,
    sx,
    forgotPassword = "Forgot your password?",
    forgotPasswordUrl = "/forgot-password",
    termsUrl = "/terms",
    privacyUrl = "/privacy",
    children,
    ...rest
  } = props;

  const isLogin = mode === "signin";

  // 🔥 async validators
  // const emailRule = useAsyncFieldRule("email");
  // const usernameRule = useAsyncFieldRule("username");
  // const { strengthRule } = usePasswordValidation("password");
  // const { matchRule } = usePasswordValidation("confirmPassword");

  // New unified hooks
  // const { strengthRule, checkStrength, feedback, invalidate } =
  //   usePasswordValidation("password", 3);

  // ── Async Rules ─────────────────────────────────────────────────────
  // const emailRule = useAsyncFieldRule("email");
  // const usernameRule = useAsyncFieldRule("username");
  // const { strengthRule, strengthZodRefine, checkStrength, invalidate } =
  //   usePasswordValidation("password");

  // // ✅ Memoize if passing to children that aren't memoized
  // // const handlePasswordChange = useCallback(
  // //   (value: string) => {
  // //     checkStrength(value);
  // //     invalidate();
  // //   },
  // //   [checkStrength, invalidate],
  // // );

  // // Destructure stable primitives BEFORE the memo
  // const { zodRefine: emailZodRefine } = emailRule;
  // const { zodRefine: usernameZodRefine } = usernameRule;

  // // ── Schema with proper field-level refinements ─────────────────────
  // const resolver = useMemo(() => {
  //   let schema = isLogin ? loginSchema : registerSchema;

  //   if (!isLogin) {
  //     schema = schema.safeExtend({
  //       // Re-apply field-level refinements
  //       email: z.email().refine(emailZodRefine, {
  //         message: "Email already in use",
  //       }),
  //       username: z.string().min(5).refine(usernameZodRefine, {
  //         message: "Username already taken",
  //       }),
  //       password: z.string().min(10).refine(strengthZodRefine, {
  //         message: "Password is too weak",
  //       }),
  //     });
  //     // .superRefine((data, ctx) => {
  //     //   // 🔥 async email check
  //     //   if (data.password !== data.confirmPassword) {
  //     //     ctx.addIssue({
  //     //       code: "custom",
  //     //       path: ["confirmPassword"],
  //     //       message: "Passwords do not match",
  //     //     });
  //     //   }
  //     // });
  //   }

  //   return zodResolver(schema);
  // }, [isLogin, emailZodRefine, usernameZodRefine, strengthZodRefine]);

  // const asyncMap = isLogin
  //   ? undefined
  //   : {
  //       email: emailRule.validate,
  //       username: usernameRule.validate,
  //       password: strengthRule,
  //       // confirmPassword: matchRule,
  //     };

  const { validate: emailValidate } = useAsyncFieldRule("email");
  const { validate: usernameValidate } = useAsyncFieldRule("username");
  const {
    validate: strengthRule,
    // checkStrength: score,
    checkMatch: matchRule,
    invalidate,
  } = usePasswordValidation("password");

  // asyncMap values are stable function refs — memo hits cache every render
  const asyncMap = useMemo(
    () =>
      isLogin
        ? ({} as AsyncMap)
        : {
            email: emailValidate,
            username: usernameValidate,
            password: strengthRule,
            // confirmPassword: matchRule,
          },
    [isLogin, emailValidate, usernameValidate, strengthRule],
  );

  // const asyncMap = isLogin
  //   ? undefined
  //   : {
  //       // email: emailRule.validate,
  //       // username: usernameRule.validate,
  //       email: emailValidate,
  //       username: usernameValidate,
  //       password: strengthRule,
  //       // confirmPassword: matchRule,
  //     };

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

  // ── Async email uniqueness rule ────────────────────────────────────────────
  // The hook debounces calls and cancels in-flight requests on unmount/change,
  // so we never hammer the API. It returns a Promise<string | boolean> that RHF
  // accepts directly in `rules.validate`.
  // const asyncEmailRule = useAsyncFieldRule("email");
  // const asyncUsernameRule = useAsyncFieldRule("username");
  // const { strengthRule, matchRule } = usePasswordValidation("password");

  // Two separate form instances with their own default values and schemas.
  // Keeping them separate avoids cross-contamination of validation state
  // when the user switches between signin and signup modes.
  // const form = useForm<LoginValues | RegisterValues>({
  //   resolver: zodResolver(schema),
  //   mode: "onChange",
  //   defaultValues: getDefaults(mode),
  // });

  const form = useForm({
    resolver: hybridResolver(schema, asyncMap),
    mode: "onChange",
    defaultValues: getDefaults(mode),
  });

  // const form = useForm({
  //   resolver,
  //   mode: "onChange",
  //   defaultValues: getDefaults(mode),
  // });

  // ✅ CRITICAL: reset when mode changes
  useEffect(() => {
    form.reset(getDefaults(mode));
  }, [mode, form]);

  const { mutate: login, isPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } =
    useRegister<RegisterValues>();

  const { handleSubmit } = form;

  const onSubmit = async (values: LoginValues | RegisterValues) => {
    if (isLogin) {
      login(values as LoginValues); // 🔥 uses authProvider automatically
    } else {
      // Sends { email, username, password, name } to authProvider.register
      register(values as RegisterValues, {
        onSuccess: (data) => {
          if (!data.success) {
            // handle error
            console.error("Registration failed:", data.error);
            return;
          }
          // Auto-login after successful registration
          login({
            identifier: (values as RegisterValues).email, // or values.username, depending on the backend
            password: (values as RegisterValues).password,
          });
        },
      });
    }
  };

  const handleForgotPassword = useCallback(() => {
    window.location.href = forgotPasswordUrl;
  }, [forgotPasswordUrl]);

  const isSubmitting = isPending || isRegisterPending;
  const isReady =
    form.formState.isValid && !form.formState.isValidating && !isSubmitting;

  // const { isReady, isSubmitting } = useFormOrchestrator(form);

  // FormProvider exposes the RHF context to every TextField/PasswordField
  // via useFormContext() — no need to thread `control` down manually.
  return (
    <FormProvider {...form}>
      <Root
        onSubmit={handleSubmit(onSubmit)}
        className={className}
        sx={sx}
        {...rest}
      >
        <CardContent>
          {/* Allow full slot override via children */}
          {children || (
            <AuthForm.content>
              {isLogin ? (
                // ── Sign-in fields ─────────────────────────────────────────
                <>
                  <TextField
                    name="identifier"
                    label="Username or Email"
                    required
                    iconStart={<Person />}
                    rules={{ required: "Username or Email is required" }}
                    fullWidth
                  />
                  <AuthForm.password>
                    <PasswordField name="password" label="Password" required />
                  </AuthForm.password>
                </>
              ) : (
                // ── Registration fields ────────────────────────────────────
                // <>
                //   <TextField
                //     name="name"
                //     label="Full Name"
                //     iconStart={<Badge />}
                //     rules={{ required: "Name is required" }}
                //     fullWidth
                //   />
                //   <TextField
                //     name="email"
                //     label="Email Address"
                //     type="email"
                //     iconStart={<Email />}
                //     rules={{
                //       required: "Email is required",
                //       // ✅ Real-time uniqueness check — debounced, no schema duplication
                //       validate: asyncEmailRule,
                //     }}
                //     fullWidth
                //   />
                //   <TextField
                //     name="username"
                //     label="Username"
                //     iconStart={<Person />}
                //     rules={{
                //       required: "Username is required",
                //       // ✅ Real-time uniqueness check — debounced, no schema duplication
                //       validate: asyncUsernameRule,
                //     }}
                //     fullWidth
                //   />
                // </>
                <RegisterFields
                  // score={score}
                  // checkStrength={checkStrength}
                  invalidate={invalidate}
                />
              )}

              {/* ── Password fields ────────────────────────────────────── */}
              {/* <AuthForm.password>
                <PasswordField
                  name="password"
                  label="Password"
                  rules={{ validate: strengthRule }}
                />
                {!isLogin && (
                  <PasswordField
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={{ validate: (v) => matchRule(v, watch("password")) }}
                  />
                )}
              </AuthForm.password> */}

              {/* ── Remember me / forgot password (sign-in only) ────────── */}
              {isLogin && (
                <AuthForm.footer>
                  <Typography
                    variant="body2"
                    component="span"
                    color="textSecondary"
                  >
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label={"Remember Me"}
                    />
                  </Typography>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                  >
                    {forgotPassword}
                  </Link>
                </AuthForm.footer>
              )}

              {/* ── Submit button — authType drives label + icon ─────────── */}
              <ValidatedButton
                loading={isSubmitting}
                authType={isLogin ? "signin" : "signup"}
                disabled={!isReady}
              />
            </AuthForm.content>
          )}
        </CardContent>
      </Root>
    </FormProvider>
  );
};

AuthForm.content = Content;
AuthForm.password = PasswordArea;
AuthForm.footer = Footer;
// AuthForm.button = FormButton;

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
