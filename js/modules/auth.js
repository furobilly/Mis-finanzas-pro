// AUTH - AUTENTICACION SIMPLE

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { Alerts } from '../ui/alerts.js';

export const Auth = {
  
  init() {
    this.checkSession();
    this.setupLoginButton();
  },
  
  checkSession() {
    const savedUser = localStorage.getItem('finanzas-pro-user');
    
    if (savedUser) {
      AppState.setUser(JSON.parse(savedUser));
      this.showApp();
    } else {
      this.showLogin();
    }
  },
  
  showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
  },
  
  showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    const userName = document.getElementById('user-name');
    if (userName && AppState.user) {
      userName.textContent = AppState.user.name;
    }
  },
  
  setupLoginButton() {
    const loginBtn = document.getElementById('btn-google-login');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.handleLogin();
      });
    }
    
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }
  },
  
  handleLogin() {
    let name = prompt('Ingresa tu nombre:');
    
    if (!name || name.trim() === '') {
      alert('Debes ingresar un nombre');
      return;
    }
    
    name = name.trim();
    
    let pinValido = false;
    let pin = '';
    
    while (!pinValido) {
      pin = prompt('Crea un PIN de 4 digitos (solo numeros):');
      
      if (!pin) {
        return;
      }
      
      pin = pin.trim();
      
      if (pin.length !== 4) {
        alert('ERROR: El PIN debe tener exactamente 4 digitos. Tu PIN tiene ' + pin.length + ' digitos.');
        continue;
      }
      
      if (!/^\d+$/.test(pin)) {
        alert('ERROR: El PIN solo puede contener numeros (0-9)');
        continue;
      }
      
      pinValido = true;
    }
    
    const user = {
      name: name,
      pin: pin,
      loginDate: new Date().toISOString()
    };
    
    localStorage.setItem('finanzas-pro-user', JSON.stringify(user));
    AppState.setUser(user);
    
    this.showApp();
    
    setTimeout(() => {
      alert('Bienvenido ' + user.name);
    }, 300);
  },
  
  handleLogout() {
    const confirmed = confirm('¿Seguro que quieres cerrar sesion?');
    
    if (confirmed) {
      localStorage.removeItem('finanzas-pro-user');
      AppState.setUser(null);
      this.showLogin();
    }
  }
};
