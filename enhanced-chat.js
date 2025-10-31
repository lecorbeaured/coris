/**
 * Enhanced Chat Assistant Module
 * Handles natural language understanding with pattern matching
 * Maintains conversation context and handles multi-part queries
 */

class EnhancedChatAssistant {
    constructor() {
        this.conversationHistory = [];
        this.lastQuery = null;
        this.contextData = {
            bills: [],
            expenses: [],
            lastFilter: 'all'
        };
    }

    /**
     * Update context data (bills, expenses)
     */
    updateContext(bills, expenses = []) {
        this.contextData.bills = bills;
        this.contextData.expenses = expenses;
    }

    /**
     * Main chat processing function
     */
    processMessage(userMessage, bills, expenses = []) {
        this.updateContext(bills, expenses);
        this.lastQuery = userMessage.toLowerCase().trim();

        // Store in conversation history for context
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: Date.now()
        });

        // Process the query
        const response = this.generateResponse(userMessage, bills, expenses);

        // Store assistant response
        this.conversationHistory.push({
            role: 'assistant',
            message: response,
            timestamp: Date.now()
        });

        return response;
    }

    /**
     * Main response generation logic
     */
    generateResponse(query, bills, expenses) {
        const normalizedQuery = query.toLowerCase().trim();

        // ========================================
        // INTENT RECOGNITION
        // ========================================
        const intent = this.recognizeIntent(normalizedQuery);
        
        // ========================================
        // QUERY ROUTING
        // ========================================
        
        // Greeting & Help
        if (intent === 'greeting') {
            return this.handleGreeting(normalizedQuery);
        }

        if (intent === 'help') {
            return this.handleHelp();
        }

        // Budget & Expense Tracking
        if (intent === 'add_expense') {
            return this.handleAddExpense(normalizedQuery, expenses);
        }

        if (intent === 'show_expenses') {
            return this.handleShowExpenses(expenses);
        }

        if (intent === 'expense_breakdown') {
            return this.handleExpenseBreakdown(bills, expenses);
        }

        if (intent === 'financial_advice') {
            return this.handleFinancialAdvice(bills, expenses);
        }

        // Bill Queries
        if (intent === 'bills_due_soon') {
            return this.handleBillsDueSoon(bills, normalizedQuery);
        }

        if (intent === 'bills_due_today') {
            return this.handleBillsDueToday(bills);
        }

        if (intent === 'bills_overdue') {
            return this.handleBillsOverdue(bills);
        }

        if (intent === 'total_owed') {
            return this.handleTotalOwed(bills, expenses);
        }

        if (intent === 'category_bills') {
            return this.handleCategoryBills(normalizedQuery, bills);
        }

        if (intent === 'next_bill') {
            return this.handleNextBill(bills);
        }

        if (intent === 'monthly_bills') {
            return this.handleMonthlyBills(bills, normalizedQuery);
        }

        if (intent === 'subscriptions') {
            return this.handleSubscriptions(bills);
        }

        if (intent === 'autopay') {
            return this.handleAutopay(bills, normalizedQuery);
        }

        if (intent === 'mark_paid') {
            return this.handleMarkPaid(normalizedQuery, bills);
        }

        if (intent === 'bill_summary') {
            return this.handleBillSummary(bills);
        }

        if (intent === 'search_bill') {
            return this.handleSearchBill(normalizedQuery, bills);
        }

        // Default helpful response
        return this.handleDefault();
    }

    /**
     * Intent Recognition using pattern matching
     */
    recognizeIntent(query) {
        // Greeting patterns
        if (this.matchPatterns(query, ['hello', 'hi', 'hey', 'greetings', 'howdy'])) {
            return 'greeting';
        }

        if (this.matchPatterns(query, ['help', 'what can you', 'show me', 'how do i', 'options', 'capabilities'])) {
            return 'help';
        }

        // Expense patterns
        if (this.matchPatterns(query, ['add', 'log', 'record', 'spent', 'spent on', 'expense'])) {
            if (this.containsMoney(query)) {
                return 'add_expense';
            }
        }

        if (this.matchPatterns(query, ['expense', 'spending', 'breakdown', 'expense breakdown', 'show.*expense'])) {
            return 'expense_breakdown';
        }

        if (this.matchPatterns(query, ['list.*expense', 'all.*expense', 'show.*expense'])) {
            return 'show_expenses';
        }

        if (this.matchPatterns(query, ['advice', 'optimize', 'save', 'financial', 'budget'])) {
            return 'financial_advice';
        }

        // Bill status patterns
        if (this.matchPatterns(query, ['due.*week', 'week', 'coming up', 'upcoming'])) {
            return 'bills_due_soon';
        }

        if (this.matchPatterns(query, ['due.*today', 'due today', 'today'])) {
            return 'bills_due_today';
        }

        if (this.matchPatterns(query, ['overdue', 'late', 'past due', 'missed'])) {
            return 'bills_overdue';
        }

        if (this.matchPatterns(query, ['total.*owe', 'how much.*owe', 'total due', 'sum', 'altogether'])) {
            return 'total_owed';
        }

        if (this.matchPatterns(query, ['next', 'upcoming', 'coming up'])) {
            if (this.matchPatterns(query, ['bill', 'payment'])) {
                return 'next_bill';
            }
        }

        if (this.matchPatterns(query, ['month', 'monthly', 'this month', 'each month'])) {
            return 'monthly_bills';
        }

        if (this.matchPatterns(query, ['summary', 'overview', 'status', 'snapshot'])) {
            return 'bill_summary';
        }

        if (this.matchPatterns(query, ['subscription', 'subscriptions', 'recurring'])) {
            return 'subscriptions';
        }

        if (this.matchPatterns(query, ['autopay', 'auto pay', 'automatic', 'automatic payment'])) {
            return 'autopay';
        }

        if (this.matchPatterns(query, ['paid', 'pay', 'mark.*paid'])) {
            return 'mark_paid';
        }

        // Category patterns (check if any category mentioned)
        const categories = ['utilities', 'loans', 'insurance', 'rent', 'mortgage', 'credit card', 'medical', 'childcare', 'transportation', 'entertainment', 'subscription'];
        if (categories.some(cat => query.includes(cat))) {
            return 'category_bills';
        }

        if (this.matchPatterns(query, ['find', 'search', 'show', 'get'])) {
            return 'search_bill';
        }

        return null;
    }

    /**
     * Pattern matching utility
     */
    matchPatterns(text, patterns) {
        return patterns.some(pattern => {
            const regex = new RegExp(pattern, 'i');
            return regex.test(text);
        });
    }

    /**
     * Check if query contains money mention
     */
    containsMoney(text) {
        return /\$?\d+\.?\d*/.test(text);
    }

    /**
     * Extract money amount from text
     */
    extractAmount(text) {
        const match = text.match(/\$?([\d.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    /**
     * Extract category from text
     */
    extractCategory(text) {
        const categories = ['utilities', 'subscriptions', 'loans', 'insurance', 'rent', 'mortgage', 'credit card', 'medical', 'childcare', 'transportation', 'entertainment', 'groceries', 'food', 'entertainment', 'shopping', 'gas', 'other'];
        
        for (const cat of categories) {
            if (text.includes(cat)) {
                return cat.charAt(0).toUpperCase() + cat.slice(1);
            }
        }

        // Try to extract "for [category]" pattern
        const match = text.match(/for\s+([^$]*?)(?:\s*$|\.)/i);
        if (match) {
            return match[1].trim().charAt(0).toUpperCase() + match[1].trim().slice(1);
        }

        return 'Miscellaneous';
    }

    /**
     * Date utilities
     */
    getDaysUntilDue(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    getBillStatus(bill) {
        if (bill.paid) return 'paid';
        const daysUntil = this.getDaysUntilDue(bill.dueDate);
        if (daysUntil < 0) return 'overdue';
        if (daysUntil <= 7) return 'due-soon';
        return 'upcoming';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ========================================
    // HANDLER FUNCTIONS
    // ========================================

    handleGreeting(query) {
        const greetings = [
            "Hey there! 👋 I'm here to help you manage your bills. What would you like to know?",
            "Hello! 😊 Ask me about your bills, expenses, or get some financial tips.",
            "Hi! How can I help you with your finances today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    handleHelp() {
        return `I can help you with lots of things! 💪<br><br>
            <strong>📊 Bill Tracking:</strong><br>
            • "What's due this week?"<br>
            • "Show my subscriptions"<br>
            • "Any bills overdue?"<br>
            • "What's my next payment?"<br>
            • "How much do I owe total?"<br><br>
            <strong>💰 Expense & Budget:</strong><br>
            • "Add $50 for groceries"<br>
            • "Show my spending breakdown"<br>
            • "Give me financial advice"<br>
            • "List all expenses"<br><br>
            <strong>🔍 Search & Organize:</strong><br>
            • "Show my utilities"<br>
            • "Which bills are on autopay?"<br>
            • "Bills due this month?"<br>
            • "Find my electric bill"<br><br>
            Try any of these or ask in your own words!`;
    }

    handleAddExpense(query, expenses) {
        const amount = this.extractAmount(query);
        const category = this.extractCategory(query);

        if (!amount) {
            return "I need an amount! Try: 'Add $50 for groceries' or 'Log $25 for coffee'";
        }

        // Store expense (in real app, this would update)
        const expense = {
            id: Date.now(),
            amount,
            category,
            date: new Date().toLocaleDateString(),
            description: `$${amount} - ${category}`
        };

        const allExpenses = JSON.parse(localStorage.getItem('corisExpenses') || '[]');
        allExpenses.push(expense);
        localStorage.setItem('corisExpenses', JSON.stringify(allExpenses));

        const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);

        return `✅ <strong>Expense Added</strong><br><br>
            Amount: ${this.formatCurrency(amount)}<br>
            Category: ${category}<br>
            Date: ${new Date().toLocaleDateString()}<br><br>
            📊 <strong>Total Expenses:</strong> ${this.formatCurrency(totalExpenses)}`;
    }

    handleShowExpenses(expenses) {
        const allExpenses = JSON.parse(localStorage.getItem('corisExpenses') || '[]');
        
        if (allExpenses.length === 0) {
            return "📝 No expenses tracked yet. Try: 'Add $50 for groceries'";
        }

        let list = '📝 <strong>Your Expenses</strong><br><br>';
        allExpenses.slice(-10).forEach(e => {
            list += `• ${this.formatCurrency(e.amount)} - ${e.category} (${e.date})<br>`;
        });

        const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        list += `<br><strong>Total: ${this.formatCurrency(total)}</strong>`;
        
        if (allExpenses.length > 10) {
            list += `<br><em>(showing last 10 of ${allExpenses.length})</em>`;
        }

        return list;
    }

    handleExpenseBreakdown(bills, expenses) {
        const allExpenses = JSON.parse(localStorage.getItem('corisExpenses') || '[]');
        const activeBills = bills.filter(b => !b.paid);
        const totalBills = activeBills.reduce((sum, b) => sum + b.amount, 0);

        let response = '📊 <strong>Spending Breakdown</strong><br><br>';

        if (activeBills.length > 0) {
            response += '<strong>Bills:</strong><br>';
            activeBills.slice(0, 5).forEach(b => {
                response += `• ${b.name}: ${this.formatCurrency(b.amount)}<br>`;
            });
            if (activeBills.length > 5) {
                response += `• ... and ${activeBills.length - 5} more<br>`;
            }
            response += `<strong>Bills Total: ${this.formatCurrency(totalBills)}</strong><br><br>`;
        }

        if (allExpenses.length > 0) {
            response += '<strong>Other Expenses:</strong><br>';
            const byCategory = {};
            allExpenses.forEach(e => {
                byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
            });
            
            Object.entries(byCategory).forEach(([cat, total]) => {
                response += `• ${cat}: ${this.formatCurrency(total)}<br>`;
            });

            const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
            response += `<br><strong>Total Expenses: ${this.formatCurrency(totalExpenses)}</strong><br>`;
        }

        const grandTotal = totalBills + allExpenses.reduce((sum, e) => sum + e.amount, 0);
        response += `<br><strong>🎯 Grand Total: ${this.formatCurrency(grandTotal)}</strong>`;

        return response;
    }

    handleFinancialAdvice(bills, expenses) {
        const activeBills = bills.filter(b => !b.paid);
        const allExpenses = JSON.parse(localStorage.getItem('corisExpenses') || '[]');
        const totalBills = activeBills.reduce((sum, b) => sum + b.amount, 0);
        const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        const total = totalBills + totalExpenses;

        let advice = '💡 <strong>Financial Insights</strong><br><br>';
        
        // Analyze spending patterns
        if (totalExpenses > totalBills) {
            advice += '⚠️ Your extra expenses exceed your bills!<br>';
            advice += '🎯 <strong>Try:</strong><br>';
            advice += '• Create a weekly budget for discretionary spending<br>';
            advice += '• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings<br>';
            advice += '• Track daily spending to identify patterns<br>';
        } else if (totalBills > totalExpenses * 2) {
            advice += '📊 Bills are your main expense<br>';
            advice += '🎯 <strong>Try:</strong><br>';
            advice += '• Review subscriptions monthly (cancel unused ones)<br>';
            advice += '• Negotiate rates with providers<br>';
            advice += '• Look for bundle deals on utilities<br>';
        } else {
            advice += '✅ Your spending looks balanced!<br>';
            advice += '🎯 <strong>Keep:</strong><br>';
            advice += '• Maintaining this tracking habit<br>';
            advice += '• Building a small emergency fund<br>';
        }

        advice += `<br><strong>💰 Summary:</strong><br>Bills: ${this.formatCurrency(totalBills)}<br>Other Expenses: ${this.formatCurrency(totalExpenses)}<br>Total: ${this.formatCurrency(total)}`;

        return advice;
    }

    handleBillsDueSoon(bills, query) {
        // Parse time frame
        let daysFrame = 7; // default
        
        if (query.includes('2 week') || query.includes('14 day')) {
            daysFrame = 14;
        } else if (query.includes('month')) {
            daysFrame = 30;
        } else if (query.includes('3 day')) {
            daysFrame = 3;
        }

        const activeBills = bills.filter(b => !b.paid);
        const dueSoon = activeBills.filter(b => {
            const days = this.getDaysUntilDue(b.dueDate);
            return days >= 0 && days <= daysFrame;
        });

        if (dueSoon.length === 0) {
            return `🎉 Great news! No bills due in the next ${daysFrame} days.`;
        }

        const total = dueSoon.reduce((sum, b) => sum + b.amount, 0);
        let response = `📅 <strong>${dueSoon.length} Bill(s) due in next ${daysFrame} days</strong> for ${this.formatCurrency(total)}:<br><br>`;
        
        dueSoon.sort((a, b) => this.getDaysUntilDue(a.dueDate) - this.getDaysUntilDue(b.dueDate))
               .forEach(b => {
                   const days = this.getDaysUntilDue(b.dueDate);
                   const daysText = days === 0 ? 'TODAY' : days === 1 ? 'Tomorrow' : `${days} days`;
                   response += `• <strong>${b.name}</strong> - ${this.formatCurrency(b.amount)} (${daysText})<br>`;
               });

        return response;
    }

    handleBillsDueToday(bills) {
        const activeBills = bills.filter(b => !b.paid);
        const dueToday = activeBills.filter(b => this.getDaysUntilDue(b.dueDate) === 0);
        
        if (dueToday.length === 0) {
            return "✓ No bills due today! You're all set. 😊";
        }

        const total = dueToday.reduce((sum, b) => sum + b.amount, 0);
        let response = `⏰ <strong>Due TODAY</strong> - Total: ${this.formatCurrency(total)}<br><br>`;
        
        dueToday.forEach(b => {
            response += `• <strong>${b.name}</strong> - ${this.formatCurrency(b.amount)}<br>`;
        });

        return response;
    }

    handleBillsOverdue(bills) {
        const activeBills = bills.filter(b => !b.paid);
        const overdue = activeBills.filter(b => this.getDaysUntilDue(b.dueDate) < 0);
        
        if (overdue.length === 0) {
            return "✅ No overdue bills! You're doing great! 🌟";
        }

        const total = overdue.reduce((sum, b) => sum + b.amount, 0);
        let response = `⚠️ <strong>${overdue.length} Overdue Bill(s)</strong> - Total: ${this.formatCurrency(total)}<br><br>`;
        
        overdue.forEach(b => {
            const days = Math.abs(this.getDaysUntilDue(b.dueDate));
            response += `• <strong>${b.name}</strong> - ${this.formatCurrency(b.amount)} (${days} days late)<br>`;
        });

        response += `<br>⏰ Please prioritize paying these soon!`;

        return response;
    }

    handleTotalOwed(bills, expenses) {
        const activeBills = bills.filter(b => !b.paid);
        const total = activeBills.reduce((sum, b) => sum + b.amount, 0);
        const allExpenses = JSON.parse(localStorage.getItem('corisExpenses') || '[]');
        const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        const grandTotal = total + totalExpenses;

        return `💰 <strong>Total Owed</strong><br><br>
            Active Bills: ${this.formatCurrency(total)} (${activeBills.length} bills)<br>
            Tracked Expenses: ${this.formatCurrency(totalExpenses)}<br><br>
            <strong>Grand Total: ${this.formatCurrency(grandTotal)}</strong>`;
    }

    handleCategoryBills(query, bills) {
        const categories = ['utilities', 'loans', 'insurance', 'rent', 'mortgage', 'credit card', 'medical', 'childcare', 'transportation', 'entertainment', 'subscription'];
        
        let foundCategory = null;
        for (const cat of categories) {
            if (query.includes(cat)) {
                foundCategory = cat;
                break;
            }
        }

        if (!foundCategory) {
            return "I didn't recognize that category. Try: utilities, loans, insurance, subscriptions, medical, transportation, entertainment, etc.";
        }

        const activeBills = bills.filter(b => !b.paid);
        const categoryBills = activeBills.filter(b => b.category.toLowerCase().includes(foundCategory));
        
        if (categoryBills.length === 0) {
            return `📭 No ${foundCategory} bills found.`;
        }

        const total = categoryBills.reduce((sum, b) => sum + b.amount, 0);
        let response = `💳 <strong>${foundCategory.toUpperCase()}</strong> Bills - ${this.formatCurrency(total)}:<br><br>`;
        
        categoryBills.forEach(b => {
            response += `• ${b.name} - ${this.formatCurrency(b.amount)}<br>`;
        });

        return response;
    }

    handleNextBill(bills) {
        const activeBills = bills.filter(b => !b.paid);
        const nextBill = activeBills
            .filter(b => this.getDaysUntilDue(b.dueDate) >= 0)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

        if (!nextBill) {
            return "🎉 No upcoming bills! You're all caught up.";
        }

        const days = this.getDaysUntilDue(nextBill.dueDate);
        const daysText = days === 0 ? 'TODAY!' : days === 1 ? 'tomorrow' : `in ${days} days`;
        
        return `⏭️ <strong>Next Bill</strong><br><br>
            ${nextBill.name}<br>
            Amount: ${this.formatCurrency(nextBill.amount)}<br>
            Due: ${daysText} (${this.formatDate(nextBill.dueDate)})`;
    }

    handleMonthlyBills(bills, query) {
        const today = new Date();
        let targetMonth = today.getMonth();
        let targetYear = today.getFullYear();

        // Check for "next month"
        if (query.includes('next')) {
            targetMonth++;
            if (targetMonth > 11) {
                targetMonth = 0;
                targetYear++;
            }
        }

        const activeBills = bills.filter(b => !b.paid);
        const monthBills = activeBills.filter(b => {
            const dueDate = new Date(b.dueDate);
            return dueDate.getMonth() === targetMonth && dueDate.getFullYear() === targetYear;
        });

        if (monthBills.length === 0) {
            return `📭 No bills due ${query.includes('next') ? 'next month' : 'this month'}!`;
        }

        const total = monthBills.reduce((sum, b) => sum + b.amount, 0);
        const monthName = new Date(targetYear, targetMonth, 1).toLocaleDateString('en-US', { month: 'long' });
        
        let response = `📅 <strong>${monthName}</strong> - ${monthBills.length} Bills (${this.formatCurrency(total)}):<br><br>`;
        
        monthBills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .forEach(b => {
                      response += `• ${b.name} - ${this.formatCurrency(b.amount)} (${this.formatDate(b.dueDate)})<br>`;
                  });

        return response;
    }

    handleSubscriptions(bills) {
        const activeBills = bills.filter(b => !b.paid);
        const subscriptions = activeBills.filter(b => b.category === 'Subscriptions');
        
        if (subscriptions.length === 0) {
            return "🎯 No subscription bills tracked. You might be able to add some!";
        }

        const total = subscriptions.reduce((sum, b) => sum + b.amount, 0);
        let response = `📺 <strong>Subscriptions</strong> - ${this.formatCurrency(total)}/month (${subscriptions.length}):<br><br>`;
        
        subscriptions.forEach(b => {
            response += `• ${b.name} - ${this.formatCurrency(b.amount)}<br>`;
        });

        response += `<br>💡 Tip: Review annually and cancel unused services!`;

        return response;
    }

    handleAutopay(bills, query) {
        const autopayBills = bills.filter(b => b.autopay && !b.paid);
        const manualBills = bills.filter(b => !b.autopay && !b.paid);

        if (query.includes('not') || query.includes('manual')) {
            if (manualBills.length === 0) {
                return "🎉 All your bills are on autopay!";
            }
            let response = `📋 <strong>Manual Payment Bills</strong> (${manualBills.length}):<br><br>`;
            manualBills.forEach(b => {
                response += `• ${b.name} - ${this.formatCurrency(b.amount)}<br>`;
            });
            return response;
        }

        if (autopayBills.length === 0) {
            return "📭 No bills on autopay yet. Consider setting some up to avoid missed payments!";
        }

        let response = `⚡ <strong>On Autopay</strong> (${autopayBills.length}):<br><br>`;
        autopayBills.forEach(b => {
            response += `• ${b.name} - ${this.formatCurrency(b.amount)}<br>`;
        });
        return response;
    }

    handleMarkPaid(query, bills) {
        return "✅ I can't mark bills as paid from chat yet, but you can click the 'Paid' button on any bill! Would you like to know which bills are due soon?";
    }

    handleBillSummary(bills) {
        const activeBills = bills.filter(b => !b.paid);
        const paidBills = bills.filter(b => b.paid);
        const overdue = activeBills.filter(b => this.getDaysUntilDue(b.dueDate) < 0);
        const dueSoon = activeBills.filter(b => {
            const days = this.getDaysUntilDue(b.dueDate);
            return days >= 0 && days <= 7;
        });

        const totalOwed = activeBills.reduce((sum, b) => sum + b.amount, 0);

        return `📊 <strong>Bill Summary</strong><br><br>
            Total Bills: ${bills.length}<br>
            Active: ${activeBills.length} | Paid: ${paidBills.length}<br>
            Overdue: ${overdue.length} | Due Soon: ${dueSoon.length}<br><br>
            <strong>Total Owed: ${this.formatCurrency(totalOwed)}</strong><br><br>
            Ask me about specific bills, or I can show you what's due this week!`;
    }

    handleSearchBill(query, bills) {
        // Extract bill name from query
        const match = query.match(/(?:find|search|show|get).*?(?:my\s+)?([a-z\s]+?)(?:\s+bill)?$/i);
        const searchTerm = match ? match[1].trim() : null;

        if (!searchTerm) {
            return "What bill are you looking for? Try: 'Find my electric bill' or 'Search Netflix'";
        }

        const results = bills.filter(b => 
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (results.length === 0) {
            return `❌ I couldn't find a bill matching "${searchTerm}". Try adding it first!`;
        }

        let response = `🔍 <strong>Found ${results.length} Bill(s):</strong><br><br>`;
        results.forEach(b => {
            const status = this.getBillStatus(b);
            const days = this.getDaysUntilDue(b.dueDate);
            const statusText = status === 'paid' ? 'Paid ✓' : 
                             status === 'overdue' ? `Overdue ${Math.abs(days)} days` :
                             status === 'due-soon' ? `Due in ${days} days` :
                             `Due in ${days} days`;

            response += `• <strong>${b.name}</strong> - ${this.formatCurrency(b.amount)}<br>`;
            response += `  ${statusText}<br>`;
        });

        return response;
    }

    handleDefault() {
        const responses = [
            "I'm not quite sure about that. Try asking me about your bills, expenses, or financial tips!",
            "Hmm, I didn't catch that. What would you like to know about your bills or budget?",
            "I'm not familiar with that query. Want to know what's due soon, or check a specific bill?",
            "Let me help! Ask me about your bills, expenses, or get some financial advice."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedChatAssistant;
}