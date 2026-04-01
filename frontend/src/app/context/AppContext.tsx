import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import {
  products as initialProducts,
  stockHistory as initialHistory,
  CATEGORIES as initialCategories,
  SUPPLIERS as initialSuppliers,
  type Product,
  type StockEntry,
  type StockAction,
} from "../data/mockData";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Vendor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "Inactive";
};

export type AppUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  initials: string;
  color: string;
};

export type Notification = {
  id: number;
  type: "low_stock" | "out_of_stock" | "product_added" | "stock_updated" | "vendor_added" | "user_added" | "category_added";
  message: string;
  timestamp: string;
  read: boolean;
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialVendors: Vendor[] = [
  { id: 1, name: "TechCorp Ltd",  email: "orders@techcorp.com",   phone: "+1 555-0101", location: "San Jose, CA",  status: "Active"   },
  { id: 2, name: "FashionHub",    email: "supply@fashionhub.com", phone: "+1 555-0182", location: "New York, NY",  status: "Active"   },
  { id: 3, name: "FoodWorld Inc", email: "b2b@foodworld.com",     phone: "+1 555-0139", location: "Chicago, IL",   status: "Active"   },
  { id: 4, name: "BuildRight Co", email: "sales@buildright.com",  phone: "+1 555-0157", location: "Houston, TX",   status: "Active"   },
  { id: 5, name: "OfficePro",     email: "orders@officepro.com",  phone: "+1 555-0146", location: "Seattle, WA",   status: "Inactive" },
  { id: 6, name: "SportZone",     email: "supply@sportzone.com",  phone: "+1 555-0163", location: "Miami, FL",     status: "Active"   },
];

const initialUsers: AppUser[] = [
  { id: 1, name: "John Smith",    email: "john.smith@acme.com", role: "Administrator",    lastLogin: "Today, 09:15 AM",      status: "Active",   initials: "JS", color: "#7c3aed" },
  { id: 2, name: "Sarah Lee",     email: "sarah.lee@acme.com",  role: "Inventory Manager",lastLogin: "Today, 08:42 AM",      status: "Active",   initials: "SL", color: "#6366f1" },
  { id: 3, name: "Mike Johnson",  email: "mike.j@acme.com",     role: "Warehouse Staff",  lastLogin: "Yesterday, 05:30 PM", status: "Active",   initials: "MJ", color: "#10b981" },
  { id: 4, name: "Anna Williams", email: "anna.w@acme.com",     role: "Viewer",           lastLogin: "3 days ago",          status: "Active",   initials: "AW", color: "#8b5cf6" },
  { id: 5, name: "Robert Chen",   email: "r.chen@acme.com",     role: "Inventory Manager",lastLogin: "1 week ago",          status: "Inactive", initials: "RC", color: "#0ea5e9" },
];

const buildInitialNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  let id = 1;
  initialProducts.forEach((p) => {
    if (p.status === "Out of Stock") {
      notifications.push({ id: id++, type: "out_of_stock", message: `${p.name} is out of stock`, timestamp: "Just now", read: false });
    } else if (p.status === "Low Stock") {
      notifications.push({ id: id++, type: "low_stock", message: `${p.name} is running low (${p.quantity} left)`, timestamp: "Just now", read: false });
    }
  });
  return notifications;
};

// ─── Context ──────────────────────────────────────────────────────────────────

