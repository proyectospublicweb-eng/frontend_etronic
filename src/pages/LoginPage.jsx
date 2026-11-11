import { useAuth } from "../context/useAuth.js";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";

function LoginPage() {
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);

  const destination = location.state?.from || "/adminetronic";

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/adminetronic" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(e.target);

    try {
      const data = await login({
        correoRegistro: formData.get("correoRegistro"),
        password: formData.get("password"),
        remember,
      });

      if (data?.rol === "admin") {
        navigate(destination, { replace: true });
      } else {
        navigate("/adminetronic", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No fue posible iniciar sesión. Verifica el servidor y tus credenciales.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <span className="mb-2 inline-block rounded-full border border-[#60a5fa]/30 bg-[#3b82f6]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#60a5fa]">
            Acceso Administrativo
          </span>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Ingresa con tu cuenta de administrador de Etronic
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3.5 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            name="correoRegistro"
            type="email"
            placeholder="Correo de administrador"
            autoComplete="email"
            className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-base text-white placeholder-slate-400 outline-none transition focus:border-[#60a5fa] focus:ring-2 focus:ring-[#3b82f6]/30 sm:text-sm"
            required
          />

          <PasswordField autoComplete="current-password" />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded accent-[#5848f4]"
          />
          Mantener sesión iniciada
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="crescendo-btn-gradient w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/35 transition duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? "Verificando..." : "Entrar al Panel"}
        </button>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-slate-400 transition hover:text-white lg:hidden"
          >
            ← Volver a la Landing Page
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
