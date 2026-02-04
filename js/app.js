// APP - INICIALIZACION PRINCIPAL

import { CONFIG } from './core/config.js';
import { AppState } from './core/state.js';
import { Storage } from './core/storage.js';
import { Auth } from './modules/auth.js';
import { Income } from './modules/income.js';
import { Alerts } from './ui/alerts.js';
import { Navigation } from './ui/navigation.js';
import { Dashboard } from './ui/dashboard.js';

window.FinanzasApp = {
  state: AppState,
  storage: Storage,
  config: CONFIG,
  ui: {
    alerts: Alerts,
    navigation: Navigation,
    dashboard: Dashboard
  }
};

function setupYearMonthSelectors() {
  const yearSelector = document.getElementById('year-selector');
  const monthSelector = document.getElementById('month-selector');
  
  if (!yearSelector || !monthSelector) return;
  
  yearSelector.innerHTML = '';
  for (let year = 2025; year <= 2035; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === AppState.currentYear) {
      option.selected = true;
    }
    yearSelector.appendChild(option);
  }
  
  monthSelector.innerHTML = '';
  CONFIG.MONTHS.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = month;
    if (index === AppState.currentMonth) {
      option.selected = true;
    }
    monthSelector.appendChild(option);
  });
  
  yearSelector.onchange = () => {
    AppState.currentYear = parseInt(yearSelector.value);
    Storage.loadMonth();
    refreshAllModules();
  };
  
  monthSelector.onchange = () => {
    AppState.currentMonth = parseInt(monthSelector.value);
    Storage.loadMonth();
    refreshAllModules();
  };
}

function setupSaveButton() {
  const btnSave = document.getElementById('btn-save-changes');
  if (btnSave) {
    btnSave.onclick = () => {
      Storage.save();
      Alerts.success('Cambios guardados correctamente');
    };
  }
}

function setupExportButton() {
  const btnExport = document.getElementById('btn-export');
  if (btnExport) {
    btnExport.onclick = () => {
      const data = Storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finanzas-pro-${AppState.currentYear}-${AppState.currentMonth + 1}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Alerts.success('Datos exportados correctamente');
    };
  }
}

function refreshAllModules() {
  if (Income && Income.render) {
    Income.render();
  }
  
  if (Dashboard && Dashboard.renderStats) {
    Dashboard.renderStats();
  }
  
  if (Dashboard && Dashboard.renderQuincenas) {
    Dashboard.renderQuincenas();
  }
}

function init() {
  console.log('Iniciando aplicacion...');
  
  AppState.init();
  Storage.init();
  Auth.init();
  Alerts.init();
  Navigation.init();
  Dashboard.init();
  Income.init();
  
  setupYearMonthSelectors();
  setupSaveButton();
  setupExportButton();
  
  console.log('App inicializada');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
