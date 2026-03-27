export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type StockAction = "Add" | "Remove" | "Adjust";

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  status: ProductStatus;
  supplier: string;
};

export type StockEntry = {
  id: number;
  date: string;
  time: string;
  product: string;
  sku: string;
  action: StockAction;
  quantityChanged: number;
  updatedBy: string;
  notes: string;
};

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverage",
  "Hardware",
  "Office Supplies",
  "Sports",
];

export const SUPPLIERS = [
  "TechCorp Ltd",
  "FashionHub",
  "FoodWorld Inc",
  "BuildRight Co",
  "OfficePro",
  "SportZone",
];

export const products: Product[] = [
  { id: 1,  name: "Wireless Keyboard",  sku: "WK-001", category: "Electronics",    quantity: 45,  minStock: 10, price: 59.99,  status: "In Stock",    supplier: "TechCorp Ltd" },
  { id: 2,  name: "USB-C Hub",          sku: "UC-002", category: "Electronics",    quantity: 8,   minStock: 15, price: 34.99,  status: "Low Stock",   supplier: "TechCorp Ltd" },
  { id: 3,  name: "Office Chair",       sku: "OC-003", category: "Office Supplies",quantity: 12,  minStock: 5,  price: 199.99, status: "In Stock",    supplier: "OfficePro" },
  { id: 4,  name: "Running Shoes",      sku: "RS-004", category: "Sports",         quantity: 3,   minStock: 8,  price: 89.99,  status: "Low Stock",   supplier: "SportZone" },
  { id: 5,  name: "Steel Bolts Pack",   sku: "SB-005", category: "Hardware",       quantity: 200, minStock: 50, price: 12.99,  status: "In Stock",    supplier: "BuildRight Co" },
  { id: 6,  name: "Coffee Beans 1kg",   sku: "CB-006", category: "Food & Beverage",quantity: 0,   minStock: 20, price: 24.99,  status: "Out of Stock",supplier: "FoodWorld Inc" },
  { id: 7,  name: "Cotton T-Shirt",     sku: "CT-007", category: "Clothing",       quantity: 85,  minStock: 20, price: 19.99,  status: "In Stock",    supplier: "FashionHub" },
  { id: 8,  name: 'LED Monitor 24"',    sku: "LM-008", category: "Electronics",    quantity: 6,   minStock: 5,  price: 249.99, status: "In Stock",    supplier: "TechCorp Ltd" },
  { id: 9,  name: "Yoga Mat",           sku: "YM-009", category: "Sports",         quantity: 22,  minStock: 10, price: 39.99,  status: "In Stock",    supplier: "SportZone" },
  { id: 10, name: "Safety Helmet",      sku: "SH-010", category: "Hardware",       quantity: 4,   minStock: 10, price: 29.99,  status: "Low Stock",   supplier: "BuildRight Co" },
  { id: 11, name: "Green Tea Bags",     sku: "GT-011", category: "Food & Beverage",quantity: 150, minStock: 30, price: 8.99,   status: "In Stock",    supplier: "FoodWorld Inc" },
  { id: 12, name: "Denim Jeans",        sku: "DJ-012", category: "Clothing",       quantity: 40,  minStock: 15, price: 54.99,  status: "In Stock",    supplier: "FashionHub" },
];

export const stockHistory: StockEntry[] = [
  { id: 1,  date: "2026-03-25", time: "10:32 AM", product: "Wireless Keyboard", sku: "WK-001", action: "Add",    quantityChanged: 20,  updatedBy: "John Smith",   notes: "Restocked from supplier" },
  { id: 2,  date: "2026-03-25", time: "09:15 AM", product: "USB-C Hub",         sku: "UC-002", action: "Remove", quantityChanged: 5,   updatedBy: "Sarah Lee",    notes: "Sold to customer" },
  { id: 3,  date: "2026-03-24", time: "03:45 PM", product: "Coffee Beans 1kg",  sku: "CB-006", action: "Remove", quantityChanged: 30,  updatedBy: "Mike Johnson", notes: "Expired items removed" },
  { id: 4,  date: "2026-03-24", time: "11:20 AM", product: "Running Shoes",     sku: "RS-004", action: "Adjust", quantityChanged: -2,  updatedBy: "Sarah Lee",    notes: "Inventory recount" },
  { id: 5,  date: "2026-03-23", time: "02:10 PM", product: "Cotton T-Shirt",    sku: "CT-007", action: "Add",    quantityChanged: 50,  updatedBy: "John Smith",   notes: "New shipment arrived" },
  { id: 6,  date: "2026-03-22", time: "04:30 PM", product: 'LED Monitor 24"',   sku: "LM-008", action: "Remove", quantityChanged: 2,   updatedBy: "Mike Johnson", notes: "Customer order #1042" },
  { id: 7,  date: "2026-03-22", time: "10:00 AM", product: "Steel Bolts Pack",  sku: "SB-005", action: "Add",    quantityChanged: 100, updatedBy: "John Smith",   notes: "Monthly restocking" },
  { id: 8,  date: "2026-03-21", time: "01:15 PM", product: "Office Chair",      sku: "OC-003", action: "Adjust", quantityChanged: -1,  updatedBy: "Sarah Lee",    notes: "Damaged item removed" },
  { id: 9,  date: "2026-03-21", time: "10:45 AM", product: "Safety Helmet",     sku: "SH-010", action: "Remove", quantityChanged: 3,   updatedBy: "Mike Johnson", notes: "Returned to supplier" },
  { id: 10, date: "2026-03-20", time: "03:00 PM", product: "Yoga Mat",          sku: "YM-009", action: "Add",    quantityChanged: 15,  updatedBy: "John Smith",   notes: "Received from SportZone" },
];
