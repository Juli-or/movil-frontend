import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [numeroItems, setNumeroItems] = useState(0);
  const [carritoData, setCarritoData] = useState(null);
  const [idCarrito, setIdCarrito] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener o crear carrito para el usuario
  const obtenerCarritoUsuario = useCallback(async () => {
    try {
      console.log('🔄 Obteniendo carrito del usuario...');
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.id_rol !== 1) {
        console.log('❌ Usuario no es cliente o no está autenticado');
        return;
      }

      console.log('👤 Usuario ID:', user.id_usuario);

      // ✅ CORREGIDO: Usar el endpoint que ya funciona
      try {
        const res = await axios.get(`http://localhost:4000/api/carrito/activo/${user.id_usuario}`);
        console.log('📦 Respuesta carrito activo:', res.data);

        if (res.data.success && res.data.data) {
          console.log('✅ Carrito existente encontrado:', res.data.data.id_carrito);
          setIdCarrito(res.data.data.id_carrito);
          setCarritoData(res.data.data);
          setNumeroItems(res.data.data.items?.length || 0);
          return;
        }
      } catch (error) {
        console.log('ℹ️ No se pudo obtener carrito activo:', error.message);
        // Si no hay carrito, no pasa nada - se creará cuando se agregue un producto
        setCarritoData({ items: [] });
        setNumeroItems(0);
      }

    } catch (error) {
      console.error('❌ Error obteniendo/creando carrito:', error);
      console.error('Detalles del error:', error.response?.data);
    }
  }, []);

  // Agregar producto al carrito
  const agregarAlCarrito = async (idProducto, cantidad = 1) => {
    try {
      console.log('🛒 Iniciando agregar al carrito...');
      console.log('📋 Parámetros:', { idProducto, cantidad });

      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.id_rol !== 1) {
        throw new Error('Solo los clientes pueden agregar productos al carrito');
      }

      console.log('👤 Usuario:', user.id_usuario);

      // ✅ CORREGIDO: Usar el endpoint que funciona
      const response = await axios.post('http://localhost:4000/api/carrito/agregar', {
        id_usuario: user.id_usuario,
        id_producto: idProducto,
        cantidad: cantidad
      });

      console.log('📦 Respuesta agregar al carrito:', response.data);

      if (response.data.success) {
        console.log('✅ Producto agregado exitosamente');
        // Disparar evento para actualizar navbar
        window.dispatchEvent(new Event('cartUpdated'));

        // Actualizar el estado local
        await obtenerCarritoUsuario();

        return response.data;
      } else {
        throw new Error(response.data.error || 'Error al agregar producto');
      }
    } catch (error) {
      console.error('❌ Error en agregarAlCarrito:', error);
      console.error('Detalles completos del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      let errorMessage = 'Error inesperado al agregar al carrito';

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar carrito
  const actualizarCarrito = async () => {
    await obtenerCarritoUsuario();
  };

  // Cargar carrito al inicializar
  useEffect(() => {
    obtenerCarritoUsuario();
  }, [obtenerCarritoUsuario]);

  const value = {
    numeroItems,
    carritoData,
    idCarrito,
    actualizarCarrito,
    agregarAlCarrito,
    loading,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export { CarritoContext };
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};