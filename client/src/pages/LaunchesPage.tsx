import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, Clock, ChevronRight, Bell, Star, Zap, ArrowRight, Lock } from "lucide-react";
import { PRODUCTS, BRANDS } from "../data/products";

// ── Mock drops data ───────────────────────────────────────────────────────
const now = Date.now();
const h  = 3600000;
const m  = 60000;

const FEATURED_DROPS = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan Brand",
    price: 420,
    retailPrice: 210,
    img: "/assets/imgi_20_JORDAN+1+RETRO+HIGH+OG+(PS) (1).png",
    status: "live",
    endsAt: now + 2 * h + 34 * m + 12000,
    tag: "LIVE NOW",
    tagColor: "#22c55e",
    hype: 98,
    entries: 14230,
    desc: "The all-black colorway returns. One of the most iconic silhouettes in Jordan history.",
  },
  {
    id: 2,
    name: "Yeezy 700 'Analog'",
    brand: "Adidas",
    price: 380,
    retailPrice: 300,
    img: "/assets/imgi_73_WMNS+NIKE+AIR+MAX+MUSE+VC.png",
    status: "upcoming",
    endsAt: now + 18 * h + 5 * m,
    tag: "DROPPING SOON",
    tagColor: "#f59e0b",
    hype: 91,
    entries: 8750,
    desc: "Muted tones and chunky sole. The Analog drops in limited pairs globally.",
  },
  {
    id: 3,
    name: "Nike Dunk Low 'Panda'",
    brand: "Nike",
    price: 130,
    retailPrice: 110,
    img: "/assets/imgi_9_W+NIKE+MIND+001.png",
    status: "upcoming",
    endsAt: now + 3 * 24 * h + 11 * h,
    tag: "3 DAYS",
    tagColor: "#3b82f6",
    hype: 85,
    entries: 22100,
    desc: "The Panda is back. Black and white, clean and simple — sells out every time.",
  },
];

const NEW_ARRIVALS = PRODUCTS.slice(0, 8).map((p, i) => ({
  ...p,
  arrivedAt: ["Just now", "2h ago", "5h ago", "Today", "Yesterday", "Yesterday", "2 days ago", "2 days ago"][i],
  limited: i % 3 === 0,
}));

const FEATURED_BRANDS = [
  { name: "Nike",        slug: "nike",    drops: 12, img: "/assets/nice-airforce1.jpg" },
  { name: "Jordan",      slug: "jordan",  drops: 8,  img: "/assets/Jordann.jpg" },
  { name: "Adidas",      slug: "adidas",  drops: 6,  img: "/assets/SUPERSTARS.jpg" },
  { name: "New Balance", slug: "nb",      drops: 5,  img: "/assets/tuananh-blue-qCKCQocNXlo-unsplash.jpg" },
  { name: "Yeezy",       slug: "yeezy",   drops: 4,  img: "/assets/tuananh-blue-HkII6Il2_FE-unsplash.jpg" },
  { name: "Supreme",     slug: "supreme", drops: 3,  img: "/assets/supreme-viewed.jpg" },
];

