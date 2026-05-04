import { PasswordResult, ValidationState } from "@/interfaces/auth.interface";
import {
  createAsyncValidator,
  createPasswordValidator,
  matchValidator,
} from "@/services/validation.service";
import { isEmpty } from "es-toolkit/compat";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { StringUtils } from "../utils/string-utils";
import { FieldStatus } from "@/types/auth";
import {
  UseAsyncFieldValidationOptions,
  UseMatchPasswordOptions,
  UsePasswordValidationOptions,
} from "@/interfaces/component-props.interface";
import { useFieldMachine } from "./useFieldMachine";
import { getCached, setCached } from "@/caches/validationCache";

// ─── Async field validation (username / email uniqueness etc.) ────────────────

/**
 * UI-facing hook — tracks ValidationState for a helper text indicator.
 * Designed for non-RHF usage (e.g. a search box).
 * For RHF fields use `useAsyncFieldRule` instead.
 */
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

  const validate = useCallback(
    (value: string) => {
      if (isEmpty(value.trim())) {
        validator.cancel();
        setFeedback({
          message: `${StringUtils.capitalize(source)} is required`,
          status: "required",
        });
        // return { feedback, validate }; // Return early if empty
        return; // ← BUG FIX: was missing, causing fall-through to validator.validate
      }
      validator.validate(value, setFeedback);
    },
    [validator, setFeedback, source],
  );

  return { feedback, validate };
};

/**
 * RHF-compatible rule: returns a Promise<string | true> suitable for use in
 * Controller `rules.validate`.
 *
 * Usage:
 *   const asyncRule = useAsyncFieldRule("username");
 *   <TextField name="username" rules={{ validate: asyncRule }} />
 */
export const useAsyncFieldRule = (source: string, debounceDelay = 500) => {
  const [status, setStatus] = useState<FieldStatus>("idle");

  const validator = useMemo(
    () => createAsyncValidator(source, debounceDelay),
    [source, debounceDelay],
  );

  useEffect(() => () => validator.cancel(), [validator]);

  const validate = useCallback(
    (value: string): Promise<string | boolean> => {
      if (isEmpty(value?.trim() ?? "")) {
        setStatus("idle");
        validator.cancel();
        return Promise.resolve(`${StringUtils.capitalize(source)} is required`);
      }

      setStatus("typing");
      // Wrap the callback-based validator in a Promise.
      // We only resolve once we receive a terminal (non-loading) status so
      // RHF's isValidating flag stays true for the full async duration.
      return new Promise<string | boolean>((resolve) => {
        // validator.validate(value, (result) => {
        //   if (result.status !== "loading") {
        //     resolve(
        //       result.status === "success"
        //         ? true
        //         : result.message || "Validation failed",
        //     );
        //   }
        // });

        validator.validate(value, (result) => {
          // "loading" → still in-flight, do not resolve yet
          // "cancelled" → superseded by a newer keystroke, resolve clean so
          //               RHF's isValidating clears; the next call will validate
          if (result.status === "loading") {
            setStatus("validating");
            return;
          }

          if (result.status === "cancelled") {
            resolve(true);
            return;
          }

          if (result.status === "success") {
            setStatus("valid");
            resolve(true);
          } else {
            setStatus("error");
            resolve(result.message);
          }

          // resolve(
          //   result.status === "success"
          //     ? true
          //     : result.message || "Validation failed",
          // );
        });
      });
    },
    [validator, source],
  );

  return { validate, status };
};

/**
 * Watches `value` and runs an async uniqueness/availability check against
 * the API, writing results directly into RHF error state.
 *
 * Works even when `useForm` has a resolver — `rules.validate` is bypassed
 * by the resolver so this side-effect channel is the only reliable option.
 */
export const useAsyncFieldValidation = ({
  name,
  value,
  setError,
  clearErrors,
  debounceDelay = 500,
  enabled = true,
}: UseAsyncFieldValidationOptions) => {
  // Stable validator instance across renders
  const validatorRef = useRef(createAsyncValidator(name, debounceDelay));
  // const machine = useFieldMachine();

  // Cancel + teardown on unmount
  useEffect(() => {
    const v = validatorRef.current;
    return () => v.cancel();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // 1. Check if we already have an error for this field to avoid redundant sets
    // You might need to pass fieldState.error into this hook
    if (isEmpty(value?.trim() ?? "")) {
      validatorRef.current.cancel();
      clearErrors(name);
      // machine.reset();
      return;
    }

    // machine.setTyping();

    // 🔥 CACHE HIT
    const cached = getCached(name, value);
    if (cached) {
      if (cached.status === "success") {
        // ✅ Only clear if there is currently an error
        clearErrors(name);
        // machine.setValid();
      } else {
        // ✅ Only set if the message is different from the current one
        setError(name, { type: "async", message: cached.message });
        // machine.setError();
      }
      return;
    }

    // machine.setValidating();

    validatorRef.current.validate(value, (result) => {
      if (result.status === "loading") return; // wait for terminal state
      if ((result.status as string) === "cancelled") return; // superseded

      // 🔥 STORE CACHE
      setCached(name, value, result);

      if (result.status === "success") {
        clearErrors(name);
        // machine.setValid();
      } else {
        setError(name, {
          type: "async",
          message: result.message || "Validation failed",
        });
        // machine.setError();
      }
    });
  }, [value, enabled, name, setError, clearErrors]);
};

// ─── Password validation ──────────────────────────────────────────────────────

