import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      } catch {
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
    <div className="text-gray-200">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-24">
        <div className="space-y-8">
          <h1 className="text-4xl font-light leading-tight text-gray-100 md:text-5xl">
            Perfumes
          </h1>

          <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-sm">
              <label
                htmlFor="perfume-search"
                className="text-[10px] uppercase tracking-[0.4em] text-gray-400"
              >
                Search
              </label>
              <input
                id="perfume-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name or brand"
                className="mt-2 w-full rounded-full border border-gray-400/30 bg-transparent px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-gray-400/20 p-6"
              >
                <div className="h-48 rounded-2xl bg-gray-400/10" />
                <div className="mt-6 h-6 w-3/4 rounded bg-gray-400/20" />
                <div className="mt-3 h-4 w-1/2 rounded bg-gray-400/10" />
              </div>
            ))}

          {!loading && error && (
            <div className="rounded-3xl border border-gray-400/20 p-6 text-sm text-gray-400">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((perfume) => {
              const imageSrc = resolvePerfumeImage(perfume);
              const pricePerMl = perfume.price_per_ml_cents ?? 700;
              const minSize = perfume.allowed_sizes?.[0];
              const fromPrice = minSize
                ? `From $${((minSize * pricePerMl) / 100).toFixed(2)}`
                : null;

              return (
                <Link
                  key={perfume.id}
                  to={`/perfumes/${perfume.id}`}
                  className="group flex flex-col rounded-3xl border border-gray-400/20 p-6 transition hover:border-gray-400/50"
                >
                  <div className="overflow-hidden rounded-2xl border border-gray-400/20">
                    <img
                      src={imageSrc}
                      alt={`${perfume.name} bottle`}
                      className="h-60 w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6 space-y-2 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
                      {perfume.brand}
                    </p>
                    <h2 className="text-2xl font-light text-gray-100">{perfume.name}</h2>
                    {perfume.concentration && (
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                        {perfume.concentration}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      {perfume.allowed_sizes
                        ? perfume.allowed_sizes.map((s) => `${s} ml`).join(" / ")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    {fromPrice && (
                      <span className="text-sm text-gray-400">{fromPrice}</span>
                    )}
                    <span className="ml-auto text-xs uppercase tracking-[0.4em] text-gray-400 group-hover:text-gray-200 transition">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-12 text-sm text-gray-400">
            Nothing matched that search. Clear the filter to see everything.
          </p>
        )}
      </section>
    </div>
  );
}
