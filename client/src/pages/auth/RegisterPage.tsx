import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Check } from "lucide-react";
import { SHARED_CSS, AuthLeft, GoogleButton, pwStrength } from "./_shared";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ firstName: "", lastName: "", email: "", username: "", password: "", confirm: "" });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [alert, setAlert]     = useState<{ type: "error"|"success"; msg: string } | null>(null);

  const upd = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const strength = pwStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())          e.firstName = "Required";
    if (!form.lastName.trim())           e.lastName  = "Required";
    if (!form.email.includes("@"))       e.email     = "Invalid email";
    if (form.username.length < 3)        e.username  = "Min 3 characters";
    if (form.password.length < 8)        e.password  = "Min 8 characters";
    if (form.password !== form.confirm)  e.confirm   = "Passwords don't match";
    if (!agreed)                         e.terms     = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setAlert(null);
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          username: form.username,
        },
      },
    });
    if (error) {
      setAlert({ type: "error", msg: error.message });
      setLoading(false);
    } else {
      setAlert({ type: "success", msg: "Account created! Check your email to confirm, then sign in." });
      setTimeout(() => navigate("/auth/login"), 2000);
    }
  };

  return (
    <>
      <style>{SHARED_CSS}</style>
      <div className="auth-page">
        <AuthLeft mode="register" />

        <div className="auth-right" style={{ alignItems: "flex-start", paddingTop: 48, paddingBottom: 48 }}>
          <div className="auth-form-wrap">
            <Link to="/" className="auth-mobile-logo">CLOSET<span>VAULT</span></Link>

            <h1 className="auth-form-title">CREATE <span>ACCOUNT</span></h1>
            <p className="auth-form-sub">
              Already have an account? <Link to="/auth/login">Sign in →</Link>
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

            {/* name row */}
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">First Name</label>
                <div className="auth-input-wrap">
                  <input
                    className={`auth-input auth-input-no-icon ${errors.firstName ? "err" : form.firstName ? "ok" : ""}`}
                    placeholder="Jordan"
                    value={form.firstName}
                    onChange={e => upd("firstName", e.target.value)}
                  />
                  {form.firstName && !errors.firstName && (
                    <span className="auth-input-ok"><Check size={13} /></span>
                  )}
                </div>
                {errors.firstName && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.firstName}</span>}
              </div>
              <div className="auth-field">
                <label className="auth-label">Last Name</label>
                <div className="auth-input-wrap">
                  <input
                    className={`auth-input auth-input-no-icon ${errors.lastName ? "err" : form.lastName ? "ok" : ""}`}
                    placeholder="Khumalo"
                    value={form.lastName}
                    onChange={e => upd("lastName", e.target.value)}
                  />
                  {form.lastName && !errors.lastName && (
                    <span className="auth-input-ok"><Check size={13} /></span>
                  )}
                </div>
                {errors.lastName && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.lastName}</span>}
              </div>
            </div>

            {/* email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Mail size={14} /></span>
                <input
                  className={`auth-input ${errors.email ? "err" : form.email.includes("@") ? "ok" : ""}`}
                  type="email" placeholder="you@email.com"
                  value={form.email}
                  onChange={e => upd("email", e.target.value)}
                />
                {form.email.includes("@") && (
                  <span className="auth-input-ok"><Check size={13} /></span>
                )}
              </div>
              {errors.email && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.email}</span>}
            </div>

            {/* username */}
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon" style={{ fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "rgba(255,255,255,.2)", left: 12, letterSpacing: 1 }}>@</span>
                <input
                  className={`auth-input ${errors.username ? "err" : form.username.length >= 3 ? "ok" : ""}`}
                  placeholder="vaultking"
                  value={form.username}
                  onChange={e => upd("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
                />
              </div>
              {errors.username && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.username}</span>}
            </div>

            {/* password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={14} /></span>
                <input
                  className={`auth-input ${errors.password ? "err" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => upd("password", e.target.value)}
                  style={{ paddingRight: 40 }}
                />
                <button className="auth-pw-toggle" onClick={() => setShowPw(s => !s)} type="button">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.password}</span>}
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-strength-bars">
                    {[1, 2, 3].map(n => (
                      <div key={n} className={`pw-bar ${strength.level >= n ? strength.cls : ""}`} />
                    ))}
                  </div>
                  <span className={`pw-strength-label ${strength.cls}`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* confirm password */}
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={14} /></span>
                <input
                  className={`auth-input ${errors.confirm ? "err" : form.confirm && form.confirm === form.password ? "ok" : ""}`}
                  type={showCf ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={e => upd("confirm", e.target.value)}
                  style={{ paddingRight: 40 }}
                />
                <button className="auth-pw-toggle" onClick={() => setShowCf(s => !s)} type="button">
                  {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {form.confirm && form.confirm === form.password && (
                  <span className="auth-input-ok" style={{ right: 36 }}><Check size={13} /></span>
                )}
              </div>
              {errors.confirm && <span className="auth-err-msg"><AlertCircle size={10} /> {errors.confirm}</span>}
            </div>

            {/* terms */}
            <div className="auth-check-row" onClick={() => setAgreed(a => !a)}>
              <div className={`auth-checkbox ${agreed ? "on" : ""}`} />
              <span className="auth-check-label">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </span>
            </div>
            {errors.terms && (
              <span className="auth-err-msg" style={{ marginTop: -12, marginBottom: 12, display: "flex" }}>
                <AlertCircle size={10} /> {errors.terms}
              </span>
            )}

            <button
              className={`auth-submit ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><svg className="auth-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
