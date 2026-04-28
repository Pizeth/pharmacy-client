// RHFTextField.tsx
import { Controller, useFormContext } from "react-hook-form";
import { useThemeProps } from "@mui/material";
import { IconInputProps } from "@/interfaces/component-props.interface";
import { useState } from "react";
import ControlledInput from "./controlledInput";

const PREFIX = "RazethTextField";
export const TextField = (inProps: IconInputProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { name, label, rules, defaultValue, ...rest } = props;
  const { control, clearErrors } = useFormContext();

  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => (
        // ✅ No hooks here — render prop is a plain JSX expression
        <ControlledInput
          field={field}
          fieldState={fieldState}
          label={label}
          name={name}
          clearErrors={clearErrors}
          isFocused={focused}
          onFocusChange={setFocused}
          {...rest}
        />
      )}
    />
  );
};

export default TextField;

// export const TextField = ({
//   name,
//   control,
//   //   type,
//   label,
//   iconStart,
//   iconEnd,
//   isLoading,
//   ...props
// }: any) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => {
//         const { endAdornment, type } = useInputAdornment({
//           type: props.type,
//           value: field.value,
//           onClear: () => field.onChange(""),
//         });
//         return (
//           <MuiTextField
//             {...field}
//             {...props}
//             type={type || props.type}
//             label={label}
//             error={!!fieldState.error}
//             helperText={fieldState.error?.message}
//             // slotProps={{
//             //   input: {
//             //     startAdornment: iconStart ? (
//             //       <InputAdornment position="start">{iconStart}</InputAdornment>
//             //     ) : undefined,
//             //     endAdornment: isLoading ? (
//             //       <CircularProgress size={18} />
//             //     ) : iconEnd ? (
//             //       <InputAdornment position="end">{iconEnd}</InputAdornment>
//             //     ) : undefined,
//             //   },
//             // }}
//             slotProps={{
//               input: {
//                 startAdornment: iconStart && (
//                   <InputAdornment position="start">{iconStart}</InputAdornment>
//                 ),
//                 endAdornment,
//               },
//             }}
//           />
//         );
//       }}
//     />
//   );
// };

// render={({ field, fieldState }) => {
//   // 🔥 SHAKE EFFECT (same behavior as your Animations.shake)
//   useEffect(() => {
//     if (fieldState.invalid && labelRef.current) {
//       labelRef.current.classList.add("shake");
//       setTimeout(() => {
//         labelRef.current?.classList.remove("shake");
//       }, 500);
//     } else {
//       clearErrors(name);
//     }
//   }, [fieldState.invalid]);

//   return (
//     <BaseInput
//       field={field}
//       fieldState={fieldState}
//       label={label}
//       isFocused={focused}
//       isValidating={fieldState.isValidating}
//       onFocus={(e) => {
//         setFocused(true);
//         props.onFocus?.(e);
//       }}
//       onBlur={(e) => {
//         field.onBlur(); // Important for RHF touch state
//         props.onBlur?.(e);
//       }}
//       {...rest}
//     />
//   );
// }}
