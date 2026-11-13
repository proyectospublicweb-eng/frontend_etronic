import { useEffect, useRef, useState } from "react";
import {
  CardWaveDecor,
  IconArrowRight,
  IconBriefcaseMedical,
  IconClose,
  IconCogs,
  IconCommentsDollar,
  IconDatabase,
  IconDesktop,
  IconFacebook,
  IconHeadset,
  IconInstagram,
  IconLifeRing,
  IconLockOpen,
  IconMenu,
  IconQuoteLeft,
  IconRss,
  IconSearch,
  IconServer,
  IconShieldCheck,
  IconSparklesBrain,
  IconTools,
  IconTwitterX,
} from "../components/LandingIcons";
import { useParallaxEngine } from "../hooks/useParallaxEngine";
import ChatWidget from "../components/ChatWidget.jsx";

const CURRENT_YEAR = new Date().getFullYear();

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio", href: "#inicio" },
  { id: "servicios", label: "Servicios", href: "#servicios" },
  { id: "principales", label: "Soluciones", href: "#principales" },
  { id: "sobre-nosotros", label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { id: "testimonios", label: "Clientes", href: "#testimonios" },
];

const HERO_STRIP_ITEMS = [
  {
    icon: IconHeadset,
    line1: "Soporte Remoto",
    line2: "Confiable",
  },
  {
    icon: IconServer,
    line1: "Servidores",
    line2: "Personalizados",
  },
  {
    icon: IconCogs,
    line1: "Mantenimiento",
    line2: "Preventivo",
  },
  {
    icon: IconShieldCheck,
    line1: "Conexión",
    line2: "100% Segura",
  },
];

const SPECIALIZED_SERVICES = [
  {
    id: "windows-365",
    badge: "MÁS SOLICITADO",
    category: "Plataformas Corporativas",
    image: "/images/card-windows-365.jpg",
    icon: IconCogs,
    title: "Soporte Técnico en Windows y Office 365",
    reviews: "(320)",
    description:
      "Ofrecemos asistencia experta para resolver cualquier inconveniente en plataformas Windows y Office 365, asegurando que tu equipo funcione de manera óptima.",
    cta: "Solicita Soporte",
    href: "#contacto",
    heroSlide: {
      prefix: "Soporte Técnico en ",
      highlight: "Windows y Office 365",
      suffix: "",
      floatingBottom: "Continuidad Microsoft 365",
      floatingTop: "Atención Remota Experta",
      navTarget: "servicios",
    },
  },
  {
    id: "virtual-servers",
    badge: "ALTO RENDIMIENTO",
    category: "Infraestructura Cloud",
    image: "/images/card-virtual-server.jpg",
    icon: IconServer,
    title: "Renta de Servidores Virtuales",
    reviews: "(210)",
    description:
      "Proporcionamos servidores virtuales personalizados que se adaptan a tus necesidades específicas, garantizando seguridad y rendimiento.",
    cta: "Conoce Más",
    href: "#principales",
    heroSlide: {
      prefix: "Renta de ",
      highlight: "Servidores Virtuales",
      suffix: "",
      floatingBottom: "Alta Disponibilidad Cloud",
      floatingTop: "Recursos Personalizados",
      navTarget: "principales",
    },
  },
  {
    id: "contpaqi",
    badge: "ESPECIALIZADO",
    category: "Gestión Empresarial",
    image: "/images/card-contpaqi.jpg",
    icon: IconBriefcaseMedical,
    title: "Soporte en Paquetería Contpaqi",
    reviews: "(185)",
    description:
      "Brindamos soporte completo para la paquetería Contpaqi, ayudando a gestionar eficientemente tus procesos contables y administrativos.",
    cta: "Obtén Asistencia",
    href: "#contacto",
    heroSlide: {
      prefix: "Soporte en ",
      highlight: "Paquetería Contpaqi",
      suffix: "",
      floatingBottom: "Procesos Contables al Día",
      floatingTop: "Respaldo Empresarial",
      navTarget: "servicios",
    },
  },
  {
    id: "ai-custom",
    badge: "INNOVACIÓN IA",
    category: "Inteligencia Artificial",
    image: "/images/card-ai-solutions.jpg",
    icon: IconSparklesBrain,
    title: "Implementación de IA a la Medida",
    reviews: "(145)",
    description:
      "Desarrollamos soluciones de IA a la medida, desde automatización de flujos hasta asistentes virtuales, diseñadas para optimizar procesos en cualquier sector ya sea, contable, educativo, empresarial, etc. Transformamos tus tareas repetitivas en sistemas inteligentes, seguros y fáciles de usar.",
    cta: "Cotizar Solución IA",
    href: "#solucion-ia",
    heroSlide: {
      prefix: "Implementamos ",
      highlight: "Inteligencia Artificial",
      suffix: " para tu Negocio",
      floatingBottom: "IA Adaptada a tu Giro",
      floatingTop: "Contable · Escolar · Médico · Social",
      navTarget: "servicios",
    },
  },
];

