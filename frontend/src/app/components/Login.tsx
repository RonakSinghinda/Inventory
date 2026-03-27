import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Package, ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const WAREHOUSE_IMG =
  "https://images.unsplash.com/photo-1768796373360-95d80c5830fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50JTIwbW9kZXJufGVufDF8fHx8MTc3NDI2NDU4OXww&ixlib=rb-4.1.0&q=80&w=1080";

const FEATURES = [
  { icon: BarChart3,   text: "Real-time stock tracking & analytics" },
  { icon: ShieldCheck, text: "Secure, role-based access control" },
  { icon: Zap,         text: "Instant low-stock alerts & reports" },
];

const INPUT_BASE: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#1e293b",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState<{ email?: string; password?: string }>({});
  const [focusField, setFocusField] = useState<string | null>(null);

  const validate = () => {
    const e: typeof errors = {};
    if (!email)
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!password)
      e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/"); }, 1300);
  };

  const inputStyle = (field: string, hasError: boolean): React.CSSProperties => ({
    ...INPUT_BASE,
    borderColor: hasError ? "#7c3aed" : focusField === field ? "#7c3aed" : "#e2e8f0",
    boxShadow: focusField === field ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          minHeight: "580px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
        }}
      >
        {/* ── Left Panel ── */}
        <div
          style={{
            position: "relative",
            width: "45%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
          className="hidden md:flex"
        >
          {/* Background image */}
          <ImageWithFallback
            src={WAREHOUSE_IMG}
            alt="Warehouse"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(155deg, rgba(10,16,36,0.92) 0%, rgba(15,23,42,0.85) 55%, rgba(30,41,60,0.78) 100%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "36px 36px 32px",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  background: "#7c3aed",
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Package style={{ width: "20px", height: "20px", color: "white" }} />
              </div>
              <div
                style={{ color: "white", fontSize: "1rem", fontWeight: 700, lineHeight: 1.2 }}
              >
                Inventory<span style={{ color: "#a78bfa" }}>Pro</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#a78bfa",
                  marginBottom: "10px",
                }}
              >
                Welcome Back
              </div>
              <h1
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: "14px",
                }}
              >
                Manage inventory
                <br />
                with confidence.
              </h1>
              <p
                style={{
                  color: "rgba(203,213,225,0.82)",
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  marginBottom: "28px",
                }}
              >
                Track stock levels, monitor product flow, and keep operations
                running smoothly — all in one hub.
              </p>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(124,58,237,0.18)",
                        border: "1px solid rgba(124,58,237,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: "14px", height: "14px", color: "#a78bfa" }} />
                    </div>
                    <span style={{ color: "rgba(203,213,225,0.88)", fontSize: "0.82rem" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Learn More */}
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  color: "#a78bfa",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Learn More <ArrowRight style={{ width: "14px", height: "14px" }} />
              </button>
            </div>

            <p style={{ color: "rgba(100,116,139,0.7)", fontSize: "0.68rem" }}>
              © 2026 InventoryPro · College Project
            </p>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 48px",
            background: "white",
          }}
        >
          <div style={{ maxWidth: "360px", width: "100%", margin: "0 auto" }}>
            {/* Mobile logo */}
            <div
              className="flex md:hidden items-center gap-2 mb-8"
              style={{ display: "none" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#7c3aed",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Package style={{ width: "16px", height: "16px", color: "white" }} />
              </div>
              <span style={{ fontWeight: 700, color: "#1e293b" }}>InventoryPro</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: "8px",
                }}
              >
                Sign In
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.86rem" }}>
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  htmlFor="email"
                  style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 500, marginBottom: "7px" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField(null)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  style={inputStyle("email", !!errors.email)}
                />
                {errors.email && (
                  <p style={{ color: "#7c3aed", fontSize: "0.75rem", marginTop: "5px" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="password"
                  style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 500, marginBottom: "7px" }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField(null)}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    style={{ ...inputStyle("password", !!errors.password), paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                    }}
                  >
                    {showPw ? (
                      <EyeOff style={{ width: "17px", height: "17px" }} />
                    ) : (
                      <Eye style={{ width: "17px", height: "17px" }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: "#7c3aed", fontSize: "0.75rem", marginTop: "5px" }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#7c3aed",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "11px",
                  background: loading
                    ? "#ddd6fe"
                    : "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(124,58,237,0.35)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      style={{ width: "16px", height: "16px" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        style={{ opacity: 0.25 }}
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        style={{ opacity: 0.75 }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "24px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
              <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
            </div>

            {/* Sign up */}
            <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.84rem" }}>
              Don't have an account?{" "}
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#7c3aed",
                  cursor: "pointer",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}