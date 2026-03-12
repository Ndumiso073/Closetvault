import { Check } from "lucide-react";

// ── Shared styles used by both LoginPage and RegisterPage ──────────────────
export const SHARED_CSS = `
  /* ── AUTH PAGE SHELL ── */
  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    font-family: 'Barlow', sans-serif;
    background: var(--black, #0a0a0a);
  }
  @media (min-width: 900px) {
    .auth-page { grid-template-columns: 1fr 1fr; }
  }

  /* ── LEFT PANEL (brand) ── */
  .auth-left {
    display: none;
    position: relative; overflow: hidden;
    background: var(--gray, #141414);
  }
  @media (min-width: 900px) { .auth-left { display: flex; flex-direction: column; } }

  .auth-left-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 30%;
    filter: brightness(.45) saturate(.7);
  }
  .auth-left-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,10,10,.55) 0%,
      rgba(10,10,10,.3) 40%,
      rgba(10,10,10,.92) 100%
    ), linear-gradient(
      to right,
      rgba(10,10,10,.7) 0%,
      transparent 60%
    );
  }
  .auth-left-scan {
    position: absolute; inset: 0; z-index: 1;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
    );
  }
  .auth-left-content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    height: 100%; padding: 44px 48px;
    justify-content: space-between;
  }

  .auth-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 5px;
    color: var(--white, #f5f5f0); text-decoration: none;
  }
  .auth-logo span { color: var(--accent, #ff2d00); }

  .auth-left-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
    color: var(--accent, #ff2d00); margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .auth-left-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--accent, #ff2d00); }
  .auth-left-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 3.5vw, 52px);
    line-height: .95; letter-spacing: -1px; color: var(--white, #f5f5f0);
    margin-bottom: 16px;
  }
  .auth-left-headline .hollow {
    -webkit-text-stroke: 1.5px var(--white, #f5f5f0); color: transparent;
  }
  .auth-left-headline .red { color: var(--accent, #ff2d00); }
  .auth-left-sub {
    font-size: 14px; font-weight: 300; line-height: 1.8;
    color: rgba(245,245,240,.55); max-width: 360px;
  }

  .auth-left-perks { display: flex; flex-direction: column; gap: 10px; }
  .auth-perk {
    display: flex; align-items: center; gap: 12px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(245,245,240,.6);
  }
  .auth-perk-dot {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,45,0,.12); border: 1px solid rgba(255,45,0,.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent, #ff2d00);
  }

  /* ── RIGHT PANEL (form) ── */
  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 48px 24px;
    min-height: 100vh;
  }
  .auth-form-wrap {
    width: 100%; max-width: 420px;
    animation: authIn .5s ease both;
  }
  @keyframes authIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  .auth-mobile-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px; letter-spacing: 4px;
    color: var(--white, #f5f5f0); margin-bottom: 32px;
    display: block;
  }
  .auth-mobile-logo span { color: var(--accent, #ff2d00); }
  @media (min-width: 900px) { .auth-mobile-logo { display: none; } }

  .auth-form-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(32px, 4vw, 44px);
    letter-spacing: 2px; line-height: .95; color: var(--white, #f5f5f0);
    margin-bottom: 6px;
  }
  .auth-form-title span { color: var(--accent, #ff2d00); }
  .auth-form-sub {
    font-size: 13px; font-weight: 300; color: rgba(255,255,255,.4);
    margin-bottom: 28px; line-height: 1.6;
  }
  .auth-form-sub a {
    color: var(--accent, #ff2d00); text-decoration: none; font-weight: 500;
  }
  .auth-form-sub a:hover { text-decoration: underline; }

  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 22px 0;
  }
  .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
  .auth-divider-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.2);
  }

  .auth-google {
    width: 100%; padding: 13px 20px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    color: var(--white, #f5f5f0); cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all .2s;
  }
  .auth-google:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }
  .auth-google-icon { width: 18px; height: 18px; flex-shrink: 0; }

  /* ── FORM FIELDS ── */
  .auth-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .auth-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,.4);
  }
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,.2); pointer-events: none;
    display: flex; align-items: center;
  }
  .auth-input {
    width: 100%; background: var(--mid, #1e1e1e);
    border: 1px solid rgba(255,255,255,.08);
    color: var(--white, #f5f5f0);
    font-family: 'Barlow', sans-serif; font-size: 14px;
    padding: 12px 14px 12px 40px;
    outline: none; transition: border-color .2s;
  }
  .auth-input:focus { border-color: var(--accent, #ff2d00); }
  .auth-input.err { border-color: var(--accent, #ff2d00); }
  .auth-input.ok  { border-color: #22c55e; }
  .auth-input::placeholder { color: rgba(255,255,255,.18); font-size: 13px; }
  .auth-input-no-icon { padding-left: 14px; }

  .auth-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,.25); transition: color .2s; display: flex;
  }
  .auth-pw-toggle:hover { color: rgba(255,255,255,.6); }

  .auth-input-ok {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: #22c55e;
  }

  .auth-err-msg {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 1px;
    color: var(--accent, #ff2d00);
    display: flex; align-items: center; gap: 4px;
  }

  .pw-strength { margin-top: 6px; }
  .pw-strength-bars { display: flex; gap: 4px; margin-bottom: 4px; }
  .pw-bar {
    flex: 1; height: 3px;
    background: rgba(255,255,255,.08); transition: background .3s;
  }
  .pw-bar.weak   { background: var(--accent, #ff2d00); }
  .pw-bar.fair   { background: #f59e0b; }
  .pw-bar.strong { background: #22c55e; }
  .pw-strength-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  }
  .pw-strength-label.weak   { color: var(--accent, #ff2d00); }
  .pw-strength-label.fair   { color: #f59e0b; }
  .pw-strength-label.strong { color: #22c55e; }

  .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .auth-row { grid-template-columns: 1fr; } }

  .auth-check-row {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 20px; cursor: pointer;
  }
  .auth-checkbox {
    width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;
    border: 1px solid rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .auth-checkbox.on { background: var(--accent, #ff2d00); border-color: var(--accent, #ff2d00); }
  .auth-checkbox.on::after { content: '✓'; font-size: 10px; color: white; font-weight: 900; line-height: 1; }
  .auth-check-label {
    font-size: 12px; font-weight: 300; color: rgba(255,255,255,.4); line-height: 1.6;
  }
  .auth-check-label a { color: var(--accent, #ff2d00); text-decoration: none; }
  .auth-check-label a:hover { text-decoration: underline; }

  .auth-submit {
    width: 100%; font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    background: var(--accent, #ff2d00); color: var(--white, #f5f5f0);
    border: none; padding: 15px; cursor: pointer;
    clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .25s; position: relative; overflow: hidden;
    margin-bottom: 16px;
  }
  .auth-submit::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-120%) skewX(-15deg); transition: transform .4s ease;
  }
  .auth-submit:hover::after { transform: translateX(120%) skewX(-15deg); }
  .auth-submit:hover { background: #ff5533; transform: translateY(-2px); }
  .auth-submit:disabled { opacity: .5; pointer-events: none; }
  .auth-submit.loading { pointer-events: none; opacity: .8; }

  .auth-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; margin-bottom: 16px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 1px;
    border: 1px solid;
  }
  .auth-alert.error   { background: rgba(255,45,0,.08); border-color: rgba(255,45,0,.25); color: var(--accent, #ff2d00); }
  .auth-alert.success { background: rgba(34,197,94,.08); border-color: rgba(34,197,94,.25); color: #22c55e; }

  .auth-forgot {
    display: flex; justify-content: flex-end; margin-top: -8px; margin-bottom: 14px;
  }
  .auth-forgot a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,.3); text-decoration: none; transition: color .2s;
  }
  .auth-forgot a:hover { color: var(--accent, #ff2d00); }

  .auth-spinner { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── Shared left branding panel ─────────────────────────────────────────────
export function AuthLeft({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="auth-left">
      <div
        className="auth-left-bg"
        style={{ backgroundImage: "url('/assets/danny-greenberg.jpg')" }}
      />
      <div className="auth-left-gradient" />
      <div className="auth-left-scan" />
      <div className="auth-left-content">
        <div>
          <div className="auth-left-eyebrow">
            {mode === "login" ? "Welcome Back" : "Join the Vault"}
          </div>
          <h2 className="auth-left-headline">
            {mode === "login" ? (
              <>YOUR<br /><span className="hollow">STYLE</span><br /><span className="red">AWAITS.</span></>
            ) : (
              <>BUILD<br /><span className="hollow">YOUR</span><br /><span className="red">VAULT.</span></>
            )}
          </h2>
          <p className="auth-left-sub">
            {mode === "login"
              ? "Sign in to access your personal vault, wishlist, and order history."
              : "Create your account and start building your personal streetwear archive."}
          </p>
        </div>

        <div className="auth-left-perks">
          {[
            "Personal wardrobe vault",
            "5,000+ streetwear listings",
            "Price drop alerts",
            "Verified sellers only",
          ].map(p => (
            <div key={p} className="auth-perk">
              <div className="auth-perk-dot"><Check size={10} strokeWidth={3} /></div>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Google sign-in button (reused in both forms) ───────────────────────────
export function GoogleButton() {
  return (
    <button className="auth-google">
      <svg className="auth-google-icon" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
}

// ── Password strength checker ──────────────────────────────────────────────
export function pwStrength(pw: string): { level: 0|1|2|3; label: string; cls: string } {
  if (!pw) return { level: 0, label: "", cls: "" };
  const has = (r: RegExp) => r.test(pw);
  const score =
    (pw.length >= 8 ? 1 : 0) +
    (has(/[A-Z]/) ? 1 : 0) +
    (has(/[0-9]/) ? 1 : 0) +
    (has(/[^a-zA-Z0-9]/) ? 1 : 0);
  if (score <= 1) return { level: 1, label: "Weak",   cls: "weak"   };
  if (score <= 2) return { level: 2, label: "Fair",   cls: "fair"   };
  return              { level: 3, label: "Strong", cls: "strong" };
}
