import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../context/AppContext";

/**
 * Wraps any route that requires authentication.
 * Unauthenticated users are redirected to /login.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
