export const AppState = {
  user: null,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentMonthData: null,
  hasUnsavedChanges: false,
  
  init() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
  },
  
  setUser(user) {
    this.user = user;
  },
  
  setYearMonth(year, month) {
    this.currentYear = year;
    this.currentMonth = month;
  },
  
  markUnsaved() {
    this.hasUnsavedChanges = true;
    this.showUnsavedBanner();
  },
  
  markSaved() {
    this.hasUnsavedChanges = false;
    this.hideUnsavedBanner();
  },
  
  showUnsavedBanner() {
    const banner = document.getElementById('unsaved-banner');
    if (banner) {
      banner.classList.remove('hidden');
    }
  },
  
  hideUnsavedBanner() {
    const banner = document.getElementById('unsaved-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  },
  
  getTotals() {
    if (!this.currentMonthData) {
      return {
        income: 0,
        expenses: 0,
        balance: 0,
        savings: 0
      };
    }
    
    const income = this.currentMonthData.income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const servicesTotal = this.currentMonthData.services.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const cardsTotal = this.currentMonthData.cards.reduce((sum, item) => sum + (parseFloat(item.manualAmount) || 0), 0);
    const loansTotal = this.currentMonthData.loans.reduce((sum, item) => {
      if (item.status === 'liquidado') return sum;
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    const expensesTotal = this.currentMonthData.expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const totalExpenses = servicesTotal + cardsTotal + loansTotal + expensesTotal;
    
    const savingsBalance = this.currentMonthData.savings.opening + 
      this.currentMonthData.savings.transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
    
    return {
      income: income,
      expenses: totalExpenses,
      balance: income - totalExpenses,
      savings: savingsBalance
    };
  }
};
