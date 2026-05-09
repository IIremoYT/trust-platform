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

    // رفع الصورة
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "proofs",
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    });

  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}