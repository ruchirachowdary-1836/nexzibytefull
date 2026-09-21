import { apiRequest } from "./api.js";
import { getNeonSession, neonAuthEnabled, neonClient, signInWithEmail, signInWithGoogle, signUpWithEmail } from "./neon.js";

const TOKEN_KEY = "techtalk-token";
const REFRESH_TOKEN_KEY = "techtalk-refresh-token";

function storeTokens(result) {
  localStorage.setItem(TOKEN_KEY, result.access_token);
  if (result.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh_token);
}

export const authService = {
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    if (!neonAuthEnabled) throw new Error("Neon Auth is not configured.");
    const result = await signUpWithEmail({ name, email, password });
    const user = result?.user || result?.session?.user || null;
    return {
      ...result,
      email,
      user,
      email_verification_required: !user?.emailVerified,
      detail: "Verification email sent. Check your inbox before signing in.",
    };
  },

  async login({ email, password }) {
    if (!neonAuthEnabled) throw new Error("Neon Auth is not configured.");
    try {
      await signInWithEmail({ email, password });
      return this.me();
    } catch (error) {
      if (/verify|verification|email/i.test(error.message)) {
        throw new Error("Please verify your email before continuing. Check your inbox for the Neon Auth verification link.");
      }
      throw error;
    }
  },

  me() {
    if (neonAuthEnabled && !localStorage.getItem(TOKEN_KEY)) {
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
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    if (neonAuthEnabled) {
      neonClient.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("techtalk-google-pending");
    localStorage.removeItem("techtalk-google-session");
  },

  hasToken() {
    return Boolean(
      localStorage.getItem(TOKEN_KEY) ||
      (neonAuthEnabled && neonClient)
    );
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
    const session = neonUser || (await getNeonSession());
    const sessionUser = session?.user || session;
    const normalized = normalizeNeonUser(sessionUser);
    const profile = await apiRequest("/auth/session", { useNeonToken: true });
    return { ...normalized, ...profile, name: profile.name || normalized.name, profile_image: profile.profile_image || normalized.profile_image };
  } catch (error) {
    throw new Error(`Signed in, but your member profile could not be created: ${error.message}`);
  }
}
