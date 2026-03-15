import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/auth/login", { replace: true });
      else setChecking(false);
    });
  }, []);

  if (checking) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 4, color: "var(--dim)" }}>
        CHECKING ACCESS...
      </div>
    </div>
  );

  return <>{children}</>;
}