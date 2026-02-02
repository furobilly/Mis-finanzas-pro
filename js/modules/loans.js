// ===================================
// FINANZAS PRO V5.0 - PRÉSTAMOS
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';

export const Loans = {
  
  // Agregar préstamo
  async add(name, totalAmount, paymentAmount, frequency, paymentDay, totalPayments, paidPayments) {
    if (!name || !paymentAmount || !paymentDay) {
      alert('Por favor completa nombre, monto de pago y día de pago');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newLoan = {
      id: Date.now(),
      name: name.trim(),
      totalAmount: parseFloat(totalAmount) || 0,
      paymentAmount: parseFloat(paymentAmount),
      frequency: frequency || 'mensual', // mensual, quincenal, pago_unico
      paymentDay: parseInt(paymentDay),
      totalPayments: parseInt(totalPayments) || 1,
      paidPayments: parseInt(paidPayments) || 0
    };
    
    monthData.loans.push(newLoan);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Préstamo agregado:', newLoan);
    return true;
  },
  
  // Editar préstamo
  async edit(id, name, totalAmount, paymentAmount, frequency, paymentDay, totalPayments, paidPayments) {
    const monthData = AppState.currentMonthData;
    const index = monthData.loans.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Préstamo no encontrado');
      return false;
    }
    
    monthData.loans[index] = {
      id,
      name: name.trim(),
      totalAmount: parseFloat(totalAmount) || 0,
      paymentAmount: parseFloat(paymentAmount),
      frequency: frequency || 'mensual',
      paymentDay: parseInt(paymentDay),
      totalPayments: parseInt(totalPayments) || 1,
      paidPayments: parseInt(paidPayments) || 0
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Préstamo editado');
    return true;
  },
  
  // Eliminar préstamo
  async delete(id) {
    const confirmed = confirm('¿Eliminar este préstamo?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.loans = monthData.loans.filter(item => item.id !== id);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Préstamo eliminado');
    return true;
  },
  
  // Marcar pago realizado
  async markPayment(id) {
    const monthData = AppState.currentMonthData;
    const loan = monthData.loans.find(item => item.id === id);
    
    if (!loan) return false;
    
    if (loan.paidPayments < loan.totalPayments) {
      loan.paidPayments++;
      
      await Storage.saveMonthData(
        AppState.currentYear,
        AppState.currentMonth,
        monthData
      );
      
      console.log(`✅ Pago registrado. ${loan.paidPayments}/${loan.totalPayments}`);
      return true;
    }
    
    return false;
  },
  
  // Obtener todos los préstamos
  getAll() {
    return AppState.currentMonthData?.loans || [];
  },
  
  // Obtener préstamos activos (no liquidados)
  getActive() {
    return this.getAll().filter(loan => loan.paidPayments < loan.totalPayments);
  },
  
  // Obtener préstamos liquidados
  getLiquidated() {
    return this.getAll().filter(loan => loan.paidPayments >= loan.totalPayments);
  },
  
  // Calcular progreso de un préstamo
  getProgress(loan) {
    if (!loan || loan.totalPayments === 0) return 0;
    return Math.round((loan.paidPayments / loan.totalPayments) * 100);
  },
  
  // Calcular monto restante
  getRemaining(loan) {
    if (!loan) return 0;
    const remainingPayments = loan.totalPayments - loan.paidPayments;
    return remainingPayments * loan.paymentAmount;
  },
  
  // Calcular total de pagos del mes
  getTotal() {
    const activeLoans = this.getActive();
    return activeLoans.reduce((sum, loan) => sum + loan.paymentAmount, 0);
  }
};

export default Loans;
