import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:4000/api/finanzas";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// =======================================================
// 📦 Reporte de Productos Registrados
// =======================================================
export const getReporteProductos = async (format = 'json') => {
  try {
    const url = `${API_URL}/reportes/productos?format=${format}`;
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reporte de productos:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 📊 Reporte de Inventario Actual
// =======================================================
export const getReporteInventario = async (format = 'json') => {
  try {
    const url = `${API_URL}/reportes/inventario?format=${format}`;
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reporte de inventario:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 🛒 Reporte de Ventas / Pedidos
// =======================================================
export const getReportePedidos = async (format = 'json') => {
  try {
    const url = `${API_URL}/reportes/pedidos?format=${format}`;
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reporte de pedidos:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 🏷️ Reporte de Descuentos y Ofertas
// =======================================================
export const getReporteDescuentos = async (format = 'json') => {
  try {
    const url = `${API_URL}/reportes/descuentos?format=${format}`;
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reporte de descuentos:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// ⭐ Reporte de Reseñas y Comentarios
// =======================================================
// Reporte de reseñas eliminado: endpoint retirado del backend

// =======================================================
// Descarga de archivos (PDF/Excel)
// =======================================================
export const descargarReportePDF = async (tipoReporte) => {
  try {
    const url = `${API_URL}/reportes/${tipoReporte}?format=pdf`;
    const response = await axios.get(url, {
      ...authHeaders(),
      responseType: 'blob',
    });
    
    // Crear un blob y descargarlo
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    
    return true;
  } catch (error) {
    console.error(`❌ Error al descargar reporte PDF (${tipoReporte}):`, error);
    throw error;
  }
};

export const descargarReporteExcel = async (tipoReporte) => {
  try {
    const url = `${API_URL}/reportes/${tipoReporte}?format=excel`;
    const response = await axios.get(url, {
      ...authHeaders(),
      responseType: 'blob',
    });
    
    // Crear un blob y descargarlo
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    return true;
  } catch (error) {
    console.error(`❌ Error al descargar reporte Excel (${tipoReporte}):`, error);
    throw error;
  }
};

// =======================================================
// Preview HTML (para visualización previa)
// =======================================================
export const getReportePreview = async (tipoReporte) => {
  try {
    const url = `${API_URL}/reportes/${tipoReporte}?format=html`;
    const response = await axios.get(url, authHeaders());
    return response.data; // Retorna el HTML
  } catch (error) {
    console.error(`❌ Error al obtener preview del reporte (${tipoReporte}):`, error);
    throw error;
  }
};
