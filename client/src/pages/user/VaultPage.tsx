import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, ShoppingBag, Trash2, Grid3X3, LayoutList,
  Clock, Plus, ChevronRight, Archive,
  TrendingUp, Eye
} from "lucide-react";
import { PRODUCTS } from "../../data/products";

// ── Mock vault data ───────────────────────────────────────────────────────
const SAVED_ITEMS = PRODUCTS.slice(0, 8).map((p, i) => ({
  ...p,
  savedAt: ["2 days ago","1 week ago","Jan 28","Jan 15","Dec 30","Dec 18","Nov 22","Nov 5"][i],
  notes: i % 3 === 0 ? "Copped this on sale 🔥" : "",
}));

const WISHLIST_ITEMS = PRODUCTS.slice(8, 14).map((p, i) => ({
  ...p,
  savedAt: ["Today","3 days ago","Jan 20","Jan 10","Dec 25","Dec 10"][i],
  priceAlert: i % 2 === 0,
}));

const RECENT_ITEMS = PRODUCTS.slice(14, 20).map((p, i) => ({
  ...p,
  viewedAt: ["Just now","5 min ago","1 hr ago","Yesterday","2 days ago","3 days ago"][i],
}));

const COLLECTIONS = [
  { id: 1, name: "Grails",        count: 4, color: "#ff2d00" },
  { id: 2, name: "Summer Fits",   count: 7, color: "#f59e0b" },
  { id: 3, name: "On Rotation",   count: 3, color: "#22c55e" },
  { id: 4, name: "Copped",        count: 12, color: "#3b82f6" },
];

type Tab = "saved" | "wishlist" | "recent";

