import React, { useState } from "react";
import UserEditForm from "./UserEditForm";
import ConfirmDelete from "./ConfirmDelete";
import "../styles/UserTable.css";

export default function UserTable() {
  // 🔥 Usuarios quemados de prueba (simulando lo que vendría del backend)
  const [users, setUsers] = useState([
    {
      id_usuario: 1,
      nombre_usuario: "Juan Pérez",
      password_hash: "******",
      correo_electronico: "juan@example.com",
      id_rol: 2,
      documento_identidad: "123456789",
      estado: "activo",
    },
    {
      id_usuario: 2,
      nombre_usuario: "Ana Gómez",
      password_hash: "******",
      correo_electronico: "ana@example.com",
      id_rol: 3,
      documento_identidad: "987654321",
      estado: "inactivo",
    },
  ]);

  // Diccionario de roles: id → nombre
  const roles = {
    1: "cliente",
    2: "administrador",
    3: "agricultor",
  };

  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
                <td>{u.documento_identidad}</td>
                <td>{roles[u.id_rol] || "Desconocido"}</td>
                <td>{u.estado}</td>
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
              <td colSpan="7">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      {editUser && (
        <UserEditForm
          show={!!editUser}
          user={editUser}
          onClose={() => setEditUser(null)}
        />
      )}
      {deleteId && (
        <ConfirmDelete
          show={!!deleteId}
          userId={deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
