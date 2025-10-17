import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Droplet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Essence Decants
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience luxury fragrances through our curated collection of authentic decants. Discover your signature scent without committing to a full bottle.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Authentic Perfumes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Genuine fragrances sourced directly from authorized retailers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Secure Packaging
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Premium bottles and careful packaging ensure perfect preservation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Custom Sizes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose from various sizes to suit your preferences and needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to explore?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Browse our collection of premium fragrances and find your perfect match.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 text-sm font-medium text-gray-900 border border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors"
          >
            View All Fragrances
          </Link>
        </div>
      </section>
    </div>
  );
}