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
    const name = prompt('Ingresa tu nombre:');
    
    if (!name || name.trim() === '') {
      Alerts.error('Debes ingresar un nombre');
      return;
    }
    
    const pin = prompt('Crea un PIN de 4 digitos:');
    
    if (!pin || pin.length !== 4 || isNaN(pin)) {
      Alerts.error('El PIN debe ser de 4 digitos');
      return;
    }
    
    const user = {
      name: name.trim(),
      pin: pin,
      loginDate: new Date().toISOString()
    };
    
    localStorage.setItem('finanzas-pro-user', JSON.stringify(user));
    AppState.setUser(user);
    
    this.showApp();
    Alerts.success('Bienvenido ' + user.name);
  },
  
  handleLogout() {
    const confirmed = confirm('¿Seguro que quieres cerrar sesion?');
    
    if (confirmed) {
      localStorage.removeItem('finanzas-pro-user');
      AppState.setUser(null);
      this.showLogin();
      Alerts.info('Sesion cerrada');
    }
  }
};
