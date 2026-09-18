// // ─── Inner component (owns hooks that need fieldState) ───────────────────────
// // Extracting this into its own component is the ONLY correct fix for
// // "hooks called inside a render callback" — moving them to the top level
// // of a real React component satisfies Rules of Hooks.

// import {
//   BaseInputProps,
//   ControlledInputProps,
// } from "@/interfaces/component-props.interface";
// import { useCallback, useEffect, useRef } from "react";
// import {
//   ControllerFieldState,
//   ControllerRenderProps,
//   FieldValues,
//   UseFormClearErrors,
// } from "react-hook-form";
// import BaseInput from "./baseInput";
// import { useAsyncFieldValidation } from "@/lib/hooks/useFieldValidation";
// import {
//   setValidationLoadingAtom,
//   validationLoadingAtom,
//   validationMessagesAtom,
// } from "@/Stores/validationStore";
// import { useAtomValue, useSetAtom } from "jotai";
// import { InputHelper } from "../CustomComponents/InputHelper";

// const ControlledInput = ({
//   field,
//   fieldState,
//   name,
//   label,
//   helperText,
//   asyncValidate,
//   // clearErrors,
//   // setError,
//   // isFocused,
//   // onFocusChange,
//   // onFocus,
//   // onBlur,
//   ...rest
// }: ControlledInputProps) => {
//   // ref for the shake animation target
//   const rootRef = useRef<HTMLDivElement>(null);
//   const isMounted = useRef(false);
//   const loadings = useAtomValue(validationLoadingAtom);
//   const messages = useAtomValue(validationMessagesAtom); // 👈 add this
//   const setLoading = useSetAtom(setValidationLoadingAtom);
//   const isFieldValidating = loadings[name] ?? false;

//   // ✅ CRITICAL: memoize this wrapper so it doesn't change identity every render.
//   // Without useCallback, a new function is created each render, which lands in
//   // the useEffect deps array inside useAsyncFieldValidation and fires the effect
//   // on every single render → infinite setState loop.
//   // const clearFieldErrors: UseFormClearErrors<FieldValues> = useCallback(
//   //   (fieldName) => {
//   //     if (typeof fieldName === "string") {
//   //       clearErrors(fieldName);
//   //     } else if (Array.isArray(fieldName)) {
//   //       fieldName.forEach((nameItem) => clearErrors(nameItem));
//   //     }
//   //   },
//   //   [clearErrors],
//   // );

//   // Prevent running validation on first render
//   // useEffect(() => {
//   //   isMounted.current = true;
//   //   return () => {
//   //     isMounted.current = false;
//   //   };
//   // }, []);

//   // Async validation side-effect - only after mount + touched
//   // the hook. Only enabled after the field is touched to avoid firing on mount.
//   // useAsyncFieldValidation({
//   //   name,
//   //   value: field.value ?? "",
//   //   // setError,
//   //   // clearErrors: clearFieldErrors,
//   //   enabled: !!asyncValidate && fieldState.isTouched && isMounted.current,
//   // });

//   // Shake the label whenever validation fails, clear RHF errors on recovery.
//   // This effect is now at the top level of a real component — no hook violation.
//   useEffect(() => {
//     // const label = rootRef.current?.querySelector(".MuiInputLabel-root");

//     // if (!label) return;
//     if (fieldState.invalid && !fieldState.isValidating) {
//       const label = rootRef.current?.querySelector<HTMLLabelElement>(
//         ".MuiInputLabel-root",
//       );

//       if (!label) return;
//       label.classList.add("shake");
//       const timer = setTimeout(() => label.classList.remove("shake"), 500);
//       return () => clearTimeout(timer);
//     }

//     // ✅ Fix: Only clear errors if there actually IS an error to clear.
//     // This prevents the infinite loop/render-update error.
//     // if (!fieldState.invalid && fieldState.error) {
//     //   clearErrors(name);
//     // }
//   }, [
//     fieldState.invalid,
//     fieldState.isValidating,
//     // fieldState.error,
//     // name,
//     // clearErrors,
//   ]);

//   useEffect(() => {
//     return () => setLoading({ source: name, loading: false });
//   }, [name, setLoading]);

//   const errMsg = fieldState.error?.message;
//   const successMsg = !fieldState.invalid ? messages[name] : undefined; // 👈 add this
//   const renderHelperText = !!(
//     helperText ||
//     errMsg ||
//     successMsg || // 👈 include success in the render condition
//     fieldState.invalid
//   );

//   return (
//     <BaseInput
//       rootRef={rootRef}
//       field={field}
//       fieldState={fieldState}
//       label={label}
//       // isFocused={isFocused}
//       // isValidating={fieldState.isValidating}
//       isValidating={isFieldValidating} // ← replaces fieldState.isValidating
//       helperText={
//         // fieldState.error?.message ??
//         // (fieldState.isValidating
//         //   ? "Validating..."
//         //   : fieldState.isValidating) ??
//         // helperText
//         renderHelperText && (
//           <InputHelper
//             error={
//               // Show validation message only when NOT in validating state
//               fieldState.isValidating ? undefined : errMsg
//             }
//             success={fieldState.isValidating ? undefined : successMsg} // 👈 pass success separately
//             // helperText={
//             //   // Show "Validating..." text during async validation
//             //   fieldState.isValidating ? "Validating..." : helperText
//             // }
//           />
//         )
//       }
//       // onFocus={(e) => {
//       //   onFocusChange(true);
//       //   onFocus?.(e as React.FocusEvent<HTMLInputElement>);
//       // }}
//       // onBlur={(e) => {
//       //   onFocusChange(false);
//       //   field.onBlur(); // always notify RHF
//       //   onBlur?.(e as React.FocusEvent<HTMLInputElement>);
//       // }}
//       {...rest}
//     />
//   );
// };

