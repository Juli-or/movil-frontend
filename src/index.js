import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>);

  // Registrar Service Worker con configuración
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('App lista para uso offline');
    
    // Mostrar notificación si está permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App lista para offline', {
        body: 'Ya puedes usar la aplicación sin conexión a internet',
        icon: '/icon-192.png',
        badge: '/icon-72.png'
      });
    }
    
    // Guardar en localStorage que la PWA está lista
    localStorage.setItem('pwa-ready', 'true');
  },
  
  onUpdate: (registration) => {
    console.log(' Nueva versión disponible');
    
    // Aquí puedes mostrar un banner/modal en tu app
    const showUpdateBanner = () => {
      const banner = document.createElement('div');
      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          text-align: center;
          z-index: 10000;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        ">
          <strong>¡Nueva versión disponible!</strong>
          <div style="margin-top: 10px;">
            <button id="update-now" style="
              background: white;
              color: #667eea;
              border: none;
              padding: 8px 20px;
              border-radius: 20px;
              margin-right: 10px;
              cursor: pointer;
              font-weight: bold;
            ">Actualizar ahora</button>
            <button id="update-later" style="
              background: transparent;
              color: white;
              border: 1px solid white;
              padding: 8px 20px;
              border-radius: 20px;
              cursor: pointer;
            ">Más tarde</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(banner);
      
      document.getElementById('update-now').addEventListener('click', () => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      });
      
      document.getElementById('update-later').addEventListener('click', () => {
        document.body.removeChild(banner);
      });
    };
    
    setTimeout(showUpdateBanner, 3000);
  }
});

