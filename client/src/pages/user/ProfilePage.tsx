import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User, Lock, MapPin, Ruler, Bell, Shield,
  Check, AlertCircle, Eye, EyeOff, Trash2, Plus,
  Camera, ChevronRight, Package, Heart, Archive,
  LogOut, CreditCard
} from "lucide-react";

// ── Mock user data ─────────────────────────────────────────────────────────
const MOCK_USER = {
  firstName: "Jordan", lastName: "Khumalo",
  email: "jordan@closet.vault", username: "VaultKing_ZA",
  phone: "+27 72 000 0000", joinedYear: "2024",
  avatar: null as string | null,
  orders: 12, saved: 34, reviews: 7,
};

const MOCK_ADDRESSES = [
  { id: 1, label: "Home", name: "Jordan Khumalo", line1: "123 Main Street", line2: "Unit 4B", city: "Johannesburg", province: "Gauteng", zip: "2000", country: "South Africa", isDefault: true },
  { id: 2, label: "Work", name: "Jordan Khumalo", line1: "456 Business Park", line2: "", city: "Sandton", province: "Gauteng", zip: "2196", country: "South Africa", isDefault: false },
];

const SA_PROVINCES = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"];
const SHOE_SIZES   = ["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","13"];
const CLOTHING_SIZES = ["XS","S","M","L","XL","XXL"];
const BRANDS_LIST  = ["Nike","Adidas","Jordan","New Balance","Supreme","Off-White","Yeezy","Bape","Puma","Reebok"];

type SideTab = "profile" | "addresses" | "sizes" | "notifications" | "security" | "billing";

