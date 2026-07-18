type AboutSectionProps = {
  about: string;
  headshot: string;
  accentColor: string;
};

export default function AboutSection({ about, headshot, accentColor }: AboutSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[160px_1fr] lg:px-8">
        <div className="flex justify-center md:justify-start">
          <img
            src={headshot}
            alt="Photographer headshot"
            className="h-36 w-36 rounded-full border-4 object-cover"
            style={{ borderColor: `${accentColor}55` }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">About Me</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">{about}</p>
        </div>
      </div>
    </section>
  );
}
