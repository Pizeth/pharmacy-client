// ─── Inner component (owns hooks that need fieldState) ───────────────────────
// Extracting this into its own component is the ONLY correct fix for
// "hooks called inside a render callback" — moving them to the top level
// of a real React component satisfies Rules of Hooks.

import { BaseInputProps } from "@/interfaces/component-props.interface";
import { useEffect, useRef } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import BaseInput from "./baseInput";

interface ControlledInputProps extends Omit<
  BaseInputProps,
  "field" | "fieldState"
> {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  name: string;
  clearErrors: (name: string) => void;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

const ControlledInput = ({
  field,
  fieldState,
  name,
  label,
  clearErrors,
  isFocused,
  onFocusChange,
  onFocus,
  onBlur,
  ...rest
}: ControlledInputProps) => {
  // ref for the shake animation target
  const rootRef = useRef<HTMLDivElement>(null);

  // Shake the label whenever validation fails, clear RHF errors on recovery.
  // This effect is now at the top level of a real component — no hook violation.
  useEffect(() => {
    const label = rootRef.current?.querySelector(".MuiInputLabel-root");

    if (!label) return;
    if (fieldState.invalid && !fieldState.isValidating) {
      // const label = containerRef.current?.querySelector<HTMLLabelElement>(
      //   ".MuiInputLabel-root",
      // );
      // if (!label) return;
      label.classList.add("shake");
      const timer = setTimeout(() => label.classList.remove("shake"), 500);
      return () => clearTimeout(timer);
    }

    if (!fieldState.invalid) {
      clearErrors(name);
    }
  }, [fieldState.invalid, fieldState.isValidating, name, clearErrors]);

  return (
    <BaseInput
      rootRef={rootRef}
      field={field}
      fieldState={fieldState}
      label={label}
      isFocused={isFocused}
      isValidating={fieldState.isValidating}
      onFocus={(e) => {
        onFocusChange(true);
        onFocus?.(e as React.FocusEvent<HTMLInputElement>);
      }}
      onBlur={(e) => {
        onFocusChange(false);
        field.onBlur(); // always notify RHF
        onBlur?.(e as React.FocusEvent<HTMLInputElement>);
      }}
      {...rest}
    />
  );
};

export default ControlledInput;
