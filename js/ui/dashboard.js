import { AppState } from '../core/state.js';
import { formatMoney } from '../core/config.js';

export const Dashboard = {
  
  render() {
    this.renderStats();
    this.renderQuincenas();
  },
  
  renderStats() {
    const totals = AppState.getTotals();
    
    const statIncome = document.getElementById('stat-income');
    const statExpense = document.getElementById('stat-expense');
    const statBalance = document.getElementById('stat-balance');
    const statSavings = document.getElementById('stat-savings');
    
    if (statIncome) statIncome.textContent = formatMoney(totals.income);
    if (statExpense) statExpense.textContent = formatMoney(totals.expenses);
    if (statBalance) statBalance.textContent = formatMoney(totals.balance);
    if (statSavings) statSavings.textContent = formatMoney(totals.savings);
  },
  
  renderQuincenas() {
    const q1List = document.getElementById('list-q1');
    const q2List = document.getElementById('list-q2');
    const q1Total = document.getElementById('total-q1');
    const q2Total = document.getElementById('total-q2');
    
    if (q1List) q1List.innerHTML = '<div class="empty-state">Sin pagos pendientes</div>';
    if (q2List) q2List.innerHTML = '<div class="empty-state">Sin pagos pendientes</div>';
    if (q1Total) q1Total.textContent = formatMoney(0);
    if (q2Total) q2Total.textContent = formatMoney(0);
  }
};
