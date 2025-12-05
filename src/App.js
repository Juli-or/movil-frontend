import React, { useState, useEffect } from "react";
// Eliminamos useLocation ya que simplificamos ClientRouteGuard
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { CarritoProvider } from './context/CarritoContext';
import { NotificationProvider } from './context/NotificationContext';
// Componentes globales (cliente)
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";


// Páginas del cliente
import Catalogo from "./pages/Catalogo.js";
import Home from "./pages/Home.js";
import Blog from "./pages/Blog.js";
import ProductPage from "./pages/ProductPage.js";
import Ofertas from "./pages/Ofertas.js";
import Carrito from "./pages/Carrito.js";
import Pedidos from "./pages/Pedidos.js"; 
import ConfiguracionCliente from "./pages/ConfiguracionCliente.jsx";

// Aplicación del productor
import ProductorApp from "./productorApp.jsx";

// Dashboard de administrador
import AdminApp from "./AdminApp.jsx";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // =======================================================
  // 1. CARGAR SESIÓN DESDE LOCALSTORAGE
  // =======================================================
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        const roleMap = { 1: "cliente", 2: "administrador", 3: "productor" };
        const finalUserData = { ...userData, role: roleMap[userData.id_rol] || "cliente" };
        
        setUser(finalUserData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error al analizar los datos del usuario:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // =======================================================
  // 2. LOGIN Y LOGOUT
  // =======================================================
  const handleLogin = (userData) => {
    const roleMap = { 1: "cliente", 2: "administrador", 3: "productor" };
    const finalUserData = { ...userData, role: roleMap[userData.id_rol] || "cliente" };

    localStorage.setItem("user", JSON.stringify(finalUserData));
    setUser(finalUserData);
    setIsAuthenticated(true);
    
    // Redirige según el rol del usuario
    if (finalUserData.role === "productor") {
      window.location.href = "/AdminView";
    } else if (finalUserData.role === "administrador") {
      window.location.href = "/admin";
    } else {
      // Cliente va al Home
      window.location.href = "/";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    // Usar window.location.href para asegurar una recarga limpia al login
    window.location.href = "/login"; 
  };

  // =======================================================
  // 3. LAYOUT GENERAL (Navbar y Footer)
  // =======================================================
  const Layout = ({ children }) => (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <div className="page-content">{children}</div>
      <Footer />
    </>
  );

  // =======================================================
  // 4. RUTAS CONDICIONALES Y PROTEGIDAS
  // =======================================================
  
  const ProtectedRoute = ({ element }) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;
  
  const ProducerGuard = ({ element }) => {
    if (isAuthenticated && user?.role === "productor") {
      return <Navigate to="/AdminView" replace />;
    }
    return element;
  };

  const AdminGuard = ({ element }) => {
    if (isAuthenticated && user?.role === "administrador") {
      return <Navigate to="/admin" replace />;
    }
    return element;
  };


  // =======================================================
  // 5. RUTAS DE LA APLICACIÓN
  // =======================================================
  return (
    <NotificationProvider>
      <CarritoProvider>
        <Router>
          <Routes>
        
        {/* 1. RUTA RAÍZ (Home) - INICIA SIEMPRE AQUÍ (Como solicitaste) */}
        <Route path="/" element={<Layout><Home /></Layout>} /> 
        
        {/* 2. RUTAS PÚBLICAS DEL CLIENTE (Protegidas por ProducerGuard) */}
        {/* El productor es redirigido SOLO cuando intenta acceder a estas rutas */}
        <Route path="/catalogo" element={<ProducerGuard element={<Layout><Catalogo /></Layout>} />} />
        <Route path="/producto/:id" element={<ProducerGuard element={<Layout><ProductPage /></Layout>} />} />
        <Route path="/blog" element={<ProducerGuard element={<Layout><Blog /></Layout>} />} />
        <Route path="/ofertas" element={<ProducerGuard element={<Layout><Ofertas /></Layout>} />} />
        <Route path="/configuracion" element={<ProducerGuard element={<ProtectedRoute element={<Layout><ConfiguracionCliente /></Layout>} />} />} />

        {/* 3. RUTAS PROTEGIDAS DEL CLIENTE (Doble protección) */}
        <Route
          path="/carrito"
          element={<ProducerGuard element={<ProtectedRoute element={<Layout><Carrito /></Layout>} />} />}
        />
        <Route path="/pedidos" element={
              <ProducerGuard element={
                <ProtectedRoute element={
                  <Layout><Pedidos /></Layout>
                } />
              } />
            } />
        
        {/* 4. RUTAS DE AUTENTICACIÓN */}
        <Route
          path="/login"
          // Si ya está logueado, redirige según su rol
          element={
            isAuthenticated && user?.role === "productor" 
              ? <Navigate to="/AdminView" replace />
              : (isAuthenticated && user?.role === "administrador"
                ? <Navigate to="/admin" replace />
                : (isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />))
          }
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />}
        />

        {/* 5. RUTA PRINCIPAL DEL PRODUCTOR */}
        <Route
          path="/AdminView/*"
          element={
            isAuthenticated && user?.role === "productor" ? (
              <ProductorApp isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 6. RUTA PRINCIPAL DEL ADMINISTRADOR */}
        <Route
          path="/admin/*"
          element={
            isAuthenticated && user?.role === "administrador" ? (
              <AdminApp user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 7. RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
        </Router>
      </CarritoProvider>
    </NotificationProvider>
  );
}

export default App;
