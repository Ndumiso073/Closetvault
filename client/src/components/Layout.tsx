import { useState, useEffect } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showTicker?: boolean;
}

const TICKER_ITEMS = [
  "SHOP STREETWEAR", "SNEAKERS & KICKS", "LIMITED DROPS",
  "VERIFIED SELLERS", "SAVE TO VAULT", "SECURE CHECKOUT", "FREE RETURNS",
];

export default function Layout({ children, showTicker = false }: LayoutProps) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&display=swap');

        :root {
          --black:  #0a0a0a;
          --white:  #f5f5f0;
          --accent: #ff2d00;
          --gray:   #141414;
          --mid:    #1e1e1e;
          --dim:    #888;
          --nav-h:  64px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: var(--black); color: var(--white); overflow-x: hidden; width: 100%; }
        #root { width: 100%; }

        /* ─── CURSOR ─── */
        .cv-cur-dot {
          position: fixed; width: 8px; height: 8px;
          background: var(--accent); border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%,-50%);
        }
        .cv-cur-ring {
          position: fixed; width: 34px; height: 34px;
          border: 2px solid rgba(255,45,0,0.3); border-radius: 50%;
          pointer-events: none; z-index: 9998;
          transform: translate(-50%,-50%);
          transition: left .1s ease, top .1s ease;
        }

        /* ─── TICKER ─── */
        .cv-ticker {
          background: var(--accent);
          overflow: hidden; white-space: nowrap; padding: 10px 0; width: 100%;
          margin-top: var(--nav-h);
        }
        .cv-ticker-inner { display: inline-flex; animation: cvTicker 22s linear infinite; }
        .cv-ticker-item {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 4px; color: var(--white);
          padding: 0 32px; display: flex; align-items: center; gap: 32px;
        }
        .cv-ticker-item::after { content: '◆'; font-size: 7px; opacity: .65; }
        @keyframes cvTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ─── PAGE WRAPPER ─── */
        .cv-layout-page {
          padding-top: var(--nav-h);
        }
        .cv-layout-page.with-ticker {
          padding-top: 0;
        }

        @media (max-width: 768px) {
          :root { --nav-h: 56px; }
        }
      `}</style>

      {/* Custom cursor — desktop only */}
      {!isMobile && (
        <>
          <div className="cv-cur-dot"  style={{ left: mousePos.x, top: mousePos.y }} />
          <div className="cv-cur-ring" style={{ left: mousePos.x, top: mousePos.y }} />
        </>
      )}

      <div style={{ cursor: isMobile ? "auto" : "none" }}>
        <Navbar />

        {showTicker && (
          <div className="cv-ticker" aria-hidden="true">
            <div className="cv-ticker-inner">
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {TICKER_ITEMS.map((t, j) => (
                    <div key={j} className="cv-ticker-item">{t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`cv-layout-page${showTicker ? " with-ticker" : ""}`}>
          {children}
        </div>
      </div>
    </>
  );
}
