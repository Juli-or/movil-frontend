import axios from "axios";

const API_URL = "http://localhost:4000/api/roles/admin"; // ⚡ cambia la URL a la de tu backend


export async function getRoles() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
}

export const createRol = async (roles) => {
    try {        
        const response = await axios.post(`${API_URL}/create`, roles);        
        alert(` tipo de pqrs "${roles.nombre_rol || 'creada'}" con éxito.`);             
        return response.data;        
    } catch (error) {        
        let errorMessage = "Ocurrió un error inesperado al intentar crear el tipo de pqrs.";        
        if (error.response) {            
            errorMessage = error.response.data.message || 
             `Fallo del servidor (Status: ${error.response.status}).`;
        } else if (error.request) {            
            errorMessage = "No se pudo conectar al servidor. Verifique la conexión.";
        }        
        alert(` Error al crear el tipo de pqrs: ${errorMessage}`);        
        throw new Error(errorMessage);
    }
};

export const updateRol = async (id, roles) => {
    try {        
        const response = await axios.put(`${API_URL}/update/${id}`, roles);       
        alert(` Categoría "${roles.nombre_rol || id}" actualizada con éxito.`);         
        return response.data;
      } catch (error) { 
        let errorMessage = "Ocurrió un error inesperado al intentar actualizar el rol.";
        
        if (error.response) {
          errorMessage = error.response.data.message || 
             `Fallo del servidor (Status: ${error.response.status}).`;
        } else if (error.request) {            
            errorMessage = "No se pudo conectar al servidor. Verifique que la API esté activa.";
        }      
        alert(` Error al actualizar el rol: ${errorMessage}`);     
        throw new Error(errorMessage);
    }
};

export const deleteRol = async (id) => {
    try {        
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        alert(` rol con con ID ${id} eliminado con éxito.`);
        return response.data;        
    } catch (error) {              
        let errorMessage = 
        "Ocurrió un error inesperado al intentar "+
        "eliminar la categoría.";        
        if (error.response) {
            errorMessage = error.response.data.message || 
             `Fallo del servidor (Status: ${error.response.status}).`;
        } else if (error.request) {
            errorMessage = "No se pudo conectar al servidor. Verifique que la API esté activa.";
        }        
        alert(` Error al eliminar el rol: ${errorMessage}`);
        
        throw new Error(errorMessage);
    }
};
