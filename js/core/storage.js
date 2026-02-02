// ===================================
// FINANZAS PRO V5.0 - STORAGE
// ===================================

import { AppState } from './state.js';

const STORAGE_KEY = 'finanzas-pro-v5';

// Sistema de almacenamiento
export const Storage = {
  
  // Cargar todos los datos
  async load() {
    try {
      console.log('💾 Cargando datos desde localStorage...');
      const data = localStorage.getItem(STORAGE_KEY);
      
      if (data) {
        const parsed = JSON.parse(data);
        console.log('✅ Datos cargados exitosamente');
        return parsed;
      }
      
      console.log('📝 No hay datos previos, iniciando con estructura vacía');
      return this.getEmptyDatabase();
      
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      return this.getEmptyDatabase();
    }
  },
  
  // Guardar todos los datos
  async save(data) {
    try {
      console.log('💾 Guardando datos en localStorage...');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('✅ Datos guardados exitosamente');
      AppState.markSaved();
      return true;
    } catch (error) {
      console.error('❌ Error al guardar datos:', error);
      return false;
    }
  },
  
  // Obtener datos de un mes específico
  async getMonthData(year, month) {
    const allData = await this.load();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (allData.months && allData.months[monthKey]) {
      return allData.months[monthKey];
    }
    
    // Si no existe, crear mes nuevo con rollover
    return this.createNewMonth(allData, year, month);
  },
  
  // Guardar datos de un mes específico
  async saveMonthData(year, month, monthData) {
    const allData = await this.load();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (!allData.months) {
      allData.months = {};
    }
    
    allData.months[monthKey] = monthData;
    return await this.save(allData);
  },
  
  // Crear estructura de base de datos vacía
  getEmptyDatabase() {
    return {
      user: null,
      months: {}
    };
  },
  
  // Crear nuevo mes con rollover del anterior
  createNewMonth(allData, year, month) {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    // Mes vacío por defecto
    const newMonth = {
      income: [],
      services: [],
      cards: [],
      loans: [],
      expenses: [],
      savings: [],
      payments: {},
      cardAmounts: {}
    };
    
    // Buscar mes anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
    
    if (allData.months && allData.months[prevKey]) {
      const prevData = allData.months[prevKey];
      
      // Rollover de servicios
      if (prevData.services) {
        newMonth.services = prevData.services.map(service => ({
          ...service,
          id: Date.now() + Math.random(), // Nuevo ID
          paid: false // Reset estado de pago
        }));
      }
      
      // Rollover de tarjetas
      if (prevData.cards) {
        newMonth.cards = prevData.cards.map(card => ({
          ...card,
          id: Date.now() + Math.random()
        }));
      }
      
      // Rollover de préstamos activos
      if (prevData.loans) {
        newMonth.loans = prevData.loans
          .filter(loan => loan.paidPayments < loan.totalPayments)
          .map(loan => ({
            ...loan,
            id: Date.now() + Math.random(),
            paidPayments: loan.paidPayments + 1 // Incrementar pagos
          }));
      }
      
      // Rollover de saldo de ahorros
      if (prevData.savings && prevData.savings.length > 0) {
        const totalSavings = prevData.savings.reduce((sum, item) => {
          return sum + (item.type === 'in' ? item.amount : -item.amount);
        }, 0);
        
        // Crear movimiento de apertura
        newMonth.savings = [{
          id: Date.now(),
          date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
          description: 'Saldo inicial del mes anterior',
          type: 'in',
          amount: totalSavings
        }];
      }
    }
    
    return newMonth;
  },
  
  // Borrar todos los datos (reset)
  async reset() {
    try {
      console.log('🗑️ Borrando todos los datos...');
      localStorage.removeItem(STORAGE_KEY);
      console.log('✅ Datos borrados exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al borrar datos:', error);
      return false;
    }
  },
  
  // Exportar datos como JSON
  async export() {
    const data = await this.load();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas-pro-backup-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('📦 Datos exportados exitosamente');
  },
  
  // Importar datos desde JSON
  async import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await this.save(data);
          console.log('📥 Datos importados exitosamente');
          resolve(true);
        } catch (error) {
          console.error('❌ Error al importar datos:', error);
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

export default Storage;
```

**PASO 4:** Commit message: `Crear sistema de almacenamiento`

**PASO 5:** Commit

---

## 🎉 PROGRESO: 65% - CORE COMPLETO! ✅
```
✅ css/ (completo - 4 archivos)
✅ js/core/ (completo - 3 archivos)
⬜ js/modules/ (7 archivos pendientes)
⬜ js/ui/ (3 archivos pendientes)
⬜ js/app.js
⬜ index.html