export default function ProfilePage() {
  const [activeTab, setTab]     = useState<SideTab>("profile");

  // profile form
  const [profile, setProfile]   = useState({ ...MOCK_USER });
  const [profileSaved, setPS]   = useState(false);

  // password form
  const [pwForm, setPw]         = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]     = useState({ c: false, n: false, cf: false });
  const [pwErrors, setPwErr]    = useState<Record<string,string>>({});
  const [pwSaved, setPwSaved]   = useState(false);

  // addresses
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [editAddr, setEditAddr]   = useState<number | null>(null);
  const [addrForm, setAddrForm]   = useState({ label:"", name:"", line1:"", line2:"", city:"", province:"", zip:"", country:"South Africa" });
  const [showAddrForm, setShowAF] = useState(false);

  // sizes & preferences
  const [shoeSize, setShoeSize]       = useState("10");
  const [clothingSize, setClothingSize] = useState("L");
  const [favBrands, setFavBrands]     = useState<string[]>(["Nike","Jordan","Adidas"]);
  const [sizesSaved, setSizesSaved]   = useState(false);

  // notifications
  const [notifs, setNotifs] = useState({
    orderUpdates: true, priceDrops: true, newDrops: false,
    marketing: false, vaultActivity: true, weeklyDigest: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // helpers
  const toggleBrand = (b: string) =>
    setFavBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const saveProfile = () => { setPS(true); setTimeout(() => setPS(false), 2000); };
  const saveSizes   = () => { setSizesSaved(true); setTimeout(() => setSizesSaved(false), 2000); };
  const saveNotifs  = () => { setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2000); };

  const savePw = () => {
    const e: Record<string,string> = {};
    if (!pwForm.current)             e.current  = "Required";
    if (pwForm.next.length < 8)      e.next     = "Min 8 characters";
    if (pwForm.next !== pwForm.confirm) e.confirm = "Passwords don't match";
    setPwErr(e);
    if (Object.keys(e).length > 0) return;
    setPwSaved(true); setPw({ current:"", next:"", confirm:"" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const startEditAddr = (id: number) => {
    const a = addresses.find(x => x.id === id)!;
    setAddrForm({ label: a.label, name: a.name, line1: a.line1, line2: a.line2, city: a.city, province: a.province, zip: a.zip, country: a.country });
    setEditAddr(id); setShowAF(true);
  };

  const saveAddr = () => {
    if (editAddr) {
      setAddresses(prev => prev.map(a => a.id === editAddr ? { ...a, ...addrForm } : a));
    } else {
      setAddresses(prev => [...prev, { id: Date.now(), ...addrForm, isDefault: false }]);
    }
    setShowAF(false); setEditAddr(null);
    setAddrForm({ label:"", name:"", line1:"", line2:"", city:"", province:"", zip:"", country:"South Africa" });
  };

  const removeAddr = (id: number) => setAddresses(prev => prev.filter(a => a.id !== id));
  const setDefault = (id: number) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const NAV_ITEMS: { id: SideTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",       label: "Profile",        icon: <User size={14} /> },
    { id: "addresses",     label: "Addresses",      icon: <MapPin size={14} /> },
    { id: "sizes",         label: "Sizes & Brands", icon: <Ruler size={14} /> },
    { id: "notifications", label: "Notifications",  icon: <Bell size={14} /> },
    { id: "security",      label: "Security",       icon: <Shield size={14} /> },
    { id: "billing",       label: "Billing",        icon: <CreditCard size={14} /> },
  ];

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .prof {
          max-width: 1200px; margin: 0 auto;
          padding: 36px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .prof { padding: 44px 40px 100px; } }
        @media (min-width: 1100px) { .prof { padding: 48px 60px 100px; } }

        /* ── BREADCRUMB ── */
        .prof-crumb {
          display: flex; align-items: center; gap: 6px; margin-bottom: 32px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .prof-crumb a { color: var(--dim); text-decoration: none; transition: color .2s; }
        .prof-crumb a:hover { color: var(--white); }
        .prof-crumb-sep { color: rgba(255,255,255,.15); font-size: 9px; }
        .prof-crumb-cur { color: var(--accent); }

        /* ── PROFILE HERO ── */
        .prof-hero {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 36px; flex-wrap: wrap;
          animation: profIn .5s ease both;
        }
        .prof-avatar-wrap { position: relative; flex-shrink: 0; }
        .prof-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          background: var(--mid); border: 3px solid rgba(255,45,0,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 32px;
          color: var(--accent); overflow: hidden;
        }
        .prof-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .prof-avatar-edit {
          position: absolute; bottom: 0; right: 0;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--accent); border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform .2s;
        }
        .prof-avatar-edit:hover { transform: scale(1.1); }

        .prof-hero-info {}
        .prof-hero-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px, 3.5vw, 38px);
          letter-spacing: 2px; color: var(--white); line-height: 1; margin-bottom: 4px;
        }
        .prof-hero-name span { color: var(--accent); }
        .prof-hero-handle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 10px;
        }
        .prof-hero-stats { display: flex; gap: 20px; flex-wrap: wrap; }
        .prof-hero-stat {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); display: flex; align-items: center; gap: 5px;
        }
        .prof-hero-stat strong {
          font-family: 'Bebas Neue', sans-serif; font-size: 16px;
          color: var(--white); letter-spacing: 1px;
        }

        /* ── LAYOUT: sidebar + content ── */
        .prof-layout {
          display: grid; grid-template-columns: 1fr;
          gap: 24px; align-items: start;
        }
        @media (min-width: 800px) {
          .prof-layout { grid-template-columns: 220px 1fr; gap: 28px; }
        }

        /* ── SIDEBAR NAV ── */
        .prof-nav {
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          overflow: hidden;
          position: sticky; top: calc(var(--nav-h, 64px) + 16px);
          animation: profIn .5s ease .05s both;
        }
        .prof-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); border-left: 2px solid transparent;
          transition: all .2s; background: transparent; border-top: none;
          border-right: none; border-bottom: none; width: 100%; text-align: left;
        }
        .prof-nav-item:hover { color: var(--white); background: rgba(255,255,255,.03); }
        .prof-nav-item.on { color: var(--white); border-left-color: var(--accent); background: rgba(255,255,255,.04); }
        .prof-nav-divider {
          border: none; border-top: 1px solid rgba(255,255,255,.06); margin: 4px 0;
        }
        .prof-nav-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); transition: color .2s; background: transparent;
          border: none; border-top: 1px solid rgba(255,255,255,.06); width: 100%; text-align: left;
          margin-top: 4px;
        }
        .prof-nav-logout:hover { color: var(--accent); }

        /* ── CONTENT PANEL ── */
        .prof-content { animation: profIn .5s ease .1s both; }

        .prof-card {
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          margin-bottom: 16px;
        }
        .prof-card-header {
          padding: 18px 22px 14px; border-bottom: 1px solid rgba(255,255,255,.07);
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .prof-card-title-wrap { display: flex; align-items: center; gap: 10px; }
        .prof-card-icon {
          width: 28px; height: 28px;
          background: rgba(255,45,0,.1); border: 1px solid rgba(255,45,0,.2);
          display: flex; align-items: center; justify-content: center; color: var(--accent);
        }
        .prof-card-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 17px;
          letter-spacing: 3px; color: var(--white);
        }
        .prof-card-body { padding: 22px; }

        /* ── FORM ELEMENTS ── */
        .pf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        @media (max-width: 599px) { .pf-row { grid-template-columns: 1fr; } }
        .pf-field { display: flex; flex-direction: column; gap: 6px; }
        .pf-field.full { grid-column: 1 / -1; }
        .pf-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim);
        }
        .pf-input-wrap { position: relative; }
        .pf-input {
          width: 100%; background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          color: var(--white); font-family: 'Barlow', sans-serif; font-size: 14px;
          padding: 11px 14px; outline: none; transition: border-color .2s;
        }
        .pf-input:focus { border-color: var(--accent); }
        .pf-input.err { border-color: var(--accent); }
        .pf-input::placeholder { color: rgba(255,255,255,.18); font-size: 13px; }
        .pf-select {
          width: 100%; background: var(--mid); border: 1px solid rgba(255,255,255,.08);
          color: var(--white); font-family: 'Barlow', sans-serif; font-size: 14px;
          padding: 11px 14px; outline: none; transition: border-color .2s;
          -webkit-appearance: none; cursor: pointer;
        }
        .pf-select:focus { border-color: var(--accent); }
        .pf-err {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          color: var(--accent); display: flex; align-items: center; gap: 4px;
        }

        /* pw toggle */
        .pf-pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.25); transition: color .2s; display: flex;
        }
        .pf-pw-toggle:hover { color: rgba(255,255,255,.6); }

        /* ── SAVE BUTTON ── */
        .pf-save-row {
          display: flex; align-items: center; gap: 14px; margin-top: 20px;
          padding-top: 18px; border-top: 1px solid rgba(255,255,255,.06);
        }
        .pf-save-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 12px 28px; cursor: pointer;
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition: all .25s; display: flex; align-items: center; gap: 8px;
          position: relative; overflow: hidden;
        }
        .pf-save-btn::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,.18);
          transform:translateX(-120%) skewX(-15deg); transition:transform .4s ease;
        }
        .pf-save-btn:hover::after { transform:translateX(120%) skewX(-15deg); }
        .pf-save-btn:hover { background:#ff5533; transform:translateY(-1px); }
        .pf-save-btn.saved { background:#16a34a; }
        .pf-saved-msg {
          font-family:'Barlow Condensed',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          color:#22c55e; display:flex; align-items:center; gap:6px;
          animation: fadeIn .3s ease both;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        /* ── SIZE PILLS ── */
        .size-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .size-pill {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          background: var(--mid); color: var(--dim);
          border: 1px solid rgba(255,255,255,.08); padding: 8px 14px; cursor: pointer;
          clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
          transition: all .15s;
        }
        .size-pill:hover { border-color: rgba(255,255,255,.2); color: var(--white); }
        .size-pill.on { background: var(--accent); border-color: var(--accent); color: var(--white); }

        /* brand chips */
        .brand-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .brand-chip {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: var(--mid); color: var(--dim);
          border: 1px solid rgba(255,255,255,.08); padding: 7px 14px; cursor: pointer;
          transition: all .15s; display: flex; align-items: center; gap: 6px;
        }
        .brand-chip:hover { border-color: rgba(255,255,255,.2); color: var(--white); }
        .brand-chip.on { background: var(--accent); border-color: var(--accent); color: var(--white); }
        .brand-chip.on .bc-check { display: flex; }
        .bc-check { display: none; }

        /* ── ADDRESS CARDS ── */
        .addr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
        .addr-card {
          background: var(--mid); border: 1px solid rgba(255,255,255,.07);
          padding: 16px 18px; position: relative;
          border-top: 2px solid rgba(255,255,255,.05); transition: border-color .2s;
        }
        .addr-card:hover { border-color: rgba(255,255,255,.12); }
        .addr-card.default { border-top-color: var(--accent); }
        .addr-label-row {
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
        }
        .addr-label {
          font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 3px;
          color: var(--white);
        }
        .addr-default-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: rgba(255,45,0,.1); border: 1px solid rgba(255,45,0,.25);
          color: var(--accent); padding: 2px 8px;
        }
        .addr-text {
          font-size: 13px; font-weight: 300; line-height: 1.7; color: var(--dim);
          margin-bottom: 14px;
        }
        .addr-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .addr-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: transparent; border: 1px solid rgba(255,255,255,.1);
          color: var(--dim); padding: 5px 12px; cursor: pointer; transition: all .2s;
        }
        .addr-btn:hover { border-color: var(--accent); color: var(--accent); }
        .addr-btn-del:hover { border-color: var(--accent); color: var(--accent); }
        .addr-add {
          background: transparent; border: 1px dashed rgba(255,255,255,.12);
          padding: 32px 18px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: all .2s; color: var(--dim);
        }
        .addr-add:hover { border-color: var(--accent); color: var(--accent); }
        .addr-add-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }

        /* address form */
        .addr-form {
          background: var(--mid); border: 1px solid rgba(255,255,255,.1);
          padding: 20px; margin-top: 14px;
          animation: fadeIn .3s ease both;
        }
        .addr-form-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 3px;
          color: var(--white); margin-bottom: 16px;
        }

        /* ── NOTIFICATION TOGGLES ── */
        .notif-list { display: flex; flex-direction: column; gap: 0; }
        .notif-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.05);
          gap: 16px;
        }
        .notif-row:last-child { border-bottom: none; }
        .notif-info {}
        .notif-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
          color: var(--white); margin-bottom: 3px;
        }
        .notif-sub { font-size: 12px; font-weight: 300; color: var(--dim); }
        .toggle-wrap {
          width: 44px; height: 24px; border-radius: 12px;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1);
          position: relative; cursor: pointer; flex-shrink: 0;
          transition: all .25s;
        }
        .toggle-wrap.on { background: var(--accent); border-color: var(--accent); }
        .toggle-dot {
          position: absolute; width: 18px; height: 18px; border-radius: 50%;
          background: rgba(255,255,255,.4); top: 2px; left: 2px;
          transition: transform .25s, background .25s;
        }
        .toggle-wrap.on .toggle-dot {
          transform: translateX(20px); background: var(--white);
        }

        /* ── DANGER ZONE ── */
        .danger-zone {
          border: 1px solid rgba(255,45,0,.2);
          padding: 18px 22px;
          background: rgba(255,45,0,.04);
          margin-top: 8px;
        }
        .danger-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 3px;
          color: var(--accent); margin-bottom: 8px;
        }
        .danger-sub { font-size: 13px; font-weight: 300; color: var(--dim); margin-bottom: 14px; line-height: 1.6; }
        .danger-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: transparent; color: var(--accent);
          border: 1px solid rgba(255,45,0,.3); padding: 9px 20px; cursor: pointer;
          transition: all .2s;
        }
        .danger-btn:hover { background: rgba(255,45,0,.1); border-color: var(--accent); }

        /* ── BILLING PLACEHOLDER ── */
        .billing-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 52px 20px; text-align: center;
        }
        .billing-empty-icon {
          font-family: 'Bebas Neue', sans-serif; font-size: 72px;
          color: rgba(255,255,255,.04); line-height: 1; margin-bottom: 12px;
        }
        .billing-empty-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 22px;
          letter-spacing: 3px; color: var(--dim); margin-bottom: 6px;
        }
        .billing-empty-sub { font-size: 13px; color: var(--dim); }

        /* quick links */
        .prof-quick {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;
        }
        .pq-link {
          display: flex; align-items: center; gap: 7px;
          background: var(--gray); border: 1px solid rgba(255,255,255,.07);
          padding: 10px 16px; text-decoration: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); transition: all .2s;
        }
        .pq-link:hover { border-color: var(--accent); color: var(--accent); }

        @keyframes profIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="prof">

        {/* BREADCRUMB */}
        <nav className="prof-crumb">
          <Link to="/">Home</Link>
          <span className="prof-crumb-sep">›</span>
          <span className="prof-crumb-cur">Account</span>
        </nav>

        {/* HERO */}
        <div className="prof-hero">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar">
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" />
                : profile.firstName[0] + profile.lastName[0]
              }
            </div>
            <div className="prof-avatar-edit"><Camera size={11} color="#f5f5f0" /></div>
          </div>
          <div className="prof-hero-info">
            <div className="prof-hero-name">
              {profile.firstName} <span>{profile.lastName}</span>
            </div>
            <div className="prof-hero-handle">@{profile.username} · Member since {profile.joinedYear}</div>
            <div className="prof-hero-stats">
              <div className="prof-hero-stat"><Package size={12} /><strong>{profile.orders}</strong> Orders</div>
              <div className="prof-hero-stat"><Archive size={12} /><strong>{profile.saved}</strong> Saved</div>
              <div className="prof-hero-stat"><Heart size={12} /><strong>{profile.reviews}</strong> Reviews</div>
            </div>
          </div>
          {/* quick links */}
          <div style={{ marginLeft: "auto" }}>
            <div className="prof-quick">
              <Link to="/vault"  className="pq-link"><Archive size={12} /> My Vault <ChevronRight size={11} /></Link>
              <Link to="/orders" className="pq-link"><Package size={12} /> Orders <ChevronRight size={11} /></Link>
            </div>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="prof-layout">

          {/* SIDEBAR */}
          <aside className="prof-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`prof-nav-item ${activeTab === item.id ? "on" : ""}`}
                onClick={() => setTab(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <hr className="prof-nav-divider" />
            <button className="prof-nav-logout">
              <LogOut size={14} /> Sign Out
            </button>
          </aside>

          {/* CONTENT */}
          <div className="prof-content">

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <>
                <div className="prof-card">
                  <div className="prof-card-header">
                    <div className="prof-card-title-wrap">
                      <div className="prof-card-icon"><User size={13} /></div>
                      <span className="prof-card-title">Personal Information</span>
                    </div>
                  </div>
                  <div className="prof-card-body">
                    <div className="pf-row">
                      <div className="pf-field">
                        <label className="pf-label">First Name</label>
                        <input className="pf-input" value={profile.firstName}
                          onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Last Name</label>
                        <input className="pf-input" value={profile.lastName}
                          onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Username</label>
                        <input className="pf-input" value={profile.username}
                          onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Phone</label>
                        <input className="pf-input" value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="pf-field full">
                        <label className="pf-label">Email Address</label>
                        <input className="pf-input" type="email" value={profile.email}
                          onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="pf-save-row">
                      <button className={`pf-save-btn ${profileSaved ? "saved" : ""}`} onClick={saveProfile}>
                        {profileSaved ? <><Check size={13} /> Saved</> : <>Save Changes</>}
                      </button>
                      {profileSaved && <span className="pf-saved-msg"><Check size={12} /> Changes saved successfully</span>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── ADDRESSES TAB ── */}
            {activeTab === "addresses" && (
              <div className="prof-card">
                <div className="prof-card-header">
                  <div className="prof-card-title-wrap">
                    <div className="prof-card-icon"><MapPin size={13} /></div>
                    <span className="prof-card-title">Saved Addresses</span>
                  </div>
                  <button
                    className="pf-save-btn" style={{ padding: "9px 18px", fontSize: 11 }}
                    onClick={() => { setEditAddr(null); setShowAF(true); setAddrForm({ label:"", name:"", line1:"", line2:"", city:"", province:"", zip:"", country:"South Africa" }); }}
                  >
                    <Plus size={12} /> Add New
                  </button>
                </div>
                <div className="prof-card-body">
                  <div className="addr-grid">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`addr-card ${addr.isDefault ? "default" : ""}`}>
                        <div className="addr-label-row">
                          <span className="addr-label">{addr.label}</span>
                          {addr.isDefault && <span className="addr-default-badge">Default</span>}
                        </div>
                        <div className="addr-text">
                          {addr.name}<br />
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                          {addr.city}, {addr.province} {addr.zip}<br />
                          {addr.country}
                        </div>
                        <div className="addr-actions">
                          <button className="addr-btn" onClick={() => startEditAddr(addr.id)}>Edit</button>
                          {!addr.isDefault && (
                            <button className="addr-btn" onClick={() => setDefault(addr.id)}>Set Default</button>
                          )}
                          {!addr.isDefault && (
                            <button className="addr-btn addr-btn-del" onClick={() => removeAddr(addr.id)}>
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="addr-add" onClick={() => { setEditAddr(null); setShowAF(true); }}>
                      <Plus size={18} />
                      <span className="addr-add-label">Add Address</span>
                    </div>
                  </div>

                  {/* address form */}
                  {showAddrForm && (
                    <div className="addr-form">
                      <div className="addr-form-title">{editAddr ? "Edit Address" : "New Address"}</div>
                      <div className="pf-row">
                        <div className="pf-field">
                          <label className="pf-label">Label</label>
                          <input className="pf-input" placeholder="Home / Work / etc."
                            value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))} />
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">Full Name</label>
                          <input className="pf-input" placeholder="Jordan Khumalo"
                            value={addrForm.name} onChange={e => setAddrForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="pf-field full">
                          <label className="pf-label">Street Address</label>
                          <input className="pf-input" placeholder="123 Main Street"
                            value={addrForm.line1} onChange={e => setAddrForm(f => ({ ...f, line1: e.target.value }))} />
                        </div>
                        <div className="pf-field full">
                          <label className="pf-label">Apt / Unit (optional)</label>
                          <input className="pf-input" placeholder="Unit 4B"
                            value={addrForm.line2} onChange={e => setAddrForm(f => ({ ...f, line2: e.target.value }))} />
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">City</label>
                          <input className="pf-input" placeholder="Johannesburg"
                            value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">Province</label>
                          <select className="pf-select" value={addrForm.province}
                            onChange={e => setAddrForm(f => ({ ...f, province: e.target.value }))}>
                            <option value="">Select</option>
                            {SA_PROVINCES.map(p => <option key={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">Postal Code</label>
                          <input className="pf-input" placeholder="2000"
                            value={addrForm.zip} onChange={e => setAddrForm(f => ({ ...f, zip: e.target.value }))} />
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">Country</label>
                          <select className="pf-select" value={addrForm.country}
                            onChange={e => setAddrForm(f => ({ ...f, country: e.target.value }))}>
                            {["South Africa","United States","United Kingdom","Nigeria","Kenya"].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="pf-save-row">
                        <button className="pf-save-btn" onClick={saveAddr}>
                          <Check size={13} /> {editAddr ? "Update Address" : "Save Address"}
                        </button>
                        <button className="addr-btn" onClick={() => setShowAF(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── SIZES TAB ── */}
            {activeTab === "sizes" && (
              <div className="prof-card">
                <div className="prof-card-header">
                  <div className="prof-card-title-wrap">
                    <div className="prof-card-icon"><Ruler size={13} /></div>
                    <span className="prof-card-title">Sizes & Preferences</span>
                  </div>
                </div>
                <div className="prof-card-body">
                  <div style={{ marginBottom: 24 }}>
                    <div className="pf-label" style={{ marginBottom: 12 }}>Shoe Size (US)</div>
                    <div className="size-pills">
                      {SHOE_SIZES.map(s => (
                        <button key={s} className={`size-pill ${shoeSize === s ? "on" : ""}`}
                          onClick={() => setShoeSize(s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div className="pf-label" style={{ marginBottom: 12 }}>Clothing Size</div>
                    <div className="size-pills">
                      {CLOTHING_SIZES.map(s => (
                        <button key={s} className={`size-pill ${clothingSize === s ? "on" : ""}`}
                          onClick={() => setClothingSize(s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div className="pf-label" style={{ marginBottom: 12 }}>Favourite Brands</div>
                    <div className="brand-chips">
                      {BRANDS_LIST.map(b => (
                        <button key={b} className={`brand-chip ${favBrands.includes(b) ? "on" : ""}`}
                          onClick={() => toggleBrand(b)}>
                          <span className="bc-check"><Check size={10} /></span>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pf-save-row">
                    <button className={`pf-save-btn ${sizesSaved ? "saved" : ""}`} onClick={saveSizes}>
                      {sizesSaved ? <><Check size={13} /> Saved</> : <>Save Preferences</>}
                    </button>
                    {sizesSaved && <span className="pf-saved-msg"><Check size={12} /> Preferences updated</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <div className="prof-card">
                <div className="prof-card-header">
                  <div className="prof-card-title-wrap">
                    <div className="prof-card-icon"><Bell size={13} /></div>
                    <span className="prof-card-title">Notification Preferences</span>
                  </div>
                </div>
                <div className="prof-card-body">
                  <div className="notif-list">
                    {([
                      { key: "orderUpdates",   title: "Order Updates",       sub: "Shipping, delivery, and status changes" },
                      { key: "priceDrops",     title: "Price Drop Alerts",   sub: "When saved items drop in price" },
                      { key: "newDrops",       title: "New Drops",           sub: "New listings from your favourite brands" },
                      { key: "vaultActivity",  title: "Vault Activity",      sub: "Saves, collections and wishlist changes" },
                      { key: "weeklyDigest",   title: "Weekly Digest",       sub: "Your weekly style summary email" },
                      { key: "marketing",      title: "Marketing Emails",    sub: "Promotions, offers and sponsored content" },
                    ] as { key: keyof typeof notifs; title: string; sub: string }[]).map(n => (
                      <div key={n.key} className="notif-row">
                        <div className="notif-info">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-sub">{n.sub}</div>
                        </div>
                        <div
                          className={`toggle-wrap ${notifs[n.key] ? "on" : ""}`}
                          onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                        >
                          <div className="toggle-dot" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pf-save-row">
                    <button className={`pf-save-btn ${notifSaved ? "saved" : ""}`} onClick={saveNotifs}>
                      {notifSaved ? <><Check size={13} /> Saved</> : <>Save Preferences</>}
                    </button>
                    {notifSaved && <span className="pf-saved-msg"><Check size={12} /> Preferences saved</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <>
                <div className="prof-card">
                  <div className="prof-card-header">
                    <div className="prof-card-title-wrap">
                      <div className="prof-card-icon"><Lock size={13} /></div>
                      <span className="prof-card-title">Change Password</span>
                    </div>
                  </div>
                  <div className="prof-card-body">
                    {pwSaved && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", marginBottom:16, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#22c55e" }}>
                        <Check size={13} /> Password updated successfully
                      </div>
                    )}
                    <div style={{ maxWidth: 420 }}>
                      {(["current","next","confirm"] as const).map((k) => {
                        const labels = { current: "Current Password", next: "New Password", confirm: "Confirm New Password" };
                        const showKey = k === "current" ? "c" : k === "next" ? "n" : "cf";
                        return (
                          <div key={k} className="pf-field" style={{ marginBottom: 14 }}>
                            <label className="pf-label">{labels[k]}</label>
                            <div className="pf-input-wrap">
                              <input
                                className={`pf-input ${pwErrors[k] ? "err" : ""}`}
                                type={showPw[showKey as keyof typeof showPw] ? "text" : "password"}
                                placeholder="••••••••"
                                value={pwForm[k]}
                                onChange={e => { setPw(p => ({ ...p, [k]: e.target.value })); setPwErr(e2 => ({ ...e2, [k]: "" })); }}
                                style={{ paddingRight: 40 }}
                              />
                              <button className="pf-pw-toggle" type="button"
                                onClick={() => setShowPw(s => ({ ...s, [showKey]: !s[showKey as keyof typeof s] }))}>
                                {showPw[showKey as keyof typeof showPw] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                            {pwErrors[k] && <span className="pf-err"><AlertCircle size={10} /> {pwErrors[k]}</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="pf-save-row">
                      <button className="pf-save-btn" onClick={savePw}>Update Password</button>
                    </div>
                  </div>
                </div>

                <div className="danger-zone">
                  <div className="danger-title">Danger Zone</div>
                  <div className="danger-sub">
                    Once you delete your account, there is no going back. All your vault data,
                    order history, and saved items will be permanently removed.
                  </div>
                  <button className="danger-btn">Delete My Account</button>
                </div>
              </>
            )}

            {/* ── BILLING TAB ── */}
            {activeTab === "billing" && (
              <div className="prof-card">
                <div className="prof-card-header">
                  <div className="prof-card-title-wrap">
                    <div className="prof-card-icon"><CreditCard size={13} /></div>
                    <span className="prof-card-title">Billing & Payments</span>
                  </div>
                </div>
                <div className="prof-card-body">
                  <div className="billing-empty">
                    <div className="billing-empty-icon">💳</div>
                    <div className="billing-empty-title">No Payment Methods</div>
                    <div className="billing-empty-sub">
                      Payment methods will be saved here after your first purchase.<br />
                      Powered by Stripe — your card details are never stored on our servers.
                    </div>
                    <div style={{ marginTop: 24, display:"flex", alignItems:"center", gap:8, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"var(--dim)" }}>
                      <Shield size={12} color="var(--accent)" /> SSL Encrypted · PCI Compliant
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}