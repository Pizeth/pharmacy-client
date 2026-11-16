"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LOGIN_ATTEMPT_EVENT, LOGIN_FEEDBACK_EVENT, type LoginNotice, reportLoginFailure } from "@/lib/auth/loginFeedback";
import { InlineError } from "./LoginFeedback.styles";

export function AuthErrorNotice() {
  const params = useSearchParams();
  const failed = params?.get("authError") === "1";
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const clear = () => setMessage(null);
    const receive = (event: Event) => {
      const notice = (event as CustomEvent<LoginNotice>).detail;
      setMessage(notice.severity === "error" ? notice.message : null);
    };
    window.addEventListener(LOGIN_ATTEMPT_EVENT, clear);
    window.addEventListener(LOGIN_FEEDBACK_EVENT, receive);
    return () => {
      window.removeEventListener(LOGIN_ATTEMPT_EVENT, clear);
      window.removeEventListener(LOGIN_FEEDBACK_EVENT, receive);
    };
  }, []);
  useEffect(() => { if (failed) reportLoginFailure(); }, [failed]);
  if (!message) return null;
  return <InlineError severity="error">{message}</InlineError>;
}
