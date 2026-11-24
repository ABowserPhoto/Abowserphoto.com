import Image from "next/image";
import { AWARD_LOGOS } from "../lib/awards";

type AwardsStripProps = {
  label: string;
};

/** Renders configured award logos. An empty config leaves the strip out. */
export default function AwardsStrip({ label }: AwardsStripProps) {
  if (AWARD_LOGOS.length === 0) return null;

  return (
    <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label={label}>
      {AWARD_LOGOS.map((logo) => {
        const image = (
          <Image src={logo.src} alt={logo.alt} width={120} height={48} className="h-10 w-auto object-contain" />
        );
        return (
          <li key={logo.src}>
            {logo.href ? (
              <a href={logo.href} className="block opacity-80 transition-opacity duration-300 hover:opacity-100">
                {image}
              </a>
            ) : (
              image
            )}
          </li>
        );
      })}
    </ul>
  );
}
