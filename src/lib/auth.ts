import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import User from "@/lib/models/User";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(key, "hex");
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getAuthenticatedUserId() {
  const sessionId = (await cookies()).get("ruman_session")?.value;
  if (!sessionId || !/^\d+$/.test(sessionId)) return null;
  const user = await User.findByPk(sessionId, { attributes: ["id"] });
  return user ? String(user.get("id")) : null;
}