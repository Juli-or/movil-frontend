import axios from "axios";

const API_URL = "http://localhost:4000/api/ordenes";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const obtenerOrdenes = async () => {
  try {
    const response = await axios.get(`${API_URL}/productor`, authHeaders());
    return response.data;
  } catch (error) {
    console.error(" Error al obtener las órdenes del productor:", error);
    if (error.response?.status === 401) {
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    }
    return [];
  }
};

export const actualizarEstadoOrden = async (id, estado) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/estado`, 
      { estado },
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(" Error al actualizar estado de la orden:", error);
    if (error.response?.status === 401) {
      throw new Error("Token inválido o expirado. Inicia sesión nuevamente.");
    }
    throw error;
  }
};
export const obtenerComprobante = async (id_pedido) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id_pedido}/comprobante`,
      {
        ...authHeaders(),
        // Configuración CRÍTICA para recibir datos binarios (PDF)
        responseType: 'blob', 
      }
    );
    return response.data; // Retorna el objeto Blob del archivo PDF
  } catch (error) {
    console.error(" Error al obtener el comprobante:", error);
    throw error;
  }
};