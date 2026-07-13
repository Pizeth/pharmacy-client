// src/middleware.ts
// import { isProduction } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];
// const AUTH_COOKIE_NAME = "__Secure-razeth.session_token"; // 👈 matches your cookiePrefix in Better Auth
const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-razeth.session_token"
    : "razeth.session_token";

const API_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.razeth.com";

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

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

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

  console.log("Checking auth for path:", pathname);

  // 👇 If already on login with a callbackUrl, don't re-check session
  // This prevents redirect loops after sign-in
  if (pathname === "/login" && searchParams.has("callbackUrl")) {
    return NextResponse.next();
  }

  try {
    // Forward cookies to the API session check
    const sessionRes = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "", // 👈 forward browser cookies
        // "content-type": "application/json",
      },
      // cache: "no-store",
    });

    const session = await sessionRes.json();
    const isAuthenticated = !!(session?.user || session?.session);

    console.log("Path:", pathname, "| Authenticated:", isAuthenticated);

    if (isPublicPath && isAuthenticated) {
      return NextResponse.redirect(new URL("/fts", request.url));
    }

    if (!isPublicPath && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Session check failed:", error);
    // API unreachable — allow through, page-level auth will handle it
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|static|api|images).*)",
  ],
};
