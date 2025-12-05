import React, { useState, useEffect } from "react";
import { getPqrs } from "../services/pqrsService"; 
import PqrsEditForm from "./pqrsEditForm"; 
import "../styles/UserTable.css";

export default function Table() {
    //  Inicializar categorías como un array vacío
    const [pqrs, setPqrs] = useState([]);
    
    //  NUEVOS ESTADOS para la carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editPqrs, setEditPqrs] = useState(null);

    //  FUNCIÓN DE CARGA DE DATOS
    const loadPqrs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPqrs();
            setPqrs(data);
            
        } catch (err) {
            console.error("Fallo en la carga de Pqrs:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };    
    useEffect(() => {
        loadPqrs();
    }, []); 
    // --- LÓGICA DE RENDERIZADO ---    
    if (loading) {
        return <div className="table-container">Cargando Pqrs...</div>;
    }
    if (error) {
        return <div className="table-container error-message">Error: {error}</div>;
    }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Id Pqrs</th>
            <th>Id Usuario</th>
            <th>Id Tipo Pqrs</th>
            <th>Asunto</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>ID Estado Pqrs</th>
            <th>Fecha Última Actualización</th>
            <th>Respuesta Admin</th>
            <th>ID Admin Respuesta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pqrs.length > 0 ? (
            pqrs.map((c) => (
              <tr key={c.id_pqrs}>
                <td>{c.id_pqrs}</td>
                <td>{c.id_usuario}</td>
                <td>{c.id_tipo_pqrs}</td>
                <td>{c.asunto}</td>
                <td>{c.descripcion}</td>
                <td>{c.fecha_creacion}</td>
                <td>{c.id_estado_pqrs}</td>
                <td>{c.fecha_ultima_actualizacion}</td>
                <td>{c.respuesta_administrador}</td>
                <td>{c.id_administrador_respuesta}</td>
                
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditPqrs(c)}
                  >
                    Editar
                  </button>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay pqrs registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editPqrs && (
        <PqrsEditForm
          show={!!editPqrs}
          pqrs={editPqrs}
          onClose={() => setEditPqrs(null)}
          onSave={loadPqrs}
        />
      )}
      
    </div>
  );
}


