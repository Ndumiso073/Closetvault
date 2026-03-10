import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { SHARED_CSS, AuthLeft, GoogleButton } from "./_shared";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [alert, setAlert]       = useState<{ type: "error"|"success"; msg: string } | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (password.length < 6)  e.password = "Password must be 6+ characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    setAlert(null);
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      if (email === "demo@closet.vault" && password === "vault123") {
        setAlert({ type: "success", msg: "Welcome back! Redirecting..." });
        setTimeout(() => navigate("/vault"), 1200);
      } else {
        setAlert({ type: "error", msg: "Incorrect email or password. Try demo@closet.vault / vault123" });
        setLoading(false);
      }
    }, 1400);
  };

  return (
    <>
      <style>{SHARED_CSS}</style>
      <div className="auth-page">
        <AuthLeft mode="login" />

        <div className="auth-right">
          <div className="auth-form-wrap">
            <Link to="/" className="auth-mobile-logo">CLOSET<span>VAULT</span></Link>

            <h1 className="auth-form-title">SIGN <span>IN</span></h1>
            <p className="auth-form-sub">
              Don't have an account? <Link to="/auth/register">Create one →</Link>
            </p>

            <GoogleButton />

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            {alert && (
              <div className={`auth-alert ${alert.type}`}>
                <AlertCircle size={13} /> {alert.msg}
              </div>
            )}

            {/* email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Mail size={14} /></span>
                <input
                  className={`auth-input ${errors.email ? "err" : ""}`}
                  type="email" placeholder="you@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(x => ({ ...x, email: "" })); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
              </div>
              {errors.email && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.email}</span>}
            </div>

            {/* password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={14} /></span>
                <input
                  className={`auth-input ${errors.password ? "err" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(x => ({ ...x, password: "" })); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ paddingRight: 40 }}
                />
                <button className="auth-pw-toggle" onClick={() => setShowPw(s => !s)} type="button">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.password}</span>}
            </div>

            <div className="auth-forgot">
              <Link to="/auth/forgot">Forgot Password?</Link>
            </div>

            <button
              className={`auth-submit ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><svg className="auth-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.2)", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1 }}>
              Demo: demo@closet.vault / vault123
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
