import { useState } from "react";
import { Form, useNotify, useTranslate } from "ra-core";
import { SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  CardContent,
  Typography,
} from "@mui/material";
import { styled, useThemeProps } from "@mui/material/styles";
import IconInput from "../CustomInputs/IconInput";
import PasswordValidationInput from "../CustomInputs/PasswordValidationInput";
import { Person, Email, Password, PersonAdd } from "@mui/icons-material";
import { useRequired } from "@/utils/validator";
import { useNavigate } from "react-router-dom";
import { SignUpFormProps } from "@/interfaces/component-props.interface";
import { SignUpParams } from "@/interfaces/auth.interface";
import PasswordFields from "../CustomInputs/PasswordComponents";
import ValidationInput from "../CustomInputs/ValidationInput";

// interface SignUpFormProps {
//   onSubmit?: (data: SignUpData) => void | Promise<void>;
//   redirectTo?: string;
//   className?: string;
//   sx?: any;
//   children?: React.ReactNode;
//   termsUrl?: string;
//   privacyUrl?: string;
// }

// interface SignUpData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   agreeToTerms: boolean;
// }

const PREFIX = "RazethSignUpForm";

const StyledSignUpForm = styled(Form, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SignUpFormProps>(() => ({}));

const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})<SignUpFormProps>(() => ({}));

const PasswordArea = styled(Box, {
  name: PREFIX,
  slot: "Password",
  overridesResolver: (_props, styles) => styles.password,
})<SignUpFormProps>(() => ({}));

const TermsArea = styled(Box, {
  name: PREFIX,
  slot: "Terms",
  overridesResolver: (_props, styles) => styles.terms,
})<SignUpFormProps>(() => ({}));

const FormButton = styled(Button, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})<SignUpFormProps>(() => ({}));

const SignUpForm = (inProps: SignUpFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });

  const {
    onSubmit,
    redirectTo,
    className,
    sx,
    children,
    termsUrl = "/terms",
    privacyUrl = "/privacy",
    ...rest
  } = props;

  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  const required = useRequired();
  const navigate = useNavigate();

  // Custom validation for password confirmation
  const validatePasswordMatch = (value: string, allValues: any) => {
    if (value !== allValues.password) {
      return (
        translate("razeth.auth.passwords_dont_match") || "Passwords don't match"
      );
    }
    return undefined;
  };

  // Custom validation for email
  const validateEmail = (value: string) => {
    if (!value) {
      return translate("razeth.auth.email_required") || "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return translate("razeth.auth.email_invalid") || "Invalid email address";
    }
    return undefined;
  };

  // Custom validation for username
  const validateUsername = (value: string) => {
    if (!value) {
      return (
        translate("razeth.auth.username_required") || "Username is required"
      );
    }
    if (value.length < 3) {
      return (
        translate("razeth.auth.username_min_length") ||
        "Username must be at least 3 characters"
      );
    }
    return undefined;
  };

  // Custom validation for terms
  const validateTerms = (value: boolean) => {
    if (!value) {
      return (
        translate("razeth.auth.terms_required") || "You must agree to the terms"
      );
    }
    return undefined;
  };

  const handleSubmit: SubmitHandler<FieldValues> = async (
    values: SignUpParams
  ) => {
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default behavior - replace with your actual signup API call
        console.log("Sign up data:", values);

        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        notify(
          translate("razeth.auth.signup_success") ||
            "Account created successfully!",
          { type: "success" }
        );

        // Redirect if specified
        if (redirectTo) {
          navigate(redirectTo);
          //   window.location.href = redirectTo;
        }
      }
    } catch (error: any) {
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
          ? translate("razeth.auth.signup_error") || "Registration failed"
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSignUpForm
      //   onSubmit={handleSubmit}
      mode="onChange"
      noValidate
      className={className}
      sx={sx}
      {...rest}
    >
      <CardContent>
        {children || (
          <SignUpForm.content>
            {/* Username Field */}
            <ValidationInput
              source="username"
              className="icon-input"
              iconStart={<Person />}
              fullWidth
              // label={translate("razeth.auth.username")}
              autoComplete="username"
              resettable
            />

            {/* Email Field */}
            <ValidationInput
              source="email"
              className="icon-input"
              iconStart={<Email />}
              fullWidth
              // label={translate("razeth.auth.email") || "Email"}
              autoComplete="email"
              resettable
            />

            {/* Password Area */}
            <SignUpForm.password>
              <PasswordFields
                password="password"
                rePassword="rePassword"
                className="icon-input"
                iconStart={<Password />}
              />
            </SignUpForm.password>

            {/* Terms and Conditions */}
            <SignUpForm.terms>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    // validate={validateTerms}
                  />
                }
                label={
                  <Typography variant="body2">
                    {translate("razeth.footer.agree_to")}{" "}
                    <a
                      href={termsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translate("razeth.footer.terms")}
                    </a>{" "}
                    {translate("razeth.footer.and")}{" "}
                    <a
                      href={privacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translate("razeth.footer.privacy")}
                    </a>
                  </Typography>
                }
              />
            </SignUpForm.terms>

            {/* Submit Button */}
            <SignUpForm.button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress color="inherit" size={19} thickness={3} />
              ) : (
                translate("razeth.auth.sign_up") || "Sign Up"
              )}
              <PersonAdd />
            </SignUpForm.button>
          </SignUpForm.content>
        )}
      </CardContent>
    </StyledSignUpForm>
  );
};

// Slot API exports
SignUpForm.content = Content;
SignUpForm.password = PasswordArea;
SignUpForm.terms = TermsArea;
SignUpForm.button = FormButton;

export default SignUpForm;
