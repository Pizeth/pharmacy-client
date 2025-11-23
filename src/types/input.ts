import { TextFieldProps } from "@mui/material";
import { Validator } from "ra-core";
import { ReactNode } from "react";
import { UseControllerProps, UseControllerReturn } from "react-hook-form";

export type InputProps<ValueType = any> = Omit<
  UseControllerProps,
  "name" | "defaultValue" | "rules"
> &
  Partial<UseControllerReturn> & {
    alwaysOn?: any;
    defaultValue?: any;
    format?: (value: ValueType) => any;
    id?: string;
    isRequired?: boolean;
    label?: ReactNode;
    helperText?: ReactNode;
    name?: string;
    onBlur?: (...event: any[]) => void;
    onChange?: (...event: any[]) => void;
    parse?: (value: any) => ValueType;
    type?: string;
    resource?: string;
    source: string;
    validate?: Validator | Validator[];
    readOnly?: boolean;
    disabled?: boolean;
  };

export type CommonInputProps = InputProps & {
  cellClassName?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  headerCellClassName?: string;
  margin?: "none" | "dense" | "normal";
  readOnly?: boolean;
  variant?: "standard" | "outlined" | "filled";
};

interface Props {
  clearAlwaysVisible?: boolean;
  resettable?: boolean;
  readOnly?: boolean;
}

export type ResettableTextFieldProps = Props &
  Omit<
    TextFieldProps,
    "onChange" | "onPointerEnterCapture" | "onPointerLeaveCapture"
  > & {
    onChange?: (eventOrValue: any) => void;
  };

export type TextInputProps = CommonInputProps &
  Omit<ResettableTextFieldProps, "label" | "helperText">;

export interface PasswordInputProps extends TextInputProps {
  initiallyVisible?: boolean;
}
