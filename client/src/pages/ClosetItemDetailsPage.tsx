import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ClosetItem, Brand } from "../types";
import {
  addSourceToClosetItem,
  getClosetItemById,
  toggleSourceWatching,
  updateClosetItem,
} from "../lib/storage";

export default function ClosetItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<ClosetItem | undefined>();

  const [newUrl, setNewUrl] = useState("");
  const [newBrand, setNewBrand] = useState<Brand>("other");
  const [newSku, setNewSku] = useState("");

  const load = () => {
    if (!id) return;
    setItem(getClosetItemById(id));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!id) return <p>Missing item id.</p>;
  if (!item) return <p>Item not found.</p>;

  const onAddSource = () => {
    if (!newUrl.trim()) return;

    let domain = "unknown";
    try {
      domain = new URL(newUrl).hostname.replace("www.", "");
    } catch {
      domain = "unknown";
    }

    addSourceToClosetItem(id, {
      brand: newBrand,
      sourceUrl: newUrl.trim(),
      sourceDomain: domain,
      skuOrProductId: newSku.trim() || undefined,
      watching: true,
    });

    setNewUrl("");
    setNewSku("");
    load();
  };

  return (
    <div>
      <h2>{item.title}</h2>

      <img
        src={item.queryImageUrl}
        alt={item.title}
        style={{ width: "100%", maxWidth: 720, borderRadius: 10 }}
      />

      <p style={{ marginTop: 10, color: "#666" }}>
        Added: {item.createdAt} • Sources: {item.sources.length}
      </p>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Notes</label>
        <textarea
          value={item.notes ?? ""}
          onChange={(e) => {
            updateClosetItem(id, { notes: e.target.value });
            load();
          }}
          rows={3}
          style={{ width: "100%", maxWidth: 720 }}
        />
      </div>

      <h3 style={{ marginTop: 18 }}>Add another source</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
        <select value={newBrand} onChange={(e) => setNewBrand(e.target.value as Brand)}>
          <option value="adidas">adidas</option>
          <option value="shein">shein</option>
          <option value="nike">nike</option>
          <option value="other">other</option>
        </select>

        <input
          placeholder="Source URL (product/page link)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />

        <input
          placeholder="SKU/Product ID (optional)"
          value={newSku}
          onChange={(e) => setNewSku(e.target.value)}
        />

        <button onClick={onAddSource}>Add Source</button>
      </div>

      <h3 style={{ marginTop: 18 }}>Sources</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {item.sources.map((s) => (
          <div key={s.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <div><strong>Brand:</strong> {s.brand}</div>
            <div><strong>Domain:</strong> {s.sourceDomain}</div>
            <div><strong>Watching:</strong> {s.watching ? "Yes" : "No"}</div>
            {s.skuOrProductId && <div><strong>SKU/Product ID:</strong> {s.skuOrProductId}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <a href={s.sourceUrl} target="_blank" rel="noreferrer">
                Open source
              </a>
              <button
                onClick={() => {
                  toggleSourceWatching(s.id);
                  load();
                }}
              >
                Toggle Watching
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}