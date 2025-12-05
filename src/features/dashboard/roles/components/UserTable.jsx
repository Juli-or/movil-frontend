import React, { useState, useEffect } from "react";
import RolesEditForm from "./RolesEditForm";
import ConfirmDelete from "./ConfirmDelete";
import { getRoles, deleteRol } from "../services/rolesService"; 
import "../styles/UserTable.css";

export default function Table() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editRol, setEditRoles] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadRol = async () => {
          setLoading(true);
          setError(null);
          try {
              const data = await getRoles();
              setRoles(data);
              
          } catch (err) {
              console.error("Fallo en la carga de roles:", err);
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };      
      useEffect(() => {
          loadRol();
      }, []); 

      const handleDeleteConfirm = async (id_rol) => {
          try {
            await deleteRol(id_rol);            
            setDeleteId(null); // Cierra el modal
            alert('Rol eliminado con éxito!');
            await loadRol();            
          } catch (err) {
            alert(`Error al eliminar: ${err}`);
          }
        };
    if (loading) {
        return <div className="table-container">Cargando Roles...</div>;
    }
    if (error) {
        return <div className="table-container error-message">Error: {error}</div>;
    }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Id Rol</th>
            <th>Nombre Rol</th>
            <th>Descripción</th>            
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((u) => (
              <tr key={u.id_rol}>
                <td>{u.id_rol}</td>
                <td>{u.nombre_rol}</td>
                <td>{u.descripcion_rol}</td>                
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditRoles(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteId(u.id_rol)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editRol && (
        <RolesEditForm
          show={!!editRol}
          roles={editRol}
          onClose={() => setEditRoles(null)}
          onSave={loadRol}
        />
      )}
      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          id_rol={deleteId}
          onClose={() => setDeleteId(null)}          
          onConfirm={handleDeleteConfirm}
          onSave={loadRol}
          
        />
      )}
    </div>
  );
}
