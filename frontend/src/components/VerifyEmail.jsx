import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck, RefreshCw, XCircle } from "lucide-react";
import { getNeonSession, resendNeonVerification, verifyNeonEmail, waitForNeonSession } from "../lib/neon.js";
import { useApp } from "../context/AppContext.jsx";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, hydrateCurrentUser } = useApp();
  const email = useMemo(() => params.get("email") || "", [params]);
  const purpose = params.get("purpose") || "signup";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("We've sent a verification code to your email.");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let mounted = true;
    getNeonSession().then((session) => {
      if (mounted && session?.user?.emailVerified) {
        setVerified(true);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((remaining) => (remaining <= 1 ? 0 : remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleCodeChange = (event) => {
    setError("");
    setCode(event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (code.length !== CODE_LENGTH) return;
    setLoading(true);
    setError("");
    try {
      await verifyNeonEmail(email, code);
      const session = await waitForNeonSession();
      if (session?.user) {
        const profile = await hydrateCurrentUser();
        setUser(profile);
        navigate("/profile", { replace: true });
        return;
      }
      throw new Error("Your email was verified, but the Neon Auth session is not ready yet.");
    } catch (verificationError) {
      setError(verificationError.message || "Unable to verify your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await resendNeonVerification(email);
      setMessage("A new verification code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (resendError) {
      setError(resendError.message || "Unable to resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="section-padding">
        <div className="container" style={{ maxWidth: "620px", textAlign: "center" }}>
          <CheckCircle2 size={52} color="#059669" />
          <h1 className="section-heading">Email verified successfully</h1>
          <p className="section-subtitle">Your account is ready. Continue to your TechTalk profile.</p>
          <Link className="btn btn-primary" to="/login">Continue to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: "520px" }}>
        <Link to={purpose === "signin" ? "/login" : "/register"} className="breadcrumb-back-link">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <div className="modal-content-card" style={{ marginTop: "28px", textAlign: "center", padding: "36px 30px" }}>
          <MailCheck size={48} color="#6C2BD9" />
          <h1 className="section-heading" style={{ marginTop: "16px" }}>Verify your email</h1>
          <p className="section-subtitle">{message}</p>
          {email && <p style={{ fontWeight: 700, color: "#334155", wordBreak: "break-word" }}>{email}</p>}
          <form onSubmit={handleVerify} style={{ marginTop: "24px" }}>
            <label htmlFor="verification-code" style={{ display: "block", textAlign: "left", fontWeight: 700, marginBottom: "8px" }}>
              6-digit verification code
            </label>
            <input
              id="verification-code"
              className="form-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern={`\\d{${CODE_LENGTH}}`}
              maxLength={CODE_LENGTH}
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              aria-describedby={error ? "verification-error" : undefined}
              style={{ letterSpacing: "0.35em", textAlign: "center", fontSize: "1.4rem" }}
            />
            {error && (
              <p id="verification-error" role="alert" style={{ color: "#b91c1c", display: "flex", gap: "6px", alignItems: "center", marginTop: "10px" }}>
                <XCircle size={16} /> {error}
              </p>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading || code.length !== CODE_LENGTH} style={{ width: "100%", marginTop: "18px" }}>
              {loading ? <><Loader2 size={16} className="spin" /> Verifying...</> : "Verify Email"}
            </button>
          </form>
          <button type="button" className="btn btn-secondary" onClick={handleResend} disabled={!email || cooldown > 0 || resending} style={{ width: "100%", marginTop: "12px" }}>
            <RefreshCw size={16} /> {resending ? "Sending..." : cooldown ? `Resend Code in ${cooldown}s` : "Resend Code"}
          </button>
          <Link to="/register" className="btn btn-ghost" style={{ width: "100%", marginTop: "8px" }}>Change Email</Link>
        </div>
      </div>
    </div>
  );
}
