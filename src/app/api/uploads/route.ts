import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export async function POST(request: Request) {
  if (!(await cookies()).get("ruman_session")?.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Image file is required." }, { status: 400 });

  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ message: "Only JPG, PNG, WebP, and GIF images are allowed." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Image must be smaller than 5MB." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}${extension}`;
  const cloudinaryUrl = await uploadImage(buffer, filename);
  if (cloudinaryUrl) return NextResponse.json({ url: cloudinaryUrl }, { status: 201 });

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
