// MODULO DE INGRESOS

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
    const form = document.querySelector('#view-income .form-row');
    if (!form) return;
    
    const descInput = form.querySelector('input[placeholder="Descripción"]');
    const amountInput = form.querySelector('input[type="number"]');
    const categorySelect = form.querySelector('select');
    const dateInput = form.querySelector('input[type="date"]');
    const btnAdd = document.querySelector('#view-income .btn-primary');
    
    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }
    
    if (btnAdd) {
      btnAdd.onclick = () => {
        const desc = descInput?.value.trim() || '';
        const amount = parseFloat(amountInput?.value) || 0;
        const category = categorySelect?.value || 'sueldo';
        const date = dateInput?.value || new Date().toISOString().slice(0, 10);
        
        if (!desc) {
          if (Alerts && Alerts.error) {
            Alerts.error('La descripción es requerida');
          } else {
            alert('La descripción es requerida');
          }
          return;
        }
        
        if (amount <= 0) {
          if (Alerts && Alerts.error) {
            Alerts.error('El monto debe ser mayor a cero');
          } else {
            alert('El monto debe ser mayor a cero');
          }
          return;
        }
        
        this.add(desc, amount, date, category);
        
        if (descInput) descInput.value = '';
        if (amountInput) amountInput.value = '';
        if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
        if (categorySelect) categorySelect.value = 'sueldo';
      };
    }
  },
  
  add(desc, amount, date, category) {
    if (!AppState.currentMonthData.income) {
      AppState.currentMonthData.income = [];
    }
    
    const newIncome = {
      id: Date.now(),
      desc: desc,
      amount: amount,
      date: date,
      category: category,
      createdAt: new Date().toISOString()
    };
    
    AppState.currentMonthData.income.push(newIncome);
    AppState.markUnsaved();
    Storage.save();
    
    this.render();
    this.updateTotal();
    
    if (Alerts && Alerts.success) {
      Alerts.success('Ingreso agregado correctamente');
    }
  },
  
  edit(id) {
    const income = AppState.currentMonthData.income.find(i => i.id === id);
    if (!income) return;
    
    const newDesc = prompt('Descripción:', income.desc);
    if (newDesc === null) return;
    
    const newAmount = parseFloat(prompt('Monto:', income.amount));
    if (isNaN(newAmount) || newAmount <= 0) {
      if (Alerts && Alerts.error) {
        Alerts.error('Monto inválido');
      }
      return;
    }
    
    const newDate = prompt('Fecha (YYYY-MM-DD):', income.date);
    if (!newDate) return;
    
    income.desc = newDesc.trim();
    income.amount = newAmount;
    income.date = newDate;
    
    AppState.markUnsaved();
    Storage.save();
    this.render();
    this.updateTotal();
    
    if (Alerts && Alerts.success) {
      Alerts.success('Ingreso actualizado');
    }
  },
  
  remove(id) {
    if (!confirm('¿Eliminar este ingreso?')) return;
    
    const index = AppState.currentMonthData.income.findIndex(i => i.id === id);
    if (index === -1) return;
    
    AppState.currentMonthData.income.splice(index, 1);
    AppState.markUnsaved();
    Storage.save();
    this.render();
    this.updateTotal();
    
    if (Alerts && Alerts.success) {
      Alerts.success('Ingreso eliminado');
    }
  },
  
  render() {
    const tbody = document.querySelector('#view-income tbody');
    if (!tbody) return;
    
    const incomes = AppState.currentMonthData.income || [];
    
    if (incomes.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 48px; color: #94a3b8;">
            <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
            <div style="font-size: 16px; font-weight: 500;">No hay ingresos registrados este mes</div>
            <div style="font-size: 14px; margin-top: 8px;">Agrega tu primer ingreso arriba</div>
          </td>
        </tr>
      `;
      return;
    }
    
    const sorted = [...incomes].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    tbody.innerHTML = sorted.map(income => `
      <tr>
        <td>${income.date}</td>
        <td>${income.desc}</td>
        <td>${this.getCategoryName(income.category)}</td>
        <td style="color: #10b981; font-weight: 700; font-family: 'JetBrains Mono', monospace;">
          ${CONFIG.formatMoney(income.amount)}
        </td>
        <td class="table-actions">
          <button class="btn-edit" onclick="window.Income.edit(${income.id})">
            ✏️ Editar
          </button>
          <button class="btn-delete" onclick="window.Income.remove(${income.id})">
            🗑️ Borrar
          </button>
        </td>
      </tr>
    `).join('');
  },
  
  updateTotal() {
    const total = (AppState.currentMonthData.income || [])
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    
    const totalElement = document.querySelector('#view-income .stat-value');
    if (totalElement) {
      totalElement.textContent = CONFIG.formatMoney(total);
    }
    
    if (window.Dashboard && window.Dashboard.renderStats) {
      window.Dashboard.renderStats();
    }
  },
  
  getCategoryIcon(category) {
    return CONFIG.INCOME_CATEGORIES[category]?.icon || '💰';
  },
  
  getCategoryName(category) {
    const cat = CONFIG.INCOME_CATEGORIES[category];
    return cat ? `${cat.icon} ${cat.name}` : category;
  }
};

window.Income = Income;
