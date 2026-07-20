import { isValidElement } from "react";
import { useTranslate } from "ra-core";
import { InputHelperTextProps, ValidationError } from "react-admin";

export interface InputHelperProps extends InputHelperTextProps {
  // helperText?: React.ReactNode;
  // error?: ValidationErrorMessage;
  // error?: string;
  success?: string;
}

export const InputHelper = (props: InputHelperProps) => {
  const { helperText, error, success } = props;
  const translate = useTranslate();

  if (error) {
    return <ValidationError error={error} />;
  }

  if (success) {
    return <span>{success}</span>;
  }

  // if (error) {
  //   return <span style={{ color: "inherit" }}>{error}</span>; // uses your existing error color via formHelperText sx
  // }

  if (helperText === false) {
    return null;
  }

  if (isValidElement(helperText)) {
    return helperText;
  }

  if (typeof helperText === "string") {
    return <>{translate(helperText, { _: helperText })}</>;
  }

  // Material UI's HelperText cannot reserve space unless we pass a single
  // space as child, which isn't possible when the child is a component.
  // Therefore, we must reserve the space ourselves by passing the same
  // markup as Material UI.
  // @see https://github.com/mui/material-ui/blob/62e439b7022d519ab638d65201e204b59b77f8da/packages/material-ui/src/FormHelperText/FormHelperText.js#L85-L90
  return <span dangerouslySetInnerHTML={defaultInnerHTML} />;
};

const defaultInnerHTML = { __html: "&#8203;" };
