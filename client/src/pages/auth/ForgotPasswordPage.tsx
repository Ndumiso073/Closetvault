import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Check, AlertCircle, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step,        setStep]        = useState<Step>("email");
  const [email,       setEmail]       = useState("");
  const [otp,         setOtp]         = useState(["","","","","",""]);
  const [newPass,     setNewPass]      = useState("");
  const [confirmPass, setConfirmPass]  = useState("");
  const [showPass,    setShowPass]     = useState(false);
  const [showConf,    setShowConf]     = useState(false);
  const [loading,     setLoading]      = useState(false);
  const [error,       setError]        = useState("");
  const [resendTimer, setResendTimer]  = useState(0);

  /* ── helpers ── */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const otpFull    = otp.every(d => d !== "");
  const passStrength = (() => {
    if (!newPass) return 0;
    let s = 0;
    if (newPass.length >= 8)          s++;
    if (/[A-Z]/.test(newPass))        s++;
    if (/[0-9]/.test(newPass))        s++;
    if (/[^a-zA-Z0-9]/.test(newPass)) s++;
    return s;
  })();
  const passLabel = ["","Weak","Fair","Good","Strong"][passStrength];
  const passColor = ["","#ff2d00","#f59e0b","#3b82f6","#22c55e"][passStrength];

  const startResendTimer = () => {
    setResendTimer(30);
    const t = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
  };

  /* ── step handlers ── */
  const handleEmailSubmit = () => {
    if (!emailValid) { setError("Please enter a valid email address"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); startResendTimer(); }, 1400);
  };

  const handleOtpSubmit = () => {
    if (!otpFull) { setError("Please enter all 6 digits"); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      if (otp.join("") === "000000") { setError("Invalid code. Try 123456."); setLoading(false); return; }
      setLoading(false); setStep("reset");
    }, 1200);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) {
      (document.getElementById(`otp-${idx + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      (document.getElementById(`otp-${idx - 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      (document.getElementById("otp-5") as HTMLInputElement)?.focus();
    }
  };

  const handleResetSubmit = () => {
    if (newPass.length < 8)           { setError("Password must be at least 8 characters"); return; }
    if (newPass !== confirmPass)       { setError("Passwords do not match"); return; }
    if (passStrength < 2)              { setError("Please choose a stronger password"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 1500);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(["","","","","",""]);
    setError("");
    startResendTimer();
  };

  return (
    <>
      <style>{`
        .fp-page {
          min-height: calc(100vh - var(--nav-h, 64px));
          background: var(--black);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 16px;
          position: relative; overflow: hidden;
        }

        /* background texture */
        .fp-page::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(255,45,0,.06) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(255,45,0,.04) 0%, transparent 45%);
        }
        .fp-page::after {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 40px,
            rgba(255,255,255,.012) 40px, rgba(255,255,255,.012) 41px
          );
        }

        /* card */
        .fp-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 440px;
          animation: fp-in .5s ease both;
        }
        @keyframes fp-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* logo strip */
        .fp-logo {
          text-align: center; margin-bottom: 32px;
        }
        .fp-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 8px; color: var(--white);
        }
        .fp-logo-text span { color: var(--accent); }
        .fp-logo-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
          color: var(--dim); margin-top: 2px;
        }

        /* step indicator */
        .fp-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 28px;
        }
        .fp-step-dot {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 1px;
          transition: all .3s;
        }
        .fp-step-dot.done   { color: var(--accent); border: 1px solid rgba(255,45,0,.4); background: rgba(255,45,0,.08); }
        .fp-step-dot.active { color: var(--white);  border: 1px solid rgba(255,255,255,.3); background: var(--mid); }
        .fp-step-dot.idle   { color: var(--dim);    border: 1px solid var(--border); }
        .fp-step-line {
          width: 40px; height: 1px;
          background: var(--border); transition: background .4s;
        }
        .fp-step-line.done { background: rgba(255,45,0,.35); }

        /* panel */
        .fp-panel {
          background: var(--gray);
          border: 1px solid rgba(255,255,255,.07);
          padding: 32px 28px;
        }
        @media(max-width:440px) { .fp-panel { padding: 24px 18px; } }

        /* panel top accent line */
        .fp-panel-accent {
          height: 2px; background: var(--accent);
          margin: -32px -28px 28px;
        }
        @media(max-width:440px) { .fp-panel-accent { margin: -24px -18px 24px; } }

        .fp-panel-icon {
          width: 52px; height: 52px;
          background: rgba(255,45,0,.08); border: 1px solid rgba(255,45,0,.2);
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          margin-bottom: 18px;
        }

        .fp-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 3px; color: var(--white);
          margin-bottom: 6px; line-height: 1;
        }
        .fp-panel-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; color: var(--dim); line-height: 1.7; margin-bottom: 24px;
        }
        .fp-panel-sub strong { color: var(--white); }

        /* inputs */
        .fp-field { margin-bottom: 16px; }
        .fp-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); display: block; margin-bottom: 7px;
        }
        .fp-input-wrap { position: relative; }
        .fp-input {
          width: 100%; background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          color: var(--white); font-family: 'Barlow', sans-serif; font-size: 14px;
          padding: 12px 14px; outline: none; transition: border-color .2s;
        }
        .fp-input:focus { border-color: var(--accent); }
        .fp-input::placeholder { color: rgba(255,255,255,.25); }
        .fp-input.err { border-color: #ff6b6b; }
        .fp-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--dim); pointer-events: none;
        }
        .fp-input.has-icon { padding-left: 38px; }
        .fp-input-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--dim);
          display: flex; padding: 4px; transition: color .2s;
        }
        .fp-input-toggle:hover { color: var(--white); }

        /* error */
        .fp-error {
          background: rgba(255,45,0,.08); border: 1px solid rgba(255,45,0,.2);
          padding: 10px 12px; margin-bottom: 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #ff6b6b;
          display: flex; align-items: center; gap: 8px;
          animation: fp-shake .3s ease;
        }
        @keyframes fp-shake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}
        }

        /* submit button */
        .fp-submit {
          width: 100%; font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white); border: none;
          padding: 14px; cursor: pointer;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition: all .25s; display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; overflow: hidden;
        }
        .fp-submit::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.16);
          transform: translateX(-110%) skewX(-15deg); transition: transform .4s ease;
        }
        .fp-submit:hover:not(:disabled)::after { transform: translateX(110%) skewX(-15deg); }
        .fp-submit:hover:not(:disabled) { background: #ff5533; }
        .fp-submit:disabled { opacity: .55; pointer-events: none; }

        .fp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,.25); border-top-color: #fff;
          border-radius: 50%; animation: fp-spin .6s linear infinite;
        }
        @keyframes fp-spin { to { transform: rotate(360deg); } }

        /* OTP inputs */
        .fp-otp-row {
          display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;
        }
        .fp-otp-input {
          width: 52px; height: 60px;
          background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          color: var(--white); font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 2px; text-align: center;
          outline: none; transition: all .2s; caret-color: var(--accent);
        }
        @media(max-width:400px) { .fp-otp-input { width:42px; height:52px; font-size:22px; } }
        .fp-otp-input:focus { border-color: var(--accent); background: rgba(255,45,0,.05); }
        .fp-otp-input.filled { border-color: rgba(255,255,255,.18); color: var(--accent); }

        /* resend */
        .fp-resend {
          text-align: center; margin-top: 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px; color: var(--dim);
        }
        .fp-resend-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          color: var(--accent); transition: opacity .2s; text-decoration: underline;
        }
        .fp-resend-btn:disabled { opacity: .4; cursor: default; text-decoration: none; }

        /* password strength */
        .fp-strength-row {
          display: flex; gap: 4px; margin-top: 8px; margin-bottom: 4px;
        }
        .fp-strength-bar {
          flex: 1; height: 3px; background: var(--mid); transition: background .3s;
        }
        .fp-strength-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1px; text-align: right;
          margin-bottom: 12px; transition: color .3s;
        }

        /* password rules */
        .fp-rules { margin-top: 8px; display: flex; flex-direction: column; gap: 5px; }
        .fp-rule {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          display: flex; align-items: center; gap: 6px; color: var(--dim);
          transition: color .2s;
        }
        .fp-rule.ok { color: #22c55e; }
        .fp-rule-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        /* success */
        .fp-success {
          text-align: center; padding: 8px 0 4px;
        }
        .fp-success-ring {
          width: 72px; height: 72px; border-radius: 50%;
          border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          animation: fp-pulse 2.5s ease-in-out infinite;
          background: rgba(255,45,0,.06);
        }
        @keyframes fp-pulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(255,45,0,.3); }
          50%{ box-shadow: 0 0 0 14px transparent; }
        }
        .fp-success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 3px; color: var(--white); margin-bottom: 8px;
        }
        .fp-success-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; color: var(--dim); line-height: 1.7; margin-bottom: 24px;
        }

        /* back link */
        .fp-back {
          display: flex; align-items: center; gap: 6px; justify-content: center;
          margin-top: 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); text-decoration: none; transition: color .2s;
        }
        .fp-back:hover { color: var(--white); }

        /* divider */
        .fp-divider {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }
        .fp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,.06); }
        .fp-divider-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim);
        }

        .fp-email-display {
          background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          padding: 10px 14px; margin-bottom: 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
          color: var(--white); display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div className="fp-page">
        <div className="fp-card">

          {/* logo */}
          <div className="fp-logo">
            <div className="fp-logo-text">CLOSET<span>VAULT</span></div>
            <div className="fp-logo-sub">Account Recovery</div>
          </div>

          {/* step indicator */}
          {step !== "done" && (
            <div className="fp-steps">
              {(["email","otp","reset"] as Step[]).map((s, i) => {
                const steps: Step[] = ["email","otp","reset"];
                const cur  = steps.indexOf(step);
                const isDone   = i < cur;
                const isActive = i === cur;
                return (
                  <>
                    <div key={s} className={`fp-step-dot ${isDone?"done":isActive?"active":"idle"}`}>
                      {isDone ? <Check size={11}/> : i + 1}
                    </div>
                    {i < 2 && <div key={`line-${i}`} className={`fp-step-line ${i < cur?"done":""}`}/>}
                  </>
                );
              })}
            </div>
          )}

          <div className="fp-panel">
            <div className="fp-panel-accent"/>

            {/* ══ STEP 1: EMAIL ══ */}
            {step === "email" && (
              <>
                <div className="fp-panel-icon"><Mail size={22} color="var(--accent)"/></div>
                <div className="fp-panel-title">FORGOT PASSWORD</div>
                <div className="fp-panel-sub">
                  Enter the email address linked to your ClosetVault account.
                  We'll send you a 6-digit reset code.
                </div>

                {error && (
                  <div className="fp-error"><AlertCircle size={13}/>{error}</div>
                )}

                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <div className="fp-input-wrap">
                    <Mail size={14} className="fp-input-icon" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--dim)",pointerEvents:"none"}}/>
                    <input
                      className={`fp-input has-icon ${error?"err":""}`}
                      type="email" placeholder="you@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                      autoFocus
                    />
                  </div>
                </div>

                <button className="fp-submit" onClick={handleEmailSubmit} disabled={loading || !email}>
                  {loading
                    ? <><div className="fp-spinner"/> Sending Code...</>
                    : <>Send Reset Code <ChevronRight size={14}/></>}
                </button>

                <div className="fp-divider">
                  <div className="fp-divider-line"/><div className="fp-divider-text">or</div><div className="fp-divider-line"/>
                </div>

                <Link to="/auth/login" className="fp-back"><ArrowLeft size={13}/> Back to Login</Link>
              </>
            )}

            {/* ══ STEP 2: OTP ══ */}
            {step === "otp" && (
              <>
                <div className="fp-panel-icon">
                  <Mail size={22} color="var(--accent)"/>
                </div>
                <div className="fp-panel-title">CHECK YOUR EMAIL</div>
                <div className="fp-panel-sub">
                  We sent a 6-digit code to <strong>{email}</strong>.
                  Enter it below to continue.
                </div>

                {error && (
                  <div className="fp-error"><AlertCircle size={13}/>{error}</div>
                )}

                <div className="fp-otp-row" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      className={`fp-otp-input ${digit?"filled":""}`}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button className="fp-submit" onClick={handleOtpSubmit} disabled={loading || !otpFull}>
                  {loading
                    ? <><div className="fp-spinner"/> Verifying...</>
                    : <>Verify Code <ChevronRight size={14}/></>}
                </button>

                <div className="fp-resend">
                  Didn't receive it?{" "}
                  <button className="fp-resend-btn" disabled={resendTimer > 0} onClick={handleResend}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>

                <button
                  className="fp-back"
                  style={{background:"none",border:"none",cursor:"pointer",width:"100%",marginTop:16}}
                  onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}>
                  <ArrowLeft size={13}/> Use a different email
                </button>
              </>
            )}

            {/* ══ STEP 3: NEW PASSWORD ══ */}
            {step === "reset" && (
              <>
                <div className="fp-panel-icon"><Lock size={22} color="var(--accent)"/></div>
                <div className="fp-panel-title">NEW PASSWORD</div>
                <div className="fp-panel-sub">
                  Choose a strong password for your ClosetVault account.
                  It must be at least 8 characters.
                </div>

                {error && (
                  <div className="fp-error"><AlertCircle size={13}/>{error}</div>
                )}

                {/* new password */}
                <div className="fp-field">
                  <label className="fp-label">New Password</label>
                  <div className="fp-input-wrap">
                    <Lock size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--dim)",pointerEvents:"none"}}/>
                    <input
                      className={`fp-input has-icon ${error && error.includes("match") ? "" : error ? "err" : ""}`}
                      type={showPass?"text":"password"} placeholder="Min. 8 characters"
                      value={newPass}
                      onChange={e => { setNewPass(e.target.value); setError(""); }}
                      style={{paddingRight:42}}
                      autoFocus
                    />
                    <button className="fp-input-toggle" onClick={() => setShowPass(p=>!p)}>
                      {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>

                  {/* strength meter */}
                  {newPass && (
                    <>
                      <div className="fp-strength-row">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="fp-strength-bar"
                            style={{ background: n <= passStrength ? passColor : undefined }}/>
                        ))}
                      </div>
                      <div className="fp-strength-label" style={{ color: passColor }}>{passLabel}</div>
                      <div className="fp-rules">
                        {[
                          { label:"At least 8 characters",  ok: newPass.length >= 8 },
                          { label:"One uppercase letter",    ok: /[A-Z]/.test(newPass) },
                          { label:"One number",              ok: /[0-9]/.test(newPass) },
                          { label:"One special character",   ok: /[^a-zA-Z0-9]/.test(newPass) },
                        ].map(r => (
                          <div key={r.label} className={`fp-rule ${r.ok?"ok":""}`}>
                            <div className="fp-rule-dot"/>
                            {r.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* confirm password */}
                <div className="fp-field">
                  <label className="fp-label">Confirm Password</label>
                  <div className="fp-input-wrap">
                    <Lock size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--dim)",pointerEvents:"none"}}/>
                    <input
                      className={`fp-input has-icon ${error && error.includes("match") ? "err" : ""}`}
                      type={showConf?"text":"password"} placeholder="Re-enter password"
                      value={confirmPass}
                      onChange={e => { setConfirmPass(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleResetSubmit()}
                      style={{paddingRight:42}}
                    />
                    <button className="fp-input-toggle" onClick={() => setShowConf(p=>!p)}>
                      {showConf ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  {confirmPass && newPass && (
                    <div style={{
                      marginTop:6,
                      fontFamily:"'Barlow Condensed'", fontSize:11, fontWeight:700, letterSpacing:1,
                      color: confirmPass === newPass ? "#22c55e" : "#ff6b6b",
                      display:"flex", alignItems:"center", gap:5
                    }}>
                      {confirmPass === newPass
                        ? <><Check size={11}/> Passwords match</>
                        : <><AlertCircle size={11}/> Passwords don't match</>}
                    </div>
                  )}
                </div>

                <button className="fp-submit" onClick={handleResetSubmit} disabled={loading || !newPass || !confirmPass}>
                  {loading
                    ? <><div className="fp-spinner"/> Resetting...</>
                    : <>Reset Password <ChevronRight size={14}/></>}
                </button>
              </>
            )}

            {/* ══ STEP 4: SUCCESS ══ */}
            {step === "done" && (
              <div className="fp-success">
                <div className="fp-success-ring"><Check size={28} color="var(--accent)"/></div>
                <div className="fp-success-title">ALL DONE!</div>
                <div className="fp-success-sub">
                  Your password has been reset successfully.<br/>
                  You can now log in with your new password.
                </div>
                <Link to="/auth/login" className="fp-submit" style={{display:"inline-flex",textDecoration:"none",justifyContent:"center"}}>
                  Go to Login <ChevronRight size={14}/>
                </Link>
              </div>
            )}

          </div>

          {/* bottom links */}
          {step === "email" && (
            <div style={{textAlign:"center",marginTop:20}}>
              <span style={{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:1,color:"var(--dim)"}}>
                New to ClosetVault?{" "}
              </span>
              <Link to="/auth/register" style={{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:1,color:"var(--accent)",textDecoration:"none"}}>
                Create an account →
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}