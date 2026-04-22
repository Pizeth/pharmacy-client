// RHFTextField.tsx
import { Controller } from "react-hook-form";
import {
  TextField as MuiTextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import useInputEndAdornment from "./inputEndAdorment";

export const TextField = ({
  name,
  control,
  //   type,
  label,
  iconStart,
  iconEnd,
  isLoading,
  ...props
}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { endAdornment, type } = useInputEndAdornment({
          type: props.type,
          value: field.value,
          onClear: () => field.onChange(""),
        });
        return (
          <MuiTextField
            {...field}
            {...props}
            type={type || props.type}
            label={label}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            // slotProps={{
            //   input: {
            //     startAdornment: iconStart ? (
            //       <InputAdornment position="start">{iconStart}</InputAdornment>
            //     ) : undefined,
            //     endAdornment: isLoading ? (
            //       <CircularProgress size={18} />
            //     ) : iconEnd ? (
            //       <InputAdornment position="end">{iconEnd}</InputAdornment>
            //     ) : undefined,
            //   },
            // }}
            slotProps={{
              input: {
                startAdornment: iconStart && (
                  <InputAdornment position="start">{iconStart}</InputAdornment>
                ),
                endAdornment,
              },
            }}
          />
        );
      }}
    />
  );
};

export default TextField;
