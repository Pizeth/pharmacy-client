// // BaseInput.tsx
// import { FieldValues } from "react-hook-form";
// import { BaseInputProps } from "@/interfaces/component-props.interface";
// import { TextField, InputAdornment, useThemeProps, Box } from "@mui/material";
// import useInputAdornment from "./useInputAdornment";
// import { useState } from "react";

// const PREFIX = "RazethBaseInput";

// // Pixels occupied by the start InputAdornment (icon button / icon wrapper).
// // MUI uses ~40px for "medium" and ~36px for "small" — 40 covers both safely.
// const START_ADORNMENT_WIDTH = 45;

// /**
//  * Thin wrapper around MUI TextField that wires up:
//  *  – end-adornment logic (spinner / password toggle / clear / icon)
//  *  – label shrink based on focus / value
//  *  – RHF field & fieldState binding
//  *
//  * Pass `type="password"` to activate the built-in show/hide toggle.
//  * The `isPassword` prop is intentionally removed — `type` is the single
//  * source of truth.
//  */

// // 1. Define the inner component with 'any' or 'FieldValues'
// // export const BaseInput = forwardRef<HTMLDivElement, BaseInputProps>(
// export function BaseInput<TFieldValues extends FieldValues>(
//   inProps: BaseInputProps<TFieldValues>,
// ) {
//   const props = useThemeProps({ props: inProps, name: PREFIX });
//   const {
//     field,
//     fieldState,
//     label,
//     ref,
//     rootRef,
//     inputRef,
//     type = "text",
//     iconStart,
//     iconEnd,
//     resettable = true, // ← default true so clear button appears out-of-the-box
//     clearAlwaysVisible,
//     isValidating,
//     isFocused,
//     disabled,
//     readOnly,
//     helperText,
//     size = "medium",
//     ...rest // only standard MUI TextField props remain
//   } = props;

//   // Compute spinner color from fieldState before passing to useInputAdornment
//   const spinnerColor = fieldState.error ? "error" : "primary";
//   // : fieldState.isDirty && !fieldState.invalid
//   //   ? "success"
//   //   : "primary";

//   const { effectiveType, endAdornment } = useInputAdornment({
//     value: field.value,
//     type,
//     resettable,
//     clearAlwaysVisible,
//     disabled,
//     readOnly,
//     isValidating,
//     iconEnd,
//     spinnerColor,
//     onClear: () => field.onChange(""),
//   });

//   const [focused, setFocused] = useState(false);

//   // ── Label shrink & offset ────────────────────────────────────────────────
//   // The label must shrink (float above) when focused or when the field has a
//   // value. If there is a start adornment we ALSO always shrink so the label
//   // never overlaps the icon — this mirrors MUI's own behaviour for
//   // `startAdornment` in uncontrolled inputs.
//   // const shouldShrink = isFocused || !!field.value || !!iconStart;
//   const shouldShrink = focused || !!field.value;

//   // Vertical translate differs between TextField sizes:
//   //   medium → translate(14px, 16px)   small → translate(14px, 9px)
//   // const yOffset = size === "small" ? 9 : 16;
//   const yOffset = 9;

//   // When NOT shrunk and a start icon is present, slide the placeholder text
//   // to the right so it starts after the icon — same technique as GlobalSearch.
//   // Once shrunk (label floats above the outline) it snaps back to left: 0.
//   const labelSx =
//     iconStart && !shouldShrink
//       ? {
//           // Override the default transform to push the label right of the icon
//           transform: `translate(${START_ADORNMENT_WIDTH}px, ${yOffset}px) scale(1)`,
//         }
//       : {};

