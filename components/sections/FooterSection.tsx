import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, formatStudioLine, STUDIOS } from "../../lib/site";

type FooterSectionProps = {
  accentColor: string;
};

export default function FooterSection({ accentColor }: FooterSectionProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">{BRAND_NAME}</p>
          <p className="text-sm text-slate-600">
            {CONTACT_EMAIL} | {CONTACT_PHONE_DISPLAY}
          </p>
          {STUDIOS.map((studio) => (
            <p key={studio.id} className="text-sm text-slate-600">
              {studio.nameEn}: {formatStudioLine(studio)}
            </p>
          ))}
        </div>
        <p className="text-sm font-semibold" style={{ color: accentColor }}>
          {BRAND_NAME}
        </p>
      </div>
    </footer>
  );
}
