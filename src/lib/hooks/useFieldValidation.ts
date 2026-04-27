import { PasswordResult, ValidationState } from "@/interfaces/auth.interface";
import {
  createAsyncValidator,
  createPasswordValidator,
} from "@/services/validation.service";
import { isEmpty } from "es-toolkit/compat";
import { useState, useMemo, useEffect } from "react";
import { StringUtils } from "../utils/string-utils";
import { match } from "node:assert";

export const useFieldValidation = (source: string, debounceDelay = 500) => {
  const [feedback, setFeedback] = useState<ValidationState>({
    message: "",
    status: "idle",
  });

  // useMemo ensures we don't recreate the debounced function/controller on every render
  const validator = useMemo(
    () => createAsyncValidator(source, debounceDelay),
    [source, debounceDelay],
  );

  // Clean up on unmount
  useEffect(() => () => validator.cancel(), [validator]);

  const validate = (value: string) => {
    if (isEmpty(value.trim())) {
      validator.cancel();
      setFeedback({
        message: `${StringUtils.capitalize(source)} is required`,
        status: "required",
      });
      return { feedback, validate }; // Return early if empty
    }
    validator.validate(value, setFeedback);
  };

  return { feedback, validate };
};

export const usePasswordValidation = (
  source: string,
  debounceDelay = 500,
  threshold = 3,
) => {
  const [feedback, setFeedback] = useState<PasswordResult>({
    score: 0,
    isPwned: false,
    message: "",
    warning: "",
    status: "idle",
  });

  const validator = useMemo(
    () => createPasswordValidator(debounceDelay, threshold),
    [debounceDelay, threshold],
  );

  // Clean up on unmount
  useEffect(() => () => validator.cancel(), [validator]);

  return {
    feedback,
    checkStrength: (value: string) =>
      validator.validate(value, source, setFeedback),
    checkMatch: (values: string, matchValue: string) =>
      validator.match(values, matchValue),
  };
};
