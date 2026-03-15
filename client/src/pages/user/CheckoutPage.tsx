import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Truck,
  Check, CreditCard, MapPin, Package, ChevronDown, Lock
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";

const DELIVERY_OPTIONS = [
  { id: "std",  label: "Standard Delivery", sub: "3–5 business days", price: 0  },
  { id: "exp",  label: "Express Delivery",  sub: "1–2 business days", price: 12 },
  { id: "over", label: "Overnight",         sub: "Next business day", price: 24 },
];

type Step = "shipping" | "delivery" | "payment" | "success";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep]         = useState<Step>("shipping");
  const [delivery, setDelivery] = useState("std");
  const [cardFlip, setCardFlip] = useState(false);
  const [orderId, setOrderId]   = useState<string | null>(null);

  // shipping form
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", apt: "",
    city: "", province: "", zip: "", country: "ZA",
  });

  // payment form (UI only — not sent to Supabase)
  const [card, setCard] = useState({
    number: "", name: "", expiry: "", cvv: "",
  });

  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const upd  = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const updc = (k: string, v: string) => setCard(c => ({ ...c, [k]: v }));

  const fmtCard   = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = (v: string) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const shipCost  = DELIVERY_OPTIONS.find(o => o.id === delivery)?.price ?? 0;
  const total     = subtotal + shipCost;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  // ── Redirect if cart is empty ──
  if (items.length === 0 && step !== "success") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Barlow Condensed', sans-serif" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 3, color: "var(--white)" }}>Your cart is empty</div>
        <Link to="/shop" style={{ background: "var(--accent)", color: "#fff", padding: "12px 28px", textDecoration: "none", fontWeight: 700, letterSpacing: 2, fontSize: 13, textTransform: "uppercase" }}>
          Browse Marketplace
        </Link>
      </div>
    );
  }

  // ── Validation ──
  const validateShipping = () => {
    const e: Record<string,string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.includes("@")) e.email  = "Invalid email";
    if (!form.address.trim())   e.address   = "Required";
    if (!form.city.trim())      e.city      = "Required";
    if (!form.zip.trim())       e.zip       = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string,string> = {};
    if (card.number.replace(/\s/g,"").length < 16) e.number = "Invalid card number";
    if (!card.name.trim())      e.name   = "Required";
    if (card.expiry.length < 5) e.expiry = "Invalid expiry";
    if (card.cvv.length < 3)    e.cvv    = "Invalid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Place Order → Supabase ──
  const placeOrder = async () => {
    if (!validatePayment()) return;
    setPlacing(true);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrors({ submit: "You must be logged in to place an order." });
        setPlacing(false);
        return;
      }

      // 2. Build shipping address object
      const shipping_address = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone,
        address:   form.address,
        apt:       form.apt,
        city:      form.city,
        province:  form.province,
        zip:       form.zip,
        country:   form.country,
        delivery:  delivery,
      };

      // 3. Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id:          user.id,
          status:           "pending",
          total:            total,
          shipping_address: shipping_address,
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("❌ Order insert error:", orderError?.message);
        setErrors({ submit: orderError?.message ?? "Failed to create order." });
        setPlacing(false);
        return;
      }

      // 4. Insert order_items (one row per cart item)
      const orderItems = items.map(item => ({
        order_id:          order.id,
        product_id:        item.product.id,
        quantity:          item.qty,
        size:              item.size,
        price_at_purchase: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("❌ Order items insert error:", itemsError.message);
        setErrors({ submit: itemsError.message });
        setPlacing(false);
        return;
      }

      // 5. Success — clear cart and show confirmation
      setOrderId(order.id);
      clearCart();
      setStep("success");

    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      setErrors({ submit: err.message ?? "Something went wrong." });
    } finally {
      setPlacing(false);
    }
  };

  const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "shipping", label: "Shipping", icon: <MapPin size={14} /> },
    { id: "delivery", label: "Delivery", icon: <Truck size={14} /> },
    { id: "payment",  label: "Payment",  icon: <CreditCard size={14} /> },
  ];
  const stepIdx = (s: Step) => ["shipping","delivery","payment","success"].indexOf(s);
  const curIdx  = stepIdx(step);

  // ── SUCCESS SCREEN ──
  if (step === "success") {
    const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : "——";
    return (
      <>
        <style>{`
          .co-success {
            display:flex; flex-direction:column; align-items:center;
            justify-content:center; min-height:72vh;
            padding:60px 20px; text-align:center;
            font-family:'Barlow',sans-serif;
            animation:fadeUp .6s ease both;
          }
          .co-success-ring {
            width:88px; height:88px; border-radius:50%;
            border:2px solid var(--accent);
            display:flex; align-items:center; justify-content:center;
            margin-bottom:28px; position:relative;
            animation:pulse 2s ease infinite;
          }
          @keyframes pulse {
            0%,100%{box-shadow:0 0 0 0 rgba(255,45,0,.25)}
            50%{box-shadow:0 0 0 18px rgba(255,45,0,0)}
          }
          .co-success-check {
            width:56px; height:56px; border-radius:50%;
            background:var(--accent);
            display:flex; align-items:center; justify-content:center;
          }
          .co-success-tag {
            font-family:'Barlow Condensed',sans-serif;
            font-size:11px; font-weight:700; letter-spacing:5px; text-transform:uppercase;
            color:var(--accent); margin-bottom:12px;
            display:flex; align-items:center; gap:10px;
          }
          .co-success-tag::before,.co-success-tag::after{content:'';width:28px;height:1px;background:var(--accent)}
          .co-success-title {
            font-family:'Bebas Neue',sans-serif;
            font-size:clamp(40px,6vw,72px);
            letter-spacing:2px; line-height:.95; color:var(--white);
            margin-bottom:14px;
          }
          .co-success-title span{color:var(--accent)}
          .co-success-sub {
            font-size:14px; font-weight:300; color:var(--dim);
            max-width:400px; line-height:1.8; margin-bottom:10px;
          }
          .co-order-num {
            font-family:'Bebas Neue',sans-serif;
            font-size:22px; letter-spacing:4px; color:var(--white);
            background:var(--gray); border:1px solid rgba(255,255,255,.07);
            padding:10px 28px; margin:16px 0 32px;
          }
          .co-order-num span{color:var(--accent)}
          .co-success-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
          .btn-primary {
            font-family:'Barlow Condensed',sans-serif;
            font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
            background:var(--accent); color:var(--white);
            border:none; padding:13px 32px; cursor:pointer; text-decoration:none;
            clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
            transition:all .25s; display:inline-flex; align-items:center; gap:8px;
          }
          .btn-primary:hover{background:#ff5533;transform:translateY(-2px)}
          .btn-ghost {
            font-family:'Barlow Condensed',sans-serif;
            font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
            background:transparent; color:var(--white);
            border:1px solid rgba(255,255,255,.2); padding:12px 28px; cursor:pointer;
            text-decoration:none; transition:all .2s;
            display:inline-flex; align-items:center; gap:8px;
          }
          .btn-ghost:hover{border-color:var(--white)}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        `}</style>
        <div className="co-success">
          <div className="co-success-tag">Order Confirmed</div>
          <div className="co-success-ring">
            <div className="co-success-check">
              <Check size={26} color="#f5f5f0" strokeWidth={3} />
            </div>
          </div>
          <h1 className="co-success-title">ORDER<br /><span>PLACED.</span></h1>
          <p className="co-success-sub">
            Your order has been confirmed and will be dispatched shortly.
            A confirmation has been sent to <strong style={{color:"var(--white)"}}>{form.email || "your inbox"}</strong>.
          </p>
          <div className="co-order-num">
            ORDER <span>#{shortId}</span>
          </div>
          <div className="co-success-actions">
            <Link to="/orders" className="btn-primary">
              <Package size={14} /> View My Orders
            </Link>
            <Link to="/shop" className="btn-ghost">Continue Shopping</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .co{max-width:1320px;margin:0 auto;padding:32px 20px 100px;font-family:'Barlow',sans-serif}
        @media(min-width:768px){.co{padding:40px 40px 100px}}
        @media(min-width:1200px){.co{padding:44px 60px 100px}}
        .co-crumb{display:flex;align-items:center;gap:6px;margin-bottom:28px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
        .co-crumb a{color:var(--dim);text-decoration:none;transition:color .2s}
        .co-crumb a:hover{color:var(--white)}
        .co-crumb-sep{color:rgba(255,255,255,.15);font-size:9px}
        .co-crumb-cur{color:var(--accent)}
        .co-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,4vw,48px);letter-spacing:2px;line-height:.95;color:var(--white);margin-bottom:32px}
        .co-title span{color:var(--accent)}
        .co-stepper{display:flex;align-items:center;margin-bottom:36px;overflow-x:auto;border:1px solid rgba(255,255,255,.07)}
        .co-step{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 12px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim);background:var(--gray);border-right:1px solid rgba(255,255,255,.07);transition:all .2s;white-space:nowrap}
        @media(max-width:480px){.co-step-label{display:none}.co-step{padding:12px 8px;gap:6px}}
        .co-step:last-child{border-right:none}
        .co-step.done{color:var(--white);cursor:pointer}
        .co-step.done:hover{background:var(--mid)}
        .co-step.active{background:var(--mid);color:var(--white);border-bottom:2px solid var(--accent)}
        .co-step-num{width:20px;height:20px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;background:rgba(255,255,255,.08);color:var(--dim);transition:all .2s}
        .co-step.done .co-step-num,.co-step.active .co-step-num{background:var(--accent);color:var(--white)}
        .co-grid{display:grid;grid-template-columns:1fr;gap:24px;align-items:start}
        @media(min-width:1024px){.co-grid{grid-template-columns:1fr 360px;gap:32px}}
        .co-card{background:var(--gray);border:1px solid rgba(255,255,255,.07);animation:fadeUp .4s ease both}
        .co-card-header{padding:18px 24px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px}
        .co-card-icon{width:30px;height:30px;background:rgba(255,45,0,.1);border:1px solid rgba(255,45,0,.2);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0}
        .co-card-title{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:3px;color:var(--white)}
        .co-card-body{padding:24px}
        .co-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .co-form-grid.full{grid-template-columns:1fr}
        @media(max-width:599px){.co-form-grid{grid-template-columns:1fr}}
        .co-field{display:flex;flex-direction:column;gap:6px}
        .co-field.span2{grid-column:1/-1}
        .co-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--dim)}
        .co-input{background:var(--mid);border:1px solid rgba(255,255,255,.1);color:var(--white);font-family:'Barlow',sans-serif;font-size:14px;padding:11px 14px;outline:none;transition:border-color .2s;width:100%}
        .co-input:focus{border-color:var(--accent)}
        .co-input.err{border-color:var(--accent)}
        .co-input::placeholder{color:rgba(255,255,255,.2);font-size:13px}
        .co-err-msg{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;color:var(--accent)}
        .co-select{background:var(--mid);border:1px solid rgba(255,255,255,.1);color:var(--white);font-family:'Barlow',sans-serif;font-size:14px;padding:11px 14px;outline:none;transition:border-color .2s;width:100%;-webkit-appearance:none;cursor:pointer}
        .co-select:focus{border-color:var(--accent)}
        .co-select-wrap{position:relative}
        .co-select-wrap svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--dim)}
        .co-delivery-opts{display:flex;flex-direction:column;gap:6px}
        .co-del-opt{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--mid);border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:border-color .2s}
        .co-del-opt.on{border-color:var(--accent)}
        .co-del-opt:hover:not(.on){border-color:rgba(255,255,255,.15)}
        .co-del-left{display:flex;align-items:center;gap:12px}
        .co-del-radio{width:16px;height:16px;border-radius:50%;border:1px solid rgba(255,255,255,.2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color .2s}
        .co-del-opt.on .co-del-radio{border-color:var(--accent)}
        .co-del-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);display:none}
        .co-del-opt.on .co-del-dot{display:block}
        .co-del-name{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;color:var(--white);margin-bottom:2px}
        .co-del-sub{font-size:12px;font-weight:300;color:var(--dim)}
        .co-del-price{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;color:var(--white)}
        .co-del-price.free{color:#22c55e}
        .co-card-visual{width:100%;max-width:340px;aspect-ratio:1.586;background:linear-gradient(135deg,#1e1e1e 0%,#0a0a0a 100%);border:1px solid rgba(255,255,255,.1);padding:20px 22px;position:relative;margin-bottom:24px;overflow:hidden}
        .co-card-visual::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,rgba(255,45,0,.08),transparent 60%)}
        .co-card-brand{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:4px;color:var(--white);opacity:.6;position:relative;z-index:1}
        .co-card-brand span{color:var(--accent);opacity:1}
        .co-card-chip{width:32px;height:24px;background:rgba(255,200,0,.3);border:1px solid rgba(255,200,0,.4);border-radius:3px;margin:16px 0;position:relative;z-index:1}
        .co-card-num{font-family:'Barlow Condensed',sans-serif;font-size:16px;letter-spacing:4px;color:var(--white);position:relative;z-index:1;margin-bottom:14px}
        .co-card-bottom{display:flex;justify-content:space-between;position:relative;z-index:1}
        .co-card-field-label{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-bottom:3px}
        .co-card-field-val{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;color:var(--white)}
        .co-nav{display:flex;align-items:center;justify-content:space-between;margin-top:24px;gap:10px;flex-wrap:wrap}
        .co-btn-back{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:transparent;color:var(--dim);border:1px solid rgba(255,255,255,.12);padding:12px 24px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px}
        .co-btn-back:hover{border-color:rgba(255,255,255,.3);color:var(--white)}
        .co-btn-next{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:var(--accent);color:var(--white);border:none;padding:13px 32px;cursor:pointer;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);display:flex;align-items:center;gap:8px;transition:all .25s;position:relative;overflow:hidden}
        .co-btn-next::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.18);transform:translateX(-120%) skewX(-15deg);transition:transform .4s ease}
        .co-btn-next:hover::after{transform:translateX(120%) skewX(-15deg)}
        .co-btn-next:hover{background:#ff5533;transform:translateY(-2px)}
        .co-btn-next:disabled{opacity:.6;pointer-events:none}
        .co-summary{background:var(--gray);border:1px solid rgba(255,255,255,.07)}
        @media(min-width:1024px){.co-summary{position:sticky;top:calc(var(--nav-h,64px) + 16px)}}
        .cs-hdr{padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
        .cs-hdr-title{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:4px;color:var(--white)}
        .cs-hdr-count{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
        .co-summary-body{padding:16px 20px}
        .co-order-items{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
        .co-oi{display:flex;align-items:center;gap:12px}
        .co-oi-img{width:52px;height:52px;flex-shrink:0;overflow:hidden;background:var(--mid)}
        .co-oi-img img{width:100%;height:100%;object-fit:cover;filter:brightness(.8)}
        .co-oi-info{flex:1;min-width:0}
        .co-oi-name{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}
        .co-oi-meta{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1px;color:var(--dim)}
        .co-oi-price{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:var(--white);flex-shrink:0}
        .co-rule{border:none;border-top:1px solid rgba(255,255,255,.07);margin:14px 0}
        .co-line{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
        .co-line-lbl{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
        .co-line-val{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;color:var(--white)}
        .co-line-val.free{color:#22c55e}
        .co-total{display:flex;align-items:baseline;justify-content:space-between;margin:14px 0 16px}
        .co-total-lbl{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:3px;color:var(--white)}
        .co-total-val{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:1px;color:var(--white)}
        .co-secure{display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
        .co-secure svg{color:var(--accent);flex-shrink:0}
        .co-submit-err{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;color:#ff6b6b;margin-top:10px;padding:10px 14px;background:rgba(255,45,0,.08);border:1px solid rgba(255,45,0,.2)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{animation:spin .8s linear infinite}
      `}</style>

      <div className="co">
        {/* BREADCRUMB */}
        <nav className="co-crumb">
          <Link to="/">Home</Link>
          <span className="co-crumb-sep">›</span>
          <Link to="/cart">Cart</Link>
          <span className="co-crumb-sep">›</span>
          <span className="co-crumb-cur">Checkout</span>
        </nav>

        <h1 className="co-title">SECURE <span>CHECKOUT</span></h1>

        {/* STEPPER */}
        <div className="co-stepper">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`co-step ${step === s.id ? "active" : curIdx > i ? "done" : ""}`}
              onClick={() => curIdx > i && setStep(s.id)}
            >
              <div className="co-step-num">
                {curIdx > i ? <Check size={10} /> : i + 1}
              </div>
              {s.icon}
              <span className="co-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="co-grid">

          {/* ── MAIN FORM ── */}
          <div>

            {/* STEP 1: SHIPPING */}
            {step === "shipping" && (
              <div className="co-card" key="shipping">
                <div className="co-card-header">
                  <div className="co-card-icon"><MapPin size={14} /></div>
                  <span className="co-card-title">Shipping Address</span>
                </div>
                <div className="co-card-body">
                  <div className="co-form-grid">
                    <div className="co-field">
                      <label className="co-label">First Name</label>
                      <input className={`co-input ${errors.firstName?"err":""}`} placeholder="Jordan"
                        value={form.firstName} onChange={e => upd("firstName", e.target.value)} />
                      {errors.firstName && <span className="co-err-msg">{errors.firstName}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Last Name</label>
                      <input className={`co-input ${errors.lastName?"err":""}`} placeholder="Khumalo"
                        value={form.lastName} onChange={e => upd("lastName", e.target.value)} />
                      {errors.lastName && <span className="co-err-msg">{errors.lastName}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Email</label>
                      <input className={`co-input ${errors.email?"err":""}`} placeholder="you@email.com"
                        type="email" value={form.email} onChange={e => upd("email", e.target.value)} />
                      {errors.email && <span className="co-err-msg">{errors.email}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Phone</label>
                      <input className="co-input" placeholder="+27 72 000 0000"
                        value={form.phone} onChange={e => upd("phone", e.target.value)} />
                    </div>
                    <div className="co-field span2">
                      <label className="co-label">Street Address</label>
                      <input className={`co-input ${errors.address?"err":""}`} placeholder="123 Main Street"
                        value={form.address} onChange={e => upd("address", e.target.value)} />
                      {errors.address && <span className="co-err-msg">{errors.address}</span>}
                    </div>
                    <div className="co-field span2">
                      <label className="co-label">Apt / Suite / Unit (optional)</label>
                      <input className="co-input" placeholder="Unit 4B"
                        value={form.apt} onChange={e => upd("apt", e.target.value)} />
                    </div>
                    <div className="co-field">
                      <label className="co-label">City</label>
                      <input className={`co-input ${errors.city?"err":""}`} placeholder="Johannesburg"
                        value={form.city} onChange={e => upd("city", e.target.value)} />
                      {errors.city && <span className="co-err-msg">{errors.city}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Province</label>
                      <div className="co-select-wrap">
                        <select className="co-select" value={form.province}
                          onChange={e => upd("province", e.target.value)}>
                          <option value="">Select province</option>
                          {["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo",
                            "Mpumalanga","North West","Free State","Northern Cape"].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown size={13} />
                      </div>
                    </div>
                    <div className="co-field">
                      <label className="co-label">Postal Code</label>
                      <input className={`co-input ${errors.zip?"err":""}`} placeholder="2000"
                        value={form.zip} onChange={e => upd("zip", e.target.value)} />
                      {errors.zip && <span className="co-err-msg">{errors.zip}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Country</label>
                      <div className="co-select-wrap">
                        <select className="co-select" value={form.country}
                          onChange={e => upd("country", e.target.value)}>
                          <option value="ZA">South Africa</option>
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="NG">Nigeria</option>
                          <option value="KE">Kenya</option>
                        </select>
                        <ChevronDown size={13} />
                      </div>
                    </div>
                  </div>
                  <div className="co-nav">
                    <Link to="/cart" style={{ textDecoration:"none" }}>
                      <button className="co-btn-back">← Back to Cart</button>
                    </Link>
                    <button className="co-btn-next"
                      onClick={() => { if (validateShipping()) setStep("delivery"); }}>
                      Continue to Delivery <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY */}
            {step === "delivery" && (
              <div className="co-card" key="delivery">
                <div className="co-card-header">
                  <div className="co-card-icon"><Truck size={14} /></div>
                  <span className="co-card-title">Delivery Method</span>
                </div>
                <div className="co-card-body">
                  <div className="co-delivery-opts">
                    {DELIVERY_OPTIONS.map(opt => (
                      <div key={opt.id}
                        className={`co-del-opt ${delivery===opt.id?"on":""}`}
                        onClick={() => setDelivery(opt.id)}>
                        <div className="co-del-left">
                          <div className="co-del-radio"><div className="co-del-dot"/></div>
                          <div>
                            <div className="co-del-name">{opt.label}</div>
                            <div className="co-del-sub">{opt.sub}</div>
                          </div>
                        </div>
                        <span className={`co-del-price ${opt.price===0?"free":""}`}>
                          {opt.price===0 ? "FREE" : `R${opt.price}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="co-nav">
                    <button className="co-btn-back" onClick={() => setStep("shipping")}>← Shipping</button>
                    <button className="co-btn-next" onClick={() => setStep("payment")}>
                      Continue to Payment <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === "payment" && (
              <div className="co-card" key="payment">
                <div className="co-card-header">
                  <div className="co-card-icon"><CreditCard size={14} /></div>
                  <span className="co-card-title">Payment Details</span>
                </div>
                <div className="co-card-body">
                  {/* Visual card */}
                  <div className="co-card-visual">
                    <div className="co-card-brand">CLOSET<span>VAULT</span></div>
                    <div className="co-card-chip"/>
                    <div className="co-card-num">
                      {card.number || "•••• •••• •••• ••••"}
                    </div>
                    <div className="co-card-bottom">
                      <div>
                        <div className="co-card-field-label">Card Holder</div>
                        <div className="co-card-field-val">{card.name || "YOUR NAME"}</div>
                      </div>
                      <div>
                        <div className="co-card-field-label">Expires</div>
                        <div className="co-card-field-val">{card.expiry || "MM/YY"}</div>
                      </div>
                      <div>
                        <div className="co-card-field-label">CVV</div>
                        <div className="co-card-field-val">{cardFlip ? card.cvv || "•••" : "•••"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="co-form-grid full">
                    <div className="co-field">
                      <label className="co-label">Card Number</label>
                      <input className={`co-input ${errors.number?"err":""}`}
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={e => updc("number", fmtCard(e.target.value))}
                        maxLength={19} />
                      {errors.number && <span className="co-err-msg">{errors.number}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">Name on Card</label>
                      <input className={`co-input ${errors.name?"err":""}`}
                        placeholder="Jordan Khumalo"
                        value={card.name}
                        onChange={e => updc("name", e.target.value)} />
                      {errors.name && <span className="co-err-msg">{errors.name}</span>}
                    </div>
                  </div>
                  <div className="co-form-grid">
                    <div className="co-field">
                      <label className="co-label">Expiry Date</label>
                      <input className={`co-input ${errors.expiry?"err":""}`}
                        placeholder="MM/YY" value={card.expiry}
                        onChange={e => updc("expiry", fmtExpiry(e.target.value))}
                        maxLength={5} />
                      {errors.expiry && <span className="co-err-msg">{errors.expiry}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">CVV</label>
                      <input className={`co-input ${errors.cvv?"err":""}`}
                        placeholder="•••" type="password"
                        value={card.cvv}
                        onChange={e => updc("cvv", e.target.value.replace(/\D/g,"").slice(0,4))}
                        onFocus={() => setCardFlip(true)}
                        onBlur={() => setCardFlip(false)}
                        maxLength={4} />
                      {errors.cvv && <span className="co-err-msg">{errors.cvv}</span>}
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="co-submit-err">{errors.submit}</div>
                  )}

                  <div className="co-nav">
                    <button className="co-btn-back" onClick={() => setStep("delivery")}>← Delivery</button>
                    <button className="co-btn-next" onClick={placeOrder} disabled={placing}>
                      {placing ? (
                        <>
                          <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <><Lock size={13}/> Place Order · R{total}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── ORDER SUMMARY (real cart data) ── */}
          <div className="co-summary" style={{ animation:"fadeUp .5s ease .2s both" }}>
            <div className="cs-hdr">
              <span className="cs-hdr-title">Your Order</span>
              <span className="cs-hdr-count">{itemCount} item{itemCount!==1?"s":""}</span>
            </div>
            <div className="co-summary-body">
              <div className="co-order-items">
                {items.map(item => (
                  <div key={item.cartId} className="co-oi">
                    <div className="co-oi-img">
                      <img
                        src={(item.product as any).images?.[0] ?? (item.product as any).img ?? "/assets/placeholder.jpg"}
                        alt={(item.product as any).title ?? item.product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="co-oi-info">
                      <div className="co-oi-name">{(item.product as any).title ?? item.product.name}</div>
                      <div className="co-oi-meta">
                        {item.product.brand} · Size {item.size} · Qty {item.qty}
                      </div>
                    </div>
                    <div className="co-oi-price">R{item.product.price * item.qty}</div>
                  </div>
                ))}
              </div>

              <hr className="co-rule"/>

              <div className="co-line">
                <span className="co-line-lbl">Subtotal</span>
                <span className="co-line-val">R{subtotal}</span>
              </div>
              <div className="co-line">
                <span className="co-line-lbl">Shipping</span>
                <span className={`co-line-val ${shipCost===0?"free":""}`}>
                  {shipCost===0 ? "FREE" : `R${shipCost}`}
                </span>
              </div>
              <div className="co-line">
                <span className="co-line-lbl">Tax</span>
                <span className="co-line-val" style={{color:"var(--dim)"}}>TBD</span>
              </div>

              <hr className="co-rule"/>

              <div className="co-total">
                <span className="co-total-lbl">Total</span>
                <span className="co-total-val">R{total}</span>
              </div>

              <div className="co-secure">
                <Lock size={12}/>
                SSL encrypted · Secured by Supabase
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}