import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center text-gray-200">
      <CheckCircle size={48} className="text-gray-400" />
      <h1 className="mt-6 text-3xl font-light text-gray-100">Order Confirmed.</h1>
      <p className="mt-4 max-w-sm text-sm text-gray-400">
        Your payment was successful. We'll begin preparing your decant and reach out
        with tracking information shortly.
      </p>
      <Link
        to="/perfumes"
        className="mt-10 rounded-full border border-gray-300/60 px-6 py-3 text-xs uppercase tracking-[0.4em] text-gray-200 transition hover:border-gray-100 hover:text-gray-100"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
