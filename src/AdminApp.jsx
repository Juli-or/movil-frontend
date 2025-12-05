// src/AdminApp.jsx

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';
import AppRoutes from './app/routes';

function AdminApp() {
  return (
    <Routes>
      {/* Asegura que el contenedor admin capture todas las subrutas con "/*" */}
      <Route
        path="/*"
        element={
          <ProtectedRoute requiredRole={2}> {/* id_rol=2 es administrador según el mapeo de App.js */}
            <AppRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminApp;