// // export default ControlledInput;

// // interface ControlledInputProps extends Omit<
// //   BaseInputProps,
// //   "field" | "fieldState"
// // > {
// //   field: ControllerRenderProps<FieldValues, string>;
// //   fieldState: ControllerFieldState;
// //   name: string;
// //   clearErrors: (name: string) => void;
// //   isFocused: boolean;
// //   onFocusChange: (focused: boolean) => void;
// // }

import { useEffect, useRef } from "react";
// import { useFormContext } from "react-hook-form";
import { useAtomValue, useSetAtom } from "jotai";
import type { ControlledInputProps } from "@/interfaces/component-props.interface";
import {
  setValidationLoadingAtom,
  validationLoadingAtom,
  validationMessagesAtom,
} from "@/Stores/validationStore";

// import { useAsyncFieldRule } from "@/lib/hooks/useFieldValidation";
import BaseInput from "./baseInput";
import { InputHelperText } from "./helpers/inputHelperText";

/**
 * RHF-controlled standard text input.
 *
 * This layer is deliberately validation-policy agnostic.
 *
 * RHF's resolver / form owns:
 *
 * - schema validation
 * - async server validation
 * - business/resource validation policy
 *
 * This component only presents RHF's resulting field state.
 */
const ControlledInput = (props: ControlledInputProps) => {
  const {
    field,
    fieldState,
    name,
    label,
    helperText,
    // asyncValidate = false,
    // asyncValidationSource,
    // asyncDebounceMs = 500,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  // const validationKey = asyncValidationSource ?? name;

  const loadings = useAtomValue(validationLoadingAtom);
  const messages = useAtomValue(validationMessagesAtom);
  const setLoading = useSetAtom(setValidationLoadingAtom);

  // const isFieldValidating = loadings[validationKey] ?? false;

  // const validationMessage = messages[validationKey];

  // const { setError, clearErrors, getFieldState } = useFormContext();

  // const asyncRule = useAsyncFieldRule(validationKey, asyncDebounceMs);

  // /**
  //  * Resolver-independent server validation.
  //  *
  //  * Initial untouched values do not trigger a request.
  //  *
  //  * Once touched, subsequent changes are validated through the
  //  * debounced service.
  //  */
  // useEffect(() => {
  //   if (!asyncValidate || !fieldState.isTouched) {
  //     return;
  //   }

  //   const value = field.value;

  //   if (typeof value !== "string") {
  //     return;
  //   }

  //   if (value.trim().length === 0) {
  //     const currentError = getFieldState(name).error;

  //     if (currentError?.type === "async") {
  //       clearErrors(name);
  //     }

  //     return;
  //   }

  //   const existingError = getFieldState(name).error;

  //   /**
  //    * Do not overwrite a synchronous/schema error with an async one.
  //    */
  //   if (existingError && existingError.type !== "async") {
  //     return;
  //   }

  //   let active = true;

  //   void asyncRule.validate(value).then((result) => {
  //     if (!active) {
  //       return;
  //     }

  //     const currentError = getFieldState(name).error;

  //     if (result === true) {
  //       if (currentError?.type === "async") {
  //         clearErrors(name);
  //       }

  //       return;
  //     }

  //     /**
  //      * A synchronous/schema error which appeared while the
  //      * request was running keeps precedence.
  //      */
  //     if (currentError && currentError.type !== "async") {
  //       return;
  //     }

  //     setError(name, {
  //       type: "async",
  //       message: String(result),
  //     });
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [
  //   asyncDebounceMs,
  //   asyncRule,
  //   asyncValidate,
  //   clearErrors,
  //   field.value,
  //   fieldState.isTouched,
  //   getFieldState,
  //   name,
  //   setError,
  // ]);

  /**
   * Preserve the existing invalid-label animation behavior.
   *
   * Permanent animation styling remains a theme/global concern.
   */
  useEffect(() => {
    if (fieldState.invalid && !fieldState.isValidating) {
      const fieldLabel = rootRef.current?.querySelector<HTMLLabelElement>(
        ".MuiInputLabel-root",
      );

      if (!fieldLabel) {
        return;
      }

      fieldLabel.classList.add("shake");

      const timer = setTimeout(() => {
        fieldLabel.classList.remove("shake");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [fieldState.invalid, fieldState.isValidating]);

  // useEffect(() => {
  //   return () => {
  //     setLoading({ source: validationKey, loading: false });
  //   };
  // }, [setLoading, validationKey]);

  const errorMessage = fieldState.isValidating
    ? undefined
    : fieldState.error?.message;

  const successMessage =
    !fieldState.invalid && !fieldState.isValidating
      ? messages[name]
      : undefined;

  const validationState = fieldState.isValidating
    ? "validating"
    : fieldState.invalid
      ? "error"
      : successMessage
        ? "success"
        : "idle";

  const renderHelperText = !!(
    helperText ||
    errorMessage ||
    successMessage || // 👈 include success in the render condition
    fieldState.invalid
  );

  return (
    <BaseInput
      rootRef={rootRef}
      field={field}
      fieldState={fieldState}
      name={name}
      label={label}
      isValidating={fieldState.isValidating}
      validationState={validationState}
      helperText={
        renderHelperText && (
          <InputHelperText
            helperText={helperText}
            error={errorMessage}
            success={successMessage}
          />
        )
      }
      {...rest}
    />
  );
};

export default ControlledInput;