const HERO_SLIDES = [
  {
    id: "hero-etronic",
    eyebrow: "Soluciones Tecnológicas a tu Alcance",
    titlePrefix: "Optimiza tu ",
    titleHighlight: "Entorno",
    titleSuffix: " de Trabajo con Etronic",
    reviews: null,
    description:
      "Descubre cómo nuestros servicios especializados pueden transformar tu experiencia tecnológica, asegurando eficiencia y confiabilidad en cada paso.",
    primaryCta: "Explora Nuestros Servicios",
    primaryHref: "#servicios",
    primaryNav: "servicios",
    secondaryCta: "Nuestra Visión",
    secondaryHref: "#sobre-nosotros",
    secondaryNav: "sobre-nosotros",
    image: "/images/hero-3d-tech.jpg",
    imageAlt: "Infraestructura y servidores Etronic",
    floatingBottom: "Soporte Remoto Activo",
    floatingTop: "Servidores Dedicados",
  },
  ...[
    SPECIALIZED_SERVICES[3],
    SPECIALIZED_SERVICES[0],
    SPECIALIZED_SERVICES[1],
    SPECIALIZED_SERVICES[2],
  ].map((srv) => ({
    id: `hero-srv-${srv.id}`,
    eyebrow: `${srv.badge} · ${srv.category}`,
    titlePrefix: srv.heroSlide.prefix,
    titleHighlight: srv.heroSlide.highlight,
    titleSuffix: srv.heroSlide.suffix,
    reviews: srv.reviews,
    description: srv.description,
    primaryCta: srv.cta,
    primaryHref: srv.href,
    primaryNav: srv.heroSlide.navTarget,
    secondaryCta: "Ver Todos los Servicios",
    secondaryHref: "#servicios",
    secondaryNav: "servicios",
    image: srv.image,
    imageAlt: srv.title,
    floatingBottom: srv.heroSlide.floatingBottom,
    floatingTop: srv.heroSlide.floatingTop,
  })),
];

const AI_SECTORS = [
  {
    title: "Servicios Contables",
    detail: "Automatización de pólizas, validación fiscal, conciliaciones y asistentes internos.",
  },
  {
    title: "Escuelas y Educación",
    detail: "Tutores inteligentes, control escolar, admisiones y respuestas a padres 24/7.",
  },
  {
    title: "Clínicas y Servicios Médicos",
    detail: "Agendamiento inteligente, seguimiento a pacientes y resúmenes administrativos.",
  },
  {
    title: "Proyectos Sociales y ONG",
    detail: "Clasificación de solicitudes, atención ciudadana automatizada y análisis de impacto.",
  },
  {
    title: "Comercio y Ventas",
    detail: "Asesores virtuales conectados a tu catálogo, cotizadores y seguimiento de clientes.",
  },
  {
    title: "Cualquier Giro a la Medida",
    detail: "Analizamos tu flujo actual e integramos la IA exacta que acelere tus procesos.",
  },
];

const AI_HIGHLIGHTS = [
  {
    title: "Flujos Automatizados",
    detail: "Reduce captura manual y errores operativos.",
  },
  {
    title: "Asistentes 24/7",
    detail: "Atención inmediata para clientes y equipo.",
  },
  {
    title: "Integración Segura",
    detail: "Adaptada a tu software y reglas actuales.",
  },
];

const MAIN_FEATURES = [
  {
    icon: IconLifeRing,
    title: "Soporte Remoto Confiable",
    description:
      "Utilizamos TeamViewer para ofrecer soporte remoto seguro y eficiente, garantizando la resolución rápida de problemas.",
  },
  {
    icon: IconDesktop,
    title: "Personalización de Servidores",
    description:
      "Ofrecemos servidores virtuales personalizados para satisfacer las necesidades específicas de su negocio.",
  },
  {
    icon: IconHeadset,
    title: "Soporte Técnico Especializado",
    description:
      "Brindamos asistencia técnica en Windows y Office 365 para optimizar su entorno de trabajo.",
  },
  {
    icon: IconTools,
    title: "Asesoramiento en Ensambles",
    description:
      "Nuestro equipo le asesora en el ensamblaje de equipos de cómputo adaptados a sus requerimientos.",
  },
  {
    icon: IconTools,
    title: "Mantenimiento Preventivo",
    description:
      "Realizamos mantenimientos preventivos para asegurar el funcionamiento óptimo de sus sistemas.",
  },
  {
    icon: IconDatabase,
    title: "Soporte en Contapqi",
    description:
      "Ofrecemos soporte especializado en paquetería Contapqi para mejorar su gestión empresarial.",
  },
  {
    icon: IconLockOpen,
    title: "Conexión Segura",
    description:
      "Garantizamos conexiones seguras y confiables para todos nuestros servicios remotos.",
  },
  {
    icon: IconCommentsDollar,
    title: "Atención al Cliente",
    description:
      "Nuestro equipo está siempre disponible para ofrecerle el mejor asesoramiento y atención.",
  },
];

