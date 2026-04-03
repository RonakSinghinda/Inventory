import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { type Product, type StockEntry, type StockAction } from "../data/mockData";
import { fetchApi } from "../utils/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Vendor = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "Inactive";
};

export type AppUser = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  initials: string;
  color: string;
};

export type Notification = {
  id: string | number;
  type: "low_stock" | "out_of_stock" | "product_added" | "stock_updated" | "vendor_added" | "user_added" | "category_added";
  message: string;
  timestamp: string;
  read: boolean;
};

// Internal type to track categories with their DB ids
type CategoryObject = { id: string; name: string };

// ─── Context ──────────────────────────────────────────────────────────────────

type AppContextType = {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "status">) => Promise<void>;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string | number) => void;

  vendors: Vendor[];
  addVendor: (v: Omit<Vendor, "id">) => Promise<void>;

  users: AppUser[];
  addUser: (u: Omit<AppUser, "id" | "initials" | "color" | "lastLogin"> & { password: string }) => Promise<void>;

  categories: string[];
  addCategory: (name: string) => Promise<void>;

  suppliers: string[];

  stockHistory: StockEntry[];
  addStockEntry: (productId: string | number, action: StockAction, qty: number, notes: string) => Promise<void>;

  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;

  currentUser: AppUser;

  isAuthenticated: boolean;
  login: (data: { token: string; name: string; email: string; role: string }) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(qty: number, minStock: number): Product["status"] {
  if (qty === 0) return "Out of Stock";
  if (qty <= minStock) return "Low Stock";
  return "In Stock";
}

