import React, { useState, useEffect } from "react";

import userService from "../services/userService"; 
import UserEditForm from "./UserEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/UserTable.css";

const ROLE_MAP = {
  1: "Cliente",
  2: "Administrador",
  3: "Productor",
};

export default function UserManagementTable() {

  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  // Estados para los modales
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  //filtros
  const [searchTerm, setSearchTerm] = useState("");


  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);     
      const data = await userService.getUsers();
      
      setUsers(data); 
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      // Muestra un mensaje amigable al usuario
      setError(err.message || "Fallo la conexión con el servidor para obtener los usuarios.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleUpdate = async (updatedData) => {
    try {
      await userService.updateUser(updatedData.id_usuario, updatedData);
      setEditUser(null);
      alert('Usuario actualizado con éxito!');
      await fetchUsers();
    } catch (err) {
      alert(`Error al actualizar: ${err}`);
    }
  };

  const handleDeleteConfirm = async (id_usuario) => {
    try {
      await userService.deleteUser(id_usuario);
      
      setDeleteId(null);
      alert('Usuario eliminado con éxito!');
      await fetchUsers();
    } catch (err) {
      alert(`Error al eliminar: ${err}`);
    }
  };




  if (loading) {
    return <div className="loading-message">Cargando usuarios desde la base de datos...</div>;
  }

  if (error) {
    return <div className="error-message">Error de la API: {error}</div>;
  }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Usuario</th>
            <th>Correo Electrónico</th>
            <th>Documento Identidad</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.nombre_usuario}</td>
                <td>{u.correo_electronico}</td>
                <td>{u.documento_identidad || "N/A"}</td>
                <td>{ROLE_MAP[u.id_rol] || "Desconocido"}</td> 
                <td>{u.estado || "N/A"}</td>
                <td>
                  <button
                    className="btn-success"
                    onClick={() => setEditUser(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteId(u.id_usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay usuarios registrados en la base de datos.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editUser && (
        <UserEditForm
          show={!!editUser}
          user={editUser}
          roles={ROLE_MAP} 
          onClose={() => setEditUser(null)}
          onSave={handleUpdate} 
          
        />
      )}
      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          userId={deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
}