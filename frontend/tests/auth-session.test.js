import test from "node:test";
import assert from "node:assert/strict";
import { hasVerifiedNeonToken } from "../src/lib/session-claims.js";
import { visitorSecondsRemaining } from "../src/lib/visitor-session.js";

function sessionWithClaims(claims) {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return { session: { token: `header.${payload}.signature` } };
}

test("rejects an unverified email claim", () => {
  assert.equal(hasVerifiedNeonToken(sessionWithClaims({ emailVerified: false })), false);
});

test("rejects a token without the required emailVerified claim", () => {
  assert.equal(hasVerifiedNeonToken(sessionWithClaims({ email_verified: true })), false);
});

test("accepts an email/password session only when emailVerified is true", () => {
  assert.equal(hasVerifiedNeonToken(sessionWithClaims({ emailVerified: true })), true);
});

test("accepts a Google-provider Neon session with emailVerified true", () => {
  assert.equal(
    hasVerifiedNeonToken(sessionWithClaims({ emailVerified: true, provider: "google" })),
    true,
  );
});

test("visitor countdown interprets database UTC timestamps as UTC", () => {
  const now = Date.parse("2026-09-29T10:00:00Z");
  assert.equal(
    visitorSecondsRemaining("2026-09-29T10:10:00", now),
    600,
  );
});

test("visitor countdown reaches zero at the backend expiration instant", () => {
  const expiry = Date.parse("2026-09-29T10:10:00Z");
  assert.equal(visitorSecondsRemaining("2026-09-29T10:10:00Z", expiry - 1), 1);
  assert.equal(visitorSecondsRemaining("2026-09-29T10:10:00Z", expiry), 0);
  assert.equal(visitorSecondsRemaining("invalid", expiry), 0);
});
