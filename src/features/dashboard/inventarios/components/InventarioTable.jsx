import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/inventarios";

export default function InventarioTable() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener inventario");
        const data = await response.json();
        setInventarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventarios();
  }, []);

  return (
    <div className="table-container">
      <h2>Inventario</h2>
      {loading && <p>Cargando inventario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID Inventario</th>
            <th>ID Producto</th>
            <th>Cantidad Disponible</th>
            <th>Agricultor</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.length > 0 ? (
            inventarios.map((inv) => (
              <tr key={inv.id_inventario}>
                <td>{inv.id_inventario}</td>
                <td>{inv.id_producto}</td>
                <td>{inv.cantidad_disponible}</td>
                <td>{inv.producto?.agricultor?.nombre_usuario || 'Sin agricultor'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay inventario registrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
