import { useState } from "react";
import { History, TrendingUp, TrendingDown, SlidersHorizontal, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { type StockAction } from "../data/mockData";

const ROWS_PER_PAGE = 7;

const ACTION_CFG: Record<StockAction, { bg: string; color: string; label: string }> = {
  Add: { bg: "#f0fdf4", color: "#16a34a", label: "Added" },
  Remove: { bg: "#fef2f2", color: "#dc2626", label: "Removed" },
  Adjust: { bg: "#f5f3ff", color: "#7c3aed", label: "Adjusted" },
};

const TH: React.CSSProperties = {
  padding: "11px 16px",
  textAlign: "left" as const,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap" as const,
};
const TD: React.CSSProperties = {
  padding: "13px 16px",
  fontSize: "0.83rem",
  color: "#374151",
  borderBottom: "1px solid #f1f5f9",
};

export function StockHistory() {
  const { stockHistory } = useAppContext();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | StockAction>("all");
  const [page, setPage] = useState(1);

  const filtered = stockHistory.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.product.toLowerCase().includes(q) || e.sku.toLowerCase().includes(q) || e.updatedBy.toLowerCase().includes(q)) &&
      (actionFilter === "all" || e.action === actionFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const totalAdd = stockHistory.filter((e) => e.action === "Add").length;
  const totalRemove = stockHistory.filter((e) => e.action === "Remove").length;
  const totalAdjust = stockHistory.filter((e) => e.action === "Adjust").length;

  const CARD: React.CSSProperties = {
    background: "white",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  const SELECT: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "9px",
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#374151",
    fontSize: "0.8rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>
            Stock History
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>
            Full audit log of all stock changes and movements
          </p>
        </div>
        <button
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "10px", background: "white", color: "#374151", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.84rem", fontWeight: 500 }}
        >
          <Download style={{ width: "14px", height: "14px", color: "#64748b" }} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Transactions", value: stockHistory.length, icon: History, color: "#6366f1" },
          { label: "Stock Additions", value: totalAdd, icon: TrendingUp, color: "#16a34a" },
          { label: "Stock Removals", value: totalRemove, icon: TrendingDown, color: "#dc2626" },
          { label: "Adjustments", value: totalAdjust, icon: SlidersHorizontal, color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={CARD}>
            <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon style={{ width: "20px", height: "20px", color }} />
              </div>
              <div>
                <div style={{ color: "#0f172a", fontSize: "1.55rem", fontWeight: 700, lineHeight: 1 }}>{value}</div>
                <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "4px" }}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...CARD, padding: "14px 20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search product, SKU, or user…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: "100%", paddingLeft: "32px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.82rem", color: "#1e293b", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Filter style={{ width: "13px", height: "13px", color: "#94a3b8" }} />
          <span style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>Action:</span>
        </div>

        {(["all", "Add", "Remove", "Adjust"] as const).map((a) => {
          const isActive = actionFilter === a;
          const cfg = a !== "all" ? ACTION_CFG[a] : null;
          return (
            <button
              key={a}
              onClick={() => { setActionFilter(a); setPage(1); }}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: isActive ? (cfg?.color ?? "#7c3aed") : "#e2e8f0",
                background: isActive ? (cfg?.bg ?? "#f5f3ff") : "white",
                color: isActive ? (cfg?.color ?? "#7c3aed") : "#64748b",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {a === "all" ? "All" : a}
            </button>
          );
        })}

        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.78rem" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: "40px" }}>#</th>
                <th style={TH}>Date & Time</th>
                <th style={TH}>Product</th>
                <th style={TH}>SKU</th>
                <th style={TH}>Action</th>
                <th style={TH}>Qty Changed</th>
                <th style={TH}>Updated By</th>
                <th style={TH}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "0.88rem" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                pageData.map((entry, i) => {
                  const a = ACTION_CFG[entry.action];
                  const sign = entry.action === "Add" ? "+" : entry.action === "Remove" ? "-" : "~";
                  const qtyColor = entry.action === "Add" ? "#16a34a" : entry.action === "Remove" ? "#dc2626" : "#7c3aed";
                  return (
                    <tr
                      key={entry.id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      style={{ transition: "background 0.12s" }}
                    >
                      <td style={{ ...TD, color: "#94a3b8", fontWeight: 500 }}>
                        {(page - 1) * ROWS_PER_PAGE + i + 1}
                      </td>
                      <td style={TD}>
                        <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.82rem" }}>{entry.date}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{entry.time}</div>
                      </td>
                      <td style={{ ...TD, fontWeight: 600, color: "#1e293b" }}>{entry.product}</td>
                      <td style={{ ...TD }}>
                        <span style={{ padding: "3px 8px", borderRadius: "5px", background: "#f1f5f9", color: "#475569", fontSize: "0.75rem", fontWeight: 500 }}>
                          {entry.sku}
                        </span>
                      </td>
                      <td style={TD}>
                        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "20px", background: a.bg, color: a.color, fontSize: "0.72rem", fontWeight: 600 }}>
                          {a.label}
                        </span>
                      </td>
                      <td style={TD}>
                        <span style={{ color: qtyColor, fontWeight: 700, fontSize: "0.88rem" }}>
                          {sign}{Math.abs(entry.quantityChanged)}
                        </span>
                      </td>
                      <td style={{ ...TD, color: "#374151" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: "#64748b", flexShrink: 0 }}>
                            {entry.updatedBy.split(" ").map((n) => n[0]).join("")}
                          </div>
                          {entry.updatedBy}
                        </div>
                      </td>
                      <td style={{ ...TD, color: "#64748b", maxWidth: "200px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {entry.notes || "—"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
          <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid #e2e8f0", background: "white", color: page === 1 ? "#cbd5e1" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
            >
              <ChevronLeft style={{ width: "14px", height: "14px" }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                style={{ padding: "5px 11px", borderRadius: "7px", border: pg === page ? "none" : "1px solid #e2e8f0", background: pg === page ? "#7c3aed" : "white", color: pg === page ? "white" : "#374151", cursor: "pointer", fontSize: "0.8rem", fontWeight: pg === page ? 600 : 400 }}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid #e2e8f0", background: "white", color: page === totalPages ? "#cbd5e1" : "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
            >
              <ChevronRight style={{ width: "14px", height: "14px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}