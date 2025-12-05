const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const getSubcategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/subcategorias`);
    if (!response.ok) {
      throw new Error('Error al obtener las subcategorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};