import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-black px-6 text-center">
      <CheckCircle size={48} className="text-white/60" />
      <h1 className="mt-6 text-3xl font-light text-white">Order Confirmed.</h1>
      <p className="mt-4 max-w-sm text-sm text-white/60">
        Your payment was successful. We'll begin preparing your decant and reach out
        with tracking information shortly.
      </p>
      <Link
        to="/perfumes"
        className="mt-10 rounded-full border border-white px-6 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
