// ===================================
// FINANZAS PRO V5.0 - DASHBOARD UI
// ===================================

import { AppState } from '../core/state.js';
import { formatMoney, getQuincena } from '../core/config.js';
import { Services } from '../modules/services.js';
import { Cards } from '../modules/cards.js';
import { Loans } from '../modules/loans.js';
import { Expenses } from '../modules/expenses.js';

export const Dashboard = {
  
  // Renderizar dashboard completo
  render() {
    console.log('📊 Renderizando dashboard...');
    
    this.renderStats();
    this.renderQuincenas();
    this.renderExpenses();
  },
  
  // Renderizar estadísticas principales
  renderStats() {
    const totals = AppState.calculateTotals();
    
    document.getElementById('stat-income').textContent = formatMoney(totals.income);
    document.getElementById('stat-expense').textContent = formatMoney(totals.fixed + totals.expenses);
    document.getElementById('stat-balance').textContent = formatMoney(totals.balance);
    document.getElementById('stat-savings').textContent = formatMoney(totals.savings);
  },
  
  // Renderizar quincenas
  renderQuincenas() {
    const services = Services.getAll();
    const cards = Cards.getAll();
    const loans = Loans.getActive();
    
    // Agrupar por quincena
    const q1Items = [];
    const q2Items = [];
    const recurrentItems = [];
    
    // Servicios
    services.forEach(service => {
      const item = {
        id: `service-${service.id}`,
        type: 'service',
        icon: service.icon,
        name: service.name,
        amount: service.amount,
        day: service.paymentDay,
        paid: service.paid
      };
      
      if (service.isRecurrent) {
        recurrentItems.push(item);
      } else if (service.paymentDay <= 14) {
        q1Items.push(item);
      } else {
        q2Items.push(item);
      }
    });
    
    // Tarjetas
    cards.forEach(card => {
      const amount = Cards.getAmount(card.id);
      const item = {
        id: `card-${card.id}`,
        type: 'card',
        icon: '💳',
        name: `${card.alias} - ${card.bank}`,
        amount: amount,
        day: card.paymentDay,
        paid: false
      };
      
      if (card.paymentDay <= 14) {
        q1Items.push(item);
      } else {
        q2Items.push(item);
      }
    });
    
    // Préstamos
    loans.forEach(loan => {
      const item = {
        id: `loan-${loan.id}`,
        type: 'loan',
        icon: '🏦',
        name: loan.name,
        amount: loan.paymentAmount,
        day: loan.paymentDay,
        paid: false
      };
      
      if (loan.frequency === 'quincenal') {
        if (loan.paymentDay <= 14) {
          q1Items.push(item);
        } else {
          q2Items.push(item);
        }
      } else {
        // Mensual va a Q1 por defecto
        q1Items.push(item);
      }
    });
    
    // Ordenar por día
    q1Items.sort((a, b) => a.day - b.day);
    q2Items.sort((a, b) => a.day - b.day);
    
    // Renderizar
    this.renderPaymentList('list-q1', 'total-q1', q1Items);
    this.renderPaymentList('list-q2', 'total-q2', q2Items);
    this.renderPaymentList('list-recurrent', 'total-recurrent', recurrentItems);
  },
  
  // Renderizar lista de pagos
  renderPaymentList(containerId, totalId, items) {
    const container = document.getElementById(containerId);
    const totalEl = document.getElementById(totalId);
    
    if (!container) return;
    
    if (items.length === 0) {
      container.innerHTML = '<div class="muted">Sin pagos programados</div>';
      if (totalEl) totalEl.textContent = formatMoney(0);
      return;
    }
    
    let html = '';
    let total = 0;
    
    items.forEach(item => {
      if (!item.paid) total += item.amount;
      
      html += `
        <div class="payment-item ${item.paid ? 'paid' : ''}">
          <span class="payment-icon">${item.icon}</span>
          <div class="payment-info">
            <div class="payment-name">${item.name}</div>
            <div class="payment-detail">Día ${item.day}</div>
          </div>
          <div class="payment-amount">${formatMoney(item.amount)}</div>
          <input type="checkbox" 
                 class="payment-checkbox" 
                 data-id="${item.id}"
                 ${item.paid ? 'checked' : ''}>
        </div>
      `;
    });
    
    container.innerHTML = html;
    if (totalEl) totalEl.textContent = formatMoney(total);
    
    // Event listeners para checkboxes
    container.querySelectorAll('.payment-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.handlePaymentToggle(e.target.dataset.id, e.target.checked);
      });
    });
  },
  
  // Manejar toggle de pago
  async handlePaymentToggle(id, checked) {
    const [type, itemId] = id.split('-');
    const numId = parseInt(itemId);
    
    if (type === 'service') {
      await Services.togglePaid(numId);
      AppState.markUnsaved();
      this.render();
    }
    
    // Para cards y loans, implementar lógica similar
  },
  
  // Renderizar gastos variables
  renderExpenses() {
    const expenses = Expenses.getAll();
    const container = document.getElementById('list-expenses');
    const totalEl = document.getElementById('total-expenses');
    
    if (!container) return;
    
    if (expenses.length === 0) {
      container.innerHTML = '<div class="muted">Sin gastos registrados</div>';
      if (totalEl) totalEl.textContent = formatMoney(0);
      return;
    }
    
    // Mostrar últimos 5
    const recent = expenses.slice(-5).reverse();
    let html = '';
    
    recent.forEach(expense => {
      html += `
        <div class="payment-item">
          <span class="payment-icon">🛒</span>
          <div class="payment-info">
            <div class="payment-name">${expense.description}</div>
            <div class="payment-detail">${expense.category} - ${expense.date}</div>
          </div>
          <div class="payment-amount">${formatMoney(expense.amount)}</div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    const total = Expenses.getTotal();
    if (totalEl) totalEl.textContent = formatMoney(total);
  }
};

export default Dashboard;
```

**PASO 5:** Commit: `Crear UI del dashboard`

---

## 📊 PROGRESO: 90% ✅
```
✅ css/ (4 archivos)
✅ js/core/ (3 archivos)
✅ js/modules/ (7 archivos)
⏳ js/ui/dashboard.js (creando ahora)
⬜ js/ui/navigation.js
⬜ js/ui/alerts.js
⬜ js/app.js
⬜ index.html
