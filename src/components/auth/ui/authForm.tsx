"use client";

import { FormProvider } from "react-hook-form";
import { Typography, Link, FormControlLabel, CardContent, Checkbox } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { Person, Password } from "@mui/icons-material";
import type { AuthFormProps } from "@/interfaces/component-props.interface";
import TextField from "@/components/inputs/textfield";
import PasswordField from "@/components/inputs/passwordfield";
import ValidatedButton from "@/components/inputs/validatedButton";
import { Turnstile } from "@/components/securities/Turnstile";
import { Root, Content, PasswordArea, Footer } from "../styles/authForm.style";
import { RegisterFields } from "../components/RegisterFields";
import { useAuthForm } from "../hooks/useAuthForm";

const PREFIX = "RazethAuthForm";
const AuthForm = (inProps: AuthFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  // Consume legacy public options without leaking them onto the form element.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode = "signin", redirectTo: _redirectTo, className, sx, forgotPassword = "Forgot your password?", forgotPasswordUrl = "/forgot-password", termsUrl: _termsUrl = "/terms", privacyUrl: _privacyUrl = "/privacy", children, ...rest } = props;
  const { form, isLogin, isSubmitting, isReady, handleSubmit, onSubmit, handleForgotPassword, setCaptchaToken, handleCaptchaExpire } = useAuthForm(mode, forgotPasswordUrl);
  return (<FormProvider {...form}>
    <Root key={mode} onSubmit={handleSubmit(onSubmit)} className={className} sx={sx} {...rest}>
      <CardContent>
        {children || (<AuthForm.content>
          {isLogin ? (<>
            <TextField name="identifier" label="Username or Email" required iconStart={<Person />} rules={{ required: "Username or Email is required" }} fullWidth />
            <AuthForm.password>
              <PasswordField name="password" label="Password" iconStart={<Password />} required />
            </AuthForm.password>
          </>) : (<RegisterFields />)}
          {isLogin && (<AuthForm.footer>
            <Typography variant="body2" component="span" color="textSecondary">
              <FormControlLabel control={<Checkbox defaultChecked size="small" />} label={"Remember Me"} />
            </Typography>
            <Link component="button" type="button" variant="body2" onClick={handleForgotPassword}>
              {forgotPassword}
            </Link>
          </AuthForm.footer>)}
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setCaptchaToken} onExpire={handleCaptchaExpire} />
          <ValidatedButton loading={isSubmitting} authType={isLogin ? "signin" : "signup"} disabled={!isReady} />
        </AuthForm.content>)}
      </CardContent>
    </Root>
  </FormProvider>);
};
AuthForm.content = Content;
AuthForm.password = PasswordArea;
AuthForm.footer = Footer;
export default AuthForm;
