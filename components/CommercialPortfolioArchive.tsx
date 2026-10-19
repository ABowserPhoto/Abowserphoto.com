"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import PortfolioGrid, { type PortfolioImage } from "./PortfolioGrid";

type CommercialPortfolioArchiveProps = {
  images: PortfolioImage[];
  themeColor: string;
  locale: Locale;
  dictionary: Dictionary;
};

export default function CommercialPortfolioArchive({
  images,
  themeColor,
  locale,
  dictionary,
}: CommercialPortfolioArchiveProps) {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }

    if (selectedImage) {
      window.addEventListener("keydown", onEscape);
    }
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-black text-[#F4F1ED]">
      <header className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-4 pt-10 sm:px-6 lg:px-8">
        <Link
          href={withLocale("/commercial", locale)}
          className="inline-flex w-fit items-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 transition-colors duration-300 hover:text-[#F4F1ED]"
        >
          ← {dictionary.nav.back}
        </Link>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
            {dictionary.home.niches.commercial}
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-[#F4F1ED] sm:text-4xl lg:text-5xl">
            {dictionary.seo["commercial-portfolio"].title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            {dictionary.seo["commercial-portfolio"].description}
          </p>
        </div>
      </header>

      <PortfolioGrid
        images={images}
        title={dictionary.home.niches.commercial}
        themeColor={themeColor}
        onImageClick={setSelectedImage}
        label={dictionary.nav.fullPortfolio}
        countLabel={dictionary.nav.showcaseCount.replace("{count}", String(images.length))}
      />

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
