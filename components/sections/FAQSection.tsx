"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQItem[];
  accentColor: string;
};

export default function FAQSection({ faqs, accentColor }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">FAQ</h2>
      <div className="mt-8 space-y-3">
        {faqs.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <article key={item.question} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-slate-900"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                {item.question}
                <span style={{ color: accentColor }}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
