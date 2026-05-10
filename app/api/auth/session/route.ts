import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

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

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session Cookie Error:", error);
    return NextResponse.json(
      { error: "Unauthorized request!" },
      { status: 401 }
    );
  }
}
