/**
 * Enhanced Bill Management Module
 * Provides core bill management features:
 * - Edit bills
 * - Bill notes
 * - Search bills
 * - Advanced filtering
 * - Recurring bills
 * - Bulk operations
 */

class BillManager {
    constructor() {
        this.bills = [];
        this.billIdCounter = 0;
    }

    /**
     * Load bills from localStorage
     */
    loadBills() {
        const savedBills = localStorage.getItem('resolvpay_bills');
        if (savedBills) {
            this.bills = JSON.parse(savedBills);
            this.billIdCounter = this.bills.length > 0 ? Math.max(...this.bills.map(b => b.id)) : 0;
        }
        return this.bills;
    }

    /**
     * Save bills to localStorage
     */
    saveBills() {
        localStorage.setItem('resolvpay_bills', JSON.stringify(this.bills));
    }

    /**
     * Add new bill
     */
    addBill(billData) {
        if (!billData.name || !billData.amount || !billData.dueDate) {
            throw new Error('Missing required fields: name, amount, dueDate');
        }

        const bill = {
            id: ++this.billIdCounter,
            name: billData.name,
            amount: parseFloat(billData.amount),
            dueDate: billData.dueDate,
            category: billData.category || 'Other',
            frequency: billData.frequency || 'one-time',
            autopay: billData.autopay || false,
            paid: false,
            notes: billData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMethod: billData.paymentMethod || '', // credit card, bank transfer, cash
            amountPaid: null,
            datePaid: null,
            recurringParentId: billData.recurringParentId || null // for recurring bill tracking
        };

        this.bills.push(bill);
        this.saveBills();
        return bill;
    }

    /**
     * Update existing bill
     */
    updateBill(billId, updates) {
        const bill = this.bills.find(b => b.id === billId);
        if (!bill) throw new Error(`Bill ${billId} not found`);

        // Don't allow changing certain fields
        const allowedFields = [
            'name', 'amount', 'dueDate', 'category', 'frequency',
            'autopay', 'notes', 'paymentMethod', 'amountPaid', 'datePaid'
        ];

        allowedFields.forEach(field => {
            if (field in updates) {
                if (field === 'amount') {
                    bill[field] = parseFloat(updates[field]);
                } else {
                    bill[field] = updates[field];
                }
            }
        });

        bill.updatedAt = new Date().toISOString();
        this.saveBills();
        return bill;
    }

    /**
     * Delete bill
     */
    deleteBill(billId) {
        const initialLength = this.bills.length;
        this.bills = this.bills.filter(b => b.id !== billId);
        
        if (this.bills.length === initialLength) {
            throw new Error(`Bill ${billId} not found`);
        }

        this.saveBills();
    }

    /**
     * Get bill by ID
     */
    getBill(billId) {
        return this.bills.find(b => b.id === billId);
    }

    /**
     * Search bills by name, category, or notes
     */
    searchBills(query) {
        const q = query.toLowerCase();
        return this.bills.filter(b =>
            b.name.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.notes.toLowerCase().includes(q)
        );
    }

    /**
     * Filter bills by multiple criteria
     */
    filterBills(filters = {}) {
        return this.bills.filter(bill => {
            // Filter by status
            if (filters.status) {
                const status = this.getBillStatus(bill);
                if (filters.status !== status) return false;
            }

            // Filter by category
            if (filters.category && bill.category !== filters.category) {
                return false;
            }

            // Filter by amount range
            if (filters.minAmount && bill.amount < filters.minAmount) {
                return false;
            }
            if (filters.maxAmount && bill.amount > filters.maxAmount) {
                return false;
            }

            // Filter by frequency
            if (filters.frequency && bill.frequency !== filters.frequency) {
                return false;
            }

            // Filter by autopay
            if (typeof filters.autopay === 'boolean' && bill.autopay !== filters.autopay) {
                return false;
            }

            // Filter by date range
            if (filters.startDate) {
                const billDate = new Date(bill.dueDate);
                const startDate = new Date(filters.startDate);
                if (billDate < startDate) return false;
            }

            if (filters.endDate) {
                const billDate = new Date(bill.dueDate);
                const endDate = new Date(filters.endDate);
                if (billDate > endDate) return false;
            }

            return true;
        });
    }

