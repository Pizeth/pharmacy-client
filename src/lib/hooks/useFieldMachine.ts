// useFieldMachine.ts

import { useState } from "react";

export type FieldStatus = "idle" | "typing" | "validating" | "valid" | "error";

export const useFieldMachine = () => {
  const [status, setStatus] = useState<FieldStatus>("idle");

  return {
    status,
    setTyping: () => setStatus("typing"),
    setValidating: () => setStatus("validating"),
    setValid: () => setStatus("valid"),
    setError: () => setStatus("error"),
    reset: () => setStatus("idle"),
  };
};
