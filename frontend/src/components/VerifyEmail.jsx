import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "../lib/api.js";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, message: "" });

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setState({ loading: false, message: "This verification link is missing its token.", error: true });
      return;
    }
    apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((response) => setState({ loading: false, message: response.detail }))
      .catch((error) => setState({ loading: false, message: error.message, error: true }));
  }, [params]);

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
