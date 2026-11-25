import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget.jsx";
import { IconFacebook, IconInstagram, IconRss, IconTwitterX } from "../components/LandingIcons.jsx";
import ProjectPlannerSection from "../components/ProjectPlannerSection.jsx";
import EtronicLogo from "../components/EtronicLogo.jsx";

const CURRENT_YEAR = new Date().getFullYear();

function PlannerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const prevTitle = document.title;
    document.title = "Planificador de Proyecto | ETRONIC";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#020614] text-slate-900">
      {/* Header Principal Oscuro con acento superior neón */}
      <header className="sticky top-0 z-50 w-full shrink-0 border-b border-white/[0.08] bg-[#04091c]/90 backdrop-blur-md">
        <div className="crescendo-btn-gradient pointer-events-none absolute inset-x-0 top-0 h-[2px]" />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center py-2">
            <EtronicLogo className="h-9 w-auto sm:h-11" />
          </Link>

          <Link
            to="/"
            className="crescendo-btn-gradient inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition duration-300 sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            Ir a Landing Page
          </Link>
        </div>
      </header>

      {/* Contenido Principal Dedicado del Planificador */}
      <main id="main-content" className="flex-1 bg-[#001039] pb-10 pt-6 sm:pb-14 sm:pt-10">
        <ProjectPlannerSection onClose={() => navigate("/")} />
      </main>

      {/* Footer Principal Oscuro (espacio reservado para el botón flotante de chat) */}
      <footer
        id="main-footer"
        className="shrink-0 border-t border-white/[0.08] bg-[#04091c] pb-24 pt-8 text-slate-400 sm:py-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 sm:pr-24 xl:pr-6">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acceso administrativo Etronic"
              className="inline-flex shrink-0 transition duration-200 hover:opacity-85"
            >
              <EtronicLogo className="h-8 w-auto" />
            </a>
            <p id="footer-info" className="text-center text-xs sm:text-left sm:text-sm">
              © {CURRENT_YEAR} <span className="font-semibold text-slate-200">ETRONIC</span> |
              Soporte Técnico Remoto y Servidores Virtuales
            </p>
          </div>

          <ul className="flex items-center gap-3">
            <li>
              <Link
                to="/#inicio"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconFacebook className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link
                to="/#inicio"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconTwitterX className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link
                to="/#inicio"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconInstagram className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link
                to="/#inicio"
                aria-label="RSS"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconRss className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      {/* Chat flotante */}
      <ChatWidget />
    </div>
  );
}

export default PlannerPage;
