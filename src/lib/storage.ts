import { Readable } from "node:stream";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
};

const r2EnvironmentKeys = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
] as const;

let r2Client: S3Client | null = null;

function getR2Config(): R2Config | null {
  const values = {
    accountId: process.env.R2_ACCOUNT_ID?.trim(),
    accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim(),
    bucketName: process.env.R2_BUCKET_NAME?.trim(),
    publicUrl: process.env.R2_PUBLIC_URL?.trim(),
  };
  if (!Object.values(values).some(Boolean)) return null;

  const missing = r2EnvironmentKeys.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Missing Cloudflare R2 configuration: ${missing.join(", ")}`);
  }

  let publicUrl: URL;
  try {
    publicUrl = new URL(values.publicUrl!);
  } catch {
    throw new Error("R2_PUBLIC_URL must be a valid public URL.");
  }
  if (publicUrl.protocol !== "https:" && publicUrl.protocol !== "http:") {
    throw new Error("R2_PUBLIC_URL must use HTTP or HTTPS.");
  }

  return {
    accountId: values.accountId!,
    accessKeyId: values.accessKeyId!,
    secretAccessKey: values.secretAccessKey!,
    bucketName: values.bucketName!,
    publicUrl: publicUrl.toString().replace(/\/+$/, ""),
  };
}

function getR2Client(config: R2Config) {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return r2Client;
}

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
  return uploadMedia(buffer, filename, "image");
}

export async function uploadMedia(
  buffer: Buffer,
  filename: string,
  resourceType: "image" | "video",
  contentType = contentTypes[path.extname(filename).toLowerCase()] ?? "application/octet-stream",
) {
  const r2 = getR2Config();
  if (r2) {
    const key = `uploads/${filename}`;
    await getR2Client(r2).send(
      new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return `${r2.publicUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  if (!hasCloudinaryConfig) return null;

  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "ruman-mart", public_id: filename.replace(/\.[^/.]+$/, ""), resource_type: resourceType },
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

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function cloudinaryPublicId(url: string) {
  const uploadPath = url.split("/upload/")[1];
  if (!uploadPath) return null;
  return uploadPath.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

function r2KeyFromUrl(url: string, publicUrl: string) {
  try {
    const imageUrl = new URL(url);
    const baseUrl = new URL(publicUrl);
    if (imageUrl.origin !== baseUrl.origin) return null;

    const basePath = baseUrl.pathname.replace(/\/+$/, "");
    if (basePath && !imageUrl.pathname.startsWith(`${basePath}/`)) return null;
    const encodedKey = imageUrl.pathname.slice(basePath.length).replace(/^\/+/, "");
    if (!encodedKey) return null;
    return encodedKey.split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
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

  const r2 = getR2Config();
  if (r2) {
    const key = r2KeyFromUrl(url, r2.publicUrl);
    if (key) {
      await getR2Client(r2).send(
        new DeleteObjectCommand({
          Bucket: r2.bucketName,
          Key: key,
        }),
      );
      return;
    }
  }

  if (hasCloudinaryConfig && url.includes("res.cloudinary.com")) {
    const publicId = cloudinaryPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }
}
