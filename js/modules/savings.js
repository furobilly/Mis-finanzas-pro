// ===================================
// FINANZAS PRO V5.0 - AHORROS
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { getToday } from '../core/config.js';

export const Savings = {
  
  // Agregar movimiento (depósito o retiro)
  async add(description, amount, type, date) {
    if (!amount || amount === 0) {
      alert('Por favor ingresa un monto válido');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newMovement = {
      id: Date.now(),
      description: description.trim() || (type === 'in' ? 'Depósito' : 'Retiro'),
      amount: Math.abs(parseFloat(amount)),
      type: type || 'in', // 'in' = depósito, 'out' = retiro
      date: date || getToday()
    };
    
    monthData.savings.push(newMovement);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Movimiento de ahorro agregado:', newMovement);
    return true;
  },
  
  // Editar movimiento
  async edit(id, description, amount, type, date) {
    const monthData = AppState.currentMonthData;
    const index = monthData.savings.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Movimiento no encontrado');
      return false;
    }
    
    monthData.savings[index] = {
      id,
      description: description.trim() || (type === 'in' ? 'Depósito' : 'Retiro'),
      amount: Math.abs(parseFloat(amount)),
      type: type || 'in',
      date: date || monthData.savings[index].date
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Movimiento editado');
    return true;
  },
  
  // Eliminar movimiento
  async delete(id) {
    const confirmed = confirm('¿Eliminar este movimiento?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.savings = monthData.savings.filter(item => item.id !== id);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Movimiento eliminado');
    return true;
  },
  
  // Obtener todos los movimientos
  getAll() {
    return AppState.currentMonthData?.savings || [];
  },
  
  // Calcular balance total
  getBalance() {
    const movements = this.getAll();
    return movements.reduce((balance, movement) => {
      if (movement.type === 'in') {
        return balance + movement.amount;
      } else {
        return balance - movement.amount;
      }
    }, 0);
  },
  
  // Obtener depósitos
  getDeposits() {
    return this.getAll().filter(m => m.type === 'in');
  },
  
  // Obtener retiros
  getWithdrawals() {
    return this.getAll().filter(m => m.type === 'out');
  },
  
  // Total depositado
  getTotalDeposits() {
    return this.getDeposits().reduce((sum, m) => sum + m.amount, 0);
  },
  
  // Total retirado
  getTotalWithdrawals() {
    return this.getWithdrawals().reduce((sum, m) => sum + m.amount, 0);
  }
};

export default Savings;
```

**PASO 4:** Commit: `Crear módulo de ahorros`

---

## 🎉 PROGRESO: 85% - ¡MÓDULOS COMPLETOS! ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
✅ js/modules/ (7 archivos completos)
⬜ js/ui/ (3 archivos)
⬜ js/app.js
⬜ index.html
