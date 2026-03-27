import { Truck, Plus, Mail, Phone, MapPin } from "lucide-react";
import { SUPPLIERS, products } from "../data/mockData";

const VENDOR_DETAILS = [
  { name: "TechCorp Ltd",   email: "orders@techcorp.com",   phone: "+1 555-0101", location: "San Jose, CA",    status: "Active" },
  { name: "FashionHub",     email: "supply@fashionhub.com", phone: "+1 555-0182", location: "New York, NY",    status: "Active" },
  { name: "FoodWorld Inc",  email: "b2b@foodworld.com",     phone: "+1 555-0139", location: "Chicago, IL",     status: "Active" },
  { name: "BuildRight Co",  email: "sales@buildright.com",  phone: "+1 555-0157", location: "Houston, TX",     status: "Active" },
  { name: "OfficePro",      email: "orders@officepro.com",  phone: "+1 555-0146", location: "Seattle, WA",     status: "Inactive" },
  { name: "SportZone",      email: "supply@sportzone.com",  phone: "+1 555-0163", location: "Miami, FL",       status: "Active" },
];

const TH: React.CSSProperties = { padding: "11px 16px", textAlign: "left" as const, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: "0.84rem", color: "#374151", borderBottom: "1px solid #f1f5f9" };

export function Vendors() {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Vendors</h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage your suppliers and vendor relationships</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
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
              {VENDOR_DETAILS.map((v, i) => {
                const productCount = products.filter((p) => p.supplier === v.name).length;
                const isActive = v.status === "Active";
                return (
                  <tr key={v.name} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")} style={{ transition: "background 0.12s" }}>
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
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.78rem" }}>
                          <Mail style={{ width: "12px", height: "12px", flexShrink: 0 }} /> {v.email}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.78rem" }}>
                          <Phone style={{ width: "12px", height: "12px", flexShrink: 0 }} /> {v.phone}
                        </div>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.82rem" }}>
                        <MapPin style={{ width: "13px", height: "13px", color: "#7c3aed" }} /> {v.location}
                      </div>
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
    </div>
  );
}