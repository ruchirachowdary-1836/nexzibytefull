import { createClient } from "@neondatabase/neon-js";

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
      auth: { url: authUrl },
      dataApi: { url: resolvedDataApiUrl },
    })
  : null;

export async function getNeonToken() {
  return neonClient?.auth.getJWTToken?.() || null;
}

export async function getNeonSession() {
  if (!neonClient) return null;
  const result = await neonClient.auth.getSession();
  return result?.data || result || null;
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
  const result = await neonClient.auth.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}/#/login`,
  });
  if (result?.error) throw new Error(result.error.message || "Google sign-in failed.");
  const redirectUrl = result?.data?.url || result?.url;
  if (redirectUrl) {
    window.location.assign(redirectUrl);
  }
  return result;
}

export async function sendNeonVerificationCode(email) {
  const method = neonClient?.auth?.emailOtp?.sendVerificationOTP;
  if (!method) throw new Error("Neon email verification codes are not enabled for this Auth project.");
  const result = await method({ email, type: "email-verification" });
  if (result?.error) throw new Error(result.error.message || "Unable to send the verification code.");
  return result;
}

export async function verifyNeonVerificationCode(email, otp) {
  const method = neonClient?.auth?.emailOtp?.checkVerificationOTP;
  if (!method) throw new Error("Neon email verification codes are not enabled for this Auth project.");
  const result = await method({ email, type: "email-verification", otp });
  if (result?.error) throw new Error(result.error.message || "Invalid or expired verification code.");
  return result;
}
