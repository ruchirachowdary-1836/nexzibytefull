import { apiRequest } from "./api.js";
import { getNeonSession, neonAuthEnabled, neonClient, sendNeonVerificationCode, signInWithGoogle } from "./neon.js";

const TOKEN_KEY = "techtalk-token";

export const authService = {
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    if (neonAuthEnabled) {
      if (!accept_terms) throw new Error("You must accept the Terms and Conditions.");
      const result = await neonClient.auth.signUp.email({
        name,
        email,
        password,
        callbackURL: `${window.location.origin}/#/login`,
      });
      if (result?.error) {
        throw new Error(result.error.message || "Unable to create your account.");
      }
      if (neonClient.auth.emailOtp?.sendVerificationOTP) {
        await sendNeonVerificationCode(email);
      }
      return {
        detail: "Account created. Check your email for the verification link before signing in.",
        email_verification_required: true,
        email,
      };
    }
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, professional_role: role || null, referral_contact: referral_contact || null, accept_terms }),
    });
    return { ...result, email };
  },

  async login({ email, password }) {
    if (neonAuthEnabled) {
      const result = await neonClient.auth.signIn.email({ email, password });
      if (result?.error) {
        throw new Error(result.error.message || "Unable to sign in. Verify your account if this is your first login.");
      }
      const session = await getNeonSession();
      const neonUser = normalizeNeonUser(session?.user || result?.data?.user || result?.user);
      return hydrateNeonProfile(neonUser);
    }
    const body = new URLSearchParams({ username: email, password });
    const response = await fetch(`${import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "Unable to sign in.");
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return this.me();
  },

  me() {
    if (!localStorage.getItem(TOKEN_KEY) && neonAuthEnabled) {
      return getNeonSession()
        .then((session) => normalizeNeonUser(session?.user))
        .then(hydrateNeonProfile);
    }
    return apiRequest("/auth/session");
  },

  updateProfile(payload) {
    if (!localStorage.getItem(TOKEN_KEY) && neonAuthEnabled) {
      return neonClient.auth.updateUser({ name: payload.name, image: payload.profile_image }).then((result) => {
        if (result?.error) throw new Error(result.error.message || "Unable to update your profile.");
        return normalizeNeonUser(result?.data?.user || result?.user);
      });
    }
    return apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) });
  },

  logout() {
    if (neonAuthEnabled) neonClient.auth.signOut().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
  },

  hasToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY)) || neonAuthEnabled;
  },

  loginWithGoogle() {
    return signInWithGoogle();
  },
};

function normalizeNeonUser(user) {
  if (!user) throw new Error("No active Neon Auth session.");
  return { id: user.id, email: user.email, name: user.name || user.email, profile_image: user.image || null };
}

async function hydrateNeonProfile(neonUser) {
  try {
    const profile = await apiRequest("/auth/session");
    return { ...neonUser, ...profile, profile_image: profile.profile_image || neonUser.profile_image };
  } catch (error) {
    throw new Error(`Signed in, but your member profile could not be created: ${error.message}`);
  }
}
