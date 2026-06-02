/**
 * Formats a signing key for JWT signing.
 * Handles base64-encoded keys and ensures PEM format.
 */
function normalizePemLines(key: string): string {
  const lines = key
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.join("\n") + "\n";
}

function wrapPemKey(key: string): string {
  const body = key.replace(/\s+/g, "");
  const chunks = body.match(/.{1,64}/g) ?? [body];
  return `-----BEGIN PRIVATE KEY-----\n${chunks.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

export function formatSigningKey(key: string): string {
  const normalized = key.replace(/\\r/g, "").replace(/\\n/g, "\n").trim();

  if (normalized.includes("-----BEGIN")) {
    return normalizePemLines(normalized);
  }

  try {
    const decodedKey = Buffer.from(normalized, "base64").toString("utf-8").trim();

    if (decodedKey.includes("-----BEGIN")) {
      return normalizePemLines(decodedKey);
    }

    return wrapPemKey(decodedKey);
  } catch {
    return wrapPemKey(normalized);
  }
}
