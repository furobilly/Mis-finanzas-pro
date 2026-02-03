import { Dashboard } from './dashboard.js';

export const Navigation = {
  
  currentView: 'dashboard',
  
  init() {
    this.setupDesktopNav();
    this.setupMobileNav();
    this.renderView('dashboard');
  },
  
  setupDesktopNav() {
    const navButtons = document.querySelectorAll('#nav-main .nav-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });
  },
  
  setupMobileNav() {
    const navButtons = document.querySelectorAll('#nav-mobile .nav-mobile-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });
  },
  
  switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    const targetView = document.getElementById('view-' + viewName);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-mobile-btn').forEach(b => b.classList.remove('active'));
    
    document.querySelectorAll(`[data-view="${viewName}"]`).forEach(b => {
      b.classList.add('active');
    });
    
    this.currentView = viewName;
    this.renderView(viewName);
  },
  
  renderView(viewName) {
    if (viewName === 'dashboard') {
      Dashboard.render();
    }
  },
  
  toggleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (accordion) {
      accordion.classList.toggle('open');
    }
  }
};

window.FinanzasApp = window.FinanzasApp || {};
window.FinanzasApp.ui = { toggleAccordion: Navigation.toggleAccordion.bind(Navigation) };
