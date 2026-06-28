const SENSITIVE_FIELDS = [
  "password",
  "passwordHash",
  "token",
  "secret",
  "apiKey",
  "accessToken",
  "refreshToken",
  "creditCard",
  "cvv",
  "ssn",
];

function isSensitiveField(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()));
}

export function maskSensitiveData(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  if (typeof obj === "object") {
    const masked: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (isSensitiveField(key)) {
        masked[key] = "***REDACTED***";
      } else {
        masked[key] = maskSensitiveData(value);
      }
    }

    return masked;
  }

  return obj;
}
