import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/Sidebar.css";
import "../style/global.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated || user?.id_rol !== 2) return null; // Solo admin

  return (
    <>
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
        <h2 className="sidebar-title">Admin</h2>

        <div className="logo">
          <img src="/resources/logo.jpg" alt="logo" />
        </div>

        <nav>
          <ul>
            <li>
              <NavLink to="/admin/user">Usuarios</NavLink>
            </li>
            <li>
              <NavLink to="/admin/categorias">Categorías</NavLink>
            </li>
            <li>
              <NavLink to="/admin/pqrs">PQRS</NavLink>
            </li>
            <li>
              <NavLink to="/admin/tipoPqrs">Tipos de PQRS</NavLink>
            </li>
            <li>
              <NavLink to="/admin/inventarios">Inventarios</NavLink>
            </li>
            <li>
              <NavLink to="/admin/roles">Roles</NavLink>
            </li>
          </ul>
        </nav>

        <button className="logout-btn-sidebar" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>
    </>
  );
}
