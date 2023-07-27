import crypto from 'crypto';
export const hashed = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};