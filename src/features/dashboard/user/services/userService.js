// features/users/services/userService.js

const API_URL = "http://localhost:4000/api/users";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = getToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const userService = {
  getUsers,
  updateUser,
  deleteUser,
  createUser
};

// === READ ===

export async function getUsers() {
  const response = await fetch(API_URL, { headers: authHeaders() });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("No autorizado. Inicia sesión como administrador.");
    }
    throw new Error("Error al obtener usuarios");
  }
  return await response.json();
}

export async function createUser(userData) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorMessage = `Error al crear usuario (Status: ${response.status}).`;
    try {
      const errorDetail = await response.json();
      errorMessage = errorDetail.message || errorMessage;
    } catch (e) {}

    throw new Error(errorMessage);
  }
  return await response.json();
}

export async function updateUser(id, userData) {
  const dataToSend = { ...userData };
  if (dataToSend.password_hash === "" || dataToSend.password_hash === undefined) {
    delete dataToSend.password_hash;
  }
  const url = `${API_URL}/${id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    let errorMessage = `Error al actualizar usuario (Status: ${response.status}).`;
    try {
      const errorDetail = await response.json();
      errorMessage = errorDetail.message || errorMessage;
    } catch (e) {}

    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    let errorMessage = `Error al eliminar usuario (Status: ${response.status}).`;
    try {
      const errorDetail = await response.json();
      errorMessage = errorDetail.message || errorMessage;
    } catch (e) {}
    alert(` Falló la eliminación: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  alert(" Usuario eliminado con éxito.");

  if (response.status === 204) {
    return { message: "Usuario eliminado con éxito." };
  }
  return await response.json();
}

export default userService;