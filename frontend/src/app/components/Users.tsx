import { Users as UsersIcon, Plus, Shield, User } from "lucide-react";

const USERS = [
  { id: 1, name: "John Smith",    email: "john.smith@acme.com",    role: "Administrator", lastLogin: "Today, 09:15 AM", status: "Active",   initials: "JS", color: "#7c3aed" },
  { id: 2, name: "Sarah Lee",     email: "sarah.lee@acme.com",     role: "Inventory Manager", lastLogin: "Today, 08:42 AM", status: "Active", initials: "SL", color: "#6366f1" },
  { id: 3, name: "Mike Johnson",  email: "mike.j@acme.com",        role: "Warehouse Staff", lastLogin: "Yesterday, 05:30 PM", status: "Active", initials: "MJ", color: "#10b981" },
  { id: 4, name: "Anna Williams", email: "anna.w@acme.com",        role: "Viewer",       lastLogin: "3 days ago",       status: "Active",   initials: "AW", color: "#8b5cf6" },
  { id: 5, name: "Robert Chen",   email: "r.chen@acme.com",        role: "Inventory Manager", lastLogin: "1 week ago", status: "Inactive", initials: "RC", color: "#0ea5e9" },
];

const ROLE_CFG: Record<string, { bg: string; color: string }> = {
  "Administrator":      { bg: "#f5f3ff", color: "#7c3aed" },
  "Inventory Manager":  { bg: "#ede9fe", color: "#6d28d9" },
  "Warehouse Staff":    { bg: "#f0fdf4", color: "#16a34a" },
  "Viewer":             { bg: "#f1f5f9", color: "#475569" },
};

const TH: React.CSSProperties = { padding: "11px 16px", textAlign: "left" as const, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: "0.84rem", color: "#374151", borderBottom: "1px solid #f1f5f9" };

export function Users() {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Users</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage system users and their access roles</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
          <Plus style={{ width: "15px", height: "15px" }} />
          Add User
        </button>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Users",   value: USERS.length,                              icon: UsersIcon, color: "#6366f1" },
          { label: "Active Users",  value: USERS.filter((u) => u.status === "Active").length, icon: User, color: "#10b981" },
          { label: "Administrators",value: USERS.filter((u) => u.role === "Administrator").length, icon: Shield, color: "#7c3aed" },
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
              {USERS.map((u, i) => {
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
    </div>
  );
}