import { useState } from "react";
import { deleteAdminPlannerRequest, updateAdminPlannerRequest } from "../api/admin.js";
import { exportPlannerSummaryPdf } from "../utils/plannerPdfExport.js";
import {
  CardWaveDecor,
  IconArrowRight,
  IconBriefcaseMedical,
  IconChatBubble,
  IconDatabase,
  IconSearch,
  IconShieldCheck,
} from "./LandingIcons.jsx";

const STATUS_META = {
  pendiente: {
    label: "Pendiente",
    badgeClass: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/35",
  },
  en_seguimiento: {
    label: "En seguimiento",
    badgeClass: "bg-indigo-500/25 text-[#60a5fa] ring-1 ring-[#60a5fa]/35",
  },
  atendido: {
    label: "Atendido",
    badgeClass: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/35",
  },
};

function formatDateTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildQuickContactLink(contacto) {
  const raw = String(contacto || "").trim();
  if (!raw) return null;
  if (raw.includes("@")) {
    return {
      href: `mailto:${raw}`,
      label: "Contactar por Correo",
    };
  }
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 7) {
    const normalized = digits.length === 10 ? `52${digits}` : digits;
    return {
      href: `https://wa.me/${normalized}`,
      label: "Abrir WhatsApp",
    };
  }
  return null;
}

