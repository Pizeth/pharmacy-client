import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };

// Add any route that should be visible without logging in
const PUBLIC_ROUTES = ["/", "/fts", "/login", "/register", "/public-stats"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware: Incoming request for path:", request.nextUrl);
  console.log("Middleware: Checking authentication for path:", pathname);
  // console.log("Middleware:  path:", request.url);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  console.log("Middleware: Is public route?", isPublicRoute);

  if (isPublicRoute) return NextResponse.next();

  const sessionCookie = getSessionCookie(request);

  // Redirect to login if not authenticated and trying to access a private route
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from seeing the login page again
  if (sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Update matcher to exclude internal Next.js and Chrome paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
