// ===================================
// FINANZAS PRO V5.0 - GASTOS VARIABLES
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { CONFIG, getToday } from '../core/config.js';

export const Expenses = {
  
  // Agregar gasto
  async add(description, amount, category, date) {
    if (!description || !amount) {
      alert('Por favor completa descripción y monto');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: category || 'otros',
      date: date || getToday()
    };
    
    monthData.expenses.push(newExpense);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Gasto agregado:', newExpense);
    return true;
  },
  
  // Editar gasto
  async edit(id, description, amount, category, date) {
    const monthData = AppState.currentMonthData;
    const index = monthData.expenses.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Gasto no encontrado');
      return false;
    }
    
    monthData.expenses[index] = {
      id,
      description: description.trim(),
      amount: parseFloat(amount),
      category: category || 'otros',
      date: date || monthData.expenses[index].date
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Gasto editado');
    return true;
  },
  
  // Eliminar gasto
  async delete(id) {
    const confirmed = confirm('¿Eliminar este gasto?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.expenses = monthData.expenses.filter(item => item.id !== id);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Gasto eliminado');
    return true;
  },
  
  // Obtener todos los gastos
  getAll() {
    return AppState.currentMonthData?.expenses || [];
  },
  
  // Obtener gastos por categoría
  getByCategory(category) {
    return this.getAll().filter(item => item.category === category);
  },
  
  // Calcular total
  getTotal() {
    const expenses = this.getAll();
    return expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  },
  
  // Calcular total por categoría
  getTotalByCategory() {
    const expenses = this.getAll();
    const totals = {};
    
    expenses.forEach(expense => {
      const cat = expense.category || 'otros';
      totals[cat] = (totals[cat] || 0) + expense.amount;
    });
    
    return totals;
  }
};

export default Expenses;
```

**PASO 4:** Commit message: `Crear módulo de gastos variables`

**PASO 5:** Commit

---

## 📊 AHORA TENDRÁS:
```
📁 js/modules/
├── auth.js ✅
├── income.js ✅
└── expenses.js ⏳ (creando ahora)
