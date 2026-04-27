import axios from "axios";
import statusCode from "http-status-codes";
import { debounce } from "es-toolkit/function";
import { ValidationState, PasswordResult } from "@/interfaces/auth.interface";
import lazyZxcvbn from "@/utils/lazyZxcvbn";
import { zxcvbnAsync } from "@zxcvbn-ts/core";
import { isEmpty } from "es-toolkit/compat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
let zxcvbnAsyncFn: typeof zxcvbnAsync | null = null;
let controller: AbortController | null = null;

// Factory to create a unique debounced validator per field
export const createAsyncValidator = (source: string, debounceDelay = 500) => {
  //   let controller: AbortController | null = null;

  const validator = debounce(
    async (value: string, onResult: (res: ValidationState) => void) => {
      // 1. Setup AbortController
      if (controller) controller.abort();
      controller = new AbortController();

      onResult({ message: "Checking...", status: "loading" });

      try {
        const { data } = await axios.get(
          `${API_URL}/validate/${source}/${value}`,
          {
            signal: controller.signal,
          },
        );

        const { status, message } = data;

        onResult(
          status === statusCode.OK
            ? { message: message || "Available", status: "success" }
            : { message: message || "Invalid", status: "error" },
        );
      } catch (e) {
        if (axios.isCancel(e)) return;
        onResult({
          message:
            statusCode.getStatusText(statusCode.SERVICE_UNAVAILABLE) ||
            "Validation service unavailable",
          status: "error",
        });
      } finally {
        controller = null;
      }
    },
    debounceDelay,
  );

  return {
    validate: validator,
    cancel: () => {
      validator.cancel();
      if (controller) controller.abort();
    },
  };
};

export const createPasswordValidator = (
  //   source: string,
  debounceDelay = 500,
  threshold = 3,
) => {
  // Debounce the heavy zxcvbn calculation
  const checkStrength = debounce(
    async (value: string, onResult: (res: PasswordResult) => void) => {
      //   // 1. Lazy load zxcvbn if not already loaded
      //   if (!zxcvbnAsyncFn) {
      //     zxcvbnAsyncFn = await lazyZxcvbn.loadZxcvbn();
      //   }

      // 1. Setup AbortController for Pwned check
      if (controller) controller.abort();
      controller = new AbortController();
      try {
        // 2. Lazy load zxcvbn if not already loaded
        // zxcvbn-ts accepts a signal in the options or global fetch override
        // but the pwned matcher specifically uses the global fetch
        if (!zxcvbnAsyncFn) {
          // Pass the controller signal to the lazy loader fetch wrapper
          zxcvbnAsyncFn = await lazyZxcvbn.loadZxcvbn(controller.signal);
        }

        const result = await zxcvbnAsyncFn(value);
        const warningMsg = result.feedback.warning;
        const suggestMsg = result.feedback.suggestions.join(" ");
        const score = result.score;

        // Check if any match came from the 'pwned' matcher
        const pwnedMatch = result.sequence.find((m) => m.pattern === "pwned");
        const isPwned = !!pwnedMatch;
        const isWeak = score < threshold || isPwned; // Adjust threshold (e.g., require score >= 3)
        onResult({
          score,
          isPwned,
          message: isWeak
            ? suggestMsg
            : (warningMsg ?? "").concat(` ${suggestMsg}`).trim(),
          status: isWeak ? "error" : "success",
        });
      } catch (e: any) {
        if (e.name === "AbortError") return;
        onResult({
          score: 0,
          isPwned: false,
          message: "Strength check failed",
          status: "error",
        });
      }
    },
    debounceDelay,
  );

  const validator = (
    value: string,
    source: string,
    onResult: (res: PasswordResult) => void,
  ) => {
    // 1.  --- SYNCHRONOUS CHECK 1: Empty Value ---
    if (isEmpty(value.trim())) {
      checkStrength.cancel();
      return onResult({
        score: 0,
        isPwned: false,
        message: "",
        warning: `${source} is required`,
        status: "error",
      });
    }

    // 2. --- SYNCHRONOUS CHECK 2: Regex Policy (If fails, STOP HERE) ---
    if (!PASSWORD_REGEX.test(value)) {
      checkStrength.cancel();
      return onResult({
        score: 0,
        isPwned: false,
        message: `${source} must be at least 10 characters, include uppercase, lowercase, number, and special character!`,
        warning: `${source} has invalid format`,
        status: "error",
      });
    }

    // 3. --- ASYNCHRONOUS CHECK 3: Strength (zxcvbn) ---
    onResult({
      score: 0,
      isPwned: false,
      message: `Analyzing ${source}...`,
      status: "loading",
    });
    checkStrength(value, onResult);
  };

  return {
    validate: validator,
    match: matchValidator,
    cancel: () => {
      checkStrength.cancel();
      if (controller) controller.abort();
    },
  };
};

export const matchValidator = (value: string, matchValue: string) => {
  // Case 1: Both fields empty → no error
  if (isEmpty(value.trim()) && isEmpty(matchValue.trim())) {
    return { message: "", status: "idle" };
  }

  // Case 2: password empty, rePassword not empty → notmatch error
  if (isEmpty(value.trim()) && !isEmpty(matchValue.trim())) {
    return { message: "Passwords do not match", status: "error" };
  }

  // Case 3: password not empty, rePassword empty → required error
  if (!isEmpty(value.trim()) && isEmpty(matchValue.trim())) {
    return { message: "Confirm password is required", status: "error" };
  }

  // Case 4: password not empty, rePassword not empty, don’t match → notmatch error
  if (!isEmpty(value.trim()) && !isEmpty(matchValue.trim())) {
    const message = value !== matchValue ? "Passwords do not match" : ""; // Both match → no error
    return { message, status: message ? "error" : "idle" };
  }

  // Fallback (shouldn’t be reached due to exhaustive checks)
  return { message: "", status: "idle" };
};
