// BaseInput.tsx
import { BaseInputProps } from "@/interfaces/component-props.interface";
import { TextField, InputAdornment, useThemeProps } from "@mui/material";
import useInputAdornment from "./useInputAdornment ";

const PREFIX = "RazethBaseInput";
export const BaseInput = (inProps: BaseInputProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    // type = "text",
    field,
    fieldState,
    label,
    iconStart,
    iconEnd,
    isPassword,
    resettable,
    clearAlwaysVisible,
    isValidating,
    isFocused,
    helper,
    ...rest
  } = props;
  const { endAdornment, type = "text" } = useInputAdornment({
    value: field.value,
    isPassword,
    resettable,
    clearAlwaysVisible,
    disabled: props.disabled,
    readOnly: props.InputProps?.readOnly,
    isValidating,
    iconEnd: props.iconEnd,
    onClear: () => field.onChange(""),
  });

  console.log("field value:", field.value);
  console.log("isFocused:", isFocused);
  console.log("isValidating:", isValidating);
  console.log("endAdornment:", endAdornment);
  console.log("type:", type);

  return (
    <TextField
      {...field}
      type={type || type}
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

export default BaseInput;
