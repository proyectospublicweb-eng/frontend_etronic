import { useAuth } from "../context/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await register({
        correoRegistro: formData.get("correoRegistro"),
        password,
        remember,
      });
      navigate("/adminetronic");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-white">Crear cuenta</h1>
          <p className="mt-2 text-sm text-slate-300">Únete y empieza a usar Etronic</p>
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
            placeholder="Correo"
            autoComplete="email"
            className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-[#60a5fa] focus:ring-2 focus:ring-[#3b82f6]/30"
            required
          />

          <PasswordField minLength={6} autoComplete="new-password" placeholder="Contraseña" />

          <PasswordField
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repetir contraseña"
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded accent-[#5848f4]"
          />
          Recordarme
        </label>

        <button
          type="submit"
          className="crescendo-btn-gradient w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/35 transition hover:-translate-y-0.5"
        >
          Crear cuenta
        </button>

        <p className="text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-[#60a5fa] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