//   return (
//     <Box ref={rootRef}>
//       <TextField
//         // ref={ref}
//         inputRef={inputRef} // Forwarding to internal input
//         {...field}
//         type={effectiveType}
//         label={label}
//         disabled={disabled}
//         error={!!fieldState.error}
//         // helperText={fieldState.error?.message ?? helperText}
//         helperText={
//           // fieldState.error?.message ??
//           (isValidating ? "Validating..." : helperText) ?? helperText
//         }
//         slotProps={{
//           input: {
//             readOnly,
//             startAdornment: iconStart ? (
//               <InputAdornment position="start">{iconStart}</InputAdornment>
//             ) : undefined,
//             endAdornment,
//           },
//           inputLabel: {
//             // Keep label floated when focused OR when there's a value
//             shrink: shouldShrink,
//             sx: labelSx,
//           },
//           formHelperText: {
//             sx: {
//               fontWeight:
//                 !fieldState.error && !isValidating ? "bold" : undefined,
//               color: (theme) =>
//                 isValidating
//                   ? theme.palette.primary.main
//                   : fieldState.error
//                     ? theme.palette.error.main
//                     : theme.palette.primary.main,
//             },
//           },
//         }}
//         onFocus={(e) => {
//           setFocused(true);
//           rest.onFocus?.(e); // forward if caller passed one
//         }}
//         onBlur={(e) => {
//           setFocused(false);
//           field.onBlur();
//           rest.onBlur?.(e);
//         }}
//         {...rest}
//       />
//     </Box>
//   );
// }

// export default BaseInput;

// export const BaseInput1 = <TFieldValues extends FieldValues>(
//   inProps: BaseInputProps<TFieldValues>,
// ) => {
//   const props = useThemeProps({ props: inProps, name: PREFIX });
//   const {
//     // type = "text",
//     field,
//     fieldState,
//     label,
//     iconStart,
//     iconEnd,
//     resettable = true, // ← default true so clear button appears out-of-the-box
//     clearAlwaysVisible,
//     isValidating,
//     isFocused,
//     helperText,
//     size = "medium",
//     ...rest
//   } = props;
//   const { endAdornment, effectiveType = "text" } = useInputAdornment({
//     value: field.value,
//     resettable,
//     clearAlwaysVisible,
//     disabled: props.disabled,
//     readOnly: props.InputProps?.readOnly,
//     isValidating,
//     iconEnd: props.iconEnd,
//     onClear: () => field.onChange(""),
//   });

//   return (
//     <TextField
//       {...field}
//       type={effectiveType || effectiveType}
//       label={label}
//       error={!!fieldState.error}
//       helperText={fieldState.error?.message || props.helperText}
//       slotProps={{
//         input: {
//           startAdornment: iconStart && (
//             <InputAdornment position="start">{iconStart}</InputAdornment>
//           ),
//           endAdornment,
//         },
//         inputLabel: {
//           shrink: isFocused || !!field.value,
//         },
//         formHelperText: {
//           sx: {
//             fontWeight: !fieldState.error && !isValidating ? "bold" : undefined,
//           },
//         },
//       }}
//       {...rest}
//     />
//   );
// };

import { InputAdornment, TextField as MuiTextField } from "@mui/material";
import { mergeSlotProps } from "@mui/material/utils";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import type { BaseInputProps } from "@/interfaces/component-props.interface";
import useInputAdornment from "./useInputAdornment";

const PREFIX = "RazethTextField";

// Pixels occupied by the start InputAdornment (icon button / icon wrapper).
// MUI uses ~40px for "medium" and ~36px for "small" — 40 covers both safely.
const START_ADORNMENT_WIDTH = 45;

const Root = styled(MuiTextField, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({
  minWidth: 0,

  /**
   * MUI normally treats a startAdornment as a reason to shrink an
   * InputLabel.
   *
   * Our contract is intentionally different:
   *
   *   icon only
   *      → label remains inline
   *
   *   focus/value
   *      → label shrinks
   *
   * Offset values live in theme CSS variables so changing the visual
   * geometry does not require editing this component.
   *
   * A start adornment must NOT by itself force our custom label to float.
   *
   * When the field is empty and unfocused, shift the label after the icon.
   * Once focused or populated, normal MUI shrink positioning resumes.
   */
  '&[data-start-icon="true"][data-label-shrunk="false"][data-size="small"] .MuiInputLabel-root':
    {
      transform: `translate(var(--RazethTextField-label-offset-x, ${START_ADORNMENT_WIDTH}px), var(--RazethTextField-label-offset-y-small, 9px)) scale(1)`,
    },

  '&[data-start-icon="true"][data-label-shrunk="false"][data-size="medium"] .MuiInputLabel-root':
    {
      transform: `translate(var(--RazethTextField-label-offset-x, ${START_ADORNMENT_WIDTH}px), var(--RazethTextField-label-offset-y-medium, 16px)) scale(1)`,
    },
});

const StartAdornmentRoot = styled(InputAdornment, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})({});

