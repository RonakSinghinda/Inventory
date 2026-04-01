import { useAppContext } from "../context/AppContext";
import { User, Mail, Shield, Clock, Edit2 } from "lucide-react";

const CARD: React.CSSProperties = {
  background: "white",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

export function Profile() {
  const { currentUser } = useAppContext();

  return (
    <div style={{ padding: "28px 32px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>My Profile</h1>
        <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>View and manage your account information</p>
      </div>

      {/* Profile Card */}
      <div style={CARD}>
        {/* Cover / Banner */}
        <div
          style={{
            height: "120px",
            borderRadius: "14px 14px 0 0",
            background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 30%, #6d28d9 65%, #7c3aed 100%)",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", right: "20px", top: "16px" }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "8px",
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                color: "white", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
              }}
            >
              <Edit2 style={{ width: "13px", height: "13px" }} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div style={{ padding: "0 28px 28px", marginTop: "-40px", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", marginBottom: "24px" }}>
            <div
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}cc)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "1.6rem", fontWeight: 700,
                border: "4px solid white", boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              {currentUser.initials}
            </div>
            <div style={{ paddingBottom: "6px" }}>
              <div style={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.2 }}>{currentUser.name}</div>
              <span
                style={{
                  display: "inline-block", marginTop: "6px",
                  padding: "3px 10px", borderRadius: "20px",
                  background: "#f5f3ff", color: "#7c3aed",
                  fontSize: "0.72rem", fontWeight: 600,
                }}
              >
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              { icon: User, label: "Full Name", value: currentUser.name },
              { icon: Mail, label: "Email Address", value: currentUser.email },
              { icon: Shield, label: "Role", value: currentUser.role },
              { icon: Clock, label: "Last Login", value: currentUser.lastLogin },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  padding: "16px 18px", borderRadius: "10px",
                  background: "#f8fafc", border: "1px solid #f1f5f9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Icon style={{ width: "14px", height: "14px", color: "#7c3aed" }} />
                  <span style={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                </div>
                <div style={{ color: "#1e293b", fontSize: "0.9rem", fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Account Status */}
          <div style={{ marginTop: "20px", padding: "16px 18px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ color: "#15803d", fontSize: "0.82rem", fontWeight: 500 }}>Account is active and in good standing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
