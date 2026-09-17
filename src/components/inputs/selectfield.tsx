"use client";

import { useId, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { useTheme, useThemeProps } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectFieldProps } from "@/interfaces/component-props.interface";
import { InputHelperText } from "./helpers/inputHelperText";

const PREFIX = "RazethSelectField";

const START_ADORNMENT_WIDTH = 45;

const Root = styled(FormControl, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({
  minWidth: 0,

  '&[data-start-icon="true"][data-label-shrunk="false"][data-size="small"] .MuiInputLabel-root':
    {
      transform: `translate(var(--RazethSelectField-label-offset-x, ${START_ADORNMENT_WIDTH}px), var(--RazethSelectField-label-offset-y-small, 9px)) scale(1)`,
    },

  '&[data-start-icon="true"][data-label-shrunk="false"][data-size="medium"] .MuiInputLabel-root':
    {
      transform: `translate(var(--RazethSelectField-label-offset-x, ${START_ADORNMENT_WIDTH}px), var(--RazethSelectField-label-offset-y-medium, 16px)) scale(1)`,
    },
});

const StartAdornmentRoot = styled(InputAdornment, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})({});

export function SelectField(inProps: SelectFieldProps) {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const {
    name,
    label,
    options,
    placeholder = "Choose an option",
    helperText,
    defaultValue = "",
    required = false,
    disabled = false,
    fullWidth = true,
    size = "small",
    variant = "outlined",
    margin = "dense",
    iconStart,
    rules,
    className,
  } = props;

  const { direction } = useTheme();

  const labelId = useId();

  const { control, clearErrors } = useFormContext();

  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => {
        const value = typeof field.value === "string" ? field.value : "";

        const shouldShrink = focused || value.length > 0;

        return (
          <Root
            fullWidth={fullWidth}
            size={size}
            variant={variant}
            margin={margin}
            disabled={disabled}
            error={Boolean(fieldState.error)}
            required={required}
            className={className}
            data-start-icon={iconStart ? "true" : "false"}
            data-label-shrunk={shouldShrink ? "true" : "false"}
            data-size={size}
          >
            <InputLabel id={labelId} required={required} shrink={shouldShrink}>
              {label}
            </InputLabel>

            <Select<string>
              name={field.name}
              inputRef={field.ref}
              labelId={labelId}
              label={label}
              value={value}
              startAdornment={
                iconStart ? (
                  <StartAdornmentRoot position="start">
                    {iconStart}
                  </StartAdornmentRoot>
                ) : undefined
              }
              MenuProps={{
                /**
                 * Select's Menu is portaled.
                 *
                 * Preserve our 6F.7 RTL contract.
                 */
                dir: direction,
              }}
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                setFocused(false);

                field.onBlur();
              }}
              onChange={(event) => {
                field.onChange(event.target.value);

                clearErrors(name);
              }}
            >
              <MenuItem value="">{placeholder}</MenuItem>

              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>
              <InputHelperText
                helperText={helperText}
                error={fieldState.error?.message}
              />
            </FormHelperText>
          </Root>
        );
      }}
    />
  );
}

export default SelectField;