/**
 * Low-level RHF/MUI input primitive.
 *
 * Responsibilities:
 *
 * - end-adornment logic (spinner / password toggle / clear / icon)
 * - label shrink based on focus / value
 * - RHF field & fieldState binding
 * - install standard start/end adornments
 * - merge caller MUI slotProps
 *
 * It does not own resource/business validation policy.
 *
 * Brand/visual styling belongs in:
 *
 *   theme.components.RazethTextField
 *
 * This component owns only runtime behavior.
 *
 * Pass `type="password"` to activate the built-in show/hide toggle.
 * The `isPassword` prop is intentionally removed — `type` is the single
 * source of truth.
 */
export function BaseInput<TFieldValues extends FieldValues>(
  props: BaseInputProps<TFieldValues>,
) {
  const {
    field,
    fieldState,
    label,
    rootRef,
    type = "text",
    iconStart,
    iconEnd,
    resettable = true,
    clearAlwaysVisible,
    isValidating = false,
    disabled,
    readOnly,
    helperText,
    size = "medium",
    multiline,
    validationState = "idle",
    slotProps,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [focused, setFocused] = useState(false);

  const value = field.value ?? "";

  const hasValue = String(value).length > 0;

  /**
   * IMPORTANT:
   *
   * iconStart is NOT part of this expression.
   *
   * This preserves the desirable legacy behavior:
   *
   *   icon only          -> inline label
   *   focus              -> floating label
   *   non-empty value    -> floating label
   *
   *   start icon alone does not force the label to float.
   */
  const shouldShrink = focused || hasValue;

  // Compute spinner color from fieldState before passing to useInputAdornment
  const spinnerColor = fieldState.error ? "error" : "primary";

  const { effectiveType, endAdornment } = useInputAdornment({
    value: String(value),
    type,
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    spinnerColor,
    onClear: () => field.onChange(""),
  });

  /**
   * MUI mergeSlotProps supports object AND function slot props.
   *
   * Our internal argument is intentionally first because MUI gives the
   * first argument precedence on conflicting ordinary properties.
   *
   * Therefore callers can add:
   *
   * - className
   * - events
   * - data attributes
   * - component configuration
   *
   * without replacing structural behavior owned by BaseInput:
   *
   * - readOnly
   * - startAdornment
   * - endAdornment
   */
  const mergedInputSlotProps = mergeSlotProps(
    {
      readOnly,
      startAdornment: iconStart ? (
        <StartAdornmentRoot position="start">{iconStart}</StartAdornmentRoot>
      ) : undefined,
      endAdornment,
    },
    slotProps?.input ?? {},
  );

  /**
   * The same contract applies to the label.
   *
   * Callers may add label configuration, but our shrink behavior remains
   * authoritative because it is part of RazethTextField's interaction
   * contract rather than per-call visual styling.
   */
  const mergedInputLabelSlotProps = mergeSlotProps(
    {
      shrink: shouldShrink,
    },
    slotProps?.inputLabel ?? {},
  );

  return (
    <Root
      {...rest}
      ref={rootRef}
      name={field.name}
      inputRef={field.ref}
      value={value}
      type={effectiveType}
      label={label}
      size={size}
      multiline={multiline}
      disabled={disabled}
      error={Boolean(fieldState.error)}
      helperText={helperText}
      // helperText={(isValidating ? "Validating..." : helperText) ?? helperText}
      data-start-icon={iconStart ? "true" : "false"}
      data-label-shrunk={shouldShrink ? "true" : "false"}
      data-size={size}
      data-multiline={multiline ? "true" : "false"}
      data-validation-state={validationState}
      slotProps={{
        /**
         * Preserve every caller slot we do not structurally own.
         *
         * In particular:
         *
         *   slotProps.htmlInput
         *
         * reaches the native <input>.
         */
        ...slotProps,

        input: mergedInputSlotProps,
        inputLabel: mergedInputLabelSlotProps,
        // formHelperText: {
        //   sx: {
        //     fontWeight: !fieldState.error && !isValidating ? "bold" : undefined,
        //     color: (theme) =>
        //       isValidating
        //         ? theme.palette.primary.main
        //         : fieldState.error
        //           ? theme.palette.error.main
        //           : theme.palette.primary.main,
        //   },
        // },
      }}
      onChange={field.onChange}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        field.onBlur();
        onBlur?.(event);
      }}
    />
  );
}

export default BaseInput;
