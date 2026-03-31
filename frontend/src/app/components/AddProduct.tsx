import { useState } from "react";
import { Package, PlusCircle, RotateCcw, ChevronDown, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

type FormData = { name: string; sku: string; category: string; supplier: string; price: string; quantity: string; minStock: string; description: string };
const EMPTY: FormData = { name: "", sku: "", category: "", supplier: "", price: "", quantity: "", minStock: "", description: "" };

const LABEL: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "6px" };
const baseInput: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.84rem", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s" };
const INPUT = (focus: boolean, error: boolean): React.CSSProperties => ({
  ...baseInput,
  borderColor: error ? "#7c3aed" : focus ? "#7c3aed" : "#e2e8f0",
  boxShadow: focus ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
});

// ⚠️ Defined OUTSIDE the parent component so React sees a stable reference
// and never unmounts/remounts the input on each render (which would lose focus).
function Field({ id, label, required = false, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL} htmlFor={id}>
        {label}{required && <span style={{ color: "#7c3aed", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
          <Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} />
          <span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

export function AddProduct() {
  const navigate = useNavigate();
  const { categories, suppliers, addProduct } = useAppContext();
  const [form,    setForm]    = useState<FormData>(EMPTY);
  const [errors,  setErrors]  = useState<Partial<FormData>>({});
  const [focus,   setFocus]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name)     e.name     = "Required";
    if (!form.sku)      e.sku      = "Required";
    if (!form.category) e.category = "Required";
    if (!form.supplier) e.supplier = "Required";
    if (!form.price || isNaN(+form.price) || +form.price <= 0)   e.price    = "Valid price required";
    if (!form.quantity || isNaN(+form.quantity) || +form.quantity < 0) e.quantity = "Valid quantity required";
    if (!form.minStock || isNaN(+form.minStock) || +form.minStock < 0) e.minStock = "Valid min. stock required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    addProduct({
      name:     form.name,
      sku:      form.sku,
      category: form.category,
      supplier: form.supplier,
      price:    +form.price,
      quantity: +form.quantity,
      minStock: +form.minStock,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm(EMPTY);
      navigate("/products");
    }, 1500);
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Add New Product</h1>
        <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Fill in the details below to add a product to your inventory</p>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.85rem", fontWeight: 500, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.1rem" }}>✓</span>
          Product added successfully! Redirecting…
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
        {/* Main form card */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 24px", borderBottom: "1px solid #f1f5f9", borderLeft: "4px solid #7c3aed" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package style={{ width: "19px", height: "19px", color: "#7c3aed" }} />
            </div>
            <div>
              <div style={{ color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Product Information</div>
              <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Enter all required product details</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Field id="name" label="Product Name" required error={errors.name}>
                <input id="name" type="text" autoComplete="off" value={form.name} placeholder="e.g. Wireless Keyboard" onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} onChange={set("name")} style={INPUT(focus === "name", !!errors.name)} />
              </Field>

              <Field id="sku" label="SKU / Product Code" required error={errors.sku}>
                <input id="sku" type="text" autoComplete="off" value={form.sku} placeholder="e.g. WK-001" onFocus={() => setFocus("sku")} onBlur={() => setFocus(null)} onChange={set("sku")} style={INPUT(focus === "sku", !!errors.sku)} />
              </Field>

              <Field id="category" label="Category" required error={errors.category}>
                <div style={{ position: "relative" }}>
                  <select id="category" value={form.category} onFocus={() => setFocus("category")} onBlur={() => setFocus(null)} onChange={set("category")} style={{ ...INPUT(focus === "category", !!errors.category), appearance: "none", paddingRight: "34px", cursor: "pointer" }}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8", pointerEvents: "none" }} />
                </div>
              </Field>

              <Field id="supplier" label="Supplier" required error={errors.supplier}>
                <div style={{ position: "relative" }}>
                  <select id="supplier" value={form.supplier} onFocus={() => setFocus("supplier")} onBlur={() => setFocus(null)} onChange={set("supplier")} style={{ ...INPUT(focus === "supplier", !!errors.supplier), appearance: "none", paddingRight: "34px", cursor: "pointer" }}>
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8", pointerEvents: "none" }} />
                </div>
              </Field>

              <Field id="price" label="Price (USD)" required error={errors.price}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.85rem" }}>$</span>
                  <input id="price" type="number" min="0" step="0.01" value={form.price} placeholder="0.00" onFocus={() => setFocus("price")} onBlur={() => setFocus(null)} onChange={set("price")} style={{ ...INPUT(focus === "price", !!errors.price), paddingLeft: "24px" }} />
                </div>
              </Field>

              <Field id="quantity" label="Initial Quantity" required error={errors.quantity}>
                <input id="quantity" type="number" min="0" value={form.quantity} placeholder="0" onFocus={() => setFocus("quantity")} onBlur={() => setFocus(null)} onChange={set("quantity")} style={INPUT(focus === "quantity", !!errors.quantity)} />
              </Field>

              <Field id="minStock" label="Minimum Stock Level" required error={errors.minStock}>
                <input id="minStock" type="number" min="0" value={form.minStock} placeholder="e.g. 10" onFocus={() => setFocus("minStock")} onBlur={() => setFocus(null)} onChange={set("minStock")} style={INPUT(focus === "minStock", !!errors.minStock)} />
              </Field>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field id="description" label="Description (optional)">
                  <textarea id="description" rows={3} value={form.description} placeholder="Brief product description…" onFocus={() => setFocus("description")} onBlur={() => setFocus(null)} onChange={set("description")} style={{ ...INPUT(focus === "description", false), resize: "none" as const }} />
                </Field>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", padding: "16px 24px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6d28d9, #7c3aed)", color: "white", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, boxShadow: "0 3px 12px rgba(124,58,237,0.3)" }}>
                <PlusCircle style={{ width: "16px", height: "16px" }} />
                Add Product
              </button>
              <button type="button" onClick={() => { setForm(EMPTY); setErrors({}); }} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", borderRadius: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}>
                <RotateCcw style={{ width: "14px", height: "14px" }} />
                Reset
              </button>
              <button type="button" onClick={() => navigate("/products")} style={{ padding: "10px 20px", borderRadius: "10px", background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "0.88rem" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar tips */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "22px", height: "fit-content" }}>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem", marginBottom: "14px" }}>📋 Quick Tips</div>
          {[
            { title: "SKU Format", desc: "Use a consistent format like CATEGORY-NUMBER (e.g. EL-001) for easy identification." },
            { title: "Min Stock Alert", desc: "Set the minimum stock level to receive alerts before you run out." },
            { title: "Supplier Info", desc: "Link to an existing supplier or add a new one to track reorders easily." },
            { title: "Pricing", desc: "Enter the selling price, not the cost price, unless tracking margins." },
          ].map(({ title, desc }) => (
            <div key={title} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ color: "#7c3aed", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>{title}</div>
              <div style={{ color: "#64748b", fontSize: "0.78rem", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
          <div style={{ padding: "12px", borderRadius: "9px", background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
            <div style={{ color: "#6d28d9", fontSize: "0.78rem", fontWeight: 600, marginBottom: "3px" }}>⚠️ Note</div>
            <div style={{ color: "#4c1d95", fontSize: "0.75rem", lineHeight: 1.6 }}>Fields marked with <span style={{ color: "#7c3aed" }}>*</span> are required before saving.</div>
          </div>
        </div>
      </div>
    </div>
  );
}