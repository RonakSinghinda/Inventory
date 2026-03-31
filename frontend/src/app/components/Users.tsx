import { useState } from "react";
import { Users as UsersIcon, Plus, Shield, User, X, Check } from "lucide-react";
import { useAppContext, type AppUser } from "../context/AppContext";

const ROLE_CFG: Record<string, { bg: string; color: string }> = {
  "Administrator":      { bg: "#f5f3ff", color: "#7c3aed" },
  "Inventory Manager":  { bg: "#ede9fe", color: "#6d28d9" },
  "Warehouse Staff":    { bg: "#f0fdf4", color: "#16a34a" },
  "Viewer":             { bg: "#f1f5f9", color: "#475569" },
};

const TH: React.CSSProperties = { padding: "11px 16px", textAlign: "left" as const, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: "0.84rem", color: "#374151", borderBottom: "1px solid #f1f5f9" };
const LABEL: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "6px" };
const baseInput: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.84rem", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box" };

type FormData = { name: string; email: string; role: string; status: "Active" | "Inactive" };
const EMPTY: FormData = { name: "", email: "", role: "Inventory Manager", status: "Active" };
const ROLES = ["Administrator", "Inventory Manager", "Warehouse Staff", "Viewer"];

export function Users() {
  const { users, addUser } = useAppContext();
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
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    addUser({ name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status });
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

  const activeCount = users.filter((u) => u.status === "Active").length;
  const adminCount = users.filter((u) => u.role === "Administrator").length;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Users</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage system users and their access roles</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Add User
        </button>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Users",    value: users.length, icon: UsersIcon, color: "#6366f1" },
          { label: "Active Users",   value: activeCount,  icon: User,      color: "#10b981" },
          { label: "Administrators", value: adminCount,   icon: Shield,    color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon style={{ width: "20px", height: "20px", color }} />
            </div>
            <div>
              <div style={{ color: "#0f172a", fontSize: "1.55rem", fontWeight: 700, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "4px" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: "40px" }}>#</th>
                <th style={TH}>User</th>
                <th style={TH}>Role</th>
                <th style={TH}>Last Login</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const roleCfg = ROLE_CFG[u.role] ?? { bg: "#f8fafc", color: "#64748b" };
                const isActive = u.status === "Active";
                return (
                  <tr key={u.id} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")} style={{ transition: "background 0.12s" }}>
                    <td style={{ ...TD, color: "#94a3b8", fontWeight: 500 }}>{i + 1}</td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>
                          {u.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>{u.name}</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.73rem" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "7px", background: roleCfg.bg, color: roleCfg.color, fontSize: "0.74rem", fontWeight: 600 }}>
                        <Shield style={{ width: "11px", height: "11px" }} />
                        {u.role}
                      </span>
                    </td>
                    <td style={{ ...TD, color: "#64748b" }}>{u.lastLogin}</td>
                    <td style={TD}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: isActive ? "#f0fdf4" : "#f8fafc", color: isActive ? "#16a34a" : "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? "#22c55e" : "#cbd5e1", display: "inline-block" }} />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User style={{ width: "18px", height: "18px", color: "#7c3aed" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Add User</div>
                  <div style={{ color: "#64748b", fontSize: "0.74rem" }}>Create a new system user</div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={LABEL}>Full Name <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="text" autoFocus value={form.name} onChange={set("name")} onFocus={() => setFocusField("name")} onBlur={() => setFocusField(null)} placeholder="e.g. John Smith" style={inputStyle("name", !!errors.name)} />
                {errors.name && <div style={{ color: "#ef4444", fontSize: "0.74rem", marginTop: "4px" }}>{errors.name}</div>}
              </div>

              <div>
                <label style={LABEL}>Email Address <span style={{ color: "#7c3aed" }}>*</span></label>
                <input type="email" value={form.email} onChange={set("email")} onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)} placeholder="user@acme.com" style={inputStyle("email", !!errors.email)} />
                {errors.email && <div style={{ color: "#ef4444", fontSize: "0.74rem", marginTop: "4px" }}>{errors.email}</div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={LABEL}>Role</label>
                  <select value={form.role} onChange={set("role")} style={{ ...baseInput, cursor: "pointer" }}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
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
                  Create User
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