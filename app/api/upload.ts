import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ error: "No image provided" });
    }

    // رفع الصورة على Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "proofs",
    });

    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
    });

  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);

    return res.status(500).json({
      error:
        error.message || "Internal Server Error",
    });
  }
}