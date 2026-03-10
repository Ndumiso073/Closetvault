import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, X, Heart, ShoppingBag, Grid3X3, LayoutList, ArrowLeft, ArrowRight, ChevronUp } from "lucide-react";
import { PRODUCTS, BRANDS, CATEGORIES, CONDITIONS, SIZES, SORT_OPTIONS, IMG_SHOP_HERO } from "../data/products";
import { useCart } from "../context/CartContext";

const PER_PAGE = 12;

export default function ShopPage() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [search, setSearch]               = useState("");
  const [sortBy, setSortBy]               = useState("newest");
  const [sortOpen, setSortOpen]           = useState(false);
  const [showFilters, setShowFilters]     = useState(false);
  const [viewMode, setViewMode]           = useState<"grid"|"list">("grid");
  const [page, setPage]                   = useState(1);
  const [priceRange, setPriceRange]       = useState([0, 500]);
  const [selBrands, setSelBrands]         = useState<string[]>([]);
  const [selCats, setSelCats]             = useState<string[]>([]);
  const [selSizes, setSelSizes]           = useState<string[]>([]);
  const [selConds, setSelConds]           = useState<string[]>([]);
  const [saved, setSaved]                 = useState<Record<number, boolean>>({});
  const [added, setAdded]                 = useState<Record<number, boolean>>({});
  const [catOpen, setCatOpen]             = useState(true);
  const [brandOpen, setBrandOpen]         = useState(true);
  const [sizeOpen, setSizeOpen]           = useState(true);
  const [condOpen, setCondOpen]           = useState(true);


  const toggle = <T,>(arr: T[], set: (v: T[]) => void, val: T) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filtered = PRODUCTS.filter(p => {
    const q = search.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) &&
      (!selBrands.length || selBrands.includes(p.brand)) &&
      (!selCats.length   || selCats.includes(p.category)) &&
      (!selConds.length  || selConds.includes(p.condition)) &&
      p.price >= priceRange[0] && p.price <= priceRange[1] &&
      (!category || p.category.toLowerCase() === category.toLowerCase())
    );
  }).sort((a, b) =>
    sortBy === "price-asc"  ? a.price - b.price :
    sortBy === "price-desc" ? b.price - a.price :
    sortBy === "popular"    ? (b.id % 7) - (a.id % 7) :
    b.id - a.id
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const filterCount = selBrands.length + selCats.length + selSizes.length + selConds.length + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const clearAll = () => { setSelBrands([]); setSelCats([]); setSelSizes([]); setSelConds([]); setPriceRange([0, 500]); setSearch(""); setPage(1); };

  const handleAddCart = (id: number) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) addToCart(product, "M"); // default size from shop card; user can change on product page
    setAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 1200);
  };

  const FilterContents = () => (
    <div className="sb-inner">
      <div className="sb-header">
        <span className="sb-title">FILTERS</span>
        {filterCount > 0 && (
          <button className="sb-clear-btn" onClick={clearAll}>
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* CATEGORY */}
      <div className="sb-section">
        <div className="sb-section-header" onClick={() => setCatOpen(o => !o)}>
          <span className="sb-section-label">Category</span>
          <ChevronUp size={13} className={`sb-section-arrow ${catOpen ? "open" : ""}`} />
        </div>
        <div className={`sb-section-body ${catOpen ? "" : "closed"}`}>
          <div className="sb-checklist">
            {CATEGORIES.map(c => (
              <div key={c} className="sb-check" onClick={() => { toggle(selCats, setSelCats, c); setPage(1); }}>
                <div className={`sb-checkbox ${selCats.includes(c) ? "on" : ""}`} />
                <span className="sb-check-label">{c}</span>
                <span className="sb-check-count">{PRODUCTS.filter(p => p.category === c).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRAND */}
      <div className="sb-section">
        <div className="sb-section-header" onClick={() => setBrandOpen(o => !o)}>
          <span className="sb-section-label">Brand</span>
          <ChevronUp size={13} className={`sb-section-arrow ${brandOpen ? "open" : ""}`} />
        </div>
        <div className={`sb-section-body ${brandOpen ? "" : "closed"}`}>
          <div className="sb-checklist">
            {BRANDS.map(b => (
              <div key={b} className="sb-check" onClick={() => { toggle(selBrands, setSelBrands, b); setPage(1); }}>
                <div className={`sb-checkbox ${selBrands.includes(b) ? "on" : ""}`} />
                <span className="sb-check-label">{b}</span>
                <span className="sb-check-count">{PRODUCTS.filter(p => p.brand === b).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="sb-section">
        <div className="sb-section-header" style={{ cursor: "default" }}>
          <span className="sb-section-label">Price Range</span>
        </div>
        <div className="sb-section-body">
          <div className="sb-price-row">
            <span className="sb-price-val">R{priceRange[0]}</span>
            <span className="sb-price-sep">—</span>
            <span className="sb-price-val">R{priceRange[1]}</span>
          </div>
          <div className="range-wrap">
            <div
              className="range-fill"
              style={{ left: `${(priceRange[0]/500)*100}%`, width: `${((priceRange[1]-priceRange[0])/500)*100}%` }}
            />
            <input
              type="range" min={0} max={500} value={priceRange[0]}
              className="range-inp"
              style={{ zIndex: priceRange[0] > 450 ? 5 : 3 }}
              onChange={e => { const v = Math.min(+e.target.value, priceRange[1]-10); setPriceRange([v, priceRange[1]]); setPage(1); }}
            />
            <input
              type="range" min={0} max={500} value={priceRange[1]}
              className="range-inp" style={{ zIndex: 4 }}
              onChange={e => { const v = Math.max(+e.target.value, priceRange[0]+10); setPriceRange([priceRange[0], v]); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* SIZE */}
      <div className="sb-section">
        <div className="sb-section-header" onClick={() => setSizeOpen(o => !o)}>
          <span className="sb-section-label">Size (US)</span>
          <ChevronUp size={13} className={`sb-section-arrow ${sizeOpen ? "open" : ""}`} />
        </div>
        <div className={`sb-section-body ${sizeOpen ? "" : "closed"}`}>
          <div className="sb-pills">
            {SIZES.map(s => (
              <button
                key={s}
                className={`sb-pill ${selSizes.includes(s) ? "on" : ""}`}
                onClick={() => { toggle(selSizes, setSelSizes, s); setPage(1); }}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CONDITION */}
      <div className="sb-section">
        <div className="sb-section-header" onClick={() => setCondOpen(o => !o)}>
          <span className="sb-section-label">Condition</span>
          <ChevronUp size={13} className={`sb-section-arrow ${condOpen ? "open" : ""}`} />
        </div>
        <div className={`sb-section-body ${condOpen ? "" : "closed"}`}>
          <div className="sb-checklist">
            {CONDITIONS.map(c => (
              <div key={c} className="sb-check" onClick={() => { toggle(selConds, setSelConds, c); setPage(1); }}>
                <div className={`sb-checkbox ${selConds.includes(c) ? "on" : ""}`} />
                <span className="sb-check-label">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        :root {
          --border: rgba(255,255,255,0.07);
          --sb-w:   268px;
          --side-pad-mobile:  20px;
          --side-pad-tablet:  40px;
          --side-pad-desktop: 60px;
        }

        /* ─── SIDEBAR ─── */
        .shop-sidebar {
          width: var(--sb-w);
          flex-shrink: 0;
          background: var(--gray);
          border-right: 1px solid var(--border);
          overflow-y: auto; overflow-x: hidden;
          align-self: flex-start;
          position: sticky;
          top: calc(var(--nav-h) + 48px);
          max-height: calc(100vh - var(--nav-h) - 48px);
          transition: width .3s cubic-bezier(.4,0,.2,1), opacity .25s ease;
          scrollbar-width: thin; scrollbar-color: var(--mid) transparent;
        }
        .shop-sidebar.collapsed {
          width: 0; opacity: 0; pointer-events: none; overflow: hidden;
        }
        .shop-sidebar::-webkit-scrollbar { width: 3px; }
        .shop-sidebar::-webkit-scrollbar-thumb { background: var(--mid); }

        /* ─── HERO BANNER (compact) ─── */
        .shop-hero {
          position: relative; width: 100%;
          height: 260px;
          display: flex; align-items: flex-end;
          overflow: hidden;
        }
        .shop-hero-bg {
          position: absolute; inset: 0;
          background-image: url('${IMG_SHOP_HERO}');
          background-size: cover; background-position: center 35%;
          filter: blur(3px);
        }
        .shop-hero-bg::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(
            to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.2) 100%
          ), linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 55%);
        }
        .shop-hero-bg::before {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px);
        }
        .shop-hero-inner {
          position: relative; z-index: 2;
          width: 100%; padding: 0 var(--side-pad-mobile) 36px;
        }
        @media (min-width: 768px)  { .shop-hero-inner { padding: 0 var(--side-pad-tablet) 36px; } }
        @media (min-width: 1024px) { .shop-hero-inner { padding: 0 var(--side-pad-desktop) 36px; } }

        .shop-hero-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 10px;
          display: flex; align-items: center; gap: 10px;
          animation: fadeUp .5s ease .1s both;
        }
        .shop-hero-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--accent); }
        .shop-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          line-height: .9; letter-spacing: -1px; color: var(--white);
          animation: fadeUp .6s ease .2s both;
        }
        .shop-hero-title .red    { color: var(--accent); }
        .shop-hero-title .hollow { -webkit-text-stroke: 1.5px var(--white); color: transparent; }
        .shop-hero-crumb {
          display: flex; align-items: center; gap: 8px; margin-top: 12px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          animation: fadeUp .6s ease .3s both;
        }
        .shop-hero-crumb a { color: var(--dim); text-decoration: none; transition: color .2s; }
        .shop-hero-crumb a:hover { color: var(--white); }
        .shop-hero-crumb-sep { color: rgba(255,255,255,.2); }
        .shop-hero-crumb-cur { color: var(--accent); }

        /* ─── SHOP LAYOUT ─── */
        .shop-layout {
          display: flex; align-items: flex-start;
          min-height: calc(100vh - var(--nav-h) - 260px - 48px);
        }

        /* ─── TOOLBAR ─── */
        .shop-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px var(--side-pad-mobile);
          background: var(--gray);
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap; gap: 10px;
          position: sticky; top: var(--nav-h); z-index: 50;
        }
        @media (min-width: 768px)  { .shop-toolbar { padding: 14px var(--side-pad-tablet); } }
        @media (min-width: 1024px) { .shop-toolbar { padding: 14px var(--side-pad-desktop); } }
        .toolbar-left  { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; flex: 1; min-width: 0; }
        .toolbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        /* search */
        .tb-search {
          display: flex; align-items: center; gap: 8px;
          background: var(--mid); border: 1px solid var(--border);
          padding: 8px 14px; min-width: 220px;
          transition: border-color .2s;
        }
        .tb-search:focus-within { border-color: var(--accent); }
        .tb-search input {
          background: transparent; border: none; outline: none;
          color: var(--white); font-family: 'Barlow', sans-serif; font-size: 13px; flex: 1;
        }
        .tb-search input::placeholder { color: var(--dim); }
        .tb-clear { background: none; border: none; cursor: pointer; color: var(--dim); display: flex; transition: color .2s; }
        .tb-clear:hover { color: var(--white); }

        /* count */
        .tb-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); white-space: nowrap;
        }
        .tb-count strong { color: var(--accent); }

        /* filter toggle */
        .tb-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: 1px solid var(--border); padding: 8px 16px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all .2s; white-space: nowrap;
        }
        .tb-btn-filter { background: transparent; color: var(--white); }
        .tb-btn-filter:hover { border-color: var(--accent); color: var(--accent); }
        .tb-btn-filter.active { background: var(--accent); border-color: var(--accent); color: var(--white); }
        .tb-badge {
          background: rgba(255,255,255,.15); color: var(--white);
          font-size: 9px; font-weight: 900;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .tb-btn-filter.active .tb-badge { background: rgba(255,255,255,.25); }

        /* sort */
        .tb-sort { position: relative; }
        .tb-sort-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: var(--mid); color: var(--white);
          border: 1px solid var(--border);
          padding: 8px 14px; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          min-width: 180px; justify-content: space-between;
          transition: border-color .2s;
        }
        @media (max-width: 600px) {
          .tb-sort-btn { min-width: 0; }
          .tb-sort-label { display: none; }
          .tb-btn { padding: 8px 12px; }
          .tb-search { min-width: 0; flex: 1; }
        }
        .tb-sort-btn:hover { border-color: rgba(255,255,255,.2); }
        .tb-sort-dropdown {
          position: absolute; right: 0; top: calc(100% + 4px);
          background: var(--mid); border: 1px solid var(--border);
          min-width: 200px; z-index: 200;
          animation: fadeDown .15s ease;
        }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .tb-sort-opt {
          padding: 10px 16px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); transition: all .15s;
          border-left: 2px solid transparent;
        }
        .tb-sort-opt:hover { color: var(--white); background: rgba(255,255,255,.04); border-left-color: var(--accent); }
        .tb-sort-opt.active { color: var(--accent); border-left-color: var(--accent); }

        /* view toggle */
        .tb-view { display: flex; border: 1px solid var(--border); }
        .tb-view-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--dim); padding: 8px 10px; transition: all .2s; display: flex; align-items: center;
        }
        .tb-view-btn + .tb-view-btn { border-left: 1px solid var(--border); }
        .tb-view-btn:hover { color: var(--white); }
        .tb-view-btn.active { background: var(--mid); color: var(--accent); }

        /* ─── SIDEBAR INNER ─── */
        .sb-inner { padding: 24px 20px; min-width: calc(var(--sb-w) - 2px); }

        .sb-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .sb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 5px; color: var(--white);
        }
        .sb-clear-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: transparent; border: none; cursor: pointer; color: var(--accent);
          display: flex; align-items: center; gap: 4px; transition: opacity .2s;
        }
        .sb-clear-btn:hover { opacity: .7; }

        /* filter accordion */
        .sb-section { border-top: 1px solid var(--border); padding: 16px 0; }
        .sb-section-header {
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; margin-bottom: 0; user-select: none;
          padding: 2px 0;
        }
        .sb-section-header:hover .sb-section-label { color: var(--white); }
        .sb-section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,.55);
          transition: color .2s;
        }
        .sb-section-arrow { color: var(--dim); transition: transform .2s; }
        .sb-section-arrow.open { transform: rotate(180deg); }
        .sb-section-body { margin-top: 16px; overflow: hidden; }
        .sb-section-body.closed { display: none; }

        /* check list */
        .sb-checklist { display: flex; flex-direction: column; gap: 6px; }
        .sb-check {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; padding: 5px 0; transition: color .2s;
        }
        .sb-check:hover .sb-check-label { color: var(--white); }
        .sb-checkbox {
          width: 15px; height: 15px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,.2);
          display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .sb-checkbox.on { background: var(--accent); border-color: var(--accent); }
        .sb-checkbox.on::after { content: '✓'; font-size: 10px; color: var(--white); font-weight: 900; line-height: 1; }
        .sb-check-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 1px;
          color: var(--dim); flex: 1;
        }
        .sb-check-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; color: rgba(255,255,255,.2);
        }

        /* size pills */
        .sb-pills { display: flex; flex-wrap: wrap; gap: 5px; }
        .sb-pill {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          background: var(--mid); color: var(--dim);
          border: 1px solid var(--border);
          padding: 6px 10px; cursor: pointer;
          clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
          transition: all .15s;
        }
        .sb-pill:hover { border-color: rgba(255,255,255,.2); color: var(--white); }
        .sb-pill.on { background: var(--accent); border-color: var(--accent); color: var(--white); }

        /* price range */
        .sb-price-row {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;
        }
        .sb-price-val {
          font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; color: var(--white);
        }
        .sb-price-sep { color: var(--dim); font-size: 12px; }
        .range-wrap { position: relative; height: 4px; background: var(--mid); margin: 6px 0 4px; }
        .range-fill {
          position: absolute; height: 100%; background: var(--accent); pointer-events: none;
        }
        .range-inp {
          position: absolute; width: 100%; height: 100%;
          -webkit-appearance: none; appearance: none;
          background: transparent; outline: none; pointer-events: none;
          top: 50%; transform: translateY(-50%);
        }
        .range-inp::-webkit-slider-thumb {
          -webkit-appearance: none; width: 14px; height: 14px;
          background: var(--white); border-radius: 50%;
          cursor: pointer; pointer-events: auto;
          box-shadow: 0 0 0 2px var(--accent); transition: transform .15s;
        }
        .range-inp::-webkit-slider-thumb:hover { transform: scale(1.3); }

        /* ─── MAIN ─── */
        .shop-main {
          flex: 1; min-width: 0;
          padding: 32px var(--side-pad-mobile) 48px;
        }
        @media (min-width: 768px)  { .shop-main { padding: 32px var(--side-pad-tablet) 48px; } }
        @media (min-width: 1024px) { .shop-main { padding: 32px 40px 48px; } }

        /* ─── PRODUCT GRID ─── */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 3px; margin-bottom: 48px;
        }
        .prod-grid.list { 
          display: flex; 
          flex-direction: column; 
          gap: 3px; 
        }

        /* ─── CARD ─── */
        .card {
          background: var(--gray); display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          animation: cardIn .4s ease both;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .card:nth-child(1)  { animation-delay:.02s } .card:nth-child(2)  { animation-delay:.04s }
        .card:nth-child(3)  { animation-delay:.06s } .card:nth-child(4)  { animation-delay:.08s }
        .card:nth-child(5)  { animation-delay:.10s } .card:nth-child(6)  { animation-delay:.12s }
        .card:nth-child(7)  { animation-delay:.14s } .card:nth-child(8)  { animation-delay:.16s }
        .card:nth-child(9)  { animation-delay:.18s } .card:nth-child(10) { animation-delay:.20s }
        .card:nth-child(11) { animation-delay:.22s } .card:nth-child(12) { animation-delay:.24s }
        .card:hover { transform: translateY(-5px); }
        .card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--accent); transform: scaleX(0); transform-origin: left;
          transition: transform .3s ease; z-index: 1;
        }
        .card:hover::before { transform: scaleX(1); }

        /* badges */
        .card-badges { position: absolute; top: 10px; left: 10px; z-index: 2; display: flex; flex-direction: column; gap: 4px; }
        .cbadge {
          font-family: 'Bebas Neue', sans-serif; font-size: 10px; letter-spacing: 2px; padding: 3px 8px;
        }
        .cbadge-new  { background: var(--accent); color: var(--white); }
        .cbadge-hot  { background: var(--white);  color: var(--black); }
        .cbadge-sale { background: #22c55e; color: var(--black); }

        /* heart */
        .card-heart {
          position: absolute; top: 10px; right: 10px; z-index: 2;
          background: rgba(10,10,10,.72); border: 1px solid rgba(255,255,255,.1);
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; backdrop-filter: blur(4px);
        }
        .card-heart:hover, .card-heart.on { background: var(--accent); border-color: var(--accent); }
        .card-heart svg { width: 14px; height: 14px; stroke: var(--white); fill: none; stroke-width: 2; }
        .card-heart.on svg { fill: var(--white); }

        /* image */
        .card-img { width: 100%; aspect-ratio: 1; overflow: hidden; background: var(--mid); flex-shrink: 0; }
        .card-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.82) saturate(.75);
          transition: transform .5s ease, filter .3s;
          display: block;
        }
        .card:hover .card-img img { transform: scale(1.07); filter: brightness(.95) saturate(1); }

        /* body */
        .card-body { padding: 16px 14px; flex: 1; display: flex; flex-direction: column; }
        .card-cond {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 4px;
        }
        .card-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 1px;
          color: var(--white); margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .card-brand { font-size: 12px; font-weight: 300; color: var(--dim); margin-bottom: 12px; }
        .card-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; margin-top: auto; }
        .card-price { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: var(--white); }
        .card-orig  { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; color: var(--dim); text-decoration: line-through; }
        .card-save-pct { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; color: #22c55e; letter-spacing: 1px; }

        /* card actions */
        .card-actions { display: flex; gap: 2px; }
        .card-btn {
          flex: 1; padding: 10px 6px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: none; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .card-btn-cart {
          background: var(--accent); color: var(--white);
          clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          position: relative; overflow: hidden;
        }
        .card-btn-cart::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.18);
          transform: translateX(-120%) skewX(-15deg);
          transition: transform .4s ease;
        }
        .card-btn-cart:hover::after { transform: translateX(120%) skewX(-15deg); }
        .card-btn-cart:hover { background: #ff5533; transform: translateY(-1px); }
        .card-btn-cart.added { background: #22c55e; }
        .card-btn-vault {
          background: var(--mid); color: var(--dim);
          border: 1px solid var(--border);
        }
        .card-btn-vault:hover { background: var(--black); color: var(--white); border-color: rgba(255,255,255,.2); }
        .card-btn-vault.saved { color: var(--accent); border-color: var(--accent); }

        /* LIST VIEW */
        .prod-grid.list { 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          width: 100%;
          max-width: 100%;
        }
        .prod-grid.list .card { 
          flex-direction: row; 
          height: 130px; 
          width: 100%;
          max-width: 100%;
        }
        .prod-grid.list .card::before { right: auto; bottom: 0; top: 0; width: 2px; height: auto; transform: scaleY(0); transform-origin: top; }
        .prod-grid.list .card:hover::before { transform: scaleY(1); }
        .prod-grid.list .card-img { width: 130px; height: 130px; flex-shrink: 0; aspect-ratio: auto; }
        .prod-grid.list .card-body { flex-direction: row; align-items: center; gap: 20px; flex: 1; padding: 16px 18px; }
        .prod-grid.list .card-info  { flex: 1; }
        .prod-grid.list .card-actions { flex-shrink: 0; flex-direction: column; gap: 5px; width: 140px; }
        .prod-grid.list .card-actions .card-btn { flex: none; width: 100%; }
        .prod-grid.list .card-badges { top: 8px; left: 138px; }
        .prod-grid.list .card-heart  { top: 8px; right: 8px; }

        /* empty */
        .empty {
          grid-column: 1/-1;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 20px; text-align: center;
        }
        .empty-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 100px;
          color: rgba(255,255,255,.04); line-height: 1; margin-bottom: 12px;
        }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; color: var(--dim);
          margin-bottom: 8px;
        }
        .empty-sub { font-size: 14px; color: var(--dim); margin-bottom: 20px; }

        /* ─── PAGINATION ─── */
        .pagination {
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }
        .pg-btn {
          font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px;
          background: var(--gray); color: var(--dim);
          border: 1px solid var(--border);
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s;
        }
        .pg-btn:hover:not(.disabled) { border-color: rgba(255,255,255,.2); color: var(--white); }
        .pg-btn.on { background: var(--accent); border-color: var(--accent); color: var(--white); }
        .pg-btn.disabled { opacity: .3; pointer-events: none; }
        .pg-arrow {
          background: var(--mid); border: 1px solid var(--border);
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--dim); transition: all .2s;
        }
        .pg-arrow:hover:not(.disabled) { color: var(--white); border-color: rgba(255,255,255,.2); }
        .pg-arrow.disabled { opacity: .3; pointer-events: none; }

        /* ─── SHARED BUTTONS ─── */
        .btn-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 12px 28px; cursor: pointer; text-decoration: none;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition: all .25s; display: inline-flex; align-items: center; gap: 8px;
          position: relative; overflow: hidden; white-space: nowrap;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,45,0,.4); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          :root { --sb-w: 240px; }
        }
        @media (max-width: 768px) {
          .shop-sidebar {
            position: fixed; top: calc(var(--nav-h) + 48px); left: 0; bottom: 0; z-index: 90;
            box-shadow: 4px 0 24px rgba(0,0,0,.6);
            max-height: none;
          }
          .shop-hero { height: 180px; }
          .prod-grid { grid-template-columns: repeat(2, 1fr); }
          .prod-grid.list .card { height: auto; flex-direction: column; }
          .prod-grid.list .card-img { width: 100%; height: 180px; }
          .prod-grid.list .card-body { flex-direction: column; align-items: flex-start; }
          .prod-grid.list .card-actions { width: 100%; flex-direction: row; }
          .tb-search { min-width: 0; flex: 1; }
        }
        @media (max-width: 480px) {
          .prod-grid, .prod-grid.list { grid-template-columns: 1fr; }
        }
      `}</style>

      <div>

        {/* ── HERO BANNER ── */}
        <div className="shop-hero">
          <div className="shop-hero-bg" />
          <div className="shop-hero-inner">
            <div className="shop-hero-eyebrow">The Vault Marketplace</div>
            <h1 className="shop-hero-title">
              SHOP <span className="hollow">YOUR</span> <span className="red">STYLE.</span>
            </h1>
            <div className="shop-hero-crumb">
              <Link to="/" className="">Home</Link>
              <span className="shop-hero-crumb-sep">/</span>
              <span className="shop-hero-crumb-cur">Marketplace</span>
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="shop-toolbar">
          <div className="toolbar-left">
            {/* search */}
            <div className="tb-search">
              <Search size={13} color="var(--dim)" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              {search && (
                <button className="tb-clear" onClick={() => { setSearch(""); setPage(1); }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* result count */}
            <span className="tb-count">
              <strong>{filtered.length}</strong> products
            </span>
          </div>

          <div className="toolbar-right">
            {/* sort */}
            <div className="tb-sort">
              <button className="tb-sort-btn" onClick={() => setSortOpen(o => !o)}>
                <span className="tb-sort-label">{SORT_OPTIONS[sortBy as keyof typeof SORT_OPTIONS]}</span>
                <ChevronDown size={13} style={{ transform: sortOpen ? "rotate(180deg)" : "", transition: "transform .2s" }} />
              </button>
              {sortOpen && (
                <div className="tb-sort-dropdown">
                  {Object.entries(SORT_OPTIONS).map(([k, v]) => (
                    <div
                      key={k}
                      className={`tb-sort-opt ${sortBy === k ? "active" : ""}`}
                      onClick={() => { setSortBy(k); setSortOpen(false); setPage(1); }}
                    >{v}</div>
                  ))}
                </div>
              )}
            </div>

            {/* filter toggle */}
            <button
              className={`tb-btn tb-btn-filter ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(f => !f)}
            >
              <SlidersHorizontal size={13} />
              Filters
              {filterCount > 0 && <span className="tb-badge">{filterCount}</span>}
            </button>

            {/* view mode */}
            <div className="tb-view">
              <button className={`tb-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid">
                <Grid3X3 size={14} />
              </button>
              <button className={`tb-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List">
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="shop-layout" onClick={() => sortOpen && setSortOpen(false)}>

          {/* SIDEBAR */}
          <aside className={`shop-sidebar ${showFilters ? "" : "collapsed"}`}>
            <FilterContents />
          </aside>

          {/* MAIN */}
          <main className="shop-main">
            <div className={`prod-grid ${viewMode === "list" ? "list" : ""}`}>
              {pageItems.length === 0 ? (
                <div className="empty">
                  <div className="empty-num">0</div>
                  <div className="empty-title">No Products Found</div>
                  <p className="empty-sub">Try adjusting your filters or search term</p>
                  <button className="btn-primary" onClick={clearAll}>Clear Filters</button>
                </div>
              ) : (
                pageItems.map(p => (
                  <div key={p.id} className="card">
                    {/* badges */}
                    <div className="card-badges">
                      {p.isNew  && <span className="cbadge cbadge-new">NEW</span>}
                      {p.isHot  && <span className="cbadge cbadge-hot">🔥 HOT</span>}
                      {p.originalPrice && <span className="cbadge cbadge-sale">SALE</span>}
                    </div>

                    {/* heart */}
                    <button
                      className={`card-heart ${saved[p.id] ? "on" : ""}`}
                      onClick={e => { e.stopPropagation(); setSaved(prev => ({ ...prev, [p.id]: !prev[p.id] })); }}
                    >
                      <Heart size={14} />
                    </button>

                    {/* image — click goes to product page */}
                    <Link to={`/product/${p.id}`} className="card-img" style={{ display: "block" }}>
                      <img src={p.img} alt={p.name} loading="lazy" />
                    </Link>

                    {/* body */}
                    <div className="card-body">
                      <div className={viewMode === "list" ? "card-info" : ""}>
                        <div className="card-cond">{p.condition} · {p.category}</div>
                        <div className="card-name">{p.name}</div>
                        <div className="card-brand">{p.brand}</div>
                        <div className="card-price-row">
                          <span className="card-price">R{p.price}</span>
                          {p.originalPrice && (
                            <>
                              <span className="card-orig">R{p.originalPrice}</span>
                              <span className="card-save-pct">-{Math.round((1 - p.price/p.originalPrice)*100)}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          className={`card-btn card-btn-cart ${added[p.id] ? "added" : ""}`}
                          onClick={e => { e.stopPropagation(); handleAddCart(p.id); }}
                        >
                          <ShoppingBag size={12} />
                          {added[p.id] ? "Added!" : "Add"}
                        </button>
                        <button
                          className={`card-btn card-btn-vault ${saved[p.id] ? "saved" : ""}`}
                          onClick={e => { e.stopPropagation(); setSaved(prev => ({ ...prev, [p.id]: true })); }}
                        >
                          {saved[p.id] ? "✓ Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className={`pg-arrow ${page === 1 ? "disabled" : ""}`}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                ><ArrowLeft size={15} /></button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`pg-btn ${page === n ? "on" : ""}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}

                <button
                  className={`pg-arrow ${page === totalPages ? "disabled" : ""}`}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                ><ArrowRight size={15} /></button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}