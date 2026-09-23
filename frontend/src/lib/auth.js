import { apiRequest } from "./api.js";
import { getNeonSession, neonAuthEnabled, neonClient, signInWithEmail, signInWithGoogle, signUpWithEmail } from "./neon.js";

export const authService = {
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    if (!neonAuthEnabled) throw new Error("Neon Auth is not configured.");
    const normalizedEmail = email.trim().toLowerCase();
    const result = await signUpWithEmail({ name, email: normalizedEmail, password });
    const user = result?.user || result?.session?.user || null;
    return {
      ...result,
      email: normalizedEmail,
      user,
      email_verification_required: !user?.emailVerified,
      detail: "Verification email sent. Check your inbox before signing in.",
    };
  },

  async login({ email, password }) {
    if (!neonAuthEnabled) throw new Error("Neon Auth is not configured.");
    let result;
    try {
      result = await signInWithEmail({ email, password });
    } catch (error) {
      if (/verify|verification|email.*verified|not verified/i.test(error.message || "")) {
        return {
          verification_required: true,
          email,
          detail: "Please verify your email before continuing.",
        };
      }
      throw error;
    }
    const signedInUser = result?.user || result?.session?.user || null;
    if (signedInUser && signedInUser.emailVerified === false) {
      return {
        verification_required: true,
        email: signedInUser.email || email,
        detail: "Please verify your email before continuing.",
      };
    }
    return this.me();
  },

  me(session = null) {
    if (neonAuthEnabled) {
      return (session ? Promise.resolve(session) : getNeonSession())
        .then((currentSession) => ({
          session: currentSession,
          user: normalizeNeonUser(currentSession?.user),
        }))
        .then(({ session: currentSession, user }) => hydrateNeonProfile(user, currentSession));
    }
    return apiRequest("/auth/session");
  },

  updateProfile(payload) {
    if (neonAuthEnabled) {
      return neonClient.auth.updateUser({ name: payload.name, image: payload.profile_image }).then((result) => {
        if (result?.error) throw new Error(result.error.message || "Unable to update your profile.");
        return normalizeNeonUser(result?.data?.user || result?.user);
      });
    }
    return apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) });
  },

  logout() {
    if (neonAuthEnabled) {
      neonClient.auth.signOut().catch(() => {});
    }
    localStorage.removeItem("techtalk-google-pending");
    localStorage.removeItem("techtalk-google-session");
  },

  hasToken() {
    return Boolean(
      neonAuthEnabled && neonClient
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

async function hydrateNeonProfile(neonUser, session = null) {
  try {
    const currentSession = session || (await getNeonSession());
    const sessionUser = currentSession?.user || currentSession;
    const normalized = normalizeNeonUser(sessionUser);
    const profile = await apiRequest("/users/me", { useNeonToken: true, neonSession: currentSession });
    return { ...normalized, ...profile, name: profile.name || normalized.name, profile_image: profile.profile_image || normalized.profile_image };
  } catch (error) {
    throw new Error(`Signed in, but your member profile could not be created: ${error.message}`);
  }
}
