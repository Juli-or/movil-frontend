import React, { useState, useEffect } from "react";
import { getTipoPqrs } from "../services/tipoPqrsService"; 
import TipoPqrsEditForm from "./TipoPqrsEditForm"; 
import ConfirmDelete from "./ConfirmDelete";
import "../styles/UserTable.css";

export default function Table() {
    //  Inicializar categorías como un array vacío, no con datos quemados
    const [tipoPqrs, setTipoPqrs] = useState([]);
    
    //  NUEVOS ESTADOS para la carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editTipoPqrs, setEditTipoPqrs] = useState(null);
    const [deleteTipoPqrs, setDeleteTipoPqrs] = useState(null);    

    //  FUNCIÓN DE CARGA DE DATOS
    const loadTipoPqrs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTipoPqrs();
            setTipoPqrs(data);
            
        } catch (err) {
            console.error("Fallo en la carga de tipos de pqrs:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadTipoPqrs();
    }, []); 

    const handleDeleteConfirm = async (id_tipo_pqrs) => {
        try {
          await deleteTipoPqrs(id_tipo_pqrs);
          
          setDeleteTipoPqrs(null); // Cierra el modal
          alert('tipo de pqrs eliminada con éxito!');
          await loadTipoPqrs();
          
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
            <th>Id Tipo Pqrs</th>
            <th>Nombre Tipo</th>
            <th>Acciones</th>
            
          </tr>
        </thead>
        <tbody>
          {tipoPqrs.length > 0 ? (
            tipoPqrs.map((c) => (
              <tr key={c.id_tipo_pqrs}>
                <td>{c.id_tipo_pqrs}</td>
                <td>{c.nombre_tipo}</td>
                
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditTipoPqrs(c)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => setDeleteTipoPqrs(c.id_tipo_pqrs)}
                  >
                    Eliminar
                  </button>
                  
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay tipos de pqrs registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editTipoPqrs && (
        <TipoPqrsEditForm
          show={!!editTipoPqrs}
          tipoPqrs={editTipoPqrs}
          onClose={() => setEditTipoPqrs(null)}
          onSave={loadTipoPqrs}
        />
      )}
      {deleteTipoPqrs && (
              <ConfirmDelete
                show={!!deleteTipoPqrs}
                tipoPqrsId={deleteTipoPqrs}
                onClose={() => setDeleteTipoPqrs(null)}
                onConfirm={handleDeleteConfirm}
                onSave={loadTipoPqrs}
              />
            )}
      
    </div>
  );
}


