// ===================================
// FINANZAS PRO V5.0 - ALERTAS
// ===================================

export const Alerts = {
  
  // Mostrar toast notification
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : 
                 type === 'warning' ? '⚠️' : 
                 type === 'error' ? '❌' : 'ℹ️';
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
  
  // Confirmar acción
  confirm(message) {
    return window.confirm(message);
  },
  
  // Prompt para input
  prompt(message, defaultValue = '') {
    return window.prompt(message, defaultValue);
  },
  
  // Alert simple
  alert(message) {
    window.alert(message);
  },
  
  // Toast de éxito
  success(message) {
    this.showToast(message, 'success');
  },
  
  // Toast de error
  error(message) {
    this.showToast(message, 'error');
  },
  
  // Toast de advertencia
  warning(message) {
    this.showToast(message, 'warning');
  },
  
  // Toast de info
  info(message) {
    this.showToast(message, 'info');
  }
};

export default Alerts;
```

**PASO 4:** Commit: `Crear sistema de alertas`

---

## 🎉 PROGRESO: 95% - ¡UI COMPLETA! ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
✅ js/modules/ (7 archivos)
✅ js/ui/ (3 archivos)
⬜ js/app.js (1 archivo)
⬜ index.html (1 archivo)
