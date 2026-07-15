// src/app/auth/callback/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setupAxiosAuth } from "@/lib/providers/dataProvider";
import { API_URL, COOKIE_TOKEN_KEY, TOKEN_KEY } from "@/types/constants";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.razeth.com";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false); // 👈 prevent double execution

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // const handleCallback = async () => {
    //   // // getSession hits the API with the session cookie
    //   // // onSuccess in authClient captures set-auth-token automatically
    //   // const { data: session } = await authClient.getSession({
    //   //   fetchOptions: {
    //   //     onSuccess: (ctx) => {
    //   //       const token = ctx.response.headers.get("set-auth-token");
    //   //       if (token) {
    //   //         sessionStorage.setItem(TOKEN_KEY, token);
    //   //         setupAxiosAuth(token);
    //   //       }
    //   //     },
    //   //   },
    //   // });

    //   // if (session?.user) {
    //   //   // Get callbackUrl from query params or default to /fts
    //   //   const params = new URLSearchParams(window.location.search);
    //   //   router.replace(params.get("callbackUrl") ?? "/fts");
    //   // } else {
    //   //   router.replace("/login");
    //   // }

    //   // Check what cookies the browser has
    //   console.log("document.cookie:", document.cookie);
    //   console.log("All cookies visible to JS:", document.cookie);

    //   try {
    //     // 👇 Call API directly with credentials — bypasses Next.js proxy
    //     // so the cookie on api.razeth.com is sent correctly
    //     const res = await fetch(`${API_URL}/api/auth/get-session`, {
    //       credentials: "include", // sends api.razeth.com cookies
    //       cache: "no-store",
    //     });

    //     // 👇 Capture Bearer token from response header
    //     const token = res.headers.get(COOKIE_TOKEN_KEY);
    //     console.log("Token from header:", token);
    //     console.log("All response headers:");
    //     res.headers.forEach((value, key) => {
    //       console.log(`  ${key}: ${value}`);
    //     });

    //     // if (token) {
    //     //   sessionStorage.setItem(TOKEN_KEY, token);
    //     //   setupAxiosAuth(token);
    //     // }

    //     const session = await res.json();

    //     console.log("Session:", session);
    //     console.log("OAuth callback session:", session);
    //     console.log("OAuth callback token:", token);

    //     if (session?.user) {
    //       // Even without the token, if the session cookie exists
    //       // we can still proceed — authProvider.check will handle it
    //       if (token) {
    //         sessionStorage.setItem(TOKEN_KEY, token);
    //         setupAxiosAuth(token);
    //       }
    //       const params = new URLSearchParams(window.location.search);
    //       router.replace(params.get("callbackUrl") ?? "/fts");
    //     } else {
    //       router.replace("/login?error=oauth_failed");
    //     }
    //   } catch (error) {
    //     console.log("OAuth callback error:", error);
    //     console.error("OAuth callback failed:", error);
    //     router.replace("/login?error=oauth_failed");
    //   }
    // };

    const handleCallback = async () => {
      const { data: session } = await authClient.getSession();

      if (session?.user) {
        const token = sessionStorage.getItem(TOKEN_KEY);
        if (token) setupAxiosAuth(token);
        const params = new URLSearchParams(window.location.search);
        router.replace(params.get("callbackUrl") ?? "/fts");
      } else {
        router.replace("/login?error=oauth_failed");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <p>Signing you in...</p>
    </div>
  );
}
