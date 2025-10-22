/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import statusCode from "http-status-codes";

// type FieldError = {
//   error?: boolean;
//   message?: string;
// };

// const API_URL = import.meta.env.VITE_API_URL;

// export const ServerValidator = (
//   value: string | undefined,
//   resource: string,
// ): FieldError | null => {
//   const [error, setMsg] = useState<FieldError | null>(null);
//   useEffect(() => {
//     const validateUsername = async () => {
//       if (!value) return;
//       try {
//         const response = await axios.get<any>(
//           `${API_URL}/${resource}/${value}`,
//         );
//         const data = response.data;
//         if (data) {
//           const res: FieldError = {
//             error:
//               statusCode.getStatusCode(data.status) === statusCode.OK
//                 ? false
//                 : true,
//             message: data.message || null,
//           };
//           setMsg(res || null);
//         } else {
//           setMsg(null);
//         }
//       } catch (error) {
//         console.error(error);
//         setMsg({
//           error: true,
//           message: "An error occurred while validating the field!",
//         });
//       }
//     };

//     validateUsername();
//   }, [value, resource]);

//   return error;
// };

// export default ServerValidator;

import axios, { CancelTokenSource } from "axios";
import statusCode from "http-status-codes";
import StringUtils from "./utils";
import zxcvbn from "./lazyZxcvbn";
import {
  InputProps,
  isEmpty,
  // Translate,
  // useResourceContext,
  useTranslateLabel,
} from "react-admin";
import {
  AsyncValidationErrorMessage,
  DEFAULT_DEBOUNCE,
  FieldError,
  IconTextInputProps,
  Memoize,
  UseFieldOptions,
  zxcvbnFeedBack,
} from "@/types/Types";

import lodashMemoize from "lodash/memoize";
import MsgUtils from "./msgUtils";
import { useCallback, useRef, useState } from "react";
import { merge } from "lodash";

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = process.env.API_URL;

export const useAsyncValidator = (
  setMessage: (update: { source: string; message: string }) => void,
  clearMessage: (source: string) => void,
  options?: UseFieldOptions
) => {
  // const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const cancelTokenRef = useRef<CancelTokenSource | undefined>(undefined);
  // const [successMessage, setSuccessMessage] = useState("");
  // const lastValueRef = useRef<string>("");
  const currentValidationId = useRef(0);

  // if (!resource) {
  //   throw new Error("useAsync: missing resource prop or context");
  // }

  const validate = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          debounce: DEFAULT_DEBOUNCE,
          message: "razeth.validation.required",
        },
        options,
        callTimeOptions
      );

      return Object.assign(
        (value: any, allValues: any, props: IconTextInputProps) => {
          const { source, label } = props;
          const args = {
            source,
            value,
            // field: { label, source },
            field: translateLabel({
              label: label,
              source,
            }),
          };

          if (isEmpty(value)) {
            return Object.assign(
              MsgUtils.getMessage(message, args, value, allValues),
              { isRequired: true },
              { status: statusCode.ACCEPTED }
            );
          }

          // Clear previous validation
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("New validation started");
          }

          // Generate new validation ID
          const validationId = ++currentValidationId.current;

          return new Promise<AsyncValidationErrorMessage | undefined>(
            (resolve) => {
              timeoutRef.current = setTimeout(async () => {
                // Only process if still the latest validation
                if (validationId !== currentValidationId.current) {
                  resolve(undefined);
                  return;
                }
                // if (value === lastValueRef.current) return;
                // lastValueRef.current = value;

                try {
                  cancelTokenRef.current = axios.CancelToken.source();
                  const response = await axios.get(
                    `${API_URL}/validate/${source}/${value}`,
                    {
                      cancelToken: cancelTokenRef.current.token,
                    }
                  );

                  const data = response.data;
                  const status = statusCode.getStatusCode(data.status);

                  // Proper success case handling
                  if (status === statusCode.OK) {
                    setMessage({ source, message: data.message });
                    resolve(undefined); // ✅ Clear errors automatically
                  } else {
                    clearMessage(source);
                    resolve(MsgUtils.setMsg(data.message, args, status));
                  }
                } catch (error) {
                  if (!axios.isCancel(error)) {
                    clearMessage(source);
                    resolve(
                      MsgUtils.setMsg(
                        "razeth.validation.async",
                        args,
                        statusCode.INTERNAL_SERVER_ERROR
                      )
                    );
                  } else {
                    resolve(undefined); // Canceled request, no error
                  }
                }
              }, interval ?? DEFAULT_DEBOUNCE);
            }
          );
        },
        { isRequired: true }
      );
    },
    [clearMessage, options, setMessage, translateLabel]
  );

  return validate;
};

