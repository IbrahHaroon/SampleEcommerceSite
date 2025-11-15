import React from "react";

export default function About() {
  return (
    <div className="bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-12 md:grid-cols-[minmax(0,1fr)_420px] md:pt-24">
        <div className="space-y-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            About
          </p>
          <h1 className="text-4xl font-light leading-tight text-white md:text-5xl">
            Built to highlight rare perfumes with clarity.
          </h1>
          <p className="text-sm text-white/70">
            We keep the interface pared down so the backend data can glow
            through. Everything you see originates from craftsmen pouring small
            batches in a real studio environment, verified by the FastAPI
            service that powers inventory and checkout.
          </p>
          <p className="text-sm text-white/60">
            Replace this copy with your story later. For now, treat it as
            placeholder text that sets the tone: respectful, focused, and
            monochrome.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-t from-white/10 to-transparent p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                Placeholder
              </p>
              <h2 className="mt-4 text-2xl font-light text-white">
                About page imagery lives here.
              </h2>
            </div>
            <div className="space-y-3 text-sm text-white/60">
              <p>
                We reserved this block for lifestyle photography or a team shot.
              </p>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                1200 x 1350
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
