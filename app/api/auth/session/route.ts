import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    // 5 Days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create secure session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    logger.security("Admin successfully logged in and session created", { ip });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    logger.security("Failed Admin Login Attempt", { ip, error });
    return NextResponse.json(
      { error: "Unauthorized request!" },
      { status: 401 }
    );
  }
}
