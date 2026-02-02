// ===================================
// FINANZAS PRO V5.0 - INGRESOS
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { formatMoney, getToday } from '../core/config.js';

export const Income = {
  
  // Agregar ingreso
  async add(description, amount, date) {
    if (!description || !amount) {
      alert('Por favor completa descripción y monto');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newIncome = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: date || getToday()
    };
    
    monthData.income.push(newIncome);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Ingreso agregado:', newIncome);
    return true;
  },
  
  // Editar ingreso
  async edit(id, description, amount, date) {
    const monthData = AppState.currentMonthData;
    const index = monthData.income.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Ingreso no encontrado');
      return false;
    }
    
    monthData.income[index] = {
      id,
      description: description.trim(),
      amount: parseFloat(amount),
      date: date || monthData.income[index].date
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Ingreso editado');
    return true;
  },
  
  // Eliminar ingreso
  async delete(id) {
    const confirmed = confirm('¿Eliminar este ingreso?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.income = monthData.income.filter(item => item.id !== id);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Ingreso eliminado');
    return true;
  },
  
  // Obtener todos los ingresos del mes
  getAll() {
    return AppState.currentMonthData?.income || [];
  },
  
  // Calcular total de ingresos
  getTotal() {
    const income = this.getAll();
    return income.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
};

export default Income;
```

**PASO 4:** Commit: `Crear módulo de ingresos`

---

## 📄 CREAR `js/modules/expenses.js` (Gastos Variables)

**Ahora sin salir, crea el siguiente:**

**PASO 1:** **"Add file"** → **"Create new file"**

**PASO 2:** Nombre:
```
expenses.js