function makeInitials(name: string) {
  if (!name) return "";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const COLORS = ["#7c3aed", "#6366f1", "#10b981", "#8b5cf6", "#0ea5e9", "#ec4899", "#f59e0b"];

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Auth helpers ──────────────────────────────────────────────────────────────

const AUTH_KEY       = "inv_auth_email";
const AUTH_TOKEN_KEY = "inv_auth_token";
const AUTH_USER_KEY  = "inv_auth_user";

function readStoredEmail(): string | null {
  try { return localStorage.getItem(AUTH_KEY); } catch { return null; }
}

function readStoredUser(): { name: string; email: string; role: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function buildCurrentUser(
  email: string | null,
  stored?: { name: string; email: string; role: string } | null
): AppUser {
  const fallback: AppUser = {
    id: 0, name: "User", email: email || "", role: "Administrator",
    lastLogin: "Just now", status: "Active", initials: "U", color: "#7c3aed",
  };
  if (!email) return fallback;
  if (stored && stored.email.toLowerCase() === email.toLowerCase()) {
    const name = stored.name;
    const displayRole =
      stored.role === "admin"   ? "Administrator"     :
      stored.role === "manager" ? "Inventory Manager" :
      stored.role === "staff"   ? "Warehouse Staff"   : stored.role;
    return {
      id: 0, name, email: stored.email, role: displayRole,
      lastLogin: "Just now", status: "Active",
      initials: makeInitials(name), color: "#7c3aed",
    };
  }
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { id: 0, name, email, role: "Administrator", lastLogin: "Just now", status: "Active", initials: makeInitials(name), color: "#7c3aed" };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [authEmail,   setAuthEmail]   = useState<string | null>(readStoredEmail);
  const [storedUser,  setStoredUser]  = useState<{ name: string; email: string; role: string } | null>(readStoredUser);
  const isAuthenticated = authEmail !== null;
  const currentUser = useMemo(() => buildCurrentUser(authEmail, storedUser), [authEmail, storedUser]);

  const login = useCallback((data: { token: string; name: string; email: string; role: string }) => {
    try {
      localStorage.setItem(AUTH_KEY,       data.email);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY,  JSON.stringify({ name: data.name, email: data.email, role: data.role }));
    } catch {}
    setStoredUser({ name: data.name, email: data.email, role: data.role });
    setAuthEmail(data.email);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {}
    setStoredUser(null);
    setAuthEmail(null);
  }, []);

  // ── State ──
  const [products,      setProducts]      = useState<Product[]>([]);
  const [vendors,       setVendors]       = useState<Vendor[]>([]);
  const [users,         setUsers]         = useState<AppUser[]>([]);
  const [categories,    setCategories]    = useState<string[]>([]);
  const [categoryObjs,  setCategoryObjs]  = useState<CategoryObject[]>([]);   // ids for product creation
  const [suppliers,     setSuppliers]     = useState<string[]>([]);
  const [stockHistory,  setStockHistory]  = useState<StockEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Fetch all data on auth ──
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // 1. Categories (need IDs for product creation)
      const catRes = await fetchApi("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        const objs: CategoryObject[] = catData.data.map((c: any) => ({ id: c.id, name: c.name }));
        setCategoryObjs(objs);
        setCategories(objs.map((c) => c.name));
      }

      // 2. Vendors
      const venRes = await fetchApi("/api/vendors");
      if (venRes.ok) {
        const venData = await venRes.json();
        const mapped: Vendor[] = venData.data.map((v: any) => ({
          id: v.id, name: v.name, email: v.email || "N/A",
          phone: v.phone || "N/A", location: v.address || "N/A", status: "Active" as const,
        }));
        setVendors(mapped);
        setSuppliers(mapped.map((v) => v.name));
      }

      // 3. Products
      const proRes = await fetchApi("/api/products");
      if (proRes.ok) {
        const proData = await proRes.json();
        const mapped: Product[] = proData.data.map((p: any) => ({
          id:       p.id,
          name:     p.name,
          sku:      p.sku,
          category: p.category?.name  || "Uncategorized",
          supplier: p.vendor?.name    || "Unknown",
          quantity: p.quantity,
          minStock: p.minStock,
          price:    p.price,
          status:   deriveStatus(p.quantity, p.minStock),
        }));
        setProducts(mapped);

        // Build low-stock notifications from live data
        const notifs: Notification[] = [];
        mapped.forEach((p) => {
          if (p.status === "Out of Stock")
            notifs.push({ id: `oos-${p.id}`, type: "out_of_stock", message: `${p.name} is out of stock`, timestamp: "Just now", read: false });
          else if (p.status === "Low Stock")
            notifs.push({ id: `ls-${p.id}`, type: "low_stock", message: `${p.name} is running low (${p.quantity} left)`, timestamp: "Just now", read: false });
        });
        setNotifications(notifs);
      }

      // 4. Users (admin only)
      if (currentUser.role === "Administrator") {
        const usrRes = await fetchApi("/api/users");
        if (usrRes.ok) {
          const usrData = await usrRes.json();
          setUsers(usrData.data.map((u: any, i: number): AppUser => ({
            id:        u.id,
            name:      u.name,
            email:     u.email,
            role:      u.role === "admin" ? "Administrator" : u.role === "manager" ? "Inventory Manager" : "Warehouse Staff",
            lastLogin: "Never",
            status:    "Active",
            initials:  makeInitials(u.name),
            color:     COLORS[i % COLORS.length],
          })));
        }
      }

      // 5. Stock history
      const stkRes = await fetchApi("/api/stock/history");
      if (stkRes.ok) {
        const stkData = await stkRes.json();
        setStockHistory(stkData.data.map((s: any): StockEntry => {
          const d = new Date(s.createdAt);
          return {
            id:              s.id,
            date:            d.toISOString().slice(0, 10),
            time:            d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            product:         s.product?.name   || "Unknown",
            sku:             s.product?.sku    || "Unknown",
            action:          s.action          as StockAction,
            quantityChanged: s.quantityChanged,
            updatedBy:       s.updatedBy?.name || "System",
            notes:           s.notes           || "",
          };
        }));
      }
    } catch (err) {
      console.error("fetchAllData error:", err);
    }
  }, [isAuthenticated, currentUser.role]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // ── Notifications ──
  const pushNotif = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications((prev) => [
      { ...notif, id: `n-${Date.now()}`, timestamp: nowTime(), read: false },
      ...prev,
    ]);
  }, []);

  const markAllRead  = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);
  const unreadCount  = notifications.filter((n) => !n.read).length;

  // ── Products ──
  const addProduct = useCallback(async (data: Omit<Product, "id" | "status">) => {
    // Look up the real DB ids from cached objects
    const categoryObj = categoryObjs.find((c) => c.name === data.category);
    const vendorObj   = vendors.find((v) => v.name === data.supplier);

    if (!categoryObj || !vendorObj) {
      console.error("addProduct: cannot resolve categoryId or vendorId", { categoryObj, vendorObj });
      return;
    }

    try {
      const res = await fetchApi("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name:        data.name,
          sku:         data.sku,
          description: "",
          price:       data.price,
          quantity:    data.quantity,
          minStock:    data.minStock,
          categoryId:  categoryObj.id,
          vendorId:    String(vendorObj.id),
        }),
      });
      if (res.ok) {
        const pData = await res.json();
        const newP: Product = { ...data, id: pData.data.id, status: deriveStatus(data.quantity, data.minStock) };
        setProducts((prev) => [newP, ...prev]);
        setStockHistory((prev) => [{
          id: `sh-${Date.now()}`, date: todayDate(), time: nowTime(),
          product: data.name, sku: data.sku, action: "Add",
          quantityChanged: data.quantity, updatedBy: currentUser.name,
          notes: "Initial stock on product creation",
        }, ...prev]);
        pushNotif({ type: "product_added", message: `Product "${data.name}" added to inventory` });
      } else {
        const err = await res.json().catch(() => null);
        console.error("addProduct failed:", err?.message);
      }
    } catch (err) { console.error(err); }
  }, [categoryObjs, vendors, currentUser.name, pushNotif]);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) =>
      p.id === updated.id ? { ...updated, status: deriveStatus(updated.quantity, updated.minStock) } : p
    ));
  }, []);

  const deleteProduct = useCallback((id: string | number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Vendors ──
  const addVendor = useCallback(async (data: Omit<Vendor, "id">) => {
    try {
      const res = await fetchApi("/api/vendors", {
        method: "POST",
        body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, address: data.location }),
      });
      if (res.ok) {
        const v = await res.json();
        setVendors((prev)  => [...prev, { ...data, id: v.data.id }]);
        setSuppliers((prev) => [...prev, data.name]);
        pushNotif({ type: "vendor_added", message: `Vendor "${data.name}" added` });
      }
    } catch (err) { console.error(err); }
  }, [pushNotif]);

  // ── Users ──
  const addUser = useCallback(async (data: Omit<AppUser, "id" | "initials" | "color" | "lastLogin"> & { password: string }) => {
    const roleMap: Record<string, string> = {
      "Administrator":     "admin",
      "Inventory Manager": "manager",
      "Warehouse Staff":   "staff",
      "Viewer":            "staff",
    };
    try {
      const res = await fetchApi("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name:     data.name,
          email:    data.email,
          password: data.password,
          role:     roleMap[data.role] || "staff",
        }),
      });
      if (res.ok) {
        const u = await res.json();
        const newUser: AppUser = {
          id:        u.data.id,
          name:      data.name,
          email:     data.email,
          role:      data.role,
          status:    data.status,
          lastLogin: "Never",
          initials:  makeInitials(data.name),
          color:     COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        setUsers((prev) => [...prev, newUser]);
        pushNotif({ type: "user_added", message: `User "${data.name}" added as ${data.role}` });
      } else {
        const err = await res.json().catch(() => null);
        console.error("addUser failed:", err?.message);
      }
    } catch (err) { console.error(err); }
  }, [pushNotif]);

  // ── Categories ──
  const addCategory = useCallback(async (name: string) => {
    try {
      const res = await fetchApi("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const c = await res.json();
        setCategoryObjs((prev) => [...prev, { id: c.data.id, name }]);
        setCategories((prev)   => [...prev, name]);
        pushNotif({ type: "category_added", message: `Category "${name}" created` });
      }
    } catch (err) { console.error(err); }
  }, [pushNotif]);

  // ── Stock ──
  const addStockEntry = useCallback(async (
    productId: string | number,
    action: StockAction,
    qty: number,
    notes: string,
  ) => {
    try {
      const res = await fetchApi("/api/stock/update", {
        method: "POST",
        body: JSON.stringify({
          productId:       String(productId),
          action,
          quantityChanged: qty,   // ← correct field name required by backend DTO
          notes,
        }),
      });
      if (res.ok) {
        // Refresh all data to stay in sync with DB
        await fetchAllData();
        pushNotif({ type: "stock_updated", message: `Stock ${action.toLowerCase()}ed successfully` });
      } else {
        const err = await res.json().catch(() => null);
        console.error("addStockEntry failed:", err?.message);
      }
    } catch (err) { console.error(err); }
  }, [fetchAllData, pushNotif]);

  return (
    <AppContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        vendors,  addVendor,
        users,    addUser,
        categories, addCategory,
        suppliers,
        stockHistory, addStockEntry,
        notifications, markAllRead, unreadCount,
        currentUser,
        isAuthenticated, login, logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
