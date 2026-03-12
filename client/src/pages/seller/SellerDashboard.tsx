import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Package, ShoppingBag, DollarSign, AlertTriangle,
  TrendingUp, TrendingDown, Plus, Eye, Settings,
  ChevronRight, Clock, CheckCircle, Truck, XCircle,
  ArrowUpRight, BarChart2, Zap, Star
} from "lucide-react";

/* ── MOCK DATA ── */
const STATS = [
  {
    id: "products",
    label: "Total Products",
    value: "124",
    sub: "+8 this week",
    trend: "up",
    icon: Package,
    color: "#ff2d00",
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "1,847",
    sub: "+23 today",
    trend: "up",
    icon: ShoppingBag,
    color: "#3b82f6",
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "R84,320",
    sub: "+12.4% this month",
    trend: "up",
    icon: DollarSign,
    color: "#22c55e",
  },
  {
    id: "lowstock",
    label: "Low Stock Alerts",
    value: "7",
    sub: "Needs attention",
    trend: "down",
    icon: AlertTriangle,
    color: "#f59e0b",
  },
];

const RECENT_ORDERS = [
  { id: "CV-48291", product: "Nike Air Max 95", buyer: "Jordan K.", size: "US 10", price: "R2,400", status: "delivered",  time: "2h ago" },
  { id: "CV-48290", product: "Adidas Yeezy 350", buyer: "Sipho M.", size: "US 9",  price: "R4,800", status: "shipped",    time: "5h ago" },
  { id: "CV-48289", product: "New Balance 550", buyer: "Lerato N.", size: "US 8",  price: "R1,950", status: "processing", time: "8h ago" },
  { id: "CV-48288", product: "Jordan 1 Retro High", buyer: "Thabo D.", size: "US 11", price: "R5,200", status: "delivered", time: "1d ago" },
  { id: "CV-48287", product: "Puma Suede Classic", buyer: "Ayanda P.", size: "US 9",  price: "R1,100", status: "cancelled", time: "1d ago" },
  { id: "CV-48286", product: "Converse Chuck 70", buyer: "Naledi S.", size: "US 7",  price: "R1,350", status: "shipped",    time: "2d ago" },
];

