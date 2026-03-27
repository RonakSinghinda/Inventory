import { useState } from "react";
import { RefreshCw, Plus, Minus, SlidersHorizontal, CheckCircle2, RotateCcw, ChevronDown, Info } from "lucide-react";
import { products, type StockAction } from "../data/mockData";

const ACTION_CFG: Record<StockAction, { label: string; icon: typeof Plus; color: string; bg: string; borderActive: string; desc: string }> = {
  Add:    { label: "Add Stock",    icon: Plus,            color: "#16a34a", bg: "#f0fdf4", borderActive: "#22c55e", desc: "Increase stock quantity (new shipment, return, etc.)" },
  Remove: { label: "Remove Stock", icon: Minus,           color: "#dc2626", bg: "#fef2f2", borderActive: "#ef4444", desc: "Decrease stock quantity (sale, damage, loss, etc.)" },
  Adjust: { label: "Adjust Stock", icon: SlidersHorizontal, color: "#7c3aed", bg: "#f5f3ff", borderActive: "#7c3aed", desc: "Set a specific quantity (inventory recount, correction)" },
};

const LABEL: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "6px" };
const baseInput: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.84rem", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s" };
const INPUT = (focus: boolean, err: boolean): React.CSSProperties => ({
  ...baseInput,
  borderColor: err ? "#7c3aed" : focus ? "#7c3aed" : "#e2e8f0",
  boxShadow: focus ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
});

