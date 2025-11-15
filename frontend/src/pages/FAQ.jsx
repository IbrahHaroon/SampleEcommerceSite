import React from "react";

const QUESTIONS = [
  {
    question: "Are these perfumes authentic?",
    answer:
      "Every decant is poured from bottles sourced through authorized retailers, logged in the backend, and traceable through our database.",
  },
  {
    question: "How long does fulfillment take?",
    answer:
      "Expect a 24 hour preparation window so we can decant, label, and pack with care. Shipping speed depends on the carrier you select.",
  },
  {
    question: "Can I request a perfume that is not listed?",
    answer:
      "Absolutely. Submit a request via support and we will add the scent to the backend queue if we can secure an authentic bottle.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Checkout runs through the backend FastAPI + Stripe integration, so any major card works. No payment data touches the frontend.",
  },
];

export default function FAQ() {
  return (
    <div className="bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:pt-24">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            FAQ
          </p>
          <h1 className="text-4xl font-light text-white md:text-5xl">
            Placeholder answers for curious noses.
          </h1>
          <p className="max-w-2xl text-sm text-white/60">
            Swap these responses with production-ready copy later. The layout is
            designed to stay calm against the all-black canvas.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {QUESTIONS.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl border border-white/10 p-6"
            >
              <h2 className="text-lg uppercase tracking-[0.3em] text-white">
                {item.question}
              </h2>
              <p className="mt-4 text-sm text-white/60">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