const VISION_PILLARS = [
  {
    icon: IconLifeRing,
    title: "Continuidad sin Interrupciones",
    text: "Soporte remoto inmediato con TeamViewer sin importar tu ubicación.",
  },
  {
    icon: IconDesktop,
    title: "Soluciones a la Medida",
    text: "Adaptamos cada infraestructura y servicio a las metas de tu empresa.",
  },
  {
    icon: IconShieldCheck,
    title: "Innovación y Respaldo",
    text: "Resolvemos retos actuales anticipando tus futuras necesidades de TI.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "“El soporte remoto de Etronic ha transformado la manera en que manejamos los problemas técnicos. ¡Altamente recomendados!”",
    name: "Carla Mendoza",
    role: "Gerente de TI",
    avatar: "/images/testimonial-carla.jpg",
    speed: "0.03",
  },
  {
    quote:
      "“Gracias a su personalización de servidores, hemos mejorado significativamente nuestra eficiencia operativa.”",
    name: "Raúl Gómez",
    role: "Directora de Operaciones",
    avatar: "/images/testimonial-raul.jpg",
    speed: "-0.04",
  },
  {
    quote:
      "“La atención al cliente de Etronic es excepcional. Siempre están disponibles para resolver cualquier duda.”",
    name: "Fernanda Ramírez",
    role: "CEO",
    avatar: "/images/testimonial-fernanda.jpg",
    speed: "0.03",
  },
];

