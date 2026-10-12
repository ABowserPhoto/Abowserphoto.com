"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  alt: string;
  priority?: boolean;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt,
  priority,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setContainerWidth(element.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-pan-y"
      aria-label={`${alt} before and after comparison`}
    >
      <Image
        src={afterImage}
        alt={`${alt} — after staging`}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        className="object-cover"
        priority={priority}
        draggable={false}
      />

      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative h-full" style={{ width: containerWidth > 0 ? containerWidth : "100%" }}>
          <Image
            src={beforeImage}
            alt={`${alt} — before staging`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            priority={priority}
            draggable={false}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.45)]"
        style={{ left: `${sliderPosition}%` }}
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 8L4 12L8 16M16 8L20 12L16 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={sliderPosition}
        onChange={(event) => setSliderPosition(Number(event.target.value))}
        aria-label="Drag to compare before and after staging"
        className="absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
