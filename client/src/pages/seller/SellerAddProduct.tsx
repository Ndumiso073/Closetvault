import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload, X, Star, ChevronDown, Plus, Minus,
  AlertCircle, Check, Eye, Save, Send,
  Package, Tag, Truck, ImageIcon, DollarSign,
  BarChart2, Layers, ArrowLeft, Info
} from "lucide-react";

/* ─── TYPES ───────────────────────────────────── */
type ProductStatus = "active" | "draft" | "out_of_stock";
type Gender = "men" | "women" | "unisex";
type Condition = "new_tags" | "new_no_tags" | "used_like_new" | "used_good" | "used_fair";
type Currency = "ZAR" | "USD" | "EUR" | "GBP";

interface ImageFile { id: string; url: string; file: File; isMain: boolean; }
interface FormErrors { [key: string]: string; }

/* ─── CONFIG ─────────────────────────────────── */
const CATEGORIES  = ["Sneakers","Hoodies","T-Shirts","Jackets","Pants","Caps","Bags","Accessories","Watches","Jewellery"];
const CONDITIONS  = [
  { value:"new_tags",      label:"New with Tags",      desc:"Brand new, original tags attached"  },
  { value:"new_no_tags",   label:"New without Tags",   desc:"New condition, tags removed"         },
  { value:"used_like_new", label:"Used — Like New",    desc:"Worn once or twice, no visible wear" },
  { value:"used_good",     label:"Used — Good",        desc:"Light signs of wear"                 },
  { value:"used_fair",     label:"Used — Fair",        desc:"Visible wear, still functional"      },
];
const GENDERS     = [{ value:"men",label:"Men" },{ value:"women",label:"Women" },{ value:"unisex",label:"Unisex" }];
const CURRENCIES  = ["ZAR","USD","EUR","GBP"];
const SHOE_SIZES  = ["4","5","6","7","8","9","10","11","12","13","14"];
const CLOTHING_SIZES = ["XS","S","M","L","XL","XXL","XXXL"];
const COLORS      = ["Black","White","Red","Blue","Green","Yellow","Orange","Purple","Pink","Grey","Brown","Beige","Navy","Olive"];
const SHIPPING    = [{ value:"standard",label:"Standard (3–5 days)" },{ value:"express",label:"Express (1–2 days)" },{ value:"overnight",label:"Overnight" }];
const REGIONS     = ["Nationwide","Gauteng Only","Western Cape Only","KwaZulu-Natal Only","Local Pickup Only"];
const STATUS_META: Record<ProductStatus, { label:string; color:string; bg:string }> = {
  active:       { label:"Active",       color:"#22c55e", bg:"rgba(34,197,94,.13)"  },
  draft:        { label:"Draft",        color:"#f59e0b", bg:"rgba(245,158,11,.13)" },
  out_of_stock: { label:"Out of Stock", color:"#ff2d00", bg:"rgba(255,45,0,.13)"   },
};

/* ─── SECTION WRAPPER ────────────────────────── */
function Section({ id, icon: Icon, title, children, accent = false }:
  { id?:string; icon:React.FC<any>; title:string; children:React.ReactNode; accent?:boolean }) {
  return (
    <div className="sap-section" id={id}>
      <div className="sap-section-header">
        <div className="sap-section-icon" style={accent ? { background:"rgba(255,45,0,.12)", border:"1px solid rgba(255,45,0,.25)" } : {}}>
          <Icon size={14} color={accent ? "var(--accent)" : "var(--dim)"} />
        </div>
        <div className="sap-section-title">{title}</div>
      </div>
      <div className="sap-section-body">{children}</div>
    </div>
  );
}

