import React from "react";
import { deleteCategory } from "../services/categoryService";
import "../styles/ConfirmDelete.css";

export default function ConfirmDelete({ show, onClose, categoryId, onSave }) {
  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId);
      console.log("categoria eliminada:", categoryId);
      onSave();
      onClose();
    } catch (err) {
      console.error("Error al eliminar categoria:", err);
      alert("No se pudo eliminar el la categoria");
      
    }
  };

  return (
    <div className={`modal_user-overlay ${show ? "show" : ""}`}>
      <div className="modal_user">
        <h2>¿Eliminar categoría?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <div className="form-actions">
          <button className="btn-danger" onClick={handleDelete}>
            Sí, eliminar
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
