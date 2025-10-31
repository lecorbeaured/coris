/**
 * Bill Management UI Components
 * Provides modals and UI for:
 * - Edit bills
 * - Add bill notes
 * - Search and filter
 * - Bulk operations
 * - Import/Export
 */

// ========================================
// EDIT BILL MODAL HTML
// ========================================
const EDIT_BILL_MODAL_HTML = `
<div id="editBillModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>✏️ Edit Bill</h2>
            <button class="close-btn" onclick="closeEditBillModal()">&times;</button>
        </div>

        <div style="padding: 25px;">
            <div class="bill-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Bill Name *</label>
                        <input type="text" id="editBillName" placeholder="e.g., Electric Bill">
                    </div>
                    <div class="form-group">
                        <label>Amount *</label>
                        <input type="number" id="editBillAmount" placeholder="0.00" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Due Date *</label>
                        <input type="date" id="editBillDueDate">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="editBillCategory">
                            <option value="Utilities">Utilities</option>
                            <option value="Subscriptions">Subscriptions</option>
                            <option value="Loans">Loans</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Rent/Mortgage">Rent/Mortgage</option>
                            <option value="Credit Cards">Credit Cards</option>
                            <option value="Medical">Medical</option>
                            <option value="Childcare">Childcare</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Frequency</label>
                        <select id="editBillFrequency">
                            <option value="one-time">One-Time</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Auto-Pay?</label>
                        <select id="editBillAutopay">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <select id="editBillPaymentMethod">
                            <option value="">Not Specified</option>
                            <option value="credit-card">Credit Card</option>
                            <option value="bank-transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="editBillNotes" placeholder="e.g., Account number, payment portal, contact info" rows="3" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 1rem;"></textarea>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn" style="flex: 1;" onclick="saveEditedBill()">💾 Save Changes</button>
                    <button class="btn btn-danger" style="flex: 1;" onclick="closeEditBillModal()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ========================================
// SEARCH & FILTER UI
// ========================================
const SEARCH_FILTER_HTML = `
<div id="searchFilterContainer" style="margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 12px;">
    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; align-items: center;">
        <input type="text" id="billSearchBox" placeholder="🔍 Search bills by name, category, or notes..." 
               style="flex: 1; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; min-width: 200px;"
               onkeyup="handleBillSearch()">
        <button class="btn" style="padding: 10px 20px;" onclick="toggleAdvancedFilters()">🎚️ Filters</button>
        <button class="btn" style="padding: 10px 20px;" onclick="clearFilters()">✕ Clear</button>
    </div>

    <div id="advancedFiltersContainer" style="display: none; padding-top: 15px; border-top: 1px solid #e2e8f0;">
        <div class="form-grid">
            <div class="form-group">
                <label>Category</label>
                <select id="filterCategory" onchange="applyFilters()">
                    <option value="">All Categories</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Loans">Loans</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Rent/Mortgage">Rent/Mortgage</option>
                    <option value="Credit Cards">Credit Cards</option>
                    <option value="Medical">Medical</option>
                    <option value="Childcare">Childcare</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label>Min Amount</label>
                <input type="number" id="filterMinAmount" placeholder="0" step="0.01" onchange="applyFilters()">
            </div>

            <div class="form-group">
                <label>Max Amount</label>
                <input type="number" id="filterMaxAmount" placeholder="9999" step="0.01" onchange="applyFilters()">
            </div>

            <div class="form-group">
                <label>Frequency</label>
                <select id="filterFrequency" onchange="applyFilters()">
                    <option value="">All Frequencies</option>
                    <option value="one-time">One-Time</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            <div class="form-group">
                <label>Autopay</label>
                <select id="filterAutopay" onchange="applyFilters()">
                    <option value="">All</option>
                    <option value="yes">On Autopay</option>
                    <option value="no">Not on Autopay</option>
                </select>
            </div>

            <div class="form-group">
                <label>Status</label>
                <select id="filterStatus" onchange="applyFilters()">
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="due-soon">Due Soon</option>
                    <option value="upcoming">Upcoming</option>
                </select>
            </div>
        </div>
    </div>
