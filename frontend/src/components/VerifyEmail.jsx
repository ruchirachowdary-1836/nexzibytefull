import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { getNeonSession } from "../lib/neon.js";
import { useApp } from "../context/AppContext.jsx";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [state, setState] = useState({ loading: false, message: "Verification email sent. Check your inbox and open the Neon Auth verification link." });

  useEffect(() => {
    let mounted = true;
    getNeonSession().then((session) => {
      if (!mounted) return;
      if (session?.user?.emailVerified) {
        setUser(session.user);
        navigate("/profile", { replace: true });
      }
    }).catch(() => {
      if (mounted) setState({ loading: false, message: "Unable to verify email. Please open the link from Neon Auth again.", error: true });
    });
    return () => { mounted = false; };
  }, [navigate, setUser]);

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: "620px", textAlign: "center" }}>
        {state.loading ? <p>Verifying your email...</p> : (
          <>
            {state.error ? <XCircle size={48} color="#dc2626" /> : <CheckCircle2 size={48} color="#059669" />}
            <h1 className="section-heading">{state.error ? "Verification failed" : "Email verified"}</h1>
            <p className="section-subtitle">{state.message}</p>
            <Link className="btn btn-primary" to="/login">Continue to sign in</Link>
          </>
        )}
      </div>
    </div>
  );
}
