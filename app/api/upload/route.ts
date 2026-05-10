import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Upload with security optimizations:
    // - format: webp — auto convert to WebP
    // - quality: auto:good — optimize size while preserving quality
    // - flags: strip_profile — remove EXIF metadata
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

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    });

  } catch (error: unknown) {
    console.error("Cloudinary Upload Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}