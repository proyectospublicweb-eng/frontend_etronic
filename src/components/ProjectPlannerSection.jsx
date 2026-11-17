import { useEffect, useMemo, useRef, useState } from "react";
import { savePlannerSubmissionRequest } from "../api/planner.js";
import { PLANNER_SERVICES } from "../data/projectPlannerCatalog";
import { buildSelectedServicesSummary, exportPlannerSummaryPdf } from "../utils/plannerPdfExport";
import { IconArrowRight, IconClose, IconShieldCheck } from "./LandingIcons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_REGEX = /^\+?[\d\s()-]{7,20}$/;

function isValidContactValue(value) {
  const clean = String(value || "").trim();
  if (!clean) return false;
  if (EMAIL_REGEX.test(clean)) return true;
  const digits = clean.replace(/\D/g, "");
  return PHONE_CHARS_REGEX.test(clean) && digits.length >= 7 && digits.length <= 15;
}

const SERVICE_ACCENTS = [
  {
    code: "01",
    shortLabel: "Work Mgmt",
    badgeBg: "bg-[#fb6b5b] text-white shadow-[0_6px_18px_rgba(251,107,91,0.35)]",
    activeCard: "border-[#38bdf8]/65 bg-[#091b4b]/90 shadow-[0_0_26px_rgba(56,189,248,0.18)]",
    ringStroke: "#fb6b5b",
    countPill: "bg-[#fb6b5b]/20 text-[#fda4af] ring-1 ring-[#fb6b5b]/40",
  },
  {
    code: "02",
    shortLabel: "CRM & Svc",
    badgeBg: "bg-[#8b7af9] text-white shadow-[0_6px_18px_rgba(139,122,249,0.35)]",
    activeCard: "border-[#8b7af9]/70 bg-[#091b4b]/90 shadow-[0_0_26px_rgba(139,122,249,0.2)]",
    ringStroke: "#8b7af9",
    countPill: "bg-[#8b7af9]/20 text-[#c4b5fd] ring-1 ring-[#8b7af9]/40",
  },
  {
    code: "03",
    shortLabel: "Dashboards",
    badgeBg: "bg-[#16c47f] text-[#031218] shadow-[0_6px_18px_rgba(22,196,127,0.32)]",
    activeCard: "border-[#16c47f]/65 bg-[#091b4b]/90 shadow-[0_0_26px_rgba(22,196,127,0.18)]",
    ringStroke: "#16c47f",
    countPill: "bg-[#16c47f]/20 text-[#6ee7b7] ring-1 ring-[#16c47f]/40",
  },
];

const PROCESS_ACCENTS = [
  {
    tile: "border-[#fb6b5b]/35 bg-[#fb6b5b]/15 text-[#fda4af]",
    pillActive: "bg-[#fb6b5b] text-white",
  },
  {
    tile: "border-[#8b7af9]/35 bg-[#8b7af9]/15 text-[#c4b5fd]",
    pillActive: "bg-[#8b7af9] text-white",
  },
  {
    tile: "border-[#16c47f]/35 bg-[#16c47f]/15 text-[#6ee7b7]",
    pillActive: "bg-[#16c47f] text-[#031811]",
  },
  {
    tile: "border-[#f5a623]/35 bg-[#f5a623]/15 text-[#fcd34d]",
    pillActive: "bg-[#f5a623] text-[#1a1103]",
  },
  {
    tile: "border-[#18b8d8]/35 bg-[#18b8d8]/15 text-[#67e8f9]",
    pillActive: "bg-[#18b8d8] text-[#03171d]",
  },
];

function getServiceAllTaskIds(service) {
  return service.processes.flatMap((proc) => proc.tasks.map((task) => task.id));
}

function ServiceTabIcon({ order, className = "h-5 w-5" }) {
  if (order === 1) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="10" rx="1.5" />
      </svg>
    );
  }
  if (order === 2) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3.5 3.5 0 0 1 0 6.74" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 4 3 5-6" />
    </svg>
  );
}

