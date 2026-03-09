import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Loader } from "lucide-react";
import { getPerfume, createCheckoutSession } from "../api";
import { resolvePerfumeImage } from "../utils/perfumeImages";
import { useAuth } from "../context/AuthContext";

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PerfumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPerfume(id);
        setPerfume(data);
        setSelectedSize(data.allowed_sizes?.[0] ?? null);
      } catch {
        setError("Could not find this perfume.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCheckout = async () => {
    if (!selectedSize || !perfume) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const { url } = await createCheckoutSession(
        { perfume_id: perfume.id, size_ml: selectedSize, quantity },
        session
      );
      window.location.href = url;
    } catch (err) {
      setCheckoutError(err.message);
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error || !perfume) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-gray-400">{error ?? "Perfume not found."}</p>
        <Link
          to="/perfumes"
          className="mt-6 inline-block text-xs uppercase tracking-[0.4em] text-gray-200 hover:text-gray-400 transition"
        >
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const imageSrc = resolvePerfumeImage(perfume);
  const unitCents = selectedSize ? Math.round(selectedSize * perfume.price_per_ml_cents) : 0;
  const totalCents = unitCents * quantity;

  return (
    <div className="text-gray-200">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gray-400 hover:text-gray-200 transition"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl border border-gray-400/20">
            <img
              src={imageSrc}
              alt={`${perfume.name} by ${perfume.brand}`}
              className="h-[480px] w-full object-cover object-center"
            />
          </div>

          {/* Info + purchase */}
          <div className="flex flex-col space-y-8">
            {/* Title block */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
                {perfume.brand}
              </p>
              {perfume.concentration && (
                <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-gray-500">
                  {perfume.concentration}
                </p>
              )}
              <h1 className="mt-4 text-4xl font-light leading-tight text-gray-100">
                {perfume.name}
              </h1>
            </div>

            {/* Description */}
            {perfume.description && (
              <p className="text-sm leading-relaxed text-gray-400">{perfume.description}</p>
            )}

            {/* Notes */}
            {perfume.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
                  Fragrance Notes
                </p>
                <p className="mt-2 text-sm text-gray-400">{perfume.notes}</p>
              </div>
            )}

            {/* Stock */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Availability</p>
              <p className="mt-2 text-sm text-gray-400">
                {perfume.total_ml_available > 0
                  ? `${perfume.total_ml_available} ml remaining`
                  : "Out of stock"}
              </p>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Select Size</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {perfume.allowed_sizes.map((size) => {
                  const price = formatPrice(Math.round(size * perfume.price_per_ml_cents));
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-5 py-2 text-sm transition ${
                        selectedSize === size
                          ? "border-gray-200 bg-gray-200 text-gray-900"
                          : "border-gray-400/30 text-gray-400 hover:border-gray-300 hover:text-gray-200"
                      }`}
                    >
                      {size} ml — {price}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Quantity</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400/30 text-gray-200 hover:border-gray-300 transition"
                >
                  −
                </button>
                <span className="w-6 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400/30 text-gray-200 hover:border-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total + buy */}
            <div className="border-t border-gray-400/20 pt-8">
              {selectedSize && (
                <p className="mb-5 text-2xl font-light text-gray-100">
                  {formatPrice(totalCents)}
                </p>
              )}

              {checkoutError && (
                <p className="mb-4 text-sm text-red-400">{checkoutError}</p>
              )}

              {perfume.total_ml_available > 0 ? (
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || !selectedSize}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-gray-200 py-4 text-sm uppercase tracking-[0.3em] text-gray-900 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  {checkoutLoading ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <ShoppingBag size={16} />
                  )}
                  {checkoutLoading ? "Redirecting…" : "Purchase"}
                </button>
              ) : (
                <p className="text-center text-sm uppercase tracking-[0.3em] text-gray-500">
                  Out of Stock
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
