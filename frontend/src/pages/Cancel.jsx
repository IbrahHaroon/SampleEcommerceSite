import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function Cancel() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center text-gray-200">
      <XCircle size={48} className="text-gray-500" />
      <h1 className="mt-6 text-3xl font-light text-gray-100">Payment Cancelled.</h1>
      <p className="mt-4 max-w-sm text-sm text-gray-400">
        No charges were made. Return to the catalog whenever you're ready.
      </p>
      <Link
        to="/perfumes"
        className="mt-10 rounded-full border border-gray-300/60 px-6 py-3 text-xs uppercase tracking-[0.4em] text-gray-200 transition hover:border-gray-100 hover:text-gray-100"
      >
        Back to Catalog
      </Link>
    </div>
  );
}
