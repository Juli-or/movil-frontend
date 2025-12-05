import React, { useState, useEffect } from "react";
//  IMPORTAR LA FUNCIÓN DEL SERVICIO
import { getCategories } from "../services/categoryService"; 
import {deleteCategory} from "../services/categoryService"; 

import CategoryEditForm from "./CategoryEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/UserTable.css";

export default function CategoryTable( {onSave}) {
    //  Inicializar categorías como un array vacío
    const [categories, setCategories] = useState([]);    
    //  NUEVOS ESTADOS para la carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editCategory, setEditCategory] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    //  FUNCIÓN DE CARGA DE DATOS
    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            setCategories(data);
            
        } catch (err) {
            console.error("Fallo en la carga de categorías:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        loadCategories();
    }, []); 


    const handleDeleteConfirm = async (id_categoria) => {
    try {
      await deleteCategory(id_categoria);
      
      setDeleteId(null);
      alert('categoria eliminada con éxito!');
      await loadCategories();
      
    } catch (err) {
      alert(`Error al eliminar: ${err}`);
    }
  };
    // --- LÓGICA DE RENDERIZADO ---    
    if (loading) {
        return <div className="table-container">Cargando categorías...</div>;
    }
    if (error) {
        return <div className="table-container error-message">Error: {error}</div>;
    }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((c) => (
              <tr key={c.id_categoria}>
                <td>{c.id_categoria}</td>
                <td>{c.nombre_categoria}</td>                
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditCategory(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteId(c.id_categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay categorías registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editCategory && (
        <CategoryEditForm
          show={!!editCategory}
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSave={loadCategories}
        />
      )}
      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          categoryId={deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          onSave={loadCategories}
        />
      )}
    </div>
  );
}


