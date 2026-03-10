import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown, Search,
  Truck, Check, Clock, X, RotateCcw, Download,
  ShoppingBag, Star, AlertCircle, MapPin, Receipt
} from "lucide-react";
import { PRODUCTS } from "../../data/products";

// ── Mock order data ───────────────────────────────────────────────────────
type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled" | "returned";

const MOCK_ORDERS = [
  {
    id: "CV-18423", date: "Feb 14, 2026", total: 385, status: "delivered" as OrderStatus,
    deliveredOn: "Feb 18, 2026", tracking: "TRK928374650ZA",
    items: [
      { product: PRODUCTS[0], size: "10", qty: 1 },
      { product: PRODUCTS[4], size: "9.5", qty: 1 },
    ],
    address: "123 Main St, Johannesburg, Gauteng 2000",
    shipping: "Standard", invoiceReady: true,
  },
  {
    id: "CV-17891", date: "Jan 30, 2026", total: 210, status: "shipped" as OrderStatus,
    estimatedDelivery: "Mar 5, 2026", tracking: "TRK773829101ZA",
    items: [
      { product: PRODUCTS[11], size: "8", qty: 2 },
    ],
    address: "123 Main St, Johannesburg, Gauteng 2000",
    shipping: "Express", invoiceReady: true,
  },
  {
    id: "CV-17210", date: "Jan 12, 2026", total: 95, status: "processing" as OrderStatus,
    estimatedDelivery: "Mar 3, 2026", tracking: null,
    items: [
      { product: PRODUCTS[3], size: "11", qty: 1 },
    ],
    address: "456 Business Park, Sandton, Gauteng 2196",
    shipping: "Standard", invoiceReady: false,
  },
  {
    id: "CV-16540", date: "Dec 30, 2025", total: 175, status: "cancelled" as OrderStatus,
    cancelledOn: "Dec 31, 2025", tracking: null,
    items: [
      { product: PRODUCTS[1], size: "9", qty: 1 },
    ],
    address: "123 Main St, Johannesburg, Gauteng 2000",
    shipping: "Standard", invoiceReady: false,
  },
  {
    id: "CV-15872", date: "Dec 10, 2025", total: 260, status: "returned" as OrderStatus,
    returnedOn: "Dec 18, 2025", tracking: "TRK112938473ZA",
    items: [
      { product: PRODUCTS[5], size: "10.5", qty: 1 },
    ],
    address: "123 Main St, Johannesburg, Gauteng 2000",
    shipping: "Express", invoiceReady: true,
  },
  {
    id: "CV-14901", date: "Nov 22, 2025", total: 470, status: "delivered" as OrderStatus,
    deliveredOn: "Nov 26, 2025", tracking: "TRK556473829ZA",
    items: [
      { product: PRODUCTS[2],  size: "9",  qty: 1 },
      { product: PRODUCTS[7],  size: "10", qty: 1 },
      { product: PRODUCTS[10], size: "8",  qty: 1 },
    ],
    address: "123 Main St, Johannesburg, Gauteng 2000",
    shipping: "Overnight", invoiceReady: true,
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,.08)",    border: "rgba(34,197,94,.25)",    icon: <Check size={11} /> },
  shipped:    { label: "Shipped",    color: "#3b82f6", bg: "rgba(59,130,246,.08)",   border: "rgba(59,130,246,.25)",   icon: <Truck size={11} /> },
  processing: { label: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,.08)",   border: "rgba(245,158,11,.25)",   icon: <Clock size={11} /> },
  cancelled:  { label: "Cancelled",  color: "#ff2d00", bg: "rgba(255,45,0,.08)",     border: "rgba(255,45,0,.25)",     icon: <X size={11} /> },
  returned:   { label: "Returned",   color: "#a855f7", bg: "rgba(168,85,247,.08)",   border: "rgba(168,85,247,.25)",   icon: <RotateCcw size={11} /> },
};

const FILTER_OPTIONS = ["All", "Delivered", "Shipped", "Processing", "Cancelled", "Returned"]; void FILTER_OPTIONS;

