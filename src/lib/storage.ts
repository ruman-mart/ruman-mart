import { Readable } from "node:stream";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(buffer: Buffer, filename: string) {
  if (!hasCloudinaryConfig) return null;

  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "ruman-mart", public_id: filename.replace(/\.[^/.]+$/, "") },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary did not return an image URL."));
          return;
        }
        resolve(result.secure_url);
      },
    );

    Readable.from(buffer).pipe(upload);
  });
}

function cloudinaryPublicId(url: string) {
  const uploadPath = url.split("/upload/")[1];
  if (!uploadPath) return null;
  return uploadPath.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

export async function deleteStoredImage(url: string) {
  if (!url) return;

  if (url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", url));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    return;
  }

  if (hasCloudinaryConfig && url.includes("res.cloudinary.com")) {
    const publicId = cloudinaryPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }
}
