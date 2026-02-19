import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPerfumes } from "../api";
import { resolvePerfumeImage } from "../utils/perfumeImages";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPopular() {
      try {
        const data = await getPerfumes();
        setPopular(data.slice(0, 4));
      } catch (err) {
        setError("We could not reach the atelier just yet.");
      } finally {
        setLoading(false);
      }
    }
    loadPopular();
  }, []);

  return (
    <div className="bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-12 md:grid-cols-[minmax(0,1fr)_420px] md:pt-24 lg:gap-20">
        <div className="space-y-10">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Scent Library
          </p>
          <div className="space-y-6">
            <h1 className="text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
              Minimal perfume wardrobes, curated in milliliters.
            </h1>
            <p className="max-w-xl text-base text-white/70 lg:text-lg">
              Atelier Noir welcomes you to a darker, calmer browsing experience.
              Scroll to explore a rotating list of popular perfumes, then step
              into the full catalog to find the blend that speaks to you.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/perfumes"
              className="rounded-full border border-white px-6 py-3 text-sm uppercase tracking-[0.3em]"
            >
              View Catalog
            </Link>
            <Link
              to="/faq"
              className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] text-white/70 hover:text-white"
            >
              FAQ
            </Link>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Scroll Down For Popular Perfumes
          </p>
        </div>
        <div className="relative">
          <div className="h-[420px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50">
                  Placeholder
                </p>
                <h2 className="mt-4 text-2xl font-light text-white/90">
                  Image reserved for hero artwork
                </h2>
              </div>
              <div className="space-y-3 text-sm text-white/60">
                <p>
                  Use this canvas for campaign imagery or photography. Keep the
                  palette monochrome to stay on brand.
                </p>
                <span className="inline-flex w-fit tracking-[0.5em] text-[10px] text-white/50">
                  1400 &times; 900
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                Popular right now
              </p>
              <h2 className="mt-4 text-3xl font-light text-white">
                Clean silhouettes for every mood.
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Scroll to sample the most requested decants from our backend
                catalog.
              </p>
            </div>
            <Link
              to="/perfumes"
              className="text-xs uppercase tracking-[0.4em] text-white/70 hover:text-white"
            >
              View All
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <>
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse rounded-2xl border border-white/10 p-6"
                  >
                    <div className="h-6 w-1/2 rounded bg-white/10" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-white/5" />
                    <div className="mt-8 h-32 rounded-xl bg-white/5" />
                  </div>
                ))}
              </>
            )}
            {!loading && error && (
              <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/70">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              popular.map((perfume) => {
                const imageSrc = resolvePerfumeImage(perfume);
                return (
                  <Link
                    key={perfume.id}
                    to={`/perfumes/${perfume.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 p-6 transition hover:border-white/30"
                  >
                    <div>
                      <div className="overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={imageSrc}
                          alt={`${perfume.name} bottle`}
                          className="h-56 w-full object-cover object-center transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/50">
                        {perfume.brand}
                      </p>
                      <h3 className="mt-4 text-2xl font-light text-white">
                        {perfume.name}
                      </h3>
                      <p className="mt-3 text-sm text-white/60">
                        {perfume.allowed_sizes
                          ? perfume.allowed_sizes.map((s) => `${s} ml`).join(" / ")
                          : "N/A"}
                      </p>
                    </div>
                    <span className="mt-10 text-xs uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition">
                      Inspect →
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
