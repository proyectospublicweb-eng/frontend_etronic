import { useAuth } from "../context/useAuth.js";

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#020614] p-8 text-center text-white">
      <div className="crescendo-navy-banner w-full max-w-md rounded-3xl p-10 ring-1 ring-white/10 shadow-2xl">
        <h1 className="font-display text-3xl font-extrabold text-white">¡Hola, bienvenido!</h1>
        <p className="mt-2 text-sm text-slate-300">Sesión iniciada como</p>
        <p className="mt-1 font-semibold text-[#60a5fa]">{user?.correoRegistro}</p>

        <button
          type="button"
          onClick={logout}
          className="crescendo-btn-gradient mt-8 w-full rounded-full py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default HomePage;