export const asyncValidator = memoize(
  (resource: string, message = "razeth.validation.async") =>
    async (value: string): Promise<FieldError> => {
      const field = StringUtils.capitalize(
        StringUtils.getLastSegment(resource)
      );
      if (!value) {
        return {
          invalid: true,
          // message: `${StringUtils.capitalize(field)} is required!`,
          message: MsgUtils.setMsg("razeth.validation.required", {
            value,
            field: field,
          }),
        };
      }

      try {
        const response = await axios.get<any>(
          `${API_URL}/${resource}/${value}`
        );
        const data = response.data;
        const status = statusCode.getStatusCode(data.status);
        return {
          invalid: status !== statusCode.OK,
          message: MsgUtils.setMsg(data.message || message, {
            value,
            endPoint: resource,
            status: status,
          }),
        };
      } catch (error) {
        console.error(error);
        return {
          invalid: true,
          message: MsgUtils.setMsg("razeth.validation.async", { error, field }),
        };
      }
    }
);

export const serverValidator = async (
  value: string | undefined,
  resource: string,
  message = "razeth.validation.async"
): Promise<FieldError> => {
  const field = StringUtils.capitalize(StringUtils.getLastSegment(resource));
  if (!value) {
    return {
      invalid: true,
      // message: `${StringUtils.capitalize(field)} is required!`,
      message: MsgUtils.setMsg("razeth.validation.required", {
        value,
        field: field,
      }),
    };
  }

  try {
    const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
    const data = response.data;
    const status = statusCode.getStatusCode(data.status);
    return {
      invalid: status !== statusCode.OK,
      message: MsgUtils.setMsg(data.message || message, {
        value,
        endPoint: resource,
        status: status,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      invalid: true,
      message: MsgUtils.setMsg("razeth.validation.async", { error, field }),
    };
  }
};

// export const validateStrength = async (value: string) => {
//   if (!value) return { invalid: false };

//   const result = await zxcvbnAsync(value);
//   return {
//     invalid: result.score <= 2, // Example threshold
//     message: "razeth.validation.strength",
//     args: {
//       strength: result.score,
//       warning: result.feedback.warning,
//     },
//   };
// };

export const usePasswordValidator = (options?: UseFieldOptions) => {
  const translateLabel = useTranslateLabel();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const cancelTokenRef = useRef<CancelTokenSource | undefined>(undefined);
  const currentValidationId = useRef(0);

  const [result, setResult] = useState<zxcvbnFeedBack>({
    score: 0,
    feedbackMsg: "",
  });

  const passwordValidator = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          debounce: DEFAULT_DEBOUNCE,
          message: "razeth.validation.required",
        },
        options,
        callTimeOptions
      );

      // Define the regex for policy enforcement
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

      return Object.assign(
        (value: any, allValues: any, props: IconTextInputProps) => {
          const { source, label } = props;
          const args = {
            source,
            value,
            field: translateLabel({
              label: label,
              source,
            }),
          };

          // --- SYNCHRONOUS CHECK 1: Empty Value ---
          if (isEmpty(value)) {
            setResult({
              score: 0,
              feedbackMsg: "",
            });
            // Return a synchronous error (string or error object)
            return MsgUtils.getMessage(message, args, value, allValues);
            // return Object.assign(
            //   MsgUtils.getMessage(message, args, value, allValues),
            //   { isRequired: true },
            //   { status: statusCode.ACCEPTED },
            // );
          }

          // --- SYNCHRONOUS CHECK 2: Regex Test (If fails, STOP HERE) ---
          if (!regex.test(value)) {
            // Clear previous validation since we're returning sync error
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (cancelTokenRef.current) {
              cancelTokenRef.current.cancel(
                "New validation started - Sync Fail"
              );
            }

            // Provide immediate feedback for regex failure
            setResult({
              score: 0,
              feedbackMsg: String(
                translateLabel({
                  label: "razeth.feedback.password",
                  source,
                }) ?? ""
              ),
            });
            // Return a synchronous error (string or error object)
            return MsgUtils.setMsg("razeth.validation.password", args);
          }

          // --- ASYNCHRONOUS CHECK 3: Passed sync checks, now do debounced check ---
          // If we get here, the password is syntactically valid and we
          // can proceed with the debounced async strength check.

          // Clear previous validation
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("New validation started");
          }

          // Generate new validation ID
          const validationId = ++currentValidationId.current;

          return new Promise<AsyncValidationErrorMessage | undefined>(
            (resolve) => {
              // Step 1: Check regex immediately
              // if (!regex.test(value)) {
              //   setResult({
              //     score: 0,
              //     feedbackMsg: String(
              //       translateLabel({
              //         label: "razeth.feedback.password",
              //         source,
              //       }) ?? ""
              //     ),
              //   });
              //   resolve(MsgUtils.setMsg("razeth.validation.password", args));
              //   return;
              // }

              // Step 2: If regex passes, proceed with debounced zxcvbn check
              timeoutRef.current = setTimeout(async () => {
                // Only process if still the latest validation
                if (validationId !== currentValidationId.current) {
                  resolve(undefined);
                  return;
                }

                try {
                  cancelTokenRef.current = axios.CancelToken.source();
                  const result = await zxcvbnAsync(value);
                  const warningMsg = result.feedback.warning;
                  const suggestMsg = result.feedback.suggestions.join(" ");
                  const score = result.score;
                  const invalid = score < 3; // Adjust threshold (e.g., require score >= 3)

                  // Adjust threshold as needed
                  if (invalid) {
                    resolve(
                      MsgUtils.setMsg(
                        warningMsg || "razeth.feedback.weak",
                        args
                      )
                    );
                  } else {
                    resolve(undefined);
                  }
                  // Set state only after the promise has successfully resolved its value
                  setResult({
                    score,
                    feedbackMsg: invalid
                      ? suggestMsg
                      : (warningMsg ?? "").concat(` ${suggestMsg}`),
                  });
                } catch (error) {
                  console.error(error);
                  resolve(
                    MsgUtils.setMsg(
                      "razeth.validation.async",
                      args,
                      statusCode.INTERNAL_SERVER_ERROR
                    )
                  );
                  // Ensure state reflects error on failure
                  setResult({ score: 0, feedbackMsg: "Validation failed" });
                }
              }, interval ?? DEFAULT_DEBOUNCE);
            }
          );
        },
        { isRequired: true }
      );
    },
    [options, translateLabel]
  );

  return { passwordValidator, result };
};

