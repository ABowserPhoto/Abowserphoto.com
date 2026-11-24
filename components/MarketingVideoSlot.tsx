import { MARKETING_VIDEO } from "../lib/marketingVideo";

type MarketingVideoSlotProps = {
  alt: string;
};

/** Renders nothing until `MARKETING_VIDEO.src` is set, then the film. */
export default function MarketingVideoSlot({ alt }: MarketingVideoSlotProps) {
  if (!MARKETING_VIDEO.src) return null;

  return (
    <video
      className="mt-6 aspect-video w-full bg-black object-cover"
      src={MARKETING_VIDEO.src}
      poster={MARKETING_VIDEO.poster}
      controls
      playsInline
      preload="metadata"
      aria-label={alt}
    />
  );
}