    /**
     * Sort bills by field
     */
    sortBills(bills = this.bills, sortBy = 'dueDate', order = 'asc') {
        const sorted = [...bills];

        sorted.sort((a, b) => {
            let aVal, bVal;

            switch (sortBy) {
                case 'dueDate':
                    aVal = new Date(a.dueDate);
                    bVal = new Date(b.dueDate);
                    break;
                case 'amount':
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'createdAt':
                    aVal = new Date(a.createdAt);
                    bVal = new Date(b.createdAt);
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }

    /**
     * Get bill status
     */
    getBillStatus(bill) {
        if (bill.paid) return 'paid';
        const daysUntil = this.getDaysUntilDue(bill.dueDate);
        if (daysUntil < 0) return 'overdue';
        if (daysUntil <= 7) return 'due-soon';
        return 'upcoming';
    }

    /**
     * Get days until due date
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

    /**
     * Mark bill as paid
     */
    markAsPaid(billId, amountPaid = null, datePaid = null) {
        const bill = this.getBill(billId);
        if (!bill) throw new Error(`Bill ${billId} not found`);

        bill.paid = true;
        bill.amountPaid = amountPaid || bill.amount;
        bill.datePaid = datePaid || new Date().toISOString();
        bill.updatedAt = new Date().toISOString();

        this.saveBills();
        return bill;
    }

    /**
     * Mark bill as unpaid
     */
    markAsUnpaid(billId) {
        const bill = this.getBill(billId);
        if (!bill) throw new Error(`Bill ${billId} not found`);

        bill.paid = false;
        bill.amountPaid = null;
        bill.datePaid = null;
        bill.updatedAt = new Date().toISOString();

        this.saveBills();
        return bill;
    }

    /**
     * Generate recurring bills from a template bill
     */
    generateRecurringBills(billId, count = 12) {
        const template = this.getBill(billId);
        if (!template) throw new Error(`Bill ${billId} not found`);

        if (template.frequency === 'one-time') {
            throw new Error('Cannot generate recurring bills for one-time bill');
        }

        const generatedBills = [];
        const baseDate = new Date(template.dueDate);

        for (let i = 1; i < count; i++) {
            const newDate = new Date(baseDate);

            // Calculate next due date based on frequency
            switch (template.frequency) {
                case 'weekly':
                    newDate.setDate(newDate.getDate() + (7 * i));
                    break;
                case 'biweekly':
                    newDate.setDate(newDate.getDate() + (14 * i));
                    break;
                case 'monthly':
                    newDate.setMonth(newDate.getMonth() + i);
                    break;
                case 'quarterly':
                    newDate.setMonth(newDate.getMonth() + (3 * i));
                    break;
                case 'yearly':
                    newDate.setFullYear(newDate.getFullYear() + i);
                    break;
            }

            const newBill = {
                id: ++this.billIdCounter,
                name: template.name,
                amount: template.amount,
                dueDate: newDate.toISOString().split('T')[0],
                category: template.category,
                frequency: template.frequency,
                autopay: template.autopay,
                notes: template.notes,
                paymentMethod: template.paymentMethod,
                recurringParentId: billId,
                paid: false,
                amountPaid: null,
                datePaid: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.bills.push(newBill);
            generatedBills.push(newBill);
        }

        this.saveBills();
        return generatedBills;
    }

    /**
     * Get payment history for a bill
     */
    getPaymentHistory(billId) {
        // This would normally query from a database
        // For now, just return the bill's payment info
        const bill = this.getBill(billId);
        if (!bill) return null;

        return {
            billId: bill.id,
            billName: bill.name,
            paidOn: bill.datePaid,
            amount: bill.amountPaid,
            paymentMethod: bill.paymentMethod,
            status: bill.paid ? 'completed' : 'pending'
        };
    }

    /**
     * Get statistics
     */
    getStats() {
        const activeBills = this.bills.filter(b => !b.paid);
        const paidBills = this.bills.filter(b => b.paid);

        const totalAmount = activeBills.reduce((sum, b) => sum + b.amount, 0);
        const averageAmount = activeBills.length > 0 ? totalAmount / activeBills.length : 0;
        
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        const dueThisMonth = activeBills
            .filter(b => {
                const dueDate = new Date(b.dueDate);
                return dueDate.getMonth() === thisMonth && dueDate.getFullYear() === thisYear;
            })
            .reduce((sum, b) => sum + b.amount, 0);

        const overdue = activeBills.filter(b => this.getDaysUntilDue(b.dueDate) < 0).length;
        const dueSoon = activeBills.filter(b => {
            const days = this.getDaysUntilDue(b.dueDate);
            return days >= 0 && days <= 7;
        }).length;

        return {
            totalBills: this.bills.length,
            activeBills: activeBills.length,
            paidBills: paidBills.length,
            totalAmount,
            averageAmount,
            dueThisMonth,
            overdue,
            dueSoon,
            byCategory: this.getByCategory(),
            byFrequency: this.getByFrequency()
        };
    }

    /**
     * Get bills grouped by category
     */
    getByCategory() {
        const grouped = {};
        this.bills.forEach(bill => {
            if (!grouped[bill.category]) {
                grouped[bill.category] = {
                    count: 0,
                    total: 0,
                    bills: []
                };
            }
            grouped[bill.category].count++;
            grouped[bill.category].total += bill.amount;
            grouped[bill.category].bills.push(bill);
        });
        return grouped;
    }

    /**
     * Get bills grouped by frequency
     */
    getByFrequency() {
        const grouped = {};
        this.bills.forEach(bill => {
            if (!grouped[bill.frequency]) {
                grouped[bill.frequency] = {
                    count: 0,
                    total: 0,
                    bills: []
                };
            }
            grouped[bill.frequency].count++;
            grouped[bill.frequency].total += bill.amount;
            grouped[bill.frequency].bills.push(bill);
        });
        return grouped;
    }

    /**
     * Bulk update bills
     */
    bulkUpdate(billIds, updates) {
        const updated = [];
        billIds.forEach(id => {
            const bill = this.updateBill(id, updates);
            updated.push(bill);
        });
        return updated;
    }

    /**
     * Bulk delete bills
     */
    bulkDelete(billIds) {
        billIds.forEach(id => {
            this.deleteBill(id);
        });
    }

    /**
     * Bulk mark as paid
     */
    bulkMarkAsPaid(billIds) {
        const updated = [];
        billIds.forEach(id => {
            const bill = this.markAsPaid(id);
            updated.push(bill);
        });
        return updated;
    }

    /**
     * Export bills as JSON
     */
    exportAsJSON() {
        return JSON.stringify(this.bills, null, 2);
    }

    /**
     * Export bills as CSV
     */
    exportAsCSV() {
        let csv = 'Name,Amount,Due Date,Category,Frequency,Autopay,Status,Notes\n';
        this.bills.forEach(bill => {
            const status = this.getBillStatus(bill);
            const notes = bill.notes.replace(/"/g, '""'); // Escape quotes
            csv += `"${bill.name}","${bill.amount}","${bill.dueDate}","${bill.category}","${bill.frequency}","${bill.autopay}","${status}","${notes}"\n`;
        });
        return csv;
    }

    /**
     * Import bills from JSON
     */
    importFromJSON(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (!Array.isArray(imported)) throw new Error('Invalid format: expected array');

            imported.forEach(bill => {
                // Validate required fields
                if (!bill.name || !bill.amount || !bill.dueDate) {
                    throw new Error('Missing required fields in bill');
                }

                const newBill = {
                    id: ++this.billIdCounter,
                    name: bill.name,
                    amount: parseFloat(bill.amount),
                    dueDate: bill.dueDate,
                    category: bill.category || 'Other',
                    frequency: bill.frequency || 'one-time',
                    autopay: bill.autopay || false,
                    paid: bill.paid || false,
                    notes: bill.notes || '',
                    paymentMethod: bill.paymentMethod || '',
                    amountPaid: bill.amountPaid || null,
                    datePaid: bill.datePaid || null,
                    createdAt: bill.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                this.bills.push(newBill);
            });

            this.saveBills();
            return { success: true, imported: imported.length };
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    /**
     * Get bills for calendar view
     */
    getCalendarData(month, year) {
        const calendarBills = [];
        this.bills.forEach(bill => {
            const billDate = new Date(bill.dueDate);
            if (billDate.getMonth() === month && billDate.getFullYear() === year) {
                calendarBills.push({
                    date: billDate.getDate(),
                    bill: bill,
                    status: this.getBillStatus(bill)
                });
            }
        });
        return calendarBills;
    }

    /**
     * Get spending trend (by month)
     */
    getSpendingTrend(months = 12) {
        const trend = {};
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
            trend[monthKey] = 0;
        }

        this.bills.forEach(bill => {
            const billDate = new Date(bill.dueDate);
            const monthKey = billDate.toISOString().slice(0, 7);
            if (trend.hasOwnProperty(monthKey)) {
                trend[monthKey] += bill.amount;
            }
        });

        return trend;
    }

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BillManager;
}