</div>
`;

// ========================================
// BULK ACTIONS TOOLBAR
// ========================================
const BULK_ACTIONS_HTML = `
<div id="bulkActionsToolbar" style="display: none; margin-bottom: 15px; padding: 15px; background: #edf2f7; border-radius: 12px; border-left: 4px solid #667eea;">
    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <span id="bulkSelectCount" style="font-weight: 600; color: #667eea;"></span>
        <button class="btn btn-small" onclick="bulkMarkAsPaid()">✓ Mark Paid</button>
        <button class="btn btn-small" onclick="bulkMarkAsUnpaid()">↩️ Mark Unpaid</button>
        <button class="btn btn-small" onclick="bulkDeleteSelected()">🗑️ Delete</button>
        <button class="btn btn-small" style="background: #cbd5e0; color: #2d3748;" onclick="clearBulkSelection()">Cancel</button>
    </div>
</div>
`;

// ========================================
// EXPORT/IMPORT MODAL
// ========================================
const EXPORT_IMPORT_MODAL_HTML = `
<div id="exportImportModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>📊 Export / Import Bills</h2>
            <button class="close-btn" onclick="closeExportImportModal()">&times;</button>
        </div>

        <div class="modal-tabs">
            <button class="modal-tab active" data-tab="export" onclick="showExportTab()">📥 Export</button>
            <button class="modal-tab" data-tab="import" onclick="showImportTab()">📤 Import</button>
        </div>

        <div style="padding: 25px;">
            <!-- Export Tab -->
            <div id="exportTab" style="display: block;">
                <h3 style="color: #667eea; margin-bottom: 15px;">Export Your Bills</h3>
                <p style="color: #4a5568; margin-bottom: 20px;">Download your bills for backup or use in another application.</p>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                    <button class="btn" onclick="exportBillsAsJSON()">📄 Export as JSON</button>
                    <button class="btn" onclick="exportBillsAsCSV()">📊 Export as CSV</button>
                </div>

                <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                    <strong>What's included:</strong>
                    <ul style="margin-left: 20px; color: #4a5568; line-height: 1.8;">
                        <li>All bill names, amounts, and due dates</li>
                        <li>Categories, frequency, autopay status</li>
                        <li>Notes and payment methods</li>
                        <li>Payment history</li>
                    </ul>
                </div>
            </div>

            <!-- Import Tab -->
            <div id="importTab" style="display: none;">
                <h3 style="color: #667eea; margin-bottom: 15px;">Import Bills</h3>
                <p style="color: #4a5568; margin-bottom: 20px;">Upload a previously exported JSON file to restore your bills.</p>
                
                <div class="form-group">
                    <label>Select JSON File</label>
                    <input type="file" id="importFile" accept=".json" style="padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                </div>

                <div style="display: flex; gap: 10px;">
                    <button class="btn" onclick="importBillsFromFile()">📤 Import Bills</button>
                    <button class="btn btn-danger" onclick="closeExportImportModal()">Cancel</button>
                </div>

                <div style="background: #fff5f5; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #fc8181;">
                    <strong style="color: #c53030;">⚠️ Note:</strong>
                    <p style="color: #4a5568; margin-top: 8px;">Importing will add bills to your existing list. It won't delete or replace current bills.</p>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ========================================
// BILL DETAILS VIEW
// ========================================
const BILL_DETAILS_MODAL_HTML = `
<div id="billDetailsModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="billDetailsTitle">📋 Bill Details</h2>
            <button class="close-btn" onclick="closeBillDetailsModal()">&times;</button>
        </div>

        <div style="padding: 25px;">
            <div id="billDetailsContent"></div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn" onclick="editCurrentBill()" style="flex: 1;">✏️ Edit</button>
                <button class="btn btn-success" id="billDetailsPaidBtn" onclick="toggleBillPaid()" style="flex: 1;"></button>
                <button class="btn btn-danger" onclick="deleteBillWithConfirm()" style="flex: 1;">🗑️ Delete</button>
            </div>
        </div>
    </div>
</div>
`;

