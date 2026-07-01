import axios from "axios";
import statusCode from "http-status-codes";
import { debounce } from "es-toolkit/function";
import { ValidationState, PasswordResult } from "@/interfaces/auth.interface";
import lazyZxcvbn from "@/utils/lazyZxcvbn";
import { ZxcvbnFactory, ZxcvbnResult } from "@zxcvbn-ts/core";
import { isEmpty } from "es-toolkit/compat";
import { API_URL, PASSWORD_REGEX } from "@/types/constants";

// Sentinel status used internally when a request is superseded by a newer one.
// Hooks treat this as "no error yet" and wait for the next resolve.
const CANCELLED = "cancelled" as const;
const DEFAULT_RESULT: PasswordResult = {
  score: 0,
  isPwned: false,
  message: "",
  warning: "",
  status: "idle",
};
const cache = new Map<string, string | true>();

// ─── Async field validator (username / email uniqueness etc.) ─────────────────

// Factory to create a unique debounced validator per field
export const createAsyncValidator = (source: string, debounceDelay = 500) => {
  // ✅ Per-instance controller — the old code had a single module-level
  //    `controller` shared between all validators.  When email and username
  //    validators ran concurrently they aborted each other.
  let controller: AbortController | null = null;

  const validator = debounce(
    async (value: string, onResult: (res: ValidationState) => void) => {
      // 🔥 CACHE HIT
      if (cache.has(value)) {
        const cached = cache.get(value);
        onResult({
          message: cached === true ? "Available" : (cached as string),
          status: cached === true ? "success" : "error",
        });
        return;
      }

      // 1. Setup AbortController
      // Cancel the previous in-flight request (only for THIS validator instance)
      if (controller) controller.abort();
      controller = new AbortController();
      // Capture the signal immediately — `controller` may be reassigned by the
      // time the async operations below complete.
      const { signal } = controller;

      onResult({ message: "Checking...", status: "loading" });
      try {
        const { data } = await axios.get(
          `${API_URL}/validate/${source}/${value}`,
          { signal },
        );

        // Guard: if this request was superseded while awaiting, do nothing.
        // The newer request's callback is responsible for resolving.
        if (signal.aborted) return;

        // console.log("Validation response:", data); // Debug log
        const { status, message } = data;

        // Cache the result for future calls with the same value
        cache.set(
          value,
          status === statusCode.OK ? true : message || "Invalid",
        );

        onResult(
          status === statusCode.OK
            ? { message: message || "Available", status: "success" }
            : { message: message || "Invalid", status: "error" },
        );

        // ✅ DEFER onResult to microtask - prevents setState during render
        // queueMicrotask(() => {
        //   onResult(
        //     status === statusCode.OK
        //       ? { message: message || "Available", status: "success" }
        //       : { message: message || "Invalid", status: "error" },
        //   );
        // });
      } catch (e) {
        // ✅ Always call onResult on abort so the Promise in useAsyncFieldRule
        //    can resolve and RHF's isValidating flag clears.
        if (axios.isCancel(e) || (e as Error)?.name === "AbortError") {
          onResult({ message: "", status: CANCELLED });
          // return;
        }
        onResult({
          message:
            statusCode.getStatusText(statusCode.SERVICE_UNAVAILABLE) ||
            "Validation service unavailable",
          status: "error",
        });
        // queueMicrotask(() => {
        //   if (axios.isCancel(e) || (e as Error)?.name === "AbortError") {
        //     onResult({ message: "", status: CANCELLED });
        //     return;
        //   } else {
        //     onResult({
        //       message:
        //         statusCode.getStatusText(statusCode.SERVICE_UNAVAILABLE) ||
        //         "Validation service unavailable",
        //       status: "error",
        //     });
        //   }
        // });
      } finally {
        // Only clear our controller, not someone else's.
        // Check signal identity to avoid clearing a newer controller.
        if (controller?.signal === signal) controller = null;
      }
    },
    debounceDelay,
  );

  return {
    validate: validator,
    cancel: () => {
      validator.cancel();
      if (controller) {
        controller.abort();
        controller = null;
      }
    },
  };
};

