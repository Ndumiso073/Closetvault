import { Link } from "react-router-dom";

const IMG_HERO    = "/src/assets/cool-sunny.jpg";
const IMG_STREET1 = "/src/assets/SUPERSTARS.jpg";
const IMG_STREET2 = "/src/assets/jordans.jpg";
const IMG_KICKS   = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80";
const IMG_VAULT   = "/src/assets/air 1.jpg";
const IMG_CLOSET  = "/src/assets/watches.jpg";

export default function LandingPage() {
  return (
    <>
      <style>{`
        :root {
          --section-pad-mobile:  56px;
          --section-pad-tablet:  72px;
          --section-pad-desktop: 96px;
          --max-w:               1280px;
          --side-pad-mobile:     20px;
          --side-pad-tablet:     40px;
          --side-pad-desktop:    60px;
        }

        html, body { scroll-behavior: smooth; }

        /* Professional container system */
        .container {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
          padding: 0 var(--side-pad-mobile);
        }

        @media (min-width: 768px) {
          .container { padding: 0 var(--side-pad-tablet); }
        }

        @media (min-width: 1024px) {
          .container { padding: 0 var(--side-pad-desktop); }
        }

        /* Section spacing */
        .section {
          padding: var(--section-pad-mobile) 0;
        }

        @media (min-width: 768px) {
          .section { padding: var(--section-pad-tablet) 0; }
        }

        @media (min-width: 1024px) {
          .section { padding: var(--section-pad-desktop) 0; }
        }

        /* Hero - balanced height */
        .hero {
          position: relative; width: 100%;
          height: 85vh;
          max-height: 720px;
          min-height: 500px;
          display: flex; align-items: center;
          overflow: hidden;
          padding-top: var(--nav-h);
        }
        .hero-img {
          position: absolute; inset: 0; z-index: 0;
          background-image: url('${IMG_HERO}');
          background-size: cover;
          background-position: center 40%;
          background-repeat: no-repeat;
        }
        .hero-img::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(10,10,10,0.88) 0%,
            rgba(10,10,10,0.55) 50%,
            rgba(10,10,10,0.25) 100%
          ),
          linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%);
        }
        .hero-img::before {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
        }
        .hero-content {
          position: relative; z-index: 2;
          width: 100%;
          display: flex; flex-direction: column; align-items: flex-start;
        }
        .hero-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
          animation: fadeUp .6s ease .1s both;
        }
        .hero-tag::before, .hero-tag::after {
          content: ''; width: 28px; height: 1px; background: var(--accent);
        }
        .hero-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 80px);
          line-height: .92; letter-spacing: -1px; color: var(--white);
          animation: fadeUp .7s ease .2s both;
        }
        .hero-headline .hollow {
          -webkit-text-stroke: 2px var(--white); color: transparent;
        }
        .hero-headline .red { color: var(--accent); }
        .hero-sub {
          font-size: 15px; font-weight: 300; color: rgba(245,245,240,0.75);
          max-width: 400px; line-height: 1.8; margin: 20px 0 32px;
          animation: fadeUp .7s ease .35s both;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          animation: fadeUp .7s ease .5s both;
        }

        /* Buttons */
        .btn-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 13px 32px; cursor: pointer; text-decoration: none;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition: all .25s;
          display: inline-flex; align-items: center; gap: 8px;
          position: relative; overflow: hidden; white-space: nowrap;
        }
        .btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.18);
          transform: translateX(-120%) skewX(-15deg);
          transition: transform .45s ease;
        }
        .btn-primary:hover::after { transform: translateX(120%) skewX(-15deg); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,45,0,0.4); }

        .btn-ghost {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 3px; text-transform: uppercase;
          background: transparent; color: var(--white);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 12px 28px; cursor: pointer; text-decoration: none;
          transition: all .2s;
          display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
        }
        .btn-ghost:hover { border-color: var(--white); background: rgba(255,255,255,0.06); }

        /* Ticker */
        .ticker-wrap {
          background: var(--accent);
          overflow: hidden; white-space: nowrap;
          padding: 11px 0; width: 100%;
          contain: layout;
        }
        .ticker-inner { display: inline-flex; animation: ticker 22s linear infinite; }
        .ticker-item {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 4px;
          color: var(--white); padding: 0 32px;
          display: flex; align-items: center; gap: 32px;
        }
        .ticker-item::after { content: '◆'; font-size: 7px; opacity: .65; }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Section helpers */
        .section-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 10px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--accent); }
        .section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 3.8vw, 52px);
          letter-spacing: 2px; line-height: 1.05;
          margin-bottom: 32px; color: var(--white);
        }
        .section-heading em {
          font-style: normal;
          -webkit-text-stroke: 1px var(--white); color: transparent;
        }

        /* Features - controlled image heights */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 3px; width: 100%;
        }
        .feat {
          background: var(--gray); overflow: hidden;
          transition: transform .3s; min-width: 0;
          display: flex; flex-direction: column;
        }
        .feat:hover { transform: translateY(-4px); }
        .feat-img {
          width: 100%; height: 220px; overflow: hidden; flex-shrink: 0;
        }
        .feat-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease; filter: brightness(0.8) saturate(0.7);
        }
        .feat:hover .feat-img img { transform: scale(1.06); filter: brightness(0.9) saturate(1); }
        .feat-body {
          padding: 24px 20px; flex: 1;
          position: relative;
        }
        .feat-body::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: var(--accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .4s ease;
        }
        .feat:hover .feat-body::before { transform: scaleX(1); }
        .feat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px; line-height: 1;
          color: rgba(255,255,255,0.05); margin-bottom: 10px; transition: color .3s;
        }
        .feat:hover .feat-num { color: rgba(255,45,0,0.12); }
        .feat-icon {
          width: 32px; height: 32px; background: var(--mid);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
        }
        .feat-icon svg { width: 14px; height: 14px; stroke: var(--accent); fill: none; stroke-width: 2; }
        .feat-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 6px; color: var(--white);
        }
        .feat-text { font-size: 13px; font-weight: 300; line-height: 1.7; color: var(--dim); }

        /* Vault section - controlled image height */
        .vault-wrap {
          position: relative; overflow: hidden;
        }
        .vault-wrap::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 85% 50%, rgba(255,45,0,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .vault-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: center;
        }
        .vault-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,45,0,0.08);
          border: 1px solid rgba(255,45,0,0.25);
          padding: 5px 12px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 18px;
        }
        .vault-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 3.8vw, 52px);
          letter-spacing: 1px; line-height: 1.05;
          margin-bottom: 14px; color: var(--white);
        }
        .vault-text {
          font-size: 14px; font-weight: 300; line-height: 1.8;
          color: var(--dim); margin-bottom: 28px; max-width: 420px;
        }
        .vault-stats {
          display: flex; gap: 36px; margin-bottom: 32px; flex-wrap: wrap;
        }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px; color: var(--white); line-height: 1;
        }
        .stat-num span { color: var(--accent); }
        .stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-top: 3px;
        }
        .vault-img-wrap {
          position: relative; overflow: hidden;
          clip-path: polygon(20px 0%,100% 0%,calc(100% - 20px) 100%,0% 100%);
          max-height: 440px;
        }
        .vault-img-wrap img {
          width: 100%; height: 100%;
          max-height: 440px;
          object-fit: cover;
          display: block;
          filter: brightness(0.85) saturate(0.85);
          transition: transform .6s ease, filter .4s;
        }
        .vault-img-wrap:hover img { transform: scale(1.04); filter: brightness(1) saturate(1); }
        .vault-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 60%);
        }
        .vault-img-tag {
          position: absolute; bottom: 16px; left: 16px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 3px;
          color: var(--white); opacity: .7;
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 3px; width: 100%;
        }
        .step {
          background: var(--gray); padding: 28px 20px;
          position: relative; min-width: 0;
          border-top: 2px solid rgba(255,255,255,0.05);
          transition: border-color .3s;
        }
        .step:hover { border-color: var(--accent); }
        .step-connector {
          position: absolute; right: -10px; top: 28px;
          font-size: 13px; color: var(--accent); z-index: 2; font-weight: bold;
        }
        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px; color: var(--accent);
          opacity: .22; line-height: 1; margin-bottom: 12px;
        }
        .step-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 6px; color: var(--white);
        }
        .step-text { font-size: 13px; font-weight: 300; line-height: 1.7; color: var(--dim); }

        /* Editorial strip */
        .section-editorial {
          width: 100%; position: relative; overflow: hidden;
          min-height: 380px;
          display: flex; align-items: center;
          padding: 72px 0;
        }
        .editorial-img {
          position: absolute; inset: 0;
          background-image: url('${IMG_CLOSET}');
          background-size: cover; background-position: center;
          filter: brightness(0.4) saturate(0.5);
        }
        .editorial-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(10,10,10,0.95) 0%,
            rgba(10,10,10,0.65) 50%,
            rgba(10,10,10,0.2) 100%
          );
        }
        .editorial-content {
          position: relative; z-index: 2;
          width: 100%;
        }
        .editorial-inner { max-width: 540px; }
        .editorial-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          line-height: .96; letter-spacing: 2px; color: var(--white);
          margin-bottom: 16px;
        }
        .editorial-headline span { color: var(--accent); }
        .editorial-sub {
          font-size: 14px; font-weight: 300; color: var(--dim);
          line-height: 1.8; margin-bottom: 28px; max-width: 380px;
        }

        /* CTA */
        .cta-wrap { text-align: center; position: relative; overflow: hidden; }
        .cta-glow {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,45,0,0.08) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          pointer-events: none;
        }
        .cta-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 16px;
          position: relative; z-index: 1;
        }
        .cta-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 7vw, 88px);
          letter-spacing: 2px; line-height: .95;
          margin-bottom: 20px; position: relative; z-index: 1;
        }
        .cta-title .outline {
          -webkit-text-stroke: 1.5px var(--white); color: transparent;
        }
        .cta-sub {
          font-size: 14px; font-weight: 300; color: var(--dim);
          margin-bottom: 36px; position: relative; z-index: 1;
          max-width: 340px; line-height: 1.8; margin-left: auto; margin-right: auto;
        }
        .cta-actions {
          display: flex; gap: 12px; justify-content: center;
          position: relative; z-index: 1; flex-wrap: wrap;
        }

        /* Footer - centered content */
        footer {
          padding: 40px var(--side-pad-mobile) 28px;
          background: var(--black);
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          text-align: center !important;
        }

        @media (min-width: 768px) {
          footer { padding: 40px var(--side-pad-tablet) 28px; }
        }

        @media (min-width: 1024px) {
          footer { padding: 40px var(--side-pad-desktop) 28px; }
        }

        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 4px; color: var(--white);
        }
        .footer-logo span { color: var(--accent); }
        .footer-copy { font-size: 12px; color: var(--dim); letter-spacing: 1px; }
        .footer-links { 
          display: flex; 
          gap: 24px; 
          flex-wrap: wrap; 
          justify-content: center !important;
          align-items: center !important;
          width: 100%;
        }
        .footer-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); text-decoration: none; transition: color .2s;
        }
        .footer-links a:hover { color: var(--white); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .step-connector { display: none; }
          .vault-inner { grid-template-columns: 1fr; gap: 36px; }
          .vault-img-wrap { max-height: 360px; }
          .vault-img-wrap img { max-height: 360px; }
        }

        @media (max-width: 768px) {
          :root {
            --nav-h: 56px;
          }
          .nav-links { display: none; }
          .hero {
            height: 85vh;
            max-height: 600px;
            min-height: 440px;
          }
          .features-grid { grid-template-columns: 1fr; }
          .feat-img { height: 180px; }
          .steps-grid { grid-template-columns: 1fr 1fr; }
          .vault-stats { gap: 20px; }
          .cta-actions { flex-direction: column; align-items: center; }
          .footer { flex-direction: column; text-align: center; }
          .footer-links { justify-content: center; }
          .section-editorial { padding: 56px 0; }
          .editorial-inner { max-width: 100%; }
        }

        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; align-items: flex-start; width: 100%; }
          .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
          .vault-stats { gap: 16px; }
          .hero {
            max-height: 520px;
            min-height: 400px;
          }
        }
      `}</style>

      <div>

            {/* ── HERO ── */}
            <section className="hero">
              <div className="hero-img" />
              <div className="container">
                <div className="hero-content">
                  <div className="hero-tag">New Drop 2025 — Streetwear Marketplace</div>
                  <h1 className="hero-headline">
                    SHOP.<br />
                    <span className="hollow">STYLE</span><br />
                    <span className="red">VAULT.</span>
                  </h1>
                  <p className="hero-sub">
                    Shop the hottest streetwear & sneakers from top sellers. 
                    Save everything to your personal vault and get smart recommendations.
                  </p>
                  <div className="hero-actions">
                    <Link to="/shop" className="btn-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="17" y2="8"/>
                      </svg>
                      Shop Now
                    </Link>
                    <Link to="/vault" className="btn-ghost">My Vault →</Link>
                 </div>
                </div>
              </div>
            </section>


        {/* ── TICKER ── */}
        <div className="ticker-wrap" aria-hidden="true">
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: "flex" }}>
                {["SHOP STREETWEAR & SNEAKERS","MULTI-SELLER MARKETPLACE","SAVE TO YOUR VAULT","SMART RECOMMENDATIONS","LIMITED DROPS","SECURE CHECKOUT"].map((t, j) => (
                  <div key={j} className="ticker-item">{t}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="section section--dark">
          <div className="container">
            <div className="section-eyebrow">Why ClosetVault</div>
            <div className="section-heading">BUILT FOR<br /><em>STYLE HUNTERS</em></div>
            <div className="features-grid">
              {[
                {
                  num: "01", img: IMG_STREET1, alt: "Street fashion",
                  icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
                  title: "Marketplace Shopping",
                  text: "Browse thousands of streetwear & sneakers from top sellers. Filter by brand, style, price, and rarity.",
                },
                {
                  num: "02", img: IMG_STREET2, alt: "Fashion style",
                  icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
                  title: "Closet Vault",
                  text: "Save your favorite pieces, organize collections, and track wishlist. Your personal style archive.",
                },
                {
                  num: "03", img: IMG_KICKS, alt: "Sneakers",
                  icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
                  title: "Smart Recommendations",
                  text: "Get personalized suggestions based on your vault, browsing history, and purchase patterns.",
                },
              ].map((f) => (
                <div key={f.num} className="feat">
                  <div className="feat-img">
                    <img src={f.img} alt={f.alt} loading="lazy" />
                  </div>
                  <div className="feat-body">
                    <div className="feat-num">{f.num}</div>
                    <div className="feat-icon"><svg viewBox="0 0 24 24">{f.icon}</svg></div>
                    <div className="feat-title">{f.title}</div>
                    <p className="feat-text">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VAULT SECTION ── */}
        <section className="section section--gray vault-wrap">
          <div className="container">
            <div className="vault-inner">
              <div>
                <div className="vault-badge">⚡ Your Personal Vault</div>
                <h2 className="vault-title">EVERYTHING<br />IN ONE PLACE</h2>
                <p className="vault-text">
                  Save your favorite pieces, organize collections, and track prices — all synced across devices.
                  Your vault goes wherever you go.
                </p>
                <div className="vault-stats">
                  <div>
                    <div className="stat-num">5K<span>+</span></div>
                    <div className="stat-label">Listings</div>
                  </div>
                  <div>
                    <div className="stat-num">100<span>+</span></div>
                    <div className="stat-label">Sellers</div>
                  </div>
                  <div>
                    <div className="stat-num">24/7</div>
                    <div className="stat-label">New Drops</div>
                  </div>
                </div>
                <Link to="/vault" className="btn-primary" style={{ width: "fit-content" }}>
                  Open My Vault →
                </Link>
              </div>
              <div className="vault-img-wrap">
                <img src={IMG_VAULT} alt="Sneakers" loading="lazy" />
                <div className="vault-img-overlay" />
                <div className="vault-img-tag">FIND YOUR NEXT PAIR</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section section--dark">
          <div className="container">
            <div className="section-eyebrow">Process</div>
            <div className="section-heading">4 STEPS.<br /><em>THAT'S IT.</em></div>
            <div className="steps-grid">
              {[
                { num: "01", title: "Browse Marketplace",    text: "Explore thousands of streetwear & sneakers from verified sellers." },
                { num: "02", title: "Save to Vault",         text: "Add your favorite pieces to your personal collection with one click." },
                { num: "03", title: "Get Recommendations",    text: "Receive smart suggestions based on your style and browsing history." },
                { num: "04", title: "Checkout Securely",   text: "Buy with confidence through our secure payment system." },
              ].map((s, i, arr) => (
                <div key={s.num} className="step">
                  {i < arr.length - 1 && <span className="step-connector">→</span>}
                  <div className="step-num">{s.num}</div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDITORIAL STRIP ── */}
        <section className="section-editorial">
          <div className="editorial-img" />
          <div className="editorial-overlay" />
          <div className="editorial-content">
            <div className="editorial-inner">
              <div className="section-eyebrow" style={{ marginBottom: 14 }}>The ClosetVault Promise</div>
              <h2 className="editorial-headline">
                NEVER LOSE<br />
                A FIT<br />
                <span>AGAIN.</span>
              </h2>
              <p className="editorial-sub">
                We built ClosetVault for people who take style seriously.
                Every save, every purchase — your archive grows smarter every day.
              </p>
              <Link to="/shop" className="btn-primary">Start Shopping →</Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section section--gray cta-wrap">
          <div className="cta-glow" />
          <div className="cta-eyebrow">Ready to build your vault?</div>
          <h2 className="cta-title">
            SHOP.<br />
            <span className="outline">SAVE.</span><br />
            SLAY.
          </h2>
          <p className="cta-sub">
            Start building your streetwear collection today. Free forever. No catch.
          </p>
          <div className="cta-actions">
            <Link to="/shop" className="btn-primary">Start Shopping →</Link>
            <Link to="/vault" className="btn-ghost">View My Vault</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-logo">CLOSET<span>VAULT</span></div>
          <div className="footer-copy">© 2025 ClosetVault. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
}