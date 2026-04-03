import { useState } from "react";
import { Truck, Plus, Mail, Phone, MapPin, X, Check } from "lucide-react";
import { useAppContext, type Vendor } from "../context/AppContext";

const TH: React.CSSProperties = { padding: "11px 16px", textAlign: "left" as const, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: "0.84rem", color: "#374151", borderBottom: "1px solid #f1f5f9" };

const LABEL: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "6px" };
const baseInput: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.84rem", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box" };

type FormData = { name: string; email: string; phone: string; location: string; status: "Active" | "Inactive" };
const EMPTY: FormData = { name: "", email: "", phone: "", location: "", status: "Active" };

export function Vendors() {
  const { vendors, addVendor, products } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [focusField, setFocusField] = useState<string | null>(null);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Vendor name is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    addVendor({ name: form.name.trim(), email: form.email, phone: form.phone, location: form.location, status: form.status });
    setForm(EMPTY);
    setErrors({});
    setModalOpen(false);
  };

  const closeModal = () => { setModalOpen(false); setForm(EMPTY); setErrors({}); };

  const inputStyle = (field: string, hasError?: boolean): React.CSSProperties => ({
    ...baseInput,
    borderColor: hasError ? "#ef4444" : focusField === field ? "#7c3aed" : "#e2e8f0",
    boxShadow: focusField === field ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
  });

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Vendors</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage your suppliers and vendor relationships</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Add Vendor
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: "40px" }}>#</th>
                <th style={TH}>Vendor Name</th>
                <th style={TH}>Contact</th>
                <th style={TH}>Location</th>
                <th style={TH}>Products</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => {
                const productCount = products.filter((p) => p.supplier === v.name).length;
                const isActive = v.status === "Active";
                return (
                  <tr key={v.id} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")} style={{ transition: "background 0.12s" }}>
                    <td style={{ ...TD, color: "#94a3b8", fontWeight: 500 }}>{i + 1}</td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Truck style={{ width: "17px", height: "17px", color: "#7c3aed" }} />
                        </div>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{v.name}</span>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {v.email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.78rem" }}>
                            <Mail style={{ width: "12px", height: "12px", flexShrink: 0 }} /> {v.email}
                          </div>
                        )}
                        {v.phone && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.78rem" }}>
                            <Phone style={{ width: "12px", height: "12px", flexShrink: 0 }} /> {v.phone}
                          </div>
                        )}
                        {!v.email && !v.phone && <span style={{ color: "#cbd5e1", fontSize: "0.78rem" }}>—</span>}
                      </div>
                    </td>
                    <td style={TD}>
                      {v.location ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.82rem" }}>
                          <MapPin style={{ width: "13px", height: "13px", color: "#7c3aed" }} /> {v.location}
                        </div>
                      ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                    <td style={{ ...TD, fontWeight: 600, color: "#1e293b" }}>{productCount} products</td>
                    <td style={TD}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: isActive ? "#f0fdf4" : "#f8fafc", color: isActive ? "#16a34a" : "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? "#22c55e" : "#cbd5e1", display: "inline-block" }} />
                        {v.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck style={{ width: "18px", height: "18px", color: "#7c3aed" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Add Vendor</div>
                  <div style={{ color: "#64748b", fontSize: "0.74rem" }}>Add a new supplier or vendor</div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={LABEL}>Vendor Name <span style={{ color: "#7c3aed" }}>*</span></label>
                  <input
                    type="text" autoFocus value={form.name}
                    onChange={set("name")} onFocus={() => setFocusField("name")} onBlur={() => setFocusField(null)}
                    placeholder="e.g. TechCorp Ltd"
                    style={inputStyle("name", !!errors.name)}
                  />
                  {errors.name && <div style={{ color: "#ef4444", fontSize: "0.74rem", marginTop: "4px" }}>{errors.name}</div>}
                </div>

                <div>
                  <label style={LABEL}>Email</label>
                  <input type="email" value={form.email} onChange={set("email")} onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)} placeholder="orders@vendor.com" style={inputStyle("email")} />
                </div>
                <div>
                  <label style={LABEL}>Phone</label>
                  <input type="text" value={form.phone} onChange={set("phone")} onFocus={() => setFocusField("phone")} onBlur={() => setFocusField(null)} placeholder="+1 555-0000" style={inputStyle("phone")} />
                </div>
                <div>
                  <label style={LABEL}>Location</label>
                  <input type="text" value={form.location} onChange={set("location")} onFocus={() => setFocusField("location")} onBlur={() => setFocusField(null)} placeholder="City, State" style={inputStyle("location")} />
                </div>
                <div>
                  <label style={LABEL}>Status</label>
                  <select value={form.status} onChange={set("status")} style={{ ...baseInput, cursor: "pointer" }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button type="submit" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #6d28d9, #7c3aed)", color: "white", border: "none", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, boxShadow: "0 3px 12px rgba(124,58,237,0.3)" }}>
                  <Check style={{ width: "15px", height: "15px" }} />
                  Add Vendor
                </button>
                <button type="button" onClick={closeModal} style={{ padding: "10px 18px", borderRadius: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}>
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