function PlanificadorAdminPanel({ submissions, summary, onSubmissionsUpdated }) {
  const [selectedId, setSelectedId] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [notesDraftById, setNotesDraftById] = useState({});
  const [savingNotes, setSavingNotes] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredSubmissions = submissions.filter((item) => {
    if (statusFilter !== "todos" && item.estado !== statusFilter) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const inHeader =
      item.nombre?.toLowerCase().includes(q) ||
      item.telefono_whatsapp?.toLowerCase().includes(q) ||
      item.comentarios?.toLowerCase().includes(q);
    const inServices = item.resumen_servicios?.some(
      (srv) =>
        srv.name?.toLowerCase().includes(q) ||
        srv.processes?.some(
          (proc) =>
            proc.title?.toLowerCase().includes(q) ||
            proc.tasks?.some((t) => t.title?.toLowerCase().includes(q)),
        ),
    );
    return Boolean(inHeader || inServices);
  });

  const activeSubmission =
    filteredSubmissions.find((s) => s.id === selectedId) ||
    submissions.find((s) => s.id === selectedId) ||
    filteredSubmissions[0] ||
    null;

  const activeNotesValue = activeSubmission
    ? (notesDraftById[activeSubmission.id] ?? activeSubmission.notas_seguimiento ?? "")
    : "";

  const handleSelectSubmission = (item) => {
    setSelectedId(item.id);
    setMobileDetailOpen(true);
    setFeedback("");
    setErrorMsg("");
  };

  const handleChangeStatus = async (id, nextStatus) => {
    setFeedback("");
    setErrorMsg("");
    try {
      await updateAdminPlannerRequest(id, { estado: nextStatus });
      setFeedback("Estado de seguimiento actualizado.");
      onSubmissionsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudo actualizar el estado.");
    }
  };

  const handleSaveNotes = async (id) => {
    setFeedback("");
    setErrorMsg("");
    setSavingNotes(true);
    try {
      await updateAdminPlannerRequest(id, { notas_seguimiento: activeNotesValue });
      setFeedback("Notas internas guardadas.");
      onSubmissionsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudieron guardar las notas.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteSubmission = async (item) => {
    const phonePart = item.telefono_whatsapp ? ` (${item.telefono_whatsapp})` : "";
    const ok = window.confirm(
      `¿Eliminar el registro del planificador de "${item.nombre}"${phonePart}?`,
    );
    if (!ok) return;

    setFeedback("");
    setErrorMsg("");
    try {
      await deleteAdminPlannerRequest(item.id);
      if (selectedId === item.id) {
        setSelectedId(null);
        setMobileDetailOpen(false);
      }
      setFeedback("Registro eliminado.");
      onSubmissionsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudo eliminar el registro.");
    }
  };

  const handleDownloadClientPdf = (item) => {
    exportPlannerSummaryPdf({
      resumenServicios: item.resumen_servicios || [],
      notes: item.comentarios || "",
      clientName: item.nombre || "",
      clientPhone: item.telefono_whatsapp || "",
      createdAt: item.creado_en || null,
    });
  };

  const kpis = [
    {
      label: "Total Registros",
      value: summary.total,
      icon: IconBriefcaseMedical,
      badge: "Histórico",
    },
    {
      label: "Pendientes",
      value: summary.pendientes,
      icon: IconChatBubble,
      badge: "Por contactar",
    },
    {
      label: "En Seguimiento",
      value: summary.en_seguimiento,
      icon: IconDatabase,
      badge: "Activos",
    },
    {
      label: "Atendidos",
      value: summary.atendidos,
      icon: IconShieldCheck,
      badge: "Completados",
    },
  ];

  const activeQuickContact = activeSubmission
    ? buildQuickContactLink(activeSubmission.telefono_whatsapp)
    : null;

  return (
    <div className="space-y-6">
      {/* KPIs del Planificador */}
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => {
          const KpiIcon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl bg-[#f2f3f9] p-5 text-[#0f172a] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-75">
                <CardWaveDecor className="h-full w-full" />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5848f4]">
                    {card.badge}
                  </span>
                  <p className="mt-2.5 text-xs font-medium text-slate-500">{card.label}</p>
                  <p className="font-display mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a]">
                    {card.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa] shadow-md shadow-indigo-950/20">
                  <KpiIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensajes globales */}
      {(feedback || errorMsg) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            errorMsg
              ? "border-red-400/35 bg-red-500/15 text-red-100"
              : "border-emerald-400/35 bg-emerald-500/15 text-emerald-100"
          }`}
        >
          {errorMsg || feedback}
        </div>
      )}

      {/* Bandeja Maestra + Detalle del Registro */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Lista izquierda */}
        <div
          className={`crescendo-navy-banner flex flex-col overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl shadow-black/35 lg:col-span-5 ${
            mobileDetailOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="space-y-3 border-b border-white/10 p-4 sm:p-5">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nombre, teléfono o servicio..."
                className="w-full rounded-full border border-white/15 bg-white/[0.06] py-2.5 pl-10 pr-4 text-base text-white placeholder-slate-400 outline-none focus:border-[#60a5fa] sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "todos", label: "Todos" },
                { id: "pendiente", label: "Pendientes" },
                { id: "en_seguimiento", label: "En seguimiento" },
                { id: "atendido", label: "Atendidos" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === tab.id
                      ? "crescendo-btn-gradient text-white shadow"
                      : "border border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[420px] flex-1 divide-y divide-white/[0.08] overflow-y-auto lg:max-h-[580px]">
            {filteredSubmissions.map((item) => {
              const isSelected = activeSubmission?.id === item.id;
              const statusMeta = STATUS_META[item.estado] || STATUS_META.pendiente;
              const servicesCount = item.resumen_servicios?.length || 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSubmission(item)}
                  className={`w-full px-4 py-4 text-left transition sm:px-5 ${
                    isSelected ? "bg-[#5848f4]/20" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display truncate text-sm font-bold text-white">
                        {item.nombre}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-[#60a5fa]">
                        {item.telefono_whatsapp || "Sin teléfono"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                    <span className="rounded-md bg-white/[0.07] px-2 py-0.5 font-semibold text-emerald-300">
                      {item.total_seleccionadas} funcs · {servicesCount}{" "}
                      {servicesCount === 1 ? "servicio" : "servicios"}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {formatDateTime(item.creado_en)}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredSubmissions.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-300">
                No hay registros del planificador con ese filtro.
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho: Detalle y Resumen del Cliente */}
        <div
          className={`crescendo-navy-banner flex flex-col overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl shadow-black/35 lg:col-span-7 ${
            mobileDetailOpen ? "flex" : "hidden lg:flex"
          }`}
        >
          {activeSubmission ? (
            <>
              {/* Cabecera del Cliente */}
              <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6 lg:flex-col xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileDetailOpen(false)}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#60a5fa] lg:hidden"
                  >
                    <IconArrowRight className="h-3.5 w-3.5 rotate-180" />
                    <span>Volver a registros</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display break-words text-lg font-extrabold text-white sm:text-xl">
                      {activeSubmission.nombre}
                    </h2>
                    <span className="rounded-full bg-[#3b82f6]/20 px-2.5 py-0.5 text-xs font-bold text-[#93c5fd]">
                      {activeSubmission.total_seleccionadas} funcionalidades
                    </span>
                  </div>

                  <p className="mt-1 break-all text-sm font-semibold text-[#60a5fa] sm:break-words">
                    {activeSubmission.telefono_whatsapp || "Sin contacto registrado"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Registrado el {formatDateTime(activeSubmission.creado_en)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeQuickContact && (
                    <a
                      href={activeQuickContact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25 hover:text-white"
                    >
                      {activeQuickContact.label}
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDownloadClientPdf(activeSubmission)}
                    className="rounded-full border border-[#60a5fa]/40 bg-[#3b82f6]/15 px-3.5 py-1.5 text-xs font-semibold text-[#93c5fd] transition hover:bg-[#3b82f6]/25 hover:text-white"
                  >
                    Descargar PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubmission(activeSubmission)}
                    className="rounded-full border border-red-400/30 bg-red-500/15 px-3.5 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/25 hover:text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Barra de Estado de Seguimiento */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3.5 sm:px-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Estado de atención:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(STATUS_META).map(([key, meta]) => {
                    const isCurrent = activeSubmission.estado === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleChangeStatus(activeSubmission.id, key)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                          isCurrent
                            ? "crescendo-btn-gradient text-white shadow"
                            : "border border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resumen Detallado de Servicios Seleccionados */}
              <div className="flex-1 space-y-4 p-4 sm:p-6 lg:max-h-[430px] lg:overflow-y-auto">
                {activeSubmission.comentarios && (
                  <div className="rounded-2xl border border-[#60a5fa]/30 bg-[#3b82f6]/10 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#60a5fa]">
                      Comentarios del Cliente
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-100">
                      {activeSubmission.comentarios}
                    </p>
                  </div>
                )}

                {(activeSubmission.resumen_servicios || []).map((service) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-white/10 bg-[#040c29]/80 p-4 sm:p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <h3 className="font-display text-sm font-extrabold text-white sm:text-base">
                        {service.order}. {service.name}
                      </h3>
                      <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                        {service.selectedCount} / {service.totalTasks}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(service.processes || []).map((proc) => (
                        <div key={proc.id}>
                          {proc.group && (
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#60a5fa]">
                              {proc.group}
                            </p>
                          )}
                          <p className="text-xs font-bold text-indigo-200">
                            {proc.number}. {proc.title}
                          </p>
                          <ul className="mt-1.5 flex flex-wrap gap-1.5">
                            {(proc.tasks || []).map((task) => (
                              <li
                                key={task.id}
                                className="max-w-full break-words rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-200"
                              >
                                ✓ {task.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notas Internas de Seguimiento */}
              <div className="border-t border-white/10 bg-[#020614]/50 p-5 sm:p-6">
                <label
                  htmlFor="admin-planner-notes"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#60a5fa]"
                >
                  Notas Internas de Seguimiento
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <textarea
                    id="admin-planner-notes"
                    rows={2}
                    value={activeNotesValue}
                    onChange={(e) =>
                      setNotesDraftById((prev) => ({
                        ...prev,
                        [activeSubmission.id]: e.target.value,
                      }))
                    }
                    placeholder="Registra aquí acuerdos comerciales, fecha de llamada o estatus de cotización..."
                    className="min-w-0 flex-1 resize-none rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-base text-white placeholder-slate-400 outline-none focus:border-[#60a5fa] sm:text-sm"
                  />
                  <button
                    type="button"
                    disabled={savingNotes}
                    onClick={() => handleSaveNotes(activeSubmission.id)}
                    className="crescendo-btn-gradient w-full shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
                  >
                    {savingNotes ? "Guardando..." : "Guardar Notas"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[380px] flex-1 flex-col items-center justify-center p-8 text-center">
              <p className="font-display text-base font-bold text-white">
                Sin registros seleccionados
              </p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-300">
                Cuando un cliente complete el Planificador de Proyecto en la Landing Page, sus datos
                y selección de servicios aparecerán aquí automáticamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanificadorAdminPanel;
