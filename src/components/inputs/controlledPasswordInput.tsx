import { ControlledPasswordInputProps } from "@/interfaces/component-props.interface";
import {
  useMatchPasswordValidation,
  usePasswordStrengthValidation,
} from "@/lib/hooks/useFieldValidation";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useRef } from "react";
import BaseInput from "./baseInput";
import PasswordStrengthMeter from "../CustomComponents/PasswordStrengthMeter";
import { useAtomValue, useSetAtom } from "jotai";
import {
  clearValidationScoreAtom,
  validationScoreAtom,
  validationMessagesAtom,
  validationLoadingAtom,
  setValidationLoadingAtom,
} from "@/Stores/validationStore";
import { InputHelper } from "../CustomComponents/InputHelper";
// import { FieldValues, UseFormClearErrors } from "react-hook-form";

const ControlledPasswordInput = ({
  field,
  fieldState,
  name,
  label,
  helperText,
  strengthMeter,
  // score = 0,
  // message = "",
  matchPassword,
  // clearErrors,
  // setError,
  // isFocused,
  // onFocusChange,
  // onFocus,
  // onBlur,
  ...rest
}: ControlledPasswordInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scores = useAtomValue(validationScoreAtom);
  const messages = useAtomValue(validationMessagesAtom);
  const loadings = useAtomValue(validationLoadingAtom);
  const setLoading = useSetAtom(setValidationLoadingAtom);

  // const clearScore = useSetAtom(clearValidationScoreAtom);
  // const score = scores[name] ?? 0;
  // If field is empty, show 0 — no atom write needed
  const score = field.value ? (scores[name] ?? 0) : 0;
  const message = messages[name] ?? "";
  const isPasswordValidating = loadings[name] ?? false;

  // Clean up when field unmounts
  // useEffect(() => () => clearScore(name), [name, clearScore]);

  // useEffect(() => {
  //   if (!field.value) {
  //     clearScore(name);
  //   }
  // }, [field.value, name, clearScore]);

  // ✅ CRITICAL: memoize — recreating this on every render puts a new function
  // reference in the useEffect deps inside the validation hooks, which fires
  // the effect every render and produces the infinite setState loop.
  // const clearFieldErrors: UseFormClearErrors<FieldValues> = useCallback(
  //   (fieldName) => {
  //     if (typeof fieldName === "string") {
  //       clearErrors(fieldName);
  //     } else if (Array.isArray(fieldName)) {
  //       fieldName.forEach((nameItem) => clearErrors(nameItem));
  //     }
  //   },
  //   [clearErrors],
  // );

  // ── Password strength side-effect ─────────────────────────────────────────
  // Enabled only when strengthMeter is requested AND the field has been touched.
  // const { feedback } = usePasswordStrengthValidation({
  //   name,
  //   value: field.value ?? "",
  //   // setError,
  //   // clearErrors: clearFieldErrors,
  //   // Only run after the user has actually touched the field
  //   enabled: !!strengthMeter && fieldState.isTouched,
  // });

  // console.log("feedback: ", feedback);

  // ── Match validation side-effect ──────────────────────────────────────────
  // Runs synchronously inside useEffect whenever either password changes.
  // useMatchPasswordValidation({
  //   name,
  //   value: field.value ?? "",
  //   matchValue: matchPassword ?? "",
  //   // setError: setError,
  //   // clearErrors: clearFieldErrors,
  //   enabled: matchPassword !== undefined && fieldState.isTouched,
  // });

  // ── Shake label on invalid ────────────────────────────────────────────────
  useEffect(() => {
    if (fieldState.invalid && !fieldState.isValidating) {
      const label = containerRef.current?.querySelector<HTMLLabelElement>(
        ".MuiInputLabel-root",
      );
      if (!label) return;
      label.classList.add("shake");
      const t = setTimeout(() => label.classList.remove("shake"), 500);
      return () => clearTimeout(t);
    }
  }, [fieldState.invalid, fieldState.isValidating]);

  const showMeter = strengthMeter && (field.value?.length ?? 0) > 0;

  const errMsg = fieldState.error?.message || message;
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    // successMessage ||
    fieldState.invalid
  );

  // useEffect(() => {
  //   return () => setLoading({ source: name, loading: false });
  // }, [name, setLoading]);
  return (
    <Box width="100%">
      <BaseInput
        ref={containerRef}
        field={field}
        fieldState={fieldState}
        label={label}
        type="password"
        // isFocused={isFocused}
        isValidating={fieldState.isValidating}
        helperText={
          // fieldState.error?.message ??
          // (fieldState.isValidating
          //   ? "Validating..."
          //   : fieldState.isValidating) ??
          // helperText
          renderHelperText && (
            <InputHelper
              error={
                // Show validation message only when NOT in validating state
                fieldState.isValidating ? undefined : errMsg
              }
              // helperText={
              //   // Show "Validating..." text during async validation
              //   fieldState.isValidating ? "Validating..." : helperText
              // }
            />
          )
        }
        // isValidating={isPasswordValidating} // ← replaces fieldState.isValidating
        // onFocus={(e) => {
        //   onFocusChange(true);
        //   onFocus?.(e as React.FocusEvent<HTMLInputElement>);
        // }}
        // onBlur={(e) => {
        //   onFocusChange(false);
        //   field.onBlur();
        //   onBlur?.(e as React.FocusEvent<HTMLInputElement>);
        // }}
        {...rest}
      />
      {showMeter && (field.value?.length ?? 0) >= 10 && (
        <PasswordStrengthMeter
          passwordStrength={score}
          passwordFeedback={message}
          // passwordStrength={0}
          // passwordFeedback=""
        />
      )}
    </Box>
  );
};

export default ControlledPasswordInput;