export function StockUpdate() {
  const [productId, setProductId] = useState("");
  const [action, setAction]       = useState<StockAction>("Add");
  const [quantity, setQuantity]   = useState("");
  const [notes, setNotes]         = useState("");
  const [reference, setReference] = useState("");
  const [focus, setFocus]         = useState<string | null>(null);
  const [errors, setErrors]       = useState<{ productId?: string; quantity?: string }>({});
  const [success, setSuccess]     = useState(false);

  const selected = products.find((p) => String(p.id) === productId);
  const cfg = ACTION_CFG[action];

  const validate = () => {
    const e: typeof errors = {};
    if (!productId) e.productId = "Please select a product.";
    if (!quantity || isNaN(+quantity) || +quantity <= 0) e.quantity = "Enter a valid positive quantity.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setProductId(""); setQuantity(""); setNotes(""); setReference(""); setErrors({}); }, 2500);
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>
          Update Stock
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>
          Add, remove, or adjust stock quantities for any product
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.85rem", fontWeight: 500, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 style={{ width: "16px", height: "16px" }} />
          Stock updated successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        {/* Form Card */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 24px", borderBottom: "1px solid #f1f5f9", borderLeft: "4px solid #7c3aed" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RefreshCw style={{ width: "18px", height: "18px", color: "#7c3aed" }} />
            </div>
            <div>
              <div style={{ color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Stock Adjustment</div>
              <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Select a product and apply the stock change</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Product Selector */}
            <div>
              <label style={LABEL} htmlFor="product-select">
                Select Product<span style={{ color: "#7c3aed", marginLeft: "3px" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="product-select"
                  value={productId}
                  onFocus={() => setFocus("product")}
                  onBlur={() => setFocus(null)}
                  onChange={(e) => { setProductId(e.target.value); setErrors((p) => ({ ...p, productId: undefined })); }}
                  style={{ ...INPUT(focus === "product", !!errors.productId), appearance: "none", paddingRight: "36px", cursor: "pointer" }}
                >
                  <option value="">Choose a product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — {p.quantity} in stock
                    </option>
                  ))}
                </select>
                <ChevronDown style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8", pointerEvents: "none" }} />
              </div>
              {errors.productId && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                  <Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} />
                  <span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.productId}</span>
                </div>
              )}
            </div>

            {/* Action Type */}
            <div>
              <label style={LABEL}>Action Type<span style={{ color: "#7c3aed", marginLeft: "3px" }}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
                {(["Add", "Remove", "Adjust"] as StockAction[]).map((a) => {
                  const c = ACTION_CFG[a];
                  const isActive = action === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAction(a)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "7px",
                        padding: "14px 10px",
                        borderRadius: "11px",
                        border: `2px solid ${isActive ? c.borderActive : "#e2e8f0"}`,
                        background: isActive ? c.bg : "white",
                        color: isActive ? c.color : "#64748b",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <c.icon style={{ width: "20px", height: "20px" }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "8px", background: cfg.bg, color: cfg.color, fontSize: "0.76rem", fontWeight: 500 }}>
                {cfg.desc}
              </div>
            </div>

            {/* Quantity + Reference */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={LABEL} htmlFor="qty">
                  Quantity<span style={{ color: "#7c3aed", marginLeft: "3px" }}>*</span>
                </label>
                <input
                  id="qty" type="number" min="1" placeholder="0"
                  value={quantity}
                  onFocus={() => setFocus("qty")} onBlur={() => setFocus(null)}
                  onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: undefined })); }}
                  style={INPUT(focus === "qty", !!errors.quantity)}
                />
                {errors.quantity && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                    <Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} />
                    <span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.quantity}</span>
                  </div>
                )}
              </div>
              <div>
                <label style={LABEL} htmlFor="ref">Reference / Order #</label>
                <input
                  id="ref" type="text" placeholder="e.g. PO-2026-042"
                  value={reference}
                  onFocus={() => setFocus("ref")} onBlur={() => setFocus(null)}
                  onChange={(e) => setReference(e.target.value)}
                  style={INPUT(focus === "ref", false)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={LABEL} htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes" rows={3} placeholder="Reason for stock change, delivery notes, etc."
                value={notes}
                onFocus={() => setFocus("notes")} onBlur={() => setFocus(null)}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...INPUT(focus === "notes", false), resize: "none" as const }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
              <button
                type="submit"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6d28d9, #7c3aed)", color: "white", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, boxShadow: "0 3px 12px rgba(124,58,237,0.3)" }}
              >
                <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                Update Stock
              </button>
              <button
                type="button"
                onClick={() => { setProductId(""); setQuantity(""); setNotes(""); setReference(""); setErrors({}); setAction("Add"); }}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", borderRadius: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}
              >
                <RotateCcw style={{ width: "14px", height: "14px" }} />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Selected product info */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "20px" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem", marginBottom: "14px" }}>
              📦 Selected Product
            </div>
            {selected ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <div style={{ color: "#0f172a", fontSize: "0.92rem", fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{selected.sku}</div>
                </div>
                {[
                  ["Category", selected.category],
                  ["Supplier", selected.supplier],
                  ["Current Stock", `${selected.quantity} units`],
                  ["Min. Stock", `${selected.minStock} units`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f8fafc", paddingTop: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{k}</span>
                    <span style={{ color: "#1e293b", fontSize: "0.78rem", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}

                {/* After-update preview */}
                {quantity && !isNaN(+quantity) && +quantity > 0 && (
                  <div style={{ marginTop: "6px", padding: "12px", borderRadius: "10px", background: cfg.bg, border: `1px solid ${cfg.borderActive}33` }}>
                    <div style={{ color: cfg.color, fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>After Update</div>
                    <div style={{ color: cfg.color, fontSize: "1.3rem", fontWeight: 700 }}>
                      {action === "Add"
                        ? selected.quantity + +quantity
                        : action === "Remove"
                        ? Math.max(0, selected.quantity - +quantity)
                        : +quantity}{" "}
                      units
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: "0.82rem" }}>
                <RefreshCw style={{ width: "32px", height: "32px", margin: "0 auto 8px", opacity: 0.3 }} />
                <div>Select a product to see its details</div>
              </div>
            )}
          </div>

          {/* Info box */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
            <div style={{ color: "#6d28d9", fontSize: "0.82rem", fontWeight: 700, marginBottom: "8px" }}>⚠️ Important</div>
            <div style={{ color: "#4c1d95", fontSize: "0.76rem", lineHeight: 1.7 }}>
              Stock changes are recorded in the history log. Ensure you've selected the correct product and quantity before submitting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}