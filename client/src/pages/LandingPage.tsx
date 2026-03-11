import { Link } from "react-router-dom";

const IMG_HERO    = "/assets/cool-sunny.jpg";
const IMG_STREET1 = "/assets/SUPERSTARS.jpg";
const IMG_STREET2 = "/assets/jordans.jpg";
const IMG_KICKS   = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80";
const IMG_VAULT   = "/assets/air 1.jpg";
const IMG_CLOSET  = "/assets/watches.jpg";

const TICKER_ITEMS = [
  "SHOP STREETWEAR & SNEAKERS",
  "MULTI-SELLER MARKETPLACE",
  "SAVE TO YOUR VAULT",
  "SMART RECOMMENDATIONS",
  "LIMITED DROPS",
  "SECURE CHECKOUT",
];

const FEATURES = [
  {
    num: "01", img: IMG_STREET1, alt: "Street fashion",
    icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    title: "Marketplace Shopping",
    text:  "Browse thousands of pieces from top sellers. Filter by brand, style, price, and rarity.",
  },
  {
    num: "02", img: IMG_STREET2, alt: "Fashion style",
    icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    title: "Closet Vault",
    text:  "Save your favourite pieces, build collections, track your wishlist. Your personal style archive.",
  },
  {
    num: "03", img: IMG_KICKS, alt: "Sneakers",
    icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    title: "Smart Picks",
    text:  "Get personalised suggestions based on your vault, browsing history, and purchase patterns.",
  },
];

const STEPS = [
  { num:"01", title:"Browse Marketplace",   text:"Explore thousands of streetwear & sneakers from verified sellers." },
  { num:"02", title:"Save to Vault",        text:"Add your favourite pieces to your personal collection in one tap." },
  { num:"03", title:"Get Recommendations",  text:"Receive smart suggestions based on your style and browsing history." },
  { num:"04", title:"Checkout Securely",    text:"Buy with confidence through our secure, insured payment system." },
];

