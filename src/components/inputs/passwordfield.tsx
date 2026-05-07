// RHFPasswordField.tsx
import { useThemeProps } from "@mui/material";
// import TextField from "./textfield";
import { PasswordFieldProps } from "@/interfaces/component-props.interface";
import {
  Controller,
  // UseControllerProps,
  useFormContext,
} from "react-hook-form";
// import { usePasswordValidation } from "@/lib/hooks/useFieldValidation";
// import PasswordStrengthMeter from "../CustomComponents/PasswordStrengthMeter";
// import { useState } from "react";
import ControlledPasswordInput from "./controlledPasswordInput";

const PREFIX = "RazethPasswordField";
export const PasswordField = (inProps: PasswordFieldProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    name,
    rules,
    defaultValue,
    strengthMeter = false,
    matchPassword,
    ...rest
  } = props;

  const { control } = useFormContext();
  // const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => (
        <ControlledPasswordInput
          field={field}
          fieldState={fieldState}
          name={name}
          strengthMeter={strengthMeter}
          matchPassword={matchPassword}
          // clearErrors={clearErrors}
          // setError={setError}
          // isFocused={focused}
          // onFocusChange={setFocused}
          {...rest}
        />
      )}
    />
  );
};

export default PasswordField;

// const { watch } = useFormContext();
// const currentValue: string = watch(name) ?? "";

// Always call the hook (Rules of Hooks) — it's a no-op when unused because
// strengthRule / matchRule are only included in `mergedRules` conditionally.
// const { feedback, strengthRule, matchRule } = usePasswordValidation(name);

// const rules = matchPassword
//   ? {
//       validate: (v: string) => matchRule(v, matchPassword),
//     }
//   : {
//       validate: strengthRule,
//     };

// ── Build merged rules ──────────────────────────────────────────────────────
// `rules.validate` can be a single function or an object of named validators.
// We normalise to object form so we can safely add strength / match alongside
// any existing validators the caller passes.
// const existingValidate = rules?.validate;
// const validateObject =
//   typeof existingValidate === "function"
//     ? { custom: existingValidate }
//     : (existingValidate ?? {});

// const mergedRules: UseControllerProps["rules"] = {
//   ...rules,
//   validate: {
//     ...validateObject,
//     // Adds the strength validator only when strengthMeter is requested
//     ...(strengthMeter && { strength: strengthRule }),
//     // Adds the match validator only when a password value is provided
//     ...(matchPassword !== undefined && {
//       match: (v: string) => matchRule(v, matchPassword),
//     }),
//   },
// };

// Show the meter once the user has started typing
// const showMeter = strengthMeter && currentValue.length > 0;

// return <TextField name={name} control={control} type="password" {...rest} />;
// return (
//   <Box width="100%">
//     <TextField
//       name={name}
//       // control={control}
//       type="password"
//       rules={rules}
//       behavior={{ passwordToggle: true }}
//       {...rest}
//     />

//     {/* PasswordStrengthMeter slides in as soon as there is a value */}
//     {showMeter && (
//       <PasswordStrengthMeter
//         passwordStrength={feedback.score}
//         // Show "Analyzing…" from the service while zxcvbn is running,
//         // then show feedback suggestions once the check completes.
//         passwordFeedback={feedback.message}
//       />
//     )}
//   </Box>
// );
