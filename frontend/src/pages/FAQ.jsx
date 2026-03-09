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
      "Checkout runs through Stripe, so any major card works. No payment data touches the frontend.",
  },
];

export default function FAQ() {
  return (
    <div className="text-gray-200">
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:pt-24">
        <h1 className="text-4xl font-light text-gray-100 md:text-5xl">FAQ</h1>

        <div className="mt-12 space-y-6">
          {QUESTIONS.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl border border-gray-400/20 p-6"
            >
              <h2 className="text-lg uppercase tracking-[0.3em] text-gray-100">
                {item.question}
              </h2>
              <p className="mt-4 text-sm text-gray-400">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
