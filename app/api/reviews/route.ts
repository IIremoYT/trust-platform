import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

// Simple in-memory rate limit Map (IP -> Timestamp)
// Note: In Vercel Edge/Serverless this resets on cold boots, but it's sufficient for basic spam deterrence.
const rateLimitMap = new Map<string, number>();

const SPAM_KEYWORDS = [
  "http://", "https://", "www.", ".com", ".net",
  "casino", "viagra", "crypto", "bitcoin", "forex",
  "click here", "free money", "earn money",
];

function containsSpam(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    
    // Rate Limiting (1 review per 60 seconds per IP)
    const now = Date.now();
    const lastSubmit = rateLimitMap.get(ip) || 0;
    if (now - lastSubmit < 60000) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before submitting again." },
        { status: 429 }
      );
    }
    
    // Clean up old entries periodically to prevent memory leaks (simple approach)
    if (rateLimitMap.size > 1000) rateLimitMap.clear();

    const body = await req.json();
    const { name, comment, rating, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      // Act like it succeeded to fool bots
      return NextResponse.json({ success: true, fake: true });
    }

    if (!name || !comment || typeof rating !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (containsSpam(name) || containsSpam(comment)) {
      // Act like it succeeded to fool bots or return error
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 403 }
      );
    }

    // Write to Firestore securely via Admin SDK
    await adminDb.collection("reviews").add({
      name: name.trim(),
      comment: comment.trim(),
      rating: Math.min(Math.max(rating, 1), 5), // bound 1-5
      active: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update rate limit
    rateLimitMap.set(ip, now);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reviews API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
