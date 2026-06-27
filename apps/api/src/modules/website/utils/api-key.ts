import { randomBytes } from "crypto";

export function generateApiKey(prefix: string = "pk"): string {
  const randomPart = randomBytes(32).toString("base64url");
  return `${prefix}_live_${randomPart}`;
}
