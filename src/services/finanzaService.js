import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:4000/api/finanzas";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const buildUrlWithUserId = (endpoint, id_usuario) => {
  let url = `${API_URL}${endpoint}`;
  if (id_usuario) url += `?id_usuario=${id_usuario}`;
  return url;
};

// =======================================================
// 📊 Datos financieros
// =======================================================
export const getFinanzasData = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener datos financieros:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 📈 Ventas por mes
// =======================================================
export const getVentasPorMes = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/ventas-por-mes", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener ventas por mes:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 🛒 Productos más vendidos
// =======================================================
export const getProductosMasVendidos = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/productos-mas-vendidos", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener productos más vendidos:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};

// =======================================================
// 📦 Estado de órdenes
// =======================================================
export const getOrdenesEstado = async (id_usuario) => {
  try {
    const url = buildUrlWithUserId("/ordenes-estado", id_usuario);
    const response = await axios.get(url, authHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener estado de órdenes:", error);
    if (error.response?.status === 401)
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    throw error;
  }
};
