import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020614] text-slate-300">
        Verificando sesión...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
