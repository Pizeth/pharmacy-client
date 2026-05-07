// ─── Inner component (owns hooks that need fieldState) ───────────────────────
// Extracting this into its own component is the ONLY correct fix for
// "hooks called inside a render callback" — moving them to the top level
// of a real React component satisfies Rules of Hooks.

import {
  BaseInputProps,
  ControlledInputProps,
} from "@/interfaces/component-props.interface";
import { useCallback, useEffect, useRef } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormClearErrors,
} from "react-hook-form";
import BaseInput from "./baseInput";
import { useAsyncFieldValidation } from "@/lib/hooks/useFieldValidation";

const ControlledInput = ({
  field,
  fieldState,
  name,
  label,
  asyncValidate,
  // clearErrors,
  // setError,
  // isFocused,
  // onFocusChange,
  // onFocus,
  // onBlur,
  ...rest
}: ControlledInputProps) => {
  // ref for the shake animation target
  const rootRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  // ✅ CRITICAL: memoize this wrapper so it doesn't change identity every render.
  // Without useCallback, a new function is created each render, which lands in
  // the useEffect deps array inside useAsyncFieldValidation and fires the effect
  // on every single render → infinite setState loop.
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

  // Prevent running validation on first render
  // useEffect(() => {
  //   isMounted.current = true;
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  // Async validation side-effect - only after mount + touched
  // the hook. Only enabled after the field is touched to avoid firing on mount.
  // useAsyncFieldValidation({
  //   name,
  //   value: field.value ?? "",
  //   // setError,
  //   // clearErrors: clearFieldErrors,
  //   enabled: !!asyncValidate && fieldState.isTouched && isMounted.current,
  // });

  // Shake the label whenever validation fails, clear RHF errors on recovery.
  // This effect is now at the top level of a real component — no hook violation.
  useEffect(() => {
    // const label = rootRef.current?.querySelector(".MuiInputLabel-root");

    // if (!label) return;
    if (fieldState.invalid && !fieldState.isValidating) {
      const label = rootRef.current?.querySelector<HTMLLabelElement>(
        ".MuiInputLabel-root",
      );

      if (!label) return;
      label.classList.add("shake");
      const timer = setTimeout(() => label.classList.remove("shake"), 500);
      return () => clearTimeout(timer);
    }

    // ✅ Fix: Only clear errors if there actually IS an error to clear.
    // This prevents the infinite loop/render-update error.
    // if (!fieldState.invalid && fieldState.error) {
    //   clearErrors(name);
    // }
  }, [
    fieldState.invalid,
    fieldState.isValidating,
    // fieldState.error,
    // name,
    // clearErrors,
  ]);

  return (
    <BaseInput
      rootRef={rootRef}
      field={field}
      fieldState={fieldState}
      label={label}
      // isFocused={isFocused}
      isValidating={fieldState.isValidating}
      // onFocus={(e) => {
      //   onFocusChange(true);
      //   onFocus?.(e as React.FocusEvent<HTMLInputElement>);
      // }}
      // onBlur={(e) => {
      //   onFocusChange(false);
      //   field.onBlur(); // always notify RHF
      //   onBlur?.(e as React.FocusEvent<HTMLInputElement>);
      // }}
      {...rest}
    />
  );
};

export default ControlledInput;

// interface ControlledInputProps extends Omit<
//   BaseInputProps,
//   "field" | "fieldState"
// > {
//   field: ControllerRenderProps<FieldValues, string>;
//   fieldState: ControllerFieldState;
//   name: string;
//   clearErrors: (name: string) => void;
//   isFocused: boolean;
//   onFocusChange: (focused: boolean) => void;
// }
