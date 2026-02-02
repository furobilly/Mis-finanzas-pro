// ===================================
// FINANZAS PRO V5.0 - CONFIGURACIÓN
// ===================================

export const CONFIG = {
  APP_NAME: 'Finanzas Pro',
  VERSION: '5.0',
  MAX_USERS: 3,
  
  // Tips financieros
  TIPS: [
    'Ahorra el 10% de tu ingreso apenas lo recibas.',
    'El interés compuesto es la octava maravilla del mundo.',
    'Evita los gastos hormiga: ese café diario suma miles al año.',
    'Antes de comprar algo, espera 24 horas para evitar impulsos.',
    'Invierte en tu educación financiera.',
    'No pongas todos los huevos en la misma canasta.',
    'El presupuesto no es para limitarte, es para darte libertad.',
    'Paga tus deudas de mayor interés primero.',
    'Tener un fondo de emergencia te da paz mental.',
    'Automatiza tus ahorros para no olvidarlo.',
    'Revisa tus suscripciones, seguro hay una que no usas.',
    'Tu salud es tu mayor activo financiero.',
    'Define metas claras: ¿Para qué estás ahorrando hoy?',
    'Lo que no se mide, no se puede mejorar.'
  ],
  
  // Iconos por palabra clave
  ICONS: {
    // Hogar
    'renta': '🏠',
    'alquiler': '🏠',
    'hipoteca': '🏠',
    
    // Servicios
    'luz': '💡',
    'electricidad': '💡',
    'agua': '💧',
    'gas': '🔥',
    
    // Internet
    'internet': '🌐',
    'wifi': '📶',
    'telefono': '📱',
    'celular': '📱',
    
    // Streaming
    'netflix': '📺',
    'youtube': '📺',
    'disney': '🎬',
    'spotify': '🎵',
    'amazon prime': '📦',
    
    // Otros
    'seguro': '🛡️',
    'basura': '🗑️',
    'predial': '🏛️',
    'colegio': '🎓',
    'escuela': '🎓',
    
    // Transporte
    'uber': '🚗',
    'gasolina': '⛽',
    'auto': '🚗',
    'coche': '🚗',
    
    // Comida
    'super': '🛒',
    'walmart': '🛒',
    'soriana': '🛒',
    'restaurant': '🍽️',
    'comida': '🍔'
  },
  
  // Categorías de gastos
  EXPENSE_CATEGORIES: {
    'alimentacion': { name: 'Alimentación', icon: '🍔' },
    'transporte': { name: 'Transporte', icon: '🚗' },
    'entretenimiento': { name: 'Entretenimiento', icon: '🎬' },
    'salud': { name: 'Salud', icon: '🏥' },
    'educacion': { name: 'Educación', icon: '📚' },
    'hogar': { name: 'Hogar', icon: '🏠' },
    'otros': { name: 'Otros', icon: '📌' }
  },
  
  // Meses
  MONTHS: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  
  // Años disponibles
  YEARS: Array.from({ length: 11 }, (_, i) => 2024 + i) // 2024-2034
};

// Función para detectar icono según texto
export function detectIcon(text, category = null) {
  if (!text) return '📌';
  
  const lowerText = text.toLowerCase();
  
  // Buscar en iconos predefinidos
  for (const [keyword, icon] of Object.entries(CONFIG.ICONS)) {
    if (lowerText.includes(keyword)) {
      return icon;
    }
  }
  
  // Si hay categoría, usar su icono
  if (category && CONFIG.EXPENSE_CATEGORIES[category]) {
    return CONFIG.EXPENSE_CATEGORIES[category].icon;
  }
  
  return '📌';
}

// Función para obtener tip aleatorio
export function getRandomTip() {
  const randomIndex = Math.floor(Math.random() * CONFIG.TIPS.length);
  return CONFIG.TIPS[randomIndex];
}

// Función para formatear moneda
export function formatMoney(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount || 0);
}

// Función para obtener fecha de hoy
export function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Función para determinar quincena según día
export function getQuincena(day) {
  return day <= 14 ? 1 : 2;
}
```

5. Commit message: `Crear configuración del sistema`
6. Commit

---

## 📊 PROGRESO: 55% ✅
```
✅ css/ (completo)
⏳ js/core/config.js (creando ahora)
⬜ js/core/state.js
⬜ js/core/storage.js
⬜ js/modules/ (7 archivos)
⬜ js/ui/ (3 archivos)
⬜ js/app.js
⬜ index.html
