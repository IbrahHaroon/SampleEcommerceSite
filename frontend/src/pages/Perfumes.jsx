// src/pages/Perfumes.jsx
import { useEffect, useState } from "react";
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

