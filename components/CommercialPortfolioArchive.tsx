"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import PortfolioGrid from "./PortfolioGrid";

type CommercialPortfolioArchiveProps = {
  images: string[];
  themeColor: string;
};

export default function CommercialPortfolioArchive({
  images,
  themeColor,
}: CommercialPortfolioArchiveProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          href="/commercial"
          className="inline-flex w-fit items-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 transition-colors duration-300 hover:text-[#F4F1ED]"
        >
          ← Back
        </Link>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">Commercial</p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-[#F4F1ED] sm:text-4xl lg:text-5xl">
            Commercial Archive
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            The complete commercial portfolio — every selected frame in one place.
          </p>
        </div>
      </header>

      <PortfolioGrid
        images={images}
        title="Commercial"
        themeColor={themeColor}
        onImageClick={setSelectedImage}
        label="Full Portfolio"
      />

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-md border border-white/30 bg-black/35 px-3 py-1.5 text-sm font-semibold text-white"
            >
              X
            </button>
            <motion.img
              src={selectedImage}
              alt="Selected portfolio image"
              className="max-h-[90vh] w-auto max-w-full rounded-xl object-contain"
              initial={{ scale: 0.86, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
