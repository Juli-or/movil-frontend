import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageUser from "../features/dashboard/user/pages/PageUser";
import PageCategoria from "../features/dashboard/inventarios/pages/PageCategoria";
import PagePqrs from "../features/dashboard/pqrs/pages/pagePqrs";
import PageTipoPqrs from "../features/dashboard/tipoPqrs/pages/pageTipoPqrs";
import PageRoles from "../features/dashboard/roles/pages/PageRoles";

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onToggle={setSidebarOpen} />

      {/* Ajusta el margen dinámicamente */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Routes>
          {/* Rutas relativas; el contenedor decide el prefijo (p.ej., /admin/*) */}
          <Route index element={<Navigate to="user" replace />} />
          <Route path="user" element={<PageUser />} />
          <Route path="categorias" element={<PageCategoria />} />
          <Route path="pqrs" element={<PagePqrs />} />
          <Route path="tipoPqrs" element={<PageTipoPqrs />} />
          <Route path="inventarios" element={<PageCategoria />} />
          <Route path="roles" element={<PageRoles />} />

          {/* Catch-all dentro del dashboard admin */}
          <Route path="*" element={<Navigate to="user" replace />} />
        </Routes>
      </main>
    </div>
  );
}
