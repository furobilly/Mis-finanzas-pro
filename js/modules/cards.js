// ===================================
// FINANZAS PRO V5.0 - TARJETAS
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';

export const Cards = {
  
  // Agregar tarjeta
  async add(alias, bank, last4, limit, cutDay, paymentDay) {
    if (!alias || !bank || !paymentDay) {
      alert('Por favor completa alias, banco y día de pago');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newCard = {
      id: Date.now(),
      alias: alias.trim(),
      bank: bank.trim(),
      last4: last4 || '',
      limit: parseFloat(limit) || 0,
      cutDay: parseInt(cutDay) || 1,
      paymentDay: parseInt(paymentDay)
    };
    
    monthData.cards.push(newCard);
    
    // Inicializar monto de pago en 0
    monthData.cardAmounts[newCard.id] = 0;
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Tarjeta agregada:', newCard);
    return true;
  },
  
  // Editar tarjeta
  async edit(id, alias, bank, last4, limit, cutDay, paymentDay) {
    const monthData = AppState.currentMonthData;
    const index = monthData.cards.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Tarjeta no encontrada');
      return false;
    }
    
    monthData.cards[index] = {
      id,
      alias: alias.trim(),
      bank: bank.trim(),
      last4: last4 || '',
      limit: parseFloat(limit) || 0,
      cutDay: parseInt(cutDay) || 1,
      paymentDay: parseInt(paymentDay)
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Tarjeta editada');
    return true;
  },
  
  // Eliminar tarjeta
  async delete(id) {
    const confirmed = confirm('¿Eliminar esta tarjeta?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.cards = monthData.cards.filter(item => item.id !== id);
    
    // Eliminar monto asociado
    delete monthData.cardAmounts[id];
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Tarjeta eliminada');
    return true;
  },
  
  // Actualizar monto de pago de tarjeta
  updateAmount(id, amount) {
    const monthData = AppState.currentMonthData;
    monthData.cardAmounts[id] = parseFloat(amount) || 0;
    AppState.markUnsaved();
  },
  
  // Guardar cambios
  async save() {
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      AppState.currentMonthData
    );
    AppState.markSaved();
    return true;
  },
  
  // Obtener todas las tarjetas
  getAll() {
    return AppState.currentMonthData?.cards || [];
  },
  
  // Obtener monto de pago de una tarjeta
  getAmount(id) {
    const monthData = AppState.currentMonthData;
    return monthData?.cardAmounts?.[id] || 0;
  },
  
  // Calcular total de pagos de tarjetas
  getTotal() {
    const monthData = AppState.currentMonthData;
    const amounts = monthData?.cardAmounts || {};
    return Object.values(amounts).reduce((sum, amount) => sum + amount, 0);
  }
};

export default Cards;
```

**PASO 4:** Commit: `Crear módulo de tarjetas`

---

## 📊 PROGRESO: 80% ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
✅ js/modules/ (5 archivos - faltan 2)
⬜ js/ui/ (3 archivos)
⬜ js/app.js
⬜ index.html
