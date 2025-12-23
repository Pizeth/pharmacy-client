import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PasswordFieldProps } from "@/types/Types";
import PasswordValidationInput from "./PasswordValidationInput";
// import Box from "@mui/material/Box";
import { useTranslate } from "ra-core";
import { Box } from "@mui/material";

const PasswordFields = (props: PasswordFieldProps) => {
  const { className, iconStart, password, rePassword } = props;
  const translate = useTranslate();
  // const [password, setPassword] = useState<string>("");
  const { watch, trigger } = useFormContext();

  // Watch the password field value
  const passwordValue = watch("password");

  // Trigger rePassword validation when password changes
  useEffect(() => {
    trigger("rePassword");
  }, [trigger, passwordValue]);

  return (
    <Box>
      {/* Password Field */}
      <PasswordValidationInput
        source={password}
        iconStart={iconStart}
        className={className}
        label={translate("razeth.auth.password") || "Password"}
        autoComplete="new-password"
        resettable
        strengthMeter
        fullWidth
      />

      {/* Confirm Password Field */}
      <PasswordValidationInput
        source={rePassword}
        iconStart={iconStart}
        className={className}
        label={translate("razeth.auth.re_password") || "Confirm Password"}
        autoComplete="new-password"
        resettable
        passwordValue={passwordValue}
        fullWidth
      />
    </Box>
  );
};

export default PasswordFields;
