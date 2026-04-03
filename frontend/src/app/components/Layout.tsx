import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, Package, Tag, Truck, Users, PlusCircle,
  RefreshCw, History, LogOut, ChevronDown, Bell, Search, Menu,
  User, Settings, CheckCheck, AlertTriangle, ShoppingBag, UserPlus, FolderPlus,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

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

const NOTIF_ICON: Record<string, typeof AlertTriangle> = {
  low_stock: AlertTriangle,
  out_of_stock: AlertTriangle,
  product_added: ShoppingBag,
  stock_updated: RefreshCw,
  vendor_added: Truck,
  user_added: UserPlus,
  category_added: FolderPlus,
};

const NOTIF_COLOR: Record<string, string> = {
  low_stock: "#f59e0b",
  out_of_stock: "#ef4444",
  product_added: "#10b981",
  stock_updated: "#7c3aed",
  vendor_added: "#0ea5e9",
  user_added: "#6366f1",
  category_added: "#8b5cf6",
};

export function Layout() {
  const navigate = useNavigate();
  const { currentUser, notifications, markAllRead, unreadCount, logout } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const handleBellClick = () => {
    setBellOpen((v) => !v);
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen((v) => !v);
    setBellOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f1f5f9" }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-dropdown]")) {
          setProfileOpen(false);
          setBellOpen(false);
        }
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
            display: "flex", alignItems: "center", gap: "12px",
            padding: "20px 18px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "34px", height: "34px", background: "#7c3aed", borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Package style={{ width: "18px", height: "18px", color: "white" }} />
          </div>
          <div>
            <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>
              Inventory<span style={{ color: "#a78bfa" }}>Pro</span>
            </div>
            <div style={{ color: "#475569", fontSize: "0.6rem", whiteSpace: "nowrap" }}>Management System</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "14px 10px" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: "22px" }}>
              <div
                style={{
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.11em",
                  textTransform: "uppercase" as const, color: "#475569",
                  padding: "0 10px", marginBottom: "5px", whiteSpace: "nowrap",
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
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 10px", borderRadius: "8px", marginBottom: "2px",
                    borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent",
                    background: isActive ? "rgba(124,58,237,0.1)" : "transparent",
                    color: isActive ? "#a78bfa" : "#94a3b8",
                    textDecoration: "none", fontSize: "0.84rem", fontWeight: 500,
                    whiteSpace: "nowrap" as const, transition: "all 0.15s ease",
                  })}
                  className="hover:!text-slate-200 hover:!bg-white/5"
                >
                  {({ isActive }) => (
                    <>
                      <item.icon style={{ width: "16px", height: "16px", flexShrink: 0, color: isActive ? "#a78bfa" : undefined }} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%",
              padding: "9px 10px", borderRadius: "8px", background: "transparent",
              border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.84rem",
              fontWeight: 500, whiteSpace: "nowrap", transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
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
            height: "62px", background: "white", borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", padding: "0 24px", gap: "14px",
            flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: "6px", borderRadius: "7px" }}
          >
            <Menu style={{ width: "20px", height: "20px" }} />
          </button>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
            <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search products, SKUs…"
              style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.82rem", outline: "none" }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Org dropdown (static) */}
          <button
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 13px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "white", color: "#475569", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500 }}
          >
            <div style={{ width: "21px", height: "21px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.58rem", fontWeight: 700 }}>A</div>
            Acme Corp
            <ChevronDown style={{ width: "13px", height: "13px", color: "#94a3b8" }} />
          </button>

          {/* Notification Bell */}
          <div style={{ position: "relative" }} data-dropdown>
            <button
              onClick={handleBellClick}
              style={{ background: bellOpen ? "#f5f3ff" : "transparent", border: "none", cursor: "pointer", color: bellOpen ? "#7c3aed" : "#64748b", padding: "8px", borderRadius: "8px", display: "flex", transition: "all 0.15s" }}
            >
              <Bell style={{ width: "19px", height: "19px" }} />
            </button>
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", background: "#7c3aed", borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.52rem", fontWeight: 700 }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}

            {/* Notification Panel */}
            {bellOpen && (
              <div
                data-dropdown
                style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  width: "360px", background: "white", borderRadius: "14px",
                  border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  zIndex: 1000, overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>Notifications</div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ display: "flex", alignItems: "center", gap: "5px", background: "transparent", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      <CheckCheck style={{ width: "13px", height: "13px" }} /> Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "0.84rem" }}>No notifications</div>
                  ) : (
                    notifications.slice(0, 15).map((notif) => {
                      const Icon = NOTIF_ICON[notif.type] ?? Bell;
                      const color = NOTIF_COLOR[notif.type] ?? "#64748b";
                      return (
                        <div
                          key={notif.id}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: "12px",
                            padding: "12px 18px", borderBottom: "1px solid #f8fafc",
                            background: notif.read ? "white" : "#faf5ff",
                            transition: "background 0.12s",
                          }}
                        >
                          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon style={{ width: "16px", height: "16px", color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.8rem", color: "#1e293b", fontWeight: notif.read ? 400 : 600, lineHeight: 1.4 }}>{notif.message}</div>
                            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "3px" }}>{notif.timestamp}</div>
                          </div>
                          {!notif.read && (
                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: "6px" }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                {notifications.length > 15 && (
                  <div style={{ padding: "12px 18px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600 }}>+{notifications.length - 15} more</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div style={{ position: "relative" }} data-dropdown>
            <button
              onClick={handleProfileClick}
              style={{
                display: "flex", alignItems: "center", gap: "10px", paddingLeft: "14px",
                borderLeft: "1px solid #e2e8f0", background: "transparent", border: "none",
                cursor: "pointer", borderRadius: "9px", padding: "6px 10px 6px 14px",
                transition: "background 0.15s",
                ...(profileOpen ? { background: "#f5f3ff" } : {}),
              }}
            >
              <div
                style={{
                  width: "33px", height: "33px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
                }}
              >
                {currentUser.initials}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#1e293b", fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap" }}>{currentUser.name}</div>
                <div style={{ color: "#94a3b8", fontSize: "0.68rem", whiteSpace: "nowrap" }}>{currentUser.role}</div>
              </div>
              <ChevronDown style={{ width: "13px", height: "13px", color: "#94a3b8", transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                data-dropdown
                style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  width: "240px", background: "white", borderRadius: "14px",
                  border: "1px solid #e2e8f0", boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  zIndex: 1000, overflow: "hidden",
                }}
              >
                {/* Profile header */}
                <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.85rem", fontWeight: 700, flexShrink: 0 }}>
                    {currentUser.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>{currentUser.name}</div>
                    <div style={{ color: "#64748b", fontSize: "0.72rem" }}>{currentUser.email}</div>
                    <span style={{ display: "inline-block", marginTop: "4px", padding: "2px 8px", borderRadius: "20px", background: "#f5f3ff", color: "#7c3aed", fontSize: "0.65rem", fontWeight: 600 }}>{currentUser.role}</span>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: "8px" }}>
                  {[
                    { icon: User, label: "My Profile", path: "/profile" },
                    { icon: Settings, label: "Settings", path: "/settings" },
                  ].map(({ icon: Icon, label, path }) => (
                    <button
                      key={label}
                      onClick={() => { setProfileOpen(false); navigate(path); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", borderRadius: "9px", background: "transparent", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.84rem", fontWeight: 500, transition: "background 0.12s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Icon style={{ width: "15px", height: "15px", color: "#64748b" }} />
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px" }}>
                  <button
                    onClick={handleLogout}
                    style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", borderRadius: "9px", background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.84rem", fontWeight: 500, transition: "background 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut style={{ width: "15px", height: "15px" }} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
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