import LightPageFrame from "./LightPageFrame";
import type { Locale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { portalCategoryUrl } from "../lib/subdomains";

type StudioOffHostNoticeProps = {
  locale: Locale;
  dictionary: Dictionary;
  logoUrl: string | null;
  publicHost?: string;
};

export default function StudioOffHostNotice({
  locale,
  dictionary,
  logoUrl,
  publicHost,
}: StudioOffHostNoticeProps) {
  const de = locale === "de";
  const href = portalCategoryUrl("studio", { host: publicHost, locale });

  return (
    <LightPageFrame locale={locale} dictionary={dictionary} logoUrl={logoUrl}>
      <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
        {de ? "Bewerbungsfotos und Passbilder" : "Application photos and passport photos"}
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">
        <p>
          {de
            ? "Bewerbungsfotos und biometrische Passbilder entstehen im Fotostudio Hagen. Sie gehören nicht zu den Arbeiten auf dieser Website."
            : "Application photos and biometric passport photos are made at the Hagen studio. They are not part of the work on this website."}
        </p>
        <p>
          <a href={href} className="underline decoration-[#322B2B]/40 underline-offset-[3px] hover:opacity-70">
            {de ? "Zum Fotostudio Hagen" : "Go to the Hagen studio page"}
          </a>
        </p>
      </div>
    </LightPageFrame>
  );
}
