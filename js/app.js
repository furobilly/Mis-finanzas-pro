import { CONFIG, getRandomTip } from './core/config.js';
import { AppState } from './core/state.js';
import { Storage } from './core/storage.js';
import { Auth } from './modules/auth.js';
import { Navigation } from './ui/navigation.js';
import { Alerts } from './ui/alerts.js';

class FinanzasProApp {
  
  constructor() {
    console.log('Iniciando aplicacion...');
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
      this.initButtons();
      console.log('App inicializada');
    } catch (error) {
      console.error('Error:', error);
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
  }
  
  async loadMonthData() {
    const monthData = await Storage.getMonthData(AppState.currentYear, AppState.currentMonth);
    AppState.currentMonthData = monthData;
  }
  
  showTip() {
    const tipElement = document.getElementById('tip-text');
    if (tipElement) {
      tipElement.textContent = getRandomTip();
    }
  }
  
  initButtons() {
    const saveButton = document.getElementById('btn-save-changes');
    if (saveButton) {
      saveButton.addEventListener('click', async () => {
        await this.saveChanges();
      });
    }
    
    const exportButton = document.getElementById('btn-export');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        Storage.export();
      });
    }
  }
  
  async saveChanges() {
    try {
      await Storage.saveMonthData(AppState.currentYear, AppState.currentMonth, AppState.currentMonthData);
      AppState.markSaved();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FinanzasProApp();
  });
} else {
  new FinanzasProApp();
}
