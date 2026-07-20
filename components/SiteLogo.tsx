"use client";

import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  logoUrl: string | null;
  label?: string;
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
};

export default function SiteLogo({
  logoUrl,
  label,
  className = "flex items-center gap-2.5 text-[#322B2B]",
  imageClassName = "h-10 w-10 object-contain",
  labelClassName = "text-xs font-semibold tracking-wide sm:text-sm",
}: SiteLogoProps) {
  const isSvg = logoUrl?.toLowerCase().endsWith(".svg");

  return (
    <Link href="/" className={className}>
      {logoUrl ? (
        isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Aaron Bowser Photography" className={imageClassName} />
        ) : (
          <Image
            src={logoUrl}
            alt="Aaron Bowser Photography"
            width={40}
            height={40}
            className={imageClassName}
            priority
          />
        )
      ) : (
        <span
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#322B2B]/35 bg-white text-[10px] font-semibold tracking-[0.12em]"
          aria-hidden="true"
        >
          LOGO
        </span>
      )}
      {label ? <span className={labelClassName}>{label}</span> : null}
    </Link>
  );
}
