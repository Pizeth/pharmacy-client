import { InputHelperTextProps } from "@/interfaces/component-props.interface";
import { useTranslate } from "@refinedev/core";
import { isValidElement } from "react";

export const InputHelperText = (props: InputHelperTextProps) => {
  const { helperText, error, success } = props;
  const translate = useTranslate();

  if (error) {
    // return <> {typeof error === "string" ? error : error.message} </>;
    const message = typeof error === "string" ? error : error.message;
    const args = typeof error === "string" ? undefined : error.args;
    return <>{translate(message, { ...args, _: message })}</>;
  }

  if (success) {
    // return <span>{success}</span>;
    return <>{translate(success, { _: success })}</>;
  }

  if (helperText === false) {
    return null;
  }

  if (isValidElement(helperText)) {
    return helperText;
  }

  if (typeof helperText === "string" && helperText.length > 0) {
    // return <>{helperText}</>;
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
