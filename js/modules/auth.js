// AUTH - GESTOR DE USUARIOS

import { AppState } from '../core/state.js';
import { Alerts } from '../ui/alerts.js';

const MAX_USERS = 3;
const USERS_KEY = 'finanzas-pro-users';
const CURRENT_USER_KEY = 'finanzas-pro-current-user';

export const Auth = {
  
  init() {
    this.checkSession();
    this.setupEvents();
  },
  
  checkSession() {
    const currentUserEmail = localStorage.getItem(CURRENT_USER_KEY);
    
    if (currentUserEmail) {
      const users = this.getUsers();
      const user = users.find(u => u.email === currentUserEmail);
      
      if (user) {
        AppState.setUser(user);
        this.showApp();
        return;
      }
    }
    
    this.showLogin();
  },
  
  showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
    this.renderUsersList();
  },
  
  showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    const userName = document.getElementById('user-name');
    if (userName && AppState.user) {
      userName.textContent = AppState.user.name;
    }
  },
  
  setupEvents() {
    const btnNewUser = document.getElementById('btn-new-user');
    const btnCreateUser = document.getElementById('btn-create-user');
    const btnCancelCreate = document.getElementById('btn-cancel-create');
    const btnLoginPin = document.getElementById('btn-login-pin');
    const btnCancelPin = document.getElementById('btn-cancel-pin');
    const btnLogout = document.getElementById('btn-logout');
    const inputPin = document.getElementById('input-pin');
    const inputPinLogin = document.getElementById('input-pin-login');
    
    if (btnNewUser) {
      btnNewUser.onclick = () => this.showCreateForm();
    }
    
    if (btnCreateUser) {
      btnCreateUser.onclick = () => this.createUser();
    }
    
    if (btnCancelCreate) {
      btnCancelCreate.onclick = () => this.showUserSelector();
    }
    
    if (btnLoginPin) {
      btnLoginPin.onclick = () => this.loginWithPin();
    }
    
    if (btnCancelPin) {
      btnCancelPin.onclick = () => this.showUserSelector();
    }
    
    if (btnLogout) {
      btnLogout.onclick = () => this.logout();
    }
    
    if (inputPin) {
      inputPin.oninput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
      };
    }
    
    if (inputPinLogin) {
      inputPinLogin.oninput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
      };
      
      inputPinLogin.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.loginWithPin();
        }
      };
    }
  },
  
  getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  
  renderUsersList() {
    const users = this.getUsers();
    const list = document.getElementById('users-list');
    
    if (!list) return;
    
    if (users.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 20px;">No hay usuarios. Crea uno nuevo.</p>';
    } else {
      list.innerHTML = users.map(user => `
        <div class="user-item" onclick="Auth.selectUser('${user.email}')">
          <div class="user-info">
            <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
            <div class="user-details">
              <h4>${user.name}</h4>
              <p>Ultimo acceso: ${new Date(user.lastLogin || user.createdAt).toLocaleDateString('es-MX')}</p>
            </div>
          </div>
          <button class="btn-delete-user" onclick="event.stopPropagation(); Auth.deleteUser('${user.email}')">🗑️</button>
        </div>
      `).join('');
    }
    
    const btnNewUser = document.getElementById('btn-new-user');
    if (btnNewUser) {
      btnNewUser.style.display = users.length >= MAX_USERS ? 'none' : 'block';
    }
  },
  
  showUserSelector() {
    document.getElementById('user-selector').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('pin-form').classList.add('hidden');
    this.renderUsersList();
  },
  
  showCreateForm() {
    const users = this.getUsers();
    
    if (users.length >= MAX_USERS) {
      alert('Maximo 3 usuarios. Elimina uno para crear otro.');
      return;
    }
    
    document.getElementById('user-selector').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('input-name').value = '';
    document.getElementById('input-pin').value = '';
    document.getElementById('input-name').focus();
  },
  
  showPinForm(userEmail) {
    const users = this.getUsers();
    const user = users.find(u => u.email === userEmail);
    
    if (!user) return;
    
    document.getElementById('user-selector').classList.add('hidden');
    document.getElementById('pin-form').classList.remove('hidden');
    document.getElementById('pin-user-name').textContent = user.name;
    document.getElementById('input-pin-login').value = '';
    document.getElementById('input-pin-login').focus();
    
    this.selectedUserEmail = userEmail;
  },
  
  createUser() {
    const name = document.getElementById('input-name').value.trim();
    const pin = document.getElementById('input-pin').value.trim();
    
    if (!name) {
      alert('Ingresa tu nombre');
      return;
    }
    
    if (pin.length !== 4) {
      alert('El PIN debe tener exactamente 4 digitos');
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      alert('El PIN debe contener solo numeros');
      return;
    }
    
    const users = this.getUsers();
    
    if (users.length >= MAX_USERS) {
      alert('Maximo 3 usuarios');
      return;
    }
    
    const email = name.toLowerCase().replace(/\s+/g, '') + '@finanzas.local';
    
    if (users.find(u => u.email === email)) {
      alert('Ya existe un usuario con ese nombre');
      return;
    }
    
    const newUser = {
      name: name,
      email: email,
      pin: pin,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    localStorage.setItem(CURRENT_USER_KEY, email);
    AppState.setUser(newUser);
    
    this.showApp();
    
    setTimeout(() => {
      alert('Usuario creado: ' + name);
    }, 300);
  },
  
  selectUser(email) {
    this.showPinForm(email);
  },
  
  loginWithPin() {
    const pin = document.getElementById('input-pin-login').value.trim();
    const users = this.getUsers();
    const user = users.find(u => u.email === this.selectedUserEmail);
    
    if (!user) return;
    
    if (pin !== user.pin) {
      alert('PIN incorrecto');
      document.getElementById('input-pin-login').value = '';
      return;
    }
    
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);
    
    localStorage.setItem(CURRENT_USER_KEY, user.email);
    AppState.setUser(user);
    
    this.showApp();
  },
  
  deleteUser(email) {
    if (!confirm('¿Eliminar este usuario? Se borraran todos sus datos.')) {
      return;
    }
    
    let users = this.getUsers();
    users = users.filter(u => u.email !== email);
    this.saveUsers(users);
    
    this.renderUsersList();
    alert('Usuario eliminado');
  },
  
  logout() {
    if (!confirm('¿Cerrar sesion?')) return;
    
    localStorage.removeItem(CURRENT_USER_KEY);
    AppState.setUser(null);
    this.showLogin();
  }
};

window.Auth = Auth;
