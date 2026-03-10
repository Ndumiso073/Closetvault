import { Link } from "react-router-dom";
import type { ClosetItem } from "../types";

export default function ClosetItemCard({ item }: { item: ClosetItem }) {
  return (
    <Link to={`/closet/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <img
          src={item.queryImageUrl}
          alt={item.title}
          style={{ width: "100%", borderRadius: 8, height: 200, objectFit: "cover" }}
        />
        <h3 style={{ margin: "10px 0 4px" }}>{item.title}</h3>
        <p style={{ margin: 0, color: "#666" }}>
          Sources: {item.sources.length} • Added: {item.createdAt}
        </p>
      </div>
    </Link>
  );
}