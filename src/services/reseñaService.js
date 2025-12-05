import axios from "axios";

const API_URL = "http://localhost:4000/api/comentarios";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getComentariosYResenas = async (categoryId) => {
  try {
    let url = `${API_URL}/productor`;
    
    if (categoryId) { 
      url = `${API_URL}/productor?categoriaId=${categoryId}`;
    }

    const res = await axios.get(url, authHeaders());
    return res.data;
  } catch (error) {
    console.error(" Error al obtener comentarios y reseñas:", error);
    throw error;
  }
};