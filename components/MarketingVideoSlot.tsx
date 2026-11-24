import Image from "next/image";
import { MARKETING_VIDEO } from "../lib/marketingVideo";

type MarketingVideoSlotProps = {
  alt: string;
};

/** Poster until `MARKETING_VIDEO.src` is set, then the film. */
export default function MarketingVideoSlot({ alt }: MarketingVideoSlotProps) {
  if (!MARKETING_VIDEO.src) {
    return (
      <div className="relative mt-6 aspect-video w-full overflow-hidden bg-black">
        <Image src={MARKETING_VIDEO.poster} alt={alt} fill sizes="(max-width: 768px) 92vw, 40rem" className="object-cover" />
      </div>
    );
  }

  return (
    <video
      className="mt-6 aspect-video w-full bg-black object-cover"
      src={MARKETING_VIDEO.src}
      poster={MARKETING_VIDEO.poster}
      controls
      playsInline
      preload="metadata"
    />
  );
}
