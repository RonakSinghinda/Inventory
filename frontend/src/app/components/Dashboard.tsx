import { useNavigate } from "react-router";
import {
  Package, AlertTriangle, Tag, Truck, BarChart2,
  ArrowUpRight, ArrowDownRight, ArrowRight, TrendingUp,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const CARD: React.CSSProperties = {
  background: "white",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const STATUS_CFG = {
  "In Stock":    { bg: "#f0fdf4", color: "#16a34a" },
  "Low Stock":   { bg: "#f5f3ff", color: "#7c3aed" },
  "Out of Stock":{ bg: "#fef2f2", color: "#dc2626" },
} as const;

const ACTION_CFG = {
  Add:    { bg: "#f0fdf4", color: "#16a34a", symbol: "+" },
  Remove: { bg: "#fef2f2", color: "#dc2626", symbol: "−" },
  Adjust: { bg: "#f5f3ff", color: "#7c3aed", symbol: "~" },
} as const;

const STATS = [
  { label: "Total Products",  value: "248",   icon: Package,   color: "#6366f1", change: "+12",    up: true  },
  { label: "Available Stock", value: "1,842", icon: BarChart2, color: "#10b981", change: "+5.2%",  up: true  },
  { label: "Low Stock Items", value: "14",    icon: AlertTriangle, color: "#7c3aed", change: "+3", up: false },
  { label: "Categories",      value: "6",     icon: Tag,       color: "#8b5cf6", change: "Stable", up: true  },
  { label: "Suppliers",       value: "18",    icon: Truck,     color: "#0ea5e9", change: "+2",     up: true  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { products, stockHistory } = useAppContext();
  const lowStock     = products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock");
  const recentActivity = stockHistory.slice(0, 6);

  return (
    <div style={{ padding: "28px 32px" }}>

      {/* ── Hero Banner ── */}
      <div
        style={{
          borderRadius: "16px",
          padding: "36px 40px",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 30%, #6d28d9 65%, #7c3aed 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position:"absolute", right:"-50px", top:"-50px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", right:"120px", bottom:"-70px", width:"260px", height:"260px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ position:"absolute", left:"55%", top:"10px", width:"120px", height:"120px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4b5fd", marginBottom: "8px" }}>
            Welcome back, John
          </div>
          <h1 style={{ color: "white", fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "12px" }}>
            Inventory Overview
          </h1>
          <p style={{ color: "rgba(221,214,254,0.85)", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: "500px" }}>
            Monitor stock levels, track product movements, and manage your operations
            efficiently — all from one central hub.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              onClick={() => navigate("/products")}
              style={{ padding: "9px 20px", borderRadius: "10px", background: "white", color: "#6d28d9", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600 }}
            >
              View Products
            </button>
            <button
              onClick={() => navigate("/add-product")}
              style={{ padding: "9px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600 }}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "16px", marginBottom: "24px" }}
      >
        {STATS.map((s) => (
          <div key={s.label} style={CARD}>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div
                  style={{ width: "40px", height: "40px", borderRadius: "11px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <s.icon style={{ width: "20px", height: "20px", color: s.color }} />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.7rem", fontWeight: 600, color: s.up ? "#10b981" : "#ef4444" }}
                >
                  {s.up
                    ? <ArrowUpRight style={{ width: "12px", height: "12px" }} />
                    : <ArrowDownRight style={{ width: "12px", height: "12px" }} />
                  }
                  {s.change}
                </div>
              </div>
              <div style={{ color: "#0f172a", fontSize: "1.65rem", fontWeight: 700, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "5px" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Low Stock Alerts */}
        <div style={CARD}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle style={{ width: "16px", height: "16px", color: "#7c3aed" }} />
              <span style={{ color: "#0f172a", fontSize: "0.9rem", fontWeight: 600 }}>Low Stock Alerts</span>
            </div>
            <button
              onClick={() => navigate("/products")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "0.76rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}
            >
              View All <ArrowRight style={{ width: "12px", height: "12px" }} />
            </button>
          </div>
          {lowStock.map((item) => {
            const s = STATUS_CFG[item.status];
            return (
              <div
                key={item.id}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", borderBottom: "1px solid #fafafa" }}
              >
                <div>
                  <div style={{ color: "#1e293b", fontSize: "0.84rem", fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{item.sku} · {item.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: s.color, fontSize: "0.84rem", fontWeight: 600 }}>{item.quantity} units</div>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "20px", background: s.bg, color: s.color, fontSize: "0.68rem", fontWeight: 600, marginTop: "3px" }}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div style={CARD}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp style={{ width: "16px", height: "16px", color: "#7c3aed" }} />
              <span style={{ color: "#0f172a", fontSize: "0.9rem", fontWeight: 600 }}>Recent Activity</span>
            </div>
            <button
              onClick={() => navigate("/stock-history")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "0.76rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}
            >
              View All <ArrowRight style={{ width: "12px", height: "12px" }} />
            </button>
          </div>
          {recentActivity.map((entry) => {
            const a = ACTION_CFG[entry.action];
            return (
              <div
                key={entry.id}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", borderBottom: "1px solid #fafafa" }}
              >
                <div
                  style={{ width: "30px", height: "30px", borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: a.color, fontSize: "0.9rem", fontWeight: 700 }}
                >
                  {a.symbol}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#334155", fontSize: "0.82rem", fontWeight: 500 }}>
                    <span style={{ color: a.color, fontWeight: 600 }}>{entry.action}</span>{" "}
                    {Math.abs(entry.quantityChanged)} units ·{" "}
                    <span style={{ color: "#1e293b", fontWeight: 600 }}>{entry.product}</span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.7rem", marginTop: "2px" }}>
                    {entry.time} · {entry.date} · by {entry.updatedBy}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}