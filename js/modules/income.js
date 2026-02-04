// MODULO DE INGRESOS

import { AppState } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { CONFIG } from '../core/config.js';
import { Alerts } from '../ui/alerts.js';

export const Income = {
  
  init() {
    console.log('Income module initialized');
    this.setupForm();
    this.render();
  },
  
  setupForm() {
    const btnAdd = document.querySelector('#view-income .btn-primary');
    
    if (!btnAdd) {
      console.error('Botón Agregar no encontrado');
      return;
    }
    
    console.log('Botón encontrado, agregando evento...');
    
    btnAdd.onclick = (e) => {
      e.preventDefault();
      console.log('Click en Agregar Ingreso');
      
      const form = document.querySelector('#view-income .form-row');
      if (!form) {
        console.error('Formulario no encontrado');
        return;
      }
      
      const inputs = form.querySelectorAll('input');
      const select = form.querySelector('select');
      
      const descInput = inputs[0];
      const amountInput = inputs[1];
      const dateInput = inputs[2];
      const categorySelect = select;
      
      const desc = descInput?.value.trim() || '';
      const amount = parseFloat(amountInput?.value) || 0;
      const date = dateInput?.value || CONFIG.getToday();
      const category = categorySelect?.value || 'sueldo';
      
      console.log('Datos capturados:', { desc, amount, date, category });
      
      if (!desc) {
        alert('La descripción es requerida');
        return;
      }
      
      if (amount <= 0) {
        alert('El monto debe ser mayor a cero');
        return;
      }
      
      this.add(desc, amount, date, category);
      
      if (descInput) descInput.value = '';
      if (amountInput) amountInput.value = '';
      if (dateInput) dateInput.value = CONFIG.getToday();
      if (categorySelect) categorySelect.value = 'sueldo';
    };
    
    const dateInput = document.querySelector('#view-income input[type="date"]');
    if (dateInput && !dateInput.value) {
      dateInput.value = CONFIG.getToday();
    }
  },
  
  add(desc, amount, date, category) {
    console.log('Agregando ingreso...', { desc, amount, date, category });
    
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
    console.log('Ingreso agregado:', newIncome);
    
    AppState.markUnsaved();
    Storage.save();
    
    this.render();
    this.updateTotal();
    
    alert('✅ Ingreso agregado correctamente');
  },
  
  edit(id) {
    const income = AppState.currentMonthData.income.find(i => i.id === id);
    if (!income) return;
    
    const newDesc = prompt('Descripción:', income.desc);
    if (newDesc === null) return;
    
    const newAmount = parseFloat(prompt('Monto:', income.amount));
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Monto inválido');
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
    
    alert('✅ Ingreso actualizado');
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
    
    alert('✅ Ingreso eliminado');
  },
  
  render() {
    const tbody = document.querySelector('#view-income tbody');
    if (!tbody) {
      console.error('Tbody no encontrado');
      return;
    }
    
    const incomes = AppState.currentMonthData.income || [];
    console.log('Renderizando', incomes.length, 'ingresos');
    
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
    
    console.log('Total ingresos:', total);
    
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
