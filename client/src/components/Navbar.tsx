import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .cv-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: var(--nav-h, 64px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 768px)  { .cv-nav { padding: 0 40px; } }
        @media (min-width: 1024px) { .cv-nav { padding: 0 60px; } }

        .cv-nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; letter-spacing: 4px;
          color: var(--white, #f5f5f0); text-decoration: none; flex-shrink: 0;
        }
        .cv-nav-logo span { color: var(--accent, #ff2d00); }
        .cv-nav-logo:hover { opacity: .85; }

        /* ── DESKTOP NAV LINKS ── */
        .cv-nav-links {
          display: flex; gap: 32px; list-style: none; margin: 0; padding: 0;
        }
        .cv-nav-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim, #888); text-decoration: none; transition: color .2s;
        }
        .cv-nav-links a:hover { color: var(--white, #f5f5f0); }
        .cv-nav-links a.nav-active { color: var(--accent, #ff2d00); }

        /* ── ACTIONS ROW ── */
        .cv-nav-actions { display: flex; align-items: center; gap: 4px; }

        .cv-nav-search {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 7px 14px;
          transition: border-color .2s;
        }
        .cv-nav-search:focus-within { border-color: var(--accent, #ff2d00); }
        .cv-nav-search input {
          background: transparent; border: none; outline: none;
          color: var(--white, #f5f5f0); font-family: 'Barlow', sans-serif;
          font-size: 13px; width: 130px;
        }
        .cv-nav-search input::placeholder { color: var(--dim, #888); }

        /* icon links — 44×44 tap target */
        .cv-nav-ico {
          color: var(--dim, #888); cursor: pointer; transition: color .2s;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          width: 44px; height: 44px;
        }
        .cv-nav-ico:hover { color: var(--white, #f5f5f0); }

        .cv-nav-cart { position: relative; }
        .cv-nav-badge {
          position: absolute; top: 4px; right: 4px;
          background: var(--accent, #ff2d00); color: var(--white, #f5f5f0);
          font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }

        .cv-nav-cta {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent, #ff2d00); color: var(--white, #f5f5f0);
          border: none; padding: 9px 24px; cursor: pointer; text-decoration: none;
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition: all .2s; flex-shrink: 0;
          display: inline-flex; align-items: center;
        }
        .cv-nav-cta:hover { background: #ff5533; transform: scale(1.04); }

        /* ── HAMBURGER BUTTON ── */
        .cv-nav-burger {
          display: none;
          background: transparent; border: none; cursor: pointer;
          color: var(--white, #f5f5f0);
          width: 44px; height: 44px;
          align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── MOBILE DRAWER BACKDROP ── */
        .cv-drawer-backdrop {
          display: none;
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          animation: fadeIn .2s ease;
        }
        .cv-drawer-backdrop.open { display: block; }

        /* ── MOBILE DRAWER ── */
        .cv-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 310;
          width: min(300px, 85vw);
          background: #111;
          border-left: 1px solid rgba(255,255,255,.08);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          overflow-y: auto;
        }
        .cv-drawer.open { transform: translateX(0); }

        .cv-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          height: var(--nav-h, 64px);
          border-bottom: 1px solid rgba(255,255,255,.07);
          flex-shrink: 0;
        }
        .cv-drawer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 4px; color: var(--white, #f5f5f0); text-decoration: none;
        }
        .cv-drawer-logo span { color: var(--accent, #ff2d00); }
        .cv-drawer-close {
          background: transparent; border: none; cursor: pointer;
          color: var(--dim, #888); transition: color .2s;
          width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
        }
        .cv-drawer-close:hover { color: var(--white, #f5f5f0); }

        .cv-drawer-nav {
          list-style: none; margin: 0; padding: 12px 0;
          flex: 1;
        }
        .cv-drawer-nav li a {
          display: flex; align-items: center;
          padding: 14px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim, #888); text-decoration: none;
          transition: color .18s, background .18s;
          border-left: 3px solid transparent;
        }
        .cv-drawer-nav li a:hover { color: var(--white, #f5f5f0); background: rgba(255,255,255,.04); }
        .cv-drawer-nav li a.nav-active {
          color: var(--accent, #ff2d00);
          border-left-color: var(--accent, #ff2d00);
          background: rgba(255,45,0,.06);
        }
        .cv-drawer-divider {
          border: none; border-top: 1px solid rgba(255,255,255,.06);
          margin: 8px 0;
        }
        .cv-drawer-sell {
          margin: 12px 24px 24px;
          display: flex;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent, #ff2d00); color: var(--white, #f5f5f0);
          border: none; padding: 14px 24px; cursor: pointer; text-decoration: none;
          align-items: center; justify-content: center;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── RESPONSIVE RULES ── */
        @media (max-width: 768px) {
          .cv-nav-links { display: none; }
          .cv-nav-search { display: none; }
          .cv-nav-cta    { display: none; }
          .cv-nav-burger { display: flex; }
          .cv-nav-actions { gap: 0; }
        }
        @media (min-width: 769px) {
          .cv-drawer, .cv-drawer-backdrop { display: none !important; }
        }
      `}</style>

      <nav className="cv-nav">
        <Link to="/" className="cv-nav-logo">CLOSET<span>VAULT</span></Link>

        <ul className="cv-nav-links">
          <li><Link to="/launches"          className={isActive("/launches")         ? "nav-active" : ""}>New</Link></li>
          <li><Link to="/shop/shoes"        className={isActive("/shop/shoes")       ? "nav-active" : ""}>Shoes</Link></li>
          <li><Link to="/shop/men"          className={isActive("/shop/men")         ? "nav-active" : ""}>Men</Link></li>
          <li><Link to="/shop/women"        className={isActive("/shop/women")       ? "nav-active" : ""}>Women</Link></li>
          <li><Link to="/shop/accessories"  className={isActive("/shop/accessories") ? "nav-active" : ""}>Accessories</Link></li>
          <li><Link to="/shop"              className={pathname === "/shop"          ? "nav-active" : ""}>Marketplace</Link></li>
        </ul>

        <div className="cv-nav-actions">
          <div className="cv-nav-search">
            <input type="text" placeholder="Search..." />
            <Search size={14} color="var(--dim, #888)" />
          </div>
          <Link to="/profile"  className="cv-nav-ico"><User        size={20} /></Link>
          <Link to="/wishlist" className="cv-nav-ico"><Heart       size={20} /></Link>
          <Link to="/cart"     className="cv-nav-ico cv-nav-cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="cv-nav-badge">{itemCount > 99 ? "99+" : itemCount}</span>
            )}
          </Link>
          <Link to="/seller/dashboard" className="cv-nav-cta">Sell</Link>
          <button className="cv-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`cv-drawer-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      />

      {/* Slide-in drawer */}
      <nav className={`cv-drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="cv-drawer-head">
          <Link to="/" className="cv-drawer-logo" onClick={closeMenu}>CLOSET<span>VAULT</span></Link>
          <button className="cv-drawer-close" onClick={closeMenu} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <ul className="cv-drawer-nav">
          <li><Link to="/launches"         className={isActive("/launches")         ? "nav-active" : ""} onClick={closeMenu}>New Drops</Link></li>
          <li><Link to="/shop/shoes"       className={isActive("/shop/shoes")       ? "nav-active" : ""} onClick={closeMenu}>Shoes</Link></li>
          <li><Link to="/shop/men"         className={isActive("/shop/men")         ? "nav-active" : ""} onClick={closeMenu}>Men</Link></li>
          <li><Link to="/shop/women"       className={isActive("/shop/women")       ? "nav-active" : ""} onClick={closeMenu}>Women</Link></li>
          <li><Link to="/shop/accessories" className={isActive("/shop/accessories") ? "nav-active" : ""} onClick={closeMenu}>Accessories</Link></li>
          <li><Link to="/shop"             className={pathname === "/shop"          ? "nav-active" : ""} onClick={closeMenu}>Marketplace</Link></li>
          <hr className="cv-drawer-divider" />
          <li><Link to="/profile"          className={isActive("/profile")          ? "nav-active" : ""} onClick={closeMenu}>My Profile</Link></li>
          <li><Link to="/wishlist"         className={isActive("/wishlist")         ? "nav-active" : ""} onClick={closeMenu}>Wishlist</Link></li>
          <li><Link to="/orders"           className={isActive("/orders")           ? "nav-active" : ""} onClick={closeMenu}>My Orders</Link></li>
          <li><Link to="/cart"             className={isActive("/cart")             ? "nav-active" : ""} onClick={closeMenu}>Cart {itemCount > 0 && `(${itemCount})`}</Link></li>
        </ul>

        <Link to="/seller/dashboard" className="cv-drawer-sell" onClick={closeMenu}>
          Start Selling →
        </Link>
      </nav>
    </>
  );
}
