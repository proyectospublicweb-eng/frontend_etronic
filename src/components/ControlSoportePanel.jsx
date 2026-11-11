import { useState } from "react";
import {
  updateAdminChatRequest,
  replyAdminChatRequest,
  deleteAdminChatRequest,
} from "../api/admin.js";
import {
  CardWaveDecor,
  IconChatBubble,
  IconDatabase,
  IconHeadset,
  IconSearch,
  IconSend,
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
  if (digits.length >= 10) {
    const waNumber = digits.length === 10 ? `52${digits}` : digits;
    return {
      href: `https://wa.me/${waNumber}`,
      label: "Abrir WhatsApp",
    };
  }
  return null;
}

function ControlSoportePanel({ conversations, summary, onConversationsUpdated }) {
  const [selectedId, setSelectedId] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [notesDraftById, setNotesDraftById] = useState({});
  const [savingNotes, setSavingNotes] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    if (statusFilter !== "todos" && conv.estado !== statusFilter) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const inHeader =
      conv.nombre?.toLowerCase().includes(q) || conv.contacto?.toLowerCase().includes(q);
    const inMessages = conv.mensajes?.some((m) => m.mensaje?.toLowerCase().includes(q));
    return Boolean(inHeader || inMessages);
  });

  const activeConversation =
    filteredConversations.find((c) => c.id === selectedId) ||
    conversations.find((c) => c.id === selectedId) ||
    filteredConversations[0] ||
    null;

  const activeNotesValue = activeConversation
    ? (notesDraftById[activeConversation.id] ?? activeConversation.notas_seguimiento ?? "")
    : "";

  const handleSelectConversation = async (conv) => {
    setSelectedId(conv.id);
    setMobileDetailOpen(true);
    setFeedback("");
    setErrorMsg("");

    if (conv.no_leidos_admin > 0) {
      try {
        await updateAdminChatRequest(conv.id, { marcarLeido: true });
        onConversationsUpdated();
      } catch {
        // Ignorar fallo silencioso al marcar lectura
      }
    }
  };

  const handleChangeStatus = async (convId, nextStatus) => {
    setFeedback("");
    setErrorMsg("");
    try {
      await updateAdminChatRequest(convId, {
        estado: nextStatus,
        marcarLeido: true,
      });
      setFeedback("Estado de seguimiento actualizado.");
      onConversationsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudo actualizar el estado.");
    }
  };

  const handleSaveNotes = async (convId) => {
    setFeedback("");
    setErrorMsg("");
    setSavingNotes(true);
    try {
      await updateAdminChatRequest(convId, {
        notas_seguimiento: activeNotesValue,
        marcarLeido: true,
      });
      setFeedback("Notas de seguimiento guardadas.");
      onConversationsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudieron guardar las notas.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!activeConversation) return;
    const cleanReply = replyText.trim();
    if (!cleanReply) return;

    setFeedback("");
    setErrorMsg("");
    setSendingReply(true);
    try {
      await replyAdminChatRequest(activeConversation.id, cleanReply);
      setReplyText("");
      setFeedback("Respuesta enviada al chat del cliente.");
      onConversationsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudo enviar la respuesta.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteConversation = async (conv) => {
    if (
      !window.confirm(`¿Seguro que deseas eliminar el chat de "${conv.nombre}" (${conv.contacto})?`)
    ) {
      return;
    }

    setFeedback("");
    setErrorMsg("");
    try {
      await deleteAdminChatRequest(conv.id);
      if (selectedId === conv.id) {
        setSelectedId(null);
      }
      setMobileDetailOpen(false);
      setFeedback(`Conversación de ${conv.nombre} eliminada.`);
      onConversationsUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No se pudo eliminar la conversación.");
    }
  };

  const quickLink = activeConversation ? buildQuickContactLink(activeConversation.contacto) : null;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Tarjetas KPI de Control & Soporte */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-5 text-slate-900 shadow-lg sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full">
            <CardWaveDecor className="h-full w-full" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Chats
              </p>
              <p className="font-display mt-2 text-3xl font-extrabold text-[#0f172a]">
                {summary.total}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa]">
              <IconChatBubble className="h-5 w-5" />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-xs font-semibold text-[#1d4ed8]">
            Prospectos desde Landing Page
          </p>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-5 text-slate-900 shadow-lg sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full">
            <CardWaveDecor className="h-full w-full" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pendientes
              </p>
              <p className="font-display mt-2 text-3xl font-extrabold text-amber-600">
                {summary.pendientes}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-500/35">
              <IconHeadset className="h-5 w-5" />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-xs font-semibold text-[#5848f4]">
            {summary.no_leidos} mensaje(s) sin leer
          </p>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-5 text-slate-900 shadow-lg sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full">
            <CardWaveDecor className="h-full w-full" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                En Seguimiento
              </p>
              <p className="font-display mt-2 text-3xl font-extrabold text-[#1d4ed8]">
                {summary.en_seguimiento}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa]">
              <IconDatabase className="h-5 w-5" />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-xs font-semibold text-slate-600">
            Atención comercial en curso
          </p>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-5 text-slate-900 shadow-lg sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full">
            <CardWaveDecor className="h-full w-full" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Atendidos</p>
              <p className="font-display mt-2 text-3xl font-extrabold text-emerald-600">
                {summary.atendidos}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-500/35">
              <IconShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="relative z-10 mt-3 text-xs font-semibold text-emerald-700">
            Solicitudes completadas
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200 sm:px-5">
          {feedback}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-200 sm:px-5">
          {errorMsg}
        </div>
      )}

      {/* Barra de búsqueda y filtro por estado */}
      <div className="flex flex-col justify-between gap-3.5 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setMobileDetailOpen(false);
            }}
            placeholder="Buscar por nombre, correo, Tel-WhatsApp o mensaje..."
            className="w-full rounded-full border border-white/20 bg-[#04091c]/90 py-2.5 pl-11 pr-4 text-base text-white placeholder-slate-400 outline-none transition focus:border-[#60a5fa] sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "todos", label: "Todos" },
            { id: "pendiente", label: "Pendientes" },
            { id: "en_seguimiento", label: "En seguimiento" },
            { id: "atendido", label: "Atendidos" },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setMobileDetailOpen(false);
                }}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition sm:px-4 ${
                  active
                    ? "crescendo-btn-gradient text-white shadow-md shadow-indigo-600/30"
                    : "border border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vista Maestra-Detalle Responsiva (Móvil/Tablet: alterna bandeja y chat con botón de retorno; Desktop lg+: 2 columnas simultáneas) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Lista de Prospectos y Mensajes Recibidos */}
        <div
          className={`crescendo-navy-banner flex-col overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-xl lg:col-span-5 lg:flex ${
            mobileDetailOpen && activeConversation ? "hidden" : "flex"
          }`}
        >
          <div className="border-b border-white/10 bg-black/20 px-4 py-4 sm:px-5">
            <h2 className="font-display text-base font-extrabold text-white">
              Mensajes Recibidos ({filteredConversations.length})
            </h2>
            <p className="text-xs text-slate-300">
              Selecciona un contacto para ver su conversación y dar seguimiento
            </p>
          </div>

          <div className="max-h-[480px] divide-y divide-white/10 overflow-y-auto sm:max-h-[560px]">
            {filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              const lastMsg = conv.mensajes?.[conv.mensajes.length - 1]?.mensaje || "";
              const statusInfo = STATUS_META[conv.estado] || STATUS_META.pendiente;

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition sm:px-5 ${
                    isSelected ? "bg-[#5848f4]/25" : "hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-white">
                        {conv.nombre}
                      </p>
                      <p className="truncate text-xs font-medium text-[#60a5fa]">{conv.contacto}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {conv.no_leidos_admin > 0 && (
                        <span className="crescendo-btn-gradient rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white">
                          {conv.no_leidos_admin} nuevo(s)
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-xs text-slate-300">{lastMsg}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{conv.mensajes?.length || 0} mensaje(s)</span>
                    <span>{formatDateTime(conv.actualizado_en)}</span>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="px-6 py-14 text-center">
                <IconChatBubble className="mx-auto mb-3 h-9 w-9 text-slate-400" />
                <p className="font-display text-sm font-bold text-white">
                  Aún no hay mensajes para mostrar
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Cuando un visitante escriba desde el chat flotante de la Landing Page aparecerá
                  aquí automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Historial del Chat + Respuesta + Seguimiento */}
        <div
          className={`crescendo-navy-banner flex-col justify-between overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-xl lg:col-span-7 lg:flex ${
            mobileDetailOpen || !activeConversation ? "flex" : "hidden"
          }`}
        >
          {activeConversation ? (
            <>
              {/* Barra de retorno visible en Móvil y Tablet (< lg) */}
              <div className="border-b border-white/10 bg-[#020614]/60 px-4 py-2.5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#60a5fa] transition hover:text-white"
                >
                  <span>← Volver a Mensajes Recibidos</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                    {filteredConversations.length}
                  </span>
                </button>
              </div>

              {/* Datos del cliente y controles de estado */}
              <div className="flex flex-col gap-4 border-b border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#60a5fa]">
                    Datos del Prospecto
                  </p>
                  <h3 className="font-display text-base font-extrabold text-white sm:text-lg">
                    {activeConversation.nombre}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="max-w-full break-all rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 font-mono text-slate-200">
                      {activeConversation.contacto}
                    </span>
                    {quickLink && (
                      <a
                        href={quickLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="crescendo-btn-gradient rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow"
                      >
                        {quickLink.label} ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Estado de seguimiento"
                    value={activeConversation.estado}
                    onChange={(e) => handleChangeStatus(activeConversation.id, e.target.value)}
                    className="flex-1 rounded-full border border-white/20 bg-[#071130] px-3.5 py-2 text-base font-semibold text-white outline-none focus:border-[#60a5fa] sm:flex-initial sm:text-xs"
                  >
                    <option value="pendiente">Estado: Pendiente</option>
                    <option value="en_seguimiento">Estado: En seguimiento</option>
                    <option value="atendido">Estado: Atendido</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteConversation(activeConversation)}
                    className="rounded-full border border-red-400/30 bg-red-500/15 px-3.5 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/25"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Conversación del Chat */}
              <div className="max-h-[320px] min-h-[210px] space-y-3 overflow-y-auto bg-[#020614]/55 p-4 sm:p-5">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white">
                    <IconHeadset className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2 text-xs text-slate-200">
                    <span className="block text-[10px] font-bold uppercase text-[#60a5fa]">
                      Saludo automático
                    </span>
                    Hola, ¿Cómo te puedo ayudar?
                  </div>
                </div>

                {activeConversation.mensajes?.map((msg) => {
                  const isClient = msg.remitente === "cliente";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow sm:px-4 ${
                          isClient
                            ? "rounded-tl-sm bg-[#f2f3f9] font-medium text-[#0f172a]"
                            : "crescendo-btn-gradient rounded-tr-sm text-white"
                        }`}
                      >
                        <p
                          className={`mb-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            isClient ? "text-[#1d4ed8]" : "text-indigo-100"
                          }`}
                        >
                          {isClient ? activeConversation.nombre : "Respuesta Admin"}
                        </p>
                        <p className="whitespace-pre-wrap break-words">{msg.mensaje}</p>
                      </div>
                      <span className="mt-1 px-1 text-[10px] text-slate-400">
                        {formatDateTime(msg.creado_en)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Formulario para responder al chat en tiempo real */}
              <form
                onSubmit={handleSendReply}
                className="flex flex-col gap-2.5 border-t border-white/10 bg-[#04091c]/80 p-4 sm:flex-row sm:items-center sm:px-5 sm:py-3.5"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Responder mensaje al cliente por el chat..."
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-base text-white placeholder-slate-400 outline-none focus:border-[#60a5fa] sm:text-xs"
                />
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="crescendo-btn-gradient inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <span>{sendingReply ? "Enviando..." : "Responder"}</span>
                  <IconSend className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Notas internas de seguimiento */}
              <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="admin-followup-notes"
                    className="text-xs font-bold uppercase tracking-wider text-[#60a5fa]"
                  >
                    Notas de Seguimiento Interno
                  </label>
                  <button
                    type="button"
                    disabled={savingNotes}
                    onClick={() => handleSaveNotes(activeConversation.id)}
                    className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/15 disabled:opacity-50"
                  >
                    {savingNotes ? "Guardando..." : "Guardar Notas"}
                  </button>
                </div>
                <textarea
                  id="admin-followup-notes"
                  rows={2}
                  value={activeNotesValue}
                  onChange={(e) =>
                    setNotesDraftById((prev) => ({
                      ...prev,
                      [activeConversation.id]: e.target.value,
                    }))
                  }
                  placeholder="Registra acuerdos, cotizaciones enviadas o próximos pasos con este prospecto..."
                  className="w-full rounded-2xl border border-white/15 bg-[#020614]/60 px-4 py-2.5 text-base text-white placeholder-slate-400 outline-none focus:border-[#60a5fa] sm:text-xs"
                />
              </div>
            </>
          ) : (
            <div className="flex min-h-[340px] flex-col items-center justify-center p-6 text-center sm:min-h-[420px] sm:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#5848f4]/25 text-[#60a5fa] ring-1 ring-[#60a5fa]/30">
                <IconHeadset className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-white">
                Centro de Control & Soporte
              </h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-300">
                Aquí visualizarás el nombre, correo o teléfono-WhatsApp y los mensajes enviados por
                los posibles clientes desde el chat de la Landing Page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlSoportePanel;
