

import axios from "axios";
const API_URL = "http://localhost:4000/api/tipoPqrs/admin";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => {
    const token = getToken();
    return token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };
};

export async function getTipoPqrs() {
    const response = await fetch(API_URL, { headers: authHeaders() });
    if (!response.ok) throw new Error("Error al obtener tipos de pqrs");
    return await response.json();
}

// Create
export const createTipoPqrs = async (tipoPqrs) => {
    try {
        const response = await axios.post(
            `${API_URL}/create`,
            tipoPqrs,
            { headers: authHeaders() }
        );
        alert(` tipo de pqrs "${tipoPqrs.nombre_tipo || 'creada'}" con éxito.`);
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


export const updateTipoPqrs = async (id, tipoPqrs) => {
    const alertIdentifier = tipoPqrs.nombre_tipo || `ID ${id}`;
    try {
        const response = await axios.put(
            `${API_URL}/update/${id}`,
            tipoPqrs,
            { headers: authHeaders() }
        );
        alert(` Tipo de PQRS ${alertIdentifier} actualizada con éxito.`);
        return response.data;
    } catch (error) {
        let errorMessage = "Ocurrió un error inesperado al intentar actualizar la PQRS.";
        if (error.response) {
            const status = error.response.status;
            if (status === 404) {
                errorMessage = `PQRS con ID ${id} no encontrada en el servidor.`;
            } else if (status === 400) {
                errorMessage = error.response.data.message || 'Datos inválidos. Verifica el estado o la respuesta.';
            } else {
                errorMessage = error.response.data.message ||
                    `Fallo del servidor (Status: ${status}).`;
            }
        }
        else if (error.request) {
            errorMessage = "No se pudo conectar al servidor. Verifique que la API esté activa y el puerto sea correcto.";
        }
        alert(` Error al responder la PQRS ${alertIdentifier}: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};



export const deleteTipoPqrs = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/delete/${id}`,
            { headers: authHeaders() }
        );
        alert(` Tipo de PQRS con ID ${id} eliminada con éxito.`);
        return response.data;
    } catch (error) {
        let errorMessage = "Ocurrió un error inesperado al intentar eliminar el tipo de pqrs.";
        if (error.response) {
            errorMessage = error.response.data.message ||
                `Fallo del servidor (Status: ${error.response.status}).`;
        } else if (error.request) {
            errorMessage = "No se pudo conectar al servidor. Verifique que la API esté activa.";
        }
        alert(` Error al eliminar la categoría: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};

