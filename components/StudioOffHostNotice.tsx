import LightPageFrame from "./LightPageFrame";
import type { Locale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { HAGEN_ADDRESS } from "../lib/contact";
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
            ? `Bewerbungsfotos und biometrische Passbilder bekommen Sie im Fotostudio Hagen, ${HAGEN_ADDRESS.street}. Mehr Infos und Termin:`
            : `Application photos and biometric passport photos are available at the Hagen studio, ${HAGEN_ADDRESS.street}. More info and a time:`}
        </p>
        <p>
          <a href={href} className="underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]">
            {de ? "Bewerbungsfotos & Passbilder" : "Application & passport photos"}
          </a>
        </p>
      </div>
    </LightPageFrame>
  );
}
