import { createClient } from "@neondatabase/neon-js";
import { BetterAuthVanillaAdapter } from "@neondatabase/neon-js/auth/vanilla/adapters";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

function deriveDataApiUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.replace(".neonauth.", ".apirest.");
    parsed.pathname = parsed.pathname.replace(/\/auth\/?$/, "/rest/v1");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

const resolvedDataApiUrl = dataApiUrl || deriveDataApiUrl(authUrl);

export const neonAuthEnabled =
  import.meta.env.VITE_AUTH_PROVIDER === "neon" && Boolean(authUrl && resolvedDataApiUrl);

export const neonClient = neonAuthEnabled
  ? createClient({
      auth: { url: authUrl, adapter: BetterAuthVanillaAdapter() },
      dataApi: { url: resolvedDataApiUrl },
    })
  : null;

export async function getNeonToken() {
  if (!neonClient) return null;
  const session = await getNeonSession();
  return session?.session?.token || session?.token || null;
}

export async function getNeonSession() {
  if (!neonClient) return null;
  const result = await neonClient.auth.getSession();
  return result?.data || result || null;
}

export async function signUpWithEmail({ email, password, name }) {
  if (!neonClient) throw new Error("Neon Auth is not configured.");
  const result = await neonClient.auth.signUp.email({ email, password, name });
  if (result?.error) throw new Error(result.error.message || "Unable to create your account.");
  return result?.data || result;
}

export async function signInWithEmail({ email, password }) {
  if (!neonClient) throw new Error("Neon Auth is not configured.");
  const result = await neonClient.auth.signIn.email({ email, password });
  if (result?.error) throw new Error(result.error.message || "Unable to sign in.");
  return result?.data || result;
}

function unwrapAuthResult(result, fallbackMessage) {
  if (result?.error) {
    throw new Error(result.error.message || fallbackMessage);
  }
  return result?.data || result;
}

export async function verifyNeonEmail(code) {
  if (!neonClient) throw new Error("Neon Auth is not configured.");
  if (typeof neonClient.auth.verifyEmail !== "function") {
    throw new Error("Email verification codes are not enabled in the configured Neon Auth client.");
  }
  return unwrapAuthResult(
    await neonClient.auth.verifyEmail({ code: code.trim() }),
    "That verification code is incorrect or expired."
  );
}

export async function resendNeonVerification(email) {
  if (!neonClient) throw new Error("Neon Auth is not configured.");
  if (typeof neonClient.auth.sendVerificationEmail !== "function") {
    throw new Error("Neon Auth verification-code resend is not available.");
  }
  return unwrapAuthResult(
    await neonClient.auth.sendVerificationEmail({ email: email.trim() }),
    "Unable to resend the verification code."
  );
}

export async function waitForNeonSession({ attempts = 12, delayMs = 750 } = {}) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const session = await getNeonSession();
    if (session?.user) return session;
    if (attempt < attempts - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }
  }
  return null;
}

export async function signInWithGoogle() {
  if (!neonClient) {
    throw new Error(
      "Google sign-in is unavailable because Neon Auth is not configured for this deployment. Set VITE_AUTH_PROVIDER=neon and VITE_NEON_AUTH_URL in the frontend service."
    );
  }
  if (!neonClient.auth?.signIn?.social) {
    throw new Error("Google sign-in is unavailable in the configured Neon Auth client.");
  }
  // Managed Better Auth validates the callback origin before redirecting.
  // Keep the callback URL origin-only; hash fragments are client-side and
  // can be rejected as an untrusted origin by the auth service.
  const callbackURL =
    import.meta.env.VITE_NEON_AUTH_CALLBACK_URL ||
    `${window.location.origin}/`;
  localStorage.setItem("techtalk-google-pending", "1");
  const result = await neonClient.auth.signIn.social({
    provider: "google",
    callbackURL,
  });
  if (result?.error) {
    const message = result.error.message || "";
    if (/origin/i.test(message)) {
      throw new Error(
        "Google sign-in is blocked by Neon Auth origin settings. Add https://techtalk-frontend-acvb.onrender.com to Neon Auth trusted origins, then retry."
      );
    }
    throw new Error(message || "Google sign-in failed.");
  }
  const redirectUrl = result?.data?.url || result?.url;
  if (redirectUrl) {
    window.location.assign(redirectUrl);
    return { redirecting: true };
  }
  return result;
}

export async function requestNeonPasswordReset(email, redirectTo = `${window.location.origin}/reset-password`) {
  if (!neonClient) throw new Error("Neon Auth is not configured.");
  const method = neonClient.auth.requestPasswordReset || neonClient.auth.forgetPassword;
  if (!method) throw new Error("Password reset is not enabled in Neon Auth.");
  const result = await method.call(neonClient.auth, { email, redirectTo });
  if (result?.error) throw new Error(result.error.message || "Unable to send the password reset email.");
  return result?.data || result;
}