/* ─── FIELD WRAPPER ──────────────────────────── */
function Field({ label, required, error, hint, children }:
  { label:string; required?:boolean; error?:string; hint?:string; children:React.ReactNode }) {
  return (
    <div className="sap-field">
      <label className="sap-label">
        {label}{required && <span className="sap-required">*</span>}
      </label>
      {children}
      {hint  && !error && <div className="sap-hint">{hint}</div>}
      {error && <div className="sap-error"><AlertCircle size={11}/> {error}</div>}
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────── */
export default function SellerAddProduct() {
  const navigate  = useNavigate();
  const fileRef   = useRef<HTMLInputElement>(null);
  const dropRef   = useRef<HTMLDivElement>(null);

  /* form state */
  const [name,        setName]        = useState("");
  const [brand,       setBrand]       = useState("");
  const [category,    setCategory]    = useState("");
  const [gender,      setGender]      = useState<Gender>("unisex");
  const [condition,   setCondition]   = useState<Condition>("new_tags");
  const [description, setDescription] = useState("");
  const [sku,         setSku]         = useState("");

  const [images,      setImages]      = useState<ImageFile[]>([]);
  const [dragging,    setDragging]    = useState(false);

  const [currency,    setCurrency]    = useState<Currency>("ZAR");
  const [price,       setPrice]       = useState("");
  const [salePrice,   setSalePrice]   = useState("");

  const [stock,       setStock]       = useState("1");
  const [status,      setStatus]      = useState<ProductStatus>("draft");

  const [selectedSizes,  setSelectedSizes]  = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customSize,     setCustomSize]     = useState("");
  const [customColor,    setCustomColor]    = useState("");

  const [tags,        setTags]        = useState<string[]>([]);
  const [tagInput,    setTagInput]    = useState("");

  const [weight,      setWeight]      = useState("");
  const [shipping,    setShipping]    = useState("standard");
  const [region,      setRegion]      = useState("Nationwide");

  const [errors,      setErrors]      = useState<FormErrors>({});
  const [saving,      setSaving]      = useState(false);
  const [publishing,  setPublishing]  = useState(false);
  const [success,     setSuccess]     = useState<"draft"|"published"|null>(null);
  const [preview,     setPreview]     = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [curOpen,     setCurOpen]     = useState(false);

  /* discount calc */
  const discount = price && salePrice
    ? Math.round((1 - parseFloat(salePrice) / parseFloat(price)) * 100)
    : 0;

  /* ── IMAGE HANDLERS ── */
  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImgs: ImageFile[] = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 8 - images.length)
      .map(f => ({ id: Math.random().toString(36).slice(2), url: URL.createObjectURL(f), file: f, isMain: false }));
    setImages(prev => {
      const merged = [...prev, ...newImgs];
      if (merged.length > 0 && !merged.some(i => i.isMain)) merged[0].isMain = true;
      return merged;
    });
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages(prev => {
      const next = prev.filter(i => i.id !== id);
      if (next.length > 0 && !next.some(i => i.isMain)) next[0].isMain = true;
      return next;
    });
  };

  const setMain = (id: string) => setImages(prev => prev.map(i => ({ ...i, isMain: i.id === id })));

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addImages(e.dataTransfer.files);
  }, [addImages]);

  /* ── VARIANTS ── */
  const toggleSize  = (s: string) => setSelectedSizes(p  => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const toggleColor = (c: string) => setSelectedColors(p => p.includes(c) ? p.filter(x=>x!==c) : [...p, c]);

  const addCustomSize = () => {
    const v = customSize.trim().toUpperCase();
    if (v && !selectedSizes.includes(v)) { setSelectedSizes(p => [...p, v]); setCustomSize(""); }
  };
  const addCustomColor = () => {
    const v = customColor.trim();
    if (v && !selectedColors.includes(v)) { setSelectedColors(p => [...p, v]); setCustomColor(""); }
  };

  /* ── TAGS ── */
  const addTag = () => {
    const v = tagInput.trim().toLowerCase().replace(/\s+/g,"-");
    if (v && !tags.includes(v) && tags.length < 20) { setTags(p => [...p, v]); setTagInput(""); }
  };
  const removeTag = (t: string) => setTags(p => p.filter(x => x !== t));

  /* ── VALIDATION ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim())     e.name     = "Product name is required";
    if (!brand.trim())    e.brand    = "Brand is required";
    if (!category)        e.category = "Category is required";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)
                          e.price    = "Valid price is required";
    if (salePrice && parseFloat(salePrice) >= parseFloat(price))
                          e.salePrice = "Sale price must be lower than regular price";
    if (images.length === 0) e.images = "At least one product image is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = document.querySelector(".sap-error");
      first?.scrollIntoView({ behavior:"smooth", block:"center" });
    }
    return Object.keys(e).length === 0;
  };

  /* ── SUBMIT ── */
  const handleSaveDraft = () => {
    setErrors({});
    setSaving(true);
    setTimeout(() => { setSaving(false); setSuccess("draft"); }, 1200);
  };

  const handlePublish = () => {
    if (!validate()) return;
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setSuccess("published"); }, 1600);
  };

  /* ── SUCCESS SCREEN ── */
  if (success) return (
    <>
      <style>{`
        .sap-success {
          min-height:80vh; display:flex; flex-direction:column;
          align-items:center; justify-content:center; text-align:center;
          padding:40px 20px; animation:sap-in .5s ease;
        }
        .sap-success-ring {
          width:80px; height:80px; border-radius:50%;
          border:2px solid ${success==="published" ? "var(--accent)" : "#f59e0b"};
          display:flex; align-items:center; justify-content:center;
          margin-bottom:24px; position:relative;
          animation:sap-pulse-ring 2s ease-in-out infinite;
        }
        @keyframes sap-pulse-ring {
          0%,100%{box-shadow:0 0 0 0 ${success==="published"?"rgba(255,45,0,.3)":"rgba(245,158,11,.3)"}}
          50%{box-shadow:0 0 0 16px transparent}
        }
        .sap-success-title { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:3px; color:var(--white); margin-bottom:8px; }
        .sap-success-sub { font-family:'Barlow Condensed',sans-serif; font-size:14px; color:var(--dim); letter-spacing:1px; margin-bottom:28px; }
        .sap-success-actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        @keyframes sap-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div className="sap-success">
        <div className="sap-success-ring">
          {success === "published"
            ? <Check size={32} color="var(--accent)" />
            : <Save size={28} color="#f59e0b" />}
        </div>
        <div className="sap-success-title">
          {success === "published" ? "Product Published!" : "Saved as Draft"}
        </div>
        <div className="sap-success-sub">
          {success === "published"
            ? `${name || "Your product"} is now live on ClosetVault`
            : `${name || "Your product"} has been saved. You can publish it anytime.`}
        </div>
        <div className="sap-success-actions">
          <Link to="/seller/products" className="sap-btn sap-btn-primary">View All Products</Link>
          <button className="sap-btn sap-btn-ghost" onClick={() => { setSuccess(null); }}>Add Another</button>
        </div>
      </div>
    </>
  );

  /* ── PREVIEW PANEL ── */
  const PreviewPanel = () => {
    const mainImg = images.find(i => i.isMain) || images[0];
    const sm = STATUS_META[status];
    return (
      <div className="sap-preview-backdrop" onClick={() => setPreview(false)}>
        <div className="sap-preview-panel" onClick={e => e.stopPropagation()}>
          <div className="sap-preview-header">
            <div className="sap-preview-title">Product Preview</div>
            <button className="sap-preview-close" onClick={() => setPreview(false)}><X size={16}/></button>
          </div>
          <div className="sap-preview-body">
            <div className="sap-preview-img">
              {mainImg
                ? <img src={mainImg.url} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,color:"var(--dim)"}}>
                    <ImageIcon size={32}/><span style={{fontFamily:"'Barlow Condensed'",fontSize:11,letterSpacing:2}}>NO IMAGE</span>
                  </div>}
            </div>
            <div className="sap-preview-info">
              <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                {category && <span className="sap-cat-chip">{category}</span>}
                {gender   && <span className="sap-cat-chip">{gender}</span>}
                <span className="sap-status-chip" style={{color:sm.color,background:sm.bg}}>{sm.label}</span>
              </div>
              <div className="sap-preview-name">{name || "Product Name"}</div>
              <div className="sap-preview-brand">{brand || "Brand"}</div>
              <div className="sap-preview-price-row">
                <span className="sap-preview-price">{currency} {parseFloat(price||"0").toLocaleString() || "0"}</span>
                {salePrice && <span className="sap-preview-sale">{currency} {parseFloat(salePrice).toLocaleString()}</span>}
                {discount > 0 && <span className="sap-preview-disc">-{discount}%</span>}
              </div>
              {description && <p className="sap-preview-desc">{description}</p>}
              {selectedSizes.length > 0 && (
                <div className="sap-preview-sizes">
                  <div className="sap-preview-label">SIZES</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                    {selectedSizes.map(s => <span key={s} className="sap-size-chip">{s}</span>)}
                  </div>
                </div>
              )}
              {selectedColors.length > 0 && (
                <div className="sap-preview-sizes" style={{marginTop:10}}>
                  <div className="sap-preview-label">COLORS</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                    {selectedColors.map(c => <span key={c} className="sap-size-chip">{c}</span>)}
                  </div>
                </div>
              )}
              {tags.length > 0 && (
                <div style={{marginTop:12,display:"flex",gap:4,flexWrap:"wrap"}}>
                  {tags.map(t => <span key={t} className="sap-tag-preview">#{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        :root { --border:rgba(255,255,255,.07); --pad-m:16px; --pad-t:32px; --pad-d:48px; }

        .sap-page {
          min-height:100vh; background:var(--black);
          padding:0 var(--pad-m) 80px;
          animation:sap-in .45s ease both;
        }
        @media(min-width:768px)  { .sap-page { padding:0 var(--pad-t) 80px; } }
        @media(min-width:1024px) { .sap-page { padding:0 var(--pad-d) 80px; } }
        @keyframes sap-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ── HEADER ── */
        .sap-header {
          padding:28px 0 22px; border-bottom:1px solid var(--border);
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:14px; flex-wrap:wrap;
        }
        .sap-eyebrow {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
          color:var(--accent); margin-bottom:5px;
          display:flex; align-items:center; gap:8px;
        }
        .sap-eyebrow::before { content:''; width:16px; height:1px; background:var(--accent); }
        .sap-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(24px,5vw,40px); letter-spacing:2px; line-height:.95; color:var(--white);
        }
        .sap-title span { color:var(--accent); }
        .sap-subtitle { font-family:'Barlow Condensed',sans-serif; font-size:13px; color:var(--dim); margin-top:5px; }
        .sap-header-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }

        /* ── BUTTONS ── */
        .sap-btn {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border:none; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:6px;
          padding:10px 16px; height:40px; transition:all .2s; white-space:nowrap;
        }
        .sap-btn-primary {
          background:var(--accent); color:var(--white);
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          position:relative; overflow:hidden;
        }
        .sap-btn-primary::after {
          content:''; position:absolute; inset:0; background:rgba(255,255,255,.16);
          transform:translateX(-110%) skewX(-15deg); transition:transform .35s;
        }
        .sap-btn-primary:hover::after { transform:translateX(110%) skewX(-15deg); }
        .sap-btn-primary:hover { background:#ff5533; }
        .sap-btn-primary:disabled { opacity:.5; pointer-events:none; }
        .sap-btn-ghost { background:transparent; color:var(--dim); border:1px solid var(--border); }
        .sap-btn-ghost:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .sap-btn-draft { background:var(--mid); color:var(--white); border:1px solid var(--border); }
        .sap-btn-draft:hover { border-color:rgba(255,255,255,.2); }
        .sap-btn-preview { background:transparent; color:var(--dim); border:1px solid var(--border); }
        .sap-btn-preview:hover { color:var(--accent); border-color:rgba(255,45,0,.4); }

        /* ── LAYOUT ── */
        .sap-layout {
          display:grid; grid-template-columns:1fr;
          gap:3px; margin-top:24px;
        }
        @media(min-width:1024px) { .sap-layout { grid-template-columns:1fr 300px; gap:24px; } }

        /* ── SECTION ── */
        .sap-section {
          background:var(--gray); margin-bottom:3px;
          animation:sap-in .4s ease both;
        }
        .sap-section-header {
          display:flex; align-items:center; gap:10px;
          padding:16px 20px 14px; border-bottom:1px solid var(--border);
        }
        .sap-section-icon {
          width:32px; height:32px; background:var(--mid);
          display:flex; align-items:center; justify-content:center;
          clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);
          flex-shrink:0;
        }
        .sap-section-title {
          font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:4px; color:var(--white);
        }
        .sap-section-body { padding:20px; display:flex; flex-direction:column; gap:16px; }

        /* ── FORM ELEMENTS ── */
        .sap-field { display:flex; flex-direction:column; gap:6px; }
        .sap-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--dim);
        }
        .sap-required { color:var(--accent); margin-left:3px; }
        .sap-hint { font-family:'Barlow Condensed',sans-serif; font-size:11px; color:rgba(255,255,255,.28); letter-spacing:.5px; }
        .sap-error {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:1px; color:#ff6b6b;
          display:flex; align-items:center; gap:5px;
        }

        .sap-input {
          background:var(--mid); border:1px solid var(--border); color:var(--white);
          font-family:'Barlow',sans-serif; font-size:14px;
          padding:11px 14px; outline:none; width:100%; transition:border-color .2s;
        }
        .sap-input:focus { border-color:var(--accent); }
        .sap-input::placeholder { color:rgba(255,255,255,.25); font-size:13px; }
        .sap-input.err { border-color:#ff6b6b; }

        .sap-textarea {
          background:var(--mid); border:1px solid var(--border); color:var(--white);
          font-family:'Barlow',sans-serif; font-size:14px; line-height:1.7;
          padding:11px 14px; outline:none; width:100%; resize:vertical; min-height:110px;
          transition:border-color .2s;
        }
        .sap-textarea:focus { border-color:var(--accent); }
        .sap-textarea::placeholder { color:rgba(255,255,255,.25); }
        .sap-textarea.err { border-color:#ff6b6b; }

        /* grid fields */
        .sap-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:480px) { .sap-grid2 { grid-template-columns:1fr; } }
        .sap-grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        @media(max-width:580px) { .sap-grid3 { grid-template-columns:1fr 1fr; } }

        /* custom select */
        .sap-select-wrap { position:relative; }
        .sap-select-btn {
          background:var(--mid); border:1px solid var(--border); color:var(--white);
          font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px;
          padding:11px 14px; width:100%; cursor:pointer;
          display:flex; align-items:center; justify-content:space-between;
          transition:border-color .2s;
        }
        .sap-select-btn:focus, .sap-select-btn.open { border-color:var(--accent); outline:none; }
        .sap-select-btn.err { border-color:#ff6b6b; }
        .sap-select-btn .placeholder { color:rgba(255,255,255,.25); }
        .sap-dropdown {
          position:absolute; left:0; right:0; top:calc(100% + 2px);
          background:var(--mid); border:1px solid var(--border);
          z-index:200; max-height:240px; overflow-y:auto;
          box-shadow:0 8px 32px rgba(0,0,0,.8);
          animation:sap-dd .15s ease;
        }
        @keyframes sap-dd { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .sap-dropdown::-webkit-scrollbar { width:3px; }
        .sap-dropdown::-webkit-scrollbar-thumb { background:var(--gray); }
        .sap-dd-opt {
          padding:10px 14px; cursor:pointer;
          font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px;
          color:var(--dim); transition:all .15s; border-left:2px solid transparent;
        }
        .sap-dd-opt:hover { color:var(--white); background:rgba(255,255,255,.04); border-left-color:var(--accent); }
        .sap-dd-opt.on { color:var(--accent); border-left-color:var(--accent); }

        /* pill toggles */
        .sap-pill-group { display:flex; gap:6px; flex-wrap:wrap; }
        .sap-pill {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          padding:7px 14px; cursor:pointer; border:1px solid var(--border);
          background:var(--mid); color:var(--dim); transition:all .15s;
        }
        .sap-pill:hover { border-color:rgba(255,255,255,.2); color:var(--white); }
        .sap-pill.on { background:rgba(255,45,0,.1); border-color:rgba(255,45,0,.4); color:var(--accent); }

        /* condition cards */
        .sap-cond-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
        @media(min-width:640px) { .sap-cond-grid { grid-template-columns:repeat(3,1fr); } }
        .sap-cond-card {
          background:var(--mid); border:1px solid var(--border);
          padding:10px 12px; cursor:pointer; transition:all .2s;
        }
        .sap-cond-card:hover { border-color:rgba(255,255,255,.18); }
        .sap-cond-card.on { border-color:rgba(255,45,0,.45); background:rgba(255,45,0,.06); }
        .sap-cond-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:1px; color:var(--white); margin-bottom:2px;
        }
        .sap-cond-card.on .sap-cond-label { color:var(--accent); }
        .sap-cond-desc { font-family:'Barlow Condensed',sans-serif; font-size:10px; color:var(--dim); line-height:1.5; }

        /* ── IMAGE UPLOAD ── */
        .sap-drop-zone {
          border:2px dashed var(--border); padding:32px 20px;
          display:flex; flex-direction:column; align-items:center; gap:10px;
          cursor:pointer; transition:all .2s; text-align:center;
          position:relative;
        }
        .sap-drop-zone.dragging { border-color:var(--accent); background:rgba(255,45,0,.04); }
        .sap-drop-zone:hover { border-color:rgba(255,255,255,.2); }
        .sap-drop-zone.err { border-color:#ff6b6b; }
        .sap-drop-icon {
          width:48px; height:48px; background:var(--mid);
          display:flex; align-items:center; justify-content:center;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
        }
        .sap-drop-title {
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--white);
        }
        .sap-drop-sub { font-family:'Barlow Condensed',sans-serif; font-size:11px; color:var(--dim); }

        .sap-img-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-top:12px;
        }
        @media(max-width:480px) { .sap-img-grid { grid-template-columns:repeat(3,1fr); } }

        .sap-img-card {
          position:relative; aspect-ratio:1; overflow:hidden;
          border:2px solid transparent; transition:border-color .2s;
          cursor:pointer;
        }
        .sap-img-card.main-img { border-color:var(--accent); }
        .sap-img-card img { width:100%; height:100%; object-fit:cover; display:block; }
        .sap-img-overlay {
          position:absolute; inset:0; background:rgba(0,0,0,.65);
          opacity:0; transition:opacity .2s;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
        }
        .sap-img-card:hover .sap-img-overlay { opacity:1; }
        .sap-img-action {
          font-family:'Barlow Condensed',sans-serif;
          font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.2);
          color:var(--white); padding:4px 8px; cursor:pointer; transition:all .15s; border:none;
        }
        .sap-img-action:hover { background:rgba(255,255,255,.25); }
        .sap-img-action.del:hover { background:rgba(255,45,0,.5); }
        .sap-main-badge {
          position:absolute; top:4px; left:4px;
          font-family:'Bebas Neue',sans-serif; font-size:9px; letter-spacing:2px;
          background:var(--accent); color:#fff; padding:2px 5px;
        }

        /* ── PRICE ── */
        .sap-price-row { display:grid; grid-template-columns:80px 1fr; gap:0; }
        .sap-currency-btn {
          background:var(--mid); border:1px solid var(--border); border-right:none;
          color:var(--white); font-family:'Barlow Condensed',sans-serif;
          font-size:13px; font-weight:700; letter-spacing:1px;
          padding:11px 12px; cursor:pointer; white-space:nowrap;
          display:flex; align-items:center; gap:4px; transition:border-color .2s;
        }
        .sap-currency-btn:hover { border-color:var(--accent); }
        .sap-discount-badge {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.25);
          padding:6px 12px; margin-top:8px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:#22c55e;
        }

        /* ── STOCK COUNTER ── */
        .sap-stock-row { display:flex; align-items:center; gap:0; }
        .sap-stock-btn {
          width:40px; height:44px; background:var(--mid); border:1px solid var(--border);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--dim); transition:all .2s; flex-shrink:0;
        }
        .sap-stock-btn:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
        .sap-stock-input {
          flex:1; background:var(--mid); border:1px solid var(--border);
          border-left:none; border-right:none;
          color:var(--white); font-family:'Bebas Neue',sans-serif;
          font-size:22px; letter-spacing:2px; text-align:center;
          padding:8px 0; outline:none; width:100%;
        }

        /* ── STATUS SELECTOR ── */
        .sap-status-opts { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
        .sap-status-opt {
          padding:10px 8px; border:1px solid var(--border); cursor:pointer;
          transition:all .2s; text-align:center; background:var(--mid);
        }
        .sap-status-opt.on { border-color:var(--sc); background:var(--sb); }
        .sap-status-opt-label {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); transition:color .2s;
        }
        .sap-status-opt.on .sap-status-opt-label { color:var(--sc); }
        .sap-status-dot {
          width:6px; height:6px; border-radius:50%; margin:0 auto 6px;
          background:var(--dim); transition:background .2s;
        }
        .sap-status-opt.on .sap-status-dot { background:var(--sc); }

        /* ── TAGS ── */
        .sap-tags-wrap {
          background:var(--mid); border:1px solid var(--border);
          padding:10px 12px; min-height:52px; display:flex; flex-wrap:wrap; gap:6px; align-items:center;
          transition:border-color .2s; cursor:text;
        }
        .sap-tags-wrap:focus-within { border-color:var(--accent); }
        .sap-tag {
          font-family:'Barlow Condensed',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:1px;
          background:rgba(255,45,0,.1); border:1px solid rgba(255,45,0,.25);
          color:var(--accent); padding:3px 8px;
          display:flex; align-items:center; gap:5px;
        }
        .sap-tag-x { background:none; border:none; cursor:pointer; color:var(--accent); display:flex; padding:0; }
        .sap-tag-input {
          background:transparent; border:none; outline:none;
          color:var(--white); font-family:'Barlow',sans-serif; font-size:13px;
          min-width:100px; flex:1;
        }
        .sap-tag-input::placeholder { color:rgba(255,255,255,.25); }

        /* ── CUSTOM VARIANT INPUT ── */
        .sap-custom-row { display:flex; gap:0; margin-top:8px; }
        .sap-custom-input {
          flex:1; background:var(--mid); border:1px solid var(--border); border-right:none;
          color:var(--white); font-family:'Barlow',sans-serif; font-size:13px;
          padding:9px 12px; outline:none; transition:border-color .2s;
        }
        .sap-custom-input:focus { border-color:var(--accent); }
        .sap-custom-add {
          background:var(--mid); border:1px solid var(--border);
          color:var(--dim); padding:9px 14px; cursor:pointer; transition:all .2s;
          display:flex; align-items:center; gap:5px;
          font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
          white-space:nowrap;
        }
        .sap-custom-add:hover { color:var(--white); border-color:rgba(255,255,255,.2); }

        /* ── SIDEBAR ── */
        .sap-sidebar { display:flex; flex-direction:column; gap:3px; }
        @media(min-width:1024px) { .sap-sidebar { position:sticky; top:80px; } }

        /* ── STICKY PUBLISH BAR ── */
        .sap-publish-bar {
          position:sticky; bottom:0; left:0; right:0; z-index:100;
          background:rgba(10,10,10,.96); border-top:1px solid var(--border);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          padding:14px var(--pad-m);
          display:flex; align-items:center; gap:8px; flex-wrap:wrap;
          margin:0 calc(-1 * var(--pad-m));
        }
        @media(min-width:768px) { .sap-publish-bar { padding:14px var(--pad-t); margin:0 calc(-1 * var(--pad-t)); } }
        @media(min-width:1024px) { .sap-publish-bar { padding:14px var(--pad-d); margin:0 calc(-1 * var(--pad-d)); } }
        .sap-publish-info {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:var(--dim); flex:1;
        }
        .sap-publish-info strong { color:var(--white); }

        /* ── PREVIEW MODAL ── */
        .sap-preview-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,.85); z-index:500;
          display:flex; align-items:center; justify-content:flex-end;
          animation:sap-fade .2s ease;
        }
        @keyframes sap-fade { from{opacity:0} to{opacity:1} }
        .sap-preview-panel {
          background:var(--gray); border-left:1px solid var(--border);
          width:min(420px,100vw); height:100vh; overflow-y:auto;
          animation:sap-slide .25s ease;
        }
        @keyframes sap-slide { from{transform:translateX(40px)} to{transform:translateX(0)} }
        .sap-preview-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 20px; border-bottom:1px solid var(--border); position:sticky; top:0;
          background:var(--gray); z-index:2;
        }
        .sap-preview-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:4px; color:var(--white); }
        .sap-preview-close { background:none; border:none; cursor:pointer; color:var(--dim); display:flex; padding:4px; transition:color .2s; }
        .sap-preview-close:hover { color:var(--white); }
        .sap-preview-body { padding:0 0 40px; }
        .sap-preview-img { width:100%; aspect-ratio:1; background:var(--mid); display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .sap-preview-info { padding:20px; }
        .sap-preview-name { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:2px; color:var(--white); line-height:1; margin-bottom:4px; }
        .sap-preview-brand { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:3px; color:var(--dim); text-transform:uppercase; margin-bottom:12px; }
        .sap-preview-price-row { display:flex; align-items:baseline; gap:10px; margin-bottom:12px; flex-wrap:wrap; }
        .sap-preview-price { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:1px; color:var(--white); }
        .sap-preview-sale { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--dim); text-decoration:line-through; }
        .sap-preview-disc { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; background:rgba(255,45,0,.15); color:var(--accent); padding:3px 8px; }
        .sap-preview-desc { font-family:'Barlow',sans-serif; font-size:13px; color:rgba(245,245,240,.65); line-height:1.8; margin-bottom:12px; }
        .sap-preview-label { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--dim); }
        .sap-preview-sizes { margin-top:10px; }
        .sap-cat-chip { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; background:var(--mid); color:var(--dim); padding:3px 8px; }
        .sap-status-chip { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:3px 8px; }
        .sap-size-chip { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; background:var(--mid); color:var(--white); padding:4px 8px; }
        .sap-tag-preview { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; color:rgba(255,45,0,.6); }

        /* spinner */
        .sap-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.2); border-top-color:#fff; border-radius:50%; animation:sap-spin .6s linear infinite; }
        @keyframes sap-spin { to{transform:rotate(360deg)} }

        @media(max-width:480px) {
          .sap-status-opts { grid-template-columns:1fr 1fr; }
          .sap-status-opts > :last-child { grid-column:1/-1; }
        }
      `}</style>

      {preview && <PreviewPanel />}

      <div className="sap-page">

        {/* ── HEADER ── */}
        <div className="sap-header">
          <div>
            <div className="sap-eyebrow">Seller Portal</div>
            <div className="sap-title">ADD NEW <span>PRODUCT</span></div>
            <div className="sap-subtitle">Fill in the details below to list your item on ClosetVault</div>
          </div>
          <div className="sap-header-actions">
            <Link to="/seller/products" className="sap-btn sap-btn-ghost"><ArrowLeft size={13}/> Back</Link>
            <button className="sap-btn sap-btn-preview" onClick={() => setPreview(true)}><Eye size={13}/> Preview</button>
          </div>
        </div>

        <div className="sap-layout">

          {/* ── MAIN COLUMN ── */}
          <div>

            {/* 1. BASIC INFO */}
            <Section icon={Package} title="Basic Information">
              <div className="sap-grid2">
                <Field label="Product Name" required error={errors.name}>
                  <input className={`sap-input ${errors.name?"err":""}`}
                    placeholder="e.g. Air Jordan 1 Retro High OG"
                    value={name} onChange={e => { setName(e.target.value); setErrors(p=>({...p,name:""})); }} />
                </Field>
                <Field label="Brand" required error={errors.brand}>
                  <input className={`sap-input ${errors.brand?"err":""}`}
                    placeholder="e.g. Nike, Adidas, Supreme"
                    value={brand} onChange={e => { setBrand(e.target.value); setErrors(p=>({...p,brand:""})); }} />
                </Field>
              </div>

              <div className="sap-grid2">
                {/* Category dropdown */}
                <Field label="Category" required error={errors.category}>
                  <div className="sap-select-wrap">
                    <button className={`sap-select-btn ${catOpen?"open":""} ${errors.category?"err":""}`}
                      onClick={() => setCatOpen(o=>!o)}>
                      <span className={category?"":"placeholder"}>{category || "Select category"}</span>
                      <ChevronDown size={13}/>
                    </button>
                    {catOpen && (
                      <div className="sap-dropdown">
                        {CATEGORIES.map(c => (
                          <div key={c} className={`sap-dd-opt ${category===c?"on":""}`}
                            onClick={() => { setCategory(c); setCatOpen(false); setErrors(p=>({...p,category:""})); }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="SKU / Product Code" hint="Auto-generated if left empty">
                  <input className="sap-input" placeholder="e.g. NK-AJ1-001"
                    value={sku} onChange={e => setSku(e.target.value)} />
                </Field>
              </div>

              {/* Gender */}
              <Field label="Gender">
                <div className="sap-pill-group">
                  {GENDERS.map(g => (
                    <button key={g.value}
                      className={`sap-pill ${gender===g.value?"on":""}`}
                      onClick={() => setGender(g.value as Gender)}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field label="Description" required error={errors.description}
                hint="Describe the product — condition details, style notes, sizing tips">
                <textarea className={`sap-textarea ${errors.description?"err":""}`}
                  placeholder="Tell buyers what makes this piece special..."
                  value={description}
                  onChange={e => { setDescription(e.target.value); setErrors(p=>({...p,description:""})); }} />
              </Field>
            </Section>

            {/* 2. CONDITION */}
            <Section icon={Star} title="Condition">
              <Field label="Item Condition" required>
                <div className="sap-cond-grid">
                  {CONDITIONS.map(c => (
                    <div key={c.value}
                      className={`sap-cond-card ${condition===c.value?"on":""}`}
                      onClick={() => setCondition(c.value as Condition)}>
                      <div className="sap-cond-label">{c.label}</div>
                      <div className="sap-cond-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </Field>
            </Section>

            {/* 3. IMAGES */}
            <Section icon={ImageIcon} title="Product Images" accent>
              {errors.images && <div className="sap-error" style={{padding:"0 0 4px"}}><AlertCircle size={11}/> {errors.images}</div>}
              <div
                ref={dropRef}
                className={`sap-drop-zone ${dragging?"dragging":""} ${errors.images?"err":""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" style={{display:"none"}}
                  onChange={e => addImages(e.target.files)} />
                <div className="sap-drop-icon"><Upload size={20} color="var(--dim)"/></div>
                <div className="sap-drop-title">Drop images here or click to upload</div>
                <div className="sap-drop-sub">PNG, JPG, WEBP · Max 8 images · First image = main</div>
              </div>

              {images.length > 0 && (
                <div className="sap-img-grid">
                  {images.map(img => (
                    <div key={img.id} className={`sap-img-card ${img.isMain?"main-img":""}`}>
                      <img src={img.url} alt="" />
                      {img.isMain && <div className="sap-main-badge">MAIN</div>}
                      <div className="sap-img-overlay">
                        {!img.isMain && (
                          <button className="sap-img-action" onClick={e => { e.stopPropagation(); setMain(img.id); }}>
                            Set Main
                          </button>
                        )}
                        <button className="sap-img-action del" onClick={e => { e.stopPropagation(); removeImage(img.id); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <div className="sap-img-card"
                      style={{border:"2px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"var(--mid)"}}
                      onClick={() => fileRef.current?.click()}>
                      <Plus size={20} color="var(--dim)"/>
                    </div>
                  )}
                </div>
              )}
            </Section>

            {/* 4. PRICING */}
            <Section icon={DollarSign} title="Pricing">
              <div className="sap-grid2">
                <Field label="Price" required error={errors.price}>
                  <div className="sap-price-row">
                    <div className="sap-select-wrap" style={{position:"relative"}}>
                      <button className="sap-currency-btn" onClick={() => setCurOpen(o=>!o)}>
                        {currency}<ChevronDown size={11}/>
                      </button>
                      {curOpen && (
                        <div className="sap-dropdown" style={{minWidth:100}}>
                          {CURRENCIES.map(c => (
                            <div key={c} className={`sap-dd-opt ${currency===c?"on":""}`}
                              onClick={() => { setCurrency(c as Currency); setCurOpen(false); }}>
                              {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input className={`sap-input ${errors.price?"err":""}`}
                      type="number" min="0" placeholder="0"
                      value={price} onChange={e => { setPrice(e.target.value); setErrors(p=>({...p,price:""})); }} />
                  </div>
                </Field>

                <Field label="Sale Price" hint="Optional — leave blank if no discount" error={errors.salePrice}>
                  <div className="sap-price-row">
                    <div className="sap-currency-btn" style={{cursor:"default"}}>{currency}</div>
                    <input className={`sap-input ${errors.salePrice?"err":""}`}
                      type="number" min="0" placeholder="0"
                      value={salePrice} onChange={e => { setSalePrice(e.target.value); setErrors(p=>({...p,salePrice:""})); }} />
                  </div>
                  {discount > 0 && (
                    <div className="sap-discount-badge"><Check size={12}/> {discount}% discount applied</div>
                  )}
                </Field>
              </div>
            </Section>

            {/* 5. INVENTORY */}
            <Section icon={BarChart2} title="Inventory">
              <div className="sap-grid2">
                <Field label="Stock Quantity">
                  <div className="sap-stock-row">
                    <button className="sap-stock-btn"
                      onClick={() => setStock(p => String(Math.max(0, parseInt(p||"0")-1)))}>
                      <Minus size={14}/>
                    </button>
                    <input className="sap-stock-input" type="number" min="0"
                      value={stock} onChange={e => setStock(e.target.value)} />
                    <button className="sap-stock-btn"
                      onClick={() => setStock(p => String(parseInt(p||"0")+1))}>
                      <Plus size={14}/>
                    </button>
                  </div>
                </Field>

                <Field label="Product Status">
                  <div className="sap-status-opts">
                    {(Object.entries(STATUS_META) as [ProductStatus, typeof STATUS_META[ProductStatus]][]).map(([k,v]) => (
                      <div key={k}
                        className={`sap-status-opt ${status===k?"on":""}`}
                        style={{ "--sc":v.color, "--sb":v.bg } as React.CSSProperties}
                        onClick={() => setStatus(k)}>
                        <div className="sap-status-dot"/>
                        <div className="sap-status-opt-label">{v.label}</div>
                      </div>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            {/* 6. VARIANTS */}
            <Section icon={Layers} title="Product Variants">
              <Field label="Sizes" hint="Click to toggle — or add a custom size below">
                <div className="sap-pill-group">
                  {(category === "Sneakers" ? SHOE_SIZES : CLOTHING_SIZES).map(s => (
                    <button key={s}
                      className={`sap-pill ${selectedSizes.includes(s)?"on":""}`}
                      onClick={() => toggleSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="sap-custom-row">
                  <input className="sap-custom-input" placeholder="Custom size (e.g. One Size)"
                    value={customSize}
                    onChange={e => setCustomSize(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && addCustomSize()} />
                  <button className="sap-custom-add" onClick={addCustomSize}><Plus size={12}/> Add</button>
                </div>
                {selectedSizes.length > 0 && (
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                    {selectedSizes.map(s => (
                      <span key={s} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,45,0,.1)",border:"1px solid rgba(255,45,0,.25)",padding:"3px 8px"}}>
                        <span style={{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:1,color:"var(--accent)"}}>{s}</span>
                        <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--accent)",display:"flex",padding:0}} onClick={() => toggleSize(s)}><X size={10}/></button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Colors" hint="Click to toggle — or add a custom colour">
                <div className="sap-pill-group">
                  {COLORS.map(c => (
                    <button key={c}
                      className={`sap-pill ${selectedColors.includes(c)?"on":""}`}
                      onClick={() => toggleColor(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="sap-custom-row">
                  <input className="sap-custom-input" placeholder="Custom colour"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && addCustomColor()} />
                  <button className="sap-custom-add" onClick={addCustomColor}><Plus size={12}/> Add</button>
                </div>
              </Field>
            </Section>

            {/* 7. TAGS */}
            <Section icon={Tag} title="Tags & Search">
              <Field label="Tags" hint="Press Enter or comma to add · Max 20 tags">
                <div className="sap-tags-wrap" onClick={() => (document.querySelector(".sap-tag-input") as HTMLElement)?.focus()}>
                  {tags.map(t => (
                    <div key={t} className="sap-tag">
                      #{t}
                      <button className="sap-tag-x" onClick={() => removeTag(t)}><X size={9}/></button>
                    </div>
                  ))}
                  <input className="sap-tag-input" placeholder={tags.length===0?"streetwear, nike, retro...":""}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if(e.key==="Enter"||e.key===",") { e.preventDefault(); addTag(); } }} />
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
                  <span style={{fontFamily:"'Barlow Condensed'",fontSize:10,color:"var(--dim)",letterSpacing:1}}>{tags.length}/20</span>
                </div>
              </Field>
            </Section>

            {/* 8. SHIPPING */}
            <Section icon={Truck} title="Shipping">
              <div className="sap-grid3">
                <Field label="Weight (kg)" hint="Used to calculate shipping">
                  <input className="sap-input" type="number" min="0" step="0.1" placeholder="0.0"
                    value={weight} onChange={e => setWeight(e.target.value)} />
                </Field>
                <Field label="Shipping Class">
                  <select className="sap-input" style={{cursor:"pointer",appearance:"none"}}
                    value={shipping} onChange={e => setShipping(e.target.value)}>
                    {SHIPPING.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
                <Field label="Delivery Region">
                  <select className="sap-input" style={{cursor:"pointer",appearance:"none"}}
                    value={region} onChange={e => setRegion(e.target.value)}>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

          </div>{/* end main col */}

          {/* ── SIDEBAR ── */}
          <div className="sap-sidebar">

            {/* Summary card */}
            <div className="sap-section">
              <div className="sap-section-header">
                <div className="sap-section-icon"><Info size={14} color="var(--dim)"/></div>
                <div className="sap-section-title">Summary</div>
              </div>
              <div className="sap-section-body" style={{gap:12}}>
                {[
                  { label:"Name",      val:name      || "—" },
                  { label:"Brand",     val:brand     || "—" },
                  { label:"Category",  val:category  || "—" },
                  { label:"Condition", val:CONDITIONS.find(c=>c.value===condition)?.label || "—" },
                  { label:"Price",     val:price ? `${currency} ${parseFloat(price).toLocaleString()}` : "—" },
                  { label:"Stock",     val:stock || "0" },
                  { label:"Images",    val:`${images.length} uploaded` },
                  { label:"Sizes",     val:selectedSizes.length > 0 ? selectedSizes.join(", ") : "—" },
                  { label:"Tags",      val:tags.length > 0 ? `${tags.length} tags` : "—" },
                ].map(r => (
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",gap:8,borderBottom:"1px solid var(--border)",paddingBottom:8}}>
                    <span style={{fontFamily:"'Barlow Condensed'",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--dim)"}}>{r.label}</span>
                    <span style={{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:1,color:"var(--white)",textAlign:"right",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.val}</span>
                  </div>
                ))}

                {/* status badge */}
                <div>
                  <span style={{fontFamily:"'Barlow Condensed'",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--dim)"}}>Status</span>
                  <div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:6,
                    background:STATUS_META[status].bg,
                    border:`1px solid ${STATUS_META[status].color}44`,
                    padding:"4px 10px"}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:STATUS_META[status].color}}/>
                    <span style={{fontFamily:"'Barlow Condensed'",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:STATUS_META[status].color}}>
                      {STATUS_META[status].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar publish (desktop) */}
            <div className="sap-section" style={{display:"none"}} id="sidebar-publish">
              <div className="sap-section-body">
                <button className="sap-btn sap-btn-primary" style={{width:"100%",justifyContent:"center",height:44}}
                  onClick={handlePublish} disabled={publishing}>
                  {publishing ? <><div className="sap-spinner"/> Publishing...</> : <><Send size={13}/> Publish Product</>}
                </button>
                <button className="sap-btn sap-btn-draft" style={{width:"100%",justifyContent:"center"}}
                  onClick={handleSaveDraft} disabled={saving}>
                  {saving ? <><div className="sap-spinner"/> Saving...</> : <><Save size={13}/> Save as Draft</>}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="sap-section">
              <div className="sap-section-header">
                <div className="sap-section-icon"><Check size={14} color="var(--dim)"/></div>
                <div className="sap-section-title">Checklist</div>
              </div>
              <div className="sap-section-body" style={{gap:8}}>
                {[
                  { label:"Product name",    done:!!name.trim()       },
                  { label:"Brand",           done:!!brand.trim()      },
                  { label:"Category",        done:!!category          },
                  { label:"Description",     done:!!description.trim()},
                  { label:"At least 1 image",done:images.length > 0  },
                  { label:"Price set",       done:!!price && !isNaN(parseFloat(price)) },
                  { label:"Sizes added",     done:selectedSizes.length > 0 },
                  { label:"Tags added",      done:tags.length > 0     },
                ].map(item => (
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{
                      width:18, height:18, flexShrink:0,
                      background: item.done ? "rgba(34,197,94,.1)" : "var(--mid)",
                      border: `1px solid ${item.done ? "rgba(34,197,94,.35)" : "var(--border)"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      transition:"all .2s"
                    }}>
                      {item.done && <Check size={10} color="#22c55e"/>}
                    </div>
                    <span style={{
                      fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:1,
                      color: item.done ? "var(--white)" : "var(--dim)",
                      transition:"color .2s"
                    }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── STICKY PUBLISH BAR ── */}
        <div className="sap-publish-bar">
          <div className="sap-publish-info">
            {Object.keys(errors).length > 0
              ? <span style={{color:"#ff6b6b"}}>Fix {Object.keys(errors).length} error{Object.keys(errors).length>1?"s":""} before publishing</span>
              : <><strong>{name || "Untitled Product"}</strong> · {status}</>}
          </div>
          <button className="sap-btn sap-btn-ghost" onClick={() => navigate("/seller/products")}>Cancel</button>
          <button className="sap-btn sap-btn-draft" onClick={handleSaveDraft} disabled={saving}>
            {saving ? <><div className="sap-spinner"/> Saving...</> : <><Save size={13}/> Save Draft</>}
          </button>
          <button className="sap-btn sap-btn-primary" onClick={handlePublish} disabled={publishing}>
            {publishing ? <><div className="sap-spinner"/> Publishing...</> : <><Send size={13}/> Publish</>}
          </button>
        </div>

      </div>
    </>
  );
}