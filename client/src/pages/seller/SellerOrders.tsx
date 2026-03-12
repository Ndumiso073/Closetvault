import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, ChevronDown, ChevronUp,
  X, Check, Clock, Package, Truck, CheckCircle, XCircle,
  CreditCard, ArrowLeft, ArrowRight,
  Download, RefreshCw, Eye
} from "lucide-react";

/* ─── TYPES ─────────────────────────────────────── */
type OrderStatus   = "pending" | "paid" | "packed" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "paid" | "refunded";

interface OrderItem { name: string; size: string; qty: number; price: number; img: string; }
interface Order {
  id: string; customer: string; email: string; date: string;
  items: OrderItem[]; total: number;
  status: OrderStatus; payment: PaymentStatus;
}

/* ─── STATUS CONFIG ─────────────────────────────── */
const ORDER_STATUSES: { value: OrderStatus; label: string; color: string; bg: string; icon: React.FC<any> }[] = [
  { value:"pending",   label:"Pending",   color:"#f59e0b", bg:"rgba(245,158,11,.13)", icon:Clock        },
  { value:"paid",      label:"Paid",      color:"#3b82f6", bg:"rgba(59,130,246,.13)", icon:CreditCard   },
  { value:"packed",    label:"Packed",    color:"#8b5cf6", bg:"rgba(139,92,246,.13)", icon:Package      },
  { value:"shipped",   label:"Shipped",   color:"#06b6d4", bg:"rgba(6,182,212,.13)",  icon:Truck        },
  { value:"delivered", label:"Delivered", color:"#22c55e", bg:"rgba(34,197,94,.13)",  icon:CheckCircle  },
  { value:"cancelled", label:"Cancelled", color:"#ff2d00", bg:"rgba(255,45,0,.13)",   icon:XCircle      },
];

const PAYMENT_META: Record<PaymentStatus, { label:string; color:string; bg:string }> = {
  unpaid:   { label:"Unpaid",   color:"#f59e0b", bg:"rgba(245,158,11,.1)"  },
  paid:     { label:"Paid",     color:"#22c55e", bg:"rgba(34,197,94,.1)"   },
  refunded: { label:"Refunded", color:"#8b5cf6", bg:"rgba(139,92,246,.1)"  },
};

/* ─── VALID NEXT STATUSES ────────────────────────── */
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending:   ["paid","cancelled"],
  paid:      ["packed","cancelled"],
  packed:    ["shipped","cancelled"],
  shipped:   ["delivered"],
  delivered: [],
  cancelled: [],
};

