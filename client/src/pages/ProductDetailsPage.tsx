import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag, Heart, Star, ChevronLeft, Share2,
  Shield, Truck, RotateCcw, Check, ChevronRight
} from "lucide-react";
import { SIZES, type Product as CartProduct } from "../data/products";
import { supabase } from "../lib/supabase";

type DbProduct = {
  id: string;
  seller_id: string | null;
  title: string;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  condition: string;
  size: string;
  gender: string;
  description: string | null;
  images: string[] | null;
  tags: string[] | null;
  status: string;
};

// ── Mock static data (reviews, seller badge) ─────────────────────────────
const MOCK_REVIEWS = [
  { id: 1, name: "Jordan K.",  rating: 5, date: "Feb 14, 2026", verified: true,  comment: "Absolutely fire. Fits true to size, quality is unreal. Shipped fast and packaged perfectly. Would buy again without hesitation." },
  { id: 2, name: "Sipho M.",   rating: 4, date: "Jan 30, 2026", verified: true,  comment: "Clean colourway, exactly as described. Condition is legit Like New. Delivery took an extra day but 100% worth the wait." },
  { id: 3, name: "Lerato V.",  rating: 5, date: "Jan 12, 2026", verified: false, comment: "Seller was super responsive and the kicks arrived in perfect shape. ClosetVault's vault feature is great for tracking what I own." },
];
const SELLER = { name: "VaultKing_ZA", rating: 4.8, sales: 312, joined: "2024", responseTime: "< 1hr" };

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct]     = useState<DbProduct | null>(null);
  const [similar, setSimilar]     = useState<DbProduct[]>([]);
  const [loading, setLoading]     = useState(true);

  const [activeImg, setActiveImg]   = useState(0);
  const [selectedSize, setSize]     = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);
  const [added, setAdded]           = useState(false);
  const [sizeError, setSizeError]   = useState(false);
  const [activeTab, setActiveTab]   = useState<"desc" | "shipping" | "returns">("desc");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setProduct(data as DbProduct);
        // fetch a few similar products in same category
        const { data: sim } = await supabase
          .from("products")
          .select("id,title,brand,price,original_price,condition,category,images")
          .eq("category", data.category)
          .neq("id", data.id)
          .eq("status", "active")
          .limit(6);
        if (sim) setSimilar(sim as DbProduct[]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  // build thumbnail list from stored images
  const thumbs = (() => {
    const imgs = product?.images && product.images.length > 0
      ? product.images
      : ["/assets/placeholder.jpg"];
    return imgs;
  })();

  const toCartProduct = (p: DbProduct): CartProduct => ({
    id: 0, // DB id is string; cart only uses it for cartId key
    name: p.title,
    brand: p.brand,
    price: p.price,
    originalPrice: p.original_price,
    condition: p.condition,
    category: p.category,
    img: p.images?.[0] ?? "",
    isNew: false,
    isHot: false,
  });

  const handleAddCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2200); return; }
    if (product) addToCart(toCartProduct(product), selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2200); return; }
    if (product) addToCart(toCartProduct(product), selectedSize);
    navigate("/cart");
  };

  const savePct = product?.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  // ── LOADING / 404 ───────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`
          .pd-loading {
            min-height: 60vh; display:flex; align-items:center; justify-content:center;
            font-family:'Barlow',sans-serif; color:rgba(255,255,255,.5);
          }
        `}</style>
        <div className="pd-loading">Loading product…</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400&display=swap');
          .nf { display:flex; flex-direction:column; align-items:center; justify-content:center;
            min-height:60vh; text-align:center; padding:60px 20px;
            font-family:'Barlow',sans-serif; }
          .nf-num { font-family:'Bebas Neue',sans-serif; font-size:140px;
            line-height:1; color:rgba(255,255,255,.03); margin-bottom:0; }
          .nf-title { font-family:'Bebas Neue',sans-serif; font-size:32px;
            letter-spacing:3px; color:var(--dim,#888); margin-bottom:10px; }
          .nf-sub { font-size:14px; color:var(--dim,#888); margin-bottom:32px; }
          .nf-back {
            font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700;
            letter-spacing:3px; text-transform:uppercase;
            background:var(--accent,#ff2d00); color:#f5f5f0;
            border:none; padding:12px 28px; cursor:pointer; text-decoration:none;
            clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
            display:inline-flex; align-items:center; gap:8px;
          }
        `}</style>
        <div className="nf">
          <div className="nf-num">404</div>
          <div className="nf-title">Product Not Found</div>
          <p className="nf-sub">This item may have been sold or removed from the marketplace.</p>
          <Link to="/shop" className="nf-back"><ChevronLeft size={14} /> Back to Shop</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&display=swap');

        /* ── PAGE SHELL ── */
        .pd {
          max-width: 1320px;
          margin: 0 auto;
          padding: 28px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .pd { padding: 36px 40px 100px; } }
        @media (min-width: 1200px) { .pd { padding: 40px 60px 100px; } }

        /* ── BREADCRUMB ── */
        .pd-crumb {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 28px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .pd-crumb a {
          color: var(--dim); text-decoration: none; transition: color .2s;
        }
        .pd-crumb a:hover { color: var(--white); }
        .pd-crumb-sep { color: rgba(255,255,255,.15); font-size: 9px; }
        .pd-crumb-cur { color: var(--accent); max-width: 220px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ── TWO-COLUMN PRODUCT LAYOUT ── */
        .pd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 72px;
        }
        @media (min-width: 900px) {
          .pd-grid {
            /* gallery | info — classic 55/45 split */
            grid-template-columns: minmax(0, 55fr) minmax(0, 45fr);
            gap: 52px;
            align-items: start;
          }
        }

        /* ── GALLERY ── */
        .pd-gallery {
          display: grid;
          /* thumbs column (fixed) + main image column */
          grid-template-columns: 76px 1fr;
          gap: 10px;
          position: sticky;
          top: calc(var(--nav-h, 64px) + 16px);
        }
        @media (max-width: 899px) {
          /* no sticky on single-column layout */
          .pd-gallery { position: static; }
        }
        @media (max-width: 599px) {
          .pd-gallery {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }
          .pd-thumbs { grid-row: 2; flex-direction: row !important; overflow-x: auto; padding-bottom: 4px; }
          .pd-thumb  { width: 60px !important; height: 60px !important; flex-shrink: 0; }
        }

        .pd-thumbs {
          display: flex; flex-direction: column; gap: 8px;
        }
        .pd-thumb {
          width: 76px; height: 76px; overflow: hidden;
          border: 2px solid transparent; cursor: pointer;
          transition: border-color .18s, opacity .18s;
          background: var(--gray); flex-shrink: 0;
        }
        .pd-thumb img {
          width: 100%; height: 100%; object-fit: cover;
          opacity: .65; transition: opacity .2s;
        }
        .pd-thumb:hover img { opacity: .9; }
        .pd-thumb.on { border-color: var(--accent); }
        .pd-thumb.on img { opacity: 1; }

        /* MAIN IMAGE — constrained height so it doesn't dominate */
        .pd-img-wrap {
          position: relative; overflow: hidden;
          background: var(--gray);
          /* key: fixed max-height so image never towers */
          max-height: 520px; aspect-ratio: 1;
        }
        .pd-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          transition: transform .5s ease;
          display: block;
        }
        .pd-img-wrap:hover img { transform: scale(1.03); }

        /* image overlay badges */
        .pd-img-badges {
          position: absolute; top: 12px; left: 12px;
          display: flex; flex-direction: column; gap: 4px; z-index: 2;
        }
        .pdb {
          font-family: 'Bebas Neue', sans-serif; font-size: 10px;
          letter-spacing: 2px; padding: 3px 9px;
        }
        .pdb-new  { background: var(--accent); color: var(--white); }
        .pdb-hot  { background: var(--white);  color: var(--black); }
        .pdb-sale { background: #22c55e; color: #0a0a0a; }

        /* share button */
        .pd-share {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          background: rgba(10,10,10,.68); border: 1px solid rgba(255,255,255,.1);
          width: 44px; height: 44px; border-radius: 0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--dim);
          transition: background .2s, color .2s;
          backdrop-filter: blur(6px);
        }
        .pd-share:hover { background: var(--mid); color: var(--white); }

        /* ── INFO PANEL ── */
        .pd-info { display: flex; flex-direction: column; gap: 0; }

        /* category + condition row */
        .pd-meta-top {
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
        }
        .pd-cat-tag, .pd-cond-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          padding: 3px 10px;
        }
        .pd-cat-tag {
          background: rgba(255,45,0,.1); border: 1px solid rgba(255,45,0,.25); color: var(--accent);
        }
        .pd-cond-tag {
          background: var(--mid); border: 1px solid rgba(255,255,255,.08); color: var(--dim);
        }

        /* product name */
        .pd-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 4vw, 46px);
          line-height: .96; letter-spacing: -1px; color: var(--white);
          margin-bottom: 6px;
        }

        /* brand + rating row */
        .pd-brand-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .pd-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .pd-stars {
          display: flex; align-items: center; gap: 3px; color: #f59e0b;
        }
        .pd-rating-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: 1px;
        }

        /* divider */
        .pd-rule { border: none; border-top: 1px solid rgba(255,255,255,.07); margin: 18px 0; }

        /* price */
        .pd-price-row {
          display: flex; align-items: baseline; gap: 12px;
          flex-wrap: wrap; margin-bottom: 6px;
        }
        .pd-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px; letter-spacing: 1px; color: var(--white); line-height: 1;
        }
        .pd-orig {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; color: var(--dim); text-decoration: line-through;
        }
        .pd-pct {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          color: #22c55e;
          background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.22);
          padding: 3px 10px;
        }
        .pd-price-note {
          font-size: 12px; font-weight: 300; color: var(--dim); margin-bottom: 20px;
        }

        /* SIZE */
        .pd-size-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pd-size-label span { color: var(--white); }
        .pd-size-label a {
          font-size: 10px; color: var(--accent); text-decoration: none; letter-spacing: 1px;
          transition: opacity .2s;
        }
        .pd-size-label a:hover { opacity: .7; }

        .pd-size-grid {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;
        }
        .pd-sz {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          background: var(--mid); color: var(--dim);
          border: 1px solid rgba(255,255,255,.08);
          padding: 12px 13px; cursor: pointer; min-width: 46px; min-height: 44px;
          text-align: center;
          clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
          transition: all .15s;
        }
        .pd-sz:hover { border-color: rgba(255,255,255,.25); color: var(--white); }
        .pd-sz.on { background: var(--accent); border-color: var(--accent); color: var(--white); }

        .pd-size-err {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 12px; margin-top: 4px;
          display: flex; align-items: center; gap: 6px;
          animation: shake .3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%  { transform: translateX(-5px); }
          75%  { transform: translateX(5px); }
        }

        /* ACTIONS */
        .pd-actions { display: flex; gap: 8px; margin-top: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .pd-actions .pd-btn-cart { min-width: 140px; }
        @media (max-width: 480px) {
          .pd-actions { flex-direction: column; }
          .pd-actions .pd-btn-save { justify-content: center; }
        }
        .pd-btn-cart {
          flex: 1; font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 14px 18px; cursor: pointer;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .25s; position: relative; overflow: hidden;
        }
        .pd-btn-cart::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.18);
          transform: translateX(-120%) skewX(-15deg); transition: transform .4s ease;
        }
        .pd-btn-cart:hover::after { transform: translateX(120%) skewX(-15deg); }
        .pd-btn-cart:hover { background: #ff5533; transform: translateY(-2px); }
        .pd-btn-cart.done { background: #16a34a; }

        .pd-btn-save {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: transparent; color: var(--dim);
          border: 1px solid rgba(255,255,255,.15); padding: 14px 18px;
          cursor: pointer; display: flex; align-items: center; gap: 7px;
          transition: all .2s; white-space: nowrap; flex-shrink: 0;
        }
        .pd-btn-save:hover { border-color: var(--accent); color: var(--accent); }
        .pd-btn-save.on { border-color: var(--accent); color: var(--accent); }

        /* TRUST STRIP */
        .pd-trust {
          display: flex; gap: 0; flex-wrap: wrap;
          border: 1px solid rgba(255,255,255,.07);
          margin-bottom: 24px;
        }
        .pd-trust-item {
          flex: 1; min-width: 120px;
          display: flex; align-items: center; gap: 8px; padding: 12px 14px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--dim); border-right: 1px solid rgba(255,255,255,.07);
        }
        .pd-trust-item:last-child { border-right: none; }
        .pd-trust-item svg { color: var(--accent); flex-shrink: 0; }

        /* SELLER CARD */
        .pd-seller {
          display: flex; align-items: center; gap: 14px;
          background: var(--gray); padding: 14px 16px;
          border: 1px solid rgba(255,255,255,.07);
          margin-bottom: 24px;
          transition: border-color .2s;
        }
        .pd-seller:hover { border-color: rgba(255,255,255,.12); }
        .pd-seller-av {
          width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
          background: var(--mid); border: 2px solid rgba(255,45,0,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--accent);
        }
        .pd-seller-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--white); margin-bottom: 3px;
        }
        .pd-seller-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .pd-seller-stars { display: flex; gap: 2px; color: #f59e0b; }
        .pd-seller-meta {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: 1px;
        }
        .pd-seller-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent); text-decoration: none; transition: opacity .2s;
          margin-left: auto; white-space: nowrap; flex-shrink: 0;
          display: flex; align-items: center; gap: 4px;
        }
        .pd-seller-link:hover { opacity: .7; }

        /* TABS (description / shipping / returns) */
        .pd-tabs {
          display: flex; border-bottom: 1px solid rgba(255,255,255,.07);
          margin-bottom: 16px; overflow-x: auto;
        }
        .pd-tab {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); padding: 12px 14px; cursor: pointer;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: all .2s; background: transparent; border-top: none;
          border-left: none; border-right: none; white-space: nowrap; flex-shrink: 0;
        }
        .pd-tab:hover { color: var(--white); }
        .pd-tab.on { color: var(--white); border-bottom-color: var(--accent); }

        .pd-tab-body {
          font-size: 13px; font-weight: 300; line-height: 1.8;
          color: rgba(245,245,240,.65); min-height: 64px;
        }
        .pd-tab-body ul { padding-left: 16px; }
        .pd-tab-body li { margin-bottom: 4px; }

        /* ── SECTION TITLES ── */
        .pd-sec {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .pd-sec-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; letter-spacing: 4px; color: var(--white);
        }
        .pd-sec-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent); text-decoration: none; transition: opacity .2s;
          display: flex; align-items: center; gap: 4px;
        }
        .pd-sec-link:hover { opacity: .7; }

        /* ── SIMILAR PRODUCTS ── */
        .pd-similar {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
          gap: 3px;
          margin-bottom: 72px;
        }

        /* reuse same card style as ShopPage */
        .pd-card {
          background: var(--gray); display: flex; flex-direction: column;
          text-decoration: none; overflow: hidden;
          position: relative; transition: transform .28s cubic-bezier(.4,0,.2,1);
          animation: pdIn .4s ease both;
        }
        @keyframes pdIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pd-card:hover { transform: translateY(-4px); }
        .pd-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--accent); transform:scaleX(0); transform-origin:left;
          transition:transform .3s ease; z-index:1;
        }
        .pd-card:hover::before { transform:scaleX(1); }

        .pd-card-img { width:100%; aspect-ratio:1; overflow:hidden; background:var(--mid); }
        .pd-card-img img {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.82) saturate(.75);
          transition:transform .5s ease, filter .3s;
          display:block;
        }
        .pd-card:hover .pd-card-img img { transform:scale(1.07); filter:brightness(.95) saturate(1); }

        .pd-card-body { padding:13px 12px; flex:1; display:flex; flex-direction:column; }
        .pd-card-cond {
          font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; color:var(--dim); margin-bottom:3px;
        }
        .pd-card-name {
          font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700;
          color:var(--white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          margin-bottom:2px;
        }
        .pd-card-brand { font-size:12px; font-weight:300; color:var(--dim); margin-bottom:10px; }
        .pd-card-price {
          font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--white);
          margin-top:auto; margin-bottom:10px;
        }
        .pd-card-btn {
          width:100%; padding:9px; font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          background:var(--accent); color:var(--white); border:none; cursor:pointer;
          clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          display:flex; align-items:center; justify-content:center; gap:5px;
          transition:background .2s;
        }
        .pd-card-btn:hover { background:#ff5533; }

        /* ── REVIEW SUMMARY ── */
        .pd-rev-summary {
          display: flex; align-items: center; gap: 28px; flex-wrap: wrap;
          padding: 20px 0; margin-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .pd-rev-big {
          text-align: center;
        }
        .pd-rev-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px; line-height: 1; color: var(--white);
        }
        .pd-rev-stars { display: flex; gap: 3px; color: #f59e0b; justify-content: center; margin: 4px 0 4px; }
        .pd-rev-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: 1px;
        }
        .pd-rev-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 180px; }
        .pd-rev-bar-row {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); letter-spacing: 1px;
        }
        .pd-rev-bar-track {
          flex: 1; height: 4px; background: var(--mid); position: relative;
        }
        .pd-rev-bar-fill { position: absolute; left: 0; top: 0; height: 100%; background: #f59e0b; }
        .pd-rev-bar-pct {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; color: var(--dim); min-width: 28px; text-align: right;
        }

        /* REVIEW CARDS */
        .pd-revs {
          display: grid; grid-template-columns: 1fr;
          gap: 3px; margin-bottom: 16px;
        }
        @media (min-width: 768px) { .pd-revs { grid-template-columns: repeat(3,1fr); } }

        .pd-rev {
          background: var(--gray); padding: 22px 20px;
          border-top: 2px solid rgba(255,255,255,.05);
          transition: border-color .3s;
        }
        .pd-rev:hover { border-color: var(--accent); }
        .pd-rev-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .pd-rev-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--white);
        }
        .pd-rev-verified {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: #22c55e; display: flex; align-items: center; gap: 4px;
        }
        .pd-rev-rating { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 12px; }
        .pd-rev-text {
          font-size: 13px; font-weight: 300; line-height: 1.75;
          color: rgba(245,245,240,.65); margin-bottom: 16px;
        }
        .pd-rev-date {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim);
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="pd">

        {/* ── BREADCRUMB ── */}
        <nav className="pd-crumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span className="pd-crumb-sep">›</span>
          <Link to="/shop">Marketplace</Link>
          <span className="pd-crumb-sep">›</span>
          <Link to={`/shop/${product.category.toLowerCase()}`}>{product.category}</Link>
          <span className="pd-crumb-sep">›</span>
          <span className="pd-crumb-cur">{product.title}</span>
        </nav>

        {/* ── PRODUCT GRID ── */}
        <div className="pd-grid">

          {/* ── GALLERY ── */}
          <div className="pd-gallery">
            {/* thumbnails */}
            <div className="pd-thumbs">
              {thumbs.map((src, i) => (
                <div
                  key={i}
                  className={`pd-thumb ${activeImg === i ? "on" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>

            {/* main image */}
            <div className="pd-img-wrap">
              <img src={thumbs[activeImg]} alt={product.title} />
              <div className="pd-img-badges">
                {product.original_price && <span className="pdb pdb-sale">SALE</span>}
              </div>
              <button className="pd-share" aria-label="Share"><Share2 size={14} /></button>
            </div>
          </div>

          {/* ── INFO ── */}
          <div className="pd-info" style={{ animation: "fadeUp .5s ease .1s both" }}>

            {/* top meta */}
            <div className="pd-meta-top">
              <span className="pd-cat-tag">{product.category}</span>
              <span className="pd-cond-tag">{product.condition}</span>
            </div>

            {/* name */}
            <h1 className="pd-name">{product.title}</h1>

            {/* brand + stars */}
            <div className="pd-brand-row">
              <span className="pd-brand">{product.brand}</span>
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="pd-rating-count">4.8 · 47 reviews</span>
            </div>

            <hr className="pd-rule" />

            {/* price */}
            <div className="pd-price-row">
              <span className="pd-price">R{product.price}</span>
              {product.original_price && (
                <>
                  <span className="pd-orig">R{product.original_price}</span>
                  {savePct !== null && <span className="pd-pct">Save {savePct}%</span>}
                </>
              )}
            </div>
            <p className="pd-price-note">Free shipping on orders over $150</p>

            <hr className="pd-rule" />

            {/* sizes */}
            <div className="pd-size-label">
              <span>Size (US) {selectedSize && <span>— {selectedSize}</span>}</span>
              <a href="#">Size guide</a>
            </div>
            <div className="pd-size-grid">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`pd-sz ${selectedSize === s ? "on" : ""}`}
                  onClick={() => { setSize(s); setSizeError(false); }}
                >{s}</button>
              ))}
            </div>
            {sizeError && (
              <div className="pd-size-err">
                <span>⚠</span> Please select a size first
              </div>
            )}

            {/* CTA buttons */}
            <div className="pd-actions">
              <button
                className={`pd-btn-cart ${added ? "done" : ""}`}
                onClick={handleAddCart}
              >
                {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                className="pd-btn-cart"
                style={{ background: "var(--mid)", border: "1px solid rgba(255,255,255,.15)" }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <button
                className={`pd-btn-save ${saved ? "on" : ""}`}
                onClick={() => setSaved(s => !s)}
              >
                <Heart size={14} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            {/* trust strip */}
            <div className="pd-trust">
              <div className="pd-trust-item"><Shield size={12} /> Verified</div>
              <div className="pd-trust-item"><Truck size={12} /> Fast Ship</div>
              <div className="pd-trust-item"><RotateCcw size={12} /> Returns</div>
            </div>

            {/* seller */}
            <div className="pd-seller">
              <div className="pd-seller-av">{SELLER.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div className="pd-seller-name">{SELLER.name}</div>
                <div className="pd-seller-row">
                  <div className="pd-seller-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < Math.floor(SELLER.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="pd-seller-meta">{SELLER.rating} · {SELLER.sales} sales · Since {SELLER.joined}</span>
                </div>
              </div>
              <Link to={`/seller/${SELLER.name}`} className="pd-seller-link">
                View <ChevronRight size={11} />
              </Link>
            </div>

            {/* description tabs */}
            <div className="pd-tabs">
              {(["desc","shipping","returns"] as const).map(t => (
                <button
                  key={t}
                  className={`pd-tab ${activeTab === t ? "on" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === "desc" ? "Description" : t === "shipping" ? "Shipping" : "Returns"}
                </button>
              ))}
            </div>
            <div className="pd-tab-body">
              {activeTab === "desc" && (
                <p>
                  The <strong style={{color:"var(--white)"}}>{product.title}</strong> by {product.brand} — in {product.condition.toLowerCase()} condition.
                  {product.description
                    ? <> {product.description}</>
                    : <> A cornerstone of the streetwear scene, this pair delivers an iconic silhouette with premium materials.</>}
                  Verified authentic by our team. Every pair is inspected before listing. What you see is exactly what you get.
                </p>
              )}
              {activeTab === "shipping" && (
                <ul>
                  <li>Standard delivery: 3–5 business days</li>
                  <li>Express delivery: 1–2 business days</li>
                  <li>Free shipping on orders over $150</li>
                  <li>Tracked & insured on all orders</li>
                </ul>
              )}
              {activeTab === "returns" && (
                <ul>
                  <li>14-day returns on all items</li>
                  <li>Item must be in original condition</li>
                  <li>Return shipping covered by buyer</li>
                  <li>Refund processed within 3–5 days</li>
                </ul>
              )}
            </div>

          </div>
        </div>

        {/* ── SIMILAR PRODUCTS ── */}
        {similar.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div className="pd-sec">
              <span className="pd-sec-title">Similar Drops</span>
              <Link to={`/shop/${product.category.toLowerCase()}`} className="pd-sec-link">
                View All <ChevronRight size={11} />
              </Link>
            </div>
            <div className="pd-similar">
              {similar.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="pd-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="pd-card-img">
                    <img src={p.images?.[0] ?? "/assets/placeholder.jpg"} alt={p.title} loading="lazy" />
                  </div>
                  <div className="pd-card-body">
                    <div className="pd-card-cond">{p.condition} · {p.category}</div>
                    <div className="pd-card-name">{p.title}</div>
                    <div className="pd-card-brand">{p.brand}</div>
                    <div className="pd-card-price">R{p.price}</div>
                    <button className="pd-card-btn" onClick={e => e.preventDefault()}>
                      <ShoppingBag size={11} /> Add
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── REVIEWS ── */}
        <section>
          <div className="pd-sec">
            <span className="pd-sec-title">Customer Reviews</span>
            <span style={{
              fontFamily:"'Barlow Condensed',sans-serif", fontSize:11,
              color:"var(--dim)", letterSpacing:2, textTransform:"uppercase"
            }}>
              {MOCK_REVIEWS.length} Reviews
            </span>
          </div>

          {/* rating summary */}
          <div className="pd-rev-summary">
            <div className="pd-rev-big">
              <div className="pd-rev-score">4.8</div>
              <div className="pd-rev-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <div className="pd-rev-count">47 reviews</div>
            </div>
            <div className="pd-rev-bars">
              {[
                { stars: 5, pct: 76 },
                { stars: 4, pct: 16 },
                { stars: 3, pct: 5  },
                { stars: 2, pct: 2  },
                { stars: 1, pct: 1  },
              ].map(row => (
                <div key={row.stars} className="pd-rev-bar-row">
                  <span>{row.stars}★</span>
                  <div className="pd-rev-bar-track">
                    <div className="pd-rev-bar-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="pd-rev-bar-pct">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-revs">
            {MOCK_REVIEWS.map(r => (
              <div key={r.id} className="pd-rev">
                <div className="pd-rev-head">
                  <span className="pd-rev-name">{r.name}</span>
                  {r.verified && (
                    <span className="pd-rev-verified"><Check size={10} /> Verified</span>
                  )}
                </div>
                <div className="pd-rev-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="pd-rev-text">"{r.comment}"</p>
                <div className="pd-rev-date">{r.date}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}