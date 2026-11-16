"use client";

import { Fade, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  hasLoginAttempt, LOGIN_FEEDBACK_EVENT, LoginNotice, takeLoginNotice,
} from "@/lib/auth/loginFeedback";
import { ToastRoot, ToastSurface, ToastProgress } from "./LoginFeedback.styles";

/** Lives above route layouts so notifications remain visible after sign-in. */
export function LoginFeedback() {
  const [notice, setNotice] = useState<LoginNotice | null>(null);
  const [open, setOpen] = useState(false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pathname = usePathname();

  useEffect(() => {
    const queued = takeLoginNotice();
    if (queued) { setNotice(queued); setOpen(true); }
    const receive = (event: Event) => {
      takeLoginNotice();
      setNotice((event as CustomEvent<LoginNotice>).detail);
      setOpen(true);
    };
    window.addEventListener(LOGIN_FEEDBACK_EVENT, receive);
    return () => window.removeEventListener(LOGIN_FEEDBACK_EVENT, receive);
  }, []);

  useEffect(() => {
    // OAuth finishes on the API, so confirm its session after returning here.
    if (hasLoginAttempt()) void authClient.getSession().catch(() => undefined);
  }, [pathname]);

  return (
    <ToastRoot
      key={notice?.createdAt}
      open={open}
      autoHideDuration={notice?.severity === "error" ? 10_000 : 6_000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      slots={{ transition: Fade }}
      slotProps={{ transition: { timeout: reduceMotion ? 0 : { enter: 250, exit: 350 } } }}
      onClose={(_event, reason) => { if (reason !== "clickaway") setOpen(false); }}
    >
      {notice ? (
        <ToastSurface severity={notice.severity} data-severity={notice.severity} onClose={() => setOpen(false)}>
          {notice.message}
          <ToastProgress data-toast-progress aria-hidden="true" />
        </ToastSurface>
      ) : undefined}
    </ToastRoot>
  );
}
