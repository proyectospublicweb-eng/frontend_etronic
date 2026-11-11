import { Link } from "react-router-dom";
import { IconShieldCheck } from "./LandingIcons.jsx";

function AuthLayout({ children }) {
  return (
    <div className="crescendo-hero-surface relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="parallax-tech-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#001039]/90 shadow-2xl backdrop-blur-xl sm:min-h-[620px]">
        {/* Panel decorativo izquierdo */}
        <div className="crescendo-navy-banner relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 p-10 lg:flex">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/images/logo-etronic-dark.png"
                alt="ETRONIC"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#60a5fa]/30 bg-[#3b82f6]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#60a5fa]">
              <IconShieldCheck className="h-3.5 w-3.5" />
              Portal Admin
            </span>
          </div>

          <div className="my-auto flex flex-col items-center py-6 text-center">
            <img
              src="/images/hero-3d-tech.jpg"
              alt="Infraestructura Etronic"
              className="hero-render-mask mb-6 h-60 w-auto object-contain"
            />

            <h2 className="font-display text-2xl font-extrabold text-white">
              Centro de Administración Etronic
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
              Gestiona usuarios, permisos de administrador y supervisa los servicios publicados en
              el sitio.
            </p>
          </div>

          <Link
            to="/"
            className="text-center text-xs font-medium text-slate-400 transition hover:text-white"
          >
            ← Volver a la Landing Page pública
          </Link>
        </div>

        {/* Contenido (formulario) */}
        <div className="flex w-full flex-col items-center justify-center px-5 py-8 sm:p-10 lg:w-1/2 lg:p-12">
          <div className="mb-6 lg:hidden">
            <Link to="/">
              <img
                src="/images/logo-etronic-dark.png"
                alt="ETRONIC"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
