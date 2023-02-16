import crypto from "crypto";

export function generateId() {
  return `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}