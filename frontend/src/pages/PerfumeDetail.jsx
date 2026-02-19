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
      const unitAmountCents = Math.round(selectedSize * perfume.price_per_ml_cents);
      const { url } = await createCheckoutSession(
        { perfume_id: perfume.id, size_ml: selectedSize, quantity, unit_amount_cents: unitAmountCents },
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
      <div className="flex min-h-[70vh] items-center justify-center bg-black">
        <Loader className="animate-spin text-white/30" size={32} />
      </div>
    );
  }

  if (error || !perfume) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-white/60">{error ?? "Perfume not found."}</p>
        <Link
          to="/perfumes"
          className="mt-6 inline-block text-xs uppercase tracking-[0.4em] text-white hover:text-white/60 transition"
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
    <div className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/50 hover:text-white transition"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl border border-white/10">
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
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/50">
                {perfume.brand}
              </p>
              {perfume.concentration && (
                <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-white/30">
                  {perfume.concentration}
                </p>
              )}
              <h1 className="mt-4 text-4xl font-light leading-tight text-white">
                {perfume.name}
              </h1>
            </div>

            {/* Description */}
            {perfume.description && (
              <p className="text-sm leading-relaxed text-white/70">{perfume.description}</p>
            )}

            {/* Notes */}
            {perfume.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                  Fragrance Notes
                </p>
                <p className="mt-2 text-sm text-white/70">{perfume.notes}</p>
              </div>
            )}

            {/* Stock */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Availability</p>
              <p className="mt-2 text-sm text-white/60">
                {perfume.total_ml_available > 0
                  ? `${perfume.total_ml_available} ml remaining`
                  : "Out of stock"}
              </p>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Select Size</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {perfume.allowed_sizes.map((size) => {
                  const price = formatPrice(Math.round(size * perfume.price_per_ml_cents));
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-5 py-2 text-sm transition ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/60 hover:border-white hover:text-white"
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
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Quantity</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-white transition"
                >
                  −
                </button>
                <span className="w-6 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total + buy */}
            <div className="border-t border-white/10 pt-8">
              {selectedSize && (
                <p className="mb-5 text-2xl font-light text-white">
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
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-white bg-white py-4 text-sm uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:opacity-40"
                >
                  {checkoutLoading ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <ShoppingBag size={16} />
                  )}
                  {checkoutLoading ? "Redirecting…" : "Purchase"}
                </button>
              ) : (
                <p className="text-center text-sm uppercase tracking-[0.3em] text-white/30">
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
