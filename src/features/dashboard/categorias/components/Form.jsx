import React, { useState } from "react";
import { createCategory } from "../services/categoryService";
import "../styles/CategoryForm.css";

export default function CategoryForm({ show, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre_categoria: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(form);
      console.log("Categoría creada:", form);
      onSave();
      onClose();     
    } catch (err) {
      console.error("Error al crear categoría:", err);
    }
  };

  return (
    <div className={`modal_user-overlay ${show ? "show" : ""}`}>
      <div className="modal_user">
        <h2>Nueva Categoría</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de Categoría</label>
          <input
            type="text"
            name="nombre_categoria"
            value={form.nombre_categoria}
            onChange={handleChange}
            required
          />

      

          <div className="form-actions">
            <button type="submit" className="btn-primary" onClick={onClose}>Guardar</button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