export const validateStrength = async (
  value: string,
  message = "razeth.validation.notmatch"
) => {
  if (!value)
    return {
      message: "Required",
      feedbackMsg: "",
      score: 0,
      invalid: false,
      args: { password: "" },
    };
  const result = await zxcvbnAsync(value);
  const warningMsg = result.feedback.warning;
  const suggestMsg = result.feedback.suggestions.join(" ");
  const score = result.score;
  const invalid = score <= 0; // Adjust threshold as needed

  if (invalid) {
    return {
      message: warningMsg || message,
      feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
      score: score,
      invalid: invalid,
      args: {
        password: StringUtils.truncate(value, 5),
        strength: result.score,
        warning: result.feedback.warning,
      },
    };
  }
  return {
    message: undefined,
    feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
    score: score,
    invalid: invalid,
    args: {
      password: StringUtils.truncate(value, 5),
      strength: result.score,
      warning: result.feedback.warning,
    },
  }; // No error
};

// export const required = memoize((message = "ra.validation.required") =>
//   Object.assign(
//     (value, values) =>
//       isEmpty(value)
//         ? getMessage(message, undefined, value, values)
//         : undefined,
//     { isRequired: true },
//   ),
// );

export const useMatchPassword = (
  message = ["razeth.validation.notmatch", "razeth.validation.required"]
) => {
  const translateLabel = useTranslateLabel();

  const validateField = (resource?: string) =>
    Object.assign(
      (value: string, values: any, props: IconTextInputProps) => {
        // Case 1: Both fields empty → no error
        if (isEmpty(value) && isEmpty(values.password)) {
          return undefined;
        }

        // Case 2: password empty, rePassword not empty → notmatch error
        if (isEmpty(values.password) && !isEmpty(value)) {
          return MsgUtils.getMessage(message[0], { undefined }, value, values); // "notmatch"
        }

        // Case 3: password not empty, rePassword empty → required error
        if (!isEmpty(values.password) && isEmpty(value)) {
          console.log("rePassword empty");
          return MsgUtils.getMessage(
            message[1],
            {
              source: props.source,
              value,
              field: translateLabel({
                label: props.label,
                source: props.source,
                resource,
              }),
            },
            value,
            values
          ); // "required"
        }

        // Case 4: Both not empty
        if (!isEmpty(values.password) && !isEmpty(value)) {
          if (value !== values.password) {
            return MsgUtils.getMessage(
              message[0],
              { undefined },
              value,
              values
            ); // "notmatch"
          }
          return undefined; // Both match → no error
        }

        // Fallback (shouldn’t be reached due to exhaustive checks)
        return undefined;
      },
      { isRequired: true }
    );

  return validateField;
};

