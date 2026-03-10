import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <style>{`
        .cv-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: var(--nav-h, 64px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          background: rgba(10,10,10,0.92);
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

        .cv-nav-actions { display: flex; align-items: center; gap: 18px; }

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

        .cv-nav-ico {
          color: var(--dim, #888); cursor: pointer; transition: color .2s;
          display: flex; align-items: center; text-decoration: none;
        }
        .cv-nav-ico:hover { color: var(--white, #f5f5f0); }

        .cv-nav-cart { position: relative; display: flex; align-items: center; }
        .cv-nav-badge {
          position: absolute; top: -8px; right: -8px;
          background: var(--accent, #ff2d00); color: var(--white, #f5f5f0);
          font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
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

        @media (max-width: 768px) {
          .cv-nav-links, .cv-nav-search { display: none; }
        }
      `}</style>

      <nav className="cv-nav">
        <Link to="/" className="cv-nav-logo">CLOSET<span>VAULT</span></Link>

        <ul className="cv-nav-links">
          <li><Link to="/launches"           className={isActive("/launches")          ? "nav-active" : ""}>New</Link></li>
          <li><Link to="/shop/shoes"        className={isActive("/shop/shoes")        ? "nav-active" : ""}>Shoes</Link></li>
          <li><Link to="/shop/men"          className={isActive("/shop/men")          ? "nav-active" : ""}>Men</Link></li>
          <li><Link to="/shop/women"        className={isActive("/shop/women")        ? "nav-active" : ""}>Women</Link></li>
          <li><Link to="/shop/accessories"  className={isActive("/shop/accessories")  ? "nav-active" : ""}>Accessories</Link></li>
          <li><Link to="/shop"              className={pathname === "/shop"           ? "nav-active" : ""}>Marketplace</Link></li>
        </ul>

        <div className="cv-nav-actions">
          <div className="cv-nav-search">
            <input type="text" placeholder="Search..." />
            <Search size={14} color="var(--dim, #888)" />
          </div>
          <Link to="/profile"  className="cv-nav-ico"><User        size={20} /></Link>
          <Link to="/wishlist" className="cv-nav-ico"><Heart       size={20} /></Link>
          <Link to="/cart"     className="cv-nav-cart cv-nav-ico">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="cv-nav-badge">{itemCount > 99 ? "99+" : itemCount}</span>
            )}
          </Link>
          <Link to="/seller/dashboard" className="cv-nav-cta">Sell</Link>
        </div>
      </nav>
    </>
  );
}
