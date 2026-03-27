import { Tag, Plus, Package } from "lucide-react";
import { products, CATEGORIES } from "../data/mockData";

const COLORS = ["#6366f1", "#10b981", "#7c3aed", "#8b5cf6", "#0ea5e9", "#ec4899"];

export function Categories() {
  const getCategoryCount = (cat: string) => products.filter((p) => p.category === cat).length;
  const getCategoryStock = (cat: string) => products.filter((p) => p.category === cat).reduce((s, p) => s + p.quantity, 0);

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Categories</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage product categories and groupings</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
          <Plus style={{ width: "15px", height: "15px" }} />
          Add Category
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
        {CATEGORIES.map((cat, i) => {
          const color = COLORS[i % COLORS.length];
          const count = getCategoryCount(cat);
          const stock = getCategoryStock(cat);
          return (
            <div
              key={cat}
              style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")}
            >
              <div style={{ height: "5px", background: color }} />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Tag style={{ width: "20px", height: "20px", color }} />
                  </div>
                  <div>
                    <div style={{ color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>{cat}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>Category</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Products", value: count, icon: Package },
                    { label: "Total Stock", value: stock, icon: Tag },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{ padding: "10px 12px", borderRadius: "9px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <div style={{ color: "#1e293b", fontSize: "1.15rem", fontWeight: 700 }}>{value}</div>
                      <div style={{ color: "#64748b", fontSize: "0.72rem" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}