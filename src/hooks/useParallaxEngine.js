import { useEffect } from "react";

/**
 * Motor ligero de Parallax y Scroll-Reveal acelerado por GPU (60/120fps).
 * No dispara re-renders de React: actualiza `transform: translate3d(...)`
 * mediante `requestAnimationFrame` y cachea posiciones base fuera del scroll.
 *
 * Atributos soportados dentro de `containerRef`:
 * - `data-parallax="<factor>"`: desplazamiento global respecto a `window.scrollY` (ideal para el Hero).
 * - `data-parallax-section="<factor>"`: desplazamiento relativo al centro del viewport.
 * - `data-parallax-x="<factor>"`: desplazamiento horizontal al hacer scroll.
 * - `data-parallax-scale="<num>"`: escala constante (ej. `1.14` para imágenes recortadas con `overflow-hidden`).
 * - `data-parallax-mouse="<px>"`: desplazamiento interactivo suave con el puntero en escritorio.
 * - `data-scroll-progress`: barra superior cuyo `scaleX` refleja el avance de lectura (0..1).
 * - `data-reveal`: animación suave de aparición al entrar en pantalla (`IntersectionObserver`).
 */
export function useParallaxEngine(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scroll-Reveal con IntersectionObserver
    const revealNodes = Array.from(root.querySelectorAll("[data-reveal]"));
    let revealObserver = null;

    if (prefersReducedMotion) {
      revealNodes.forEach((node) => node.classList.add("is-revealed"));
    } else if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add("is-revealed"));
    }

    if (prefersReducedMotion) {
      return () => {
        revealObserver?.disconnect();
      };
    }

    // 2. Recolección y caché de nodos parallax
    const heroNodes = Array.from(root.querySelectorAll("[data-parallax]")).map((el) => ({
      el,
      speedY: parseFloat(el.dataset.parallax || "0"),
      speedX: parseFloat(el.dataset.parallaxX || "0"),
      mouse: parseFloat(el.dataset.parallaxMouse || "0"),
      scale: parseFloat(el.dataset.parallaxScale || "1"),
      desktopOnly: el.hasAttribute("data-parallax-desktop"),
    }));

    const sectionNodes = Array.from(root.querySelectorAll("[data-parallax-section]")).map((el) => ({
      el,
      speedY: parseFloat(el.dataset.parallaxSection || "0"),
      speedX: parseFloat(el.dataset.parallaxX || "0"),
      scale: parseFloat(el.dataset.parallaxScale || "1"),
      desktopOnly: el.hasAttribute("data-parallax-desktop"),
      baseCenterY: 0,
      appliedY: 0,
    }));

    const progressNode = root.querySelector("[data-scroll-progress]");

    let docMaxScroll = 1;
    let viewportHeight = window.innerHeight || 1;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let rafId = null;

    const measurePositions = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      viewportHeight = window.innerHeight || 1;
      docMaxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);

      sectionNodes.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        // Restamos el último `appliedY` para obtener la coordenada pura del documento sin feedback
        item.baseCenterY = scrollY + rect.top + rect.height / 2 - item.appliedY;
      });
    };

    const renderFrame = () => {
      rafId = null;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Suavizado exponencial para el movimiento del mouse
      currentMouseX += (targetMouseX - currentMouseX) * 0.1;
      currentMouseY += (targetMouseY - currentMouseY) * 0.1;

      if (progressNode) {
        const ratio = Math.min(1, Math.max(0, scrollY / docMaxScroll));
        progressNode.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }

      const isMobile = window.innerWidth < 1024;

      // Hero parallax (activo mientras el hero es cercano al viewport)
      if (scrollY < viewportHeight * 1.6) {
        heroNodes.forEach((item) => {
          if (item.desktopOnly && isMobile) {
            if (item.el.style.transform) {
              item.el.style.transform = "";
            }
            return;
          }
          const y = scrollY * item.speedY + currentMouseY * item.mouse;
          const x = scrollY * item.speedX + currentMouseX * item.mouse;
          const scalePart = item.scale !== 1 ? ` scale(${item.scale})` : "";
          item.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
            2,
          )}px, 0)${scalePart}`;
        });
      }

      // Section-relative parallax centrado en el viewport
      const viewportCenterDocY = scrollY + viewportHeight * 0.5;
      sectionNodes.forEach((item) => {
        if (item.desktopOnly && isMobile) {
          if (item.appliedY !== 0) {
            item.appliedY = 0;
            item.el.style.transform = "";
          }
          return;
        }
        const delta = item.baseCenterY - viewportCenterDocY;
        // Solo calculamos/aplicamos si está razonablemente cerca de la vista
        if (Math.abs(delta) > viewportHeight * 1.4) return;

        const clampedY = Math.max(-90, Math.min(90, delta * item.speedY));
        const clampedX = item.speedX ? Math.max(-70, Math.min(70, delta * item.speedX)) : 0;

        item.appliedY = clampedY;
        const scalePart = item.scale !== 1 ? ` scale(${item.scale})` : "";
        item.el.style.transform = `translate3d(${clampedX.toFixed(
          2,
        )}px, ${clampedY.toFixed(2)}px, 0)${scalePart}`;
      });

      // Si el mouse sigue interpolando, agendar siguiente frame suave
      if (
        Math.abs(targetMouseX - currentMouseX) > 0.002 ||
        Math.abs(targetMouseY - currentMouseY) > 0.002
      ) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const requestTick = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const handleResize = () => {
      measurePositions();
      requestTick();
    };

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      requestTick();
    };

    measurePositions();
    requestTick();

    // Re-medir cuando terminen de cargar imágenes para exactitud milimétrica
    const images = Array.from(root.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", handleResize, { once: true });
      }
    });

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      revealObserver?.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      images.forEach((img) => img.removeEventListener("load", handleResize));
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [containerRef]);
}
