import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, Check, AlertCircle, ArrowRight, Shield, TrendingUp } from "lucide-react";
import { supabase, type Profile } from "../lib/supabase";

export default function BecomeSellerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login?redirect=/become-seller");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData?.role === 'seller') {
        navigate("/seller/dashboard");
        return;
      }

      setProfile(profileData);
    };
    loadProfile();
  }, [navigate]);

  const handleBecomeSeller = async () => {
    if (!agreed) {
      setError("You must agree to the seller terms to continue");
      return;
    }

    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: 'seller' })
        .eq("id", profile.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to upgrade account");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "60vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{
          width: "80px", 
          height: "80px", 
          background: "var(--accent)", 
          borderRadius: "50%",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center"
        }}>
          <Check size={40} color="white" />
        </div>
        <h2 style={{
          fontFamily: "'Bebas Neue'", 
          fontSize: "32px", 
          letterSpacing: "2px",
          color: "var(--white)",
          margin: 0
        }}>
          SELLER ACCOUNT ACTIVATED!
        </h2>
        <p style={{ color: "var(--dim)", margin: 0 }}>
          Redirecting to your seller dashboard...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .become-seller {
          max-width: 800px; margin: 0 auto;
          padding: 80px 20px;
          font-family: 'Barlow', sans-serif;
        }
        .bs-header {
          text-align: center; margin-bottom: 60px;
        }
        .bs-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 6vw, 56px);
          letter-spacing: -1px; color: var(--white);
          margin-bottom: 16px; line-height: 1.1;
        }
        .bs-subtitle {
          font-size: 18px; color: var(--dim);
          margin-bottom: 32px; line-height: 1.6;
        }
        .bs-benefits {
          display: grid; gap: 24px; margin-bottom: 48px;
        }
        .bs-benefit {
          display: flex; gap: 16px; padding: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
        }
        .bs-benefit-icon {
          width: 48px; height: 48px; background: var(--accent);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .bs-benefit-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 700; color: var(--white);
          margin-bottom: 8px;
        }
        .bs-benefit-text {
          font-size: 14px; color: var(--dim); line-height: 1.5;
        }
        .bs-terms {
          background: rgba(255,45,0,0.1); border: 1px solid rgba(255,45,0,0.2);
          border-radius: 8px; padding: 24px; margin-bottom: 32px;
        }
        .bs-terms-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 700; color: var(--accent);
          margin-bottom: 12px;
        }
        .bs-terms-text {
          font-size: 14px; color: var(--dim); line-height: 1.6; margin-bottom: 16px;
        }
        .bs-checkbox {
          display: flex; align-items: flex-start; gap: 12px;
        }
        .bs-checkbox input {
          margin-top: 2px; flex-shrink: 0;
        }
        .bs-checkbox label {
          font-size: 14px; color: var(--white); line-height: 1.5;
        }
        .bs-actions {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
        }
        .bs-btn-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: var(--accent); color: var(--white);
          border: none; padding: 16px 32px; cursor: pointer;
          clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition: all .25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .bs-btn-primary:hover { 
          background: #ff5533; transform: translateY(-2px); 
          box-shadow: 0 8px 28px rgba(255,45,0,.4); 
        }
        .bs-btn-ghost {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          background: transparent; color: var(--white);
          border: 1px solid rgba(255,255,255,.25); padding: 16px 32px;
          cursor: pointer; text-decoration: none; transition: all .2s;
        }
        .bs-btn-ghost:hover { 
          border-color: var(--white); background: rgba(255,255,255,.06); 
        }
        .bs-error {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
      `}</style>

      <div className="become-seller">
        <div className="bs-header">
          <h1 className="bs-title">
            BECOME A <span style={{ color: "var(--accent)" }}>SELLER</span>
          </h1>
          <p className="bs-subtitle">
            Start selling your streetwear and sneakers on ClosetVault. 
            Reach thousands of verified buyers and grow your business.
          </p>
        </div>

        {error && (
          <div className="bs-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="bs-benefits">
          <div className="bs-benefit">
            <div className="bs-benefit-icon">
              <Store size={24} color="white" />
            </div>
            <div>
              <div className="bs-benefit-title">Your Storefront</div>
              <div className="bs-benefit-text">
                Create your personalized seller profile and showcase your products to thousands of potential buyers.
              </div>
            </div>
          </div>

          <div className="bs-benefit">
            <div className="bs-benefit-icon">
              <TrendingUp size={24} color="white" />
            </div>
            <div>
              <div className="bs-benefit-title">Grow Your Business</div>
              <div className="bs-benefit-text">
                Access sales analytics, track inventory, and manage orders all in one powerful dashboard.
              </div>
            </div>
          </div>

          <div className="bs-benefit">
            <div className="bs-benefit-icon">
              <Shield size={24} color="white" />
            </div>
            <div>
              <div className="bs-benefit-title">Protected Transactions</div>
              <div className="bs-benefit-text">
                Secure payment processing and buyer protection ensures safe transactions for everyone.
              </div>
            </div>
          </div>
        </div>

        <div className="bs-terms">
          <div className="bs-terms-title">Seller Terms & Responsibilities</div>
          <div className="bs-terms-text">
            By becoming a seller, you agree to: accurately describe your products, 
            ship items promptly, provide excellent customer service, and follow 
            ClosetVault's community guidelines. You'll receive payments within 
            3-5 business days after successful delivery.
          </div>
          <div className="bs-checkbox">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError(null);
              }}
            />
            <label htmlFor="terms">
              I agree to the seller terms and conditions and understand my responsibilities as a ClosetVault seller.
            </label>
          </div>
        </div>

        <div className="bs-actions">
          <button 
            className="bs-btn-primary"
            onClick={handleBecomeSeller}
            disabled={!agreed || loading}
          >
            {loading ? "Activating..." : "Become a Seller"} <ArrowRight size={16} />
          </button>
          <Link to="/profile" className="bs-btn-ghost">
            Maybe Later
          </Link>
        </div>
      </div>
    </>
  );
}
