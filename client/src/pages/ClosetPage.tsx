import { useEffect, useState } from "react";
import ClosetItemCard from "../components/ClosetItemCard";
import type { ClosetItem } from "../types";
import { clearCloset, getClosetItems } from "../lib/storage";

export default function ClosetPage() {
  const [items, setItems] = useState<ClosetItem[]>([]);

  const load = () => setItems(getClosetItems());

  useEffect(() => {
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <div>
      <h2>My Closet</h2>
      <p>Saved items (localStorage).</p>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          onClick={() => {
            clearCloset();
            load();
          }}
        >
          Clear All
        </button>
        <button onClick={load}>Refresh</button>
      </div>

      {items.length === 0 ? (
        <p style={{ marginTop: 14, color: "#666" }}>
          No items yet. Go to Scan and save something.
        </p>
      ) : (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((item) => (
            <ClosetItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}