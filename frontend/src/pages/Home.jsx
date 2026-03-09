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
        setError("Could not load perfumes.");
      } finally {
        setLoading(false);
      }
    }
    loadPopular();
  }, []);

  return (
    <div className="text-gray-200">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pt-20 text-center">
        <h1 className="text-4xl font-light tracking-wide text-gray-100 md:text-5xl">
          Ibrahim's Samples
        </h1>
        <hr className="mx-auto mt-6 w-24 border-gray-400/40" />
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/perfumes"
            className="rounded-full border border-gray-300/60 px-6 py-3 text-sm uppercase tracking-[0.3em] text-gray-200 hover:border-gray-100 hover:text-gray-100 transition"
          >
            View Catalog
          </Link>
          <Link
            to="/faq"
            className="rounded-full border border-gray-400/30 px-6 py-3 text-sm uppercase tracking-[0.3em] text-gray-400 hover:text-gray-200 transition"
          >
            FAQ
          </Link>
        </div>
      </section>

      {/* Popular grid */}
      <section className="border-t border-gray-400/20 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-2xl font-light text-gray-100">Popular Perfumes</h2>
            <Link
              to="/perfumes"
              className="text-xs uppercase tracking-[0.4em] text-gray-400 hover:text-gray-200 transition"
            >
              View All
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <>
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse rounded-2xl border border-gray-400/20 p-6"
                  >
                    <div className="h-6 w-1/2 rounded bg-gray-400/20" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-gray-400/10" />
                    <div className="mt-8 h-32 rounded-xl bg-gray-400/10" />
                  </div>
                ))}
              </>
            )}
            {!loading && error && (
              <div className="rounded-2xl border border-gray-400/20 p-6 text-sm text-gray-400">
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
                    className="group flex flex-col justify-between rounded-2xl border border-gray-400/20 p-6 transition hover:border-gray-400/50"
                  >
                    <div>
                      <div className="overflow-hidden rounded-xl border border-gray-400/20">
                        <img
                          src={imageSrc}
                          alt={`${perfume.name} bottle`}
                          className="h-56 w-full object-cover object-center transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-gray-400">
                        {perfume.brand}
                      </p>
                      <h3 className="mt-2 text-2xl font-light text-gray-100">
                        {perfume.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-400">
                        {perfume.allowed_sizes
                          ? perfume.allowed_sizes.map((s) => `${s} ml`).join(" / ")
                          : "N/A"}
                      </p>
                    </div>
                    <span className="mt-8 text-xs uppercase tracking-[0.4em] text-gray-400 group-hover:text-gray-200 transition">
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
