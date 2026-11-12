import { useState, useEffect, useRef } from "react";
import { getVisitorChatSessionRequest, sendVisitorChatMessageRequest } from "../api/chat.js";
import { IconChatBubble, IconClose, IconHeadset, IconSend } from "./LandingIcons.jsx";

const STORAGE_KEY = "etronic_visitor_chat_v1";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_REGEX = /^\+?[\d\s()-]{7,20}$/;

function isValidEmailOrPhone(value) {
  const clean = String(value || "").trim();
  if (!clean) return false;
  if (EMAIL_REGEX.test(clean)) return true;
  const digits = clean.replace(/\D/g, "");
  return PHONE_CHARS_REGEX.test(clean) && digits.length >= 7 && digits.length <= 15;
}

function loadStoredVisitor() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.sessionKey) {
        return {
          sessionKey: String(parsed.sessionKey),
          nombre: String(parsed.nombre || ""),
          contacto: String(parsed.contacto || ""),
        };
      }
    }
  } catch {
    // Ignorar si localStorage está bloqueado
  }

  const generatedKey =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? `etr-${crypto.randomUUID()}`
      : `etr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    sessionKey: generatedKey,
    nombre: "",
    contacto: "",
  };
}

function saveStoredVisitor(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignorar errores de cuota
  }
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState(loadStoredVisitor);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ nombre: false, contacto: false });
  const [hiddenAutoReplyId, setHiddenAutoReplyId] = useState(null);
  const [isSystemTyping, setIsSystemTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const nameInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const typingStartTimeoutRef = useRef(null);
  const typingRevealTimeoutRef = useRef(null);

  const visibleMensajes =
    hiddenAutoReplyId === null ? mensajes : mensajes.filter((m) => m.id !== hiddenAutoReplyId);

  const clearTypingTimers = () => {
    if (typingStartTimeoutRef.current) {
      window.clearTimeout(typingStartTimeoutRef.current);
      typingStartTimeoutRef.current = null;
    }
    if (typingRevealTimeoutRef.current) {
      window.clearTimeout(typingRevealTimeoutRef.current);
      typingRevealTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTypingTimers();
    };
  }, []);

  // Carga inicial e intervalo de sincronización mientras la ventana de chat está abierta
  useEffect(() => {
    if (!isOpen || !visitorInfo.sessionKey) return undefined;

    let active = true;

    const syncConversation = () => {
      getVisitorChatSessionRequest(visitorInfo.sessionKey)
        .then((res) => {
          if (!active) return;
          const conv = res.data?.conversation;
          if (conv && Array.isArray(conv.mensajes)) {
            setMensajes(conv.mensajes);
          }
        })
        .catch(() => {});
    };

    syncConversation();
    const timer = window.setInterval(syncConversation, 5000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isOpen, visitorInfo.sessionKey]);

  // Auto-scroll al último mensaje o indicador de escritura cuando cambia la lista o se abre el chat
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, visibleMensajes.length, isSystemTyping]);

  const handleFieldChange = (field, value) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    if (errorMsg) setErrorMsg("");
    setVisitorInfo((prev) => {
      const updated = { ...prev, [field]: value };
      saveStoredVisitor(updated);
      return updated;
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = visitorInfo.nombre.trim();
    const cleanContact = visitorInfo.contacto.trim();
    const cleanMsg = mensaje.trim();

    const missingName = cleanName.length < 2;
    const missingContact = cleanContact.length === 0;

    if (missingName && missingContact) {
      setFieldErrors({ nombre: true, contacto: true });
      setErrorMsg("Los campos Nombre y Correo o Tel-Whatsapp son obligatorios.");
      nameInputRef.current?.focus();
      return;
    }
    if (missingName) {
      setFieldErrors({ nombre: true, contacto: false });
      setErrorMsg("El campo Nombre es obligatorio (mínimo 2 caracteres).");
      nameInputRef.current?.focus();
      return;
    }
    if (missingContact) {
      setFieldErrors({ nombre: false, contacto: true });
      setErrorMsg("El campo Correo o Tel-Whatsapp es obligatorio.");
      contactInputRef.current?.focus();
      return;
    }
    if (!isValidEmailOrPhone(cleanContact)) {
      setFieldErrors({ nombre: false, contacto: true });
      setErrorMsg("Ingresa un Correo electrónico válido o un número de Tel-Whatsapp válido.");
      contactInputRef.current?.focus();
      return;
    }
    if (!cleanMsg) {
      setFieldErrors({ nombre: false, contacto: false });
      setErrorMsg("Escribe tu consulta para enviarla.");
      return;
    }

    setFieldErrors({ nombre: false, contacto: false });

    setSending(true);
    try {
      const res = await sendVisitorChatMessageRequest({
        sessionKey: visitorInfo.sessionKey,
        nombre: cleanName,
        contacto: cleanContact,
        mensaje: cleanMsg,
      });

      saveStoredVisitor({
        sessionKey: visitorInfo.sessionKey,
        nombre: cleanName,
        contacto: cleanContact,
      });

      if (Array.isArray(res.data?.mensajes)) {
        const serverMsgs = res.data.mensajes;
        const lastServerMsg = serverMsgs[serverMsgs.length - 1];

        if (lastServerMsg && lastServerMsg.remitente === "sistema") {
          clearTypingTimers();
          setHiddenAutoReplyId(lastServerMsg.id);
          setIsSystemTyping(false);
          setMensajes(serverMsgs);

          // 1) Esperar 4 segundos tras enviar para mostrar el indicador "Escribiendo..."
          typingStartTimeoutRef.current = window.setTimeout(() => {
            typingStartTimeoutRef.current = null;
            setIsSystemTyping(true);

            // 2) Mantener el efecto "Escribiendo..." durante otros 4 segundos antes de revelar la respuesta
            typingRevealTimeoutRef.current = window.setTimeout(() => {
              typingRevealTimeoutRef.current = null;
              setIsSystemTyping(false);
              setHiddenAutoReplyId(null);
            }, 4000);
          }, 4000);
        } else {
          setMensajes(serverMsgs);
        }
      }
      setMensaje("");
    } catch (err) {
      const apiErr = err.response?.data;
      const detail = Array.isArray(apiErr)
        ? apiErr[0]
        : apiErr?.message || "No se pudo enviar el mensaje. Intenta de nuevo.";
      setErrorMsg(detail);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Caja de diálogo responsiva (móvil: centrada con margen simétrico y alto dinámico dvh; tablet/desktop: anclada a la derecha) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat de atención Etronic"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[calc(100dvh-5.75rem)] flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#04091c] text-white shadow-[0_24px_60px_rgba(2,6,20,0.8)] ring-1 ring-indigo-500/25 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[390px] sm:max-h-[min(620px,calc(100dvh-7rem))]"
        >
          {/* Cabecera fija del diálogo */}
          <div className="crescendo-navy-banner relative flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="crescendo-btn-gradient relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md shadow-indigo-600/40 sm:h-10 sm:w-10">
                <IconHeadset className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#04091c] bg-emerald-400" />
              </div>
              <div>
                <p className="font-display text-sm font-extrabold leading-tight text-white">
                  Soporte Etronic
                </p>
                <p className="text-[11px] font-medium text-emerald-300">
                  {isSystemTyping ? "● Escribiendo respuesta..." : "● Atención en línea"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSendMessage} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* Dos campos requeridos: Nombre y Correo o Tel-Whatsapp */}
            <div className="shrink-0 space-y-2 border-b border-white/10 bg-[#07102c] px-4 py-3 sm:space-y-2.5 sm:py-3.5">
              <div>
                <label
                  htmlFor="chat-visitor-name"
                  className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#60a5fa]"
                >
                  Nombre <span className="text-rose-400">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="chat-visitor-name"
                  type="text"
                  value={visitorInfo.nombre}
                  onChange={(e) => handleFieldChange("nombre", e.target.value)}
                  placeholder="Tu nombre completo"
                  aria-invalid={fieldErrors.nombre}
                  className={`w-full rounded-xl border bg-white/[0.06] px-3.5 py-2 text-base text-white placeholder-slate-400 outline-none transition focus:bg-white/[0.09] sm:text-xs ${
                    fieldErrors.nombre
                      ? "border-rose-400/85 ring-2 ring-rose-500/25 focus:border-rose-400"
                      : "border-white/15 focus:border-[#60a5fa]"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="chat-visitor-contact"
                  className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#60a5fa]"
                >
                  Correo o Tel-Whatsapp <span className="text-rose-400">*</span>
                </label>
                <input
                  ref={contactInputRef}
                  id="chat-visitor-contact"
                  type="text"
                  value={visitorInfo.contacto}
                  onChange={(e) => handleFieldChange("contacto", e.target.value)}
                  placeholder="correo@empresa.com o 55 1234 5678"
                  aria-invalid={fieldErrors.contacto}
                  className={`w-full rounded-xl border bg-white/[0.06] px-3.5 py-2 text-base text-white placeholder-slate-400 outline-none transition focus:bg-white/[0.09] sm:text-xs ${
                    fieldErrors.contacto
                      ? "border-rose-400/85 ring-2 ring-rose-500/25 focus:border-rose-400"
                      : "border-white/15 focus:border-[#60a5fa]"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Área desplazable de conversación */}
            <div className="min-h-[120px] flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#001039] px-4 py-3.5 sm:min-h-[195px]">
              {/* Mensaje inicial fijo del asistente */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white shadow">
                  <IconHeadset className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[84%] rounded-2xl rounded-tl-sm bg-[#f2f3f9] px-3.5 py-2.5 text-xs leading-relaxed font-medium text-[#0f172a] shadow sm:text-[13px]">
                  Hola, ¿Cómo te puedo ayudar?
                </div>
              </div>

              {/* Historial de mensajes enviados y respuestas de soporte */}
              {visibleMensajes.map((msg) => {
                const isClient = msg.remitente === "cliente";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow sm:text-[13px] ${
                        isClient
                          ? "crescendo-btn-gradient rounded-tr-sm text-white"
                          : "rounded-tl-sm bg-[#f2f3f9] font-medium text-[#0f172a]"
                      }`}
                    >
                      {!isClient && (
                        <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#5848f4]">
                          Soporte Etronic
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.mensaje}</p>
                    </div>
                    {msg.creado_en && (
                      <span className="mt-1 px-1 text-[10px] text-slate-400">
                        {formatTime(msg.creado_en)}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Efecto animado de escritura (inicia a los 4 s del envío y permanece 4 s antes de revelar la respuesta) */}
              {isSystemTyping && (
                <div role="status" aria-live="polite" className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white shadow">
                    <IconHeadset className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-[#f2f3f9] px-3.5 py-2.5 text-xs text-[#0f172a] shadow">
                    <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#5848f4]">
                      Soporte Etronic
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500">Escribiendo</span>
                      <span className="inline-flex items-center gap-1" aria-hidden="true">
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5848f4]"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5848f4]"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5848f4]"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {errorMsg && (
              <div className="shrink-0 border-t border-red-400/20 bg-red-500/15 px-4 py-2 text-[11px] text-red-200">
                {errorMsg}
              </div>
            )}

            {/* Barra inferior fija para escribir mensaje */}
            <div className=" flex shrink-0 items-center gap-2 border-t border-white/10 bg-[#04091c] p-3">
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
                aria-label="Escribe tu mensaje"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-base text-white placeholder-slate-400 outline-none transition focus:border-[#60a5fa] sm:text-xs"
              />
              <button
                type="submit"
                disabled={sending}
                aria-label="Enviar mensaje"
                className="crescendo-btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-indigo-600/35 transition hover:scale-105 disabled:opacity-50"
              >
                <IconSend className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón Flotante Inferior Derecho */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar chat de soporte" : "Abrir chat de soporte"}
        aria-expanded={isOpen}
        className="crescendo-btn-gradient group fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_30px_rgba(88,72,244,0.55)] ring-2 ring-white/20 transition duration-300 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-15 sm:w-15"
      >
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#020614] bg-emerald-400" />
          </span>
        )}
        {isOpen ? (
          <IconClose className="h-6 w-6" />
        ) : (
          <IconChatBubble className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7" />
        )}
      </button>
    </>
  );
}

export default ChatWidget;
