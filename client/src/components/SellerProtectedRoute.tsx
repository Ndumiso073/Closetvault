import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SellerProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSellerRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth/login?redirect=/seller/dashboard");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile || profile.role !== 'seller') {
          // User is not a seller, redirect to become seller page
          navigate("/become-seller");
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Error checking seller role:", error);
        navigate("/become-seller");
      }
    };

    checkSellerRole();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 4, color: "var(--dim)" }}>
          CHECKING SELLER ACCESS...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
