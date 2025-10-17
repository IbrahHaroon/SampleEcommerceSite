import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import PerfumeDecantShop from './pages/Perfumes';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Navigation cartItemCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<PerfumeDecantShop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}
