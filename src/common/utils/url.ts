export function isSameHost(baseUrl: string, candidateUrl: string): boolean {
  try {
    const a = new URL(baseUrl);
    const b = new URL(candidateUrl);
    return a.host === b.host;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const u = new URL(url);
  u.hash = "";
  // Optional: remove trailing slash normalization
  return u.toString();
}
