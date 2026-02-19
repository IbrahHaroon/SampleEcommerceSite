import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function Cancel() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-black px-6 text-center">
      <XCircle size={48} className="text-white/20" />
      <h1 className="mt-6 text-3xl font-light text-white">Payment Cancelled.</h1>
      <p className="mt-4 max-w-sm text-sm text-white/60">
        No charges were made. Return to the catalog whenever you're ready.
      </p>
      <Link
        to="/perfumes"
        className="mt-10 rounded-full border border-white px-6 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black"
      >
        Back to Catalog
      </Link>
    </div>
  );
}