export default function LandingPage() {
  return (
    <>
      <style>{`
        /* ── CSS VARS ── */
        :root {
          --max-w: 1280px;
          --pad-m: 16px;
          --pad-t: 40px;
          --pad-d: 60px;
          --sec-m: 52px;
          --sec-t: 80px;
          --sec-d: 104px;
          --border: rgba(255,255,255,.07);
        }

        html,body { scroll-behavior:smooth; }

        .lp-container {
          width:100%; max-width:var(--max-w); margin:0 auto;
          padding:0 var(--pad-m);
        }
        @media(min-width:768px)  { .lp-container { padding:0 var(--pad-t); } }
        @media(min-width:1024px) { .lp-container { padding:0 var(--pad-d); } }

        .lp-section { padding:var(--sec-m) 0; }
        @media(min-width:768px)  { .lp-section { padding:var(--sec-t) 0; } }
        @media(min-width:1024px) { .lp-section { padding:var(--sec-d) 0; } }

        /* ════════════════════════════
           HERO
        ════════════════════════════ */
        .hero {
          position:relative; width:100%;
          /* taller on mobile for impact */
          height:90vh; max-height:740px; min-height:500px;
          display:flex; align-items:center; overflow:hidden;
          padding-top:var(--nav-h,56px);
        }
        @media(max-width:480px) { .hero { height:88vh; min-height:460px; } }

        .hero-bg {
          position:absolute; inset:0; z-index:0;
          background-image:url('${IMG_HERO}');
          background-size:cover; background-position:center 38%; background-repeat:no-repeat;
        }
        .hero-bg::after {
          content:''; position:absolute; inset:0;
          background:
            linear-gradient(to right,rgba(10,10,10,.92) 0%,rgba(10,10,10,.62) 52%,rgba(10,10,10,.22) 100%),
            linear-gradient(to top,rgba(10,10,10,.80) 0%,transparent 55%);
        }
        .hero-bg::before {
          content:''; position:absolute; inset:0; z-index:1;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px);
        }

        .hero-inner {
          position:relative; z-index:2; width:100%;
          display:flex; flex-direction:column; align-items:flex-start;
        }

        .hero-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:14px;
          display:flex; align-items:center; gap:10px;
          animation:lp-fadeUp .6s ease .1s both;
        }
        .hero-eyebrow::before { content:''; width:20px; height:1px; background:var(--accent); flex-shrink:0; }
        @media(max-width:380px) { .hero-eyebrow { font-size:9px; letter-spacing:3px; } }

        .hero-headline {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(56px,13vw,92px);
          line-height:.88; letter-spacing:-1px; color:var(--white);
          animation:lp-fadeUp .7s ease .2s both;
        }
        @media(min-width:768px) { .hero-headline { font-size:clamp(68px,7vw,92px); } }
        .hero-headline .hollow { -webkit-text-stroke:2px var(--white); color:transparent; }
        .hero-headline .red    { color:var(--accent); }

        .hero-sub {
          font-size:14px; font-weight:400; line-height:1.85;
          color:rgba(245,245,240,.8); max-width:400px;
          margin:16px 0 28px;
          animation:lp-fadeUp .7s ease .35s both;
        }
        @media(max-width:380px) { .hero-sub { font-size:13px; } }

        .hero-cta {
          display:flex; align-items:center; gap:10px; flex-wrap:wrap;
          animation:lp-fadeUp .7s ease .5s both;
        }
        @media(max-width:480px) {
          .hero-cta { flex-direction:column; align-items:flex-start; width:100%; }
        }

        /* ── SCROLL HINT (mobile only) ── */
        .hero-scroll {
          position:absolute; bottom:22px; left:50%; transform:translateX(-50%);
          z-index:3; display:flex; flex-direction:column; align-items:center; gap:6px;
          animation:lp-fadeUp .8s ease 1s both;
        }
        @media(min-width:768px) { .hero-scroll { display:none; } }
        .hero-scroll-line {
          width:1px; height:32px; background:linear-gradient(to bottom,var(--accent),transparent);
          animation:scrollPulse 2s ease-in-out infinite;
        }
        .hero-scroll-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; letter-spacing:3px; text-transform:uppercase;
          color:rgba(255,255,255,.35);
        }
        @keyframes scrollPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

        /* ════════════════════════════
           BUTTONS
        ════════════════════════════ */
        .lp-btn-primary {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          background:var(--accent); color:var(--white);
          border:none; padding:13px 28px; cursor:pointer; text-decoration:none;
          clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition:all .25s; display:inline-flex; align-items:center; gap:8px;
          position:relative; overflow:hidden; white-space:nowrap;
        }
        .lp-btn-primary::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,.18);
          transform:translateX(-120%) skewX(-15deg); transition:transform .45s ease;
        }
        .lp-btn-primary:hover::after { transform:translateX(120%) skewX(-15deg); }
        .lp-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,45,0,.4); }
        @media(max-width:480px) { .lp-btn-primary { width:100%; justify-content:center; } }

        .lp-btn-ghost {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:600; letter-spacing:3px; text-transform:uppercase;
          background:transparent; color:var(--white);
          border:1px solid rgba(255,255,255,.25); padding:12px 24px;
          cursor:pointer; text-decoration:none; transition:all .2s;
          display:inline-flex; align-items:center; gap:8px; white-space:nowrap;
        }
        .lp-btn-ghost:hover { border-color:var(--white); background:rgba(255,255,255,.06); }
        @media(max-width:480px) { .lp-btn-ghost { width:100%; justify-content:center; } }

        /* ════════════════════════════
           TICKER
        ════════════════════════════ */
        .lp-ticker {
          background:var(--accent); overflow:hidden; white-space:nowrap;
          padding:10px 0; width:100%;
        }
        .lp-ticker-inner { display:inline-flex; animation:lp-ticker 22s linear infinite; }
        .lp-ticker-item {
          font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:4px;
          color:var(--white); padding:0 28px;
          display:flex; align-items:center; gap:28px;
        }
        .lp-ticker-item::after { content:'◆'; font-size:7px; opacity:.65; }
        @keyframes lp-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ════════════════════════════
           SECTION LABELS
        ════════════════════════════ */
        .lp-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:10px;
          display:flex; align-items:center; gap:10px;
        }
        .lp-eyebrow::before { content:''; width:18px; height:1px; background:var(--accent); flex-shrink:0; }

        .lp-heading {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(30px,5vw,52px);
          letter-spacing:2px; line-height:1.0; color:var(--white); margin-bottom:28px;
        }
        .lp-heading em { font-style:normal; -webkit-text-stroke:1px var(--white); color:transparent; }

        /* ════════════════════════════
           FEATURE CARDS
           Mobile: 1 col  → 480px: 2 col → 900px: 3 col
        ════════════════════════════ */
        .lp-feat-grid {
          display:grid;
          grid-template-columns:1fr;          /* mobile: stacked */
          gap:3px;
        }
        @media(min-width:480px) { .lp-feat-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:900px) { .lp-feat-grid { grid-template-columns:repeat(3,1fr); } }

        .lp-feat {
          background:var(--gray); overflow:hidden;
          display:flex; flex-direction:column;
          transition:transform .3s;
        }
        .lp-feat:hover { transform:translateY(-4px); }

        .lp-feat-img { width:100%; overflow:hidden; flex-shrink:0; }
        /* Mobile shorter, desktop taller */
        .lp-feat-img { height:200px; }
        @media(min-width:480px) { .lp-feat-img { height:190px; } }
        @media(min-width:900px) { .lp-feat-img { height:240px; } }

        /* On mobile 2-col, 3rd card spans full width for balance */
        @media(min-width:480px) and (max-width:899px) {
          .lp-feat:nth-child(3) { grid-column:1/-1; }
          .lp-feat:nth-child(3) .lp-feat-img { height:220px; }
        }

        .lp-feat-img img {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.8) saturate(.72);
          transition:transform .5s ease,filter .3s; display:block;
        }
        .lp-feat:hover .lp-feat-img img { transform:scale(1.06); filter:brightness(.9) saturate(1); }

        .lp-feat-body { padding:20px 16px; flex:1; position:relative; }
        @media(min-width:480px) { .lp-feat-body { padding:22px 18px; } }
        .lp-feat-body::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .4s;
        }
        .lp-feat:hover .lp-feat-body::before { transform:scaleX(1); }

        .lp-feat-num {
          font-family:'Bebas Neue',sans-serif; font-size:36px; line-height:1;
          color:rgba(255,255,255,.05); margin-bottom:8px; transition:color .3s;
        }
        .lp-feat:hover .lp-feat-num { color:rgba(255,45,0,.12); }

        .lp-feat-icon {
          width:30px; height:30px; background:var(--mid);
          display:flex; align-items:center; justify-content:center; margin-bottom:9px;
          clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
        }
        .lp-feat-icon svg { width:13px; height:13px; stroke:var(--accent); fill:none; stroke-width:2; }

        .lp-feat-title {
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          margin-bottom:6px; color:var(--white);
        }
        .lp-feat-text {
          font-size:13px; font-weight:400; line-height:1.75;
          color:rgba(245,245,240,.65);
        }

        /* ════════════════════════════
           VAULT SECTION
           Mobile: stacked → 900px: side-by-side
        ════════════════════════════ */
        .lp-vault-wrap { position:relative; overflow:hidden; }
        .lp-vault-wrap::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse at 85% 50%,rgba(255,45,0,.07) 0%,transparent 60%);
          pointer-events:none;
        }

        .lp-vault-inner {
          display:grid;
          grid-template-columns:1fr;            /* mobile: stacked */
          gap:32px; align-items:center;
        }
        @media(min-width:900px) { .lp-vault-inner { grid-template-columns:1fr 1fr; gap:56px; } }

        /* On mobile show image first for visual punch */
        .lp-vault-text-col { order:2; }
        .lp-vault-img-col  { order:1; }
        @media(min-width:900px) {
          .lp-vault-text-col { order:1; }
          .lp-vault-img-col  { order:2; }
        }

        .lp-vault-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,45,0,.08); border:1px solid rgba(255,45,0,.25);
          padding:5px 12px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          color:var(--accent); margin-bottom:14px;
        }
        .lp-vault-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(28px,5vw,52px);
          letter-spacing:1px; line-height:1.05; margin-bottom:12px; color:var(--white);
        }
        .lp-vault-text {
          font-size:13px; font-weight:400; line-height:1.85;
          color:rgba(245,245,240,.65); margin-bottom:22px; max-width:420px;
        }
        .lp-vault-stats {
          display:flex; gap:24px; margin-bottom:24px; flex-wrap:wrap;
        }
        @media(min-width:480px) { .lp-vault-stats { gap:32px; } }

        .lp-stat-num {
          font-family:'Bebas Neue',sans-serif; font-size:34px; color:var(--white); line-height:1;
        }
        .lp-stat-num span { color:var(--accent); }
        .lp-stat-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); margin-top:2px;
        }

        .lp-vault-img-wrap {
          position:relative; overflow:hidden;
          clip-path:polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%);
        }
        /* Cap height on mobile */
        .lp-vault-img-wrap { max-height:280px; }
        @media(min-width:480px) { .lp-vault-img-wrap { max-height:340px; } }
        @media(min-width:900px) { .lp-vault-img-wrap { max-height:460px; } }

        .lp-vault-img-wrap img {
          width:100%; height:100%; max-height:inherit;
          object-fit:cover; display:block;
          filter:brightness(.85) saturate(.85); transition:transform .6s,filter .4s;
        }
        .lp-vault-img-wrap:hover img { transform:scale(1.04); filter:brightness(1) saturate(1); }
        .lp-vault-img-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top,rgba(10,10,10,.6) 0%,transparent 55%);
        }
        .lp-vault-img-tag {
          position:absolute; bottom:14px; left:14px;
          font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:3px;
          color:var(--white); opacity:.65;
        }

        /* ════════════════════════════
           STEPS
           Mobile: 2×2 grid → 380px: 1 col → 900px: 4 col
        ════════════════════════════ */
        .lp-steps-grid {
          display:grid;
          grid-template-columns:repeat(2,1fr);   /* mobile: 2 col */
          gap:3px;
        }
        @media(max-width:360px) { .lp-steps-grid { grid-template-columns:1fr; } }
        @media(min-width:900px) { .lp-steps-grid { grid-template-columns:repeat(4,1fr); } }

        .lp-step {
          background:var(--gray); padding:22px 16px; position:relative;
          border-top:2px solid rgba(255,255,255,.05); transition:border-color .3s;
        }
        @media(min-width:480px) { .lp-step { padding:26px 20px; } }
        .lp-step:hover { border-color:var(--accent); }

        .lp-step-connector {
          display:none;               /* hidden on mobile & tablet */
        }
        @media(min-width:900px) {
          .lp-step-connector {
            display:block; position:absolute; right:-10px; top:26px;
            font-size:13px; color:var(--accent); z-index:2; font-weight:bold;
          }
        }

        .lp-step-num {
          font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--accent);
          opacity:.22; line-height:1; margin-bottom:10px;
        }
        @media(min-width:480px) { .lp-step-num { font-size:42px; } }
        .lp-step-title {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          margin-bottom:5px; color:var(--white);
        }
        @media(min-width:480px) { .lp-step-title { font-size:13px; } }
        .lp-step-text {
          font-size:12px; font-weight:400; line-height:1.75;
          color:rgba(245,245,240,.62);
        }
        @media(min-width:480px) { .lp-step-text { font-size:13px; } }

        /* ════════════════════════════
           EDITORIAL STRIP
        ════════════════════════════ */
        .lp-editorial {
          width:100%; position:relative; overflow:hidden;
          display:flex; align-items:center;
          padding:56px 0; min-height:300px;
        }
        @media(min-width:768px) { .lp-editorial { padding:80px 0; min-height:380px; } }

        .lp-editorial-bg {
          position:absolute; inset:0;
          background-image:url('${IMG_CLOSET}');
          background-size:cover; background-position:center;
          filter:brightness(.38) saturate(.45);
        }
        .lp-editorial-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to right,rgba(10,10,10,.96) 0%,rgba(10,10,10,.68) 55%,rgba(10,10,10,.18) 100%);
        }
        .lp-editorial-inner {
          position:relative; z-index:2; width:100%;
          max-width:540px;
        }
        @media(max-width:480px) { .lp-editorial-inner { max-width:100%; } }

        .lp-editorial-headline {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(34px,8vw,66px);
          line-height:.96; letter-spacing:2px; color:var(--white); margin-bottom:14px;
        }
        .lp-editorial-headline span { color:var(--accent); }
        .lp-editorial-sub {
          font-size:13px; font-weight:300; line-height:1.85;
          color:rgba(245,245,240,.62); margin-bottom:22px; max-width:380px;
        }
        @media(max-width:480px) { .lp-editorial-sub { max-width:100%; } }

        /* ════════════════════════════
           CTA SECTION
        ════════════════════════════ */
        .lp-cta { text-align:center; position:relative; overflow:hidden; }
        .lp-cta-glow {
          position:absolute; width:600px; height:600px;
          background:radial-gradient(circle,rgba(255,45,0,.09) 0%,transparent 68%);
          top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
        }
        .lp-cta-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:14px; position:relative; z-index:1;
        }
        .lp-cta-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(52px,13vw,92px);
          letter-spacing:2px; line-height:.92; margin-bottom:16px;
          position:relative; z-index:1; color:var(--white);
        }
        @media(min-width:768px) { .lp-cta-title { font-size:clamp(60px,8vw,92px); } }
        .lp-cta-title .outline { -webkit-text-stroke:1.5px var(--white); color:transparent; }

        .lp-cta-sub {
          font-size:13px; font-weight:300; color:var(--dim);
          margin-bottom:28px; position:relative; z-index:1;
          max-width:300px; line-height:1.85; margin-left:auto; margin-right:auto;
        }
        .lp-cta-actions {
          display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
          position:relative; z-index:1;
        }
        @media(max-width:480px) {
          .lp-cta-actions { flex-direction:column; align-items:center; }
          .lp-cta-actions .lp-btn-primary,
          .lp-cta-actions .lp-btn-ghost { width:min(280px,100%); }
        }

        /* ════════════════════════════
           FOOTER
        ════════════════════════════ */
        .lp-footer {
          padding:32px var(--pad-m) 24px;
          background:var(--black);
          border-top:1px solid rgba(255,255,255,.05);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:12px; text-align:center;
        }
        @media(min-width:768px) {
          .lp-footer { flex-direction:row; padding:32px var(--pad-t); gap:20px; }
        }
        @media(min-width:1024px) { .lp-footer { padding:32px var(--pad-d); } }

        .lp-footer-logo {
          font-family:'Bebas Neue',sans-serif;
          font-size:18px; letter-spacing:4px; color:var(--white);
        }
        .lp-footer-logo span { color:var(--accent); }
        .lp-footer-copy { font-size:11px; color:var(--dim); letter-spacing:1px; }
        .lp-footer-links { display:flex; gap:20px; flex-wrap:wrap; justify-content:center; }
        .lp-footer-links a {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); text-decoration:none; transition:color .2s;
        }
        .lp-footer-links a:hover { color:var(--white); }

        /* ════════════════════════════
           ANIMATIONS
        ════════════════════════════ */
        @keyframes lp-fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div>

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="lp-container">
            <div className="hero-inner">
              <div className="hero-eyebrow">New Drop 2025 — Streetwear Marketplace</div>
              <h1 className="hero-headline">
                SHOP.<br />
                <span className="hollow">STYLE</span><br />
                <span className="red">VAULT.</span>
              </h1>
              <p className="hero-sub">
                Shop the hottest streetwear &amp; sneakers from top sellers.
                Save everything to your personal vault.
              </p>
              <div className="hero-cta">
                <Link to="/shop" className="lp-btn-primary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Shop Now
                </Link>
                <Link to="/vault" className="lp-btn-ghost">My Vault →</Link>
              </div>
            </div>
          </div>
          {/* Mobile scroll hint */}
          <div className="hero-scroll">
            <div className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div className="lp-ticker" aria-hidden="true">
          <div className="lp-ticker-inner">
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display:"flex" }}>
                {TICKER_ITEMS.map((t, j) => (
                  <div key={j} className="lp-ticker-item">{t}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══ FEATURES ══ */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-eyebrow">Why ClosetVault</div>
            <div className="lp-heading">BUILT FOR<br /><em>STYLE HUNTERS</em></div>
            <div className="lp-feat-grid">
              {FEATURES.map(f => (
                <div key={f.num} className="lp-feat">
                  <div className="lp-feat-img">
                    <img src={f.img} alt={f.alt} loading="lazy" />
                  </div>
                  <div className="lp-feat-body">
                    <div className="lp-feat-num">{f.num}</div>
                    <div className="lp-feat-icon"><svg viewBox="0 0 24 24">{f.icon}</svg></div>
                    <div className="lp-feat-title">{f.title}</div>
                    <p className="lp-feat-text">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VAULT ══ */}
        <section className="lp-section lp-vault-wrap" style={{ background:"var(--gray)" }}>
          <div className="lp-container">
            <div className="lp-vault-inner">
              {/* TEXT — appears below image on mobile */}
              <div className="lp-vault-text-col">
                <div className="lp-vault-badge">⚡ Your Personal Vault</div>
                <h2 className="lp-vault-title">EVERYTHING<br />IN ONE PLACE</h2>
                <p className="lp-vault-text">
                  Save your favourite pieces, organise collections, and track prices — 
                  synced across all your devices. Your vault goes wherever you go.
                </p>
                <div className="lp-vault-stats">
                  {[["5K+","Listings"],["100+","Sellers"],["24/7","New Drops"]].map(([n,l]) => (
                    <div key={l}>
                      <div className="lp-stat-num">{n.replace("+","")}<span>{n.includes("+") ? "+" : ""}</span></div>
                      <div className="lp-stat-label">{l}</div>
                    </div>
                  ))}
                </div>
                <Link to="/vault" className="lp-btn-primary" style={{ width:"fit-content" }}>
                  Open My Vault →
                </Link>
              </div>
              {/* IMAGE — appears first on mobile */}
              <div className="lp-vault-img-col">
                <div className="lp-vault-img-wrap">
                  <img src={IMG_VAULT} alt="Sneakers" loading="lazy" />
                  <div className="lp-vault-img-overlay" />
                  <div className="lp-vault-img-tag">FIND YOUR NEXT PAIR</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-eyebrow">Process</div>
            <div className="lp-heading">4 STEPS.<br /><em>THAT'S IT.</em></div>
            <div className="lp-steps-grid">
              {STEPS.map((s, i) => (
                <div key={s.num} className="lp-step">
                  {i < STEPS.length - 1 && <span className="lp-step-connector">→</span>}
                  <div className="lp-step-num">{s.num}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <p className="lp-step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EDITORIAL ══ */}
        <section className="lp-editorial">
          <div className="lp-editorial-bg" />
          <div className="lp-editorial-overlay" />
          <div className="lp-container" style={{ position:"relative", zIndex:2 }}>
            <div className="lp-editorial-inner">
              <div className="lp-eyebrow" style={{ marginBottom:12 }}>The ClosetVault Promise</div>
              <h2 className="lp-editorial-headline">
                NEVER LOSE<br />A FIT<br /><span>AGAIN.</span>
              </h2>
              <p className="lp-editorial-sub">
                We built ClosetVault for people who take style seriously.
                Every save, every purchase — your archive grows smarter every day.
              </p>
              <Link to="/shop" className="lp-btn-primary">Start Shopping →</Link>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="lp-section lp-cta" style={{ background:"var(--gray)" }}>
          <div className="lp-cta-glow" />
          <div className="lp-cta-eyebrow">Ready to build your vault?</div>
          <h2 className="lp-cta-title">
            SHOP.<br /><span className="outline">SAVE.</span><br />SLAY.
          </h2>
          <p className="lp-cta-sub">Start building your streetwear collection today. Free forever. No catch.</p>
          <div className="lp-cta-actions">
            <Link to="/shop" className="lp-btn-primary">Start Shopping →</Link>
            <Link to="/vault" className="lp-btn-ghost">View My Vault</Link>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">CLOSET<span>VAULT</span></div>
          <div className="lp-footer-copy">© 2025 ClosetVault. All rights reserved.</div>
          <div className="lp-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
}