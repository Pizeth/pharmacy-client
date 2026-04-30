// BaseInput.tsx
import { FieldValues } from "react-hook-form";
import { BaseInputProps } from "@/interfaces/component-props.interface";
import { TextField, InputAdornment, useThemeProps, Box } from "@mui/material";
import useInputAdornment from "./useInputAdornment";

const PREFIX = "RazethBaseInput";

// Pixels occupied by the start InputAdornment (icon button / icon wrapper).
// MUI uses ~40px for "medium" and ~36px for "small" — 40 covers both safely.
const START_ADORNMENT_WIDTH = 40;

/**
 * Thin wrapper around MUI TextField that wires up:
 *  – end-adornment logic (spinner / password toggle / clear / icon)
 *  – label shrink based on focus / value
 *  – RHF field & fieldState binding
 *
 * Pass `type="password"` to activate the built-in show/hide toggle.
 * The `isPassword` prop is intentionally removed — `type` is the single
 * source of truth.
 */

// 1. Define the inner component with 'any' or 'FieldValues'
// export const BaseInput = forwardRef<HTMLDivElement, BaseInputProps>(
export function BaseInput<TFieldValues extends FieldValues>(
  inProps: BaseInputProps<TFieldValues>,
) {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    field,
    fieldState,
    label,
    ref,
    rootRef,
    inputRef,
    type = "text",
    iconStart,
    iconEnd,
    resettable = true, // ← default true so clear button appears out-of-the-box
    clearAlwaysVisible,
    isValidating,
    isFocused,
    disabled,
    readOnly,
    helperText,
    size = "medium",
    ...rest // only standard MUI TextField props remain
  } = props;

  const { effectiveType, endAdornment } = useInputAdornment({
    value: field.value,
    type,
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    onClear: () => field.onChange(""),
  });

  // ── Label shrink & offset ────────────────────────────────────────────────
  // The label must shrink (float above) when focused or when the field has a
  // value. If there is a start adornment we ALSO always shrink so the label
  // never overlaps the icon — this mirrors MUI's own behaviour for
  // `startAdornment` in uncontrolled inputs.
  // const shouldShrink = isFocused || !!field.value || !!iconStart;
  const shouldShrink = isFocused || !!field.value;

  // Vertical translate differs between TextField sizes:
  //   medium → translate(14px, 16px)   small → translate(14px, 9px)
  const yOffset = size === "small" ? 9 : 16;

  // When NOT shrunk and a start icon is present, slide the placeholder text
  // to the right so it starts after the icon — same technique as GlobalSearch.
  // Once shrunk (label floats above the outline) it snaps back to left: 0.
  const labelSx =
    iconStart && !shouldShrink
      ? {
          // Override the default transform to push the label right of the icon
          transform: `translate(${14 + START_ADORNMENT_WIDTH}px, ${yOffset}px) scale(1)`,
        }
      : {};

  return (
    <Box ref={rootRef}>
      <TextField
        // ref={ref}
        inputRef={inputRef} // Forwarding to internal input
        {...field}
        type={effectiveType}
        label={label}
        disabled={disabled}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? helperText}
        slotProps={{
          input: {
            readOnly,
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : undefined,
            endAdornment,
          },
          inputLabel: {
            // Keep label floated when focused OR when there's a value
            shrink: shouldShrink,
            sx: labelSx,
          },
          formHelperText: {
            sx: {
              fontWeight:
                !fieldState.error && !isValidating ? "bold" : undefined,
            },
          },
        }}
        {...rest}
      />
    </Box>
  );
}

export default BaseInput;

export const BaseInput1 = <TFieldValues extends FieldValues>(
  inProps: BaseInputProps<TFieldValues>,
) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    // type = "text",
    field,
    fieldState,
    label,
    iconStart,
    iconEnd,
    resettable = true, // ← default true so clear button appears out-of-the-box
    clearAlwaysVisible,
    isValidating,
    isFocused,
    helperText,
    size = "medium",
    ...rest
  } = props;
  const { endAdornment, effectiveType = "text" } = useInputAdornment({
    value: field.value,
    resettable,
    clearAlwaysVisible,
    disabled: props.disabled,
    readOnly: props.InputProps?.readOnly,
    isValidating,
    iconEnd: props.iconEnd,
    onClear: () => field.onChange(""),
  });

  return (
    <TextField
      {...field}
      type={effectiveType || effectiveType}
      label={label}
      error={!!fieldState.error}
      helperText={fieldState.error?.message || props.helperText}
      slotProps={{
        input: {
          startAdornment: iconStart && (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ),
          endAdornment,
        },
        inputLabel: {
          shrink: isFocused || !!field.value,
        },
        formHelperText: {
          sx: {
            fontWeight: !fieldState.error && !isValidating ? "bold" : undefined,
          },
        },
      }}
      {...rest}
    />
  );
};
