// features/users/services/userService.js

const API_URL = "http://localhost:4000/api/inventarios";

// === READ ===
export async function getUsers() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
}

// === CREATE ===
export async function createUser(userData) {
  const response = await fetch("http://localhost:4000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre_usuario: userData.nombre_usuario,
      password_hash: userData.password_hash,
      correo_electronico: userData.correo_electronico,
      id_rol: userData.id_rol,  // 👈 se envía ID
      documento_identidad: userData.documento_identidad,
      estado: userData.estado,
    }),
  });
  if (!response.ok) throw new Error("Error al crear usuario");
  return await response.json();
}


// === UPDATE ===
export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/"editUser"/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Error al actualizar usuario");
  return await response.json();
}

// === DELETE ===
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/"delete"/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar usuario");
  return await response.json();
}
