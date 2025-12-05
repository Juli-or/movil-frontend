import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// DEBUG_MODE se ubica fuera del componente para estabilidad y evitar advertencias de dependencias
// Poner false para que el frontend consuma la API real y muestre datos desde la base de datos
const DEBUG_MODE = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (DEBUG_MODE) {
      const fakeUser = {
        id_usuario: 99,
        id_rol: 1,
        nombre: "Usuario Demo",
        email: "demo@demo.com",
      };
      setUser(fakeUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        // Preferir obtener perfil completo desde backend
        fetch("http://localhost:4000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((r) => r.json())
          .then((data) => {
            if (data && data.success && data.user) {
              setUser(data.user);
              setIsAuthenticated(true);
            } else {
              // Fallback: decodificar token si la ruta falla
              try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsAuthenticated(true);
              } catch (error) {
                console.error("Token inválido:", error);
                setUser(null);
                setIsAuthenticated(false);
              }
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener perfil:", err);
            try {
              const decoded = jwtDecode(token);
              setUser(decoded);
              setIsAuthenticated(true);
            } catch (error) {
              setUser(null);
              setIsAuthenticated(false);
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    // Después de login, obtener perfil desde backend
    fetch("http://localhost:4000/api/users/me", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && data.user) setUser(data.user);
        else {
          try {
            const decoded = jwtDecode(token);
            setUser(decoded);
          } catch (err) {
            setUser(null);
          }
        }
      })
      .catch((err) => {
        console.error("Error al obtener perfil tras login:", err);
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch (e) {
          setUser(null);
        }
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isCliente = () => user?.id_rol === 1;
  const isAdmin = () => user?.id_rol === 2;
  const isAgricultor = () => user?.id_rol === 3;

  const hasRole = (requiredRole) => {
    return user?.id_rol === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isCliente,
        isAdmin,
        isAgricultor,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
