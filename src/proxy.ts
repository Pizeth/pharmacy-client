// src/middleware.ts
// import { isProduction } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
// const AUTH_COOKIE_NAME = "__Secure-razeth.session_token"; // 👈 matches your cookiePrefix in Better Auth
const AUTH_COOKIE_NAME = [
  process.env.NODE_ENV === "production"
    ? "__Secure-razeth.session_token"
    : "razeth.session_token",
];

const SESSION_COOKIE_NAMES = [
  "razeth.session_token",
  "__Secure-razeth.session_token",
];

// const API_URL =
//   process.env.BACKEND_URL ||
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://api.razeth.com";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  // console.log("Session cookie:", sessionCookie);

  // console.log("Cookie check:", request.cookies);

  // console.log("Proxy check:", {
  //   pathname,
  //   sessionCookieExists: !!sessionCookie,
  // });

  // Skip non-page requests, only check auth for non-public paths and non-asset requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Only intercept auth pages
  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  if (!isAuthPage) {
    return NextResponse.next();
  }

  // // Already authenticated → redirect away from login
  // if (isPublicPath && sessionCookie) {
  //   return NextResponse.redirect(new URL("/fts", request.url));
  // }

  // // Not authenticated → redirect to login
  // if (!isPublicPath && !sessionCookie) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Only check auth for non-public paths and non-asset requests
  // if (pathname.startsWith("/_next") || pathname.includes(".")) {
  //   return NextResponse.next();
  // }

  // console.log("Checking auth for path:", pathname);

  // 👇 If already on login with a callbackUrl, don't re-check session
  // This prevents redirect loops after sign-in
  if (searchParams.has("callbackUrl")) {
    return NextResponse.next();
  }

  // Check if user has a session cookie
  const hasSession = SESSION_COOKIE_NAMES.some(
    (name) => !!request.cookies.get(name)?.value,
  );

  console.log(
    "Session check for path:",
    pathname,
    "| Has session:",
    hasSession,
  );

  // Already logged in — redirect away from auth pages
  if (hasSession) {
    const callbackUrl = searchParams.get("callbackUrl") || "/fts";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // try {
  //   // Forward cookies to the API session check
  //   const sessionRes = await fetch(`${API_URL}/api/auth/get-session`, {
  //     headers: {
  //       cookie: request.headers.get("cookie") ?? "", // 👈 forward browser cookies
  //       // "content-type": "application/json",
  //     },
  //     // cache: "no-store",
  //   });

  //   const session = await sessionRes.json();
  //   const isAuthenticated = !!(session?.user || session?.session);

  //   console.log("Path:", pathname, "| Authenticated:", isAuthenticated);

  //   if (isAuthPage && isAuthenticated) {
  //     return NextResponse.redirect(new URL("/fts", request.url));
  //   }

  //   if (!isAuthPage && !isAuthenticated) {
  //     const loginUrl = new URL("/login", request.url);
  //     loginUrl.searchParams.set("callbackUrl", pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // } catch (error) {
  //   console.error("Session check failed:", error);
  //   // API unreachable — allow through, page-level auth will handle it
  //   if (!isAuthPage) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/forgot-password"],
  // 👆 Only run on auth pages — not everything
};

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization)
//      * - favicon.ico
//      * - public folder assets
//      * - api routes
//      */
//     "/((?!_next/static|_next/image|favicon.ico|static|api|images).*)",
//   ],
// };
