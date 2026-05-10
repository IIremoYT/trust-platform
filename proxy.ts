import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;

  // Protect /admin routes (except the login page itself /admin)
  if (request.nextUrl.pathname.startsWith("/admin/") && !session) {
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
