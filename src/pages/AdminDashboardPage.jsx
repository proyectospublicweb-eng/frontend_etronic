import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import {
  getAdminStatsRequest,
  getAdminUsersRequest,
  createAdminUserRequest,
  updateAdminUserRoleRequest,
  deleteAdminUserRequest,
  getAdminChatsRequest,
} from "../api/admin.js";
import ControlSoportePanel from "../components/ControlSoportePanel.jsx";
import {
  CardWaveDecor,
  IconArrowRight,
  IconBriefcaseMedical,
  IconChatBubble,
  IconClose,
  IconDatabase,
  IconDesktop,
  IconHeadset,
  IconLifeRing,
  IconMenu,
  IconSearch,
  IconShieldCheck,
} from "../components/LandingIcons.jsx";
import PasswordField from "../components/PasswordField.jsx";

const SIDEBAR_SECTIONS = [
  { id: "overview", label: "Resumen General", icon: IconDesktop },
  { id: "users", label: "Usuarios y Roles", icon: IconDatabase },
  { id: "security", label: "Seguridad y Sesión", icon: IconShieldCheck },
  { id: "support", label: "Control & Soporte", icon: IconHeadset },
];

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    total_usuarios: 0,
    total_admins: 0,
    total_estandar: 0,
    nuevos_7_dias: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatConversations, setChatConversations] = useState([]);
  const [chatSummary, setChatSummary] = useState({
    total: 0,
    pendientes: 0,
    en_seguimiento: 0,
    atendidos: 0,
    no_leidos: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  // Estado gestión de usuarios
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("usuario");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);

  useEffect(() => {
    let active = true;

    const loadAllDashboardData = () => {
      Promise.all([getAdminStatsRequest(), getAdminUsersRequest(), getAdminChatsRequest()])
        .then(([statsRes, usersRes, chatsRes]) => {
          if (!active) return;
          if (statsRes.data?.stats) {
            setStats(statsRes.data.stats);
            setRecentUsers(statsRes.data.recentUsers || []);
          }
          if (Array.isArray(usersRes.data)) {
            setUsers(usersRes.data);
          }
          if (chatsRes.data?.summary) {
            setChatSummary(chatsRes.data.summary);
          }
          if (Array.isArray(chatsRes.data?.conversations)) {
            setChatConversations(chatsRes.data.conversations);
          }
          setDataError("");
        })
        .catch((err) => {
          if (!active) return;
          setDataError(
            err.response?.data?.message || "No fue posible cargar las métricas del servidor.",
          );
        })
        .finally(() => {
          if (active) setLoadingData(false);
        });
    };

    loadAllDashboardData();
    const pollTimer = window.setInterval(loadAllDashboardData, 8000);

    return () => {
      active = false;
      window.clearInterval(pollTimer);
    };
  }, [reloadTick]);

  const triggerReload = () => {
    setLoadingData(true);
    setReloadTick((n) => n + 1);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setSubmittingUser(true);

    try {
      await createAdminUserRequest({
        correoRegistro: newEmail,
        password: newPassword,
        rol: newRole,
      });
      setNewEmail("");
      setNewPassword("");
      setNewRole("usuario");
      setShowCreateModal(false);
      setActionMessage("Cuenta creada correctamente.");
      triggerReload();
    } catch (err) {
      setActionError(err.response?.data?.message || "No se pudo crear la cuenta.");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleToggleRole = async (targetUser) => {
    setActionError("");
    setActionMessage("");
    const nextRole = targetUser.rol === "admin" ? "usuario" : "admin";

    try {
      await updateAdminUserRoleRequest(targetUser.id, nextRole);
      setActionMessage(`Rol de ${targetUser.correo} actualizado a "${nextRole}".`);
      triggerReload();
    } catch (err) {
      setActionError(err.response?.data?.message || "No se pudo cambiar el rol.");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la cuenta "${targetUser.correo}"?`)) {
      return;
    }

    setActionError("");
    setActionMessage("");
    try {
      await deleteAdminUserRequest(targetUser.id);
      setActionMessage(`Usuario ${targetUser.correo} eliminado.`);
      triggerReload();
    } catch (err) {
      setActionError(err.response?.data?.message || "No se pudo eliminar el usuario.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return u.correo?.toLowerCase().includes(q) || u.rol?.toLowerCase().includes(q);
  });

  const currentSectionLabel =
    SIDEBAR_SECTIONS.find((s) => s.id === activeSection)?.label || "Panel";

  const adminInitial = (user?.correoRegistro?.[0] || "A").toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#020614] text-white">
      {/* Overlay móvil cuando el panel izquierdo está abierto */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* PANEL IZQUIERDO (Left Sidebar) con estética espacial Etronic */}
      <aside
        aria-label="Panel lateral de administración"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-[#04091c] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Resplandor decorativo sutil en el panel izquierdo */}
        <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

        {/* Cabecera fija del Panel Izquierdo */}
        <div className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5 sm:h-20 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo-etronic-dark.png"
              alt="ETRONIC"
              className="h-8 w-auto object-contain sm:h-9"
            />
            <span className="crescendo-btn-gradient rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-600/30">
              Admin
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación desplazable del Panel Izquierdo */}
        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#60a5fa]">
            Panel de Control
          </p>
          <nav className="space-y-1.5">
            {SIDEBAR_SECTIONS.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition duration-200 ${
                    isActive
                      ? "crescendo-btn-gradient text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-300/85 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ItemIcon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    {item.id === "support" && chatSummary.no_leidos > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          isActive ? "bg-white text-[#5848f4]" : "crescendo-btn-gradient text-white"
                        }`}
                      >
                        {chatSummary.no_leidos}
                      </span>
                    )}
                    {isActive && <IconArrowRight className="h-3.5 w-3.5 opacity-90" />}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pie fijo del Panel Izquierdo: Perfil + Acciones */}
        <div className="relative z-10 shrink-0 border-t border-white/[0.08] bg-[#020614]/60 p-4">
          <div className="crescendo-navy-banner mb-3 flex items-center gap-3 rounded-2xl p-3.5 ring-1 ring-white/10">
            <div className="crescendo-btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md shadow-indigo-600/35">
              {adminInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user?.correoRegistro}</p>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-400">
                ● Administrador verificado
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] py-2.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10"
            >
              <span>Ver Landing Page</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-400/25 bg-red-500/10 py-2.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 hover:text-white"
            >
              Cerrar Sesión Segura
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL DEL DASHBOARD (#001039 igual a la Landing Page) */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#001039]">
        {/* Atmósfera luminosa idéntica a la Landing Page */}
        <div className="pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full bg-indigo-500/[0.14] blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-16 h-96 w-96 rounded-full bg-blue-500/[0.12] blur-3xl" />

        {/* Barra Superior con línea de acento neón */}
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#04091c]/90 px-4 py-2.5 backdrop-blur-md sm:h-20 sm:px-6">
          <div className="crescendo-btn-gradient pointer-events-none absolute inset-x-0 top-0 h-[2px]" />

          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir panel lateral"
              className="shrink-0 rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden"
            >
              <IconMenu className="h-6 w-6" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#60a5fa] sm:text-[11px] sm:tracking-[0.14em]">
                Administración · /adminetronic
              </p>
              <h1 className="font-display truncate text-base font-extrabold tracking-tight text-white sm:text-xl">
                {currentSectionLabel}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={triggerReload}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10 sm:gap-2 sm:px-5"
            >
              <span className="sm:hidden">{loadingData ? "..." : "Actualizar"}</span>
              <span className="hidden sm:inline">
                {loadingData ? "Sincronizando..." : "Actualizar Datos"}
              </span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Cuerpo Dinámico */}
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">
          {dataError && (
            <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-3.5 text-sm text-amber-200">
              {dataError}
            </div>
          )}

          {actionMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3.5 text-sm text-emerald-200">
              {actionMessage}
            </div>
          )}

          {actionError && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/15 px-5 py-3.5 text-sm text-red-200">
              {actionError}
            </div>
          )}

          {/* VISTA 1: RESUMEN GENERAL */}
          {activeSection === "overview" && (
            <div className="space-y-8">
              {/* Banner Hero Administrativo con el mismo estilo de "Nuestra Visión en Etronic" */}
              <section className="crescendo-navy-banner relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-2xl shadow-black/35 ring-1 ring-white/10 sm:px-10 sm:py-10">
                <div className="parallax-tech-grid pointer-events-none absolute -inset-10 opacity-55" />
                <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-12 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="max-w-2xl">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-200">
                      <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
                      Centro de Operaciones Etronic
                    </span>
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      Bienvenido al{" "}
                      <span className="crescendo-text-gradient">Dashboard Administrativo</span>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300/90">
                      Supervisa cuentas autorizadas, administra permisos de administradores y da
                      seguimiento en tiempo real a las consultas recibidas por el chat de soporte
                      del sitio.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("users");
                        setShowCreateModal(true);
                      }}
                      className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                    >
                      <span>Nuevo Administrador</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection("support")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10 sm:w-auto"
                    >
                      <span>Control & Soporte</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Tarjetas KPI con estilo #f2f3f9 + Ondas CardWaveDecor idénticas a la Landing Page */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-6 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full">
                    <CardWaveDecor className="h-full w-full" />
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Total Usuarios
                      </p>
                      <p className="font-display mt-2 text-3xl font-extrabold text-[#0f172a]">
                        {stats.total_usuarios}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa] shadow-lg shadow-indigo-950/20">
                      <IconDatabase className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="relative z-10 mt-4 text-xs font-semibold text-[#1d4ed8]">
                    +{stats.nuevos_7_dias} registrados en 7 días
                  </p>
                </div>

                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-6 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full">
                    <CardWaveDecor className="h-full w-full" />
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Administradores
                      </p>
                      <p className="font-display mt-2 text-3xl font-extrabold text-[#0f172a]">
                        {stats.total_admins}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-500/35">
                      <IconShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="relative z-10 mt-4 text-xs font-semibold text-[#5848f4]">
                    Acceso exclusivo a /adminetronic
                  </p>
                </div>

                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-6 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full">
                    <CardWaveDecor className="h-full w-full" />
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Chats de Soporte
                      </p>
                      <p className="font-display mt-2 text-3xl font-extrabold text-[#0f172a]">
                        {chatSummary.total}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa] shadow-lg shadow-indigo-950/20">
                      <IconChatBubble className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="relative z-10 mt-4 text-xs font-semibold text-[#1d4ed8]">
                    {chatSummary.pendientes} pendiente(s) de atención
                  </p>
                </div>

                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-6 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full">
                    <CardWaveDecor className="h-full w-full" />
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Estado Plataforma
                      </p>
                      <p className="font-display mt-2 text-2xl font-extrabold text-emerald-600">
                        En Línea
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-500/35">
                      <IconHeadset className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="relative z-10 mt-4 text-xs font-semibold text-slate-600">
                    Landing Page y API operativas
                  </p>
                </div>
              </div>

              {/* Tabla rápida de últimos registros + Pilares Operativos */}
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
                <div className="crescendo-navy-banner min-w-0 rounded-3xl p-5 ring-1 ring-white/10 shadow-xl shadow-black/25 sm:p-7 lg:col-span-2">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#60a5fa]">
                        Control de Accesos
                      </p>
                      <h2 className="font-display mt-0.5 text-base font-extrabold text-white sm:text-lg">
                        Últimas Cuentas Registradas
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("users")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.05] px-4 py-1.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10"
                    >
                      <span>Gestionar todos</span>
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Tarjetas compactas en móvil (< sm) sin desbordamiento horizontal */}
                  <div className="space-y-3 sm:hidden">
                    {recentUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="break-all text-xs font-semibold text-white">{u.correo}</p>
                          <p className="mt-0.5 text-[11px] text-slate-300/80">
                            {formatDate(u.creado_en)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            u.rol === "admin"
                              ? "crescendo-btn-gradient text-white shadow-sm shadow-indigo-600/30"
                              : "bg-white/10 text-slate-200"
                          }`}
                        >
                          {u.rol}
                        </span>
                      </div>
                    ))}
                    {recentUsers.length === 0 && (
                      <p className="py-6 text-center text-xs text-slate-300">
                        Sin registros disponibles en este momento.
                      </p>
                    )}
                  </div>

                  {/* Tabla en tablet y escritorio (sm+) */}
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase text-slate-300/80">
                          <th className="pb-3 pr-4">Correo</th>
                          <th className="pb-3 pr-4">Rol</th>
                          <th className="pb-3">Registro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {recentUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="break-all py-3.5 pr-4 font-medium text-white">
                              {u.correo}
                            </td>
                            <td className="py-3.5 pr-4">
                              <span
                                className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase ${
                                  u.rol === "admin"
                                    ? "crescendo-btn-gradient text-white shadow-sm shadow-indigo-600/30"
                                    : "bg-white/10 text-slate-200"
                                }`}
                              >
                                {u.rol}
                              </span>
                            </td>
                            <td className="whitespace-nowrap py-3.5 text-xs text-slate-300">
                              {formatDate(u.creado_en)}
                            </td>
                          </tr>
                        ))}
                        {recentUsers.length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-xs text-slate-300">
                              Sin registros disponibles en este momento.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tarjeta lateral con estética Crescendo */}
                <div className="crescendo-navy-banner flex min-w-0 flex-col justify-between rounded-3xl p-6 ring-1 ring-white/10 shadow-xl shadow-black/25 sm:p-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#60a5fa]">
                      Atajos del Administrador
                    </p>
                    <h2 className="font-display mb-5 mt-0.5 text-lg font-extrabold text-white">
                      Acciones Rápidas
                    </h2>

                    <div className="space-y-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection("users");
                          setShowCreateModal(true);
                        }}
                        className="crescendo-btn-gradient flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5"
                      >
                        <span>Alta de Usuario / Admin</span>
                        <IconArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSection("support")}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3.5 text-sm font-medium text-white transition hover:border-[#60a5fa] hover:bg-white/10"
                      >
                        <span>Atender Control & Soporte</span>
                        <IconArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSection("security")}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3.5 text-sm font-medium text-white transition hover:border-[#60a5fa] hover:bg-white/10"
                      >
                        <span>Estado de Seguridad JWT</span>
                        <IconArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-600/40">
                      <IconBriefcaseMedical className="h-4 w-4" />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Protección activa por rol <strong className="text-white">admin</strong> en
                      cliente y servidor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: USUARIOS Y ROLES */}
          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                  <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por correo o rol..."
                    className="w-full rounded-full border border-white/20 bg-[#04091c]/90 py-2.5 pl-11 pr-4 text-base text-white placeholder-slate-400 outline-none transition focus:border-[#60a5fa] sm:text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateModal((prev) => !prev)}
                  className="crescendo-btn-gradient w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 sm:w-auto"
                >
                  {showCreateModal ? "Cancelar Registro" : "+ Agregar Usuario / Admin"}
                </button>
              </div>

              {/* Formulario desplegable para crear usuario/admin */}
              {showCreateModal && (
                <form
                  onSubmit={handleCreateUser}
                  className="crescendo-navy-banner relative overflow-hidden rounded-3xl p-5 ring-1 ring-white/15 shadow-2xl shadow-black/35 sm:p-8"
                >
                  <div className="parallax-tech-grid pointer-events-none absolute -inset-8 opacity-40" />
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#60a5fa]">
                      Credenciales de Acceso
                    </p>
                    <h3 className="font-display mb-5 mt-1 text-lg font-extrabold text-white">
                      Registrar nueva cuenta en Etronic
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="correo@etronic.com.mx"
                        className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base text-white placeholder-slate-400 outline-none focus:border-[#60a5fa] sm:text-sm"
                        required
                      />

                      <PasswordField
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        placeholder="Contraseña (mín. 6 caracteres)"
                        autoComplete="new-password"
                      />

                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="rounded-xl border border-white/15 bg-[#071130] px-4 py-3 text-base text-white outline-none focus:border-[#60a5fa] sm:text-sm"
                      >
                        <option value="usuario">Rol: Usuario estándar</option>
                        <option value="admin">Rol: Administrador</option>
                      </select>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingUser}
                        className="crescendo-btn-gradient w-full rounded-full px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 disabled:opacity-60 sm:w-auto"
                      >
                        {submittingUser ? "Guardando..." : "Guardar Cuenta"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Vista Móvil (< md): Tarjetas apiladas de usuarios sin necesidad de scroll horizontal */}
              <div className="space-y-4 md:hidden">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <div
                      key={u.id}
                      className="crescendo-navy-banner space-y-3.5 rounded-2xl p-5 ring-1 ring-white/10 shadow-xl"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-mono text-xs text-slate-400">#{u.id}</span>
                          <p className="break-all font-medium text-white">{u.correo}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase ${
                            u.rol === "admin"
                              ? "crescendo-btn-gradient text-white"
                              : "bg-white/10 text-slate-200"
                          }`}
                        >
                          {u.rol}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Alta: {formatDate(u.creado_en)}</span>
                        {isSelf && (
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                            Sesión Actual
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 border-t border-white/10 pt-3">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleToggleRole(u)}
                          className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {u.rol === "admin" ? "Pasar a Usuario" : "Hacer Admin"}
                        </button>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u)}
                          className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <div className="crescendo-navy-banner rounded-2xl px-6 py-10 text-center text-sm text-slate-300 ring-1 ring-white/10">
                    No se encontraron usuarios con ese criterio.
                  </div>
                )}
              </div>

              {/* Vista Tablet y Desktop (md+): Tabla completa de usuarios */}
              <div className="crescendo-navy-banner hidden overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl shadow-black/30 md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-slate-300">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Correo Electrónico</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Fecha Alta</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((u) => {
                        const isSelf = u.id === user?.id;
                        return (
                          <tr key={u.id} className="transition hover:bg-white/[0.04]">
                            <td className="px-6 py-4 font-mono text-xs text-slate-300">#{u.id}</td>
                            <td className="px-6 py-4 font-medium text-white">
                              {u.correo}
                              {isSelf && (
                                <span className="ml-2 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                                  Sesión Actual
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase ${
                                  u.rol === "admin"
                                    ? "crescendo-btn-gradient text-white shadow-sm shadow-indigo-600/30"
                                    : "bg-white/10 text-slate-200"
                                }`}
                              >
                                {u.rol}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-300">
                              {formatDate(u.creado_en)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => handleToggleRole(u)}
                                  className="rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {u.rol === "admin" ? "Pasar a Usuario" : "Hacer Admin"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => handleDeleteUser(u)}
                                  className="rounded-full border border-red-400/30 bg-red-500/15 px-3.5 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-300">
                            No se encontraron usuarios con ese criterio.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: SEGURIDAD Y SESIÓN */}
          {activeSection === "security" && (
            <div className="crescendo-navy-banner relative max-w-3xl overflow-hidden rounded-3xl p-5 ring-1 ring-white/10 shadow-2xl shadow-black/35 sm:p-10">
              <div className="parallax-tech-grid pointer-events-none absolute -inset-10 opacity-50" />
              <div className="pointer-events-none absolute -right-14 -top-14 h-60 w-60 rounded-full bg-violet-500/25 blur-3xl" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-lg shadow-indigo-600/40 sm:h-12 sm:w-12">
                    <IconLifeRing className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#60a5fa]">
                      Arquitectura de Autenticación
                    </p>
                    <h2 className="font-display text-lg font-extrabold text-white sm:text-2xl">
                      Estado de Sesión y Permisos de Administrador
                    </h2>
                  </div>
                </div>

                <div className="space-y-3.5 rounded-2xl border border-white/10 bg-[#020614]/55 p-4 text-sm sm:p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-slate-300">ID de Usuario:</span>
                    <span className="font-mono font-semibold text-white">#{user?.id}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-slate-300">Correo Verificado:</span>
                    <span className="break-all font-semibold text-white">
                      {user?.correoRegistro}
                    </span>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-slate-300">Nivel de Acceso:</span>
                    <span className="crescendo-btn-gradient rounded-full px-3.5 py-0.5 text-xs font-bold uppercase text-white">
                      {user?.rol}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-slate-300">Transporte de Sesión:</span>
                    <span className="font-semibold text-emerald-400">
                      JWT en Cookie HttpOnly + Validación de Rol en BD
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#020614]/55 p-4 text-xs leading-relaxed text-slate-300 sm:p-6">
                  <p className="mb-2 font-semibold text-white">
                    Cuenta administradora principal configurada para acceso a{" "}
                    <span className="text-[#60a5fa]">/adminetronic</span>:
                  </p>
                  <code className="block break-all rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-[#60a5fa]">
                    adminetronic27@gmail.com
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 6: CONTROL & SOPORTE (Recolección y seguimiento de mensajes por chat) */}
          {activeSection === "support" && (
            <ControlSoportePanel
              conversations={chatConversations}
              summary={chatSummary}
              onConversationsUpdated={triggerReload}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
