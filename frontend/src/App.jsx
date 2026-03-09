import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Perfumes from "./pages/Perfumes";
import PerfumeDetail from "./pages/PerfumeDetail";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen text-gray-200 border-x border-blue-500/40 max-w-screen-2xl mx-auto shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <Navigation />
          <main className="pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/perfumes" element={<Perfumes />} />
              <Route path="/perfumes/:id" element={<PerfumeDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