// ── Progress steps for tracking ───────────────────────────────────────────
const PROGRESS_STEPS: Record<OrderStatus, number> = {
  processing: 1, shipped: 2, delivered: 3, cancelled: 0, returned: 0,
};

export default function OrdersPage() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [reordered, setReordered] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed]   = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const handleReorder = (id: string) => {
    setReordered(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setReordered(prev => ({ ...prev, [id]: false })), 1800);
  };

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.product.name.toLowerCase().includes(search.toLowerCase()) ||
                        i.product.brand.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "All" || o.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  // summary counts
  const counts = MOCK_ORDERS.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1; return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .ord {
          max-width: 1100px; margin: 0 auto;
          padding: 36px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .ord { padding: 44px 40px 100px; } }
        @media (min-width: 1100px) { .ord { padding: 48px 60px 100px; } }

        /* ── BREADCRUMB ── */
        .ord-crumb {
          display: flex; align-items: center; gap: 6px; margin-bottom: 28px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .ord-crumb a { color: var(--dim); text-decoration: none; transition: color .2s; }
        .ord-crumb a:hover { color: var(--white); }
        .ord-crumb-sep { color: rgba(255,255,255,.15); font-size: 9px; }
        .ord-crumb-cur { color: var(--accent); }

        /* ── HEADER ── */
        .ord-header { margin-bottom: 32px; animation: ordIn .5s ease both; }
        .ord-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .ord-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
        .ord-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 4.5vw, 52px);
          letter-spacing: 2px; line-height: .95; color: var(--white); margin-bottom: 8px;
        }
        .ord-title span { color: var(--accent); }
        .ord-sub {
          font-size: 13px; font-weight: 300; color: var(--dim);
        }

        /* ── SUMMARY STATS ── */
        .ord-stats {
          display: flex; gap: 3px; flex-wrap: wrap; margin-bottom: 28px;
          animation: ordIn .5s ease .05s both;
        }
        .ord-stat {
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          padding: 12px 18px; flex: 1; min-width: 90px;
          border-top: 2px solid rgba(255,255,255,.05); transition: border-color .2s;
          cursor: pointer;
        }
        .ord-stat:hover { border-color: var(--accent); }
        .ord-stat.active { border-top-color: var(--accent); }
        .ord-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 2px; color: var(--white); line-height: 1; margin-bottom: 3px;
        }
        .ord-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }

        /* ── TOOLBAR ── */
        .ord-toolbar {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          flex-wrap: wrap; animation: ordIn .5s ease .1s both;
        }
        .ord-search {
          display: flex; align-items: center; gap: 8px;
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          padding: 10px 14px; flex: 1; min-width: 200px;
          transition: border-color .2s;
        }
        .ord-search:focus-within { border-color: var(--accent); }
        .ord-search input {
          background: transparent; border: none; outline: none;
          color: var(--white); font-family: 'Barlow', sans-serif; font-size: 13px; flex: 1;
        }
        .ord-search input::placeholder { color: var(--dim); }
        .ord-filter-wrap { display: flex; gap: 4px; flex-wrap: wrap; }
        .ord-filter-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          color: var(--dim); padding: 8px 14px; cursor: pointer;
          transition: all .15s; white-space: nowrap;
        }
        .ord-filter-btn:hover { border-color: rgba(255,255,255,.2); color: var(--white); }
        .ord-filter-btn.on { background: var(--accent); border-color: var(--accent); color: var(--white); }

        /* ── ORDER ROW ── */
        .ord-list { display: flex; flex-direction: column; gap: 3px; }

        .ord-row {
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          overflow: hidden; transition: border-color .2s;
          animation: ordIn .4s ease both;
        }
        .ord-row:hover { border-color: rgba(255,255,255,.12); }

        /* order header row */
        .ord-row-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px; padding: 16px 20px;
          cursor: pointer; align-items: center;
          transition: background .15s;
        }
        .ord-row-header:hover { background: rgba(255,255,255,.02); }

        .ord-row-left { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

        .ord-id {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px; letter-spacing: 3px; color: var(--white);
          white-space: nowrap;
        }
        .ord-id span { color: var(--accent); }

        .ord-date {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }

        /* status pill */
        .ord-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 3px 10px; border: 1px solid; flex-shrink: 0;
        }

        /* order total */
        .ord-total {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 1px; color: var(--white);
          white-space: nowrap;
        }

        /* thumbnail strip */
        .ord-thumbs {
          display: flex; gap: 4px; flex-wrap: wrap;
        }
        .ord-thumb {
          width: 40px; height: 40px; overflow: hidden; background: var(--mid); flex-shrink: 0;
        }
        .ord-thumb img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.8); }
        .ord-thumb-more {
          width: 40px; height: 40px; background: var(--mid);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 13px;
          color: var(--dim);
        }

        .ord-row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .ord-chevron { color: var(--dim); transition: transform .25s; }
        .ord-chevron.open { transform: rotate(180deg); }

        /* ── EXPANDED DETAIL ── */
        .ord-detail {
          border-top: 1px solid rgba(255,255,255,.06);
          padding: 20px;
          display: grid; grid-template-columns: 1fr;
          gap: 20px;
          animation: slideDown .25s ease both;
        }
        @media (min-width: 768px) { .ord-detail { grid-template-columns: 1fr 280px; } }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        /* items list */
        .ord-items { display: flex; flex-direction: column; gap: 10px; }
        .ord-item {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 14px; background: var(--mid);
        }
        .ord-item-img {
          width: 64px; height: 64px; flex-shrink: 0; overflow: hidden; background: var(--black);
        }
        .ord-item-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.85); }
        .ord-item-info { flex: 1; min-width: 0; }
        .ord-item-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 3px;
        }
        .ord-item-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          color: var(--white); margin-bottom: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ord-item-meta {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: 1px;
        }
        .ord-item-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; color: var(--white); flex-shrink: 0;
        }

        /* ── TRACKING PROGRESS ── */
        .ord-track { margin-top: 16px; }
        .ord-track-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .ord-track-id {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 2px;
          color: var(--accent);
        }
        .ord-steps {
          display: flex; align-items: center; gap: 0; position: relative;
        }
        .ord-step {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          flex: 1; position: relative; z-index: 1;
        }
        .ord-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--mid); border: 2px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; transition: all .3s;
        }
        .ord-step-dot.done {
          background: var(--accent); border-color: var(--accent); color: white;
        }
        .ord-step-dot.active {
          background: transparent; border-color: var(--accent); color: var(--accent);
          box-shadow: 0 0 0 4px rgba(255,45,0,.15);
        }
        .ord-step-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--dim); text-align: center;
        }
        .ord-step-label.done  { color: var(--white); }
        .ord-step-label.active { color: var(--accent); }
        .ord-step-connector {
          flex: 1; height: 2px; background: rgba(255,255,255,.08);
          margin-top: -22px; z-index: 0;
          transition: background .3s;
        }
        .ord-step-connector.done { background: var(--accent); }

        /* ── SIDEBAR (right panel in detail) ── */
        .ord-sidebar {}
        .ord-info-block {
          background: var(--mid); padding: 14px 16px; margin-bottom: 10px;
        }
        .ord-info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .ord-info-val {
          font-size: 13px; font-weight: 300; line-height: 1.7; color: var(--white);
        }
        .ord-info-val strong {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
        }

        /* line items summary */
        .ord-summary-lines { display: flex; flex-direction: column; gap: 7px; }
        .ord-sum-line {
          display: flex; justify-content: space-between;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          color: var(--dim);
        }
        .ord-sum-line.total {
          color: var(--white); padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,.07);
          font-size: 14px;
        }
        .ord-sum-val { font-family: 'Bebas Neue', sans-serif; font-size: 14px; color: var(--white); }
        .ord-sum-line.total .ord-sum-val { font-size: 20px; }

        /* action buttons */
        .ord-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
        .ord-act-btn {
          width: 100%; padding: 11px; font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: none; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .ord-act-primary {
          background: var(--accent); color: var(--white);
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          position: relative; overflow: hidden;
        }
        .ord-act-primary::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,.18);
          transform:translateX(-120%) skewX(-15deg); transition:transform .4s;
        }
        .ord-act-primary:hover::after { transform:translateX(120%) skewX(-15deg); }
        .ord-act-primary:hover { background: #ff5533; }
        .ord-act-primary.done { background: #16a34a; }
        .ord-act-ghost {
          background: transparent; color: var(--dim);
          border: 1px solid rgba(255,255,255,.1);
        }
        .ord-act-ghost:hover { border-color: rgba(255,255,255,.25); color: var(--white); }
        .ord-act-ghost.disabled { opacity: .35; pointer-events: none; }

        /* review stars */
        .ord-review-stars { display: flex; gap: 4px; justify-content: center; margin-bottom: 4px; }
        .rev-star { cursor: pointer; color: rgba(255,255,255,.15); transition: color .15s; }
        .rev-star:hover, .rev-star.on { color: #f59e0b; }

        /* ── EMPTY STATE ── */
        .ord-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 20px; text-align: center;
          background: var(--gray); border-top: 2px solid rgba(255,255,255,.04);
          animation: ordIn .4s ease both;
        }
        .ord-empty-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 90px;
          color: rgba(255,255,255,.04); line-height: 1; margin-bottom: 12px;
        }
        .ord-empty-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 26px;
          letter-spacing: 3px; color: var(--dim); margin-bottom: 8px;
        }
        .ord-empty-sub { font-size: 13px; color: var(--dim); margin-bottom: 24px; }
        .btn-primary {
          font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 12px 28px; cursor: pointer; text-decoration: none;
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition: all .25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: #ff5533; transform: translateY(-2px); }

        @keyframes ordIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="ord">

        {/* BREADCRUMB */}
        <nav className="ord-crumb">
          <Link to="/">Home</Link>
          <span className="ord-crumb-sep">›</span>
          <Link to="/profile">Account</Link>
          <span className="ord-crumb-sep">›</span>
          <span className="ord-crumb-cur">Orders</span>
        </nav>

        {/* HEADER */}
        <div className="ord-header">
          <div className="ord-eyebrow">Your Account</div>
          <h1 className="ord-title">ORDER <span>HISTORY</span></h1>
          <p className="ord-sub">{MOCK_ORDERS.length} orders placed · All time</p>
        </div>

        {/* STATS */}
        <div className="ord-stats">
          {[
            { label: "All Orders", count: MOCK_ORDERS.length, key: "All" },
            { label: "Delivered",  count: counts.delivered  || 0, key: "Delivered" },
            { label: "Shipped",    count: counts.shipped    || 0, key: "Shipped" },
            { label: "Processing", count: counts.processing || 0, key: "Processing" },
            { label: "Cancelled",  count: counts.cancelled  || 0, key: "Cancelled" },
          ].map(s => (
            <div
              key={s.key}
              className={`ord-stat ${filter === s.key ? "active" : ""}`}
              onClick={() => setFilter(s.key)}
            >
              <div className="ord-stat-num">{s.count}</div>
              <div className="ord-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="ord-toolbar">
          <div className="ord-search">
            <Search size={13} color="var(--dim)" />
            <input
              type="text"
              placeholder="Search by order ID, product or brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="ord-list">
          {filteredOrders.length === 0 ? (
            <div className="ord-empty">
              <div className="ord-empty-num">0</div>
              <div className="ord-empty-title">No Orders Found</div>
              <p className="ord-empty-sub">
                {search ? "Try a different search term." : "You haven't placed any orders yet."}
              </p>
              <Link to="/shop" className="btn-primary">
                <ShoppingBag size={13} /> Browse Marketplace
              </Link>
            </div>
          ) : (
            filteredOrders.map((order, idx) => {
              const cfg     = STATUS_CONFIG[order.status];
              const isOpen  = expanded === order.id;
              const step    = PROGRESS_STEPS[order.status];
              const showTrack = order.status === "shipped" || order.status === "delivered";
              const _shipping  = order.items.reduce((s,i) => s + i.product.price * i.qty, 0); void _shipping;

              return (
                <div
                  key={order.id}
                  className="ord-row"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* ── ROW HEADER ── */}
                  <div className="ord-row-header" onClick={() => toggle(order.id)}>
                    <div className="ord-row-left">
                      {/* thumbnails */}
                      <div className="ord-thumbs">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="ord-thumb">
                            <img src={item.product.img} alt={item.product.name} loading="lazy" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="ord-thumb-more">+{order.items.length - 3}</div>
                        )}
                      </div>

                      {/* info */}
                      <div>
                        <div className="ord-id">ORDER <span>#{order.id}</span></div>
                        <div className="ord-date">{order.date} · {order.items.reduce((s,i) => s + i.qty, 0)} item{order.items.reduce((s,i) => s + i.qty, 0) !== 1 ? "s" : ""}</div>
                      </div>

                      {/* status */}
                      <div
                        className="ord-status"
                        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                      >
                        {cfg.icon} {cfg.label}
                      </div>
                    </div>

                    <div className="ord-row-right">
                      <span className="ord-total">R{order.total}</span>
                      <ChevronDown size={15} className={`ord-chevron ${isOpen ? "open" : ""}`} />
                    </div>
                  </div>

                  {/* ── EXPANDED DETAIL ── */}
                  {isOpen && (
                    <div className="ord-detail">

                      {/* LEFT: items + tracking */}
                      <div>
                        <div className="ord-items">
                          {order.items.map((item, i) => (
                            <div key={i} className="ord-item">
                              <div className="ord-item-img">
                                <img src={item.product.img} alt={item.product.name} loading="lazy" />
                              </div>
                              <div className="ord-item-info">
                                <div className="ord-item-brand">{item.product.brand}</div>
                                <div className="ord-item-name">{item.product.name}</div>
                                <div className="ord-item-meta">
                                  US {item.size} · Qty {item.qty} · {item.product.condition}
                                </div>
                              </div>
                              <div className="ord-item-price">R{item.product.price * item.qty}</div>
                            </div>
                          ))}
                        </div>

                        {/* TRACKING PROGRESS */}
                        {showTrack && (
                          <div className="ord-track">
                            <div className="ord-track-title">
                              <Truck size={12} /> Tracking
                              {order.tracking && (
                                <span className="ord-track-id">{order.tracking}</span>
                              )}
                            </div>
                            <div className="ord-steps">
                              {["Order Placed","Processing","Shipped","Delivered"].map((s, i) => {
                                const isDone   = step > i;
                                const isActive = step === i;
                                return (
                                  <>
                                    {i > 0 && (
                                      <div
                                        key={`conn-${i}`}
                                        className={`ord-step-connector ${step > i ? "done" : ""}`}
                                      />
                                    )}
                                    <div key={s} className="ord-step">
                                      <div className={`ord-step-dot ${isDone ? "done" : isActive ? "active" : ""}`}>
                                        {isDone ? <Check size={12} /> : i + 1}
                                      </div>
                                      <span className={`ord-step-label ${isDone ? "done" : isActive ? "active" : ""}`}>{s}</span>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                            {order.status === "shipped" && (
                              <div style={{ marginTop: 12, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#3b82f6", letterSpacing:2, fontWeight:700, textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}>
                                <AlertCircle size={11} /> Est. delivery: {(order as any).estimatedDelivery}
                              </div>
                            )}
                            {order.status === "delivered" && (
                              <div style={{ marginTop: 12, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#22c55e", letterSpacing:2, fontWeight:700, textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}>
                                <Check size={11} /> Delivered {(order as any).deliveredOn}
                              </div>
                            )}
                          </div>
                        )}

                        {/* cancelled / returned note */}
                        {order.status === "cancelled" && (
                          <div style={{ marginTop: 14, padding:"10px 14px", background:"rgba(255,45,0,.06)", border:"1px solid rgba(255,45,0,.2)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"var(--accent)", letterSpacing:2, fontWeight:700, textTransform:"uppercase", display:"flex", alignItems:"center", gap:7 }}>
                            <X size={11} /> Cancelled on {(order as any).cancelledOn}
                          </div>
                        )}
                        {order.status === "returned" && (
                          <div style={{ marginTop: 14, padding:"10px 14px", background:"rgba(168,85,247,.06)", border:"1px solid rgba(168,85,247,.2)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:"#a855f7", letterSpacing:2, fontWeight:700, textTransform:"uppercase", display:"flex", alignItems:"center", gap:7 }}>
                            <RotateCcw size={11} /> Returned {(order as any).returnedOn}
                          </div>
                        )}
                      </div>

                      {/* RIGHT: summary + actions */}
                      <div className="ord-sidebar">

                        {/* address */}
                        <div className="ord-info-block">
                          <div className="ord-info-label"><MapPin size={11} /> Shipped To</div>
                          <div className="ord-info-val">{order.address}</div>
                        </div>

                        {/* order summary */}
                        <div className="ord-info-block">
                          <div className="ord-info-label"><Receipt size={11} /> Order Summary</div>
                          <div className="ord-summary-lines">
                            <div className="ord-sum-line">
                              <span>Subtotal</span>
                              <span className="ord-sum-val">R{order.total - (order.shipping === "Express" ? 12 : order.shipping === "Overnight" ? 24 : 0)}</span>
                            </div>
                            <div className="ord-sum-line">
                              <span>Shipping ({order.shipping})</span>
                              <span className="ord-sum-val">
                                {order.shipping === "Standard" ? "FREE" : order.shipping === "Express" ? "R12" : "R24"}
                              </span>
                            </div>
                            <div className="ord-sum-line total">
                              <span>Total</span>
                                <span className="ord-sum-val">R{order.total}</span>
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="ord-actions">
                          {/* reorder */}
                          {(order.status === "delivered" || order.status === "returned") && (
                            <button
                              className={`ord-act-btn ord-act-primary ${reordered[order.id] ? "done" : ""}`}
                              onClick={() => handleReorder(order.id)}
                            >
                              {reordered[order.id]
                                ? <><Check size={12} /> Added to Cart!</>
                                : <><RotateCcw size={12} /> Reorder</>
                              }
                            </button>
                          )}

                          {/* track */}
                          {order.status === "shipped" && order.tracking && (
                            <button className="ord-act-btn ord-act-primary">
                              <Truck size={12} /> Track Package
                            </button>
                          )}

                          {/* view product */}
                          <Link
                            to={`/product/${order.items[0].product.id}`}
                            className="ord-act-btn ord-act-ghost"
                            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"var(--dim)", border:"1px solid rgba(255,255,255,.1)", transition:"all .2s", background:"transparent" }}
                          >
                            <ShoppingBag size={12} /> View Products
                          </Link>

                          {/* download invoice */}
                          <button
                            className={`ord-act-btn ord-act-ghost ${!order.invoiceReady ? "disabled" : ""}`}
                          >
                            <Download size={12} />
                            {order.invoiceReady ? "Download Invoice" : "Invoice Pending"}
                          </button>

                          {/* leave review */}
                          {order.status === "delivered" && (
                            <button
                              className={`ord-act-btn ord-act-ghost ${reviewed[order.id] ? "" : ""}`}
                              style={reviewed[order.id] ? { color: "#f59e0b", borderColor: "rgba(245,158,11,.3)" } : {}}
                              onClick={() => setReviewed(prev => ({ ...prev, [order.id]: true }))}
                            >
                              <Star size={12} fill={reviewed[order.id] ? "#f59e0b" : "none"} />
                              {reviewed[order.id] ? "Review Submitted!" : "Leave a Review"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
