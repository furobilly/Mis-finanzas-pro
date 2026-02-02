// ===================================
// FINANZAS PRO V5.0 - NAVEGACIÓN
// ===================================

import { Dashboard } from './dashboard.js';

export const Navigation = {
  
  currentView: 'dashboard',
  
  // Inicializar navegación
  init() {
    console.log('🧭 Inicializando navegación...');
    
    // Botones de navegación principal
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
    
    // Botones de navegación móvil
    const mobileButtons = document.querySelectorAll('.nav-mobile-btn');
    mobileButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.closest('.nav-mobile-btn').dataset.view;
        this.switchView(view);
      });
    });
    
    // Mostrar vista inicial
    this.switchView('dashboard');
  },
  
  // Cambiar de vista
  switchView(viewName) {
    console.log(`🔄 Cambiando a vista: ${viewName}`);
    
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    
    // Mostrar vista seleccionada
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    // Actualizar botones activos (navegación principal)
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      }
    });
    
    // Actualizar botones activos (navegación móvil)
    document.querySelectorAll('.nav-mobile-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      }
    });
    
    // Guardar vista actual
    this.currentView = viewName;
    
    // Renderizar contenido específico de la vista
    this.renderView(viewName);
    
    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  // Renderizar contenido de la vista
  renderView(viewName) {
    switch(viewName) {
      case 'dashboard':
        Dashboard.render();
        break;
      
      case 'income':
        console.log('📊 Vista de ingresos');
        // TODO: Implementar en siguiente fase
        break;
      
      case 'services':
        console.log('🏠 Vista de servicios');
        // TODO: Implementar en siguiente fase
        break;
      
      case 'cards':
        console.log('💳 Vista de tarjetas');
        // TODO: Implementar en siguiente fase
        break;
      
      case 'loans':
        console.log('🏦 Vista de préstamos');
        // TODO: Implementar en siguiente fase
        break;
      
      case 'expenses':
        console.log('🛒 Vista de gastos');
        // TODO: Implementar en siguiente fase
        break;
      
      case 'savings':
        console.log('🛡️ Vista de ahorros');
        // TODO: Implementar en siguiente fase
        break;
    }
  },
  
  // Toggle de acordeón
  toggleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (!accordion) return;
    
    accordion.classList.toggle('open');
  }
};

// Hacer accesible globalmente para onclick en HTML
window.FinanzasApp = window.FinanzasApp || {};
window.FinanzasApp.ui = {
  toggleAccordion: (id) => Navigation.toggleAccordion(id)
};

export default Navigation;