function OverallProgressRing({ percentage, selectedCount, totalCount }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference * (1 - clamped / 100);

  return (
    <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
      <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="planner-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb6b5b" />
            <stop offset="35%" stopColor="#8b7af9" />
            <stop offset="70%" stopColor="#18b8d8" />
            <stop offset="100%" stopColor="#16c47f" />
          </linearGradient>
        </defs>

        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke="url(#planner-ring-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Avance Total
        </span>
        <span className="font-display mt-0.5 text-3xl font-extrabold leading-none text-white">
          {clamped}%
        </span>
        <span className="mt-1 text-[11px] font-bold text-[#34d399]">
          {selectedCount} de {totalCount}
        </span>
      </div>
    </div>
  );
}

function MiniServiceGauge({ service, selectedCount, totalCount, accent, isActive, onSelect }) {
  const pct = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Ver ${service.shortName}`}
      className={`flex min-w-0 flex-col items-center rounded-xl border px-1.5 py-2 text-center transition sm:px-2 sm:py-2.5 ${
        isActive
          ? "border-[#60a5fa]/50 bg-white/[0.07]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <div className="relative flex h-11 w-11 items-center justify-center">
        <svg viewBox="0 0 46 46" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle
            cx="23"
            cy="23"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <circle
            cx="23"
            cy="23"
            r={radius}
            fill="none"
            stroke={accent.ringStroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <span className="absolute text-[10px] font-extrabold text-white">{accent.code}</span>
      </div>
      <span className="mt-1.5 w-full truncate text-[10px] font-semibold leading-tight text-slate-300">
        {accent.shortLabel}
      </span>
      <span className="text-[11px] font-extrabold text-white">{pct}%</span>
    </button>
  );
}

function ProcessChecklistGroup({
  process,
  accentIndex,
  selectedSet,
  isCollapsed,
  onToggleCollapse,
  onToggleTask,
  onToggleProcessAll,
}) {
  const totalCount = process.tasks.length;
  const selectedCount = process.tasks.filter((task) => selectedSet.has(task.id)).length;
  const allProcessSelected = totalCount > 0 && selectedCount === totalCount;
  const accent = PROCESS_ACCENTS[accentIndex % PROCESS_ACCENTS.length];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#040c29]/80 transition hover:border-white/20">
      {/* Cabecera estilo bloque Top Risks */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-3.5 ${
          isCollapsed ? "" : "border-b border-white/[0.08]"
        }`}
      >
        <button
          type="button"
          onClick={() => onToggleCollapse(process.id)}
          aria-expanded={!isCollapsed}
          className="flex w-full min-w-0 items-center gap-2.5 text-left sm:w-auto sm:flex-1 sm:gap-3"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold ${accent.tile}`}
          >
            {process.number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-display block text-sm font-bold leading-snug text-white sm:text-[15px]">
              {process.title}
            </span>
            <span className="mt-0.5 block text-[11px] text-slate-400">
              {totalCount} funcionalidades disponibles
            </span>
          </span>
          <span
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold ${
              selectedCount > 0 ? accent.pillActive : "bg-white/[0.08] text-slate-300"
            }`}
          >
            {selectedCount} / {totalCount}
          </span>
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleProcessAll(process)}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:border-[#38bdf8]/60 hover:bg-white/10 hover:text-white"
          >
            {allProcessSelected ? "Quitar bloque" : "Marcar bloque"}
          </button>

          <button
            type="button"
            onClick={() => onToggleCollapse(process.id)}
            aria-label={isCollapsed ? `Expandir ${process.title}` : `Contraer ${process.title}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-180"
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Funcionalidades / Tasks */}
      {!isCollapsed && (
        <div className="space-y-2.5 p-3.5 sm:p-4">
          {process.tasks.map((task) => {
            const isChecked = selectedSet.has(task.id);
            return (
              <label
                key={task.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition sm:p-3.5 ${
                  isChecked
                    ? "border-[#38bdf8]/65 bg-[#0a1d4f]/70 shadow-md shadow-indigo-950/30"
                    : "border-white/[0.07] bg-[#03091f]/75 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleTask(task.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold transition ${
                    isChecked
                      ? "border-[#2dd4bf] bg-[#16c47f] text-[#031811] shadow-[0_0_10px_rgba(22,196,127,0.45)]"
                      : "border-white/30 bg-white/[0.04] text-transparent"
                  }`}
                >
                  ✓
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`font-display text-[13px] font-bold leading-snug sm:text-sm ${
                        isChecked ? "text-white" : "text-slate-100"
                      }`}
                    >
                      {task.title}
                    </span>
                    {isChecked && (
                      <span className="rounded bg-[#16c47f]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6ee7b7]">
                        Incluida
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-300/90">
                    {task.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectPlannerSection({ sectionRef, onClose }) {
  const tabListRef = useRef(null);
  const nameInputRef = useRef(null);
  const whatsappInputRef = useRef(null);
  const lastSavedSignatureRef = useRef("");

  const [activeServiceId, setActiveServiceId] = useState(PLANNER_SERVICES[0].id);
  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);
  const [pinnedTooltipId, setPinnedTooltipId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [contactErrors, setContactErrors] = useState({ nombre: false, telefonoWhatsapp: false });
  const [selectedTasksByService, setSelectedTasksByService] = useState({});
  const [expandedProcesses, setExpandedProcesses] = useState({});
  const [formError, setFormError] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [showSentToast, setShowSentToast] = useState(false);
  const [isSavingSubmission, setIsSavingSubmission] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (!showSentToast) return undefined;
    const timerId = window.setTimeout(() => setShowSentToast(false), 6000);
    return () => window.clearTimeout(timerId);
  }, [showSentToast]);

  useEffect(() => {
    if (!pinnedTooltipId) return undefined;

    const handleOutside = (e) => {
      if (tabListRef.current && !tabListRef.current.contains(e.target)) {
        setPinnedTooltipId(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setPinnedTooltipId(null);
        setHoveredTooltipId(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [pinnedTooltipId]);

  const activeService = useMemo(
    () => PLANNER_SERVICES.find((srv) => srv.id === activeServiceId) || PLANNER_SERVICES[0],
    [activeServiceId],
  );

  const activeSelectedIds = useMemo(
    () => selectedTasksByService[activeService.id] || [],
    [selectedTasksByService, activeService.id],
  );
  const activeSelectedSet = useMemo(() => new Set(activeSelectedIds), [activeSelectedIds]);

  const totalCatalogTasks = useMemo(
    () => PLANNER_SERVICES.reduce((sum, srv) => sum + getServiceAllTaskIds(srv).length, 0),
    [],
  );

  const totalSelectedAcrossServices = useMemo(
    () =>
      PLANNER_SERVICES.reduce((sum, srv) => sum + (selectedTasksByService[srv.id]?.length || 0), 0),
    [selectedTasksByService],
  );

  const overallProgressPct =
    totalCatalogTasks > 0 ? Math.round((totalSelectedAcrossServices / totalCatalogTasks) * 100) : 0;

  const updateActiveServiceTasks = (nextList) => {
    setFormError("");
    setSaveSuccessMsg("");
    setSelectedTasksByService((prev) => ({
      ...prev,
      [activeService.id]: nextList,
    }));
  };

  const handleToggleTask = (taskId) => {
    const next = activeSelectedSet.has(taskId)
      ? activeSelectedIds.filter((id) => id !== taskId)
      : [...activeSelectedIds, taskId];
    updateActiveServiceTasks(next);
  };

  const handleToggleProcessAll = (process) => {
    const procIds = process.tasks.map((task) => task.id);
    const allChecked = procIds.every((id) => activeSelectedSet.has(id));

    if (allChecked) {
      const procSet = new Set(procIds);
      updateActiveServiceTasks(activeSelectedIds.filter((id) => !procSet.has(id)));
      return;
    }

    const merged = Array.from(new Set([...activeSelectedIds, ...procIds]));
    updateActiveServiceTasks(merged);
  };

  const handleToggleCollapse = (processId) => {
    setExpandedProcesses((prev) => ({
      ...prev,
      [processId]: !prev[processId],
    }));
  };

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [expandedProcesses, activeServiceId]);

  const handleClearAll = () => {
    setFormError("");
    setSaveSuccessMsg("");
    setSelectedTasksByService({});
    lastSavedSignatureRef.current = "";
  };

  const validatePlannerSubmission = () => {
    const cleanName = clientName.trim();
    const cleanContact = clientWhatsapp.trim();
    const invalidName = cleanName.length < 2;
    const invalidContact = cleanContact.length > 0 && !isValidContactValue(cleanContact);

    if (invalidName || invalidContact) {
      setContactErrors({ nombre: invalidName, telefonoWhatsapp: invalidContact });
      const msg = invalidName
        ? "El campo Nombre es obligatorio (mínimo 2 caracteres)."
        : "Si capturas Teléfono-Whatsapp / Correo, ingresa un número (7 a 15 dígitos) o correo válido.";
      setFormError(msg);

      if (invalidName) {
        nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => nameInputRef.current?.focus(), 180);
      } else {
        whatsappInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => whatsappInputRef.current?.focus(), 180);
      }
      return false;
    }

    if (totalSelectedAcrossServices === 0) {
      setFormError(
        "Marca al menos una funcionalidad del catálogo antes de cotizar o descargar el PDF.",
      );
      return false;
    }

    setContactErrors({ nombre: false, telefonoWhatsapp: false });
    setFormError("");
    return true;
  };

  const persistSubmissionIfNeeded = async () => {
    const cleanName = clientName.trim();
    const cleanPhone = clientWhatsapp.trim();
    const resumenServicios = buildSelectedServicesSummary(PLANNER_SERVICES, selectedTasksByService);
    const signature = JSON.stringify({
      nombre: cleanName,
      telefonoWhatsapp: cleanPhone,
      resumenServicios,
    });

    if (lastSavedSignatureRef.current === signature) {
      setSaveSuccessMsg(
        "¡Configuración enviada correctamente! Tu registro ya fue recibido y nos pondremos en contacto contigo.",
      );
      setShowSentToast(true);
      return true;
    }

    setIsSavingSubmission(true);
    try {
      await savePlannerSubmissionRequest({
        nombre: cleanName,
        telefonoWhatsapp: cleanPhone,
        totalSeleccionadas: totalSelectedAcrossServices,
        resumenServicios,
        comentarios: "",
      });
      lastSavedSignatureRef.current = signature;
      setSaveSuccessMsg(
        "¡Configuración enviada correctamente! Hemos registrado tus servicios seleccionados y nos pondremos en contacto contigo pronto.",
      );
      setShowSentToast(true);
      return true;
    } catch (err) {
      const apiErr = err.response?.data;
      const detail = Array.isArray(apiErr)
        ? apiErr[0]
        : apiErr?.message ||
          "No se pudo enviar la configuración en este momento. Intenta de nuevo.";
      setFormError(detail);
      return false;
    } finally {
      setIsSavingSubmission(false);
    }
  };

  const handleSendConfiguration = async () => {
    if (!validatePlannerSubmission()) return;
    await persistSubmissionIfNeeded();
  };

  const handleDownloadPdf = () => {
    setFormError("");
    if (totalSelectedAcrossServices === 0) {
      setFormError("Marca al menos una funcionalidad del catálogo para descargar el PDF.");
      return;
    }

    setIsExportingPdf(true);
    try {
      exportPlannerSummaryPdf({
        services: PLANNER_SERVICES,
        selectedTasksByService,
        notes: "",
        clientName: clientName.trim(),
        clientPhone: clientWhatsapp.trim(),
      });
    } catch {
      setFormError(
        "No se pudo generar el PDF en este momento. Recarga la página e intenta de nuevo.",
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <section
      id="planificador-proyecto"
      ref={sectionRef}
      aria-labelledby="planificador-proyecto-heading"
      className="relative mx-auto mb-0 max-w-6xl scroll-mt-24 px-3 pb-2 sm:px-6"
    >
      {/* Fondo conservado de Etronic */}
      <div className="relative rounded-3xl border border-[#60a5fa]/35 bg-gradient-to-br from-[#081746] via-[#050e2e] to-[#111547] p-4 text-white shadow-2xl shadow-black/45 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="parallax-tech-grid absolute -inset-16 opacity-45" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>

        {/* Encabezado Principal */}
        <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start">
          <div>
            <h2
              id="planificador-proyecto-heading"
              className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[34px]"
            >
              Planificador de Proyecto
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              Explora cada servicio y marca los procesos y funcionalidades que deseas integrar en tu
              plataforma para generar una cotización personalizada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#38bdf8]/45 bg-[#38bdf8]/15 px-4 py-2.5 text-xs font-bold text-[#93c5fd] transition hover:border-[#38bdf8] hover:bg-[#38bdf8]/25 hover:text-white sm:w-auto sm:self-start"
          >
            <IconArrowRight className="h-3.5 w-3.5 shrink-0 rotate-180" />
            <span>Regresar a la Landing Page</span>
          </button>
        </div>

        {/* Barra de Pestañas estilo tarjetas KPI */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Servicios del Planificador de Proyecto"
          className="relative z-20 mb-5 grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {PLANNER_SERVICES.map((service, idx) => {
            const isActive = service.id === activeService.id;
            const selectedInSrv = selectedTasksByService[service.id]?.length || 0;
            const totalInSrv = getServiceAllTaskIds(service).length;
            const hasTooltip = Boolean(service.tooltipTitle && service.tooltipDescription);
            const isTooltipOpen =
              hasTooltip && (hoveredTooltipId === service.id || pinnedTooltipId === service.id);
            const accent = SERVICE_ACCENTS[idx % SERVICE_ACCENTS.length];
            const tooltipPositionClass =
              idx === PLANNER_SERVICES.length - 1
                ? "md:left-auto md:right-0"
                : idx === 1
                  ? "md:left-1/2 md:-translate-x-1/2"
                  : "md:right-auto";

            return (
              <div
                key={service.id}
                onMouseEnter={() => hasTooltip && setHoveredTooltipId(service.id)}
                onMouseLeave={() =>
                  hasTooltip && setHoveredTooltipId((prev) => (prev === service.id ? null : prev))
                }
                className={`relative flex items-stretch rounded-2xl border transition ${
                  isActive
                    ? accent.activeCard
                    : "border-white/[0.09] bg-[#040c29]/80 text-slate-300 hover:border-white/25 hover:bg-[#06133a]/85 hover:text-white"
                }`}
              >
                <button
                  id={`planner-tab-${service.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`planner-panel-${service.id}`}
                  aria-describedby={hasTooltip ? `planner-tooltip-${service.id}` : undefined}
                  onClick={() => setActiveServiceId(service.id)}
                  onFocus={() => hasTooltip && setHoveredTooltipId(service.id)}
                  onBlur={() =>
                    hasTooltip && setHoveredTooltipId((prev) => (prev === service.id ? null : prev))
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3 text-left lg:gap-3.5 lg:px-4 lg:py-3.5"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:h-11 lg:w-11 ${accent.badgeBg}`}
                  >
                    <ServiceTabIcon order={service.order} className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Servicio {accent.code}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                          selectedInSrv > 0 ? accent.countPill : "bg-white/[0.08] text-slate-300"
                        }`}
                      >
                        {selectedInSrv}/{totalInSrv}
                      </span>
                    </span>
                    <span className="font-display mt-1 block text-xs font-bold leading-snug text-white lg:text-[13px]">
                      {service.shortName}
                    </span>
                  </span>
                </button>

                {hasTooltip && (
                  <div className="flex shrink-0 items-start pr-2.5 pt-2.5">
                    <button
                      type="button"
                      aria-label={`Ver descripción de ${service.tooltipTitle}`}
                      aria-expanded={isTooltipOpen}
                      onClick={() =>
                        setPinnedTooltipId((prev) => (prev === service.id ? null : service.id))
                      }
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border text-[11px] font-extrabold transition ${
                        isTooltipOpen
                          ? "border-[#38bdf8] bg-[#38bdf8]/25 text-white"
                          : "border-white/15 bg-white/[0.05] text-slate-300 hover:border-[#38bdf8] hover:text-white"
                      }`}
                    >
                      i
                    </button>
                  </div>
                )}

                {hasTooltip && (
                  <div
                    id={`planner-tooltip-${service.id}`}
                    role="tooltip"
                    className={`absolute bottom-full left-0 right-0 z-30 mb-2.5 rounded-2xl border border-[#38bdf8]/45 bg-[#040b24]/95 p-4 text-left shadow-[0_18px_42px_rgba(2,6,20,0.85)] backdrop-blur-md transition-all duration-200 md:w-80 md:max-w-[calc(100vw-3rem)] ${tooltipPositionClass} ${
                      isTooltipOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
                    }`}
                  >
                    <p className="font-display text-xs font-extrabold leading-snug text-[#38bdf8] sm:text-[13px]">
                      {service.tooltipTitle}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-200">
                      {service.tooltipDescription}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Datos de Contacto del Cliente antes de Ruta de Configuración */}
        <div className="relative z-10 mb-5 rounded-2xl border border-white/[0.09] bg-[#040c29]/85 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#38bdf8]">
              Tus Datos de Contacto
            </p>
            <span className="text-[11px] text-slate-400">
              Nombre obligatorio para guardar tu registro
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="min-w-0">
              <label
                htmlFor="planner-client-name"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-300"
              >
                Nombre <span className="text-rose-400">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="planner-client-name"
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setContactErrors((prev) => ({ ...prev, nombre: false }));
                  setFormError("");
                }}
                placeholder="Tu nombre completo o empresa"
                aria-invalid={contactErrors.nombre}
                className={`w-full rounded-xl border bg-[#03091f]/80 px-3.5 py-2.5 text-base text-white placeholder-slate-400 outline-none transition focus:bg-[#061238] sm:text-sm ${
                  contactErrors.nombre
                    ? "border-rose-400/85 ring-2 ring-rose-500/25 focus:border-rose-400"
                    : "border-white/15 focus:border-[#38bdf8]"
                }`}
                required
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="planner-client-whatsapp"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-300"
              >
                Teléfono-Whatsapp / Correo{" "}
                <span className="font-normal lowercase text-slate-400">(opcional)</span>
              </label>
              <input
                ref={whatsappInputRef}
                id="planner-client-whatsapp"
                type="text"
                value={clientWhatsapp}
                onChange={(e) => {
                  setClientWhatsapp(e.target.value);
                  setContactErrors((prev) => ({ ...prev, telefonoWhatsapp: false }));
                  setFormError("");
                }}
                placeholder="Ej. correo@empresa.com o 55 1234 5678"
                aria-invalid={contactErrors.telefonoWhatsapp}
                className={`w-full rounded-xl border bg-[#03091f]/80 px-3.5 py-2.5 text-base text-white placeholder-slate-400 outline-none transition focus:bg-[#061238] sm:text-sm ${
                  contactErrors.telefonoWhatsapp
                    ? "border-rose-400/85 ring-2 ring-rose-500/25 focus:border-rose-400"
                    : "border-white/15 focus:border-[#38bdf8]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Cuerpo Principal: Lista de Procesos + Dashboard de Resumen */}
        <div
          id={`planner-panel-${activeService.id}`}
          role="tabpanel"
          aria-labelledby={`planner-tab-${activeService.id}`}
          className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-7"
        >
          {/* Columna Izquierda: Procesos y Tareas */}
          <div className="space-y-3.5 lg:col-span-8">
            {activeService.processes.map((process, idx) => {
              const prevGroup = idx > 0 ? activeService.processes[idx - 1].group : null;
              const showGroupHeader = Boolean(process.group && process.group !== prevGroup);

              return (
                <div key={process.id} className="space-y-2.5">
                  {showGroupHeader && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#38bdf8]">
                        {process.group}
                      </span>
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </div>
                  )}

                  <ProcessChecklistGroup
                    process={process}
                    accentIndex={idx}
                    selectedSet={activeSelectedSet}
                    isCollapsed={!expandedProcesses[process.id]}
                    onToggleCollapse={handleToggleCollapse}
                    onToggleTask={handleToggleTask}
                    onToggleProcessAll={handleToggleProcessAll}
                  />
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Panel Overall Progress + Mini Gauges + Acciones */}
          <aside className="rounded-2xl border border-white/[0.1] bg-[#040c29]/90 p-5 shadow-inner sm:p-6 lg:sticky lg:top-24 lg:col-span-4">
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Resumen General
                </p>
                <h3 className="font-display text-base font-extrabold text-white">Tu Selección</h3>
              </div>
              <span className="rounded-lg bg-[#16c47f]/20 px-2.5 py-1 text-xs font-extrabold text-[#6ee7b7] ring-1 ring-[#16c47f]/35">
                {totalSelectedAcrossServices}{" "}
                {totalSelectedAcrossServices === 1 ? "activa" : "activas"}
              </span>
            </div>

            {/* Anillo Circular Principal estilo Overall Progress */}
            <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#03091f]/75 py-4">
              <OverallProgressRing
                percentage={overallProgressPct}
                selectedCount={totalSelectedAcrossServices}
                totalCount={totalCatalogTasks}
              />

              {/* 3 Mini Anillos por Servicio estilo Team Capacity */}
              <div className="mt-4 grid grid-cols-3 gap-2 px-3">
                {PLANNER_SERVICES.map((srv, idx) => (
                  <MiniServiceGauge
                    key={srv.id}
                    service={srv}
                    selectedCount={selectedTasksByService[srv.id]?.length || 0}
                    totalCount={getServiceAllTaskIds(srv).length}
                    accent={SERVICE_ACCENTS[idx % SERVICE_ACCENTS.length]}
                    isActive={srv.id === activeService.id}
                    onSelect={() => setActiveServiceId(srv.id)}
                  />
                ))}
              </div>
            </div>

            {formError && (
              <p className="mb-3 rounded-xl border border-rose-400/35 bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-200">
                {formError}
              </p>
            )}

            {saveSuccessMsg && (
              <div
                role="status"
                aria-live="polite"
                className="mb-3 rounded-xl border border-emerald-400/45 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-semibold leading-relaxed text-emerald-200"
              >
                {saveSuccessMsg}
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleSendConfiguration}
                disabled={isSavingSubmission}
                className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isSavingSubmission ? "Enviando configuración..." : "Enviar Configuración"}
                </span>
                <IconArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf || isSavingSubmission}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#38bdf8]/45 bg-[#38bdf8]/10 px-6 py-3 text-xs font-bold text-[#93c5fd] transition hover:border-[#38bdf8] hover:bg-[#38bdf8]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <span>{isExportingPdf ? "Generando PDF..." : "Descargar Resumen PDF"}</span>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <IconShieldCheck className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                <span>Asesoría sin compromiso</span>
              </span>
              {totalSelectedAcrossServices > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="font-semibold text-slate-300 underline-offset-2 transition hover:text-white hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Notificación flotante de confirmación de envío */}
      {showSentToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 right-4 left-4 z-50 flex items-start gap-3 rounded-2xl border border-emerald-400/50 bg-[#041428]/95 p-4 text-white shadow-[0_18px_45px_rgba(2,6,20,0.85)] backdrop-blur-md sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#16c47f] text-sm font-extrabold text-[#031811]">
            ✓
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-extrabold text-emerald-300">
              ¡Configuración enviada!
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-200">
              Se registró tu configuración de servicios correctamente en el sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSentToast(false)}
            aria-label="Cerrar notificación"
            className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default ProjectPlannerSection;