// ── Countdown hook ────────────────────────────────────────────────────────
function useCountdown(endsAt: number) {
  const calc = () => {
    const diff = Math.max(0, endsAt - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return time;
}

// ── Countdown display ─────────────────────────────────────────────────────
function Countdown({ endsAt, compact = false }: { endsAt: number; compact?: boolean }) {
  const t = useCountdown(endsAt);
  const pad = (n: number) => String(n).padStart(2, "0");

  if (compact) {
    return (
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 14, letterSpacing: 2, color: "var(--accent)",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        <Clock size={11} />
        {t.d > 0 ? `${t.d}d ${pad(t.h)}h` : `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`}
      </span>
    );
  }

  return (
    <div className="cd-wrap">
      {t.d > 0 && (
        <div className="cd-unit">
          <span className="cd-num">{pad(t.d)}</span>
          <span className="cd-label">Days</span>
        </div>
      )}
      <div className="cd-unit">
        <span className="cd-num">{pad(t.h)}</span>
        <span className="cd-label">Hrs</span>
      </div>
      <div className="cd-sep">:</div>
      <div className="cd-unit">
        <span className="cd-num">{pad(t.m)}</span>
        <span className="cd-label">Min</span>
      </div>
      <div className="cd-sep">:</div>
      <div className="cd-unit">
        <span className="cd-num">{pad(t.s)}</span>
        <span className="cd-label">Sec</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function LaunchesPage() {
  const [notified, setNotified] = useState<Record<number, boolean>>({});
  const [entered,  setEntered]  = useState<Record<number, boolean>>({});

  const toggleNotify = (id: number) =>
    setNotified(p => ({ ...p, [id]: !p[id] }));

  const enterDrop = (id: number) =>
    setEntered(p => ({ ...p, [id]: true }));

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .drops {
          font-family: 'Barlow', sans-serif;
          background: var(--black);
          min-height: 100vh;
        }

        /* ── HERO ── */
        .drops-hero {
          position: relative; overflow: hidden;
          padding: 80px 20px 72px;
          min-height: 520px;
          background: var(--black);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .drops-hero-bg {
          position: absolute; inset: 0;
          background-image: url('/assets/charlesdeluvio-eR8qaAM6k1U-unsplash.jpg');
          background-size: cover; background-position: center 55%;
          filter: brightness(.55) saturate(.5) contrast(1.1);
        }
        .drops-hero-overlay {
          position: absolute; inset: 0;
          background:
            /* neon warm glow on the right where the sign lives */
            radial-gradient(ellipse 55% 70% at 75% 50%, rgba(255,200,100,.06) 0%, transparent 65%),
            /* dark vignette on left so text is always readable */
            linear-gradient(to right, rgba(8,8,8,.97) 0%, rgba(8,8,8,.82) 38%, rgba(8,8,8,.3) 62%, rgba(8,8,8,.55) 100%),
            /* subtle bottom fade into page */
            linear-gradient(to bottom, transparent 60%, rgba(8,8,8,.85) 100%);
        }
        .drops-hero-inner {
          position: relative; z-index: 1;
          max-width: 1320px; margin: 0 auto;
          padding: 0 20px;
        }
        @media (min-width: 768px)  { .drops-hero-inner { padding: 0 40px; } }
        @media (min-width: 1200px) { .drops-hero-inner { padding: 0 60px; } }

        .drops-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px;
        }
        .drops-eyebrow::before {
          content: ''; width: 24px; height: 1px; background: var(--accent);
        }
        .drops-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 9vw, 120px);
          letter-spacing: -2px; line-height: .88;
          color: var(--white); margin-bottom: 16px;
        }
        .drops-hero-title .hollow {
          -webkit-text-stroke: 2px var(--white); color: transparent;
        }
        .drops-hero-title .red { color: var(--accent); }
        .drops-hero-sub {
          font-size: 15px; font-weight: 300; line-height: 1.7;
          color: rgba(255,255,255,.45); max-width: 480px; margin-bottom: 28px;
        }
        .drops-hero-pills {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .drops-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          padding: 7px 14px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .drops-pill.live { border-color: rgba(34,197,94,.4); color: #22c55e; background: rgba(34,197,94,.06); }
        .drops-pill svg { flex-shrink: 0; }

        /* ── SECTION WRAPPER ── */
        .drops-section {
          max-width: 1320px; margin: 0 auto;
          padding: 56px 20px;
        }
        @media (min-width: 768px)  { .drops-section { padding: 56px 40px; } }
        @media (min-width: 1200px) { .drops-section { padding: 56px 60px; } }
        .drops-section + .drops-section {
          border-top: 1px solid rgba(255,255,255,.06);
        }

        .drops-section-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 12px; margin-bottom: 28px; flex-wrap: wrap;
        }
        .drops-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: 2px; color: var(--white);
        }
        .drops-section-title span { color: var(--accent); }
        .drops-section-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); text-decoration: none; transition: color .2s; flex-shrink: 0;
        }
        .drops-section-link:hover { color: var(--accent); }

        /* ── FEATURED DROPS ── */
        .drops-featured {
          display: grid; grid-template-columns: 1fr; gap: 3px;
        }
        @media (min-width: 768px) {
          .drops-featured { grid-template-columns: 1.4fr 1fr; }
        }
        @media (min-width: 1024px) {
          .drops-featured { grid-template-columns: 1.4fr 1fr 1fr; }
        }

        .drop-card {
          background: var(--gray); overflow: hidden; position: relative;
          display: flex; flex-direction: column;
          transition: transform .3s;
        }
        .drop-card:hover { transform: translateY(-3px); }

        .drop-card-img {
          aspect-ratio: 4/3; overflow: hidden; position: relative;
          background: var(--mid);
        }
        .drop-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.75) saturate(.7);
          transition: filter .4s, transform .4s;
        }
        .drop-card:hover .drop-card-img img {
          filter: brightness(.88) saturate(1);
          transform: scale(1.05);
        }

        /* status tag */
        .drop-tag {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          padding: 4px 10px;
          display: flex; align-items: center; gap: 5px;
        }
        .drop-tag.live {
          background: #22c55e; color: #fff;
        }
        .drop-tag.upcoming {
          background: rgba(10,10,10,.85); border: 1px solid rgba(255,255,255,.2); color: var(--white);
          backdrop-filter: blur(4px);
        }
        /* live pulse dot */
        .drop-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff; animation: pulse 1.4s ease infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

        /* notify btn overlay */
        .drop-notify {
          position: absolute; bottom: 12px; right: 12px; z-index: 2;
        }
        .drop-notify-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(10,10,10,.82); border: 1px solid rgba(255,255,255,.2);
          color: var(--white); cursor: pointer; padding: 11px 14px; min-height: 44px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          backdrop-filter: blur(6px); transition: all .2s;
        }
        .drop-notify-btn:hover { border-color: var(--accent); color: var(--accent); }
        .drop-notify-btn.on { border-color: var(--accent); color: var(--accent); }

        /* body */
        .drop-card-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .drop-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim);
        }
        .drop-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 1px; color: var(--white); line-height: 1.1;
        }
        .drop-desc {
          font-size: 13px; font-weight: 300; line-height: 1.6;
          color: rgba(255,255,255,.4); flex: 1;
        }

        /* meta row */
        .drop-meta {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .drop-hype {
          display: flex; flex-direction: column; gap: 4px;
        }
        .drop-hype-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .drop-hype-bar {
          width: 80px; height: 3px; background: rgba(255,255,255,.08);
          position: relative; overflow: hidden;
        }
        .drop-hype-fill {
          position: absolute; top: 0; left: 0; height: 100%;
          background: var(--accent); border-radius: 0;
        }
        .drop-entries {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: var(--dim);
        }
        .drop-entries span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 1px; color: var(--white); margin-right: 3px;
        }

        /* price + action */
        .drop-footer {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,.07);
        }
        .drop-price-wrap { display: flex; flex-direction: column; }
        .drop-retail {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: var(--dim);
        }
        .drop-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 1px; color: var(--white); line-height: 1;
        }
        .drop-enter-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--accent); color: var(--white);
          border: none; padding: 11px 18px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition: all .25s; position: relative; overflow: hidden; flex-shrink: 0;
        }
        .drop-enter-btn::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.18);
          transform: translateX(-120%) skewX(-15deg); transition: transform .4s ease;
        }
        .drop-enter-btn:hover::after { transform: translateX(120%) skewX(-15deg); }
        .drop-enter-btn:hover { background: #ff5533; }
        .drop-enter-btn.entered { background: #16a34a; clip-path: none; }
        .drop-enter-btn:disabled { opacity: .5; pointer-events: none; }

        /* countdown */
        .cd-wrap {
          display: flex; align-items: center; gap: 4px;
        }
        .cd-unit { display: flex; flex-direction: column; align-items: center; }
        .cd-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 2px;
          color: var(--white); line-height: 1;
          background: var(--mid); padding: 4px 10px;
          min-width: 44px; text-align: center;
        }
        .cd-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-top: 4px;
        }
        .cd-sep {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; color: var(--accent);
          margin-bottom: 12px; align-self: flex-end;
        }

        /* countdown container */
        .drop-countdown {
          padding: 12px 20px;
          background: var(--mid);
          border-top: 1px solid rgba(255,255,255,.06);
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .drop-countdown-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); display: flex; align-items: center; gap: 5px; flex-shrink: 0;
        }

        /* ── NEW ARRIVALS GRID ── */
        .arrivals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
        }
        @media (min-width: 640px)  { .arrivals-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px)  { .arrivals-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1200px) { .arrivals-grid { grid-template-columns: repeat(4, 1fr); } }

        .arrival-card {
          background: var(--gray); overflow: hidden; position: relative;
          transition: transform .3s;
        }
        .arrival-card:hover { transform: translateY(-3px); }

        .arrival-img {
          aspect-ratio: 1; overflow: hidden; position: relative;
          background: var(--mid); display: block;
        }
        .arrival-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.85) saturate(.8);
          transition: filter .35s, transform .35s;
        }
        .arrival-card:hover .arrival-img img {
          filter: brightness(.95) saturate(1);
          transform: scale(1.04);
        }

        .arrival-badges {
          position: absolute; top: 8px; left: 8px;
          display: flex; gap: 4px; z-index: 2;
        }
        .arrival-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 3px 7px;
        }
        .arrival-badge.new     { background: var(--white); color: var(--black); }
        .arrival-badge.limited { background: var(--accent); color: var(--white); }
        .arrival-badge.hot     { background: #f59e0b; color: var(--black); }

        .arrival-body { padding: 10px 12px 14px; }
        .arrival-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 2px;
        }
        .arrival-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; color: var(--white);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 8px;
        }
        .arrival-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 6px;
        }
        .arrival-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px; color: var(--white);
        }
        .arrival-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          color: var(--dim); display: flex; align-items: center; gap: 4px;
        }
        .arrival-time.fresh { color: #22c55e; }

        /* ── FEATURED BRANDS ── */
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
        }
        @media (min-width: 480px)  { .brands-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px)  { .brands-grid { grid-template-columns: repeat(6, 1fr); } }

        .brand-card {
          background: var(--gray);
          aspect-ratio: 1; overflow: hidden; position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end;
          padding: 14px 10px;
          cursor: pointer; transition: transform .3s;
          text-decoration: none;
        }
        .brand-card:hover { transform: translateY(-4px); }

        .brand-card-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          filter: brightness(.3) saturate(.4);
          transition: filter .35s;
        }
        .brand-card:hover .brand-card-bg { filter: brightness(.45) saturate(.7); }
        .brand-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,.9) 0%, transparent 60%);
        }
        .brand-card-content { position: relative; z-index: 1; text-align: center; }
        .brand-card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 3px; color: var(--white);
          display: block; margin-bottom: 3px;
        }
        .brand-card-drops {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent);
        }

        /* ── ALERT BANNER ── */
        .drops-alert-banner {
          background: rgba(255,45,0,.07);
          border: 1px solid rgba(255,45,0,.2);
          padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 0;
        }
        .drops-alert-text {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--white);
        }
        .drops-alert-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 300; letter-spacing: 0;
          text-transform: none; color: rgba(255,255,255,.45);
        }
        .drops-alert-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--accent); color: var(--white);
          border: none; padding: 10px 20px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          transition: background .2s; flex-shrink: 0;
        }
        .drops-alert-btn:hover { background: #ff5533; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="drops">

        {/* ── HERO ── */}
        <div className="drops-hero">
          <div className="drops-hero-bg" />
          <div className="drops-hero-overlay" />
          <div className="drops-hero-inner">
            <div className="drops-eyebrow"><Flame size={12} /> Limited Releases</div>
            <h1 className="drops-hero-title">
              LATEST<br />
              <span className="hollow">DROPS</span> &amp;<br />
              <span className="red">RELEASES.</span>
            </h1>
            <p className="drops-hero-sub">
              Exclusive streetwear. Limited pairs. Enter raffles, track countdowns, and never miss a drop again.
            </p>
            <div className="drops-hero-pills">
              <div className="drops-pill live">
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.4s ease infinite" }} />
                1 Drop Live
              </div>
              <div className="drops-pill">
                <Clock size={11} /> 2 Dropping Soon
              </div>
              <div className="drops-pill">
                <Zap size={11} /> {BRANDS.length} Brands Active
              </div>
            </div>
          </div>
        </div>

        {/* ── ALERT BANNER ── */}
        <div style={{ background: "var(--black)", padding: "0 20px" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 0" }}>
            <div className="drops-alert-banner">
              <div className="drops-alert-text">
                <Bell size={16} color="var(--accent)" />
                <span>
                  Never miss a drop{" "}
                  <span className="drops-alert-sub">— get notified 24h before every limited release</span>
                </span>
              </div>
              <button className="drops-alert-btn">
                <Bell size={12} /> Enable Drop Alerts
              </button>
            </div>
          </div>
        </div>

        {/* ── FEATURED DROPS ── */}
        <div className="drops-section">
          <div className="drops-section-head">
            <h2 className="drops-section-title">
              FEATURED <span>DROPS</span>
            </h2>
            <Link to="/shop" className="drops-section-link">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="drops-featured">
            {FEATURED_DROPS.map((drop, idx) => (
              <div
                key={drop.id}
                className="drop-card"
                style={{ animation: `fadeUp .5s ease ${idx * 0.1}s both` }}
              >
                {/* image */}
                <div className="drop-card-img">
                  <img src={drop.img} alt={drop.name} loading="lazy" />
                  <div className={`drop-tag ${drop.status}`}>
                    {drop.status === "live" && <div className="drop-live-dot" />}
                    {drop.tag}
                  </div>
                  <div className="drop-notify">
                    <button
                      className={`drop-notify-btn ${notified[drop.id] ? "on" : ""}`}
                      onClick={() => toggleNotify(drop.id)}
                    >
                      <Bell size={11} />
                      {notified[drop.id] ? "Notifying" : "Notify Me"}
                    </button>
                  </div>
                </div>

                {/* countdown bar */}
                <div className="drop-countdown">
                  <span className="drop-countdown-label">
                    <Clock size={11} />
                    {drop.status === "live" ? "Ends in" : "Drops in"}
                  </span>
                  <Countdown endsAt={drop.endsAt} />
                </div>

                {/* body */}
                <div className="drop-card-body">
                  <div className="drop-brand">{drop.brand}</div>
                  <div className="drop-name">{drop.name}</div>
                  <p className="drop-desc">{drop.desc}</p>

                  <div className="drop-meta">
                    <div className="drop-hype">
                      <span className="drop-hype-label">Hype Level</span>
                      <div className="drop-hype-bar">
                        <div className="drop-hype-fill" style={{ width: `${drop.hype}%` }} />
                      </div>
                    </div>
                    <div className="drop-entries">
                      <span>{drop.entries.toLocaleString()}</span> entries
                    </div>
                  </div>

                  <div className="drop-footer">
                    <div className="drop-price-wrap">
                      <span className="drop-retail">Retail R{drop.retailPrice}</span>
                      <span className="drop-price">R{drop.price}</span>
                    </div>
                    <button
                      className={`drop-enter-btn ${entered[drop.id] ? "entered" : ""}`}
                      onClick={() => enterDrop(drop.id)}
                      disabled={entered[drop.id]}
                    >
                      {entered[drop.id] ? (
                        <><Star size={13} /> Entered</>
                      ) : drop.status === "live" ? (
                        <><Zap size={13} /> Enter Now</>
                      ) : (
                        <><Lock size={13} /> Enter Raffle</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEW ARRIVALS ── */}
        <div className="drops-section" style={{ background: "rgba(255,255,255,.015)" }}>
          <div className="drops-section-head">
            <h2 className="drops-section-title">
              NEW <span>ARRIVALS</span>
            </h2>
            <Link to="/shop" className="drops-section-link">
              Shop All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="arrivals-grid">
            {NEW_ARRIVALS.map((item, idx) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="arrival-card"
                style={{ textDecoration: "none", animation: `fadeUp .5s ease ${idx * 0.05}s both` }}
              >
                <div className="arrival-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                  <div className="arrival-badges">
                    {item.isNew    && <span className="arrival-badge new">New</span>}
                    {item.limited  && <span className="arrival-badge limited">Limited</span>}
                    {item.isHot    && <span className="arrival-badge hot">Hot</span>}
                  </div>
                </div>
                <div className="arrival-body">
                  <div className="arrival-brand">{item.brand}</div>
                  <div className="arrival-name">{item.name}</div>
                  <div className="arrival-footer">
                    <span className="arrival-price">R{item.price}</span>
                    <span className={`arrival-time ${item.arrivedAt === "Just now" || item.arrivedAt.includes("h") ? "fresh" : ""}`}>
                      <Clock size={10} /> {item.arrivedAt}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── FEATURED BRANDS ── */}
        <div className="drops-section">
          <div className="drops-section-head">
            <h2 className="drops-section-title">
              DROPPING <span>BRANDS</span>
            </h2>
            <Link to="/shop" className="drops-section-link">
              Browse All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="brands-grid">
            {FEATURED_BRANDS.map((brand, idx) => (
              <Link
                key={brand.slug}
                to={`/shop?brand=${brand.slug}`}
                className="brand-card"
                style={{ animation: `fadeUp .5s ease ${idx * 0.08}s both` }}
              >
                <div
                  className="brand-card-bg"
                  style={{ backgroundImage: `url(${brand.img})` }}
                />
                <div className="brand-card-overlay" />
                <div className="brand-card-content">
                  <span className="brand-card-name">{brand.name}</span>
                  <span className="brand-card-drops">{brand.drops} Active Drops</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: "var(--gray)",
          borderTop: "1px solid rgba(255,255,255,.06)",
          padding: "56px 20px",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: 5,
              textTransform: "uppercase", color: "var(--accent)",
              marginBottom: 14,
            }}>
              Sell Your Grails
            </div>
            <h3 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: 2, color: "var(--white)",
              marginBottom: 12, lineHeight: .95,
            }}>
              LIST YOUR DROPS<br />ON CLOSET<span style={{ color: "var(--accent)" }}>VAULT</span>
            </h3>
            <p style={{
              fontSize: 14, fontWeight: 300, lineHeight: 1.7,
              color: "rgba(255,255,255,.4)", marginBottom: 28,
            }}>
              Got limited heat? Reach thousands of verified buyers. List in minutes.
            </p>
            <Link
              to="/auth/register"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--accent)", color: "var(--white)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, fontWeight: 700, letterSpacing: 3,
                textTransform: "uppercase", padding: "14px 36px",
                textDecoration: "none",
                clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
                transition: "background .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ff5533")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
            >
              Start Selling <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
