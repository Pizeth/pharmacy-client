// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];
const AUTH_COOKIE_NAME = "__Secure-razeth.session_token"; // 👈 matches your cookiePrefix in Better Auth

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  // Already authenticated → redirect away from login
  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL("/fts", request.url));
  }

  // Not authenticated → redirect to login
  if (!isPublicPath && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
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
