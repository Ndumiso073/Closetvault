import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search, Plus, Edit2, Trash2, Filter, Grid, List,
  ChevronDown, ChevronUp, X, Eye, EyeOff, Copy,
  AlertTriangle, Check,
  MoreHorizontal
} from "lucide-react";

/* ─── TYPES ───────────────────────────────────── */
type ProductStatus = "active" | "inactive" | "draft";
type ViewMode = "grid" | "list";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: ProductStatus;
  img: string;
  isNew?: boolean;
  isHot?: boolean;
  sales: number;
  rating: number;
  sku: string;
}

/* ─── STATUS CONFIG ───────────────────────────── */
const STATUS_META: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  active:   { label: "Active",   color: "#22c55e", bg: "rgba(34,197,94,.12)"  },
  inactive: { label: "Inactive", color: "#888",    bg: "rgba(136,136,136,.12)"},
  draft:    { label: "Draft",    color: "#f59e0b", bg: "rgba(245,158,11,.12)" },
};

const CATEGORIES = ["All","Sneakers","Clothing","Accessories","Caps","Bags","Watches"];

/* ─── MOCK DATA ───────────────────────────────── */
const MOCK_PRODUCTS: Product[] = [
  { id:"p1",  name:"Nike Air Max 95 OG",      brand:"Nike",    category:"Sneakers",     price:2400, originalPrice:2800, stock:5,  status:"active",   img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",   isHot:true,  sales:34, rating:4.8, sku:"NK-AM95-001" },
  { id:"p2",  name:"Adidas Yeezy 350 V2",     brand:"Adidas",  category:"Sneakers",     price:4800, originalPrice:5200, stock:2,  status:"active",   img:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",  isNew:true,  sales:18, rating:4.9, sku:"AD-YZ350-002"},
  { id:"p3",  name:"Jordan 1 Retro High OG",  brand:"Jordan",  category:"Sneakers",     price:5200,                     stock:1,  status:"active",   img:"https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80",   isHot:true,  sales:52, rating:5.0, sku:"JD-1RH-003"  },
  { id:"p4",  name:"New Balance 550 White",   brand:"NB",      category:"Sneakers",     price:1950,                     stock:8,  status:"active",   img:"https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",              sales:12, rating:4.6, sku:"NB-550-004"  },
  { id:"p5",  name:"Supreme Box Logo Tee",    brand:"Supreme", category:"Clothing",     price:1800, originalPrice:2200, stock:0,  status:"inactive", img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",              sales:8,  rating:4.3, sku:"SP-BLT-005"  },
  { id:"p6",  name:"Palace Tri-Ferg Hoodie",  brand:"Palace",  category:"Clothing",     price:2600,                     stock:3,  status:"active",   img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",              sales:21, rating:4.7, sku:"PL-TFH-006"  },
  { id:"p7",  name:"Off-White Beanie",        brand:"Off-White",category:"Caps",        price:1200,                     stock:6,  status:"draft",    img:"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=80",              sales:0,  rating:0.0, sku:"OW-BNE-007"  },
  { id:"p8",  name:"Rolex Submariner Ref.",   brand:"Rolex",   category:"Watches",      price:85000,                    stock:1,  status:"active",   img:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",  isHot:true,  sales:3,  rating:5.0, sku:"RX-SUB-008"  },
  { id:"p9",  name:"Carhartt WIP Tote Bag",   brand:"Carhartt",category:"Bags",         price:780,                      stock:12, status:"active",   img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",              sales:29, rating:4.4, sku:"CH-TTB-009"  },
  { id:"p10", name:"Stüssy 8 Ball Cap",       brand:"Stüssy",  category:"Caps",         price:950,  originalPrice:1100, stock:4,  status:"active",   img:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80",  isNew:true,  sales:15, rating:4.5, sku:"ST-8BC-010"  },
  { id:"p11", name:"A Bathing Ape Chain",     brand:"BAPE",    category:"Accessories",  price:3400,                     stock:0,  status:"inactive", img:"https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80",              sales:6,  rating:4.2, sku:"BP-CHN-011"  },
  { id:"p12", name:"Corteiz Cargos",          brand:"Corteiz", category:"Clothing",     price:1650,                     stock:7,  status:"draft",    img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",              sales:0,  rating:0.0, sku:"CR-CGO-012"  },
];

const PER_PAGE_LIST = 10;
const PER_PAGE_GRID = 8;

/* ─── COMPONENT ──────────────────────────────── */
export default function SellerProducts() {
  const [products, setProducts]       = useState<Product[]>(MOCK_PRODUCTS);
  const [view, setView]               = useState<ViewMode>("list");
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState("All");
  const [statusFilter, setStatusFilter] = useState<ProductStatus|"all">("all");
  const [sortBy, setSortBy]           = useState<"name"|"price"|"stock"|"sales">("sales");
  const [sortDir, setSortDir]         = useState<"asc"|"desc">("desc");
  const [page, setPage]               = useState(1);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string|null>(null);
  const [_bulkMenu, setBulkMenu]       = useState(false);
  const [sortOpen, setSortOpen]       = useState(false);
  const [statusOpen, setStatusOpen]   = useState(false);
  const [toast, setToast]             = useState<string|null>(null);
  const [menuOpen, setMenuOpen]       = useState<string|null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  /* ── FILTER + SORT ── */
  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchC = catFilter === "All" || p.category === catFilter;
      const matchS = statusFilter === "all" || p.status === statusFilter;
      return matchQ && matchC && matchS;
    })
    .sort((a, b) => {
      let v = 0;
      if (sortBy === "name")  v = a.name.localeCompare(b.name);
      if (sortBy === "price") v = a.price - b.price;
      if (sortBy === "stock") v = a.stock - b.stock;
      if (sortBy === "sales") v = a.sales - b.sales;
      return sortDir === "asc" ? v : -v;
    });

  const perPage = view === "grid" ? PER_PAGE_GRID : PER_PAGE_LIST;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  /* ── STATS ── */
  const totalActive   = products.filter(p => p.status === "active").length;
  const totalInactive = products.filter(p => p.status === "inactive").length;
  const totalDraft    = products.filter(p => p.status === "draft").length;
  const lowStock      = products.filter(p => p.stock <= 2 && p.stock > 0).length;
  const outOfStock    = products.filter(p => p.stock === 0).length;

  /* ── ACTIONS ── */
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setDeleteTarget(null);
    showToast("Product deleted");
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: p.status === "active" ? "inactive" : "active" }
        : p
    ));
    setMenuOpen(null);
    showToast("Status updated");
  };

  const duplicateProduct = (id: string) => {
    const src = products.find(p => p.id === id)!;
    const clone: Product = { ...src, id:`p${Date.now()}`, name:`${src.name} (Copy)`, status:"draft", sales:0, sku:`${src.sku}-C` };
    setProducts(prev => [clone, ...prev]);
    setMenuOpen(null);
    showToast("Product duplicated as Draft");
  };

  const bulkDelete = () => {
    setProducts(prev => prev.filter(p => !selected.has(p.id)));
    setSelected(new Set());
    setBulkMenu(false);
    showToast(`${selected.size} products deleted`);
  };

  const bulkSetStatus = (status: ProductStatus) => {
    setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, status } : p));
    setSelected(new Set());
    setBulkMenu(false);
    showToast(`${selected.size} products → ${status}`);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(p => p.id)));
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
    setSortOpen(false); setPage(1);
  };

  return (
    <>
      <style>{`
        :root { --border:rgba(255,255,255,.07); --pad-m:16px; --pad-t:32px; --pad-d:48px; }

        .sp-page {
          min-height:100vh; background:var(--black);
          padding:0 var(--pad-m) 72px;
          animation:sp-in .45s ease both;
        }
        @media(min-width:768px)  { .sp-page { padding:0 var(--pad-t) 72px; } }
        @media(min-width:1024px) { .sp-page { padding:0 var(--pad-d) 72px; } }
        @keyframes sp-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ── HEADER ── */
        .sp-header {
          padding:32px 0 24px; border-bottom:1px solid var(--border);
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:16px; flex-wrap:wrap;
        }
        .sp-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:6px;
          display:flex; align-items:center; gap:8px;
        }
        .sp-eyebrow::before { content:''; width:16px; height:1px; background:var(--accent); }
        .sp-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(26px,5vw,42px); letter-spacing:2px; line-height:.95; color:var(--white);
        }
        .sp-title span { color:var(--accent); }
        .sp-subtitle { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:var(--dim); margin-top:5px; }
        .sp-header-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }

        /* ── BUTTONS ── */
        .sp-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border:none; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 14px; height:38px; transition:all .2s; white-space:nowrap;
        }
        .sp-btn-primary {
          background:var(--accent); color:var(--white);
          clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
          position:relative; overflow:hidden;
        }
        .sp-btn-primary::after {
          content:''; position:absolute; inset:0; background:rgba(255,255,255,.16);
          transform:translateX(-110%) skewX(-15deg); transition:transform .35s;
        }
        .sp-btn-primary:hover::after { transform:translateX(110%) skewX(-15deg); }
        .sp-btn-primary:hover { background:#ff5533; }
        .sp-btn-ghost {
          background:transparent; color:var(--dim); border:1px solid var(--border);
        }
        .sp-btn-ghost:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .sp-btn-mid {
          background:var(--mid); color:var(--white); border:1px solid var(--border);
        }
        .sp-btn-mid:hover { border-color:rgba(255,255,255,.2); }

        /* ── STATS STRIP ── */
        .sp-stats {
          display:grid; grid-template-columns:repeat(5,1fr); gap:3px; margin-top:24px;
        }
        @media(max-width:640px) { .sp-stats { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:380px) { .sp-stats { grid-template-columns:repeat(2,1fr); } }

        .sp-stat {
          background:var(--gray); padding:14px 14px 12px;
          border-top:2px solid transparent; transition:all .2s; cursor:pointer;
          animation:sp-in .4s ease both;
        }
        .sp-stat:hover { border-top-color:var(--sc); transform:translateY(-2px); }
        .sp-stat.active { border-top-color:var(--sc) !important; background:var(--mid); }
        .sp-stat-val {
          font-family:'Bebas Neue',sans-serif;
          font-size:28px; letter-spacing:1px; color:var(--sc); line-height:1;
        }
        .sp-stat-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); margin-top:2px;
        }

        /* ── CATEGORY TABS ── */
        .sp-cat-tabs {
          display:flex; gap:0; margin-top:3px; overflow-x:auto; scrollbar-width:none;
          background:var(--gray); border-bottom:1px solid var(--border);
        }
        .sp-cat-tabs::-webkit-scrollbar { display:none; }
        .sp-cat-tab {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); background:transparent; border:none; cursor:pointer;
          padding:12px 16px; border-bottom:2px solid transparent; margin-bottom:-1px;
          transition:all .2s; white-space:nowrap;
        }
        .sp-cat-tab:hover { color:var(--white); }
        .sp-cat-tab.active { color:var(--accent); border-bottom-color:var(--accent); }

        /* ── TOOLBAR ── */
        .sp-toolbar {
          background:var(--gray); border-bottom:1px solid var(--border);
          padding:10px var(--pad-m); display:flex; flex-direction:column; gap:0;
        }
        @media(min-width:768px) { .sp-toolbar { flex-direction:row; align-items:center; gap:8px; padding:10px var(--pad-t); } }
        @media(min-width:1024px) { .sp-toolbar { padding:10px var(--pad-d); } }

        .sp-tb-row1 { display:flex; align-items:center; gap:8px; padding-bottom:8px; flex:1; }
        @media(min-width:768px) { .sp-tb-row1 { padding-bottom:0; } }
        .sp-tb-row2 {
          display:flex; align-items:center; gap:6px;
          border-top:1px solid var(--border); padding:8px 0;
          overflow-x:auto; scrollbar-width:none;
        }
        .sp-tb-row2::-webkit-scrollbar { display:none; }
        @media(min-width:768px) { .sp-tb-row2 { border-top:none; padding:0; flex-shrink:0; } }

        /* search */
        .sp-search {
          flex:1; display:flex; align-items:center; gap:8px;
          background:var(--mid); border:1px solid var(--border); padding:9px 12px;
          transition:border-color .2s; min-width:0;
        }
        .sp-search:focus-within { border-color:var(--accent); }
        .sp-search input {
          background:transparent; border:none; outline:none;
          color:var(--white); font-family:'Barlow',sans-serif; font-size:14px; flex:1; min-width:0;
        }
        .sp-search input::placeholder { color:var(--dim); font-size:13px; }

        /* view toggle */
        .sp-view-toggle { display:flex; gap:2px; flex-shrink:0; }
        .sp-vt-btn {
          background:var(--mid); border:1px solid var(--border);
          width:38px; height:38px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--dim); transition:all .2s;
        }
        .sp-vt-btn.on { background:var(--accent); border-color:var(--accent); color:var(--white); }
        .sp-vt-btn:hover:not(.on) { color:var(--white); }

        /* dropdown */
        .sp-dd-wrap { position:relative; flex-shrink:0; }
        .sp-dd-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          background:var(--mid); color:var(--white); border:1px solid var(--border);
          padding:0 12px; cursor:pointer; height:38px; white-space:nowrap;
          display:flex; align-items:center; gap:6px; transition:border-color .2s;
        }
        .sp-dd-btn:hover { border-color:rgba(255,255,255,.2); }
        .sp-dd-btn.active { border-color:var(--accent); color:var(--accent); }
        .sp-dd-lbl { display:none; }
        @media(min-width:400px) { .sp-dd-lbl { display:inline; } }
        .sp-dropdown {
          position:absolute; left:0; top:calc(100% + 4px);
          background:var(--mid); border:1px solid var(--border);
          min-width:170px; z-index:200; box-shadow:0 8px 32px rgba(0,0,0,.75);
          animation:sp-dd .15s ease;
        }
        @keyframes sp-dd { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .sp-dd-opt {
          padding:10px 14px; cursor:pointer;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); transition:all .15s; border-left:2px solid transparent;
          display:flex; align-items:center; gap:8px;
        }
        .sp-dd-opt:hover { color:var(--white); background:rgba(255,255,255,.04); border-left-color:var(--accent); }
        .sp-dd-opt.on { color:var(--accent); border-left-color:var(--accent); }
        .sp-dd-dot { width:7px; height:7px; flex-shrink:0; clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%); }

        /* ── BULK BAR ── */
        .sp-bulk-bar {
          background:var(--mid); border:1px solid rgba(255,45,0,.25);
          padding:10px 16px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;
          animation:sp-in .2s ease;
        }
        .sp-bulk-count {
          font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:2px;
          color:var(--accent);
        }
        .sp-bulk-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim);
        }
        .sp-bulk-actions { display:flex; gap:6px; margin-left:auto; flex-wrap:wrap; }
        .sp-bulk-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          background:transparent; border:1px solid var(--border); color:var(--dim);
          padding:6px 10px; cursor:pointer; display:flex; align-items:center; gap:5px;
          transition:all .2s;
        }
        .sp-bulk-btn:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .sp-bulk-btn.danger { color:#ff2d00; border-color:rgba(255,45,0,.3); }
        .sp-bulk-btn.danger:hover { background:rgba(255,45,0,.1); border-color:#ff2d00; }

        /* ── LIST VIEW TABLE ── */
        .sp-table-wrap { overflow-x:auto; scrollbar-width:thin; scrollbar-color:var(--mid) transparent; }
        .sp-table-wrap::-webkit-scrollbar { height:3px; }
        .sp-table-wrap::-webkit-scrollbar-thumb { background:var(--mid); }
        .sp-table { width:100%; border-collapse:collapse; min-width:780px; }

        .sp-th {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
          color:var(--dim); padding:12px 14px;
          background:var(--gray); border-bottom:1px solid var(--border);
          text-align:left; white-space:nowrap; user-select:none;
        }
        .sp-th.sortable { cursor:pointer; transition:color .2s; }
        .sp-th.sortable:hover { color:var(--white); }
        .sp-th.sorted { color:var(--accent); }
        .sp-th-inner { display:flex; align-items:center; gap:5px; }

        .sp-tr {
          border-bottom:1px solid var(--border); transition:background .15s;
          animation:sp-in .3s ease both;
        }
        .sp-tr:hover { background:rgba(255,255,255,.025); }
        .sp-tr.selected-row { background:rgba(255,45,0,.04); }

        .sp-td { padding:12px 14px; vertical-align:middle; }

        /* checkbox */
        .sp-cb {
          width:16px; height:16px; cursor:pointer; accent-color:var(--accent);
          flex-shrink:0;
        }

        /* product cell */
        .sp-prod-cell { display:flex; align-items:center; gap:12px; min-width:200px; }
        .sp-prod-img {
          width:52px; height:52px; flex-shrink:0; overflow:hidden;
          clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);
          background:var(--mid); position:relative;
        }
        .sp-prod-img img { width:100%; height:100%; object-fit:cover; filter:saturate(.85); transition:filter .2s; }
        .sp-tr:hover .sp-prod-img img { filter:saturate(1); }
        .sp-prod-badge {
          position:absolute; top:2px; left:2px;
          font-family:'Bebas Neue',sans-serif; font-size:9px; letter-spacing:1px;
          padding:1px 4px; line-height:1.3;
        }
        .sp-badge-new { background:var(--accent); color:#fff; }
        .sp-badge-hot { background:#f59e0b; color:#000; }

        .sp-prod-name {
          font-family:'Barlow Condensed',sans-serif;
          font-size:14px; font-weight:700; letter-spacing:.5px; color:var(--white);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;
        }
        .sp-prod-meta {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; color:var(--dim); margin-top:1px; letter-spacing:.5px;
        }
        .sp-prod-sku {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; color:rgba(255,255,255,.2); letter-spacing:1px; margin-top:1px;
        }

        .sp-cat-tag {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); background:var(--mid); padding:3px 8px; white-space:nowrap;
        }

        .sp-price-cell {}
        .sp-price-main {
          font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:1px; color:var(--white);
        }
        .sp-price-orig {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; color:var(--dim); text-decoration:line-through; margin-top:1px;
        }

        .sp-stock-cell {}
        .sp-stock-num {
          font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:1px;
        }
        .sp-stock-num.ok   { color:var(--white); }
        .sp-stock-num.low  { color:#f59e0b; }
        .sp-stock-num.none { color:#ff2d00; }
        .sp-stock-bar-track {
          width:48px; height:3px; background:var(--mid); margin-top:4px;
        }
        .sp-stock-bar-fill { height:100%; transition:width .4s; }

        .sp-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          padding:4px 9px; cursor:pointer; transition:opacity .2s; white-space:nowrap;
        }
        .sp-status-pill:hover { opacity:.75; }
        .sp-status-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        .sp-sales-cell {
          font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:1px; color:var(--white);
        }

        /* action menu */
        .sp-actions-wrap { position:relative; }
        .sp-actions-btn {
          background:none; border:none; cursor:pointer; color:var(--dim);
          width:32px; height:32px; display:flex; align-items:center; justify-content:center;
          transition:color .2s;
        }
        .sp-actions-btn:hover { color:var(--white); }
        .sp-action-menu {
          position:absolute; right:0; top:calc(100% + 4px);
          background:var(--mid); border:1px solid var(--border);
          min-width:160px; z-index:300; box-shadow:0 8px 32px rgba(0,0,0,.8);
          animation:sp-dd .15s ease;
        }
        .sp-action-item {
          padding:10px 14px; cursor:pointer;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          color:var(--dim); display:flex; align-items:center; gap:8px; transition:all .15s;
          border-left:2px solid transparent;
        }
        .sp-action-item:hover { color:var(--white); background:rgba(255,255,255,.04); border-left-color:var(--accent); }
        .sp-action-item.danger:hover { color:#ff2d00; border-left-color:#ff2d00; background:rgba(255,45,0,.06); }

        /* ── GRID VIEW ── */
        .sp-grid {
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:3px; padding-top:3px;
        }
        @media(min-width:640px)  { .sp-grid { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:1024px) { .sp-grid { grid-template-columns:repeat(4,1fr); } }

        .sp-grid-card {
          background:var(--gray); overflow:hidden;
          cursor:default; transition:transform .25s;
          animation:sp-in .35s ease both; position:relative;
        }
        .sp-grid-card:hover { transform:translateY(-3px); }
        .sp-grid-card.selected-card { outline:1px solid var(--accent); }

        .sp-gc-img { width:100%; aspect-ratio:1; overflow:hidden; position:relative; }
        .sp-gc-img img {
          width:100%; height:100%; object-fit:cover;
          filter:saturate(.8); transition:transform .5s,filter .3s;
        }
        .sp-grid-card:hover .sp-gc-img img { transform:scale(1.06); filter:saturate(1); }
        .sp-gc-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top,rgba(10,10,10,.7) 0%,transparent 55%);
          opacity:0; transition:opacity .3s;
        }
        .sp-grid-card:hover .sp-gc-overlay { opacity:1; }
        .sp-gc-overlay-actions {
          position:absolute; bottom:10px; left:0; right:0;
          display:flex; justify-content:center; gap:6px;
          opacity:0; transform:translateY(8px); transition:all .3s;
        }
        .sp-grid-card:hover .sp-gc-overlay-actions { opacity:1; transform:translateY(0); }
        .sp-gc-action-btn {
          background:rgba(10,10,10,.85); border:1px solid rgba(255,255,255,.15);
          width:34px; height:34px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--dim); transition:all .15s;
        }
        .sp-gc-action-btn:hover { color:var(--white); border-color:rgba(255,255,255,.4); }
        .sp-gc-action-btn.del:hover { color:#ff2d00; border-color:rgba(255,45,0,.5); }

        .sp-gc-select {
          position:absolute; top:8px; left:8px; z-index:2;
          width:18px; height:18px; cursor:pointer; accent-color:var(--accent);
        }
        .sp-gc-badges { position:absolute; top:8px; right:8px; display:flex; flex-direction:column; gap:3px; }

        .sp-gc-body { padding:12px 12px 14px; }
        .sp-gc-cat {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); margin-bottom:3px;
        }
        .sp-gc-name {
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px; font-weight:700; letter-spacing:.5px; color:var(--white);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:6px;
        }
        .sp-gc-row { display:flex; align-items:center; justify-content:space-between; gap:6px; }
        .sp-gc-price {
          font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:1px; color:var(--white);
        }
        .sp-gc-stock-badge {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          padding:2px 6px;
        }
        .sp-gc-status {
          margin-top:6px;
        }

        /* ── DELETE MODAL ── */
        .sp-modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,.85); z-index:500;
          display:flex; align-items:center; justify-content:center;
          animation:sp-fade .2s ease;
          padding:20px;
        }
        @keyframes sp-fade { from{opacity:0} to{opacity:1} }
        .sp-modal {
          background:var(--gray); border:1px solid var(--border);
          max-width:400px; width:100%; padding:28px;
          animation:sp-in .2s ease;
        }
        .sp-modal-icon {
          width:48px; height:48px; background:rgba(255,45,0,.1); border:1px solid rgba(255,45,0,.25);
          display:flex; align-items:center; justify-content:center; margin-bottom:16px;
        }
        .sp-modal-title {
          font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:3px; color:var(--white); margin-bottom:8px;
        }
        .sp-modal-text { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:var(--dim); line-height:1.7; margin-bottom:20px; }
        .sp-modal-actions { display:flex; gap:8px; }
        .sp-modal-cancel {
          flex:1; font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          background:transparent; border:1px solid var(--border); color:var(--dim);
          padding:12px; cursor:pointer; transition:all .2s;
        }
        .sp-modal-cancel:hover { border-color:rgba(255,255,255,.2); color:var(--white); }
        .sp-modal-confirm {
          flex:1; font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          background:#ff2d00; border:none; color:var(--white);
          padding:12px; cursor:pointer; transition:all .2s;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
        }
        .sp-modal-confirm:hover { background:#ff5533; }

        /* ── PAGINATION ── */
        .sp-pagination { display:flex; align-items:center; justify-content:center; gap:4px; padding:20px 0 0; }
        .sp-pg {
          font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:2px;
          background:var(--gray); color:var(--dim); border:1px solid var(--border);
          width:38px; height:38px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s;
        }
        .sp-pg:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .sp-pg.on { background:var(--accent); border-color:var(--accent); color:var(--white); }
        .sp-pg-arrow { background:var(--mid); border:1px solid var(--border); color:var(--dim); width:38px; height:38px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
        .sp-pg-arrow:hover:not(:disabled) { color:var(--white); }
        .sp-pg-arrow:disabled { opacity:.3; pointer-events:none; }

        /* ── EMPTY ── */
        .sp-empty { padding:60px 20px; text-align:center; }
        .sp-empty-icon { font-family:'Bebas Neue',sans-serif; font-size:60px; color:rgba(255,255,255,.06); letter-spacing:2px; }
        .sp-empty-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:var(--dim); margin-bottom:8px; }
        .sp-empty-sub { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:rgba(255,255,255,.25); letter-spacing:1px; }

        /* ── TOAST ── */
        .sp-toast {
          position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
          background:var(--gray); border:1px solid var(--border); border-left:3px solid var(--accent);
          padding:12px 20px; z-index:999;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--white); display:flex; align-items:center; gap:10px;
          box-shadow:0 8px 32px rgba(0,0,0,.7); white-space:nowrap;
          animation:sp-toast .25s ease;
        }
        @keyframes sp-toast { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .sp-toast-dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:sp-pulse 1s ease-in-out infinite; }
        @keyframes sp-pulse { 0%,100%{opacity:1}50%{opacity:.25} }

        @media(max-width:540px) {
          .sp-prod-name { max-width:120px; }
          .sp-prod-sku { display:none; }
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div className="sp-toast">
          <div className="sp-toast-dot" /><Check size={13} color="var(--accent)" />{toast}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="sp-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-icon"><AlertTriangle size={22} color="#ff2d00" /></div>
            <div className="sp-modal-title">Delete Product</div>
            <div className="sp-modal-text">
              Are you sure you want to delete <strong style={{color:"var(--white)"}}>
                {products.find(p => p.id === deleteTarget)?.name}
              </strong>? This action cannot be undone.
            </div>
            <div className="sp-modal-actions">
              <button className="sp-modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="sp-modal-confirm" onClick={() => deleteProduct(deleteTarget)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="sp-page" onClick={() => { setMenuOpen(null); setSortOpen(false); setStatusOpen(false); setBulkMenu(false); }}>

        {/* ── HEADER ── */}
        <div className="sp-header">
          <div>
            <div className="sp-eyebrow">Seller Portal</div>
            <div className="sp-title">MANAGE <span>PRODUCTS</span></div>
            <div className="sp-subtitle">{products.length} listings · {totalActive} active · {outOfStock} out of stock</div>
          </div>
          <div className="sp-header-actions">
            <Link to="/sell/dashboard" className="sp-btn sp-btn-ghost">← Dashboard</Link>
            <Link to="/sell/add" className="sp-btn sp-btn-primary">
              <Plus size={13} /> Add Product
            </Link>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="sp-stats">
          {[
            { label:"All",        val:products.length, color:"#f5f5f0", filter:"all"      as const },
            { label:"Active",     val:totalActive,     color:"#22c55e", filter:"active"   as const },
            { label:"Inactive",   val:totalInactive,   color:"#888",    filter:"inactive" as const },
            { label:"Draft",      val:totalDraft,      color:"#f59e0b", filter:"draft"    as const },
            { label:"Low Stock",  val:lowStock,        color:"#f59e0b", filter:"all"      as const },
          ].map((s,i) => (
            <div key={s.label}
              className={`sp-stat ${statusFilter === s.filter && (s.label!=="Low Stock") ? "active" : ""}`}
              style={{ "--sc":s.color, animationDelay:`${i*.05}s` } as React.CSSProperties}
              onClick={() => { if(s.label !== "Low Stock") { setStatusFilter(s.filter); setPage(1); } }}
            >
              <div className="sp-stat-val">{s.val}</div>
              <div className="sp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="sp-cat-tabs">
          {CATEGORIES.map(c => (
            <button key={c}
              className={`sp-cat-tab ${catFilter===c?"active":""}`}
              onClick={() => { setCatFilter(c); setPage(1); }}>
              {c}
            </button>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="sp-toolbar" onClick={e => e.stopPropagation()}>
          <div className="sp-tb-row1">
            <div className="sp-search">
              <Search size={13} color="var(--dim)" />
              <input ref={searchRef} type="text" placeholder="Search name, brand, SKU..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} />
              {search && (
                <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--dim)",display:"flex"}}
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <div className="sp-tb-row2">
            {/* Sort */}
            <div className="sp-dd-wrap">
              <button className={`sp-dd-btn ${sortOpen?"active":""}`}
                onClick={() => { setSortOpen(o=>!o); setStatusOpen(false); }}>
                <ChevronDown size={13} />
                <span className="sp-dd-lbl">Sort: {sortBy}</span>
              </button>
              {sortOpen && (
                <div className="sp-dropdown">
                  {(["sales","name","price","stock"] as const).map(k => (
                    <div key={k} className={`sp-dd-opt ${sortBy===k?"on":""}`}
                      onClick={() => toggleSort(k)}>
                      {k.charAt(0).toUpperCase()+k.slice(1)}
                      {sortBy===k && (sortDir==="asc"?<ChevronUp size={10}/>:<ChevronDown size={10}/>)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status filter */}
            <div className="sp-dd-wrap">
              <button className={`sp-dd-btn ${statusOpen?"active":""}`}
                onClick={() => { setStatusOpen(o=>!o); setSortOpen(false); }}>
                <Filter size={13} />
                <span className="sp-dd-lbl">Status</span>
                {statusFilter !== "all" && (
                  <span style={{background:"var(--accent)",color:"#fff",fontSize:9,padding:"1px 5px"}}>1</span>
                )}
              </button>
              {statusOpen && (
                <div className="sp-dropdown">
                  {([["all","All"],["active","Active"],["inactive","Inactive"],["draft","Draft"]] as const).map(([k,l]) => (
                    <div key={k} className={`sp-dd-opt ${statusFilter===k?"on":""}`}
                      onClick={() => { setStatusFilter(k); setPage(1); setStatusOpen(false); }}>
                      {k !== "all" && <span className="sp-dd-dot" style={{background:STATUS_META[k as ProductStatus].color}} />}
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear */}
            {(search || catFilter !== "All" || statusFilter !== "all") && (
              <button className="sp-dd-btn" style={{color:"var(--accent)",borderColor:"rgba(255,45,0,.3)"}}
                onClick={() => { setSearch(""); setCatFilter("All"); setStatusFilter("all"); setPage(1); }}>
                <X size={13} /> Clear
              </button>
            )}

            {/* View toggle */}
            <div className="sp-view-toggle" style={{marginLeft:"auto"}}>
              <button className={`sp-vt-btn ${view==="list"?"on":""}`} onClick={() => setView("list")}><List size={15}/></button>
              <button className={`sp-vt-btn ${view==="grid"?"on":""}`} onClick={() => setView("grid")}><Grid size={15}/></button>
            </div>
          </div>
        </div>

        {/* ── BULK ACTION BAR ── */}
        {selected.size > 0 && (
          <div className="sp-bulk-bar" onClick={e => e.stopPropagation()}>
            <div className="sp-bulk-count">{selected.size}</div>
            <div className="sp-bulk-label">selected</div>
            <div className="sp-bulk-actions">
              <button className="sp-bulk-btn" onClick={() => bulkSetStatus("active")}>
                <Check size={11} color="#22c55e"/> Set Active
              </button>
              <button className="sp-bulk-btn" onClick={() => bulkSetStatus("inactive")}>
                <EyeOff size={11}/> Deactivate
              </button>
              <button className="sp-bulk-btn danger" onClick={bulkDelete}>
                <Trash2 size={11}/> Delete All
              </button>
              <button className="sp-bulk-btn" onClick={() => setSelected(new Set())}>
                <X size={11}/> Clear
              </button>
            </div>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div style={{background:"var(--gray)", marginTop:3}}>
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th className="sp-th" style={{width:36}}>
                      <input type="checkbox" className="sp-cb"
                        checked={selected.size === paginated.length && paginated.length > 0}
                        onChange={toggleAll} />
                    </th>
                    <th className="sp-th">Product</th>
                    <th className="sp-th">Category</th>
                    {(["price","stock","sales"] as const).map(k => (
                      <th key={k}
                        className={`sp-th sortable ${sortBy===k?"sorted":""}`}
                        onClick={() => toggleSort(k)}>
                        <div className="sp-th-inner">
                          {k.charAt(0).toUpperCase()+k.slice(1)}
                          <span style={{opacity: sortBy===k ? 1 : .35}}>
                            {sortBy===k ? (sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>) : <ChevronDown size={11}/>}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="sp-th">Status</th>
                    <th className="sp-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={8}>
                      <div className="sp-empty">
                        <div className="sp-empty-icon">📦</div>
                        <div className="sp-empty-title">No Products Found</div>
                        <div className="sp-empty-sub">Try adjusting your search or filters</div>
                      </div>
                    </td></tr>
                  ) : paginated.map((p, idx) => {
                    const sm = STATUS_META[p.status];
                    const stockColor = p.stock === 0 ? "#ff2d00" : p.stock <= 2 ? "#f59e0b" : "var(--white)";
                    const stockClass = p.stock === 0 ? "none" : p.stock <= 2 ? "low" : "ok";
                    const stockPct = Math.min(100, (p.stock / 12) * 100);
                    return (
                      <tr key={p.id} className={`sp-tr ${selected.has(p.id)?"selected-row":""}`}
                        style={{animationDelay:`${idx*.035}s`}}>
                        <td className="sp-td">
                          <input type="checkbox" className="sp-cb"
                            checked={selected.has(p.id)}
                            onChange={() => toggleSelect(p.id)} />
                        </td>
                        <td className="sp-td">
                          <div className="sp-prod-cell">
                            <div className="sp-prod-img">
                              <img src={p.img} alt={p.name} loading="lazy" />
                              {p.isNew && <span className="sp-prod-badge sp-badge-new">NEW</span>}
                              {p.isHot && !p.isNew && <span className="sp-prod-badge sp-badge-hot">HOT</span>}
                            </div>
                            <div>
                              <div className="sp-prod-name">{p.name}</div>
                              <div className="sp-prod-meta">{p.brand}</div>
                              <div className="sp-prod-sku">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="sp-td">
                          <div className="sp-cat-tag">{p.category}</div>
                        </td>
                        <td className="sp-td">
                          <div className="sp-price-main">R{p.price.toLocaleString()}</div>
                          {p.originalPrice && <div className="sp-price-orig">R{p.originalPrice.toLocaleString()}</div>}
                        </td>
                        <td className="sp-td">
                          <div className={`sp-stock-num ${stockClass}`}>{p.stock}</div>
                          <div className="sp-stock-bar-track">
                            <div className="sp-stock-bar-fill"
                              style={{width:`${stockPct}%`, background:stockColor}} />
                          </div>
                        </td>
                        <td className="sp-td">
                          <div className="sp-sales-cell">{p.sales}</div>
                        </td>
                        <td className="sp-td">
                          <div className="sp-status-pill"
                            style={{color:sm.color, background:sm.bg}}
                            onClick={e => { e.stopPropagation(); toggleStatus(p.id); }}
                            title="Click to toggle">
                            <div className="sp-status-dot" style={{background:sm.color}} />
                            {sm.label}
                          </div>
                        </td>
                        <td className="sp-td" onClick={e => e.stopPropagation()}>
                          <div className="sp-actions-wrap">
                            <button className="sp-actions-btn"
                              onClick={() => setMenuOpen(menuOpen===p.id ? null : p.id)}>
                              <MoreHorizontal size={16}/>
                            </button>
                            {menuOpen === p.id && (
                              <div className="sp-action-menu">
                                <div className="sp-action-item" onClick={() => setMenuOpen(null)}>
                                  <Edit2 size={13}/> Edit
                                </div>
                                <div className="sp-action-item" onClick={() => duplicateProduct(p.id)}>
                                  <Copy size={13}/> Duplicate
                                </div>
                                <div className="sp-action-item" onClick={() => { toggleStatus(p.id); }}>
                                  {p.status==="active" ? <><EyeOff size={13}/> Deactivate</> : <><Eye size={13}/> Activate</>}
                                </div>
                                <div className="sp-action-item danger" onClick={() => { setDeleteTarget(p.id); setMenuOpen(null); }}>
                                  <Trash2 size={13}/> Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="sp-pagination">
                <button className="sp-pg-arrow" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} className={`sp-pg ${page===n?"on":""}`} onClick={()=>setPage(n)}>{n}</button>
                ))}
                <button className="sp-pg-arrow" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
              </div>
            )}
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {view === "grid" && (
          <>
            {paginated.length === 0 ? (
              <div className="sp-empty" style={{paddingTop:60}}>
                <div className="sp-empty-title">No Products Found</div>
                <div className="sp-empty-sub">Try adjusting your search or filters</div>
              </div>
            ) : (
              <div className="sp-grid">
                {paginated.map((p, idx) => {
                  const sm = STATUS_META[p.status];
                  const stockColor = p.stock === 0 ? "#ff2d00" : p.stock <= 2 ? "#f59e0b" : "var(--white)";
                  return (
                    <div key={p.id}
                      className={`sp-grid-card ${selected.has(p.id)?"selected-card":""}`}
                      style={{animationDelay:`${idx*.04}s`}}>
                      <div className="sp-gc-img">
                        <img src={p.img} alt={p.name} loading="lazy" />
                        <div className="sp-gc-overlay" />
                        <div className="sp-gc-overlay-actions">
                          <button className="sp-gc-action-btn" title="Edit" onClick={() => showToast(`Editing ${p.name}`)}>
                            <Edit2 size={13}/>
                          </button>
                          <button className="sp-gc-action-btn" title="Duplicate" onClick={() => duplicateProduct(p.id)}>
                            <Copy size={13}/>
                          </button>
                          <button className="sp-gc-action-btn del" title="Delete"
                            onClick={() => setDeleteTarget(p.id)}>
                            <Trash2 size={13}/>
                          </button>
                        </div>
                        <input type="checkbox" className="sp-gc-select"
                          checked={selected.has(p.id)}
                          onChange={() => toggleSelect(p.id)} />
                        <div className="sp-gc-badges">
                          {p.isNew && <span className="sp-prod-badge sp-badge-new">NEW</span>}
                          {p.isHot && !p.isNew && <span className="sp-prod-badge sp-badge-hot">HOT</span>}
                        </div>
                      </div>
                      <div className="sp-gc-body">
                        <div className="sp-gc-cat">{p.brand} · {p.category}</div>
                        <div className="sp-gc-name">{p.name}</div>
                        <div className="sp-gc-row">
                          <div className="sp-gc-price">R{p.price.toLocaleString()}</div>
                          <div className="sp-gc-stock-badge" style={{color:stockColor, background:`${stockColor}22`}}>
                            {p.stock === 0 ? "Out" : `${p.stock} left`}
                          </div>
                        </div>
                        <div className="sp-gc-status">
                          <div className="sp-status-pill" style={{color:sm.color, background:sm.bg}}
                            onClick={() => toggleStatus(p.id)}>
                            <div className="sp-status-dot" style={{background:sm.color}}/>
                            {sm.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {totalPages > 1 && (
              <div className="sp-pagination">
                <button className="sp-pg-arrow" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} className={`sp-pg ${page===n?"on":""}`} onClick={()=>setPage(n)}>{n}</button>
                ))}
                <button className="sp-pg-arrow" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}