// ─── Password validator ───────────────────────────────────────────────────────
export const createPasswordValidator = (debounceDelay = 500, threshold = 3) => {
  // ✅ Per-instance — same fix as above
  let controller: AbortController | null = null;
  // // ✅ Per-instance lazy loader so two PasswordFields don't share state
  // let zxcvbnAsyncFn: typeof zxcvbnAsync | null = null;

  // 👇 Type matches what loadZxcvbn now returns
  let zxcvbnAsyncFn:
    | ((
        password: string,
        userInputs?: (string | number)[],
      ) => Promise<ZxcvbnResult>)
    | null = null;

  // Debounce the heavy zxcvbn calculation
  const checkStrength = debounce(
    async (value: string, onResult: (res: PasswordResult) => void) => {
      // 1. Setup AbortController for Pwned check
      if (controller) controller.abort();
      controller = new AbortController();
      const { signal } = controller;

      try {
        // 2. Lazy load zxcvbn if not already loaded
        // zxcvbn-ts accepts a signal in the options or global fetch override
        // but the pwned matcher specifically uses the global fetch
        // 👇 Pass signal to loadZxcvbn so the pwned fetch is cancellable
        // Only load once — reuse the same instance on subsequent calls
        if (!zxcvbnAsyncFn) {
          // Pass the controller signal to the lazy loader fetch wrapper
          zxcvbnAsyncFn = await lazyZxcvbn.loadZxcvbn(signal);
        }

        // 👇 Call directly — no options needed, all encapsulated in loadZxcvbn
        const result = await zxcvbnAsyncFn(value);

        // Only check once — after the async work completes
        if (signal.aborted) {
          onResult({ ...DEFAULT_RESULT, status: CANCELLED });
          return;
        }

        const score = result.score;

        // Check if any match came from the 'pwned' matcher
        // const pwnedMatch = result.sequence.find((m) => m.pattern === "pwned");
        // const isPwned = !!pwnedMatch;
        const isPwned = !!result.sequence.find((m) => m.pattern === "pwned");
        const isWeak = score < threshold || isPwned; // Adjust threshold (e.g., require score >= 3)

        const warningMsg = result.feedback.warning;
        const suggestMsg = result.feedback.suggestions.join(" ");
        const message = isWeak
          ? suggestMsg.trim()
          : (warningMsg ?? "").concat(` ${suggestMsg}`).trim();

        // console.log("warningMsg", warningMsg);
        // console.log("suggestMsg", suggestMsg);
        // console.log("message", message);
        // console.log("score", score);
        if (isWeak) {
          onResult({
            score,
            isPwned,
            message: warningMsg || "Password is too weak!",
            warning: suggestMsg,
            status: "error",
          });
          return;
        }

        onResult({
          score,
          isPwned,
          message,
          status: isWeak ? "error" : "success",
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") {
          onResult({
            ...DEFAULT_RESULT,
            status: CANCELLED,
          });
          return;
        }
        onResult({
          ...DEFAULT_RESULT,
          message: "Strength check failed",
          status: "error",
        });
      } finally {
        if (controller?.signal === signal) controller = null;
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
      onResult({
        ...DEFAULT_RESULT,
        message: `${source} is required`,
        // warning: `${source} is required`,
        status: "error",
      });
      return;
    }

    // 2. --- SYNCHRONOUS CHECK 2: Regex Policy (If fails, STOP HERE) ---
    if (!PASSWORD_REGEX.test(value)) {
      checkStrength.cancel();
      onResult({
        ...DEFAULT_RESULT,
        warning: `${source} must be at least 10 characters, include uppercase, lowercase, number, and special character!`,
        message: `${source} has invalid format`,
        status: "error",
      });
      return;
    }

    // 3. --- ASYNCHRONOUS CHECK 3: Strength (zxcvbn) ---
    onResult({
      ...DEFAULT_RESULT,
      message: `Analyzing ${source}...`,
      status: "loading",
    });
    checkStrength(value, onResult);
  };

  // const getPasswordStrength = async (
  //   value: string,
  //   source: string,
  // ): Promise<PasswordResult> => {
  //   if (isEmpty(value?.trim()) || !PASSWORD_REGEX.test(value)) {
  //     return {
  //       ...DEFAULT_RESULT,
  //       status: "error",
  //     };
  //   }

  //   if (!zxcvbnAsyncFn) {
  //     zxcvbnAsyncFn = await lazyZxcvbn.loadZxcvbn();
  //   }

  //   const result = await zxcvbnAsyncFn(value);
  //   const score = result.score;
  //   const isPwned = result.sequence.some((m) => m.pattern === "pwned");
  //   const isWeak = score < threshold || isPwned;

  //   const warningMsg = result.feedback.warning;
  //   const suggestMsg = result.feedback.suggestions.join(" ");
  //   const message = isWeak
  //     ? suggestMsg.trim()
  //     : (warningMsg ?? "").concat(` ${suggestMsg}`).trim();

  //   return {
  //     score,
  //     isPwned,
  //     message,
  //     // warning: result.feedback.warning || "",
  //     status: isWeak ? "error" : "success",
  //   };
  // };

  return {
    validate: validator,
    // match: matchValidator,
    // strength: getPasswordStrength, // ← New: Pure strength check (no side effects)
    cancel: () => {
      checkStrength.cancel();
      if (controller) {
        controller.abort();
        controller = null;
      }
    },
  };
};

// ─── Match validator (synchronous) ───────────────────────────────────────────
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

  // // Case 4: password not empty, rePassword not empty, don’t match → notmatch error
  // if (!isEmpty(value.trim()) && !isEmpty(matchValue.trim())) {
  //   const message = value !== matchValue ? "Passwords do not match" : ""; // Both match → no error
  //   return { message, status: message ? "error" : "idle" };
  // }

  // // Fallback (shouldn’t be reached due to exhaustive checks)
  // return { message: "", status: "idle" };

  // Case 4: password not empty, rePassword not empty, don’t match → notmatch error
  const message = value !== matchValue ? "Passwords do not match" : "";
  return { message, status: message ? "error" : "idle" };
};