function LandingPage() {
  const pageRef = useRef(null);
  const touchStartXRef = useRef(null);
  const isDesktopHoverRef = useRef(false);
  const [activeNav, setActiveNav] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedServices, setExpandedServices] = useState({});

  const toggleServiceDescription = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  useParallaxEngine(pageRef);

  // Avance automático continuo cada 5s en Móvil, Tablet y Escritorio.
  // En pantallas táctiles o vistas móvil/tablet (<1024px o sin puntero fino) nunca queda bloqueado por eventos sintéticos de hover.
  useEffect(() => {
    const resetHoverIfTouchOrCompact = () => {
      if (
        document.hidden ||
        window.innerWidth < 1024 ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        isDesktopHoverRef.current = false;
      }
    };

    const intervalId = window.setInterval(() => {
      const pauseForDesktopMouse =
        window.innerWidth >= 1024 &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        isDesktopHoverRef.current;

      if (pauseForDesktopMouse) return;
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    window.addEventListener("resize", resetHoverIfTouchOrCompact, {
      passive: true,
    });
    document.addEventListener("visibilitychange", resetHoverIfTouchOrCompact);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", resetHoverIfTouchOrCompact);
      document.removeEventListener("visibilitychange", resetHoverIfTouchOrCompact);
    };
  }, [currentSlide]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleHeroPointerEnter = (e) => {
    if (
      e.pointerType === "mouse" &&
      window.innerWidth >= 1024 &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      isDesktopHoverRef.current = true;
    }
  };

  const handleHeroPointerLeave = () => {
    isDesktopHoverRef.current = false;
  };

  const handleHeroTouchStart = (e) => {
    isDesktopHoverRef.current = false;
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = (e) => {
    isDesktopHoverRef.current = false;
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };

  const handleHeroTouchCancel = () => {
    touchStartXRef.current = null;
    isDesktopHoverRef.current = false;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    if (
      q.includes("ia") ||
      q.includes("inteligencia") ||
      q.includes("contab") ||
      q.includes("escol") ||
      q.includes("medic") ||
      q.includes("médic") ||
      q.includes("social") ||
      q.includes("automat")
    ) {
      document.getElementById("solucion-ia")?.scrollIntoView({ behavior: "smooth" });
    } else if (q.includes("vis") || q.includes("nosotros") || q.includes("misión")) {
      document.getElementById("sobre-nosotros")?.scrollIntoView({ behavior: "smooth" });
    } else if (q.includes("cliente") || q.includes("opin") || q.includes("testimonio")) {
      document.getElementById("testimonios")?.scrollIntoView({ behavior: "smooth" });
    } else if (q.includes("contact") || q.includes("asistencia")) {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
    }
    setSearchOpen(false);
  };

  const openProjectChat = (prefillMessage = "") => {
    window.dispatchEvent(
      new CustomEvent("etronic:open-chat", {
        detail: { prefillMessage },
      }),
    );
  };

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-clip bg-[#020614] text-slate-900">
      {/* Header Principal Oscuro con Barra de Progreso Neón */}
      <header
        id="main-header"
        className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#04091c]/90 backdrop-blur-md"
      >
        <div
          data-scroll-progress
          className="crescendo-btn-gradient pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0"
        />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          {/* Logo ETRONIC modo oscuro */}
          <a
            href="#inicio"
            onClick={() => setActiveNav("inicio")}
            className={`${searchOpen ? "hidden sm:flex" : "flex"} shrink-0 items-center py-2`}
          >
            <img
              src="/images/logo-etronic-dark.png"
              alt="ETRONIC"
              className="h-9 w-auto object-contain sm:h-11"
            />
          </a>

          {/* Navegación Central */}
          {!searchOpen && (
            <nav
              id="top-menu-nav"
              aria-label="Navegación principal"
              className="hidden items-center gap-8 lg:flex"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveNav(item.id)}
                    className={`text-[14px] font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-300/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Acciones Derecha: Búsqueda + CTA Gradiente + Menú Móvil */}
          <div
            className={`flex items-center gap-2 sm:gap-4 ${searchOpen ? "w-full sm:w-auto" : ""}`}
          >
            {!searchOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Abrir búsqueda"
                  className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <IconSearch className="h-[18px] w-[18px]" />
                </button>

                <a
                  href="#contacto"
                  className="crescendo-btn-gradient hidden rounded-full px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-indigo-600/30 transition duration-300 sm:inline-flex sm:items-center"
                >
                  Contáctenos
                </a>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Seleccionar página"
                  aria-expanded={mobileMenuOpen}
                  className="rounded-lg p-1.5 text-slate-200 transition hover:bg-white/10 lg:hidden"
                >
                  <IconMenu className="h-6 w-6" />
                </button>
              </>
            ) : (
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 sm:w-auto sm:gap-3 sm:px-4"
              >
                <IconSearch className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Búsqueda …"
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent text-base text-white placeholder-slate-400 outline-none sm:w-64 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  aria-label="Cerrar búsqueda"
                  className="shrink-0 p-0.5 text-slate-400 transition hover:text-white"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#060d24] px-6 py-4 shadow-2xl lg:hidden">
            <ul className="flex flex-col divide-y divide-white/5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => {
                        setActiveNav(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block py-3 text-sm font-medium ${
                        isActive ? "text-[#60a5fa]" : "text-slate-300"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
              <li className="pt-3">
                <a
                  href="#contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="crescendo-btn-gradient inline-block w-full rounded-full py-2.5 text-center text-sm font-semibold text-white"
                >
                  Contáctenos
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Contenido Principal */}
      <main id="main-content">
        {/* Sección Hero Oscura convertida en Slider Automático con Servicios Especializados + Parallax */}
        <section
          id="inicio"
          aria-roledescription="carousel"
          aria-label="Servicios destacados de Etronic"
          onPointerEnter={handleHeroPointerEnter}
          onPointerLeave={handleHeroPointerLeave}
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
          onTouchCancel={handleHeroTouchCancel}
          className="crescendo-hero-surface relative touch-pan-y overflow-hidden"
        >
          {/* Capa Profunda 1: Cuadrícula tecnológica con parallax lento */}
          <div
            data-parallax="0.42"
            data-parallax-mouse="-12"
            className="parallax-tech-grid pointer-events-none absolute -inset-20 opacity-70"
          />

          {/* Capa Profunda 2: Esferas luminosas ambientales */}
          <div
            data-parallax="0.34"
            data-parallax-mouse="-24"
            className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl"
          />
          <div
            data-parallax="0.28"
            data-parallax-mouse="22"
            className="pointer-events-none absolute right-6 top-16 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-7 px-4 pb-5 pt-8 sm:gap-10 sm:px-6 sm:pb-8 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-10 lg:pt-16 xl:gap-10">
            {/* Columna Izquierda: Diapositivas de Texto con transición suave */}
            <div
              data-parallax="0.14"
              data-parallax-mouse="-6"
              data-parallax-desktop
              className="z-10 grid min-w-0 [grid-template-areas:'slide'] lg:col-span-6"
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <div
                    key={slide.id}
                    aria-hidden={!isActive}
                    className={`[grid-area:slide] flex min-w-0 flex-col justify-center transition-all duration-700 ease-out ${
                      isActive
                        ? "pointer-events-auto translate-x-0 opacity-100"
                        : "pointer-events-none -translate-x-5 opacity-0"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <p className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1 text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#60a5fa] sm:rounded-full sm:px-3.5 sm:text-xs sm:tracking-[0.14em]">
                        {slide.eyebrow}
                      </p>

                      {slide.reviews && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-white sm:px-3 sm:text-xs">
                          <span className="tracking-wider text-amber-400">★★★★★</span>
                          <span className="text-slate-300">{slide.reviews}</span>
                        </span>
                      )}
                    </div>

                    <h1 className="font-display mb-4 text-[28px] font-extrabold leading-[1.15] tracking-tight text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[52px]">
                      {slide.titlePrefix}
                      <span className="crescendo-text-gradient">{slide.titleHighlight}</span>
                      {slide.titleSuffix}
                    </h1>

                    <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-300/90 sm:mb-8 sm:text-base md:text-[17px]">
                      {slide.description}
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
                      <a
                        href={slide.primaryHref}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveNav(slide.primaryNav)}
                        className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 sm:w-auto sm:px-7"
                      >
                        <span>{slide.primaryCta}</span>
                        <IconArrowRight className="h-4 w-4 shrink-0" />
                      </a>

                      <a
                        href={slide.secondaryHref}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveNav(slide.secondaryNav)}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-white/50 hover:bg-white/10 sm:w-auto sm:px-7"
                      >
                        {slide.secondaryCta}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columna Derecha: Render 3D Dinámico + Insignias Flotantes ancladas al marco 3D */}
            <div className="relative flex min-w-0 items-center justify-center lg:col-span-6">
              {/* Halo trasero independiente */}
              <div
                data-parallax="0.32"
                data-parallax-mouse="-26"
                className="pointer-events-none absolute h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl sm:h-96 sm:w-96"
              />

              <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[470px]">
                {/* Ventana 3D de Diapositivas */}
                <div
                  data-parallax="0.22"
                  data-parallax-mouse="16"
                  data-parallax-desktop
                  className="relative z-10 grid aspect-[4/3] w-full [grid-template-areas:'slide']"
                >
                  {HERO_SLIDES.map((slide, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <div
                        key={slide.id}
                        aria-hidden={!isActive}
                        className={`[grid-area:slide] h-full w-full transition-all duration-700 ease-out ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "pointer-events-none scale-95 opacity-0"
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.imageAlt}
                          className="hero-render-mask h-full w-full rounded-2xl object-cover sm:rounded-3xl"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Insignia flotante inferior izquierda (compacta en móvil, expandida en tablet/desktop) */}
                <div
                  data-parallax="-0.08"
                  data-parallax-mouse="30"
                  data-parallax-desktop
                  className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 flex max-w-[calc(100%-1.25rem)] items-center gap-2 rounded-xl border border-white/15 bg-[#0b1330]/90 px-3 py-2 text-[11px] text-white shadow-2xl backdrop-blur-md sm:-left-3 sm:bottom-5 sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-xs lg:left-0 xl:-left-3"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] sm:h-2.5 sm:w-2.5" />
                  <span className="truncate font-semibold">
                    {HERO_SLIDES[currentSlide].floatingBottom}
                  </span>
                </div>

                {/* Insignia flotante superior derecha (visible desde tablet sm+ para no saturar pantallas pequeñas) */}
                <div
                  data-parallax="-0.12"
                  data-parallax-mouse="-24"
                  data-parallax-desktop
                  className="pointer-events-none absolute -right-3 top-5 z-20 hidden items-center gap-2 rounded-2xl border border-indigo-400/25 bg-[#0b1330]/85 px-4 py-2.5 text-xs text-indigo-100 shadow-2xl backdrop-blur-md sm:flex lg:right-0 xl:-right-3"
                >
                  <IconShieldCheck className="h-4 w-4 shrink-0 text-[#60a5fa]" />
                  <span className="font-semibold">{HERO_SLIDES[currentSlide].floatingTop}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controles del Slider Automático (Indicadores con área táctil amplia + Flechas Anterior/Siguiente) */}
          <div className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pb-6 sm:gap-4 sm:px-6 sm:pb-10">
            <div
              role="tablist"
              aria-label="Seleccionar diapositiva"
              className="flex items-center gap-1"
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Ir a diapositiva ${idx + 1}: ${slide.imageAlt}`}
                    onClick={() => setCurrentSlide(idx)}
                    className="group flex items-center px-1 py-2.5"
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "crescendo-btn-gradient w-8 shadow-[0_0_12px_rgba(96,165,250,0.65)] sm:w-9"
                          : "w-2.5 bg-white/25 group-hover:bg-white/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={goToPrevSlide}
                aria-label="Diapositiva anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition hover:border-[#60a5fa] hover:bg-white/15 active:scale-95"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="Siguiente diapositiva"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition hover:border-[#60a5fa] hover:bg-white/15 active:scale-95"
              >
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Barra Inferior de 4 Beneficios Clave */}
          <div className="relative z-10 border-t border-white/[0.08] bg-[#0c142e]/90 pb-14 pt-7 backdrop-blur-sm">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 min-[440px]:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
              {HERO_STRIP_ITEMS.map((item) => {
                const StripIcon = item.icon;
                return (
                  <div
                    key={item.line1}
                    className="flex items-center gap-3.5 lg:justify-center lg:px-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-200 ring-1 ring-white/10">
                      <StripIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left text-xs font-medium leading-snug text-slate-200 sm:text-sm">
                      <p className="font-semibold text-white">{item.line1}</p>
                      <p className="text-slate-300/80">{item.line2}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contenedor Principal Azul Marino (#001039) con Efecto Cortina Sobre el Hero */}
        <div className="relative z-20 -mt-7 overflow-hidden rounded-t-[32px] border-t border-white/10 bg-[#001039] pb-20 pt-14 shadow-[0_-18px_50px_rgba(0,0,0,0.45)] sm:pt-16">
          {/* Esferas decorativas suaves con parallax de fondo */}
          <div
            data-parallax-section="-0.22"
            className="pointer-events-none absolute -right-28 top-32 h-96 w-96 rounded-full bg-indigo-500/[0.14] blur-3xl"
          />
          <div
            data-parallax-section="0.2"
            className="pointer-events-none absolute -left-28 top-[46%] h-96 w-96 rounded-full bg-blue-500/[0.12] blur-3xl"
          />

          {/* Sección Destacada post-slider: Enfoque Visual en Inteligencia Artificial */}
          <section
            id="ia-destacado"
            data-reveal
            className="relative mx-auto mb-12 max-w-6xl px-4 pb-2 sm:mb-16 sm:px-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-[#061238]/95 via-[#030b26]/95 to-[#0b1038]/95 p-5 shadow-2xl shadow-black/35 sm:p-8 lg:p-10">
              <div
                data-parallax-section="-0.16"
                className="parallax-tech-grid pointer-events-none absolute -inset-16 opacity-50"
              />
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10">
                {/* Columna de Imagen IA de Alto Impacto */}
                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#040a21] shadow-[0_18px_45px_rgba(0,0,0,0.5)] sm:rounded-3xl">
                    <img
                      src="/images/ai-showcase-banner.jpg"
                      alt="Visualización 3D de Inteligencia Artificial aplicada a procesos de negocio en Etronic"
                      className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#040a21]/85 via-[#040a21]/30 to-transparent" />
                    <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-white/15 bg-[#040a21]/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-2 sm:text-xs">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                      <span className="truncate">IA Aplicada a Procesos Reales</span>
                    </div>
                  </div>
                </div>

                {/* Columna Informativa Concisa */}
                <div className="min-w-0 lg:col-span-6">
                  <div className="mb-3.5 inline-flex max-w-full items-center gap-2 rounded-2xl border border-[#60a5fa]/30 bg-[#3b82f6]/15 px-3 py-1 text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#60a5fa] sm:rounded-full sm:px-3.5 sm:text-xs sm:tracking-wider">
                    <IconSparklesBrain className="h-4 w-4 shrink-0" />
                    <span>Inteligencia Artificial a la Medida</span>
                  </div>

                  <h2 className="font-display mb-3.5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
                    Lleva la{" "}
                    <span className="crescendo-text-gradient">Inteligencia Artificial</span> a tus
                    procesos diarios
                  </h2>

                  <p className="mb-5 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                    Convertimos tareas repetitivas y cuellos de botella en flujos inteligentes
                    adaptados a tu equipo. Implementamos asistentes virtuales, lectura automática de
                    documentos y análisis operativo sin interrumpir tus herramientas actuales.
                  </p>

                  <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                    {AI_HIGHLIGHTS.map((item) => (
                      <div
                        key={item.title}
                        className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                      >
                        <p className="font-display text-xs font-bold leading-snug text-white">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-slate-300/90">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="button"
                      onClick={() =>
                        openProjectChat(
                          "Hola, quiero platicar sobre cómo implementar Inteligencia Artificial en mi negocio o proyecto: ",
                        )
                      }
                      className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                    >
                      <span>Solicitar Diagnóstico IA</span>
                      <IconArrowRight className="h-4 w-4 shrink-0" />
                    </button>

                    <a
                      href="#solucion-ia"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#60a5fa] hover:bg-white/10 sm:w-auto"
                    >
                      Ver Sectores Compatibles
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección 1: Nuestros Servicios Especializados */}
          <section
            id="servicios"
            data-reveal
            className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6"
          >
            <div className="mb-9 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[32px]">
                Nuestros Servicios Especializados
              </h2>

              <a
                href="#principales"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10 sm:text-sm"
              >
                <span>Ver Todos los Servicios</span>
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-6">
              {SPECIALIZED_SERVICES.map((service) => {
                const isLongDescription = service.description.length > 175;
                const isExpanded = Boolean(expandedServices[service.id]);

                return (
                  <div key={service.id} className="flex">
                    <article className="group flex w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/[0.07]">
                      <div>
                        {/* Ventana Parallax Interna en el Render 3D */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e6e8f4]">
                          <span className="crescendo-btn-gradient absolute left-3.5 top-3.5 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-600/25">
                            {service.badge}
                          </span>

                          <img
                            src={service.image}
                            alt={service.title}
                            data-parallax-section="-0.11"
                            data-parallax-scale="1.14"
                            className="h-full w-full object-cover"
                          />

                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#f2f3f9] to-transparent" />
                        </div>

                        {/* Cuerpo de Tarjeta */}
                        <div className="px-5 pt-3">
                          <p className="mb-1 text-xs font-medium text-slate-500">
                            {service.category}
                          </p>

                          <h3 className="font-display mb-2 min-h-[2.75rem] text-[17px] font-bold leading-snug text-[#0f172a]">
                            {service.title}
                          </h3>

                          <div className="mb-3 flex items-center gap-1.5 text-xs">
                            <span
                              className="tracking-wider text-amber-400"
                              aria-label="5 estrellas"
                            >
                              ★★★★★
                            </span>
                            <span className="font-medium text-slate-400">{service.reviews}</span>
                          </div>

                          <p
                            className={`text-[13px] leading-relaxed text-slate-600 ${
                              isLongDescription && !isExpanded ? "line-clamp-4" : ""
                            }`}
                          >
                            {service.description}
                          </p>

                          {isLongDescription && (
                            <button
                              type="button"
                              onClick={() => toggleServiceDescription(service.id)}
                              aria-expanded={isExpanded}
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#1d4ed8] transition hover:text-[#5848f4]"
                            >
                              {isExpanded ? "Leer menos" : "Leer más"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Pie de Tarjeta con CTA Azul + Botón Circular Violeta */}
                      <div className="mt-5 flex items-center justify-between px-5 pb-5">
                        <a
                          href={service.href}
                          className="font-display text-sm font-extrabold text-[#1d4ed8] transition hover:text-[#5848f4]"
                        >
                          {service.cta}
                        </a>

                        <a
                          href={service.href}
                          aria-label={service.cta}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-md shadow-indigo-500/35 transition duration-300 hover:scale-105 hover:bg-[#4636e3]"
                        >
                          <IconArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Destacado Interactivo: Implementación de Inteligencia Artificial a la Medida */}
          <section
            id="solucion-ia"
            data-reveal
            className="mx-auto mt-10 max-w-6xl px-4 sm:mt-12 sm:px-6"
          >
            <div className="crescendo-navy-banner relative overflow-hidden rounded-3xl p-6 text-white ring-1 ring-white/10 shadow-2xl shadow-black/35 sm:p-10 lg:p-12">
              <div
                data-parallax-section="-0.18"
                className="parallax-tech-grid pointer-events-none absolute -inset-16 opacity-60"
              />
              <div
                data-parallax-section="0.2"
                data-parallax-x="-0.1"
                className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
              />

              <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/30 bg-[#3b82f6]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#60a5fa]">
                    <IconSparklesBrain className="h-4 w-4 shrink-0" />
                    <span>Servicio Personalizado de IA</span>
                  </div>

                  <h2 className="font-display mb-4 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
                    ¿Necesitas Inteligencia Artificial en tu{" "}
                    <span className="crescendo-text-gradient">Negocio o Proyecto</span>?
                  </h2>

                  <p className="mb-6 text-sm leading-relaxed text-slate-200/90 sm:text-base">
                    Platícanos cómo operan tus procesos y qué necesitas resolver. No importa el giro
                    de tu empresa: diseñamos, integramos y ponemos en marcha herramientas de IA
                    adaptadas a tus flujos reales de trabajo.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        openProjectChat(
                          "Hola, me interesa implementar Inteligencia Artificial en mi proyecto. Mis necesidades son: ",
                        )
                      }
                      className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                    >
                      <span>Cuéntanos tu Proyecto IA</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-7">
                  {AI_SECTORS.map((sector) => (
                    <button
                      key={sector.title}
                      type="button"
                      onClick={() =>
                        openProjectChat(
                          `Hola, me gustaría implementar IA para ${sector.title}. Necesito ayuda con: `,
                        )
                      }
                      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#60a5fa]/50 hover:bg-white/[0.08]"
                    >
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <h3 className="font-display text-sm font-bold text-white group-hover:text-[#60a5fa]">
                            {sector.title}
                          </h3>
                          <IconArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#60a5fa]" />
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300/90">{sector.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sección 2: Servicios Principales / Características Destacadas (Ondas con Parallax Horizontal) */}
          <section
            id="principales"
            data-reveal
            className="relative mx-auto mt-12 max-w-6xl px-4 py-6 sm:mt-14 sm:px-6"
          >
            <div className="mb-9 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#60a5fa]">
                  Características Destacadas
                </p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[32px]">
                  Servicios Principales
                </h2>
              </div>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#60a5fa] hover:bg-white/10 sm:text-sm"
              >
                <span>Descubra Más</span>
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MAIN_FEATURES.map((feature, idx) => {
                const FeatureIcon = feature.icon;
                const waveDir = idx % 2 === 0 ? "0.09" : "-0.09";
                return (
                  <div
                    key={feature.title}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-950/[0.06]"
                  >
                    {/* Ondas decorativas con parallax horizontal/vertical */}
                    <div
                      data-parallax-section="0.06"
                      data-parallax-x={waveDir}
                      data-parallax-scale="1.15"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full"
                    >
                      <CardWaveDecor className="h-full w-full" />
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-display mb-2 text-[17px] font-bold leading-snug text-[#0f172a]">
                        {feature.title}
                      </h3>

                      <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                        {feature.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-end justify-between pt-2">
                      <a
                        href="#contacto"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] transition hover:text-[#5848f4]"
                      >
                        <span>Consultar</span>
                        <IconArrowRight className="h-3.5 w-3.5" />
                      </a>

                      <div
                        data-parallax-section="-0.05"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#111936] to-[#262469] text-[#60a5fa] shadow-lg shadow-indigo-950/20 transition duration-300 group-hover:scale-105 group-hover:text-white"
                      >
                        <FeatureIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sección 3: Nuestra Visión en Etronic (Banner Cósmico con Capas Parallax Internas) */}
          <section
            id="sobre-nosotros"
            data-reveal
            className="mx-auto mt-12 max-w-6xl px-4 sm:mt-16 sm:px-6"
          >
            <div className="crescendo-navy-banner relative overflow-hidden rounded-3xl px-6 py-12 text-white ring-1 ring-white/10 shadow-2xl shadow-black/35 sm:px-12 sm:py-14">
              {/* Capas de profundidad dentro del banner */}
              <div
                data-parallax-section="0.2"
                className="parallax-tech-grid pointer-events-none absolute -inset-16 opacity-60"
              />
              <div
                data-parallax-section="-0.25"
                data-parallax-x="0.12"
                className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
              />
              <div
                data-parallax-section="0.22"
                data-parallax-x="-0.12"
                className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl"
              />

              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h2 className="font-display mb-5 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Nuestra Visión en Etronic
                </h2>

                <p className="text-sm leading-relaxed text-slate-200/90 sm:text-base">
                  Etronic se dedica a transformar la manera en que las empresas enfrentan los
                  desafíos tecnológicos. Nuestra misión es proporcionar soluciones innovadoras que
                  no solo resuelvan problemas inmediatos, sino que también anticipen futuras
                  necesidades. Utilizando herramientas avanzadas como TeamViewer, garantizamos
                  soporte remoto eficiente, asegurando que nuestros clientes puedan operar sin
                  interrupciones, sin importar su ubicación. Creemos en un enfoque personalizado,
                  adaptando nuestras soluciones a las necesidades específicas de cada cliente para
                  maximizar su productividad y éxito.
                </p>
              </div>

              <div className="relative z-10 mt-10 grid grid-cols-1 gap-7 border-t border-white/10 pt-10 md:grid-cols-3">
                {VISION_PILLARS.map((pillar) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div key={pillar.title} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5848f4] text-white shadow-lg shadow-indigo-600/40">
                        <PillarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-[13px]">
                          {pillar.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sección 4: Lo Que Dicen Nuestros Clientes (Columnas Escalonadas con Parallax) */}
          <section
            id="testimonios"
            data-reveal
            className="relative mx-auto mt-12 max-w-6xl px-4 py-6 sm:mt-16 sm:px-6"
          >
            <div className="mb-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#60a5fa] ring-1 ring-white/15">
                <IconQuoteLeft className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[32px]">
                Lo Que Dicen Nuestros Clientes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.name}
                  data-parallax-section={item.speed}
                  data-parallax-desktop
                  className="flex"
                >
                  <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#f2f3f9] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-950/[0.06]">
                    <div
                      data-parallax-section="0.06"
                      data-parallax-x="0.08"
                      data-parallax-scale="1.12"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full opacity-70"
                    >
                      <CardWaveDecor className="h-full w-full" />
                    </div>

                    <div className="relative z-10">
                      <p
                        className="mb-4 text-base tracking-[3px] text-amber-400"
                        aria-label="5 de 5 estrellas"
                      >
                        ★★★★★
                      </p>

                      <p className="mb-7 text-[15px] font-semibold leading-relaxed text-[#1e293b]">
                        {item.quote}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3.5 border-t border-slate-200/80 pt-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#5848f4]/30"
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#0f172a]">
                          {item.name}
                        </h4>
                        <p className="text-xs font-medium text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 5: Contáctenos Hoy (Banner Dividido con Imagen Parallax) */}
          <section
            id="contacto"
            data-reveal
            className="mx-auto mt-12 max-w-6xl px-4 sm:mt-14 sm:px-6"
          >
            <div className="crescendo-navy-banner relative overflow-hidden rounded-3xl p-6 text-white ring-1 ring-white/10 shadow-2xl shadow-black/35 sm:p-10 lg:p-12">
              <div
                data-parallax-section="-0.22"
                className="parallax-tech-grid pointer-events-none absolute -inset-16 opacity-55"
              />
              <div
                data-parallax-section="0.24"
                data-parallax-x="-0.1"
                className="pointer-events-none absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
              />

              <div className="relative z-10 grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="mb-3 inline-block rounded-full border border-[#60a5fa]/30 bg-[#3b82f6]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#60a5fa]">
                    Atención Personalizada
                  </p>

                  <h2 className="font-display mb-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Contáctenos Hoy
                  </h2>

                  <p className="mb-7 max-w-xl text-sm leading-relaxed text-slate-200/90 sm:mb-8 sm:text-base">
                    ¿Interesado en nuestros servicios? No dude en ponerse en contacto con nosotros
                    para obtener más información o solicitar asistencia personalizada.
                  </p>

                  <a
                    href="#contacto"
                    className="crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                  >
                    <span>Contáctenos</span>
                    <IconArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl">
                    <img
                      src="/images/contact-support.webp"
                      alt="Atención y soporte personalizado Etronic"
                      data-parallax-section="-0.12"
                      data-parallax-scale="1.14"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Principal Oscuro (espacio inferior/derecho reservado para el botón flotante de chat) */}
      <footer
        id="main-footer"
        className="border-t border-white/[0.08] bg-[#04091c] pb-24 pt-8 text-slate-400 sm:py-8"
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
              <img
                src="/images/logo-etronic-dark.png"
                alt="ETRONIC"
                className="h-8 w-auto object-contain"
              />
            </a>
            <p id="footer-info" className="text-center text-xs sm:text-left sm:text-sm">
              © {CURRENT_YEAR} <span className="font-semibold text-slate-200">ETRONIC</span> |
              Soporte Técnico Remoto y Servidores Virtuales
            </p>
          </div>

          <ul className="flex items-center gap-3">
            <li>
              <a
                href="#inicio"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconFacebook className="h-4 w-4" />
              </a>
            </li>
            <li>
              <a
                href="#inicio"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconTwitterX className="h-4 w-4" />
              </a>
            </li>
            <li>
              <a
                href="#inicio"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
            </li>
            <li>
              <a
                href="#inicio"
                aria-label="RSS"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition hover:bg-[#5848f4] hover:text-white"
              >
                <IconRss className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Chat flotante de atención a prospectos */}
      <ChatWidget />
    </div>
  );
}

export default LandingPage;
