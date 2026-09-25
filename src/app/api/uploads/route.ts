import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { uploadMedia } from "@/lib/storage";
import { getAuthenticatedUserId } from "@/lib/auth";

const imageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);
const videoTypes = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
]);

export async function POST(request: Request) {
  if (!(await getAuthenticatedUserId())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Image or video file is required." }, { status: 400 });

  const imageExtension = imageTypes.get(file.type);
  const videoExtension = videoTypes.get(file.type);
  const extension = imageExtension ?? videoExtension;
  if (!extension) return NextResponse.json({ message: "Only JPG, PNG, WebP, GIF, MP4, and WebM files are allowed." }, { status: 400 });
  const maxSize = videoExtension ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) return NextResponse.json({ message: `${videoExtension ? "Video" : "Image"} must be smaller than ${videoExtension ? "50MB" : "5MB"}.` }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}${extension}`;
  const cloudinaryUrl = await uploadMedia(buffer, filename, videoExtension ? "video" : "image");
  if (cloudinaryUrl) return NextResponse.json({ url: cloudinaryUrl }, { status: 201 });

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