// ========================================
// JAVASCRIPT FUNCTIONS FOR INTEGRATION
// ========================================
const BILL_MANAGEMENT_FUNCTIONS = `
// Initialize bill manager
let billManager = new BillManager();
let selectedBillIds = new Set();
let currentEditingBillId = null;
let currentViewingBillId = null;

// ========================================
// MODAL FUNCTIONS
// ========================================

function openEditBillModal(billId) {
    const bill = billManager.getBill(billId);
    if (!bill) return alert('Bill not found');

    currentEditingBillId = billId;

    document.getElementById('editBillName').value = bill.name;
    document.getElementById('editBillAmount').value = bill.amount;
    document.getElementById('editBillDueDate').value = bill.dueDate;
    document.getElementById('editBillCategory').value = bill.category;
    document.getElementById('editBillFrequency').value = bill.frequency;
    document.getElementById('editBillAutopay').value = bill.autopay ? 'yes' : 'no';
    document.getElementById('editBillPaymentMethod').value = bill.paymentMethod || '';
    document.getElementById('editBillNotes').value = bill.notes || '';

    document.getElementById('editBillModal').classList.add('show');
}

function closeEditBillModal() {
    document.getElementById('editBillModal').classList.remove('show');
    currentEditingBillId = null;
}

function saveEditedBill() {
    if (!currentEditingBillId) return;

    const updates = {
        name: document.getElementById('editBillName').value,
        amount: document.getElementById('editBillAmount').value,
        dueDate: document.getElementById('editBillDueDate').value,
        category: document.getElementById('editBillCategory').value,
        frequency: document.getElementById('editBillFrequency').value,
        autopay: document.getElementById('editBillAutopay').value === 'yes',
        paymentMethod: document.getElementById('editBillPaymentMethod').value,
        notes: document.getElementById('editBillNotes').value
    };

    if (!updates.name || !updates.amount || !updates.dueDate) {
        return alert('Please fill in all required fields');
    }

    try {
        billManager.updateBill(currentEditingBillId, updates);
        closeEditBillModal();
        updateDashboard();
        renderBills();
        showNotification('✅ Bill updated successfully!');
    } catch (error) {
        alert('Error updating bill: ' + error.message);
    }
}

function openBillDetailsModal(billId) {
    const bill = billManager.getBill(billId);
    if (!bill) return;

    currentViewingBillId = billId;

    document.getElementById('billDetailsTitle').textContent = '📋 ' + bill.name;

    const status = billManager.getBillStatus(bill);
    const statusColors = {
        'paid': '#48bb78',
        'overdue': '#fc8181',
        'due-soon': '#f6ad55',
        'upcoming': '#667eea'
    };

    let html = \`
        <div style="background: \${statusColors[status] || '#667eea'}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <strong>Status:</strong> \${status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        <div class="form-grid" style="margin-bottom: 20px;">
            <div>
                <label style="color: #718096; font-size: 0.85rem;">Amount</label>
                <p style="font-size: 1.5rem; font-weight: 700; color: #667eea;">\${billManager.formatCurrency(bill.amount)}</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.85rem;">Due Date</label>
                <p style="font-size: 1.5rem; font-weight: 700; color: #2d3748;">\${billManager.formatDate(bill.dueDate)}</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.85rem;">Category</label>
                <p style="font-size: 1rem; font-weight: 600; color: #4a5568;">\${bill.category}</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.85rem;">Frequency</label>
                <p style="font-size: 1rem; font-weight: 600; color: #4a5568;">\${bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1)}</p>
            </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 15px;">
            <label style="color: #718096; font-size: 0.85rem;">🏷️ Autopay</label>
            <p style="color: #4a5568;">\${bill.autopay ? '✅ Enabled' : '❌ Disabled'}</p>
        </div>

        \${bill.paymentMethod ? \`
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 15px;">
                <label style="color: #718096; font-size: 0.85rem;">💳 Payment Method</label>
                <p style="color: #4a5568;">\${bill.paymentMethod}</p>
            </div>
        \` : ''}

        \${bill.notes ? \`
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 15px;">
                <label style="color: #718096; font-size: 0.85rem;">📝 Notes</label>
                <p style="color: #4a5568; background: #f7fafc; padding: 10px; border-radius: 8px; white-space: pre-wrap;">\${bill.notes}</p>
            </div>
        \` : ''}

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
            <label style="color: #718096; font-size: 0.85rem;">📅 Dates</label>
            <p style="color: #4a5568; font-size: 0.9rem;">
                Created: \${new Date(bill.createdAt).toLocaleDateString()}<br>
                Last Updated: \${new Date(bill.updatedAt).toLocaleDateString()}
            </p>
        </div>
    \`;

    document.getElementById('billDetailsContent').innerHTML = html;

    const paidBtn = document.getElementById('billDetailsPaidBtn');
    if (bill.paid) {
        paidBtn.textContent = '↩️ Mark Unpaid';
        paidBtn.className = 'btn';
    } else {
        paidBtn.textContent = '✓ Mark Paid';
        paidBtn.className = 'btn btn-success';
    }

    document.getElementById('billDetailsModal').classList.add('show');
}

function closeBillDetailsModal() {
    document.getElementById('billDetailsModal').classList.remove('show');
    currentViewingBillId = null;
}

// ========================================
// SEARCH & FILTER FUNCTIONS
// ========================================

function handleBillSearch() {
    const query = document.getElementById('billSearchBox').value;
    
    if (!query) {
        renderBills();
        return;
    }

    const results = billManager.searchBills(query);
    renderSearchResults(results);
}

function toggleAdvancedFilters() {
    const container = document.getElementById('advancedFiltersContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

function applyFilters() {
    const filters = {
        category: document.getElementById('filterCategory').value || undefined,
        minAmount: document.getElementById('filterMinAmount').value ? parseFloat(document.getElementById('filterMinAmount').value) : undefined,
        maxAmount: document.getElementById('filterMaxAmount').value ? parseFloat(document.getElementById('filterMaxAmount').value) : undefined,
        frequency: document.getElementById('filterFrequency').value || undefined,
        autopay: document.getElementById('filterAutopay').value === 'yes' ? true : document.getElementById('filterAutopay').value === 'no' ? false : undefined,
        status: document.getElementById('filterStatus').value || undefined
    };

    const filtered = billManager.filterBills(filters);
    renderSearchResults(filtered);
}

function clearFilters() {
    document.getElementById('billSearchBox').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterMinAmount').value = '';
    document.getElementById('filterMaxAmount').value = '';
    document.getElementById('filterFrequency').value = '';
    document.getElementById('filterAutopay').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('advancedFiltersContainer').style.display = 'none';
    renderBills();
}

function renderSearchResults(bills) {
    const container = document.getElementById('billsList');
    
    if (bills.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No bills match your search.</p>';
        return;
    }

    const sorted = billManager.sortBills(bills, 'dueDate', 'asc');
    container.innerHTML = sorted.map(bill => renderBillItem(bill, true)).join('');
}

// ========================================
// BULK SELECTION FUNCTIONS
// ========================================

function toggleBillSelection(billId) {
    if (selectedBillIds.has(billId)) {
        selectedBillIds.delete(billId);
    } else {
        selectedBillIds.add(billId);
    }

    updateBulkActionsToolbar();
    renderBills(); // Re-render to show checkboxes
}

function updateBulkActionsToolbar() {
    const toolbar = document.getElementById('bulkActionsToolbar');
    const count = selectedBillIds.size;

    if (count === 0) {
        toolbar.style.display = 'none';
        return;
    }

    toolbar.style.display = 'block';
    document.getElementById('bulkSelectCount').textContent = \`\${count} bill\${count !== 1 ? 's' : ''} selected\`;
}

function bulkMarkAsPaid() {
    if (selectedBillIds.size === 0) return;
    billManager.bulkMarkAsPaid(Array.from(selectedBillIds));
    clearBulkSelection();
    updateDashboard();
    renderBills();
    showNotification('✅ Bills marked as paid!');
}

function bulkMarkAsUnpaid() {
    if (selectedBillIds.size === 0) return;
    Array.from(selectedBillIds).forEach(id => billManager.markAsUnpaid(id));
    clearBulkSelection();
    updateDashboard();
    renderBills();
    showNotification('✅ Bills marked as unpaid!');
}

function bulkDeleteSelected() {
    if (selectedBillIds.size === 0) return;
    if (!confirm(\`Delete \${selectedBillIds.size} bill(s)? This cannot be undone.\`)) return;
    
    billManager.bulkDelete(Array.from(selectedBillIds));
    clearBulkSelection();
    updateDashboard();
    renderBills();
    showNotification('✅ Bills deleted!');
}

function clearBulkSelection() {
    selectedBillIds.clear();
    updateBulkActionsToolbar();
    renderBills();
}

// ========================================
// EXPORT/IMPORT FUNCTIONS
// ========================================

function openExportImportModal() {
    document.getElementById('exportImportModal').classList.add('show');
}

function closeExportImportModal() {
    document.getElementById('exportImportModal').classList.remove('show');
}

function showExportTab() {
    document.getElementById('exportTab').style.display = 'block';
    document.getElementById('importTab').style.display = 'none';
    document.querySelectorAll('.modal-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector('[data-tab="export"]').classList.add('active');
}

function showImportTab() {
    document.getElementById('exportTab').style.display = 'none';
    document.getElementById('importTab').style.display = 'block';
    document.querySelectorAll('.modal-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector('[data-tab="import"]').classList.add('active');
}

function exportBillsAsJSON() {
    const json = billManager.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`bills-\${new Date().toISOString().split('T')[0]}.json\`;
    link.click();
    showNotification('✅ Bills exported as JSON!');
}

function exportBillsAsCSV() {
    const csv = billManager.exportAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`bills-\${new Date().toISOString().split('T')[0]}.csv\`;
    link.click();
    showNotification('✅ Bills exported as CSV!');
}

function importBillsFromFile() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return alert('Please select a file');

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const result = billManager.importFromJSON(e.target.result);
            closeExportImportModal();
            updateDashboard();
            renderBills();
            showNotification(\`✅ \${result.imported} bills imported successfully!\`);
        } catch (error) {
            alert('Error importing bills: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ========================================
// OTHER HELPER FUNCTIONS
// ========================================

function editCurrentBill() {
    closeBillDetailsModal();
    openEditBillModal(currentViewingBillId);
}

function toggleBillPaid() {
    const bill = billManager.getBill(currentViewingBillId);
    if (bill.paid) {
        billManager.markAsUnpaid(currentViewingBillId);
    } else {
        billManager.markAsPaid(currentViewingBillId);
    }
    updateDashboard();
    renderBills();
    closeBillDetailsModal();
    showNotification(bill.paid ? '✅ Bill marked as unpaid!' : '✅ Bill marked as paid!');
}

function deleteBillWithConfirm() {
    if (!confirm('Delete this bill? This cannot be undone.')) return;
    billManager.deleteBill(currentViewingBillId);
    closeBillDetailsModal();
    updateDashboard();
    renderBills();
    showNotification('✅ Bill deleted!');
}

function showNotification(message) {
    // You can customize this to show a better notification
    console.log(message);
    // Optional: Add a toast notification here
}
\`;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EDIT_BILL_MODAL_HTML,
        SEARCH_FILTER_HTML,
        BULK_ACTIONS_HTML,
        EXPORT_IMPORT_MODAL_HTML,
        BILL_DETAILS_MODAL_HTML,
        BILL_MANAGEMENT_FUNCTIONS
    };
}