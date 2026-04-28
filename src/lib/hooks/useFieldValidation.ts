import { PasswordResult, ValidationState } from "@/interfaces/auth.interface";
import {
  createAsyncValidator,
  createPasswordValidator,
  matchValidator,
} from "@/services/validation.service";
import { isEmpty } from "es-toolkit/compat";
import { useState, useMemo, useEffect, useCallback } from "react";
import { StringUtils } from "../utils/string-utils";

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
  const validator = useMemo(
    () => createAsyncValidator(source, debounceDelay),
    [source, debounceDelay],
  );

  console.log("useAsyncFieldRule created for", source); // Debug log
  console.log("Validator instance:", validator); // Debug log

  useEffect(() => () => validator.cancel(), [validator]);

  const validate = useCallback(
    (value: string): Promise<string | boolean> => {
      if (isEmpty(value?.trim() ?? "")) {
        validator.cancel();
        return Promise.resolve(`${StringUtils.capitalize(source)} is required`);
      }

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

        // Wrap the callback-based validator in a Promise.
        // We only resolve once we receive a terminal (non-loading) status so
        // RHF's isValidating flag stays true for the full async duration.
        validator.validate(value, (result) => {
          // "loading" → still in-flight, do not resolve yet
          // "cancelled" → superseded by a newer keystroke, resolve clean so
          //               RHF's isValidating clears; the next call will validate
          if (result.status === "loading") return;
          if (result.status === "cancelled") {
            resolve(true);
            return;
          }
          resolve(
            result.status === "success"
              ? true
              : result.message || "Validation failed",
          );
        });
      });
    },
    [validator, source],
  );

  return validate;
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

  console.log("usePasswordValidation created for", source); // Debug log
  console.log("Validator instance:", validator);

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
