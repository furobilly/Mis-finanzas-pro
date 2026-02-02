// ===================================
// FINANZAS PRO V5.0 - STATE MANAGER
// ===================================

import { CONFIG } from './config.js';

// Estado global de la aplicación
export const AppState = {
  // Usuario actual
  currentUser: null,
  
  // Año y mes seleccionados
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  
  // Datos del mes actual
  currentMonthData: null,
  
  // Flag de cambios sin guardar
  hasUnsavedChanges: false,
  
  // Inicializar estado
  init() {
    console.log('🔧 Inicializando estado...');
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
  },
  
  // Establecer usuario actual
  setUser(user) {
    this.currentUser = user;
    console.log('👤 Usuario establecido:', user?.displayName);
  },
  
  // Cambiar año/mes
  setYearMonth(year, month) {
    this.currentYear = year;
    this.currentMonth = month;
    console.log(`📅 Período cambiado: ${CONFIG.MONTHS[month]} ${year}`);
  },
  
  // Obtener clave del mes actual
  getCurrentMonthKey() {
    const monthStr = String(this.currentMonth + 1).padStart(2, '0');
    return `${this.currentYear}-${monthStr}`;
  },
  
  // Marcar cambios sin guardar
  markUnsaved() {
    this.hasUnsavedChanges = true;
    this.showUnsavedBanner();
  },
  
  // Marcar como guardado
  markSaved() {
    this.hasUnsavedChanges = false;
    this.hideUnsavedBanner();
  },
  
  // Mostrar banner de cambios sin guardar
  showUnsavedBanner() {
    const banner = document.getElementById('unsaved-banner');
    if (banner) {
      banner.classList.remove('hidden');
    }
  },
  
  // Ocultar banner
  hideUnsavedBanner() {
    const banner = document.getElementById('unsaved-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  },
  
  // Obtener estructura de datos vacía para un mes
  getEmptyMonthData() {
    return {
      income: [],
      services: [],
      cards: [],
      loans: [],
      expenses: [],
      savings: [],
      payments: {}, // { 'service-123': true/false }
      cardAmounts: {} // { 'card-123': 3500 }
    };
  },
  
  // Calcular totales del mes actual
  calculateTotals() {
    if (!this.currentMonthData) {
      return {
        income: 0,
        expenses: 0,
        fixed: 0,
        balance: 0,
        savings: 0
      };
    }
    
    const data = this.currentMonthData;
    
    // Total ingresos
    const income = data.income.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Total gastos variables
    const expenses = data.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Total gastos fijos (servicios + tarjetas + préstamos)
    let fixed = 0;
    
    // Servicios
    fixed += data.services.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Tarjetas
    fixed += Object.values(data.cardAmounts || {}).reduce((sum, amount) => sum + amount, 0);
    
    // Préstamos
    fixed += data.loans.reduce((sum, item) => {
      if (item.paidPayments < item.totalPayments) {
        return sum + (item.paymentAmount || 0);
      }
      return sum;
    }, 0);
    
    // Balance
    const balance = income - (fixed + expenses);
    
    // Ahorros (suma de movimientos)
    const savings = data.savings.reduce((sum, item) => {
      return sum + (item.type === 'in' ? item.amount : -item.amount);
    }, 0);
    
    return {
      income,
      expenses,
      fixed,
      balance,
      savings
    };
  }
};

// Exportar como default también
export default AppState;
```

**PASO 4:** Commit message: `Crear gestor de estado`

**PASO 5:** Commit

---

## 📊 PROGRESO: 60% ✅
```
✅ css/ (completo)
✅ js/core/config.js
⏳ js/core/state.js (creando ahora)
⬜ js/core/storage.js
