type ServicesSectionProps = {
  items: string[];
  accentColor: string;
};

export default function ServicesSection({ items, accentColor }: ServicesSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Services</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service) => (
          <article
            key={service}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            style={{ borderTop: `4px solid ${accentColor}` }}
          >
            <h3 className="text-lg font-semibold text-slate-900">{service}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Custom sessions tailored to your brand vision, usage, and timeline.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
