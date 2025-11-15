import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Perfumes from "./pages/Perfumes";
import FAQ from "./pages/FAQ";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main className="pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfumes" element={<Perfumes />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
