// services/productorService.js
const API_URL = "http://localhost:4000/api/productor";
const UNAUTHORIZED_ERROR = "Token inválido o expirado. Inicia sesión nuevamente.";

const getToken = () => {
  console.log(' [DEBUG] Getting token...');

  let token = localStorage.getItem("token");
  if (token) {
    console.log(' [DEBUG] Token found in localStorage');
    return token;
  }

  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const usuario = JSON.parse(userData);
      if (usuario && usuario.token) {
        console.log(' [DEBUG] Token found in user data');
        return usuario.token;
      }
    }
  } catch (e) {
    console.error(" [DEBUG] Error parsing user data:", e);
  }

  console.error(' [DEBUG] No token found anywhere');
  return null;
};

const authHeaders = () => {
  const token = getToken();

  if (!token) {
    console.warn(' [DEBUG] No token available for request');
    return {
      "Content-Type": "application/json",
    };
  }

  console.log(' [DEBUG] Adding Authorization header with token');
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleApiError = async (response) => {
  if (response.status === 401) {
    console.error(' [DEBUG] 401 Unauthorized - Clearing storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error(UNAUTHORIZED_ERROR);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response;
};


export const getProductos = async (id_usuario) => {
  try {
    console.log(`[DEBUG] Fetching products for user: ${id_usuario}`);

    const res = await fetch(`${API_URL}/usuario/${id_usuario}`, {
      headers: authHeaders(),
    });

    await handleApiError(res);
    const data = await res.json();
    console.log(' [DEBUG] Products fetched successfully:', data.length, 'products');
    return data;

  } catch (err) {
    console.error(" [DEBUG] GET productos error:", err);
    throw err;
  }
};

export const addProducto = async (producto) => {
  try {
    console.log(' [DEBUG] Adding new product:', producto);

    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(producto),
    });

    await handleApiError(res);
    const data = await res.json();
    console.log(' [DEBUG] Product added successfully:', data);
    return data;

  } catch (err) {
    console.error(" [DEBUG] POST producto error:", err);
    throw err;
  }
};


export const updateProducto = async (id, producto) => {
  try {
    console.log(` [DEBUG] Updating product ${id}:`, producto);

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(producto),
    });

    await handleApiError(res);
    const data = await res.json();
    console.log(' [DEBUG] Product updated successfully:', data);
    return data;

  } catch (err) {
    console.error(" [DEBUG] PUT producto error:", err);
    throw err;
  }
};

export const deleteProducto = async (id) => {
  try {
    console.log(` [DEBUG] Deleting product ${id}`);

    const res = await fetch(`${API_URL}/desactivar/${id}`, {
      method: "PUT",
      headers: authHeaders(),
    });

    await handleApiError(res);
    const data = await res.json();
    console.log(' [DEBUG] Product deleted successfully:', data);
    return data;

  } catch (err) {
    console.error(" [DEBUG] DELETE producto error:", err);
    throw err;
  }
};

export const debugAuth = () => {
  console.log('===  AUTH DEBUG ===');
  console.log('Token:', localStorage.getItem('token'));
  console.log('User:', localStorage.getItem('user'));
  console.log('Headers for next request:', authHeaders());
  console.log('=== END DEBUG ===');
};

export { UNAUTHORIZED_ERROR };