export const useMatchPassword11 = (
  message = ["razeth.validation.notmatch", "razeth.validation.required"]
) => {
  const translateLabel = useTranslateLabel();

  const validateField = (resource?: string) =>
    Object.assign(
      (value: string, values: any, props: IconTextInputProps) =>
        isEmpty(values.password) && isEmpty(value)
          ? undefined // Both empty
          : isEmpty(values.password) && !isEmpty(value)
          ? MsgUtils.getMessage(message[0], { undefined }, value, values) // Password empty, rePassword not empty
          : !isEmpty(values.password) && isEmpty(value)
          ? MsgUtils.getMessage(
              message[1],
              {
                source: props.source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: props.source,
                  resource,
                }),
              },
              value,
              values
            ) // Password not empty, rePassword empty
          : value !== values.password
          ? MsgUtils.getMessage(message[0], { undefined }, value, values) // Both not empty, don’t match
          : undefined, // Both not empty, match
      { isRequired: true }
    );

  return validateField;
};

export const useMatchPassword1 = (
  message = ["razeth.validation.notmatch", "razeth.validation.required"]
) => {
  const translateLabel = useTranslateLabel();
  const validateField = (resource?: string) =>
    Object.assign(
      (value: string, values: any, props: IconTextInputProps) =>
        isEmpty(value) && !isEmpty(values.password)
          ? MsgUtils.getMessage(
              message[1],
              {
                source: props.source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: props.source,
                  resource,
                }),
              },
              value,
              values
            )
          : value !== values.password
          ? MsgUtils.getMessage(message[0], { undefined }, value, values)
          : undefined,
      { isRequired: true }
    );
  return validateField;
};

export const matchPassword = memoize(
  (passwordValue: string, message = "razeth.validation.notmatch") =>
    (value: string, values: any) =>
      value !== passwordValue
        ? MsgUtils.getMessage(message, { passwordValue }, value, values)
        : undefined
);

/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
export const useRequired = (
  // options?: UseFieldOptions,
  // translate?: Translate,
  message = "razeth.validation.required"
) => {
  const translateLabel = useTranslateLabel();
  // const resource = useResourceContext(options);
  // if (!resource) {
  //   throw new Error("useField: missing resource prop or context");
  // }

  const validateField = (resource?: string) => {
    // return (value: any, allValues: any, props: InputProps) => {
    //   if (isEmpty(value)) return undefined;
    //   return {
    //     message,
    //     args: {
    //       source: props.source,
    //       value,
    //       field: translateLabel({
    //         label: props.label,
    //         source: props.source,
    //         resource,
    //       }),
    //     },
    //     isRequired: true,
    //   };
    // };

    return Object.assign(
      (value: any, values: any, props: InputProps) =>
        isEmpty(value)
          ? MsgUtils.getMessage(
              message,
              {
                source: props.source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: props.source,
                  resource,
                }),
              },
              value,
              values
            )
          : undefined, // Return undefined if the value is not empty
      { isRequired: true }
    );
  };

  return validateField;
};

// const getMessage = (
//   message: string, // Now always a translation key
//   messageArgs: any,
//   translate: (key: string, options?: any) => string, // Add translate function as a parameter
// ) => {
//   return translate(message, messageArgs); // Always translate
// };

const validators = { serverValidator, validateStrength };
export default validators;
