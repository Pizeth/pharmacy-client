// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// // This function can be marked `async` if using `await` inside
// // export function middleware(request: NextRequest) {
// //   return NextResponse.redirect(new URL("/home", request.url));
// // }

// // // See "Matching Paths" below to learn more
// // export const config = {
// //   matcher: "/about/:path*",
// // };

// // Add any route that should be visible without logging in
// const PUBLIC_ROUTES = ["/", "/fts", "/login", "/register", "/public-stats"];

// export default async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log("Middleware: Incoming request for path:", request.nextUrl);
//   console.log("Middleware: Checking authentication for path:", pathname);
//   // console.log("Middleware:  path:", request.url);

//   const isPublicRoute = PUBLIC_ROUTES.some(
//     (route) => pathname === route || pathname.startsWith(`${route}/`),
//   );

//   console.log("Middleware: Is public route?", isPublicRoute);

//   if (isPublicRoute) return NextResponse.next();

//   const sessionCookie = getSessionCookie(request);

//   // Redirect to login if not authenticated and trying to access a private route
//   if (!sessionCookie && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Prevent logged-in users from seeing the login page again
//   if (sessionCookie && pathname === "/login") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Update matcher to exclude internal Next.js and Chrome paths
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
// };

// middleware.ts  (in project root, next to app/)
import { NextRequest, NextResponse } from "next/server";

// Routes that NEVER require auth
const PUBLIC_PATHS = [
  "/", // landing page
  "/fts",
  "/login",
  "/register",
  "/forgot-password",
  "/update-password",
];

// Paths that start with these prefixes are also public
const PUBLIC_PREFIXES = [
  "/_next",
  "/api/auth", // better-auth API routes
  "/favicon",
  "/fonts",
  "/images",
  "/fts",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware: Incoming request for path:", pathname);
  console.log("isPublicPath:", isPublicPath(pathname));

  // Skip public routes immediately
  if (isPublicPath(pathname)) return NextResponse.next();

  // Check better-auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, .well-known
     * - All common static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.well-known|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|eot|mp4|pdf|txt|xml|json)$).*)",
  ],
};
