import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, Package, Tag, Truck, Users, PlusCircle,
  RefreshCw, History, LogOut, ChevronDown, Bell, Search, Menu,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { path: "/",             label: "Dashboard",    icon: LayoutDashboard, end: true  },
      { path: "/products",     label: "Products",     icon: Package,         end: false },
      { path: "/categories",   label: "Categories",   icon: Tag,             end: false },
      { path: "/vendors",      label: "Vendors",      icon: Truck,           end: false },
      { path: "/users",        label: "Users",        icon: Users,           end: false },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/add-product",  label: "Add Product",  icon: PlusCircle,      end: false },
      { path: "/stock-update", label: "Update Stock", icon: RefreshCw,       end: false },
      { path: "/stock-history",label: "Stock History",icon: History,         end: false },
    ],
  },
];

export function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f1f5f9",
      }}
    >
      {/* ─── Sidebar ─── */}
      <aside
        style={{
          width: sidebarOpen ? "240px" : "0px",
          minWidth: sidebarOpen ? "240px" : "0px",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          flexShrink: 0,
          transition: "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "20px 18px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "#7c3aed",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Package style={{ width: "18px", height: "18px", color: "white" }} />
          </div>
          <div>
            <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>
              Inventory<span style={{ color: "#a78bfa" }}>Pro</span>
            </div>
            <div style={{ color: "#475569", fontSize: "0.6rem", whiteSpace: "nowrap" }}>
              Management System
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "14px 10px" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: "22px" }}>
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase" as const,
                  color: "#475569",
                  padding: "0 10px",
                  marginBottom: "5px",
                  whiteSpace: "nowrap",
                }}
              >
                {section.label}
              </div>

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 10px",
                    borderRadius: "8px",
                    marginBottom: "2px",
                    borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent",
                    background: isActive ? "rgba(124,58,237,0.1)" : "transparent",
                    color: isActive ? "#a78bfa" : "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.84rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap" as const,
                    transition: "all 0.15s ease",
                  })}
                  className="hover:!text-slate-200 hover:!bg-white/5"
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        style={{
                          width: "16px",
                          height: "16px",
                          flexShrink: 0,
                          color: isActive ? "#a78bfa" : undefined,
                        }}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "9px 10px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "0.84rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <LogOut style={{ width: "16px", height: "16px", flexShrink: 0 }} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <header
          style={{
            height: "62px",
            background: "white",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: "14px",
            flexShrink: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              padding: "6px",
              borderRadius: "7px",
            }}
          >
            <Menu style={{ width: "20px", height: "20px" }} />
          </button>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
            <Search
              style={{
                position: "absolute",
                left: "11px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "15px",
                height: "15px",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search products, SKUs…"
              style={{
                width: "100%",
                paddingLeft: "34px",
                paddingRight: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "9px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#1e293b",
                fontSize: "0.82rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Org dropdown */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 13px",
              borderRadius: "9px",
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#475569",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: "21px",
                height: "21px",
                borderRadius: "50%",
                background: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.58rem",
                fontWeight: 700,
              }}
            >
              A
            </div>
            Acme Corp
            <ChevronDown style={{ width: "13px", height: "13px", color: "#94a3b8" }} />
          </button>

          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
              }}
            >
              <Bell style={{ width: "19px", height: "19px" }} />
            </button>
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "8px",
                height: "8px",
                background: "#7c3aed",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          </div>

          {/* User profile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingLeft: "14px",
              borderLeft: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "33px",
                height: "33px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              JS
            </div>
            <div>
              <div style={{ color: "#1e293b", fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.2 }}>
                John Smith
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.68rem" }}>Administrator</div>
            </div>
            <ChevronDown style={{ width: "13px", height: "13px", color: "#94a3b8" }} />
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", background: "#f1f5f9" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}