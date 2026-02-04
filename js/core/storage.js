// STORAGE - PERSISTENCIA DE DATOS

import { AppState } from './state.js';

const STORAGE_KEY = 'finanzas-pro-v5';

export const Storage = {
  
  init() {
    this.loadMonth();
  },
  
  loadMonth() {
    try {
      const allData = localStorage.getItem(STORAGE_KEY);
      if (!allData) {
        this.initializeEmptyMonth();
        return;
      }
      
      const parsed = JSON.parse(allData);
      const monthKey = `${AppState.currentYear}-${String(AppState.currentMonth + 1).padStart(2, '0')}`;
      
      if (parsed[monthKey]) {
        AppState.currentMonthData = parsed[monthKey];
      } else {
        this.initializeEmptyMonth();
        this.rolloverFromPreviousMonth(parsed);
      }
    } catch (error) {
      console.error('Error loading month:', error);
      this.initializeEmptyMonth();
    }
  },
  
  initializeEmptyMonth() {
    AppState.currentMonthData = {
      income: [],
      expenses: [],
      services: [],
      cards: [],
      loans: [],
      savings: {
        opening: 0,
        goal: 0,
        transactions: []
      }
    };
  },
  
  rolloverFromPreviousMonth(allData) {
    const prevMonth = AppState.currentMonth === 0 ? 11 : AppState.currentMonth - 1;
    const prevYear = AppState.currentMonth === 0 ? AppState.currentYear - 1 : AppState.currentYear;
    const prevKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
    
    const prevData = allData[prevKey];
    if (!prevData) return;
    
    if (prevData.services) {
      AppState.currentMonthData.services = prevData.services.map(s => ({
        ...s,
        id: Date.now() + Math.random(),
        paid: false
      }));
    }
    
    if (prevData.cards) {
      AppState.currentMonthData.cards = prevData.cards.map(c => ({
        ...c,
        id: Date.now() + Math.random()
      }));
    }
    
    if (prevData.loans) {
      AppState.currentMonthData.loans = prevData.loans
        .filter(l => l.done < l.total)
        .map(l => ({
          ...l,
          id: Date.now() + Math.random()
        }));
    }
    
    if (prevData.savings) {
      const prevBalance = this.calculateSavingsBalance(prevData.savings);
      AppState.currentMonthData.savings.opening = prevBalance;
      AppState.currentMonthData.savings.goal = prevData.savings.goal || 0;
    }
  },
  
  calculateSavingsBalance(savings) {
    let balance = savings.opening || 0;
    if (savings.transactions) {
      savings.transactions.forEach(tx => {
        balance += tx.amount || 0;
      });
    }
    return balance;
  },
  
  save() {
    try {
      const allData = localStorage.getItem(STORAGE_KEY);
      const parsed = allData ? JSON.parse(allData) : {};
      
      const monthKey = `${AppState.currentYear}-${String(AppState.currentMonth + 1).padStart(2, '0')}`;
      parsed[monthKey] = AppState.currentMonthData;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      AppState.hasUnsavedChanges = false;
      AppState.hideUnsavedBanner();
      
      return true;
    } catch (error) {
      console.error('Error saving:', error);
      return false;
    }
  },
  
  exportData() {
    const allData = localStorage.getItem(STORAGE_KEY);
    return allData || '{}';
  },
  
  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      localStorage.setItem(STORAGE_KEY, jsonString);
      this.loadMonth();
      return true;
    } catch (error) {
      console.error('Error importing:', error);
      return false;
    }
  },
  
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    this.initializeEmptyMonth();
  }
};