const LOW_STOCK = [
  { name: "Nike Dunk Low Panda", stock: 1, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70" },
  { name: "Adidas Forum Low", stock: 2, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&q=70" },
  { name: "Jordan 4 Retro", stock: 1, img: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=80&q=70" },
  { name: "New Balance 2002R", stock: 3, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&q=70" },
];

const REVENUE_BARS = [
  { month: "Jul", val: 52 },
  { month: "Aug", val: 68 },
  { month: "Sep", val: 45 },
  { month: "Oct", val: 78 },
  { month: "Nov", val: 62 },
  { month: "Dec", val: 91 },
  { month: "Jan", val: 84 },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,.12)",   icon: CheckCircle },
  shipped:    { label: "Shipped",    color: "#3b82f6", bg: "rgba(59,130,246,.12)",  icon: Truck       },
  processing: { label: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,.12)",  icon: Clock       },
  cancelled:  { label: "Cancelled",  color: "#ff2d00", bg: "rgba(255,45,0,.12)",    icon: XCircle     },
};

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<"all"|"processing"|"shipped"|"delivered">("all");

  const filteredOrders = activeTab === "all"
    ? RECENT_ORDERS
    : RECENT_ORDERS.filter(o => o.status === activeTab);

  return (
    <>
      <style>{`
        :root {
          --border: rgba(255,255,255,0.07);
          --pad-m:  16px;
          --pad-t:  32px;
          --pad-d:  48px;
        }

        /* ── PAGE SHELL ── */
        .sd-page {
          min-height: 100vh;
          background: var(--black);
          padding: 0 var(--pad-m) 64px;
          animation: sd-in .5s ease both;
        }
        @media(min-width:768px)  { .sd-page { padding: 0 var(--pad-t) 64px; } }
        @media(min-width:1024px) { .sd-page { padding: 0 var(--pad-d) 64px; } }
        @keyframes sd-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        /* ── HEADER ── */
        .sd-header {
          padding: 32px 0 28px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .sd-header-left {}
        .sd-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .sd-eyebrow::before { content:''; width:16px; height:1px; background:var(--accent); flex-shrink:0; }
        .sd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px,5vw,44px); letter-spacing: 2px;
          line-height: .95; color: var(--white);
        }
        .sd-title span { color: var(--accent); }
        .sd-subtitle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; color: var(--dim); margin-top: 6px; letter-spacing: .5px;
        }
        .sd-header-right {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
        }

        /* ── QUICK ACTION BUTTONS ── */
        .sd-action-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: none; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 16px; height: 40px;
          transition: all .2s; white-space: nowrap;
          position: relative; overflow: hidden;
        }
        .sd-action-btn::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,.15);
          transform:translateX(-110%) skewX(-15deg); transition:transform .35s ease;
        }
        .sd-action-btn:hover::after { transform:translateX(110%) skewX(-15deg); }

        .sd-btn-primary {
          background: var(--accent); color: var(--white);
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
        }
        .sd-btn-primary:hover { background: #ff5533; transform: translateY(-1px); }

        .sd-btn-secondary {
          background: var(--mid); color: var(--white);
          border: 1px solid var(--border);
        }
        .sd-btn-secondary:hover { border-color: rgba(255,255,255,.22); color: var(--white); }

        .sd-btn-ghost {
          background: transparent; color: var(--dim);
          border: 1px solid var(--border);
        }
        .sd-btn-ghost:hover { color: var(--white); border-color: rgba(255,255,255,.2); }

        /* ── STATS GRID ── */
        .sd-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px; margin-top: 28px;
        }
        @media(min-width:900px) { .sd-stats { grid-template-columns: repeat(4, 1fr); } }

        .sd-stat {
          background: var(--gray); padding: 20px 18px;
          position: relative; overflow: hidden;
          animation: sd-in .5s ease both;
          cursor: default;
          transition: transform .25s;
        }
        .sd-stat:hover { transform: translateY(-3px); }
        .sd-stat:nth-child(1) { animation-delay:.05s }
        .sd-stat:nth-child(2) { animation-delay:.10s }
        .sd-stat:nth-child(3) { animation-delay:.15s }
        .sd-stat:nth-child(4) { animation-delay:.20s }

        .sd-stat::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--stat-color, var(--accent));
          transform:scaleX(0); transform-origin:left; transition:transform .35s ease;
        }
        .sd-stat:hover::before { transform:scaleX(1); }

        .sd-stat-top {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;
        }
        .sd-stat-icon {
          width: 36px; height: 36px;
          background: var(--mid); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
        }
        .sd-stat-trend {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          display: flex; align-items: center; gap: 3px;
          padding: 3px 7px; background: var(--mid);
        }
        .sd-stat-trend.up   { color: #22c55e; }
        .sd-stat-trend.down { color: #f59e0b; }

        .sd-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 6px;
        }
        .sd-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px,4vw,36px); letter-spacing: 1px; color: var(--white); line-height: 1;
          margin-bottom: 4px;
        }
        .sd-stat-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: .5px;
        }

        /* giant bg number */
        .sd-stat-bg-num {
          position: absolute; right: 8px; bottom: -8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px; line-height: 1; letter-spacing: -2px;
          color: rgba(255,255,255,.03); pointer-events: none; user-select: none;
          transition: color .3s;
        }
        .sd-stat:hover .sd-stat-bg-num { color: rgba(255,255,255,.05); }

        /* ── MAIN BODY GRID ── */
        .sd-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3px; margin-top: 3px;
        }
        @media(min-width:1024px) {
          .sd-body { grid-template-columns: 1fr 340px; }
        }

        /* ── PANEL BASE ── */
        .sd-panel {
          background: var(--gray);
          animation: sd-in .5s ease both;
        }
        .sd-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px; border-bottom: 1px solid var(--border);
        }
        .sd-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px; letter-spacing: 4px; color: var(--white);
          display: flex; align-items: center; gap: 8px;
        }
        .sd-panel-title-dot {
          width: 6px; height: 6px; background: var(--accent);
          clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
        }
        .sd-panel-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent); text-decoration: none;
          display: flex; align-items: center; gap: 4px; transition: opacity .2s;
        }
        .sd-panel-link:hover { opacity: .7; }

        /* ── ORDER TABS ── */
        .sd-tabs {
          display: flex; border-bottom: 1px solid var(--border);
          padding: 0 20px; gap: 0; overflow-x: auto; scrollbar-width: none;
        }
        .sd-tabs::-webkit-scrollbar { display: none; }
        .sd-tab {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); background: transparent; border: none; cursor: pointer;
          padding: 12px 14px; border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: all .2s; white-space: nowrap;
        }
        .sd-tab:hover { color: var(--white); }
        .sd-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

        /* ── ORDER ROWS ── */
        .sd-orders { overflow: hidden; }
        .sd-order-row {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 20px; border-bottom: 1px solid var(--border);
          transition: background .15s; cursor: default;
        }
        .sd-order-row:last-child { border-bottom: none; }
        .sd-order-row:hover { background: rgba(255,255,255,.02); }

        .sd-order-id {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          color: var(--dim); flex-shrink: 0; width: 72px;
        }
        .sd-order-info { flex: 1; min-width: 0; }
        .sd-order-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: .5px; color: var(--white);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sd-order-meta {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); margin-top: 1px;
          display: flex; align-items: center; gap: 6px;
        }
        .sd-order-meta-sep { color: rgba(255,255,255,.15); }

        .sd-order-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 1px; color: var(--white); flex-shrink: 0;
        }
        .sd-status-pill {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          padding: 3px 8px; flex-shrink: 0;
          display: flex; align-items: center; gap: 4px;
        }
        .sd-order-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); flex-shrink: 0; width: 46px; text-align: right;
        }

        /* ── SIDEBAR PANELS ── */
        .sd-sidebar { display: flex; flex-direction: column; gap: 3px; }

        /* revenue chart */
        .sd-chart { padding: 16px 20px 20px; }
        .sd-chart-bars {
          display: flex; align-items: flex-end; gap: 6px; height: 80px; margin-top: 14px;
        }
        .sd-chart-bar-wrap {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;
          cursor: default;
        }
        .sd-chart-bar {
          width: 100%; background: var(--mid);
          transition: background .2s; position: relative;
          min-height: 4px;
        }
        .sd-chart-bar-wrap:hover .sd-chart-bar { background: var(--accent); }
        .sd-chart-bar-fill {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(255,45,0,.25); transition: background .2s;
        }
        .sd-chart-bar-wrap:hover .sd-chart-bar-fill { background: var(--accent); }
        .sd-chart-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: var(--dim);
        }
        .sd-chart-bar-wrap:hover .sd-chart-label { color: var(--white); }
        .sd-chart-peak {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 1px;
          position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
          color: var(--accent); opacity: 0; transition: opacity .2s; white-space: nowrap;
        }
        .sd-chart-bar-wrap:hover .sd-chart-peak { opacity: 1; }

        /* low stock */
        .sd-low-stock { overflow: hidden; }
        .sd-stock-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px; border-bottom: 1px solid var(--border);
          transition: background .15s;
        }
        .sd-stock-row:last-child { border-bottom: none; }
        .sd-stock-row:hover { background: rgba(255,255,255,.02); }
        .sd-stock-img {
          width: 40px; height: 40px; flex-shrink: 0; overflow: hidden;
          clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
          background: var(--mid);
        }
        .sd-stock-img img { width:100%; height:100%; object-fit:cover; filter:saturate(.7); }
        .sd-stock-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: .5px; color: var(--white);
          flex: 1; min-width: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sd-stock-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 2px;
          color: #f59e0b; background: rgba(245,158,11,.12);
          padding: 2px 8px; flex-shrink: 0;
        }
        .sd-stock-badge.critical { color: #ff2d00; background: rgba(255,45,0,.12); }

        /* seller score */
        .sd-score-wrap { padding: 18px 20px 20px; }
        .sd-score-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .sd-score-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .sd-score-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; letter-spacing: 2px; color: var(--white);
        }
        .sd-score-val.green { color: #22c55e; }
        .sd-score-bar-track {
          height: 3px; background: var(--mid); margin-bottom: 14px; position: relative;
        }
        .sd-score-bar-fill {
          position: absolute; top: 0; left: 0; height: 100%;
          transition: width .6s cubic-bezier(.4,0,.2,1);
        }

        /* empty state */
        .sd-empty {
          padding: 40px 20px; text-align: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }

        @media(max-width:600px) {
          .sd-order-id  { display: none; }
          .sd-order-time { display: none; }
          .sd-order-price { font-size: 14px; }
          .sd-action-btn { font-size: 10px; padding: 9px 12px; }
        }
        @media(max-width:400px) {
          .sd-status-pill { display: none; }
          .sd-header-right { display: none; }
        }
      `}</style>

      <div className="sd-page">

        {/* ── HEADER ── */}
        <div className="sd-header">
          <div className="sd-header-left">
            <div className="sd-eyebrow">Seller Portal</div>
            <div className="sd-title">YOUR <span>DASHBOARD</span></div>
            <div className="sd-subtitle">Welcome back, VaultKing_ZA · Last updated just now</div>
          </div>
          <div className="sd-header-right">
            <Link to="/sell/add" className="sd-action-btn sd-btn-primary">
              <Plus size={13} /> Add Product
            </Link>
            <Link to="/orders" className="sd-action-btn sd-btn-secondary">
              <Eye size={13} /> View Orders
            </Link>
            <Link to="/sell/products" className="sd-action-btn sd-btn-ghost">
              <Settings size={13} /> Manage
            </Link>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="sd-stats">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="sd-stat"
                style={{ "--stat-color": s.color } as React.CSSProperties}
              >
                <div className="sd-stat-top">
                  <div className="sd-stat-icon">
                    <Icon size={15} color={s.color} />
                  </div>
                  <div className={`sd-stat-trend ${s.trend}`}>
                    {s.trend === "up"
                      ? <TrendingUp  size={10} />
                      : <TrendingDown size={10} />}
                    {s.trend === "up" ? "Up" : "Alert"}
                  </div>
                </div>
                <div className="sd-stat-label">{s.label}</div>
                <div className="sd-stat-value" style={{ color: s.id === "lowstock" ? "#f59e0b" : undefined }}>
                  {s.value}
                </div>
                <div className="sd-stat-sub">{s.sub}</div>
                <div className="sd-stat-bg-num">{i + 1}</div>
              </div>
            );
          })}
        </div>

        {/* ── BODY ── */}
        <div className="sd-body">

          {/* ── RECENT ORDERS ── */}
          <div className="sd-panel" style={{ animationDelay: ".25s" }}>
            <div className="sd-panel-header">
              <div className="sd-panel-title">
                <div className="sd-panel-title-dot" />
                Recent Orders
              </div>
              <Link to="/orders" className="sd-panel-link">
                All orders <ChevronRight size={12} />
              </Link>
            </div>

            {/* tabs */}
            <div className="sd-tabs">
              {(["all","processing","shipped","delivered"] as const).map(t => (
                <button
                  key={t}
                  className={`sd-tab ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === "all" ? `All (${RECENT_ORDERS.length})` : t}
                </button>
              ))}
            </div>

            <div className="sd-orders">
              {filteredOrders.length === 0 ? (
                <div className="sd-empty">No {activeTab} orders</div>
              ) : (
                filteredOrders.map(o => {
                  const meta = STATUS_META[o.status];
                  const StatusIcon = meta.icon;
                  return (
                    <div key={o.id} className="sd-order-row">
                      <div className="sd-order-id">{o.id}</div>
                      <div className="sd-order-info">
                        <div className="sd-order-name">{o.product}</div>
                        <div className="sd-order-meta">
                          <span>{o.buyer}</span>
                          <span className="sd-order-meta-sep">·</span>
                          <span>{o.size}</span>
                        </div>
                      </div>
                      <div className="sd-order-price">{o.price}</div>
                      <div
                        className="sd-status-pill"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        <StatusIcon size={10} />
                        {meta.label}
                      </div>
                      <div className="sd-order-time">{o.time}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="sd-sidebar">

            {/* Revenue chart */}
            <div className="sd-panel" style={{ animationDelay:".3s" }}>
              <div className="sd-panel-header">
                <div className="sd-panel-title">
                  <div className="sd-panel-title-dot" />
                  Revenue
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <BarChart2 size={13} color="var(--accent)" />
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:"#22c55e", fontWeight:700, letterSpacing:1 }}>
                    ↑ 12.4%
                  </span>
                </div>
              </div>
              <div className="sd-chart">
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:"var(--white)", letterSpacing:1 }}>R84,320</span>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:"var(--dim)", letterSpacing:1 }}>THIS MONTH</span>
                </div>
                <div className="sd-chart-bars">
                  {REVENUE_BARS.map(b => (
                    <div key={b.month} className="sd-chart-bar-wrap">
                      <div className="sd-chart-bar" style={{ height: `${b.val}%` }}>
                        <span className="sd-chart-peak">R{Math.round(b.val * 920).toLocaleString()}</span>
                      </div>
                      <div className="sd-chart-label">{b.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="sd-panel" style={{ animationDelay:".35s" }}>
              <div className="sd-panel-header">
                <div className="sd-panel-title">
                  <div className="sd-panel-title-dot" style={{ background:"#f59e0b" }} />
                  Low Stock
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <AlertTriangle size={12} color="#f59e0b" />
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:"#f59e0b", fontWeight:700, letterSpacing:1 }}>
                    {LOW_STOCK.length} items
                  </span>
                </div>
              </div>
              <div className="sd-low-stock">
                {LOW_STOCK.map(item => (
                  <div key={item.name} className="sd-stock-row">
                    <div className="sd-stock-img">
                      <img src={item.img} alt={item.name} loading="lazy" />
                    </div>
                    <div className="sd-stock-name">{item.name}</div>
                    <div className={`sd-stock-badge ${item.stock === 1 ? "critical" : ""}`}>
                      {item.stock} left
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Score */}
            <div className="sd-panel" style={{ animationDelay:".4s" }}>
              <div className="sd-panel-header">
                <div className="sd-panel-title">
                  <div className="sd-panel-title-dot" style={{ background:"#22c55e" }} />
                  Seller Score
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:15, color:"#f59e0b", letterSpacing:2 }}>4.8</span>
                </div>
              </div>
              <div className="sd-score-wrap">
                {[
                  { label:"Dispatch Rate",    val:96,  color:"#22c55e" },
                  { label:"Response Time",    val:88,  color:"#3b82f6" },
                  { label:"Return Rate",      val:3,   color:"#22c55e", invert:true },
                  { label:"Positive Reviews", val:94,  color:"#22c55e" },
                ].map(m => (
                  <div key={m.label}>
                    <div className="sd-score-row">
                      <div className="sd-score-label">{m.label}</div>
                      <div className={`sd-score-val ${m.val >= 85 ? "green" : ""}`}>
                        {m.invert ? `${m.val}%` : `${m.val}%`}
                      </div>
                    </div>
                    <div className="sd-score-bar-track">
                      <div
                        className="sd-score-bar-fill"
                        style={{ width:`${m.invert ? 100 - m.val : m.val}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}

                {/* Seller tier badge */}
                <div style={{
                  marginTop:4,
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 12px",
                  background:"rgba(255,45,0,.07)", border:"1px solid rgba(255,45,0,.2)"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Zap size={13} color="var(--accent)" />
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"var(--white)" }}>
                      Gold Seller
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:"var(--accent)", fontWeight:700, letterSpacing:1 }}>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            </div>

          </div>{/* end sidebar */}
        </div>{/* end body */}
      </div>
    </>
  );
}