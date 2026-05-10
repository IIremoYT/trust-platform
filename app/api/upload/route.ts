import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { logger } from "@/lib/logger";

// Simple in-memory rate limit Map (IP -> Timestamp)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Admin Authorization Check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;
    const ip = req.headers.get("x-forwarded-for") || "unknown-admin";

    if (!sessionCookie) {
      logger.security("Upload attempt without session cookie", { ip });
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      logger.security("Upload attempt with invalid session cookie", { ip });
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Rate Limiting (Admin specific, max 20 uploads per minute)
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateLimitData.lastReset > 60000) {
      rateLimitData.count = 1;
      rateLimitData.lastReset = now;
    } else {
      rateLimitData.count += 1;
    }
    
    rateLimitMap.set(ip, rateLimitData);

    if (rateLimitData.count > 20) {
      logger.warn("Admin upload rate limit exceeded", { ip });
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // 3. MIME Type Validation
    const match = image.match(/^data:([A-Za-z-+\/]+);base64,/);
    if (!match) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    
    const mimeType = match[1];
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimes.includes(mimeType)) {
      return NextResponse.json({ error: "Unsupported file type. Only JPEG, PNG, WEBP, GIF allowed." }, { status: 400 });
    }

    // 4. File Size Validation (Approx Base64 size)
    // Formula: length * 3/4 - padding
    const base64Length = image.length - match[0].length;
    const sizeInBytes = (base64Length * 3) / 4;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (sizeInBytes > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // 5. Upload with security optimizations (EXIF Strip & WebP Conversion)
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "proofs",
      format: "webp",
      quality: "auto:good",
      flags: "strip_profile",
      transformation: [
        {
          quality: "auto:good",
          fetch_format: "webp",
          flags: "strip_profile",
        },
      ],
    });

    logger.info("Image uploaded successfully by Admin", { ip, url: uploadResponse.secure_url });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    });

  } catch (error: unknown) {
    logger.error("Cloudinary Upload Exception", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}