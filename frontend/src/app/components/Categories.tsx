import { useState } from "react";
import { Tag, Plus, Package, X, Check } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const COLORS = ["#6366f1", "#10b981", "#7c3aed", "#8b5cf6", "#0ea5e9", "#ec4899", "#f59e0b", "#ef4444"];

export function Categories() {
  const { categories, addCategory, products } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState(false);

  const getCategoryCount = (cat: string) => products.filter((p) => p.category === cat).length;
  const getCategoryStock = (cat: string) => products.filter((p) => p.category === cat).reduce((s, p) => s + p.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Category name is required."); return; }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("A category with this name already exists.");
      return;
    }
    addCategory(trimmed);
    setName("");
    setError("");
    setModalOpen(false);
  };

  const closeModal = () => { setModalOpen(false); setName(""); setError(""); };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Categories</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage product categories and groupings</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Add Category
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
        {categories.map((cat, i) => {
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
                  ].map(({ label, value }) => (
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

      {/* Add Category Modal */}
      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Tag style={{ width: "18px", height: "18px", color: "#7c3aed" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Add Category</div>
                  <div style={{ color: "#64748b", fontSize: "0.74rem" }}>Create a new product category</div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px", borderRadius: "6px" }}>
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Category Name <span style={{ color: "#7c3aed" }}>*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="e.g. Electronics, Clothing…"
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: "9px", fontSize: "0.84rem",
                    border: `1px solid ${error ? "#ef4444" : focus ? "#7c3aed" : "#e2e8f0"}`,
                    boxShadow: focus ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                    background: "#f8fafc", color: "#1e293b", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
                    boxSizing: "border-box",
                  }}
                />
                {error && <div style={{ color: "#ef4444", fontSize: "0.74rem", marginTop: "5px" }}>{error}</div>}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #6d28d9, #7c3aed)", color: "white", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, boxShadow: "0 3px 12px rgba(124,58,237,0.3)" }}
                >
                  <Check style={{ width: "15px", height: "15px" }} />
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: "10px 18px", borderRadius: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}