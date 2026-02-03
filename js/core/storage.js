// FINANZAS PRO V5.0 - STORAGE

import { AppState } from './state.js';

const STORAGE_KEY = 'finanzas-pro-v5';

export const Storage = {
  
  async load() {
    try {
      console.log('Cargando datos desde localStorage...');
      const data = localStorage.getItem(STORAGE_KEY);
      
      if (data) {
        const parsed = JSON.parse(data);
        console.log('Datos cargados exitosamente');
        return parsed;
      }
      
      console.log('No hay datos previos, iniciando con estructura vacia');
      return this.getEmptyDatabase();
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      return this.getEmptyDatabase();
    }
  },
  
  async save(data) {
    try {
      console.log('Guardando datos en localStorage...');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Datos guardados exitosamente');
      AppState.markSaved();
      return true;
    } catch (error) {
      console.error('Error al guardar datos:', error);
      return false;
    }
  },
  
  async getMonthData(year, month) {
    const allData = await this.load();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (allData.months && allData.months[monthKey]) {
      return allData.months[monthKey];
    }
    
    return this.createNewMonth(allData, year, month);
  },
  
  async saveMonthData(year, month, monthData) {
    const allData = await this.load();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (!allData.months) {
      allData.months = {};
    }
    
    allData.months[monthKey] = monthData;
    return await this.save(allData);
  },
  
  getEmptyDatabase() {
    return {
      user: null,
      months: {}
    };
  },
  
  createNewMonth(allData, year, month) {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    const newMonth = {
      income: [],
      services: [],
      cards: [],
      loans: [],
      expenses: [],
      savings: {
        opening: 0,
        goal: 0,
        transactions: []
      },
      payments: {},
      cardSettings: {}
    };
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
    
    if (allData.months && allData.months[prevKey]) {
      const prevData = allData.months[prevKey];
      
      if (prevData.services) {
        newMonth.services = prevData.services.map((service, i) => ({
          ...service,
          id: Date.now() + i,
          paid: false
        }));
      }
      
      if (prevData.cards) {
        newMonth.cards = prevData.cards.map((card, i) => ({
          ...card,
          id: Date.now() + 100 + i
        }));
      }
      
      if (prevData.loans) {
        newMonth.loans = prevData.loans
          .filter(loan => loan.status !== 'liquidado')
          .map((loan, i) => ({
            ...loan,
            id: Date.now() + 200 + i
          }));
      }
      
      if (prevData.savings) {
        const prevBalance = prevData.savings.opening + 
          prevData.savings.transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
        
        newMonth.savings.opening = prevBalance;
        newMonth.savings.goal = prevData.savings.goal || 0;
      }
    }
    
    return newMonth;
  },
  
  async reset() {
    try {
      console.log('Borrando todos los datos...');
      localStorage.removeItem(STORAGE_KEY);
      console.log('Datos borrados exitosamente');
      return true;
    } catch (error) {
      console.error('Error al borrar datos:', error);
      return false;
    }
  },
  
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
    console.log('Datos exportados exitosamente');
  },
  
  async import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await this.save(data);
          console.log('Datos importados exitosamente');
          resolve(true);
        } catch (error) {
          console.error('Error al importar datos:', error);
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

export default Storage;
