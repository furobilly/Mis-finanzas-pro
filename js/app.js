// ===================================
// FINANZAS PRO V5.0 - APLICACIÓN PRINCIPAL
// ===================================

import { CONFIG, getRandomTip } from './core/config.js';
import { AppState } from './core/state.js';
import { Storage } from './core/storage.js';
import { Auth } from './modules/auth.js';
import { Navigation } from './ui/navigation.js';
import { Dashboard } from './ui/dashboard.js';
import { Alerts } from './ui/alerts.js';

// Aplicación Principal
class FinanzasProApp {
  
  constructor() {
    console.log('💎 Finanzas Pro v5.0 - Iniciando...');
    this.init();
  }
  
  async init() {
    try {
      // 1. Inicializar estado
      AppState.init();
      
      // 2. Inicializar autenticación
      Auth.init();
      
      // 3. Inicializar selectores de año/mes
      this.initSelectors();
      
      // 4. Cargar datos del mes actual
      await this.loadMonthData();
      
      // 5. Inicializar navegación
      Navigation.init();
      
      // 6. Mostrar tip del día
      this.showTip();
      
      // 7. Inicializar botón de guardar
      this.initSaveButton();
      
      // 8. Inicializar botón de exportar
      this.initExportButton();
      
      console.log('✅ Aplicación inicializada correctamente');
      
    } catch (error) {
      console.error('❌ Error al inicializar aplicación:', error);
      Alerts.error('Error al inicializar la aplicación');
    }
  }
  
  // Inicializar selectores de año y mes
  initSelectors() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    
    if (!yearSelector || !monthSelector) return;
    
    // Llenar años
    CONFIG.YEARS.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === AppState.currentYear) option.selected = true;
      yearSelector.appendChild(option);
    });
    
    // Llenar meses
    CONFIG.MONTHS.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = month;
      if (index === AppState.currentMonth) option.selected = true;
      monthSelector.appendChild(option);
    });
    
    // Event listeners
    yearSelector.addEventListener('change', () => this.onPeriodChange());
    monthSelector.addEventListener('change', () => this.onPeriodChange());
  }
  
  // Cuando cambia el período (año/mes)
  async onPeriodChange() {
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    
    const newYear = parseInt(yearSelector.value);
    const newMonth = parseInt(monthSelector.value);
    
    AppState.setYearMonth(newYear, newMonth);
    
    await this.loadMonthData();
    
    // Re-renderizar vista actual
    Navigation.renderView(Navigation.currentView);
    
    Alerts.success(`Cambiado a ${CONFIG.MONTHS[newMonth]} ${newYear}`);
  }
  
  // Cargar datos del mes actual
  async loadMonthData() {
    console.log('📁 Cargando datos del mes...');
    
    const monthData = await Storage.getMonthData(
      AppState.currentYear,
      AppState.currentMonth
    );
    
    AppState.currentMonthData = monthData;
    
    console.log('✅ Datos del mes cargados');
  }
  
  // Mostrar tip del día
  showTip() {
    const tipElement = document.getElementById('tip-text');
    if (tipElement) {
      tipElement.textContent = getRandomTip();
    }
  }
  
  // Inicializar botón de guardar cambios
  initSaveButton() {
    const saveButton = document.getElementById('btn-save-changes');
    if (!saveButton) return;
    
    saveButton.addEventListener('click', async () => {
      await this.saveChanges();
    });
  }
  
  // Guardar cambios
  async saveChanges() {
    try {
      await Storage.saveMonthData(
        AppState.currentYear,
        AppState.currentMonth,
        AppState.currentMonthData
      );
      
      AppState.markSaved();
      Alerts.success('¡Cambios guardados correctamente!');
      
      // Re-renderizar
      Navigation.renderView(Navigation.currentView);
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      Alerts.error('Error al guardar los cambios');
    }
  }
  
  // Inicializar botón de exportar
  initExportButton() {
    const exportButton = document.getElementById('btn-export');
    if (!exportButton) return;
    
    exportButton.addEventListener('click', () => {
      Storage.export();
      Alerts.success('Datos exportados correctamente');
    });
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FinanzasProApp();
  });
} else {
  new FinanzasProApp();
}

// Exportar para debugging
window.FinanzasProApp = FinanzasProApp;
window.AppState = AppState;
window.Storage = Storage;
```

**PASO 5:** Commit: `Crear aplicación principal`

---

## 🎊 PROGRESO: 98% - ¡SOLO FALTA EL INDEX.HTML! ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
✅ js/modules/ (7 archivos)
✅ js/ui/ (3 archivos)
✅ js/app.js
⬜ index.html (ÚLTIMO ARCHIVO)
