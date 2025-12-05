import React, { useState } from "react";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import "../styles/PageUser.css";


export default function PageUser() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo Usuario
        </button>
      </header>

      <UserTable />
      

      {/* modal_user siempre montado, pero visible según showForm */}
      <UserForm show={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