export default function VaultPage() {
  const [tab, setTab]           = useState<Tab>("saved");
  const [view, setView]         = useState<"grid" | "list">("grid");
  const [saved, setSaved]       = useState(SAVED_ITEMS.map(i => i.id));
  const [wished, setWished]     = useState(WISHLIST_ITEMS.map(i => i.id));
  const [added, setAdded]       = useState<Record<number, boolean>>({});
  const [removing, setRemoving] = useState<number | null>(null);

  const removeFromVault = (id: number) => {
    setRemoving(id);
    setTimeout(() => {
      setSaved(prev => prev.filter(x => x !== id));
      setRemoving(null);
    }, 320);
  };

  const removeFromWishlist = (id: number) => {
    setRemoving(id);
    setTimeout(() => {
      setWished(prev => prev.filter(x => x !== id));
      setRemoving(null);
    }, 320);
  };

  const handleAddCart = (id: number) => {
    setAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 1400);
  };

  const savedItems  = SAVED_ITEMS.filter(i => saved.includes(i.id));
  const wishItems   = WISHLIST_ITEMS.filter(i => wished.includes(i.id));

  const TABS = [
    { id: "saved"    as Tab, label: "Saved",           icon: <Archive size={13} />,  count: savedItems.length  },
    { id: "wishlist" as Tab, label: "Wishlist",         icon: <Heart size={13} />,    count: wishItems.length   },
    { id: "recent"   as Tab, label: "Recently Viewed",  icon: <Clock size={13} />,    count: RECENT_ITEMS.length },
  ];

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .vault {
          max-width: 1320px; margin: 0 auto;
          padding: 32px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .vault { padding: 40px 40px 100px; } }
        @media (min-width: 1200px) { .vault { padding: 44px 60px 100px; } }

        /* ── VAULT HERO HEADER ── */
        .vault-hero {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 20px; margin-bottom: 36px; flex-wrap: wrap;
        }
        .vault-hero-left {}
        .vault-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .vault-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
        .vault-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 60px);
          letter-spacing: 2px; line-height: .9; color: var(--white);
          margin-bottom: 8px;
        }
        .vault-title span { color: var(--accent); }
        .vault-title .hollow {
          -webkit-text-stroke: 1.5px var(--white); color: transparent;
        }
        .vault-sub {
          font-size: 13px; font-weight: 300; color: var(--dim); max-width: 400px; line-height: 1.7;
        }

        /* stats row */
        .vault-stats {
          display: flex; gap: 3px; flex-wrap: wrap;
        }
        .vault-stat {
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          padding: 14px 20px; min-width: 100px;
          border-top: 2px solid rgba(255,255,255,.05);
          transition: border-color .2s;
        }
        .vault-stat:hover { border-color: var(--accent); }
        .vault-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 2px; color: var(--white); line-height: 1;
          margin-bottom: 3px;
        }
        .vault-stat-num span { color: var(--accent); }
        .vault-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }

        /* ── COLLECTIONS ROW ── */
        .vault-collections { margin-bottom: 36px; }
        .vault-sec-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .vault-sec-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.06); }
        .vault-col-grid {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .vault-col-chip {
          display: flex; align-items: center; gap: 8px;
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          padding: 8px 14px; cursor: pointer; transition: all .2s;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .vault-col-chip:hover { border-color: rgba(255,255,255,.2); color: var(--white); }
        .vault-col-chip:hover .col-dot { transform: scale(1.3); }
        .col-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; transition: transform .2s;
        }
        .col-count {
          font-family: 'Bebas Neue', sans-serif; font-size: 14px;
          color: rgba(255,255,255,.3); margin-left: 2px;
        }
        .vault-col-add {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px dashed rgba(255,255,255,.12);
          padding: 8px 14px; cursor: pointer; transition: all .2s;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .vault-col-add:hover { border-color: var(--accent); color: var(--accent); }

        /* ── TABS + TOOLBAR ── */
        .vault-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(255,255,255,.07);
          padding-bottom: 0;
        }
        .vault-tabs { display: flex; gap: 0; }
        .vault-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 18px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); background: transparent;
          border: none; border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: all .2s; white-space: nowrap;
        }
        .vault-tab:hover { color: var(--white); }
        .vault-tab.on { color: var(--white); border-bottom-color: var(--accent); }
        .tab-badge {
          font-family: 'Bebas Neue', sans-serif; font-size: 12px;
          background: rgba(255,255,255,.08); padding: 1px 7px;
          color: var(--dim); min-width: 22px; text-align: center;
          transition: all .2s;
        }
        .vault-tab.on .tab-badge { background: var(--accent); color: var(--white); }

        .vault-tb-right { display: flex; align-items: center; gap: 8px; }
        .vt-view { display: flex; border: 1px solid rgba(255,255,255,.07); }
        .vt-view-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--dim); padding: 8px 10px; transition: all .2s; display: flex; align-items: center;
        }
        .vt-view-btn + .vt-view-btn { border-left: 1px solid rgba(255,255,255,.07); }
        .vt-view-btn:hover  { color: var(--white); }
        .vt-view-btn.on { background: var(--mid); color: var(--accent); }

        /* ── GRID ── */
        .vault-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 3px;
        }
        .vault-grid.list { grid-template-columns: 1fr; gap: 3px; }

        /* ── VAULT CARD ── */
        .vc {
          background: var(--gray); display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: transform .28s cubic-bezier(.4,0,.2,1), opacity .3s, translateX .3s;
          animation: vcIn .4s ease both;
        }
        @keyframes vcIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .vc:nth-child(1){animation-delay:.02s} .vc:nth-child(2){animation-delay:.04s}
        .vc:nth-child(3){animation-delay:.06s} .vc:nth-child(4){animation-delay:.08s}
        .vc:nth-child(5){animation-delay:.10s} .vc:nth-child(6){animation-delay:.12s}
        .vc:nth-child(7){animation-delay:.14s} .vc:nth-child(8){animation-delay:.16s}
        .vc.removing { opacity: 0; transform: scale(.95) translateY(-8px); }
        .vc:hover { transform: translateY(-4px); }
        .vc::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--accent); transform:scaleX(0); transform-origin:left;
          transition:transform .3s ease; z-index:1;
        }
        .vc:hover::before { transform:scaleX(1); }

        /* badges */
        .vc-badges { position:absolute; top:10px; left:10px; z-index:2; display:flex; flex-direction:column; gap:4px; }
        .vcb {
          font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:2px; padding:3px 8px;
        }
        .vcb-new  { background:var(--accent); color:var(--white); }
        .vcb-hot  { background:var(--white);  color:#0a0a0a; }
        .vcb-alert{ background:#f59e0b; color:#0a0a0a; }

        /* remove btn */
        .vc-remove {
          position:absolute; top:10px; right:10px; z-index:2;
          background:rgba(10,10,10,.7); border:1px solid rgba(255,255,255,.1);
          width:30px; height:30px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(255,255,255,.3); transition:all .2s;
          backdrop-filter:blur(4px);
        }
        .vc-remove:hover { background:rgba(255,45,0,.8); border-color:var(--accent); color:var(--white); }

        /* image */
        .vc-img { width:100%; aspect-ratio:1; overflow:hidden; background:var(--mid); flex-shrink:0; }
        .vc-img img {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.82) saturate(.75);
          transition:transform .5s ease, filter .3s;
          display:block;
        }
        .vc:hover .vc-img img { transform:scale(1.06); filter:brightness(.95) saturate(1); }

        /* body */
        .vc-body { padding:14px 13px; flex:1; display:flex; flex-direction:column; }
        .vc-saved-date {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
          color:rgba(255,255,255,.2); margin-bottom:4px;
          display:flex; align-items:center; gap:4px;
        }
        .vc-cond {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); margin-bottom:4px;
        }
        .vc-name {
          font-family:'Barlow Condensed',sans-serif;
          font-size:15px; font-weight:700; letter-spacing:1px;
          color:var(--white); margin-bottom:2px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .vc-brand { font-size:12px; font-weight:300; color:var(--dim); margin-bottom:10px; }
        .vc-price {
          font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1px;
          color:var(--white); margin-top:auto; margin-bottom:10px;
          display:flex; align-items:baseline; gap:8px;
        }
        .vc-orig { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:var(--dim); text-decoration:line-through; }
        .vc-notes {
          font-size:11px; font-weight:300; color:var(--dim);
          margin-bottom:10px; font-style:italic;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }

        /* card actions */
        .vc-actions { display:flex; gap:2px; }
        .vc-btn {
          flex:1; padding:10px 6px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border:none; cursor:pointer; transition:all .2s;
          display:flex; align-items:center; justify-content:center; gap:5px;
        }
        .vc-btn-cart {
          background:var(--accent); color:var(--white);
          clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          position:relative; overflow:hidden;
        }
        .vc-btn-cart::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,.18);
          transform:translateX(-120%) skewX(-15deg); transition:transform .4s ease;
        }
        .vc-btn-cart:hover::after { transform:translateX(120%) skewX(-15deg); }
        .vc-btn-cart:hover  { background:#ff5533; }
        .vc-btn-cart.done   { background:#16a34a; }
        .vc-btn-view {
          background:var(--mid); color:var(--dim); border:1px solid rgba(255,255,255,.07);
          flex:0; padding:10px 12px;
        }
        .vc-btn-view:hover { color:var(--white); border-color:rgba(255,255,255,.2); }

        /* LIST VIEW */
        .vault-grid.list .vc { flex-direction:row; height:110px; }
        .vault-grid.list .vc::before { right:auto; bottom:0; top:0; width:2px; height:auto;
          transform:scaleY(0); transform-origin:top; }
        .vault-grid.list .vc:hover::before { transform:scaleY(1); }
        .vault-grid.list .vc-img { width:110px; height:110px; flex-shrink:0; aspect-ratio:auto; }
        .vault-grid.list .vc-body {
          flex-direction:row; align-items:center; gap:16px; flex:1; padding:14px 16px;
        }
        .vault-grid.list .vc-info { flex:1; min-width:0; }
        .vault-grid.list .vc-actions { flex-shrink:0; gap:5px; }
        .vault-grid.list .vc-btn { flex:none; }
        .vault-grid.list .vc-badges { top:8px; left:118px; }
        .vault-grid.list .vc-remove { top:8px; right:8px; }

        /* ── RECENTLY VIEWED STRIP ── */
        .vc-recent-item {
          background:var(--gray); display:flex; flex-direction:column;
          overflow:hidden; position:relative;
          transition:transform .28s;
          animation:vcIn .4s ease both;
        }
        .vc-recent-item:hover { transform:translateY(-4px); }
        .vc-recent-item::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--accent); transform:scaleX(0); transform-origin:left;
          transition:transform .3s ease; z-index:1;
        }
        .vc-recent-item:hover::before { transform:scaleX(1); }
        .vc-ri-img { width:100%; aspect-ratio:1; overflow:hidden; background:var(--mid); }
        .vc-ri-img img {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.8) saturate(.7); transition:transform .5s, filter .3s;
          display:block;
        }
        .vc-recent-item:hover .vc-ri-img img { transform:scale(1.06); filter:brightness(.95) saturate(1); }
        .vc-ri-body { padding:12px 11px; }
        .vc-ri-viewed {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
          color:rgba(255,255,255,.2); margin-bottom:3px;
          display:flex; align-items:center; gap:4px;
        }
        .vc-ri-name {
          font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700;
          color:var(--white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          margin-bottom:2px;
        }
        .vc-ri-brand { font-size:12px; font-weight:300; color:var(--dim); margin-bottom:8px; }
        .vc-ri-price { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--white); }
        .vc-ri-btn {
          width:100%; padding:8px; margin-top:8px;
          font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase;
          background:transparent; color:var(--dim); border:1px solid rgba(255,255,255,.08);
          cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:5px;
        }
        .vc-ri-btn:hover { border-color:var(--accent); color:var(--accent); }

        /* ── EMPTY STATE ── */
        .vault-empty {
          grid-column:1/-1;
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:80px 20px; text-align:center;
          background:var(--gray); border-top:2px solid rgba(255,255,255,.04);
          animation:vcIn .4s ease both;
        }
        .vault-empty-icon {
          font-family:'Bebas Neue',sans-serif; font-size:90px;
          color:rgba(255,255,255,.04); line-height:1; margin-bottom:12px;
        }
        .vault-empty-title {
          font-family:'Bebas Neue',sans-serif; font-size:26px;
          letter-spacing:3px; color:var(--dim); margin-bottom:8px;
        }
        .vault-empty-sub { font-size:13px; color:var(--dim); margin-bottom:24px; }
        .btn-primary {
          font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700;
          letter-spacing:3px; text-transform:uppercase;
          background:var(--accent); color:var(--white);
          border:none; padding:12px 28px; cursor:pointer; text-decoration:none;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition:all .25s; display:inline-flex; align-items:center; gap:8px;
        }
        .btn-primary:hover { background:#ff5533; transform:translateY(-2px); }

        /* ── SECTION DIVIDER ── */
        .vault-section { margin-top: 56px; }
        .vault-section-head {
          display:flex; align-items:center; justify-content:space-between;
          padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:20px;
        }
        .vault-section-title {
          font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:4px; color:var(--white);
          display:flex; align-items:center; gap:10px;
        }
        .vault-section-title svg { color:var(--accent); }
        .vault-section-link {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--accent); text-decoration:none; transition:opacity .2s;
          display:flex; align-items:center; gap:4px;
        }
        .vault-section-link:hover { opacity:.7; }

        .recent-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(155px, 1fr));
          gap:3px;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="vault">

        {/* ── HERO HEADER ── */}
        <div className="vault-hero" style={{ animation: "fadeUp .5s ease both" }}>
          <div className="vault-hero-left">
            <div className="vault-eyebrow">Your Personal Archive</div>
            <h1 className="vault-title">
              MY <span>VAULT</span>
            </h1>
            <p className="vault-sub">
              Your personal wardrobe archive. Save pieces, build wishlists,
              and track everything you own or want to own.
            </p>
          </div>
          <div className="vault-stats">
            <div className="vault-stat">
              <div className="vault-stat-num">{savedItems.length}<span>+</span></div>
              <div className="vault-stat-label">Saved</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-num">{wishItems.length}</div>
              <div className="vault-stat-label">Wishlist</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-num">{COLLECTIONS.length}</div>
              <div className="vault-stat-label">Collections</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-num">R{savedItems.reduce((s,i) => s + i.price, 0)}</div>
              <div className="vault-stat-label">Vault Value</div>
            </div>
          </div>
        </div>

        {/* ── COLLECTIONS ── */}
        <div className="vault-collections" style={{ animation: "fadeUp .5s ease .1s both" }}>
          <div className="vault-sec-label">Collections</div>
          <div className="vault-col-grid">
            {COLLECTIONS.map(col => (
              <div key={col.id} className="vault-col-chip">
                <div className="col-dot" style={{ background: col.color }} />
                {col.name}
                <span className="col-count">{col.count}</span>
              </div>
            ))}
            <button className="vault-col-add">
              <Plus size={12} /> New Collection
            </button>
          </div>
        </div>

        {/* ── TABS + TOOLBAR ── */}
        <div className="vault-toolbar" style={{ animation: "fadeUp .5s ease .15s both" }}>
          <div className="vault-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`vault-tab ${tab === t.id ? "on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon}
                {t.label}
                <span className="tab-badge">{t.count}</span>
              </button>
            ))}
          </div>
          {tab !== "recent" && (
            <div className="vault-tb-right">
              <div className="vt-view">
                <button className={`vt-view-btn ${view === "grid" ? "on" : ""}`} onClick={() => setView("grid")}>
                  <Grid3X3 size={14} />
                </button>
                <button className={`vt-view-btn ${view === "list" ? "on" : ""}`} onClick={() => setView("list")}>
                  <LayoutList size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SAVED TAB ── */}
        {tab === "saved" && (
          <div className={`vault-grid ${view === "list" ? "list" : ""}`}>
            {savedItems.length === 0 ? (
              <div className="vault-empty">
                <div className="vault-empty-icon">∅</div>
                <div className="vault-empty-title">Nothing Saved Yet</div>
                <p className="vault-empty-sub">Browse the marketplace and hit Save on anything you like.</p>
                <Link to="/shop" className="btn-primary"><ShoppingBag size={13} /> Browse Marketplace</Link>
              </div>
            ) : (
              savedItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`vc ${removing === item.id ? "removing" : ""}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="vc-badges">
                    {item.isNew && <span className="vcb vcb-new">NEW</span>}
                    {item.isHot && <span className="vcb vcb-hot">🔥 HOT</span>}
                  </div>
                  <button className="vc-remove" onClick={() => removeFromVault(item.id)} title="Remove">
                    <Trash2 size={13} />
                  </button>
                  <div className="vc-img">
                    <img src={item.img} alt={item.name} loading="lazy" />
                  </div>
                  <div className="vc-body">
                    <div className={view === "list" ? "vc-info" : ""}>
                      <div className="vc-saved-date"><Clock size={9} /> {item.savedAt}</div>
                      <div className="vc-cond">{item.condition} · {item.category}</div>
                      <div className="vc-name">{item.name}</div>
                      <div className="vc-brand">{item.brand}</div>
                      {item.notes && <div className="vc-notes">"{item.notes}"</div>}
                      <div className="vc-price">
                        ${item.price}
                        {item.originalPrice && <span className="vc-orig">R{item.originalPrice}</span>}
                      </div>
                    </div>
                    <div className="vc-actions">
                      <button
                        className={`vc-btn vc-btn-cart ${added[item.id] ? "done" : ""}`}
                        onClick={() => handleAddCart(item.id)}
                      >
                        <ShoppingBag size={11} />
                        {added[item.id] ? "Added!" : "Add to Cart"}
                      </button>
                      <Link to={`/product/${item.id}`} className="vc-btn vc-btn-view" title="View product">
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {tab === "wishlist" && (
          <div className={`vault-grid ${view === "list" ? "list" : ""}`}>
            {wishItems.length === 0 ? (
              <div className="vault-empty">
                <div className="vault-empty-icon"><Heart size={60} strokeWidth={1} opacity={0.08} /></div>
                <div className="vault-empty-title">Wishlist is Empty</div>
                <p className="vault-empty-sub">Add items to your wishlist to track prices and availability.</p>
                <Link to="/shop" className="btn-primary"><ShoppingBag size={13} /> Start Wishlisting</Link>
              </div>
            ) : (
              wishItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`vc ${removing === item.id ? "removing" : ""}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="vc-badges">
                    {item.priceAlert && <span className="vcb vcb-alert">📉 Price Drop</span>}
                    {item.isNew     && <span className="vcb vcb-new">NEW</span>}
                  </div>
                  <button className="vc-remove" onClick={() => removeFromWishlist(item.id)} title="Remove">
                    <Trash2 size={13} />
                  </button>
                  <div className="vc-img">
                    <img src={item.img} alt={item.name} loading="lazy" />
                  </div>
                  <div className="vc-body">
                    <div className={view === "list" ? "vc-info" : ""}>
                      <div className="vc-saved-date"><Heart size={9} /> Added {item.savedAt}</div>
                      <div className="vc-cond">{item.condition} · {item.category}</div>
                      <div className="vc-name">{item.name}</div>
                      <div className="vc-brand">{item.brand}</div>
                      <div className="vc-price">
                        ${item.price}
                        {item.originalPrice && <span className="vc-orig">R{item.originalPrice}</span>}
                      </div>
                    </div>
                    <div className="vc-actions">
                      <button
                        className={`vc-btn vc-btn-cart ${added[item.id] ? "done" : ""}`}
                        onClick={() => handleAddCart(item.id)}
                      >
                        <ShoppingBag size={11} />
                        {added[item.id] ? "Added!" : "Add to Cart"}
                      </button>
                      <Link to={`/product/${item.id}`} className="vc-btn vc-btn-view" title="View product">
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── RECENTLY VIEWED TAB ── */}
        {tab === "recent" && (
          <div className="recent-grid">
            {RECENT_ITEMS.map((item, i) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="vc-recent-item"
                style={{ animationDelay: `${i * 0.04}s`, textDecoration: "none" }}
              >
                <div className="vc-ri-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                </div>
                <div className="vc-ri-body">
                  <div className="vc-ri-viewed"><Eye size={9} /> {item.viewedAt}</div>
                  <div className="vc-ri-name">{item.name}</div>
                  <div className="vc-ri-brand">{item.brand}</div>
                  <div className="vc-ri-price">R{item.price}</div>
                  <button className="vc-ri-btn" onClick={e => e.preventDefault()}>
                    <Eye size={10} /> Quick View
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── TRENDING / RECOMMENDATIONS ── */}
        <div className="vault-section">
          <div className="vault-section-head">
            <span className="vault-section-title">
              <TrendingUp size={18} /> You Might Like
            </span>
            <Link to="/shop" className="vault-section-link">
              View All <ChevronRight size={11} />
            </Link>
          </div>
          <div className="recent-grid">
            {PRODUCTS.slice(20, 26).map((p, i) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="vc-recent-item"
                style={{ animationDelay: `${i * 0.04}s`, textDecoration: "none" }}
              >
                <div className="vc-ri-img">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <div className="vc-ri-body">
                  <div className="vc-ri-name">{p.name}</div>
                  <div className="vc-ri-brand">{p.brand}</div>
                  <div className="vc-ri-price">R{p.price}</div>
                  <button className="vc-ri-btn" onClick={e => e.preventDefault()}>
                    <ShoppingBag size={10} /> Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}