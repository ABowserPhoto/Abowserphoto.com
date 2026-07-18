type FooterSectionProps = {
  accentColor: string;
};

export default function FooterSection({ accentColor }: FooterSectionProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">A. Bowser Photography</p>
          <p className="text-sm text-slate-600">hello@abowserphoto.com | +49 170 000 0000</p>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: accentColor }}>
            Instagram
          </a>
          <a href="https://vimeo.com" target="_blank" rel="noreferrer" style={{ color: accentColor }}>
            Vimeo
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: accentColor }}>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
