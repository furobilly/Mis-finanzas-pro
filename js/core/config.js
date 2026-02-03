// CONFIGURACION GENERAL

export const CONFIG = {
  APP_NAME: 'Finanzas Pro',
  VERSION: '5.0',
  
  YEARS: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
  
  MONTHS: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  
  TIPS: [
    'Registra todos tus gastos diarios para tener un control total',
    'La regla 50/30/20: 50% necesidades, 30% gustos, 20% ahorros',
    'Paga tus tarjetas de credito a tiempo para evitar intereses',
    'Manten un fondo de emergencia de 3-6 meses de gastos',
    'Automatiza tu ahorro cada quincena',
    'Revisa tus gastos fijos cada 6 meses para encontrar ahorros',
    'Compara precios antes de compras grandes',
    'Evita compras impulsivas esperando 24 horas antes de decidir'
  ],
  
  CATEGORIES: {
    alimentacion: { name: 'Alimentacion', icon: '🍔', color: '#10b981' },
    transporte: { name: 'Transporte', icon: '🚗', color: '#3b82f6' },
    entretenimiento: { name: 'Entretenimiento', icon: '🎬', color: '#8b5cf6' },
    salud: { name: 'Salud', icon: '🏥', color: '#ef4444' },
    educacion: { name: 'Educacion', icon: '📚', color: '#f59e0b' },
    hogar: { name: 'Hogar', icon: '🏠', color: '#06b6d4' },
    otros: { name: 'Otros', icon: '📌', color: '#6b7280' }
  },
  
  ICON_MAP: [
    ['renta', '🏠'],
    ['alquiler', '🏠'],
    ['hipoteca', '🏠'],
    ['luz', '💡'],
    ['electricidad', '💡'],
    ['agua', '💧'],
    ['gas', '🔥'],
    ['internet', '🌐'],
    ['wifi', '📶'],
    ['telefono', '📱'],
    ['celular', '📱'],
    ['netflix', '📺'],
    ['youtube', '📺'],
    ['disney', '🎬'],
    ['spotify', '🎵'],
    ['seguro', '🛡️'],
    ['basura', '🗑️'],
    ['predial', '🏛️'],
    ['colegiatura', '🎓']
  ]
};

export function formatMoney(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount || 0);
}

export function detectIcon(name) {
  if (!name) return '📌';
  
  const searchText = name.toLowerCase();
  
  for (const [keyword, icon] of CONFIG.ICON_MAP) {
    if (searchText.includes(keyword)) {
      return icon;
    }
  }
  
  return '📌';
}

export function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getQuincena(day) {
  const dayNum = parseInt(day);
  return dayNum <= 14 ? 1 : 2;
}

export function getRandomTip() {
  const randomIndex = Math.floor(Math.random() * CONFIG.TIPS.length);
  return CONFIG.TIPS[randomIndex];
}
