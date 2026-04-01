import { useState } from "react";
import { Bell, Moon, Globe, Shield, ChevronRight } from "lucide-react";

const CARD: React.CSSProperties = {
  background: "white",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

/* ── Reusable toggle ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: "42px", height: "24px", borderRadius: "12px", padding: "2px",
        background: checked ? "#7c3aed" : "#cbd5e1",
        border: "none", cursor: "pointer", transition: "background 0.2s",
        display: "flex", alignItems: "center",
      }}
    >
      <div
        style={{
          width: "20px", height: "20px", borderRadius: "50%", background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "transform 0.2s",
          transform: checked ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

type SettingItemProps = { icon: typeof Bell; label: string; desc: string; toggle?: boolean; checked?: boolean; onChange?: (v: boolean) => void };

function SettingItem({ icon: Icon, label, desc, toggle, checked, onChange }: SettingItemProps) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 20px", borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: "18px", height: "18px", color: "#7c3aed" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#1e293b", fontSize: "0.88rem", fontWeight: 600 }}>{label}</div>
        <div style={{ color: "#64748b", fontSize: "0.76rem", marginTop: "2px" }}>{desc}</div>
      </div>
      {toggle && checked !== undefined && onChange ? (
        <Toggle checked={checked} onChange={onChange} />
      ) : (
        <ChevronRight style={{ width: "16px", height: "16px", color: "#94a3b8" }} />
      )}
    </div>
  );
}

export function Settings() {
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div style={{ padding: "28px 32px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Settings</h1>
        <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>Manage your application preferences and security</p>
      </div>

      {/* Notifications Section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "10px", paddingLeft: "4px" }}>
          Notifications
        </div>
        <div style={CARD}>
          <SettingItem
            icon={Bell} label="Low Stock Alerts" desc="Get notified when products fall below minimum stock level"
            toggle checked={lowStockAlerts} onChange={setLowStockAlerts}
          />
          <SettingItem
            icon={Bell} label="Email Notifications" desc="Receive daily summary emails about inventory changes"
            toggle checked={emailNotifications} onChange={setEmailNotifications}
          />
        </div>
      </div>

      {/* Appearance Section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "10px", paddingLeft: "4px" }}>
          Appearance
        </div>
        <div style={CARD}>
          <SettingItem
            icon={Moon} label="Dark Mode" desc="Switch between light and dark theme"
            toggle checked={darkMode} onChange={setDarkMode}
          />
          <SettingItem
            icon={Globe} label="Language" desc="English (US)"
          />
        </div>
      </div>

      {/* Security Section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "10px", paddingLeft: "4px" }}>
          Security
        </div>
        <div style={CARD}>
          <SettingItem
            icon={Shield} label="Two-Factor Authentication" desc="Add an extra layer of security to your account"
            toggle checked={twoFactor} onChange={setTwoFactor}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1rem" }}>ℹ️</span>
        <span style={{ color: "#4c1d95", fontSize: "0.78rem", lineHeight: 1.5 }}>
          Settings are stored locally. Some features like email notifications and 2FA require backend configuration.
        </span>
      </div>
    </div>
  );
}
