import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";
import { IconLockOpen } from "./components/LandingIcons.jsx";

function AdminRoute() {
  const { loading, isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020614] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent" />
        <p className="text-sm text-slate-300">Verificando permisos de administrador...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.rol !== "admin") {
    const handleSwitchAccount = async () => {
      await logout();
      navigate("/login", { state: { from: location.pathname }, replace: true });
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020614] p-6 text-white">
        <div className="crescendo-navy-banner w-full max-w-md rounded-3xl p-8 text-center ring-1 ring-white/10 shadow-2xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 ring-1 ring-red-400/30">
            <IconLockOpen className="h-7 w-7" />
          </div>

          <h1 className="font-display mb-2 text-2xl font-extrabold text-white">
            Acceso Restringido
          </h1>

          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            El panel de administración de <span className="font-semibold text-white">Etronic</span>{" "}
            está habilitado únicamente para cuentas con rol{" "}
            <span className="rounded bg-indigo-500/25 px-1.5 py-0.5 font-mono text-xs text-[#60a5fa]">
              admin
            </span>
            .
          </p>

          <p className="mb-7 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-slate-300">
            Sesión actual: <span className="font-semibold text-white">{user?.correoRegistro}</span>{" "}
            ({user?.rol || "usuario"})
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="crescendo-btn-gradient w-full rounded-full py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/35 transition hover:-translate-y-0.5"
            >
              Iniciar con cuenta de Administrador
            </button>

            <Link
              to="/"
              className="w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Volver a la Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export default AdminRoute;
