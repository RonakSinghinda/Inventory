import { useState } from "react";
import { Search, Edit2, Trash2, RefreshCw, Filter, ChevronLeft, ChevronRight, Plus, X, Check, Info, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { type Product } from "../data/mockData";

const ROWS_PER_PAGE = 8;

const STATUS_CFG = {
  "In Stock":    { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  "Low Stock":   { bg: "#f5f3ff", color: "#7c3aed", dot: "#7c3aed" },
  "Out of Stock":{ bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
} as const;

const TH: React.CSSProperties = { padding: "11px 16px", textAlign: "left" as const, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const };
const TD: React.CSSProperties = { padding: "13px 16px", fontSize: "0.84rem", color: "#374151", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" as const };
const LABEL: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "6px" };
const baseInput: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.84rem", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box" } as const;
const SELECT_STYLE: React.CSSProperties = { padding: "8px 12px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "white", color: "#374151", fontSize: "0.82rem", outline: "none", cursor: "pointer" };

type EditForm = { name: string; sku: string; category: string; supplier: string; price: string; quantity: string; minStock: string; description: string };

export function ProductList() {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct, categories, suppliers } = useAppContext();
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("all");
  const [statFilter,  setStatFilter]  = useState("all");
  const [page,        setPage]        = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form,        setForm]        = useState<EditForm | null>(null);
  const [errors,      setErrors]      = useState<Partial<EditForm>>({});
  const [focusField,  setFocusField]  = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (catFilter  === "all" || p.category === catFilter) &&
      (statFilter === "all" || p.status   === statFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleFilter = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, sku: p.sku, category: p.category, supplier: p.supplier, price: String(p.price), quantity: String(p.quantity), minStock: String(p.minStock), description: "" });
    setErrors({});
  };

  const set = (k: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => p ? { ...p, [k]: e.target.value } : p);
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<EditForm> = {};
    if (!form?.name) e.name = "Required";
    if (!form?.sku)  e.sku  = "Required";
    if (!form?.category) e.category = "Required";
    if (!form?.supplier) e.supplier = "Required";
    if (!form?.price || isNaN(+form.price) || +form.price <= 0) e.price = "Valid price required";
    if (form?.quantity === undefined || form.quantity === "" || isNaN(+form.quantity) || +form.quantity < 0) e.quantity = "Valid quantity required";
    if (!form?.minStock || isNaN(+form.minStock) || +form.minStock < 0) e.minStock = "Valid min stock required";
    return e;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct || !form) return;
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    updateProduct({ ...editProduct, name: form.name, sku: form.sku, category: form.category, supplier: form.supplier, price: +form.price, quantity: +form.quantity, minStock: +form.minStock });
    setEditProduct(null);
    setForm(null);
  };

  const closeEdit = () => { setEditProduct(null); setForm(null); setErrors({}); };

  const inputStyle = (field: string, hasError?: boolean): React.CSSProperties => ({
    ...baseInput,
    borderColor: hasError ? "#7c3aed" : focusField === field ? "#7c3aed" : "#e2e8f0",
    boxShadow: focusField === field ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
  });

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Product List</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage and monitor all your inventory products</p>
        </div>
        <button
          onClick={() => navigate("/add-product")}
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8" }} />
          <input type="text" placeholder="Search by name or SKU…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.82rem", outline: "none" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
          <span style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>Filter:</span>
        </div>
        <select value={catFilter} onChange={(e) => handleFilter(setCatFilter)(e.target.value)} style={SELECT_STYLE}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statFilter} onChange={(e) => handleFilter(setStatFilter)(e.target.value)} style={SELECT_STYLE}>
          <option value="all">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.78rem" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: "40px" }}>#</th>
                <th style={TH}>Product</th>
                <th style={TH}>Category</th>
                <th style={TH}>Quantity</th>
                <th style={TH}>Min. Stock</th>
                <th style={TH}>Price</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign: "center" as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "0.88rem" }}>No products found</td></tr>
              ) : (
                pageData.map((p, i) => {
                  const s = STATUS_CFG[p.status];
                  return (
                    <tr key={p.id} style={{ transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
                      <td style={{ ...TD, color: "#94a3b8", fontWeight: 500 }}>{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                      <td style={TD}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{p.name}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.72rem", marginTop: "2px" }}>{p.sku}</div>
                      </td>
                      <td style={TD}><span style={{ padding: "3px 9px", borderRadius: "6px", background: "#f1f5f9", color: "#475569", fontSize: "0.78rem", fontWeight: 500 }}>{p.category}</span></td>
                      <td style={{ ...TD, fontWeight: 600, color: p.quantity === 0 ? "#dc2626" : p.quantity <= p.minStock ? "#7c3aed" : "#1e293b" }}>{p.quantity}</td>
                      <td style={{ ...TD, color: "#64748b" }}>{p.minStock}</td>
                      <td style={{ ...TD, fontWeight: 600, color: "#1e293b" }}>${p.price.toFixed(2)}</td>
                      <td style={TD}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600 }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                          {p.status}
                        </span>
                      </td>
                      <td style={{ ...TD, textAlign: "center" as const }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <button title="Edit" onClick={() => openEdit(p)} style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#6366f1", display: "flex" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#ede9fe")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <Edit2 style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button title="Update Stock" onClick={() => navigate("/stock-update")} style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#7c3aed", display: "flex" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <RefreshCw style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button title="Delete" onClick={() => deleteProduct(p.id)} style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#ef4444", display: "flex" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <Trash2 style={{ width: "14px", height: "14px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
          <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid #e2e8f0", background: "white", color: page === 1 ? "#cbd5e1" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}><ChevronLeft style={{ width: "14px", height: "14px" }} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button key={pg} onClick={() => setPage(pg)} style={{ padding: "5px 11px", borderRadius: "7px", border: pg === page ? "none" : "1px solid #e2e8f0", background: pg === page ? "#7c3aed" : "white", color: pg === page ? "white" : "#374151", cursor: "pointer", fontSize: "0.8rem", fontWeight: pg === page ? 600 : 400 }}>{pg}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid #e2e8f0", background: "white", color: page === totalPages ? "#cbd5e1" : "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}><ChevronRight style={{ width: "14px", height: "14px" }} /></button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && form && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }} onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}>
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Edit Product</div>
                <div style={{ color: "#64748b", fontSize: "0.74rem" }}>{editProduct.name} · {editProduct.sku}</div>
              </div>
              <button onClick={closeEdit} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}><X style={{ width: "18px", height: "18px" }} /></button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Name */}
              <div>
                <label style={LABEL}>Product Name <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="text" value={form.name} onChange={set("name")} onFocus={() => setFocusField("name")} onBlur={() => setFocusField(null)} style={inputStyle("name", !!errors.name)} />
                {errors.name && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}><Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} /><span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.name}</span></div>}
              </div>
              {/* SKU */}
              <div>
                <label style={LABEL}>SKU / Product Code <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="text" value={form.sku} onChange={set("sku")} onFocus={() => setFocusField("sku")} onBlur={() => setFocusField(null)} style={inputStyle("sku", !!errors.sku)} />
                {errors.sku && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}><Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} /><span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.sku}</span></div>}
              </div>
              {/* Category */}
              <div>
                <label style={LABEL}>Category <span style={{ color: "#7c3aed" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <select value={form.category} onChange={set("category")} onFocus={() => setFocusField("category")} onBlur={() => setFocusField(null)} style={{ ...inputStyle("category", !!errors.category), appearance: "none", paddingRight: "34px", cursor: "pointer" }}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8", pointerEvents: "none" }} />
                </div>
              </div>
              {/* Supplier */}
              <div>
                <label style={LABEL}>Supplier <span style={{ color: "#7c3aed" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <select value={form.supplier} onChange={set("supplier")} onFocus={() => setFocusField("supplier")} onBlur={() => setFocusField(null)} style={{ ...inputStyle("supplier", !!errors.supplier), appearance: "none", paddingRight: "34px", cursor: "pointer" }}>
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8", pointerEvents: "none" }} />
                </div>
              </div>
              {/* Price */}
              <div>
                <label style={LABEL}>Price (USD) <span style={{ color: "#7c3aed" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.85rem" }}>$</span>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={set("price")} onFocus={() => setFocusField("price")} onBlur={() => setFocusField(null)} style={{ ...inputStyle("price", !!errors.price), paddingLeft: "24px" }} />
                </div>
                {errors.price && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}><Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} /><span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.price}</span></div>}
              </div>
              {/* Quantity */}
              <div>
                <label style={LABEL}>Quantity <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="number" min="0" value={form.quantity} onChange={set("quantity")} onFocus={() => setFocusField("quantity")} onBlur={() => setFocusField(null)} style={inputStyle("quantity", !!errors.quantity)} />
                {errors.quantity && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}><Info style={{ width: "12px", height: "12px", color: "#7c3aed" }} /><span style={{ color: "#7c3aed", fontSize: "0.72rem" }}>{errors.quantity}</span></div>}
              </div>
              {/* Min Stock */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL}>Minimum Stock Level <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="number" min="0" value={form.minStock} onChange={set("minStock")} onFocus={() => setFocusField("minStock")} onBlur={() => setFocusField(null)} style={inputStyle("minStock", !!errors.minStock)} />
              </div>

              {/* Actions */}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", paddingTop: "4px", borderTop: "1px solid #f1f5f9" }}>
                <button type="submit" style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6d28d9, #7c3aed)", color: "white", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, boxShadow: "0 3px 12px rgba(124,58,237,0.3)" }}>
                  <Check style={{ width: "15px", height: "15px" }} />
                  Save Changes
                </button>
                <button type="button" onClick={closeEdit} style={{ padding: "10px 18px", borderRadius: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}>
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