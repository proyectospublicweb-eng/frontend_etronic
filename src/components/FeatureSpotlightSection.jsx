import { IconArrowRight } from "./LandingIcons";

function SpotlightAction({ action, variant }) {
  const isPrimary = variant === "primary";
  const baseClass = isPrimary
    ? "crescendo-btn-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(93,74,255,0.45)] transition duration-300 hover:-translate-y-0.5 sm:w-auto"
    : "inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#60a5fa] hover:bg-white/10 sm:w-auto";

  const content = (
    <>
      <span>{action.label}</span>
      {isPrimary && <IconArrowRight className="h-4 w-4 shrink-0" />}
    </>
  );

  if (action.href) {
    return (
      <a href={action.href} className={baseClass}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={baseClass}>
      {content}
    </button>
  );
}

/**
 * Reusable dark-navy spotlight banner rendered on the landing page for flagship services
 * (AI implementation and Interactive Project Planner).
 */
function FeatureSpotlightSection({
  id,
  image,
  imageAlt,
  imageBadge,
  imageSide = "left",
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  titlePrefix,
  titleHighlight,
  titleSuffix,
  description,
  highlights,
  primaryCta,
  secondaryCta,
}) {
  const isImageRight = imageSide === "right";

  return (
    <section
      id={id}
      data-reveal
      className="relative mx-auto mb-12 max-w-6xl px-4 pb-2 sm:mb-16 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-[#061238]/95 via-[#030b26]/95 to-[#0b1038]/95 p-5 shadow-2xl shadow-black/35 sm:p-8 lg:p-10">
        <div
          data-parallax-section="-0.16"
          className="parallax-tech-grid pointer-events-none absolute -inset-16 opacity-50"
        />
        <div
          className={`pointer-events-none absolute -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl ${
            isImageRight ? "-right-16" : "-left-16"
          }`}
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10">
          {/* Columna Visual 3D */}
          <div className={`lg:col-span-6 ${isImageRight ? "lg:order-2" : ""}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#040a21] shadow-[0_18px_45px_rgba(0,0,0,0.5)] sm:rounded-3xl">
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#040a21]/85 via-[#040a21]/30 to-transparent" />
              <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-white/15 bg-[#040a21]/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-2 sm:text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span className="truncate">{imageBadge}</span>
              </div>
            </div>
          </div>

          {/* Columna Informativa Concisa */}
          <div className={`min-w-0 lg:col-span-6 ${isImageRight ? "lg:order-1" : ""}`}>
            <div className="mb-3.5 inline-flex max-w-full items-center gap-2 rounded-2xl border border-[#60a5fa]/30 bg-[#3b82f6]/15 px-3 py-1 text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#60a5fa] sm:rounded-full sm:px-3.5 sm:text-xs sm:tracking-wider">
              <EyebrowIcon className="h-4 w-4 shrink-0" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-display mb-3.5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
              {titlePrefix}
              <span className="crescendo-text-gradient">{titleHighlight}</span>
              {titleSuffix}
            </h2>

            <p className="mb-5 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              {description}
            </p>

            <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                >
                  <p className="font-display text-xs font-bold leading-snug text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-300/90">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <SpotlightAction action={primaryCta} variant="primary" />
              <SpotlightAction action={secondaryCta} variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSpotlightSection;
