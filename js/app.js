// FINANZAS PRO V5.0 - APLICACION PRINCIPAL

import { CONFIG, getRandomTip } from './core/config.js';
import { AppState } from './core/state.js';
import { Storage } from './core/storage.js';
import { Auth } from './modules/auth.js';
import { Navigation } from './ui/navigation.js';
import { Dashboard } from './ui/dashboard.js';
import { Alerts } from './ui/alerts.js';

class FinanzasProApp {
  
  constructor() {
    console.log('Finanzas Pro v5.0 - Iniciando...');
    this.init();
  }
  
  async init() {
    try {
      AppState.init();
      Auth.init();
      this.initSelectors();
      await this.loadMonthData();
      Navigation.init();
      this.showTip();
      this.initSaveButton();
      this.initExportButton();
      
      console.log('Aplicacion inicializada correctamente');
      
    } catch (error) {
      console.error('Error al inicializar aplicacion:', error);
      Alerts.error('Error al inicializar la aplicacion');
    }
  }
  
  initSelectors() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    
    if (!yearSelector || !monthSelector) return;
    
    CONFIG.YEARS.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === AppState.currentYear) option.selected = true;
      yearSelector.appendChild(option);
    });
    
    CONFIG.MONTHS.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = month;
      if (index === AppState.currentMonth) option.selected = true;
      monthSelector.appendChild(option);
    });
    
    yearSelector.addEventListener('change', () => this.onPeriodChange());
    monthSelector.addEventListener('change', () => this.onPeriodChange());
  }
  
  async onPeriodChange() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    
    const newYear = parseInt(yearSelector.value);
    const newMonth = parseInt(monthSelector.value);
    
    AppState.setYearMonth(newYear, newMonth);
    
    await this.loadMonthData();
    Navigation.renderView(Navigation.currentView);
    
    Alerts.success('Cambiado a ' + CONFIG.MONTHS[newMonth] + ' ' + newYear);
  }
  
  async loadMonthData() {
    console.log('Cargando datos del mes...');
    
    const monthData = await Storage.getMonthData(
      AppState.currentYear,
      AppState.currentMonth
    );
    
    AppState.currentMonthData = monthData;
    
    console.log('Datos del mes cargados');
  }
  
  showTip() {
    const tipElement = document.getElementById('tip-text');
    if (tipElement) {
      tipElement.textContent = getRandomTip();
    }
  }
  
  initSaveButton() {
    const saveButton = document.getElementById('btn-save-changes');
    if (!saveButton) return;
    
    saveButton.addEventListener('click', async () => {
      await this.saveChanges();
    });
  }
  
  async saveChanges() {
    try {
      await Storage.saveMonthData(
        AppState.currentYear,
        AppState.currentMonth,
        AppState.currentMonthData
      );
      
      AppState.markSaved();
      Alerts.success('Cambios guardados correctamente');
      
      Navigation.renderView(Navigation.currentView);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      Alerts.error('Error al guardar los cambios');
    }
  }
  
  initExportButton() {
    const exportButton = document.getElementById('btn-export');
    if (!exportButton) return;
    
    exportButton.addEventListener('click', () => {
      Storage.export();
      Alerts.success('Datos exportados correctamente');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FinanzasProApp();
  });
} else {
  new FinanzasProApp();
}

window.FinanzasProApp = FinanzasProApp;
window.AppState = AppState;
window.Storage = Storage;
