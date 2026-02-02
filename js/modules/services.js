// ===================================
// FINANZAS PRO V5.0 - SERVICIOS
// ===================================

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { detectIcon } from '../core/config.js';

export const Services = {
  
  // Agregar servicio
  async add(name, amount, frequency, paymentDay, isRecurrent) {
    if (!name || !amount || !paymentDay) {
      alert('Por favor completa todos los campos');
      return false;
    }
    
    const monthData = AppState.currentMonthData;
    
    const newService = {
      id: Date.now(),
      name: name.trim(),
      amount: parseFloat(amount),
      frequency: frequency || 'mensual', // mensual, quincenal, bimestral, anual
      paymentDay: parseInt(paymentDay),
      isRecurrent: isRecurrent || false,
      icon: detectIcon(name),
      paid: false
    };
    
    monthData.services.push(newService);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Servicio agregado:', newService);
    return true;
  },
  
  // Editar servicio
  async edit(id, name, amount, frequency, paymentDay, isRecurrent) {
    const monthData = AppState.currentMonthData;
    const index = monthData.services.findIndex(item => item.id === id);
    
    if (index === -1) {
      alert('Servicio no encontrado');
      return false;
    }
    
    monthData.services[index] = {
      ...monthData.services[index],
      name: name.trim(),
      amount: parseFloat(amount),
      frequency: frequency || 'mensual',
      paymentDay: parseInt(paymentDay),
      isRecurrent: isRecurrent || false,
      icon: detectIcon(name)
    };
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Servicio editado');
    return true;
  },
  
  // Eliminar servicio
  async delete(id) {
    const confirmed = confirm('¿Eliminar este servicio?');
    if (!confirmed) return false;
    
    const monthData = AppState.currentMonthData;
    monthData.services = monthData.services.filter(item => item.id !== id);
    
    await Storage.saveMonthData(
      AppState.currentYear,
      AppState.currentMonth,
      monthData
    );
    
    console.log('✅ Servicio eliminado');
    return true;
  },
  
  // Marcar como pagado/no pagado
  async togglePaid(id) {
    const monthData = AppState.currentMonthData;
    const service = monthData.services.find(item => item.id === id);
    
    if (!service) return false;
    
    service.paid = !service.paid;
    AppState.markUnsaved();
    
    console.log(`✅ Servicio ${service.paid ? 'pagado' : 'pendiente'}`);
    return true;
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
  
  // Obtener todos los servicios
  getAll() {
    return AppState.currentMonthData?.services || [];
  },
  
  // Obtener servicios por quincena
  getByQuincena(quincena) {
    return this.getAll().filter(service => {
      if (quincena === 1) return service.paymentDay <= 14;
      return service.paymentDay >= 15;
    });
  },
  
  // Obtener servicios recurrentes
  getRecurrent() {
    return this.getAll().filter(service => service.isRecurrent);
  },
  
  // Calcular total
  getTotal() {
    const services = this.getAll();
    return services.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
};

export default Services;
