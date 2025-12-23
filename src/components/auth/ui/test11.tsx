import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  styled,
  useThemeProps,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { useTranslate, useNotify } from "ra-core";

interface SignUpFormProps {
  onSubmit?: (data: SignUpData) => void;
  className?: string;
  sx?: any;
}

interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const PREFIX = "RazethSignUp";

const StyledForm = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SignUpFormProps>(() => ({}));

const SignUpForm = (inProps: SignUpFormProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { onSubmit, className, sx, ...rest } = props;

  const translate = useTranslate();
  const notify = useNotify();

  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpData, string>>
  >({});

  const handleChange =
    (field: keyof SignUpData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "agreeToTerms" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username =
        translate("razeth.auth.username_required") || "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username =
        translate("razeth.auth.username_min_length") ||
        "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        translate("razeth.auth.email_required") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        translate("razeth.auth.email_invalid") || "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password =
        translate("razeth.auth.password_required") || "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        translate("razeth.auth.password_min_length") ||
        "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        translate("razeth.auth.confirm_password_required") ||
        "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        translate("razeth.auth.passwords_dont_match") ||
        "Passwords don't match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        translate("razeth.auth.terms_required") ||
        "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notify(
        translate("razeth.auth.form_validation_error") ||
          "Please fix the errors in the form",
        { type: "error" }
      );
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default behavior - you can replace this with your API call
      console.log("Sign up data:", formData);
      notify(
        translate("razeth.auth.signup_success") ||
          "Account created successfully!",
        { type: "success" }
      );
    }
  };

  return (
    <StyledForm
      //   component="form"
      //   onSubmit={handleSubmit}
      className={className}
      sx={sx}
      {...rest}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Username Field */}
        <TextField
          fullWidth
          label={translate("razeth.auth.username") || "Username"}
          value={formData.username}
          onChange={handleChange("username")}
          error={!!errors.username}
          helperText={errors.username}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          type="email"
          label={translate("razeth.auth.email") || "Email"}
          value={formData.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label={translate("razeth.auth.password") || "Password"}
          value={formData.password}
          onChange={handleChange("password")}
          error={!!errors.password}
          helperText={errors.password}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password Field */}
        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          label={
            translate("razeth.auth.confirm_password") || "Confirm Password"
          }
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Terms and Conditions */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={handleChange("agreeToTerms")}
              color="primary"
            />
          }
          label={
            translate("razeth.auth.agree_terms") ||
            "I agree to the Terms and Conditions"
          }
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "0.875rem",
            },
          }}
        />
        {errors.agreeToTerms && (
          <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: -1 }}>
            {errors.agreeToTerms}
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 1 }}
        >
          {translate("razeth.auth.sign_up") || "Sign Up"}
        </Button>
      </Box>
    </StyledForm>
  );
};

export default SignUpForm;
