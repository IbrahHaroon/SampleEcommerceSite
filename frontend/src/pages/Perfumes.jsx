import React, { useEffect, useState } from "react";
import { getPerfumes } from "../api";
import { resolvePerfumeImage } from "../utils/perfumeImages";

export default function Perfumes() {
  const [perfumes, setPerfumes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPerfumes() {
      try {
        const data = await getPerfumes();
        setPerfumes(data);
      } catch (err) {
        setError("Unable to reach the perfume catalog right now.");
      } finally {
        setLoading(false);
      }
    }
    loadPerfumes();
  }, []);

  const filtered = perfumes.filter((perfume) => {
    const text = `${perfume?.name ?? ""} ${perfume?.brand ?? ""}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  return (
    <div className="bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-24">
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Full Collection
            </p>
            <h1 className="mt-4 text-4xl font-light leading-tight text-white md:text-5xl">
              Every perfume, side by side.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              This grid pours directly from the FastAPI backend, so your scroll
              reflects live inventory. Take your time and explore.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-sm">
              <label
                htmlFor="perfume-search"
                className="text-[10px] uppercase tracking-[0.4em] text-white/50"
              >
                Search
              </label>
              <input
                id="perfume-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a name or brand"
                className="mt-2 w-full rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">
              Scroll to view products below
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-white/10 p-6"
              >
                <div className="h-48 rounded-2xl bg-white/5" />
                <div className="mt-6 h-6 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-4 w-1/2 rounded bg-white/5" />
              </div>
            ))}

          {!loading && error && (
            <div className="rounded-3xl border border-white/10 p-6 text-sm text-white/70">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((perfume) => {
              const imageSrc = resolvePerfumeImage(perfume);
              return (
                <article
                  key={perfume.id}
                  className="flex flex-col rounded-3xl border border-white/10 p-6"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={imageSrc}
                      alt={`${perfume.name} bottle`}
                      className="h-60 w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6 space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                      {perfume.brand}
                    </p>
                    <h2 className="text-2xl font-light text-white">
                      {perfume.name}
                    </h2>
                    <p className="text-sm text-white/60">
                      Available sizes:{" "}
                      {perfume.allowed_sizes
                        ? perfume.allowed_sizes
                            .map((size) => `${size} ml`)
                            .join(" / ")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-white/50">
                      Total remaining: {perfume.total_ml_available} ml
                    </p>
                  </div>
                  <div className="mt-auto pt-6 text-xs uppercase tracking-[0.4em] text-white/50">
                    Backend Linked
                  </div>
                </article>
              );
            })}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-12 text-sm text-white/50">
            Nothing matched that search. Clear the filter to see everything.
          </p>
        )}
      </section>
    </div>
  );
}