/**
 * Manages password strength state and exposes RHF-compatible rules.
 *
 * `feedback`      — PasswordResult, drives the PasswordStrengthMeter
 * `strengthRule`  — async RHF validate rule; also updates `feedback` in
 *                   real time (including the loading / "Analyzing…" state)
 * `matchRule`     — synchronous RHF validate rule for a confirm-password field
 */
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

  /** Call in onChange to update the strength meter independently of RHF */
  const checkStrength = useCallback(
    (value: string) => validator.validate(value, source, setFeedback),
    [validator, source],
  );

  /** Synchronous match check — use directly in `rules.validate` */
  const checkMatch = useCallback(
    (value: string, matchValue: string) => matchValidator(value, matchValue),
    [],
  );

  /**
   * RHF-compatible async strength rule.
   *
   * ✅ Calls setFeedback for EVERY result including the "loading" state so the
   *    strength meter shows "Analyzing…" while zxcvbn is running.
   * ✅ Resolves the Promise only on terminal states so RHF's isValidating flag
   *    stays true for the full async duration.
   * ✅ Resolves `true` (no error) for "cancelled" so RHF doesn't get stuck
   *    when a request is superseded by a newer keystroke.
   */
  const strengthRule = useCallback(
    (value: string): Promise<string | boolean> => {
      return new Promise<string | boolean>((resolve) => {
        validator.validate(value, source, (result) => {
          // if (result.status !== "loading") {
          //   setFeedback(result);
          //   resolve(
          //     result.status === "success"
          //       ? true
          //       : result.warning || result.message || "Password is too weak",
          //   );
          // }

          // ✅ Always update the meter, including during the loading phase
          setFeedback(result);

          if (result.status === "loading") return; // still in-flight

          if (result.status === "cancelled") {
            resolve(true); // superseded — next call will validate properly
            return;
          }

          resolve(
            result.status === "success"
              ? true
              : result.warning || result.message || "Password is too weak",
          );
        });
      });
    },
    [validator, source],
  );

  /**
   * RHF-compatible synchronous match rule for confirm-password.
   *
   * Usage:
   *   const { matchRule } = usePasswordValidation("confirmPassword");
   *   <PasswordField
   *     name="confirmPassword"
   *     rules={{ validate: (v) => matchRule(v, watch("password")) }}
   *   />
   */
  const matchRule = useCallback(
    (value: string, passwordValue: string): string | boolean => {
      const result = matchValidator(value, passwordValue);
      return result.status === "error" ? result.message : true;
    },
    [],
  );

  return { feedback, checkStrength, checkMatch, strengthRule, matchRule };

  // return {
  //   feedback,
  //   checkStrength: (value: string) =>
  //     validator.validate(value, source, setFeedback),
  //   checkMatch: (values: string, matchValue: string) =>
  //     validator.match(values, matchValue),
  // };
};

/**
 * Same pattern as useAsyncFieldValidation but for password strength (zxcvbn).
 * Returns `feedback` for driving the PasswordStrengthMeter.
 */
export const usePasswordStrengthValidation = ({
  name,
  value,
  setError,
  clearErrors,
  debounceDelay = 500,
  threshold = 3,
  enabled = true,
}: UsePasswordValidationOptions) => {
  const [feedback, setFeedback] = useState<PasswordResult>({
    score: 0,
    isPwned: false,
    message: "",
    warning: "",
    status: "idle",
  });

  // Stable validator instance across renders
  const validatorRef = useRef(
    createPasswordValidator(debounceDelay, threshold),
  );
  // const machine = useFieldMachine();

  // Cancel + teardown on unmount
  useEffect(() => {
    const v = validatorRef.current;
    return () => v.cancel();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (isEmpty(value?.trim() ?? "")) {
      validatorRef.current.cancel();
      clearErrors(name);
      setFeedback({
        score: 0,
        isPwned: false,
        message: "",
        warning: "",
        status: "idle",
      });
      // machine.reset();
      return;
    }

    // machine.setTyping();

    validatorRef.current.validate(value, name, (result) => {
      // Always update the meter — including the loading / "Analyzing…" state
      setFeedback(result);
      // machine.setValidating();

      const isWeak = result.status === "error";

      // ❗ DO NOT rely on RHF for strength blocking
      // only use it for UI unless you explicitly want blocking

      // if (isWeak) {
      //   setError(name, {
      //     type: "strength",
      //     message: result.warning || result.message,
      //   });
      // } else {
      //   clearErrors(name);
      // }

      if (result.status === "loading") return;
      if ((result.status as string) === "cancelled") return;

      if (result.status === "success") {
        clearErrors(name);
      } else {
        setError(name, {
          type: "async",
          message: result.warning || result.message || "Password is too weak",
        });
        // machine.setError();
      }
    });
  }, [value, enabled, setError, clearErrors]);

  return { feedback };
};

/**
 * Synchronously validates that `value` matches `matchValue` and writes
 * the result into RHF error state.
 * Re-runs whenever either value changes.
 */
export const useMatchPasswordValidation = ({
  name,
  value,
  matchValue,
  setError,
  clearErrors,
  enabled = true,
}: UseMatchPasswordOptions) => {
  const machine = useFieldMachine();
  useEffect(() => {
    if (!enabled) return;

    const result = matchValidator(value, matchValue);
    if (result.status === "error") {
      setError(name, { type: "match", message: result.message });
      machine.setError();
    } else {
      clearErrors(name);
    }
  }, [value, matchValue, enabled, name, setError, clearErrors]);
};
