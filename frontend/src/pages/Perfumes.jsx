// src/pages/Perfumes.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Droplet, AlertCircle, Check, X } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function PerfumeDecantShop() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/perfumes`);
      if (!response.ok) throw new Error('Failed to fetch perfumes');
      const data = await response.json();
      setPerfumes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (perfume, size) => {
    const cartItem = {
      perfume_id: perfume.id,
      name: perfume.name,
      brand: perfume.brand,
      size: size,
      price: size * 15 // $15 per ml
    };
    setCart([...cart, cartItem]);
    showNotification(`Added ${size}ml of ${perfume.name} to cart`);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    showNotification('Item removed from cart', 'info');
  };

  const checkout = async (item) => {
    try {
      setIsCheckingOut(true);
      const response = await fetch(`${API_BASE}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfume_id: item.perfume_id,
          size: item.size
        })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const data = await response.json();
      window.location.href = data.checkout_url;
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="w-16 h-16 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading fragrances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : 
           notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : 
           <Droplet className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Essence Decants
              </h1>
              <p className="text-gray-600 text-sm mt-1">Luxury fragrances by the milliliter</p>
            </div>
            <div className="relative">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Perfumes Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Fragrances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {perfumes.map((perfume) => (
                <div key={perfume.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Droplet className="w-20 h-20 text-white opacity-80" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">{perfume.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{perfume.brand}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {perfume.total_ml_available}ml in stock
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Select size:</p>
                      <div className="flex gap-2 flex-wrap">
                        {perfume.allowed_sizes?.map((size) => (
                          <button
                            key={size}
                            onClick={() => addToCart(perfume, size)}
                            disabled={size > perfume.total_ml_available}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              size > perfume.total_ml_available
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-500 text-white hover:bg-purple-600'
                            }`}
                          >
                            {size}ml · ${size * 15}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Your Cart
              </h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.size}ml</span>
                        <span className="font-bold text-purple-600">${item.price}</span>
                      </div>
                      <button
                        onClick={() => checkout(item)}
                        disabled={isCheckingOut}
                        className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                      >
                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">
                        ${cart.reduce((sum, item) => sum + item.price, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import { getPerfumes, createPerfume, deletePerfume } from "../api";

export default function Perfumes() {
  const [perfumes, setPerfumes] = useState([]);
  const [form, setForm] = useState({ name: "", brand: "", total_ml_available: 0, allowed_sizes: [] });

  useEffect(() => {
    loadPerfumes();
  }, []);

  async function loadPerfumes() {
    try {
      const data = await getPerfumes();
      setPerfumes(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await createPerfume(form);
      setForm({ name: "", brand: "", total_ml_available: 0, allowed_sizes: [] });
      loadPerfumes();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePerfume(id);
      loadPerfumes();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Perfumes</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total mL"
          value={form.total_ml_available}
          onChange={(e) => setForm({ ...form, total_ml_available: parseFloat(e.target.value) })}
        />
        <button type="submit">Add Perfume</button>
      </form>

      <ul>
        {perfumes.map((p) => (
          <li key={p.id}>
            {p.name} ({p.brand}) — {p.total_ml_available} mL
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

