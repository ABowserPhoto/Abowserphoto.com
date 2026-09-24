"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";

export type ServiceScrollItem = {
  title: string;
  description: string;
  imageUrl: string | null;
};

type ServicesScrollProps = {
  services: ServiceScrollItem[];
  themeColor: string;
};

const textVariants = {
  enter: {
    x: "-100%",
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: "100%",
    opacity: 0,
  },
};

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

const ServicesScroll = forwardRef<HTMLElement, ServicesScrollProps>(function ServicesScroll(
  { services, themeColor },
  forwardedRef
) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = services.length;

  useEffect(() => {
    assignRef(forwardedRef, containerRef.current);
    return () => assignRef(forwardedRef, null);
  }, [forwardedRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (count <= 0) return;
    const nextIndex = Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  if (count === 0) {
    return null;
  }

  const activeService = services[activeIndex];

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative z-30 w-full bg-black"
      style={{ height: `${Math.max(count, 1) * 100}dvh` }}
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-x-hidden">
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-20 sm:gap-5 sm:px-8 sm:pb-8 md:block md:pb-6">
          {/* Centered media — stacked layers cross-fade via opacity */}
          <div className="relative min-h-0 w-full max-w-5xl flex-1 md:absolute md:inset-0 md:m-auto md:h-full md:max-h-[70dvh] md:flex-none">
            <div className="relative mx-auto h-full max-h-[42dvh] w-full sm:max-h-[50dvh] md:max-h-none">
              {services.map((service, index) => (
                <div
                  key={`${service.title}-${index}`}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: index === activeIndex ? 1 : 0,
                    zIndex: index === activeIndex ? 2 : 1,
                    pointerEvents: index === activeIndex ? "auto" : "none",
                  }}
                  aria-hidden={index !== activeIndex}
                >
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-contain"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Glassmorphism copy card — grows with content; no fixed height clipping */}
          <div className="pointer-events-none relative z-20 flex w-full shrink-0 justify-center md:absolute md:inset-x-auto md:bottom-auto md:left-[max(1.25rem,calc(50%-30rem))] md:top-1/2 md:w-[min(24rem,42vw)] md:-translate-y-1/2 md:justify-start">
            <div
              className="pointer-events-auto h-auto w-full max-w-md max-h-[46dvh] overflow-x-hidden overflow-y-auto rounded-2xl border border-white/25 px-5 pb-7 pt-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:max-w-lg sm:px-6 sm:pb-8 sm:pt-6 md:max-h-none md:max-w-none md:overflow-visible"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p
                className="font-medium uppercase tracking-[0.35em] text-white/70"
                style={{ fontSize: "clamp(0.625rem, 1.6vw, 0.6875rem)" }}
              >
                Services
                <span className="ml-2 text-white/45">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </p>

              <div className="relative mt-3 h-auto overflow-x-hidden overflow-y-visible">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeService.title}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <span
                      className="mb-3 inline-block h-1 w-12 rounded-full"
                      style={{ backgroundColor: themeColor }}
                      aria-hidden="true"
                    />
                    <h2
                      className="font-semibold leading-snug tracking-tight text-white"
                      style={{ fontSize: "clamp(1.05rem, 2.8vw, 1.5rem)" }}
                    >
                      {activeService.title}
                    </h2>
                    <p
                      className="mt-2 leading-relaxed text-white/80"
                      style={{ fontSize: "clamp(0.8125rem, 2.1vw, 0.9375rem)" }}
                    >
                      {activeService.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 pt-1">
                <div className="flex gap-1.5" aria-hidden="true">
                  {services.map((_, index) => (
                    <span
                      key={index}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: index === activeIndex ? "1.25rem" : "0.35rem",
                        backgroundColor:
                          index === activeIndex ? themeColor : "rgba(255,255,255,0.35)",
                      }}
                    />
                  ))}
                </div>
                <Link
                  href="/booking"
                  className="shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ServicesScroll;