type AppContextType = {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "status">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;

  vendors: Vendor[];
  addVendor: (v: Omit<Vendor, "id">) => void;

  users: AppUser[];
  addUser: (u: Omit<AppUser, "id" | "initials" | "color" | "lastLogin">) => void;

  categories: string[];
  addCategory: (name: string) => void;

  suppliers: string[];

  stockHistory: StockEntry[];
  addStockEntry: (productId: number, action: StockAction, qty: number, notes: string) => void;

  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;

  currentUser: AppUser;

  // ── Auth ──
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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const COLORS = ["#7c3aed", "#6366f1", "#10b981", "#8b5cf6", "#0ea5e9", "#ec4899", "#f59e0b"];

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

// ── Auth helpers ─────────────────────────────────────────────────────────────

const AUTH_KEY = "inv_auth_email";
const AUTH_TOKEN_KEY = "inv_auth_token";
const AUTH_USER_KEY = "inv_auth_user";

function readStoredEmail(): string | null {
  try { return localStorage.getItem(AUTH_KEY); } catch { return null; }
}

function readStoredUser(): { name: string; email: string; role: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function buildCurrentUser(email: string | null, storedUser?: { name: string; email: string; role: string } | null): AppUser {
  if (!email) return initialUsers[0]; // fallback
  // Check if we have stored Google user info
  if (storedUser && storedUser.email.toLowerCase() === email.toLowerCase()) {
    const name = storedUser.name;
    return {
      id: 0,
      name,
      email: storedUser.email,
      role: storedUser.role === 'admin' ? 'Administrator' : storedUser.role === 'manager' ? 'Inventory Manager' : storedUser.role === 'staff' ? 'Warehouse Staff' : storedUser.role,
      lastLogin: "Just now",
      status: "Active",
      initials: makeInitials(name),
      color: "#7c3aed",
    };
  }
  // See if this email maps to one of the seeded users
  const existing = initialUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) return existing;
  // Brand-new email from login form → create an on-the-fly user object
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: 0,
    name,
    email,
    role: "Administrator",
    lastLogin: "Just now",
    status: "Active",
    initials: makeInitials(name),
    color: "#7c3aed",
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authEmail, setAuthEmail] = useState<string | null>(readStoredEmail);
  const [storedUser, setStoredUser] = useState<{ name: string; email: string; role: string } | null>(readStoredUser);
  const isAuthenticated = authEmail !== null;
  const currentUser = useMemo(() => buildCurrentUser(authEmail, storedUser), [authEmail, storedUser]);

  const login = useCallback((data: { token: string; name: string; email: string; role: string }) => {
    try {
      localStorage.setItem(AUTH_KEY, data.email);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ name: data.name, email: data.email, role: data.role }));
    } catch { /* ignore */ }
    setStoredUser({ name: data.name, email: data.email, role: data.role });
    setAuthEmail(data.email);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch { /* ignore */ }
    setStoredUser(null);
    setAuthEmail(null);
  }, []);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [suppliers] = useState<string[]>(initialSuppliers);
  const [stockHistory, setStockHistory] = useState<StockEntry[]>(initialHistory);
  const [notifications, setNotifications] = useState<Notification[]>(buildInitialNotifications);

  // ── Notifications helper ──
  const pushNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications((prev) => [
      { ...notif, id: Date.now(), timestamp: now(), read: false },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Products ──
  const addProduct = useCallback(
    (data: Omit<Product, "id" | "status">) => {
      const newProduct: Product = {
        ...data,
        id: Date.now(),
        status: deriveStatus(data.quantity, data.minStock),
      };
      setProducts((prev) => [newProduct, ...prev]);
      setStockHistory((prev) => [
        {
          id: Date.now(),
          date: today(),
          time: now(),
          product: data.name,
          sku: data.sku,
          action: "Add",
          quantityChanged: data.quantity,
          updatedBy: currentUser.name,
          notes: "Initial stock on product creation",
        },
        ...prev,
      ]);
      pushNotification({ type: "product_added", message: `Product "${data.name}" added to inventory` });
    },
    [currentUser.name, pushNotification]
  );

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? { ...updated, status: deriveStatus(updated.quantity, updated.minStock) }
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Vendors ──
  const addVendor = useCallback(
    (data: Omit<Vendor, "id">) => {
      setVendors((prev) => [...prev, { ...data, id: Date.now() }]);
      pushNotification({ type: "vendor_added", message: `Vendor "${data.name}" added` });
    },
    [pushNotification]
  );

  // ── Users ──
  const addUser = useCallback(
    (data: Omit<AppUser, "id" | "initials" | "color" | "lastLogin">) => {
      const newUser: AppUser = {
        ...data,
        id: Date.now(),
        initials: makeInitials(data.name),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        lastLogin: "Never",
      };
      setUsers((prev) => [...prev, newUser]);
      pushNotification({ type: "user_added", message: `User "${data.name}" added as ${data.role}` });
    },
    [pushNotification]
  );

  // ── Categories ──
  const addCategory = useCallback(
    (name: string) => {
      setCategories((prev) => [...prev, name]);
      pushNotification({ type: "category_added", message: `Category "${name}" created` });
    },
    [pushNotification]
  );

  // ── Stock ──
  const addStockEntry = useCallback(
    (productId: number, action: StockAction, qty: number, notes: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          let newQty = p.quantity;
          if (action === "Add") newQty = p.quantity + qty;
          else if (action === "Remove") newQty = Math.max(0, p.quantity - qty);
          else newQty = qty;
          const updated = { ...p, quantity: newQty, status: deriveStatus(newQty, p.minStock) };
          if (updated.status === "Out of Stock") {
            pushNotification({ type: "out_of_stock", message: `${p.name} is now out of stock!` });
          } else if (updated.status === "Low Stock") {
            pushNotification({ type: "low_stock", message: `${p.name} stock is low (${newQty} left)` });
          }
          return updated;
        })
      );
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      setStockHistory((prev) => [
        {
          id: Date.now(),
          date: today(),
          time: now(),
          product: product.name,
          sku: product.sku,
          action,
          quantityChanged: action === "Remove" ? qty : qty,
          updatedBy: currentUser.name,
          notes,
        },
        ...prev,
      ]);
      pushNotification({ type: "stock_updated", message: `Stock ${action.toLowerCase()}ed for "${product.name}" (qty: ${qty})` });
    },
    [products, currentUser.name, pushNotification]
  );

  return (
    <AppContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        vendors, addVendor,
        users, addUser,
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
