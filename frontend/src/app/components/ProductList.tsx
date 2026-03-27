import { useState } from "react";
import { Search, Edit2, Trash2, RefreshCw, Filter, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { products as initialProducts, CATEGORIES, type Product } from "../data/mockData";

const ROWS_PER_PAGE = 8;

const STATUS_CFG = {
  "In Stock":    { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  "Low Stock":   { bg: "#f5f3ff", color: "#7c3aed", dot: "#7c3aed" },
  "Out of Stock":{ bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
} as const;

const TH: React.CSSProperties = {
  padding: "11px 16px",
  textAlign: "left" as const,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748b",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap" as const,
};

const TD: React.CSSProperties = {
  padding: "13px 16px",
  fontSize: "0.84rem",
  color: "#374151",
  borderBottom: "1px solid #f1f5f9",
  whiteSpace: "nowrap" as const,
};

export function ProductList() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState("");
  const [catFilter,setCatFilter]= useState("all");
  const [statFilter,setStatFilter]=useState("all");
  const [page,     setPage]     = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (catFilter  === "all" || p.category === catFilter) &&
      (statFilter === "all" || p.status   === statFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const SELECT: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "9px",
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#374151",
    fontSize: "0.82rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>
            Product List
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.84rem", marginTop: "4px" }}>
            Manage and monitor all your inventory products
          </p>
        </div>
        <button
          onClick={() => navigate("/add-product")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 18px",
            borderRadius: "10px",
            background: "#7c3aed",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontWeight: 600,
            boxShadow: "0 2px 10px rgba(124,58,237,0.3)",
          }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div
        style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "9px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontSize: "0.82rem", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
          <span style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>Filter:</span>
        </div>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => handleFilter(setCatFilter)(e.target.value)}
          style={SELECT}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statFilter}
          onChange={(e) => handleFilter(setStatFilter)(e.target.value)}
          style={SELECT}
        >
          <option value="all">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.78rem" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div
        style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: "40px" }}>#</th>
                <th style={TH}>Product</th>
                <th style={TH}>Category</th>
                <th style={TH}>Quantity</th>
                <th style={TH}>Min. Stock</th>
                <th style={TH}>Price</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign: "center" as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "0.88rem" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                pageData.map((p, i) => {
                  const s = STATUS_CFG[p.status];
                  return (
                    <tr key={p.id} style={{ transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
                      <td style={{ ...TD, color: "#94a3b8", fontWeight: 500 }}>
                        {(page - 1) * ROWS_PER_PAGE + i + 1}
                      </td>
                      <td style={TD}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{p.name}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.72rem", marginTop: "2px" }}>{p.sku}</div>
                      </td>
                      <td style={TD}>
                        <span style={{ padding: "3px 9px", borderRadius: "6px", background: "#f1f5f9", color: "#475569", fontSize: "0.78rem", fontWeight: 500 }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ ...TD, fontWeight: 600, color: p.quantity === 0 ? "#dc2626" : p.quantity <= p.minStock ? "#7c3aed" : "#1e293b" }}>
                        {p.quantity}
                      </td>
                      <td style={{ ...TD, color: "#64748b" }}>{p.minStock}</td>
                      <td style={{ ...TD, fontWeight: 600, color: "#1e293b" }}>${p.price.toFixed(2)}</td>
                      <td style={TD}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600 }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                          {p.status}
                        </span>
                      </td>
                      <td style={{ ...TD, textAlign: "center" as const }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <button
                            title="Edit"
                            style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#6366f1", display: "flex" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#ede9fe")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <Edit2 style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button
                            title="Update Stock"
                            onClick={() => navigate("/stock-update")}
                            style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#7c3aed", display: "flex" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <RefreshCw style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => deleteProduct(p.id)}
                            style={{ padding: "6px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", color: "#ef4444", display: "flex" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <Trash2 style={{ width: "14px", height: "14px" }} />
                          </button>
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
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}
        >
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
                style={{
                  padding: "5px 11px",
                  borderRadius: "7px",
                  border: pg === page ? "none" : "1px solid #e2e8f0",
                  background: pg === page ? "#7c3aed" : "white",
                  color: pg === page ? "white" : "#374151",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: pg === page ? 600 : 400,
                }}
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