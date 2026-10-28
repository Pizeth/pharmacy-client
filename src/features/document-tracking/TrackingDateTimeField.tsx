"use client";
import type { TextFieldProps } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { mergeSlotProps, useForkRef } from "@mui/material/utils";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from "date-fns";
import { Controller, useFormContext } from "react-hook-form";
import { BaseInput } from "@/components/inputs";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

/** Keep the application input styling while the picker owns date section editing. */
function PickerInput(inProps: TextFieldProps) {
  const { value, onChange, onBlur, inputRef, InputProps, ...props } = useThemeProps({ props: { ...inProps, size: undefined }, name: "RazethTextField" });
  const handleInputRef = useForkRef(inputRef, null);
  return <BaseInput
    {...props}
    field={{ name: props.name ?? "", value, onChange: onChange ?? (() => {}), onBlur: () => {}, ref: handleInputRef ?? (() => {}) }}
    fieldState={{ invalid: !!props.error, error: props.error ? { type: "validate" } : undefined, isDirty: false, isTouched: false, isValidating: false }}
    onBlur={onBlur}
    iconStart={<CalendarMonthOutlined />}
    iconEnd={InputProps?.endAdornment}
    resettable={false}
    slotProps={{ ...props.slotProps, input: mergeSlotProps(InputProps ?? {}, props.slotProps?.input ?? {}) }}
  />;
}

/** Values remain local ISO strings; the document form applies Cambodia's UTC+7 offset. */
export function TrackingDateTimeField({ name, label, required = false, disabled = false }: {
  readonly name: string; readonly label: string; readonly required?: boolean; readonly disabled?: boolean;
}) {
  const { control } = useFormContext();
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Controller name={name} control={control} render={({ field }) => <DateTimePicker
      label={label}
      value={field.value ? parseISO(field.value) : null}
      onChange={value => field.onChange(value ? Number.isNaN(value.getTime()) ? "invalid" : format(value, "yyyy-MM-dd'T'HH:mm") : "")}
      format="dd-MM-yyyy HH:mm"
      ampm={false}
      disabled={disabled}
      enableAccessibleFieldDOMStructure={false}
      slots={{ textField: PickerInput }}
      slotProps={{ textField: { name, required, fullWidth: true, onBlur: field.onBlur, inputRef: field.ref } }}
    />} />
  </LocalizationProvider>;
}
