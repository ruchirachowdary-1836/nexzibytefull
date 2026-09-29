export function visitorSecondsRemaining(expiresAt, now = Date.now()) {
  if (typeof expiresAt !== "string" || !expiresAt.trim()) return 0;
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(expiresAt);
  const expiry = Date.parse(hasTimezone ? expiresAt : `${expiresAt}Z`);
  if (!Number.isFinite(expiry)) return 0;
  return Math.max(0, Math.ceil((expiry - now) / 1000));
}
