import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Tag, Shield, Truck, RotateCcw, ArrowLeft, Lock } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";

const SHIPPING_OPTIONS = [
  { id: "std",  label: "Standard (3–5 days)", price: 0   },
  { id: "exp",  label: "Express (1–2 days)",  price: 12  },
  { id: "over", label: "Overnight",           price: 24  },
];

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromo]  = useState(false);
  const [promoErr, setPromoErr]   = useState(false);
  const [shipping, setShipping]   = useState("std");
  const [removing, setRemoving]   = useState<string | null>(null);

  const removeItem = (cartId: string) => {
    setRemoving(cartId);
    setTimeout(() => {
      removeFromCart(cartId);
      setRemoving(null);
    }, 320);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "VAULT10") {
      setPromo(true); setPromoErr(false);
    } else {
      setPromoErr(true); setPromo(false);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      // Redirect to login with checkout redirect
      navigate("/auth/login?redirect=/checkout");
    }
  };

  const subtotal     = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount     = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 0;
  const total        = subtotal - discount + shippingCost;
  const itemCount    = items.reduce((s, i) => s + i.qty, 0);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 4, color: "var(--dim)" }}>
          LOADING CART...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ── PAGE ── */
        .cart {
          max-width: 1320px; margin: 0 auto;
          padding: 32px 20px 100px;
          font-family: 'Barlow', sans-serif;
        }
        @media (min-width: 768px)  { .cart { padding: 40px 40px 100px; } }
        @media (min-width: 1200px) { .cart { padding: 44px 60px 100px; } }

        /* ── BREADCRUMB ── */
        .cart-crumb {
          display: flex; align-items: center; gap: 6px; margin-bottom: 32px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .cart-crumb a { color: var(--dim); text-decoration: none; transition: color .2s; }
        .cart-crumb a:hover { color: var(--white); }
        .cart-crumb-sep { color: rgba(255,255,255,.15); font-size: 9px; }
        .cart-crumb-cur { color: var(--accent); }

        /* ── PAGE TITLE ── */
        .cart-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 54px);
          letter-spacing: 2px; line-height: .95;
          color: var(--white); margin-bottom: 6px;
        }
        .cart-title span { color: var(--accent); }
        .cart-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 32px;
        }

        /* ── TWO-COLUMN LAYOUT ── */
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .cart-grid { grid-template-columns: 1fr 360px; gap: 32px; }
        }

        /* ── ITEMS COLUMN ── */
        .cart-items { display: flex; flex-direction: column; gap: 3px; }

        /* column header */
        .cart-items-header {
          display: grid;
          grid-template-columns: 1fr 120px 120px 100px 32px;
          gap: 12px; align-items: center;
          padding: 0 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .cart-col-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: var(--dim);
        }
        .cart-col-label.right { text-align: right; }
        .cart-col-label.center { text-align: center; }
        @media (max-width: 767px) { .cart-items-header { display: none; } }

        /* ── SINGLE ITEM ROW ── */
        .cart-item {
          display: grid;
          grid-template-columns: 1fr 120px 120px 100px 32px;
          gap: 12px; align-items: center;
          padding: 16px;
          background: var(--gray);
          border-top: 2px solid rgba(255,255,255,.04);
          transition: border-color .2s, opacity .3s, transform .3s;
          position: relative;
        }
        .cart-item:hover { border-color: rgba(255,255,255,.1); }
        .cart-item.removing {
          opacity: 0; transform: translateX(16px);
        }

        /* product cell */
        .ci-product { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .ci-img {
          width: 80px; height: 80px; flex-shrink: 0; overflow: hidden;
          background: var(--mid);
        }
        .ci-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.85) saturate(.8);
          transition: filter .3s;
        }
        .cart-item:hover .ci-img img { filter: brightness(.95) saturate(1); }
        .ci-details { min-width: 0; }
        .ci-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: var(--dim);
          margin-bottom: 3px;
        }
        .ci-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 1px;
          color: var(--white); margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ci-meta {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .ci-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 2px 8px;
          background: var(--mid); border: 1px solid rgba(255,255,255,.08); color: var(--dim);
        }

        /* size cell */
        .ci-size {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 2px; color: var(--white);
          text-align: center;
        }

        /* qty cell */
        .ci-qty {
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .qty-btn {
          width: 44px; height: 44px; background: var(--mid);
          border: 1px solid rgba(255,255,255,.1);
          color: var(--dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s; flex-shrink: 0;
        }
        .qty-btn:hover { border-color: var(--accent); color: var(--accent); }
        .qty-btn:disabled { opacity: .3; pointer-events: none; }
        .qty-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 2px; color: var(--white);
          min-width: 24px; text-align: center;
        }

        /* price cell */
        .ci-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 1px; color: var(--white);
          text-align: right;
        }

        /* remove cell */
        .ci-remove {
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,.2); transition: color .2s;
          display: flex; align-items: center; justify-content: center;
          padding: 12px; min-width: 44px; min-height: 44px;
        }
        .ci-remove:hover { color: var(--accent); }

        /* ── MOBILE CARD LAYOUT ── */
        @media (max-width: 767px) {
          .cart-item {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 12px;
          }
          .ci-product { grid-column: 1; }
          .ci-size    { text-align: left; font-size: 14px; }
          .ci-qty     { justify-content: flex-start; }
          .ci-price   { text-align: left; }
          .ci-remove  { position: absolute; top: 14px; right: 14px; }
          .cart-item {
            display: flex; flex-wrap: wrap; align-items: flex-start;
            gap: 12px;
          }
          .ci-product { flex: 1 1 100%; }
          .ci-size, .ci-qty, .ci-price { flex-shrink: 0; }
        }

        /* ── EMPTY STATE ── */
        .cart-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 20px; text-align: center;
          background: var(--gray); border-top: 2px solid rgba(255,255,255,.04);
        }
        .cart-empty-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 96px; color: rgba(255,255,255,.04);
          line-height: 1; margin-bottom: 12px;
        }
        .cart-empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 3px; color: var(--dim);
          margin-bottom: 8px;
        }
        .cart-empty-sub { font-size: 14px; color: var(--dim); margin-bottom: 28px; }

        /* continue shopping link */
        .cart-continue {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); text-decoration: none; transition: color .2s;
        }
        .cart-continue:hover { color: var(--white); }

        /* ── ORDER SUMMARY PANEL ── */
        .cart-summary {
          background: var(--gray);
          border: 1px solid rgba(255,255,255,.07);
        }
        @media (min-width: 1024px) {
          .cart-summary {
            position: sticky;
            top: calc(var(--nav-h, 64px) + 16px);
          }
        }
        .cs-header {
          padding: 20px 22px 16px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .cs-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 4px; color: var(--white);
        }
        .cs-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 0; }

        /* promo code */
        .cs-promo { margin-bottom: 20px; }
        .cs-promo-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
        .cs-promo-row { display: flex; gap: 6px; }
        .cs-promo-input {
          flex: 1; background: var(--mid); border: 1px solid rgba(255,255,255,.1);
          color: var(--white); font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          padding: 9px 12px; outline: none; transition: border-color .2s;
        }
        .cs-promo-input:focus { border-color: var(--accent); }
        .cs-promo-input::placeholder { color: var(--dim); font-size: 11px; }
        .cs-promo-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: var(--mid); color: var(--white);
          border: 1px solid rgba(255,255,255,.15); padding: 9px 16px; cursor: pointer;
          transition: all .2s; white-space: nowrap;
        }
        .cs-promo-btn:hover { background: var(--black); border-color: rgba(255,255,255,.3); }
        .cs-promo-btn.applied { background: #16a34a; border-color: #16a34a; }
        .cs-promo-msg {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          margin-top: 6px;
        }
        .cs-promo-msg.ok  { color: #22c55e; }
        .cs-promo-msg.err { color: var(--accent); }

        /* shipping options */
        .cs-shipping { margin-bottom: 20px; }
        .cs-shipping-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--dim); margin-bottom: 8px;
        }
        .cs-ship-opts { display: flex; flex-direction: column; gap: 4px; }
        .cs-ship-opt {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; background: var(--mid);
          border: 1px solid transparent; cursor: pointer; transition: border-color .2s;
        }
        .cs-ship-opt.on { border-color: var(--accent); }
        .cs-ship-opt:hover:not(.on) { border-color: rgba(255,255,255,.1); }
        .cs-ship-opt-left { display: flex; align-items: center; gap: 10px; }
        .cs-ship-radio {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: border-color .2s;
        }
        .cs-ship-opt.on .cs-ship-radio { border-color: var(--accent); }
        .cs-ship-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); display: none;
        }
        .cs-ship-opt.on .cs-ship-dot { display: block; }
        .cs-ship-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 1px; color: var(--dim);
          transition: color .2s;
        }
        .cs-ship-opt.on .cs-ship-name { color: var(--white); }
        .cs-ship-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px; letter-spacing: 1px; color: var(--white);
        }

        /* order line items */
        .cs-rule { border: none; border-top: 1px solid rgba(255,255,255,.07); margin: 16px 0; }
        .cs-line {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .cs-line-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--dim);
        }
        .cs-line-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 1px; color: var(--white);
        }
        .cs-line-val.green { color: #22c55e; }
        .cs-line-val.dim   { color: var(--dim); }

        /* total */
        .cs-total {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 20px;
        }
        .cs-total-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 3px; color: var(--white);
        }
        .cs-total-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 1px; color: var(--white);
        }

        /* checkout button */
        .cs-checkout {
          width: 100%; font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 16px; cursor: pointer;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .25s; margin-bottom: 12px;
          position: relative; overflow: hidden;
        }
        .cs-checkout::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.18);
          transform: translateX(-120%) skewX(-15deg); transition: transform .4s ease;
        }
        .cs-checkout:hover::after { transform: translateX(120%) skewX(-15deg); }
        .cs-checkout:hover { background: #ff5533; transform: translateY(-2px); }
        .cs-checkout:disabled {
          opacity: .4; pointer-events: none; filter: grayscale(1);
        }

        /* trust badges in summary */
        .cs-trust {
          display: flex; flex-direction: column; gap: 7px;
          padding-top: 16px; border-top: 1px solid rgba(255,255,255,.07);
        }
        .cs-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--dim);
        }
        .cs-trust-item svg { color: var(--accent); flex-shrink: 0; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="cart">

        {/* BREADCRUMB */}
        <nav className="cart-crumb">
          <Link to="/">Home</Link>
          <span className="cart-crumb-sep">›</span>
          <Link to="/shop">Marketplace</Link>
          <span className="cart-crumb-sep">›</span>
          <span className="cart-crumb-cur">Cart</span>
        </nav>

        {/* TITLE */}
        <h1 className="cart-title">
          YOUR <span>CART</span>
        </h1>
        <p className="cart-sub">
          {itemCount > 0
            ? `${itemCount} item${itemCount !== 1 ? "s" : ""} in your vault`
            : "Your cart is empty"}
        </p>

        <div className="cart-grid">

          {/* ── ITEMS COLUMN ── */}
          <div>
            {/* column headers — desktop only */}
            {items.length > 0 && (
              <div className="cart-items-header">
                <span className="cart-col-label">Product</span>
                <span className="cart-col-label center">Size</span>
                <span className="cart-col-label center">Quantity</span>
                <span className="cart-col-label right">Price</span>
                <span />
              </div>
            )}

            <div className="cart-items">
              {items.length === 0 ? (
                <div className="cart-empty" style={{ animation: "fadeUp .4s ease both" }}>
                  <div className="cart-empty-icon">∅</div>
                  <div className="cart-empty-title">Cart is Empty</div>
                  <p className="cart-empty-sub">Looks like you haven't added anything yet.</p>
                  <Link to="/shop" className="cs-checkout" style={{ textDecoration: "none", display: "inline-flex", width: "auto", padding: "14px 36px" }}>
                    <ShoppingBag size={14} /> Browse Marketplace
                  </Link>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={item.cartId}
                    className={`cart-item ${removing === item.cartId ? "removing" : ""}`}
                    style={{ animation: `fadeUp .4s ease ${idx * 0.06}s both` }}
                  >
                    {/* product */}
                    <div className="ci-product">
                      <div className="ci-img">
                        <img src={item.product.img} alt={item.product.name} loading="lazy" />
                      </div>
                      <div className="ci-details">
                        <div className="ci-brand">{item.product.brand}</div>
                        <div className="ci-name">{item.product.name}</div>
                        <div className="ci-meta">
                          <span className="ci-tag">{item.product.condition}</span>
                          <span className="ci-tag">{item.product.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* size */}
                    <div className="ci-size">US {item.size}</div>

                    {/* qty */}
                    <div className="ci-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.cartId, -1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.cartId, 1)}
                        disabled={item.qty >= 10}
                        aria-label="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* price */}
                    <div className="ci-price">R{item.product.price * item.qty}</div>

                    {/* remove */}
                    <button
                      className="ci-remove"
                      onClick={() => removeItem(item.cartId)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* continue shopping */}
            {items.length > 0 && (
              <Link to="/shop" className="cart-continue">
                <ArrowLeft size={13} /> Continue Shopping
              </Link>
            )}
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="cart-summary" style={{ animation: "fadeUp .5s ease .15s both" }}>
            <div className="cs-header">
              <div className="cs-title">Order Summary</div>
            </div>

            <div className="cs-body">

              {/* PROMO CODE */}
              <div className="cs-promo">
                <div className="cs-promo-label">
                  <Tag size={12} /> Promo Code
                </div>
                <div className="cs-promo-row">
                  <input
                    type="text"
                    className="cs-promo-input"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoErr(false); }}
                    disabled={promoApplied}
                  />
                  <button
                    className={`cs-promo-btn ${promoApplied ? "applied" : ""}`}
                    onClick={applyPromo}
                    disabled={promoApplied || !promoCode.trim()}
                  >
                    {promoApplied ? "✓" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <div className="cs-promo-msg ok">✓ VAULT10 — 10% discount applied</div>
                )}
                {promoErr && (
                  <div className="cs-promo-msg err">✗ Invalid promo code</div>
                )}
              </div>

              {/* SHIPPING */}
              <div className="cs-shipping">
                <div className="cs-shipping-label">Shipping Method</div>
                <div className="cs-ship-opts">
                  {SHIPPING_OPTIONS.map(opt => (
                    <div
                      key={opt.id}
                      className={`cs-ship-opt ${shipping === opt.id ? "on" : ""}`}
                      onClick={() => setShipping(opt.id)}
                    >
                      <div className="cs-ship-opt-left">
                        <div className="cs-ship-radio">
                          <div className="cs-ship-dot" />
                        </div>
                        <span className="cs-ship-name">{opt.label}</span>
                      </div>
                      <span className="cs-ship-price">
                        {opt.price === 0 ? "FREE" : `R${opt.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="cs-rule" />

              {/* LINE ITEMS */}
              <div className="cs-line">
                <span className="cs-line-label">
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </span>
                <span className="cs-line-val">R{subtotal}</span>
              </div>

              {promoApplied && (
                <div className="cs-line">
                  <span className="cs-line-label">Discount (10%)</span>
                  <span className="cs-line-val green">−${discount}</span>
                </div>
              )}

              <div className="cs-line">
                <span className="cs-line-label">Shipping</span>
                <span className={`cs-line-val ${shippingCost === 0 ? "green" : ""}`}>
                  {shippingCost === 0 ? "FREE" : `R${shippingCost}`}
                </span>
              </div>

              <div className="cs-line">
                <span className="cs-line-label">Estimated Tax</span>
                <span className="cs-line-val dim">TBD</span>
              </div>

              <hr className="cs-rule" />

              {/* TOTAL */}
              <div className="cs-total">
                <span className="cs-total-label">Total</span>
                <span className="cs-total-val">R{total}</span>
              </div>

              {/* CHECKOUT */}
              <button
                className="cs-checkout"
                disabled={items.length === 0}
                onClick={handleCheckout}
              >
                <ShoppingBag size={15} />
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                <ChevronRight size={14} />
              </button>

              {/* Guest messaging */}
              {!isAuthenticated && items.length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "var(--dim)",
                  lineHeight: "1.5",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                    <Lock size={14} />
                    <strong style={{ color: "var(--white)" }}>Secure Checkout</strong>
                  </div>
                  Login to complete your purchase. Your cart items will be saved during checkout.
                </div>
              )}

              {/* TRUST */}
              <div className="cs-trust">
                <div className="cs-trust-item"><Shield size={12} /> Secure & encrypted checkout</div>
                <div className="cs-trust-item"><Truck size={12} /> All orders tracked & insured</div>
                <div className="cs-trust-item"><RotateCcw size={12} /> 14-day hassle-free returns</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}