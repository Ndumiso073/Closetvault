import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingBag, Trash2, Grid3X3, LayoutList,
  Bell, BellOff, ChevronRight, ArrowLeft, TrendingDown,
} from "lucide-react";
import { PRODUCTS } from "../../data/products";

// ── Mock wishlist data ────────────────────────────────────────────────────
const INITIAL_WISHLIST = PRODUCTS.slice(2, 14).map((p, i) => ({
  ...p,
  savedAt: [
    "Today", "Yesterday", "2 days ago", "Jan 28",
    "Jan 20", "Jan 15", "Jan 10", "Dec 30",
    "Dec 22", "Dec 18", "Dec 5", "Nov 28",
  ][i],
  priceAlert: i % 3 === 0,
  priceDrop: i % 4 === 0 ? Math.round(p.price * 0.12) : 0,
}));

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

const SORT_LABELS: Record<SortKey, string> = {
  newest:       "Recently Added",
  "price-asc":  "Price: Low → High",
  "price-desc": "Price: High → Low",
  name:         "Name A–Z",
};

export default function WishlistPage() {
  const navigate = useNavigate();

  const [items, setItems]     = useState(INITIAL_WISHLIST);
  const [view, setView]       = useState<"grid" | "list">("grid");
  const [sort, setSort]       = useState<SortKey>("newest");
  const [removing, setRem]    = useState<number | null>(null);
  const [adding, setAdding]   = useState<number | null>(null);

  const remove = (id: number) => {
    setRem(id);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
      setRem(null);
    }, 320);
  };

  const toggleAlert = (id: number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, priceAlert: !i.priceAlert } : i));

  const addToCart = (id: number) => {
    setAdding(id);
    setTimeout(() => setAdding(null), 900);
  };

  const sorted = [...items].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name")       return a.name.localeCompare(b.name);
    return 0;
  });

  const alertCount = items.filter(i => i.priceAlert).length;

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .wl {
          max-width: 1320px; margin: 0 auto;
          padding: 32px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .wl { padding: 40px 40px 100px; } }
        @media (min-width: 1200px) { .wl { padding: 44px 60px 100px; } }

        /* ── BREADCRUMB ── */
        .wl-crumb {
          display: flex; align-items: center; gap: 6px; margin-bottom: 32px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .wl-crumb a { color: var(--dim); text-decoration: none; transition: color .2s; }
        .wl-crumb a:hover { color: var(--white); }
        .wl-crumb-sep { color: rgba(255,255,255,.15); font-size: 9px; }
        .wl-crumb-cur { color: var(--accent); }

        /* ── HEADER ── */
        .wl-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; margin-bottom: 32px;
        }
        .wl-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 54px);
          letter-spacing: 2px; line-height: .95; color: var(--white);
        }
        .wl-title span { color: var(--accent); }
        .wl-subtitle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-top: 6px;
        }

        /* stats row */
        .wl-stats {
          display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 28px;
        }
        .wl-stat {
          display: flex; flex-direction: column; gap: 2px;
          padding: 14px 20px;
          background: var(--gray);
          border: 1px solid rgba(255,255,255,.06);
          min-width: 100px;
        }
        .wl-stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 2px; color: var(--white); line-height: 1;
        }
        .wl-stat-val.accent { color: var(--accent); }
        .wl-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }

        /* ── TOOLBAR ── */
        .wl-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .wl-toolbar-left { display: flex; align-items: center; gap: 10px; }

        .wl-sort {
          background: var(--gray); border: 1px solid rgba(255,255,255,.1);
          color: var(--white);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 12px 14px; cursor: pointer; outline: none; appearance: none;
          transition: border-color .2s; height: 44px;
        }
        .wl-sort:focus { border-color: var(--accent); }

        .wl-view-btns { display: flex; gap: 4px; }
        .wl-view-btn {
          width: 44px; height: 44px;
          background: var(--gray); border: 1px solid rgba(255,255,255,.1);
          color: var(--dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .wl-view-btn.on { border-color: var(--accent); color: var(--accent); }
        .wl-view-btn:hover:not(.on) { border-color: rgba(255,255,255,.2); color: var(--white); }

        .wl-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          color: var(--dim);
        }

        /* ── GRID ── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
        }
        @media (min-width: 640px)  { .wl-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px)  { .wl-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1200px) { .wl-grid { grid-template-columns: repeat(5, 1fr); } }

        /* ── GRID CARD ── */
        .wl-card {
          background: var(--gray);
          position: relative; overflow: hidden;
          transition: opacity .3s, transform .3s;
        }
        .wl-card.removing { opacity: 0; transform: scale(.94); }

        .wl-card-img {
          aspect-ratio: 1; overflow: hidden; position: relative;
          background: var(--mid);
          display: block;
        }
        .wl-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.85) saturate(.8);
          transition: filter .35s, transform .35s;
        }
        .wl-card:hover .wl-card-img img {
          filter: brightness(.95) saturate(1);
          transform: scale(1.04);
        }

        /* badges */
        .wl-card-badges {
          position: absolute; top: 8px; left: 8px;
          display: flex; flex-direction: column; gap: 4px; z-index: 2;
        }
        .wl-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 3px 7px;
        }
        .wl-badge.hot  { background: var(--accent); color: var(--white); }
        .wl-badge.new  { background: var(--white); color: var(--black); }
        .wl-badge.drop { background: #22c55e; color: var(--white); }

        /* action overlay */
        .wl-card-actions {
          position: absolute; top: 8px; right: 8px;
          display: flex; flex-direction: column; gap: 4px; z-index: 2;
          opacity: 0; transform: translateX(6px);
          transition: opacity .25s, transform .25s;
        }
        .wl-card:hover .wl-card-actions { opacity: 1; transform: translateX(0); }
        /* always show actions on touch devices */
        @media (hover: none) {
          .wl-card-actions { opacity: 1; transform: translateX(0); }
        }
        .wl-action-btn {
          width: 44px; height: 44px;
          background: rgba(10,10,10,.82); border: 1px solid rgba(255,255,255,.12);
          color: var(--dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s; backdrop-filter: blur(4px);
        }
        .wl-action-btn:hover { border-color: var(--accent); color: var(--accent); }
        .wl-action-btn.remove:hover { border-color: #ef4444; color: #ef4444; }
        .wl-action-btn.alert-on { color: var(--accent); border-color: rgba(255,45,0,.4); }

        /* price drop ribbon */
        .wl-card-drop {
          display: flex; align-items: center; gap: 5px;
          background: rgba(34,197,94,.12); border-top: 1px solid rgba(34,197,94,.2);
          padding: 5px 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: #22c55e;
        }

        /* card body */
        .wl-card-body { padding: 10px 12px 12px; }
        .wl-card-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 2px;
        }
        .wl-card-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: .5px;
          color: var(--white);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 6px;
        }
        .wl-card-bottom {
          display: flex; align-items: center; justify-content: space-between; gap: 6px;
        }
        .wl-card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px; color: var(--white);
        }
        .wl-card-original {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; color: var(--dim);
          text-decoration: line-through; margin-left: 4px;
        }
        .wl-add-btn {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          background: var(--accent); color: var(--white);
          border: none; padding: 11px 12px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          transition: all .2s; white-space: nowrap; flex-shrink: 0;
        }
        .wl-add-btn:hover { background: #ff5533; }
        .wl-add-btn.added { background: #16a34a; clip-path: none; }

        /* ── LIST VIEW ── */
        .wl-list { display: flex; flex-direction: column; gap: 3px; }
        .wl-list-item {
          display: flex; align-items: center; gap: 14px;
          background: var(--gray); padding: 12px 16px;
          border-top: 2px solid rgba(255,255,255,.04);
          transition: opacity .3s, transform .3s, border-color .2s;
        }
        .wl-list-item:hover { border-color: rgba(255,255,255,.1); }
        .wl-list-item.removing { opacity: 0; transform: translateX(12px); }

        .wl-list-img {
          width: 72px; height: 72px; flex-shrink: 0; overflow: hidden;
          background: var(--mid);
        }
        .wl-list-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.85) saturate(.8);
          transition: filter .2s;
        }
        .wl-list-item:hover .wl-list-img img { filter: brightness(.95) saturate(1); }

        .wl-list-info { flex: 1; min-width: 0; }
        .wl-list-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 2px;
        }
        .wl-list-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700; color: var(--white);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .wl-list-meta { display: flex; gap: 6px; flex-wrap: wrap; }
        .wl-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 2px 8px;
          background: var(--mid); border: 1px solid rgba(255,255,255,.08); color: var(--dim);
        }
        .wl-tag.drop { border-color: rgba(34,197,94,.3); color: #22c55e; }

        .wl-list-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 1px; color: var(--white);
          flex-shrink: 0;
        }
        .wl-list-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .wl-list-btn {
          width: 34px; height: 34px;
          background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          color: var(--dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .wl-list-btn:hover { border-color: var(--accent); color: var(--accent); }
        .wl-list-btn.remove:hover { border-color: #ef4444; color: #ef4444; }
        .wl-list-btn.alert-on { color: var(--accent); border-color: rgba(255,45,0,.4); }
        .wl-list-add {
          display: flex; align-items: center; gap: 5px;
          background: var(--accent); color: var(--white);
          border: none; padding: 0 16px; height: 34px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          transition: background .2s; white-space: nowrap;
        }
        .wl-list-add:hover { background: #ff5533; }
        .wl-list-add.added { background: #16a34a; clip-path: none; }
        @media (max-width: 600px) {
          .wl-list-item { flex-wrap: wrap; }
          .wl-list-price { order: 3; }
          .wl-list-actions { order: 4; margin-left: auto; }
        }

        /* ── EMPTY STATE ── */
        .wl-empty {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 80px 20px;
          background: var(--gray);
          border-top: 2px solid rgba(255,255,255,.04);
        }
        .wl-empty-icon { color: rgba(255,255,255,.06); margin-bottom: 16px; }
        .wl-empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 3px; color: var(--dim); margin-bottom: 8px;
        }
        .wl-empty-sub { font-size: 14px; color: var(--dim); margin-bottom: 28px; line-height: 1.6; }
        .wl-shop-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent); color: var(--white);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          padding: 14px 36px; text-decoration: none;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition: background .2s;
        }
        .wl-shop-btn:hover { background: #ff5533; }

        /* ── CONTINUE LINK ── */
        .wl-continue {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); text-decoration: none; transition: color .2s;
        }
        .wl-continue:hover { color: var(--white); }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="wl">

        {/* BREADCRUMB */}
        <nav className="wl-crumb">
          <Link to="/">Home</Link>
          <span className="wl-crumb-sep">›</span>
          <Link to="/vault">Vault</Link>
          <span className="wl-crumb-sep">›</span>
          <span className="wl-crumb-cur">Wishlist</span>
        </nav>

        {/* HEADER */}
        <div className="wl-header">
          <div>
            <h1 className="wl-title">MY <span>WISHLIST</span></h1>
            <p className="wl-subtitle">Items you're watching — get notified on price drops</p>
          </div>
        </div>

        {/* STATS */}
        <div className="wl-stats" style={{ animation: "fadeUp .4s ease both" }}>
          <div className="wl-stat">
            <span className="wl-stat-val">{items.length}</span>
            <span className="wl-stat-label">Items Saved</span>
          </div>
          <div className="wl-stat">
            <span className="wl-stat-val accent">{alertCount}</span>
            <span className="wl-stat-label">Price Alerts</span>
          </div>
          <div className="wl-stat">
            <span className="wl-stat-val">R{items.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
            <span className="wl-stat-label">Total Value</span>
          </div>
          <div className="wl-stat">
            <span className="wl-stat-val accent">{items.filter(i => i.priceDrop > 0).length}</span>
            <span className="wl-stat-label">Price Drops</span>
          </div>
        </div>

        {/* TOOLBAR */}
        {items.length > 0 && (
          <div className="wl-toolbar">
            <div className="wl-toolbar-left">
              <select
                className="wl-sort"
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
              >
                {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <span className="wl-count">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="wl-view-btns">
              <button
                className={`wl-view-btn ${view === "grid" ? "on" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <Grid3X3 size={14} />
              </button>
              <button
                className={`wl-view-btn ${view === "list" ? "on" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {items.length === 0 ? (
          <div className="wl-empty" style={{ animation: "fadeUp .4s ease both" }}>
            <div className="wl-empty-icon"><Heart size={64} strokeWidth={1} /></div>
            <div className="wl-empty-title">Wishlist is Empty</div>
            <p className="wl-empty-sub">
              Save items you love and get notified when<br />prices drop.
            </p>
            <Link to="/shop" className="wl-shop-btn">
              <ShoppingBag size={14} /> Browse Marketplace
            </Link>
          </div>
        ) : view === "grid" ? (
          <div className="wl-grid">
            {sorted.map((item, idx) => (
              <div
                key={item.id}
                className={`wl-card ${removing === item.id ? "removing" : ""}`}
                style={{ animation: `fadeUp .4s ease ${idx * 0.04}s both` }}
              >
                {/* image */}
                <Link to={`/product/${item.id}`} className="wl-card-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                  {/* badges */}
                  <div className="wl-card-badges">
                    {item.isHot && <span className="wl-badge hot">Hot</span>}
                    {item.isNew && <span className="wl-badge new">New</span>}
                    {item.priceDrop > 0 && <span className="wl-badge drop">↓ Drop</span>}
                  </div>
                  {/* hover actions */}
                  <div className="wl-card-actions">
                    <button
                      className={`wl-action-btn ${item.priceAlert ? "alert-on" : ""}`}
                      onClick={e => { e.preventDefault(); toggleAlert(item.id); }}
                      title={item.priceAlert ? "Disable alert" : "Enable price alert"}
                    >
                      {item.priceAlert ? <Bell size={13} /> : <BellOff size={13} />}
                    </button>
                    <button
                      className="wl-action-btn remove"
                      onClick={e => { e.preventDefault(); remove(item.id); }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Link>

                {/* price drop ribbon */}
                {item.priceDrop > 0 && (
                  <div className="wl-card-drop">
                    <TrendingDown size={11} /> Price dropped ${item.priceDrop}
                  </div>
                )}

                {/* body */}
                <div className="wl-card-body">
                  <div className="wl-card-brand">{item.brand}</div>
                  <div className="wl-card-name">{item.name}</div>
                  <div className="wl-card-bottom">
                    <div>
                      <span className="wl-card-price">R{item.price}</span>
                      {item.originalPrice && (
                        <span className="wl-card-original">R{item.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className={`wl-add-btn ${adding === item.id ? "added" : ""}`}
                      onClick={() => addToCart(item.id)}
                    >
                      {adding === item.id ? (
                        "✓"
                      ) : (
                        <><ShoppingBag size={11} /> Add</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="wl-list">
            {sorted.map((item, idx) => (
              <div
                key={item.id}
                className={`wl-list-item ${removing === item.id ? "removing" : ""}`}
                style={{ animation: `fadeUp .4s ease ${idx * 0.04}s both` }}
              >
                <Link to={`/product/${item.id}`} className="wl-list-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                </Link>

                <div className="wl-list-info">
                  <div className="wl-list-brand">{item.brand}</div>
                  <div className="wl-list-name">{item.name}</div>
                  <div className="wl-list-meta">
                    <span className="wl-tag">{item.condition}</span>
                    <span className="wl-tag">{item.category}</span>
                    {item.priceDrop > 0 && (
                      <span className="wl-tag drop">↓ ${item.priceDrop} drop</span>
                    )}
                  </div>
                </div>

                <div className="wl-list-price">R{item.price}</div>

                <div className="wl-list-actions">
                  <button
                    className={`wl-list-btn ${item.priceAlert ? "alert-on" : ""}`}
                    onClick={() => toggleAlert(item.id)}
                    title={item.priceAlert ? "Disable alert" : "Enable price alert"}
                  >
                    {item.priceAlert ? <Bell size={14} /> : <BellOff size={14} />}
                  </button>
                  <button
                    className="wl-list-btn remove"
                    onClick={() => remove(item.id)}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    className={`wl-list-add ${adding === item.id ? "added" : ""}`}
                    onClick={() => addToCart(item.id)}
                  >
                    {adding === item.id ? (
                      "✓ Added"
                    ) : (
                      <><ShoppingBag size={12} /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        {items.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
            <Link to="/shop" className="wl-continue">
              <ArrowLeft size={13} /> Continue Shopping
            </Link>
            <button
              onClick={() => navigate("/cart")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", border: "1px solid rgba(255,255,255,.15)",
                color: "var(--dim)", cursor: "pointer", padding: "10px 20px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                transition: "all .2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--white)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.15)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--dim)"; }}
            >
              View Cart <ChevronRight size={13} />
            </button>
          </div>
        )}

      </div>
    </>
  );
}
