export const ROLES = {
  ADMIN:   'admin',
  MANAGER: 'manager',
  STAFF:   'staff',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const STOCK_ACTIONS = {
  ADD:    'Add',
  REMOVE: 'Remove',
  ADJUST: 'Adjust',
} as const;

export type StockAction = (typeof STOCK_ACTIONS)[keyof typeof STOCK_ACTIONS];

export const PRODUCT_STATUS = {
  IN_STOCK:     'In Stock',
  LOW_STOCK:    'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
} as const;
