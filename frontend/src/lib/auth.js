import { apiRequest } from "./api.js";
import {
  hasVerifiedNeonToken,
  neonAuthEnabled,
  neonClient,
  resendNeonVerification,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  waitForVerifiedNeonSession,
} from "./neon.js";

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
        return this.sendVerificationForSignIn(email);
      }
      throw error;
    }
    const signedInUser = result?.user || result?.session?.user || null;
    const session = await waitForVerifiedNeonSession({ attempts: 4, delayMs: 250 });
    const signedInEmail = typeof signedInUser?.email === "string"
      ? signedInUser.email
      : email;
    const expectedEmail = signedInEmail.trim().toLowerCase();
    const sessionEmail = typeof session?.user?.email === "string"
      ? session.user.email.trim().toLowerCase()
      : "";
    if (
      !session ||
      sessionEmail !== expectedEmail
    ) {
      return this.sendVerificationForSignIn(signedInEmail);
    }
    return this.me(session);
  },

  async sendVerificationForSignIn(email) {
    let detail = "Your email is not verified. We sent a new verification code; enter it to continue.";
    try {
      await resendNeonVerification(email);
    } catch (error) {
      detail = `Your email is not verified. We could not resend the code (${error.message}). You can retry from the verification screen.`;
    }
    return {
      verification_required: true,
      email,
      detail,
    };
  },

  async me(session = null) {
    if (neonAuthEnabled) {
      const currentSession = session && hasVerifiedNeonToken(session)
        ? session
        : await waitForVerifiedNeonSession();
      if (!currentSession) {
        throw new Error("Email verification is required before accessing this account.");
      }
      return hydrateNeonProfile(
        normalizeNeonUser(currentSession.user),
        currentSession,
      );
    }
    return apiRequest("/users/me");
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
    let currentSession = session;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (!currentSession) {
        currentSession = await waitForVerifiedNeonSession();
      }
      if (!currentSession) {
        throw new Error("Email verification is required before accessing this account.");
      }
      const sessionUser = currentSession?.user || currentSession;
      const normalized = normalizeNeonUser(sessionUser);
      try {
        const profile = await apiRequest("/users/me", {
          useNeonToken: true,
          neonSession: currentSession,
        });
        return {
          ...normalized,
          ...profile,
          name: profile.name || normalized.name,
          profile_image: profile.profile_image || normalized.profile_image,
        };
      } catch (error) {
        const isVerificationPropagation =
          error?.message === "Email verification is required before accessing this account";
        if (!isVerificationPropagation || attempt === 2) throw error;
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        currentSession = await waitForVerifiedNeonSession();
      }
    }
    throw new Error("Unable to load the authenticated member profile.");
  } catch (error) {
    throw new Error(`Signed in, but your member profile could not be created: ${error.message}`);
  }
}
