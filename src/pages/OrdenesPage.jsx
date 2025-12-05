import { useState, useEffect } from "react";
import { obtenerOrdenes, actualizarEstadoOrden, obtenerComprobante } from "../services/ordenService";
import "../style/ordenes.css";

const getStatusClass = (s) => {
  if (!s) return "status-Pendiente";
  return `status-${String(s).replace(/\s+/g, "")}`;
};

const getLoggedProductorId = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.id_usuario || userData?.idUsuario || null;
  } catch {
    return null;
  }
};

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ID_PRODUCTOR_ACTUAL = getLoggedProductorId();

  useEffect(() => {
    if (ID_PRODUCTOR_ACTUAL) fetchOrdenes();
    else {
      setError("No se encontró el productor logueado. Inicia sesión nuevamente.");
      setLoading(false);
    }
  }, [ID_PRODUCTOR_ACTUAL]);

  const fetchOrdenes = async () => {
    try {
      const data = await obtenerOrdenes();
      setOrdenes(data);
    } catch (error) {
      console.error(" No se pudieron obtener las órdenes.", error);
      setError("Error al cargar las órdenes. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarComprobante = async (id_pedido) => {
  try {
    const pdfBlob = await obtenerComprobante(id_pedido);
    
    const url = window.URL.createObjectURL(pdfBlob);
    
    // Crea un enlace temporal <a> para iniciar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante_orden_${id_pedido}.pdf`; 
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    alert("Error al descargar el comprobante.");
  }
};

// 💡 IMPLEMENTACIÓN: Lógica para previsualizar el PDF en una nueva pestaña
const handlePrevisualizarComprobante = async (id_pedido) => {
  try {
    const pdfBlob = await obtenerComprobante(id_pedido);
    const url = window.URL.createObjectURL(pdfBlob);
    
    // Abre el PDF en una nueva pestaña
    window.open(url, '_blank'); 
    
  } catch (error) {
    alert("Error al previsualizar el comprobante.");
  }
};

  const handleEstadoChange = async (id_pedido, estado) => { 
    try {
      await actualizarEstadoOrden(id_pedido, estado);
      setOrdenes(prevOrdenes => 
        prevOrdenes.map(orden => 
          orden.id_pedido === id_pedido ? { ...orden, estado: estado } : orden
        )
      );
    } catch (error) {
      console.error(" Error al actualizar estado", error);
    }
  };

  if (loading) return <div>Cargando órdenes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Gestión de Órdenes (Productor ID: {ID_PRODUCTOR_ACTUAL})</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Seguimiento</th>
            <th>Acciones</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.length > 0 ? (
            ordenes.map((orden) => (
              <tr key={orden.id_pedido}>
                <td>{orden.id_pedido}</td> 
                <td>{orden.cliente}</td>
                <td>{new Date(orden.fecha_pedido).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(orden.estado)}`}>
                    {orden.estado}
                  </span>
                </td>
                <td>${Number(orden.total).toFixed(2)}</td>
           
                <td>{orden.direccion_envio || "N/A"}</td>
                <td>{orden.ciudad_envio || "N/A"}</td>
                <td>{orden.numero_seguimiento || "—"}</td>
                <td>
                  <select
                    className="form-select"
                    aria-label={`Cambiar estado orden ${orden.id_pedido}`}
                    value={orden.estado}
                    onChange={(e) => handleEstadoChange(orden.id_pedido, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </td>
                <td className="comprobante-buttons">
                  <button
                    className="btn-preview"
                    onClick={() => handlePrevisualizarComprobante(orden.id_pedido)}
                    title="Previsualizar comprobante"
                  >
                      Ver
                  </button>
                  <button
                    className="btn-download"
                    onClick={() => handleDescargarComprobante(orden.id_pedido)}
                    title="Descargar comprobante"
                  >
                    ⬇️ Descargar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No hay órdenes para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}