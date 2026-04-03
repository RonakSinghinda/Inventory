import { createBrowserRouter, Navigate } from "react-router";
import { Layout }         from "./components/Layout";
import { Login }          from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard }      from "./components/Dashboard";
import { ProductList }    from "./components/ProductList";
import { AddProduct }     from "./components/AddProduct";
import { StockUpdate }    from "./components/StockUpdate";
import { StockHistory }   from "./components/StockHistory";
import { Categories }     from "./components/Categories";
import { Vendors }        from "./components/Vendors";
import { Users }          from "./components/Users";
import { Profile }        from "./components/Profile";
import { Settings }       from "./components/Settings";

export const router = createBrowserRouter([
  // Public route — login page (no guard)
  {
    path: "/login",
    Component: Login,
  },

  // All app routes — guarded by ProtectedRoute
  {
    path: "/",
    Component: ProtectedRoute,     // ← checks auth, redirects to /login if not authed
    children: [
      {
        Component: Layout,         // ← sidebar + header wrapper
        children: [
          { index: true,              Component: Dashboard   },
          { path: "products",         Component: ProductList },
          { path: "categories",       Component: Categories  },
          { path: "vendors",          Component: Vendors     },
          { path: "users",            Component: Users       },
          { path: "add-product",      Component: AddProduct  },
          { path: "stock-update",     Component: StockUpdate },
          { path: "stock-history",    Component: StockHistory},
          { path: "profile",          Component: Profile     },
          { path: "settings",         Component: Settings    },
        ],
      },
    ],
  },

  // Catch-all: redirect unknown paths to root (which will auth-check)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
