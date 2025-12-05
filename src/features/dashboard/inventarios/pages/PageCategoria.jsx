import React, { useState } from "react";
import InventarioTable from "../components/InventarioTable";
import CategoryTable from "../../categorias/components/Table";
import "../styles/PageCategoria.css";

export default function PageCategoria() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestión de Inventario y Categorías</h1>
      </header>
      <InventarioTable />
      <hr style={{ margin: '2rem 0' }} />
      <CategoryTable />
    </div>
  );
}
