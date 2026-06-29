export function getInitials(nameOrEmail?: string | null): string {
  if (!nameOrEmail) return "U";

  const str = String(nameOrEmail).trim();
  if (!str) return "U";

  const baseName = str.includes("@")
    ? (str.split("@")[0] ?? str)
    : str;

  const parts = baseName.split(/[\s\.\-_]+/);
  const first = parts[0];
  const second = parts[1];

  if (parts.length > 1 && first && second) {
    return (first.charAt(0) + second.charAt(0)).toUpperCase();
  }

  return baseName.slice(0, 2).toUpperCase();
}
