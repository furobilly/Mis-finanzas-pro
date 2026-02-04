// INCOME MODULE - GESTION DE INGRESOS

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { CONFIG } from '../core/config.js';
import { Alerts } from '../ui/alerts.js';

export const Income = {
  
  init() {
    this.setupForm();
    this.render();
  },
  
  setupForm() {
    const btnAdd = document.getElementById('btn-add-income');
    const inputDesc = document.getElementById('income-desc');
    const inputAmount = document.getElementById('income-amount');
    const inputDate = document.getElementById('income-date');
    const inputCategory = document.getElementById('income-category');
    
    if (!btnAdd) return;
    
    inputDate.value = CONFIG.getToday();
    
    btnAdd.onclick = () => {
      const desc = inputDesc.value.trim();
      const amount = parseFloat(inputAmount.value);
      const date = inputDate.value;
      const category = inputCategory.value;
      
      if (!desc) {
        Alerts.warning('Ingresa una descripcion');
        return;
      }
      
      if (!amount || amount <= 0) {
        Alerts.warning('Ingresa un monto valido mayor a 0');
        return;
      }
      
      if (!date) {
        Alerts.warning('Selecciona una fecha');
        return;
      }
      
      this.add(desc, amount, date, category);
      
      inputDesc.value = '';
      inputAmount.value = '';
      inputDate.value = CONFIG.getToday();
      inputCategory.value = 'sueldo';
      
      Alerts.success('Ingreso agregado correctamente');
    };
  },
  
  add(desc, amount, date, category) {
    const income = {
      id: Date.now(),
      desc: desc,
      amount: amount,
      date: date,
      category: category,
      createdAt: new Date().toISOString()
    };
    
    AppState.currentMonthData.income.push(income);
    AppState.markUnsaved();
    this.render();
  },
  
  edit(id) {
    const income = AppState.currentMonthData.income.find(i => i.id === id);
    if (!income) return;
    
    const newDesc = prompt('Descripcion:', income.desc);
    if (newDesc === null) return;
    
    const newAmount = prompt('Monto:', income.amount);
    if (newAmount === null) return;
    
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alerts.error('Monto invalido');
      return;
    }
    
    const newDate = prompt('Fecha (YYYY-MM-DD):', income.date);
    if (newDate === null) return;
    
    income.desc = newDesc.trim();
    income.amount = parsedAmount;
    income.date = newDate;
    
    AppState.markUnsaved();
    this.render();
    Alerts.success('Ingreso actualizado');
  },
  
  remove(id) {
    if (!confirm('¿Eliminar este ingreso?')) return;
    
    const index = AppState.currentMonthData.income.findIndex(i => i.id === id);
    if (index === -1) return;
    
    AppState.currentMonthData.income.splice(index, 1);
    AppState.markUnsaved();
    this.render();
    Alerts.success('Ingreso eliminado');
  },
  
  render() {
    const tbody = document.getElementById('income-list');
    if (!tbody) return;
    
    const incomes = AppState.currentMonthData.income || [];
    
    if (incomes.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:40px; color:var(--text-secondary);">
            <div style="font-size:48px; margin-bottom:16px;">📭</div>
            <div>No hay ingresos registrados este mes</div>
            <div style="font-size:14px; margin-top:8px;">Agrega tu primer ingreso arriba</div>
          </td>
        </tr>
      `;
      this.updateTotal();
      return;
    }
    
    const sorted = [...incomes].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    tbody.innerHTML = sorted.map(income => {
      const categoryIcon = this.getCategoryIcon(income.category);
      const formattedDate = new Date(income.date).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      return `
        <tr>
          <td>${formattedDate}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">${categoryIcon}</span>
              <span style="font-weight:600;">${income.desc}</span>
            </div>
          </td>
          <td>
            <span style="display:inline-block; padding:4px 12px; background:rgba(16,185,129,0.1); color:#10b981; border-radius:20px; font-size:12px; font-weight:700;">
              ${this.getCategoryName(income.category)}
            </span>
          </td>
          <td style="font-family:'JetBrains Mono', monospace; font-weight:700; color:#10b981; font-size:18px;">
            ${CONFIG.formatMoney(income.amount)}
          </td>
          <td>
            <div style="display:flex; gap:8px;">
              <button class="btn-edit" onclick="Income.edit(${income.id})" title="Editar">
                ✏️
              </button>
              <button class="btn-delete" onclick="Income.remove(${income.id})" title="Eliminar">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    this.updateTotal();
  },
  
  updateTotal() {
    const total = (AppState.currentMonthData.income || [])
      .reduce((sum, i) => sum + i.amount, 0);
    
    const totalEl = document.getElementById('income-total');
    if (totalEl) {
      totalEl.textContent = CONFIG.formatMoney(total);
    }
    
    if (window.FinanzasApp && window.FinanzasApp.ui && window.FinanzasApp.ui.dashboard) {
      window.FinanzasApp.ui.dashboard.renderStats();
    }
  },
  
  getCategoryIcon(category) {
    const icons = {
      'sueldo': '💼',
      'bono': '🎁',
      'freelance': '💻',
      'inversion': '📈',
      'otro': '💰'
    };
    return icons[category] || '💰';
  },
  
  getCategoryName(category) {
    const names = {
      'sueldo': 'Sueldo',
      'bono': 'Bono',
      'freelance': 'Freelance',
      'inversion': 'Inversion',
      'otro': 'Otro'
    };
    return names[category] || 'Otro';
  }
};

window.Income = Income;
