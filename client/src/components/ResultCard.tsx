import type { ScanResult } from "../types";

export default function ResultCard({
  result,
  onSave,
}: {
  result: ScanResult;
  onSave: (r: ScanResult) => void;
}) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <img
        src={result.imageUrl}
        alt={result.title}
        style={{ width: "100%", borderRadius: 8, height: 220, objectFit: "cover" }}
      />
      <h3 style={{ margin: "10px 0 6px" }}>{result.title}</h3>
      <p style={{ margin: 0, color: "#666" }}>{result.sourceDomain}</p>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <a href={result.sourceUrl} target="_blank" rel="noreferrer">
          Open source
        </a>
        <button onClick={() => onSave(result)}>Save</button>
      </div>
    </div>
  );
}