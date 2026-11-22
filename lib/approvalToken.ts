import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTES = 32;

export function createApprovalToken() {
  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  return { token, hash: hashApprovalToken(token) };
}

export function hashApprovalToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** 32 random bytes, base64url, no padding. */
export function isApprovalToken(value: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(value);
}
