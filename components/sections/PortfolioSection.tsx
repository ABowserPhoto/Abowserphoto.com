"use client";

import { useState } from "react";

type PortfolioSectionProps = {
  title: string;
  images: string[];
  accentColor: string;
};

export default function PortfolioSection({ title, images, accentColor }: PortfolioSectionProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        <span className="text-sm font-medium" style={{ color: accentColor }}>
          Tap an image to view
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setActiveImage(image)}
            className="overflow-hidden rounded-xl border border-slate-200 text-left"
            aria-label={`Open portfolio image ${index + 1}`}
          >
            <img src={image} alt={`Portfolio ${index + 1}`} className="h-36 w-full object-cover sm:h-44" />
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage(null)}
        >
          <img src={activeImage} alt="Expanded portfolio image" className="max-h-[85vh] w-auto max-w-full rounded-xl" />
        </div>
      ) : null}
    </section>
  );
}
