// CONFIGURACION GLOBAL

export const CONFIG = {
  APP_NAME: 'Finanzas Pro',
  VERSION: '5.0',
  STORAGE_KEY: 'finanzas-pro-v5',
  
  MONTHS: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  
  INCOME_CATEGORIES: {
    sueldo: { name: 'Sueldo', icon: '💼' },
    bono: { name: 'Bono', icon: '🎁' },
    freelance: { name: 'Freelance', icon: '💻' },
    inversion: { name: 'Inversión', icon: '📈' },
    otro: { name: 'Otro', icon: '💰' }
  },
  
  EXPENSE_CATEGORIES: {
    alimentacion: { name: 'Alimentación', icon: '🍔' },
    transporte: { name: 'Transporte', icon: '🚗' },
    entretenimiento: { name: 'Entretenimiento', icon: '🎬' },
    salud: { name: 'Salud', icon: '🏥' },
    educacion: { name: 'Educación', icon: '📚' },
    hogar: { name: 'Hogar', icon: '🏠' },
    otros: { name: 'Otros', icon: '📌' }
  },
  
  formatMoney(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  },
  
  getToday() {
    return new Date().toISOString().slice(0, 10);
  }
};
