function isLocalhost() {
  return Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
}

// Función para registrar el Service Worker
export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    
    // Solo registrar si el PUBLIC_URL es del mismo origen
    if (publicUrl.origin !== window.location.origin) {
      console.warn('Service Worker: PUBLIC_URL tiene un origen diferente. No se registrará.');
      return;
    }
    
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/sw.js`;
      
      if (isLocalhost()) {
        // En desarrollo localhost, verificar si el SW existe
        checkValidServiceWorker(swUrl, config);
        console.log('PWA: Modo desarrollo localhost');
      } else {
        // En producción, registrar directamente
        registerValidSW(swUrl, config);
      }
      
      // Configurar prompt de instalación PWA
      setupPWAInstallPrompt();
    });
  } else {
    console.warn('Service Worker no soportado en este navegador');
  }
}

// Registrar SW válido
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('PWA: Service Worker registrado exitosamente en:', registration.scope);
      
      // Manejar actualizaciones
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('PWA: Nueva versión disponible. Recarga para actualizar.');
              
              // Ejecutar callback de actualización si existe
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('PWA: Contenido cacheado para uso offline');
              
              // Ejecutar callback de éxito si existe
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('PWA: Error durante el registro del Service Worker:', error);
    });
}

// Verificar si el SW es válido (especialmente en localhost)
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' }
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      const isValidSW = 
        response.status === 200 &&
        contentType != null &&
        contentType.includes('javascript');
      
      if (isValidSW) {
        registerValidSW(swUrl, config);
      } else {
        console.error('Service Worker no encontrado o tipo incorrecto');
        
        // Limpiar SW inválido
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister();
        });
      }
    })
    .catch(() => {
      console.log('No hay conexión a internet. La app funcionará sin Service Worker.');
    });
}

// Configurar prompt de instalación PWA
function setupPWAInstallPrompt() {
  let deferredPrompt;
  
  // Solo mostrar en dispositivos móviles
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (!isMobile) return;
  
  // Crear botón de instalación si no existe
  if (!document.getElementById('pwa-install-button')) {
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.innerHTML = '📱 Instalar App';
    installButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      display: none;
      transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('mouseenter', () => {
      installButton.style.transform = 'scale(1.05)';
    });
    
    installButton.addEventListener('mouseleave', () => {
      installButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(installButton);
  }
  
  const installButton = document.getElementById('pwa-install-button');
  
  // Capturar evento de instalación
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar botón después de 5 segundos
    setTimeout(() => {
      installButton.style.display = 'block';
      installButton.classList.add('pulse');
    }, 5000);
    
    // Quitar animación después de 10 segundos
    setTimeout(() => {
      installButton.classList.remove('pulse');
    }, 10000);
  });
  
  // Manejar clic en botón de instalación
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);
      
      deferredPrompt = null;
    }
  });
  
  // Ocultar botón cuando la app ya esté instalada
  window.addEventListener('appinstalled', () => {
    console.log('PWA instalada exitosamente');
    installButton.style.display = 'none';
    
    // Mostrar mensaje de éxito
    showInstallSuccessMessage();
  });
}

// Mostrar mensaje de éxito al instalar
function showInstallSuccessMessage() {
  const message = document.createElement('div');
  message.innerHTML = ' App instalada exitosamente';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(message);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    message.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
  
  // Agregar estilos de animación si no existen
  if (!document.getElementById('pwa-animations')) {
    const style = document.createElement('style');
    style.id = 'pwa-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .pulse {
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
        100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Función para desregistrar el Service Worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        console.log('Service Worker desregistrado');
      })
      .catch(error => {
        console.error('Error al desregistrar Service Worker:', error);
      });
  }
}

// Función para verificar si la app está ejecutándose como PWA
export function isRunningAsPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
}

// Función para forzar actualización del Service Worker
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update();
        console.log('Service Worker actualizado');
      })
      .catch(error => {
        console.error('Error al actualizar Service Worker:', error);
      });
  }
}