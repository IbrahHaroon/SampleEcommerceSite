import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            About Essence Decants
          </h1>
          
          <div className="space-y-6 text-gray-600">
            <p>
              Welcome to Essence Decants, your premier destination for authentic perfume decants. 
              We believe everyone should have the opportunity to experience luxury fragrances 
              without committing to a full bottle.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8">Our Story</h2>
            <p>
              Founded by fragrance enthusiasts, Essence Decants began with a simple mission: 
              to make high-end perfumes more accessible through carefully measured decants. 
              Our team's passion for perfumery drives us to provide the best possible service 
              and authentic products to our customers.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8">Our Promise</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>100% authentic fragrances sourced directly from authorized retailers</li>
              <li>Precise measurements and professional decanting process</li>
              <li>Secure packaging to ensure safe delivery</li>
              <li>Outstanding customer service</li>
              <li>Fair pricing and transparent policies</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8">Quality Guarantee</h2>
            <p>
              Every decant is carefully prepared in a clean environment using professional 
              tools. We stand behind the quality and authenticity of our products, and we're 
              committed to ensuring your complete satisfaction with every purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}