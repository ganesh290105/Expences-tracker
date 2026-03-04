document.addEventListener('DOMContentLoaded', () => {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const expenseForm = document.getElementById('expense-form');
    const toast = document.getElementById('toast');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    const showPage = (hash) => {
        const targetId = hash.substring(1);
        pages.forEach(page => page.classList.toggle('hidden', page.id !== targetId));
        navLinks.forEach(link => link.classList.toggle('active', link.hash === hash));
        if (targetId === 'dashboard') updateDashboard();
        if (targetId === 'all-expenses') renderAllExpenses();
        if (targetId === 'analytics') renderAnalyticsTables();
        if (window.innerWidth < 768) navMenu.classList.add('hidden');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = e.currentTarget.hash;
        });
    });

    window.addEventListener('hashchange', () => showPage(window.location.hash || '#dashboard'));
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('hidden'));

    const saveExpenses = () => localStorage.setItem('expenses', JSON.stringify(expenses));

    const updateAllViews = () => {
        const currentHash = window.location.hash || '#dashboard';
        if (currentHash === '#dashboard') updateDashboard();
        if (currentHash === '#all-expenses') renderAllExpenses();
        if (currentHash === '#analytics') renderAnalyticsTables();
        if (currentHash !== '#dashboard') updateDashboard();
    };

    const addExpense = (expense) => {
        expenses.push(expense);
        saveExpenses();
        updateAllViews();
    };
    
    const deleteExpense = (id) => {
        expenses = expenses.filter(exp => exp.id !== id);
        saveExpenses();
        updateAllViews();
    };

    const createExpenseHTML = (exp) => {
        const categoryColors = { Food: '#22c55e', Transport: '#3b82f6', Utilities: '#f59e0b', Entertainment: '#a855f7', Shopping: '#ec4899', Health: '#ef4444', Other: '#6b7280' };
        const color = categoryColors[exp.category] || categoryColors['Other'];

        return `
            <div class="expense-item">
                <div class="expense-item-details">
                    <span class="expense-item-amount">$${exp.amount.toFixed(2)}</span>
                    <div>
                        <p class="expense-item-desc">${exp.description}</p>
                        <p class="expense-item-date">${new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="expense-item-meta">
                    <span class="category-tag" style="background-color:${color}50; color:${color};">${exp.category}</span>
                    <button data-id="${exp.id}" class="delete-btn">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>`;
    };

    const renderAllExpenses = () => {
        const container = document.getElementById('expenses-list-container');
        if (expenses.length === 0) {
            container.innerHTML = '<p>No expenses recorded yet.</p>';
            return;
        }
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        container.innerHTML = sortedExpenses.map(createExpenseHTML).join('');
    };

    const updateDashboard = () => {
        const now = new Date();
        const currentMonthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });

        const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
        document.getElementById('total-transactions').textContent = currentMonthExpenses.length;
        
        const biggestExpense = currentMonthExpenses.reduce((max, exp) => exp.amount > max ? exp.amount : max, 0);
        document.getElementById('biggest-expense').textContent = `$${biggestExpense.toFixed(2)}`;

        const recentList = document.getElementById('recent-expenses-list');
        const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
        if (recentExpenses.length > 0) {
            recentList.innerHTML = recentExpenses.map(createExpenseHTML).join('');
        } else {
            recentList.innerHTML = '<p>No recent expenses. Add one to get started!</p>';
        }
        renderDashboardSummary(currentMonthExpenses);
    };

    const processCategoryData = (expenseData) => {
        return expenseData.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
    };

    const renderDashboardSummary = (currentMonthExpenses) => {
        const container = document.getElementById('category-summary-dashboard');
        if (currentMonthExpenses.length === 0) {
            container.innerHTML = '<p>No spending data for this month yet.</p>';
            return;
        }
        const categoryData = processCategoryData(currentMonthExpenses);
        const sortedCategories = Object.entries(categoryData).sort((a,b) => b[1] - a[1]).slice(0, 3);
        
        container.innerHTML = sortedCategories.map(([category, amount]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                <span>${category}</span>
                <strong>$${amount.toFixed(2)}</strong>
            </div>
        `).join('');
    };
    
    const renderAnalyticsTables = () => {
        // Category Table
        const catContainer = document.getElementById('category-table-analytics');
        const catData = processCategoryData(expenses);
        if (Object.keys(catData).length > 0) {
            const sortedCats = Object.entries(catData).sort((a,b) => b[1] - a[1]);
            let tableHTML = `<table class="analytics-table"><tr><th>Category</th><th>Amount</th></tr>`;
            sortedCats.forEach(([cat, amount]) => {
                tableHTML += `<tr><td>${cat}</td><td>$${amount.toFixed(2)}</td></tr>`;
            });
            tableHTML += `</table>`;
            catContainer.innerHTML = tableHTML;
        } else {
            catContainer.innerHTML = '<p>No data to analyze.</p>';
        }

        // Time Table
        const timeContainer = document.getElementById('spending-over-time-table');
        const timeData = expenses.reduce((acc, exp) => {
            const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + exp.amount;
            return acc;
        }, {});
        if(Object.keys(timeData).length > 0) {
            const sortedMonths = Object.keys(timeData).sort((a,b) => new Date(a) - new Date(b));
            let tableHTML = `<table class="analytics-table"><tr><th>Month</th><th>Amount</th></tr>`;
             sortedMonths.forEach(month => {
                tableHTML += `<tr><td>${month}</td><td>$${timeData[month].toFixed(2)}</td></tr>`;
            });
            tableHTML += `</table>`;
            timeContainer.innerHTML = tableHTML;
        } else {
            timeContainer.innerHTML = '<p>No data to analyze.</p>';
        }
    };
    
    const showToast = () => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(0.5rem)';
        }, 3000);
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newExpense = {
            id: Date.now(),
            description: e.target.description.value,
            amount: parseFloat(e.target.amount.value),
            category: e.target.category.value,
            date: e.target.date.value,
        };
        addExpense(newExpense);
        expenseForm.reset();
        showToast();
        window.location.hash = '#all-expenses';
    });

    document.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const id = parseInt(deleteButton.dataset.id);
            deleteExpense(id);
        }
    });

    const initializeApp = () => {
        document.getElementById('date').valueAsDate = new Date();
        const currentHash = window.location.hash || '#dashboard';
        showPage(currentHash);
        updateAllViews();
    };
    
    initializeApp();
});

