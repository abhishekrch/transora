export const RATE_LIMIT_PER_MIN = 100;
export const DAILY_CHAR_LIMIT = 100_000;
export const GLOBAL_DAILY_CHAR_LIMIT = 10_000_000;
export const MAX_BATCH_SIZE = 100;
export const MAX_TEXT_LENGTH = 5000;
export const REDIS_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour
export const JWT_ACCESS_TTL = "15m";
export const JWT_REFRESH_TTL = "7d";
export const PERSONAL_DATA_TTL_DAYS = 30;

// Azure Translator API
export const AZURE_MAX_RETRIES = 3;
export const AZURE_TIMEOUT_MS = 10_000;
