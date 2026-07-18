type HeroSectionProps = {
  title: string;
  tagline: string;
  imageUrl: string;
  accentColor: string;
};

export default function HeroSection({ title, tagline, imageUrl, accentColor }: HeroSectionProps) {
  return (
    <section className="relative min-h-[62vh] overflow-hidden rounded-b-3xl">
      <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-900/40" />
      <div className="relative mx-auto flex min-h-[62vh] max-w-7xl items-end px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl rounded-2xl bg-black/35 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
            Featured Category
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base text-slate-100 sm:text-lg">{tagline}</p>
        </div>
      </div>
    </section>
  );
}
