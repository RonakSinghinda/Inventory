import { createBrowserRouter } from "react-router";
import { Layout }       from "./components/Layout";
import { Login }        from "./components/Login";
import { Dashboard }    from "./components/Dashboard";
import { ProductList }  from "./components/ProductList";
import { AddProduct }   from "./components/AddProduct";
import { StockUpdate }  from "./components/StockUpdate";
import { StockHistory } from "./components/StockHistory";
import { Categories }   from "./components/Categories";
import { Vendors }      from "./components/Vendors";
import { Users }        from "./components/Users";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,              Component: Dashboard   },
      { path: "products",         Component: ProductList },
      { path: "categories",       Component: Categories  },
      { path: "vendors",          Component: Vendors     },
      { path: "users",            Component: Users       },
      { path: "add-product",      Component: AddProduct  },
      { path: "stock-update",     Component: StockUpdate },
      { path: "stock-history",    Component: StockHistory},
    ],
  },
]);
