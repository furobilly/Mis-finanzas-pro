// ===================================
// FINANZAS PRO V5.0 - AUTENTICACIÓN
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';

export const Auth = {
  
  // Inicializar autenticación
  init() {
    console.log('🔐 Inicializando autenticación...');
    
    // Por ahora, login simple (sin Firebase)
    // En Fase 2 agregaremos Google OAuth
    
    const loginBtn = document.getElementById('btn-google-login');
    const logoutBtn = document.getElementById('btn-logout');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.login());
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
    
    // Verificar si hay sesión guardada
    this.checkSession();
  },
  
  // Login (por ahora sin Google, solo simular)
  async login() {
    try {
      console.log('🔑 Iniciando sesión...');
      
      // Simular login exitoso
      const mockUser = {
        uid: 'user-' + Date.now(),
        displayName: 'Usuario Demo',
        email: 'demo@finanzas.pro',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=8B5CF6&color=fff'
      };
      
      // Guardar usuario
      AppState.setUser(mockUser);
      localStorage.setItem('finanzas-user', JSON.stringify(mockUser));
      
      // Mostrar app
      this.showApp();
      
      console.log('✅ Sesión iniciada exitosamente');
      
      // Toast de bienvenida
      this.showToast('¡Bienvenido!', 'success');
      
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      this.showToast('Error al iniciar sesión', 'error');
    }
  },
  
  // Logout
  async logout() {
    try {
      const confirmed = confirm('¿Seguro que deseas cerrar sesión?');
      
      if (!confirmed) return;
      
      console.log('🔒 Cerrando sesión...');
      
      // Limpiar estado
      AppState.setUser(null);
      localStorage.removeItem('finanzas-user');
      
      // Mostrar login
      this.showLogin();
      
      console.log('✅ Sesión cerrada');
      
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  },
  
  // Verificar si hay sesión guardada
  checkSession() {
    const savedUser = localStorage.getItem('finanzas-user');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        AppState.setUser(user);
        this.showApp();
        console.log('✅ Sesión restaurada');
      } catch (error) {
        console.error('❌ Error al restaurar sesión:', error);
        this.showLogin();
      }
    } else {
      this.showLogin();
    }
  },
  
  // Mostrar pantalla de login
  showLogin() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (appContainer) appContainer.classList.add('hidden');
  },
  
  // Mostrar app
  showApp() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    
    if (loginScreen) loginScreen.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    
    // Actualizar info de usuario
    this.updateUserInfo();
  },
  
  // Actualizar información del usuario en el header
  updateUserInfo() {
    const user = AppState.currentUser;
    if (!user) return;
    
    const userPhoto = document.getElementById('user-photo');
    const userName = document.getElementById('user-name');
    
    if (userPhoto) userPhoto.src = user.photoURL || '';
    if (userName) userName.textContent = user.displayName || 'Usuario';
  },
  
  // Mostrar toast notification
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

export default Auth;
```

**PASO 5:** Commit message: `Crear módulo de autenticación`

**PASO 6:** Commit

---

## 📊 PROGRESO: 70% ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
⏳ js/modules/auth.js (creando ahora)
⬜ js/modules/ (6 archivos más)
⬜ js/ui/ (3 archivos)
⬜ js/app.js
⬜ index.html
