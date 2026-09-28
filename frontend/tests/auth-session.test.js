import test from "node:test";
import assert from "node:assert/strict";
import { hasVerifiedNeonToken } from "../src/lib/session-claims.js";

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