/* ─── MOCK DATA ──────────────────────────────────── */
const MOCK_ORDERS: Order[] = [
  {
    id:"CV-48301", customer:"Jordan Khumalo", email:"jordan@email.com",
    date:"2025-01-11", total:7200, status:"pending", payment:"unpaid",
    items:[
      { name:"Nike Air Max 95",    size:"US 10", qty:1, price:2400, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70" },
      { name:"Jordan 4 Retro",     size:"US 10", qty:1, price:4800, img:"https://images.unsplash.com/photo-1556906781-9a412961a28c?w=80&q=70" },
    ],
  },
  {
    id:"CV-48300", customer:"Sipho Mthembu", email:"sipho@email.com",
    date:"2025-01-11", total:4800, status:"paid", payment:"paid",
    items:[
      { name:"Adidas Yeezy 350",   size:"US 9",  qty:1, price:4800, img:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&q=70" },
    ],
  },
  {
    id:"CV-48299", customer:"Lerato Nkosi", email:"lerato@email.com",
    date:"2025-01-10", total:3900, status:"packed", payment:"paid",
    items:[
      { name:"New Balance 550",    size:"US 8",  qty:2, price:1950, img:"https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&q=70" },
    ],
  },
  {
    id:"CV-48298", customer:"Thabo Dlamini", email:"thabo@email.com",
    date:"2025-01-10", total:5200, status:"shipped", payment:"paid",
    items:[
      { name:"Jordan 1 Retro High",size:"US 11", qty:1, price:5200, img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&q=70" },
    ],
  },
  {
    id:"CV-48297", customer:"Ayanda Petersen", email:"ayanda@email.com",
    date:"2025-01-09", total:2200, status:"delivered", payment:"paid",
    items:[
      { name:"Puma Suede Classic",  size:"US 9",  qty:2, price:1100, img:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&q=70" },
    ],
  },
  {
    id:"CV-48296", customer:"Naledi Sithole", email:"naledi@email.com",
    date:"2025-01-09", total:1350, status:"cancelled", payment:"refunded",
    items:[
      { name:"Converse Chuck 70",  size:"US 7",  qty:1, price:1350, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70" },
    ],
  },
  {
    id:"CV-48295", customer:"Bongani Zulu", email:"bongani@email.com",
    date:"2025-01-08", total:6600, status:"delivered", payment:"paid",
    items:[
      { name:"Nike Dunk Low Panda",size:"US 10", qty:1, price:2800, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70" },
      { name:"Adidas Forum Low",   size:"US 10", qty:2, price:1900, img:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&q=70" },
    ],
  },
  {
    id:"CV-48294", customer:"Zanele Mokoena", email:"zanele@email.com",
    date:"2025-01-08", total:3200, status:"shipped", payment:"paid",
    items:[
      { name:"New Balance 2002R",  size:"US 8",  qty:1, price:3200, img:"https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&q=70" },
    ],
  },
  {
    id:"CV-48293", customer:"Mpho Tau", email:"mpho@email.com",
    date:"2025-01-07", total:9400, status:"paid", payment:"paid",
    items:[
      { name:"Jordan 1 Chicago",   size:"US 9",  qty:1, price:9400, img:"https://images.unsplash.com/photo-1556906781-9a412961a28c?w=80&q=70" },
    ],
  },
  {
    id:"CV-48292", customer:"Dineo Molefe", email:"dineo@email.com",
    date:"2025-01-07", total:2600, status:"pending", payment:"unpaid",
    items:[
      { name:"Vans Old Skool",     size:"US 6",  qty:1, price:1300, img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&q=70" },
      { name:"Vans Old Skool",     size:"US 7",  qty:1, price:1300, img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&q=70" },
    ],
  },
];

const PER_PAGE = 8;

/* ─── COMPONENT ──────────────────────────────────── */
export default function SellerOrders() {
  const [orders, setOrders]           = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus|"all">("all");
  const [filterPayment, setFilterPayment] = useState<PaymentStatus|"all">("all");
  const [sortBy, setSortBy]           = useState<"date"|"total"|"status">("date");
  const [sortDir, setSortDir]         = useState<"desc"|"asc">("desc");
  const [page, setPage]               = useState(1);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [updating, setUpdating]       = useState<string | null>(null);
  const [statusMenu, setStatusMenu]   = useState<string | null>(null);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [sortOpen, setSortOpen]       = useState(false);
  const [toast, setToast]             = useState<{msg:string; id:string} | null>(null);

  /* filter + sort */
  const filtered = orders
    .filter(o => {
      const q = search.toLowerCase();
      const matchQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q));
      const matchS = filterStatus  === "all" || o.status  === filterStatus;
      const matchP = filterPayment === "all" || o.payment === filterPayment;
      return matchQ && matchS && matchP;
    })
    .sort((a, b) => {
      let v = 0;
      if (sortBy === "date")   v = a.date.localeCompare(b.date);
      if (sortBy === "total")  v = a.total - b.total;
      if (sortBy === "status") v = a.status.localeCompare(b.status);
      return sortDir === "asc" ? v : -v;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageOrders = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const statusCounts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s.value] = orders.filter(o => o.status === s.value).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  /* update order status */
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    setStatusMenu(null);
    setTimeout(() => {
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: newStatus, payment: newStatus === "paid" ? "paid" : newStatus === "cancelled" ? "refunded" : o.payment }
          : o
      ));
      setUpdating(null);
      setToast({ msg: `Order ${orderId} → ${newStatus.toUpperCase()}`, id: orderId });
      setTimeout(() => setToast(null), 3000);
    }, 600);
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
    setSortOpen(false); setPage(1);
  };

  const totalRevenue = orders.filter(o => o.payment === "paid").reduce((s,o) => s + o.total, 0);

  return (
    <>
      <style>{`
        :root { --border: rgba(255,255,255,.07); --pad-m:16px; --pad-t:32px; --pad-d:48px; }

        .so-page {
          min-height:100vh; background:var(--black);
          padding:0 var(--pad-m) 64px;
          animation:so-in .45s ease both;
        }
        @media(min-width:768px)  { .so-page { padding:0 var(--pad-t) 64px; } }
        @media(min-width:1024px) { .so-page { padding:0 var(--pad-d) 64px; } }
        @keyframes so-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ── HEADER ── */
        .so-header {
          padding:32px 0 24px; border-bottom:1px solid var(--border);
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:16px; flex-wrap:wrap;
        }
        .so-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:6px;
          display:flex; align-items:center; gap:8px;
        }
        .so-eyebrow::before { content:''; width:16px; height:1px; background:var(--accent); }
        .so-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(26px,5vw,42px); letter-spacing:2px; line-height:.95; color:var(--white);
        }
        .so-title span { color:var(--accent); }
        .so-subtitle { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:var(--dim); margin-top:5px; }

        .so-header-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .so-hbtn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border:none; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 14px; height:38px; transition:all .2s; white-space:nowrap;
        }
        .so-hbtn-ghost { background:transparent; color:var(--dim); border:1px solid var(--border); }
        .so-hbtn-ghost:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .so-hbtn-primary {
          background:var(--accent); color:var(--white);
          clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
          position:relative; overflow:hidden;
        }
        .so-hbtn-primary::after {
          content:''; position:absolute; inset:0; background:rgba(255,255,255,.16);
          transform:translateX(-110%) skewX(-15deg); transition:transform .35s;
        }
        .so-hbtn-primary:hover::after { transform:translateX(110%) skewX(-15deg); }
        .so-hbtn-primary:hover { background:#ff5533; }

        /* ── SUMMARY STRIP ── */
        .so-summary {
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:3px; margin-top:24px;
        }
        @media(min-width:640px) { .so-summary { grid-template-columns:repeat(6,1fr); } }
        .so-sum-card {
          background:var(--gray); padding:14px 14px 12px;
          cursor:pointer; transition:all .2s; border-top:2px solid transparent;
          animation:so-in .4s ease both;
        }
        .so-sum-card:hover { border-top-color:var(--card-color); transform:translateY(-2px); }
        .so-sum-card.active { border-top-color:var(--card-color) !important; background:var(--mid); }
        .so-sum-count {
          font-family:'Bebas Neue',sans-serif;
          font-size:28px; letter-spacing:1px; line-height:1; color:var(--card-color);
        }
        .so-sum-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); margin-top:2px;
        }

        /* ── TOOLBAR ── */
        .so-toolbar {
          background:var(--gray); border-bottom:1px solid var(--border);
          padding:10px var(--pad-m); margin-top:3px;
          display:flex; flex-direction:column; gap:0;
        }
        @media(min-width:768px) {
          .so-toolbar { flex-direction:row; align-items:center; gap:10px; padding:10px var(--pad-t); }
        }
        @media(min-width:1024px) { .so-toolbar { padding:10px var(--pad-d); } }

        .so-tb-row1 { display:flex; align-items:center; gap:8px; padding-bottom:8px; flex:1; }
        @media(min-width:768px) { .so-tb-row1 { padding-bottom:0; } }

        .so-tb-row2 {
          display:flex; align-items:center; gap:6px;
          border-top:1px solid var(--border); padding:8px 0;
          overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none;
        }
        .so-tb-row2::-webkit-scrollbar { display:none; }
        @media(min-width:768px) { .so-tb-row2 { border-top:none; padding:0; flex-shrink:0; } }

        .so-search {
          flex:1; display:flex; align-items:center; gap:8px;
          background:var(--mid); border:1px solid var(--border); padding:9px 12px;
          transition:border-color .2s;
        }
        .so-search:focus-within { border-color:var(--accent); }
        .so-search input {
          background:transparent; border:none; outline:none;
          color:var(--white); font-family:'Barlow',sans-serif; font-size:14px; flex:1; min-width:0;
        }
        .so-search input::placeholder { color:var(--dim); font-size:13px; }
        .so-search-clear { background:none; border:none; cursor:pointer; color:var(--dim); display:flex; }

        .so-count-badge {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); white-space:nowrap; flex-shrink:0; display:none;
        }
        .so-count-badge strong { color:var(--accent); }
        @media(min-width:768px) { .so-count-badge { display:block; } }

        /* sort & filter dropdowns */
        .so-dropdown-wrap { position:relative; flex-shrink:0; }
        .so-dd-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          background:var(--mid); color:var(--white); border:1px solid var(--border);
          padding:0 12px; cursor:pointer; height:40px; white-space:nowrap;
          display:flex; align-items:center; gap:6px; transition:border-color .2s;
        }
        .so-dd-btn:hover { border-color:rgba(255,255,255,.2); }
        .so-dd-btn.active { border-color:var(--accent); color:var(--accent); }
        .so-dd-label { display:none; }
        @media(min-width:420px) { .so-dd-label { display:inline; } }
        .so-dropdown {
          position:absolute; left:0; top:calc(100% + 4px);
          background:var(--mid); border:1px solid var(--border);
          min-width:180px; z-index:200; box-shadow:0 8px 32px rgba(0,0,0,.7);
          animation:so-dd .15s ease;
        }
        @keyframes so-dd { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .so-dd-opt {
          padding:11px 16px; cursor:pointer;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); transition:all .15s; border-left:2px solid transparent;
          display:flex; align-items:center; gap:8px;
        }
        .so-dd-opt:hover { color:var(--white); background:rgba(255,255,255,.04); border-left-color:var(--accent); }
        .so-dd-opt.active { color:var(--accent); border-left-color:var(--accent); }
        .so-dd-dot { width:8px; height:8px; border-radius:0; flex-shrink:0;
          clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%); }

        /* count strip (mobile) */
        .so-count-strip {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); padding:6px var(--pad-m);
          background:var(--gray); border-bottom:1px solid var(--border);
        }
        .so-count-strip strong { color:var(--accent); }
        @media(min-width:768px) { .so-count-strip { display:none; } }

        /* ── TABLE ── */
        .so-table-wrap { overflow-x:auto; scrollbar-width:thin; scrollbar-color:var(--mid) transparent; }
        .so-table-wrap::-webkit-scrollbar { height:3px; }
        .so-table-wrap::-webkit-scrollbar-thumb { background:var(--mid); }

        .so-table {
          width:100%; border-collapse:collapse; min-width:720px;
        }
        .so-th {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          color:var(--dim); padding:12px 16px;
          background:var(--gray); border-bottom:1px solid var(--border);
          text-align:left; white-space:nowrap; cursor:pointer; user-select:none;
          transition:color .2s;
        }
        .so-th:hover { color:var(--white); }
        .so-th.sorted { color:var(--accent); }
        .so-th-inner { display:flex; align-items:center; gap:5px; }
        .so-th-sort-icon { opacity:.4; }
        .so-th.sorted .so-th-sort-icon { opacity:1; color:var(--accent); }

        .so-tr {
          border-bottom:1px solid var(--border);
          transition:background .15s;
          animation:so-in .35s ease both;
        }
        .so-tr:hover { background:rgba(255,255,255,.025); }
        .so-tr.expanded { background:rgba(255,255,255,.02); }

        .so-td {
          padding:14px 16px; vertical-align:middle;
          font-family:'Barlow Condensed',sans-serif;
        }

        .so-order-id {
          font-size:12px; font-weight:700; letter-spacing:1px;
          color:var(--dim); white-space:nowrap;
        }
        .so-customer-name {
          font-size:14px; font-weight:700; letter-spacing:.5px; color:var(--white);
        }
        .so-customer-email { font-size:11px; color:var(--dim); margin-top:1px; }

        .so-product-thumb {
          display:flex; align-items:center; gap:8px;
        }
        .so-thumb-img {
          width:36px; height:36px; flex-shrink:0; overflow:hidden;
          clip-path:polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%);
          background:var(--mid);
        }
        .so-thumb-img img { width:100%; height:100%; object-fit:cover; filter:saturate(.7); }
        .so-thumb-more {
          font-size:10px; font-weight:700; letter-spacing:1px; color:var(--dim);
          background:var(--mid); padding:2px 6px; white-space:nowrap;
        }

        .so-qty {
          font-family:'Bebas Neue',sans-serif;
          font-size:18px; letter-spacing:1px; color:var(--white);
        }
        .so-total {
          font-family:'Bebas Neue',sans-serif;
          font-size:18px; letter-spacing:1px; color:var(--white); white-space:nowrap;
        }
        .so-date {
          font-size:12px; color:var(--dim); white-space:nowrap;
        }

        /* status pill */
        .so-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          padding:4px 9px; white-space:nowrap;
        }

        /* payment badge */
        .so-pay-badge {
          display:inline-flex; align-items:center; gap:5px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          padding:3px 8px;
        }

        /* ── UPDATE STATUS BUTTON ── */
        .so-update-wrap { position:relative; }
        .so-update-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          background:var(--mid); color:var(--white); border:1px solid var(--border);
          padding:7px 10px; cursor:pointer; display:flex; align-items:center; gap:5px;
          transition:all .2s; white-space:nowrap; min-height:34px;
        }
        .so-update-btn:hover { border-color:var(--accent); color:var(--accent); }
        .so-update-btn:disabled { opacity:.35; pointer-events:none; }
        .so-update-btn.loading { pointer-events:none; }

        .so-status-menu {
          position:absolute; right:0; top:calc(100% + 4px);
          background:var(--mid); border:1px solid var(--border);
          min-width:160px; z-index:300; box-shadow:0 8px 32px rgba(0,0,0,.8);
          animation:so-dd .15s ease;
        }
        .so-status-menu-item {
          padding:10px 14px; cursor:pointer;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          display:flex; align-items:center; gap:8px;
          transition:background .15s; border-left:2px solid transparent;
        }
        .so-status-menu-item:hover { background:rgba(255,255,255,.04); border-left-color:var(--item-color); }

        /* loading spinner */
        .so-spinner {
          width:12px; height:12px; border:2px solid rgba(255,255,255,.2);
          border-top-color:var(--accent); border-radius:50%;
          animation:so-spin .6s linear infinite; flex-shrink:0;
        }
        @keyframes so-spin { to{transform:rotate(360deg)} }

        /* ── EXPANDED ROW ── */
        .so-expand-row { background:rgba(255,255,255,.015); }
        .so-expand-inner { padding:16px 20px 20px; }
        .so-expand-title {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          color:var(--dim); margin-bottom:10px; display:flex; align-items:center; gap:8px;
        }
        .so-expand-title::after { content:''; flex:1; height:1px; background:var(--border); }
        .so-expand-items { display:flex; flex-direction:column; gap:8px; }
        .so-expand-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 12px; background:var(--gray);
        }
        .so-expand-img {
          width:44px; height:44px; flex-shrink:0; overflow:hidden;
          clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
        }
        .so-expand-img img { width:100%; height:100%; object-fit:cover; }
        .so-expand-name {
          font-family:'Barlow Condensed',sans-serif;
          font-size:14px; font-weight:700; letter-spacing:.5px; color:var(--white); flex:1;
        }
        .so-expand-size { font-size:11px; color:var(--dim); }
        .so-expand-qty {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:1px; color:var(--dim);
          margin-left:auto; white-space:nowrap;
        }
        .so-expand-price {
          font-family:'Bebas Neue',sans-serif;
          font-size:18px; letter-spacing:1px; color:var(--white); flex-shrink:0;
        }

        /* ── PAGINATION ── */
        .so-pagination { display:flex; align-items:center; justify-content:center; gap:4px; padding-top:20px; }
        .so-pg-btn {
          font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:2px;
          background:var(--gray); color:var(--dim); border:1px solid var(--border);
          width:38px; height:38px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s;
        }
        .so-pg-btn:hover:not(:disabled) { border-color:rgba(255,255,255,.2); color:var(--white); }
        .so-pg-btn.on { background:var(--accent); border-color:var(--accent); color:var(--white); }
        .so-pg-btn:disabled { opacity:.3; pointer-events:none; }
        .so-pg-arrow {
          background:var(--mid); border:1px solid var(--border);
          width:38px; height:38px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--dim); transition:all .2s;
        }
        .so-pg-arrow:hover:not(:disabled) { color:var(--white); border-color:rgba(255,255,255,.2); }
        .so-pg-arrow:disabled { opacity:.3; pointer-events:none; }

        /* ── EMPTY ── */
        .so-empty {
          padding:60px 20px; text-align:center;
          font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:var(--dim);
        }
        .so-empty-sub {
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px; letter-spacing:1px; color:rgba(255,255,255,.25); margin-top:8px;
        }

        /* ── TOAST ── */
        .so-toast {
          position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
          background:var(--gray); border:1px solid var(--border); border-left:3px solid var(--accent);
          padding:12px 20px; z-index:999;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--white); display:flex; align-items:center; gap:10px;
          box-shadow:0 8px 32px rgba(0,0,0,.7);
          animation:so-toast .25s ease;
          white-space:nowrap;
        }
        @keyframes so-toast { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .so-toast-dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:so-pulse 1s ease-in-out infinite; }
        @keyframes so-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        @media(max-width:600px) {
          .so-customer-email { display:none; }
          .so-date { display:none; }
        }
      `}</style>

      {/* toast */}
      {toast && (
        <div className="so-toast">
          <div className="so-toast-dot" />
          <Check size={13} color="var(--accent)" />
          {toast.msg}
        </div>
      )}

      <div className="so-page" onClick={() => { setStatusMenu(null); setSortOpen(false); setFilterOpen(false); }}>

        {/* ── HEADER ── */}
        <div className="so-header">
          <div>
            <div className="so-eyebrow">Seller Portal</div>
            <div className="so-title">ORDER <span>MANAGEMENT</span></div>
            <div className="so-subtitle">
              {orders.length} total orders · R{totalRevenue.toLocaleString()} collected
            </div>
          </div>
          <div className="so-header-actions">
            <button className="so-hbtn so-hbtn-ghost">
              <Download size={13} /> Export CSV
            </button>
            <button className="so-hbtn so-hbtn-ghost">
              <RefreshCw size={13} /> Refresh
            </button>
            <Link to="/sell/dashboard" className="so-hbtn so-hbtn-primary">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* ── STATUS SUMMARY STRIP ── */}
        <div className="so-summary">
          {[{ value:"all" as const, label:"All", color:"#f5f5f0" }, ...ORDER_STATUSES].map((s,i) => {
            const count = s.value === "all" ? orders.length : statusCounts[s.value as OrderStatus] ?? 0;
            const isActive = filterStatus === s.value;
            return (
              <div
                key={s.value}
                className={`so-sum-card ${isActive ? "active" : ""}`}
                style={{ "--card-color": s.color, animationDelay:`${i*.04}s` } as React.CSSProperties}
                onClick={() => { setFilterStatus(s.value as any); setPage(1); }}
              >
                <div className="so-sum-count">{count}</div>
                <div className="so-sum-label">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="so-toolbar" onClick={e => e.stopPropagation()}>
          <div className="so-tb-row1">
            <div className="so-search">
              <Search size={13} color="var(--dim)" />
              <input
                type="text" placeholder="Search order ID, customer, product..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              {search && (
                <button className="so-search-clear" onClick={() => { setSearch(""); setPage(1); }}>
                  <X size={13} />
                </button>
              )}
            </div>
            <span className="so-count-badge"><strong>{filtered.length}</strong> orders</span>
          </div>

          <div className="so-tb-row2">
            {/* Sort */}
            <div className="so-dropdown-wrap">
              <button className={`so-dd-btn ${sortOpen ? "active" : ""}`} onClick={() => { setSortOpen(o=>!o); setFilterOpen(false); }}>
                <ChevronDown size={13} />
                <span className="so-dd-label">Sort: {sortBy}</span>
              </button>
              {sortOpen && (
                <div className="so-dropdown">
                  {[["date","Date"],["total","Total"],["status","Status"]].map(([k,l]) => (
                    <div key={k} className={`so-dd-opt ${sortBy===k?"active":""}`}
                      onClick={() => toggleSort(k as typeof sortBy)}>
                      {l}
                      {sortBy===k && (sortDir==="asc" ? <ChevronUp size={11}/> : <ChevronDown size={11}/>)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment filter */}
            <div className="so-dropdown-wrap">
              <button className={`so-dd-btn ${filterOpen ? "active" : ""}`} onClick={() => { setFilterOpen(o=>!o); setSortOpen(false); }}>
                <Filter size={13} />
                <span className="so-dd-label">Payment</span>
                {filterPayment !== "all" && (
                  <span style={{ background:"var(--accent)", color:"#fff", fontSize:9, padding:"1px 5px", borderRadius:0 }}>
                    1
                  </span>
                )}
              </button>
              {filterOpen && (
                <div className="so-dropdown">
                  {([["all","All"],["unpaid","Unpaid"],["paid","Paid"],["refunded","Refunded"]] as const).map(([k,l]) => (
                    <div key={k} className={`so-dd-opt ${filterPayment===k?"active":""}`}
                      onClick={() => { setFilterPayment(k as any); setPage(1); setFilterOpen(false); }}>
                      {k !== "all" && (
                        <span className="so-dd-dot" style={{ background: PAYMENT_META[k as PaymentStatus]?.color }} />
                      )}
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {(filterStatus !== "all" || filterPayment !== "all" || search) && (
              <button className="so-dd-btn" style={{ color:"var(--accent)", borderColor:"rgba(255,45,0,.3)" }}
                onClick={() => { setFilterStatus("all"); setFilterPayment("all"); setSearch(""); setPage(1); }}>
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* mobile count */}
        <div className="so-count-strip">
          <strong>{filtered.length}</strong> orders
        </div>

        {/* ── TABLE ── */}
        <div style={{ background:"var(--gray)", marginTop:3 }}>
          <div className="so-table-wrap">
            <table className="so-table">
              <thead>
                <tr>
                  {[
                    { key:"",        label:"Order ID",  sortable:false },
                    { key:"",        label:"Customer",  sortable:false },
                    { key:"",        label:"Products",  sortable:false },
                    { key:"",        label:"Qty",       sortable:false },
                    { key:"total",   label:"Total",     sortable:true  },
                    { key:"status",  label:"Status",    sortable:true  },
                    { key:"",        label:"Payment",   sortable:false },
                    { key:"date",    label:"Date",      sortable:true  },
                    { key:"",        label:"Update",    sortable:false },
                  ].map((col,i) => (
                    <th key={i}
                      className={`so-th ${col.sortable && sortBy===col.key ? "sorted":""}`}
                      onClick={() => col.sortable && col.key && toggleSort(col.key as typeof sortBy)}
                      style={{ cursor: col.sortable ? "pointer":"default" }}
                    >
                      <div className="so-th-inner">
                        {col.label}
                        {col.sortable && (
                          <span className="so-th-sort-icon">
                            {sortBy===col.key
                              ? (sortDir==="asc" ? <ChevronUp size={11}/> : <ChevronDown size={11}/>)
                              : <ChevronDown size={11}/>}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="so-empty">
                        No Orders Found
                        <div className="so-empty-sub">Try adjusting your search or filters</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageOrders.map((order, idx) => {
                    const statusMeta = ORDER_STATUSES.find(s => s.value === order.status)!;
                    const payMeta    = PAYMENT_META[order.payment];
                    const StatusIcon = statusMeta.icon;
                    const nextOpts   = NEXT_STATUSES[order.status];
                    const isExpanded = expanded === order.id;
                    const isUpdating = updating === order.id;
                    const totalQty   = order.items.reduce((s,i) => s + i.qty, 0);

                    return (
                      <>
                        <tr
                          key={order.id}
                          className={`so-tr ${isExpanded?"expanded":""}`}
                          style={{ animationDelay:`${idx*.04}s` }}
                        >
                          {/* Order ID */}
                          <td className="so-td">
                            <div className="so-order-id">{order.id}</div>
                          </td>

                          {/* Customer */}
                          <td className="so-td">
                            <div className="so-customer-name">{order.customer}</div>
                            <div className="so-customer-email">{order.email}</div>
                          </td>

                          {/* Products */}
                          <td className="so-td">
                            <div className="so-product-thumb">
                              {order.items.slice(0,2).map((item,j) => (
                                <div key={j} className="so-thumb-img">
                                  <img src={item.img} alt={item.name} loading="lazy" />
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="so-thumb-more">+{order.items.length - 2}</div>
                              )}
                              <button
                                style={{ background:"none", border:"none", cursor:"pointer", color:"var(--dim)", display:"flex", padding:2 }}
                                onClick={() => setExpanded(isExpanded ? null : order.id)}
                                title="View items"
                              >
                                <Eye size={13} />
                              </button>
                            </div>
                          </td>

                          {/* Qty */}
                          <td className="so-td">
                            <div className="so-qty">{totalQty}</div>
                          </td>

                          {/* Total */}
                          <td className="so-td">
                            <div className="so-total">R{order.total.toLocaleString()}</div>
                          </td>

                          {/* Status */}
                          <td className="so-td">
                            <div className="so-status-pill" style={{ color:statusMeta.color, background:statusMeta.bg }}>
                              <StatusIcon size={10} />
                              {statusMeta.label}
                            </div>
                          </td>

                          {/* Payment */}
                          <td className="so-td">
                            <div className="so-pay-badge" style={{ color:payMeta.color, background:payMeta.bg }}>
                              {payMeta.label}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="so-td">
                            <div className="so-date">{order.date}</div>
                          </td>

                          {/* Update */}
                          <td className="so-td" onClick={e => e.stopPropagation()}>
                            <div className="so-update-wrap">
                              <button
                                className={`so-update-btn ${isUpdating?"loading":""}`}
                                disabled={nextOpts.length === 0 || isUpdating}
                                onClick={() => setStatusMenu(statusMenu === order.id ? null : order.id)}
                                title={nextOpts.length === 0 ? "No further updates" : "Update status"}
                              >
                                {isUpdating
                                  ? <><div className="so-spinner" /> Updating</>
                                  : nextOpts.length === 0
                                    ? <><Check size={11} color="#22c55e" /> Final</>
                                    : <><RefreshCw size={11} /> Update <ChevronDown size={10} /></>
                                }
                              </button>

                              {statusMenu === order.id && nextOpts.length > 0 && (
                                <div className="so-status-menu">
                                  {nextOpts.map(ns => {
                                    const nsMeta = ORDER_STATUSES.find(s => s.value === ns)!;
                                    const NsIcon = nsMeta.icon;
                                    return (
                                      <div
                                        key={ns}
                                        className="so-status-menu-item"
                                        style={{ "--item-color": nsMeta.color } as React.CSSProperties}
                                        onClick={() => handleStatusUpdate(order.id, ns)}
                                      >
                                        <NsIcon size={12} color={nsMeta.color} />
                                        <span style={{ color:nsMeta.color }}>{nsMeta.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded items row */}
                        {isExpanded && (
                          <tr key={`${order.id}-expand`} className="so-expand-row">
                            <td colSpan={9} className="so-expand-inner">
                              <div className="so-expand-title">Order Items ({order.items.length})</div>
                              <div className="so-expand-items">
                                {order.items.map((item, j) => (
                                  <div key={j} className="so-expand-item">
                                    <div className="so-expand-img">
                                      <img src={item.img} alt={item.name} loading="lazy" />
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                      <div className="so-expand-name">{item.name}</div>
                                      <div className="so-expand-size">{item.size}</div>
                                    </div>
                                    <div className="so-expand-qty">× {item.qty}</div>
                                    <div className="so-expand-price">R{(item.price * item.qty).toLocaleString()}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="so-pagination">
              <button className="so-pg-arrow" disabled={page===1} onClick={() => setPage(p => p-1)}>
                <ArrowLeft size={14} />
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n => (
                <button key={n} className={`so-pg-btn ${page===n?"on":""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="so-pg-arrow" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}