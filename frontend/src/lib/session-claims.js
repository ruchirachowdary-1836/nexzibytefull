export function hasVerifiedNeonToken(session) {
  const token = session?.session?.token || session?.token;
  if (typeof token !== "string") return false;

  try {
    // This is a deny-only UX gate; the backend remains responsible for JWT validation.
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    return claims.emailVerified === true;
  } catch {
    return false;
  }
}
