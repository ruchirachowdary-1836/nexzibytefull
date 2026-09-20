import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { neonAuthEnabled, sendNeonVerificationCode, verifyNeonVerificationCode } from "../lib/neon.js";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: Boolean(params.get("token")), message: "" });
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [emailInput, setEmailInput] = useState(params.get("email") || "");
  const email = params.get("email") || emailInput.trim();
  const isNeonCode = neonAuthEnabled && params.get("provider") === "neon";

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setState({ loading: false, message: "Enter the six-digit code sent to your email to finish signing in or creating your account." });
      return;
    }
    apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((response) => {
        if (response.access_token) {
          localStorage.setItem("techtalk-token", response.access_token);
          localStorage.setItem("techtalk-refresh-token", response.refresh_token);
          navigate("/profile", { replace: true });
          return;
        }
        setState({ loading: false, message: response.detail });
      })
      .catch((error) => setState({ loading: false, message: error.message, error: true }));
  }, [params]);

  const verifyCode = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setState({ loading: false, message: "Enter the six-digit verification code.", error: true });
      return;
    }
    setState({ loading: true, message: "" });
    try {
      const response = isNeonCode
        ? await verifyNeonVerificationCode(email, code)
        : await apiRequest("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ code }),
          });
      if (response?.access_token) {
        localStorage.setItem("techtalk-token", response.access_token);
        localStorage.setItem("techtalk-refresh-token", response.refresh_token);
        navigate("/profile", { replace: true });
      } else {
        setState({ loading: false, message: response?.detail || "Email verified. You are now signed in." });
      }
    } catch (error) {
      setState({ loading: false, message: error.message, error: true });
    }
  };

  const resendCode = async () => {
    if (!email) {
      setState({ loading: false, message: "Enter the email address used to create your account.", error: true });
      return;
    }
    setResending(true);
    try {
      if (isNeonCode) {
        await sendNeonVerificationCode(email);
      } else {
        await apiRequest("/auth/resend-verification", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
      }
      setState({ loading: false, message: "A new verification code was sent to your email." });
    } catch (error) {
      setState({ loading: false, message: error.message, error: true });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: "620px", textAlign: "center" }}>
        {state.loading ? <p>Verifying your email...</p> : (
          <>
            {state.error ? <XCircle size={48} color="#dc2626" /> : <CheckCircle2 size={48} color="#059669" />}
            <h1 className="section-heading">{state.error ? "Verification failed" : "Email verified"}</h1>
            <p className="section-subtitle">{state.message}</p>
            {!params.get("token") && !state.error && !state.message.startsWith("Email verified") && (
              <form onSubmit={verifyCode} style={{ display: "grid", gap: "12px", margin: "24px auto", maxWidth: "320px" }}>
                {!params.get("email") && (
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    placeholder="Email used for your account"
                    autoComplete="email"
                    required
                    aria-label="Account email"
                  />
                )}
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit verification code"
                  aria-label="Email verification code"
                />
                <button className="btn btn-primary" type="submit">Verify code</button>
                <button className="btn btn-secondary" type="button" onClick={resendCode} disabled={resending}>
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </form>
            )}
            <Link className="btn btn-primary" to="/login">Continue to sign in</Link>
          </>
        )}
      </div>
    </div>
  );
}
