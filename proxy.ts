import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Note: We use basic console.warn in Edge Middleware because custom logger classes might have compatibility issues on Edge if they use Node APIs.
// However, our logger class doesn't use Node-specific APIs, but we'll stick to console in middleware for simplicity and speed.

export function proxy(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;

  // Protect /admin routes (except the login page itself /admin)
  if (request.nextUrl.pathname.startsWith("/admin/") && !session) {
    console.warn(JSON.stringify({
      level: "SECURITY",
      message: "Blocked unauthenticated access to admin dashboard",
      context: { path: request.nextUrl.pathname, ip: request.headers.get("x-forwarded-for") || "unknown" }
    }));
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If already logged in and trying to access /admin, redirect to dashboard
  if (request.nextUrl.pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Ensure middleware only runs on admin routes to save Edge resources
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
