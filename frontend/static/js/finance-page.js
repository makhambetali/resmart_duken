document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const cashFlowTable = document.getElementById('cashFlowTable');
    const cashFlowBody = document.getElementById('cashFlowBody');
    const dateFilter = document.getElementById('dateFilter');
    const filterBtn = document.getElementById('filterBtn');
    const addCashFlowBtn = document.getElementById('addCashFlowBtn');
    const cashFlowModal = new bootstrap.Modal('#cashFlowModal');
    const cashFlowForm = document.getElementById('cashFlowForm');
    const saveCashFlowBtn = document.getElementById('saveCashFlowBtn');
    const deleteCashFlowBtn = document.getElementById('deleteCashFlowBtn')
    const incomeTotal = document.getElementById('incomeTotal');
    const expenseTotal = document.getElementById('expenseTotal');
    const balanceTotal = document.getElementById('balanceTotal');
    const supplyBody = document.getElementById('supplyBody');
    const supplyCashTotal = document.getElementById('supplyCashTotal');
    const supplyBankTotal = document.getElementById('supplyBankTotal');
    const supplyTotal = document.getElementById('supplyTotal');
    const supplyApiUrl = '/api/v1/supplies/get_by_date/';
    function isToday(dateStr) {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    }
    dateFilter.value = new Date().toISOString().split('T')[0]
    let currentCashFlowId = null;
    const apiUrl = '/api/v1/cashflows/';
    function formatCurrency(value) {
        if (value === null || value === undefined || value === '') return '0 ₸';
        const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
        if (isNaN(num)) return '0 ₸';
        
        // Форматируем с точками как разделителями тысяч
        return num.toString()
            .replace(/\D/g, '') // Оставляем только цифры
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Добавляем точки как разделители
            .replace(/^0+/, ''); // Убираем ведущие нули и добавляем символ валюты
        }
    function loadSupplies(date = null) {
    let url = supplyApiUrl;
    if (date) {
        url += `?date=${date}`;
    } else {
        const today = new Date().toISOString().split('T')[0];
        url += `?date=${today}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderSupplies(data);
            calculateSupplyTotals(data);
        })
        .catch(error => {
            console.error('Error loading supplies:', error);
            showToast('Ошибка при загрузке данных о поставках', 'danger');
        });
}

// Функция для отображения поставок в таблице
function renderSupplies(supplies) {
    supplyBody.innerHTML = '';
    document.querySelector('#supplyHead').innerHTML = `<tr>
                            <th>Поставщик</th>
                            <th>Наличные</th>
                            <th>Банковская карта</th>
                            <th class="hide-on-mobile">Бонус</th>
                            <th class="hide-on-mobile">Обмен</th>
                            <th class="hide-on-mobile">Дата</th>
                        </tr>`
    supplies.forEach(supply => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supply.supplier}</td>
            <td>${supply.price_cash.toLocaleString()} ₸</td>
            <td>${supply.price_bank.toLocaleString()} ₸</td>
            <td class="hide-on-mobile">${supply.bonus > 0 ? '+' + supply.bonus : supply.bonus}</td>
            <td class="hide-on-mobile">${supply.exchange > 0 ? '-' + supply.exchange : supply.exchange}</td>
            <td class="hide-on-mobile">${new Date(supply.delivery_date).toLocaleDateString()}</td>
        `;
        supplyBody.appendChild(row);
    });
}

// Функция для расчета итогов по поставкам
function calculateSupplyTotals(supplies) {
    let cashTotal = 0;
    let bankTotal = 0;
    let total = 0;

    supplies.forEach(supply => {
        console.log(supply.is_confirmed)
        cashTotal += supply.price_cash;
        bankTotal += supply.price_bank;
        total += supply.price_cash + supply.price_bank;
    });

    supplyCashTotal.textContent = `${cashTotal.toLocaleString()} ₸`;
    supplyBankTotal.textContent = `${bankTotal.toLocaleString()} ₸`;
    supplyTotal.textContent = `${total.toLocaleString()} ₸`;
}

    // Загрузка данных
    function loadCashFlows(date = null) {
        let url = apiUrl;
        if (date) {
            url += `?date=${date}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                renderCashFlows(data);
                calculateTotals(data);
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Ошибка при загрузке данных', 'danger');
            });
    }

    // Отображение операций в таблице
    function renderCashFlows(cashFlows) {
    const isTodaySelected = isToday(dateFilter.value);
    const table = document.getElementById('cashFlowTable');
    const oldThead = table.querySelector('thead');
    if (oldThead) oldThead.remove(); // Удаляем старый thead, если он есть

    // Создаём новый thead
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.innerHTML = `
        <th>Сумма</th>
        <th>Описание</th>
        <th>Дата/время</th>
    `;
    thead.appendChild(headRow);
    table.insertBefore(thead, table.firstChild);

    // Очищаем тело таблицы
    const cashFlowBody = document.getElementById('cashFlowBody');
    cashFlowBody.innerHTML = '';

    // Добавляем строки
    cashFlows.forEach(cashFlow => {
        const row = document.createElement('tr');
        const amountClass = cashFlow.amount >= 0 ? 'text-success' : 'text-danger';
        const amountSign = cashFlow.amount >= 0 ? '+' : '';

        row.innerHTML = `
            <td class="${amountClass} fw-bold">${amountSign}${cashFlow.amount.toLocaleString()} ₸</td>
            <td>${cashFlow.description || '-'}</td>
            <td>${new Date(cashFlow.date_added).toLocaleString()}</td>
        `;
       
        if(isTodaySelected){
            row.style.cursor = 'pointer'
            row.addEventListener('click', () => {
            editCashFlow(cashFlow.id)
        })
        }
        else{
            row.style.cursor = 'not-allowed'
        }
        cashFlowBody.appendChild(row);
    });

    // Добавляем обработчики событий только если isToday
    if (isTodaySelected) {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editCashFlow(btn.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteCashFlow(btn.dataset.id));
        });
    }
}
    deleteCashFlowBtn.addEventListener('click', () => {
        deleteCashFlow(currentCashFlowId)
        cashFlowForm.reset()
        cashFlowModal.hide()
    })
    
    // Расчет итогов
    function calculateTotals(cashFlows) {
        let income = 0;
        let expense = 0;

        cashFlows.forEach(cashFlow => {
            if (cashFlow.amount >= 0) {
                income += cashFlow.amount;
            } else {
                expense += Math.abs(cashFlow.amount);
            }
        });

        incomeTotal.textContent = `${income.toLocaleString()} ₸`;
        expenseTotal.textContent = `${expense.toLocaleString()} ₸`;
        balanceTotal.textContent = `${(income - expense).toLocaleString()} ₸`;
    }

    // Добавление новой операции
    function addCashFlow() {
        currentCashFlowId = null;
        deleteCashFlowBtn.style.display = 'none'
        document.getElementById('modalTitle').textContent = 'Добавить операцию';
        cashFlowForm.reset();
        cashFlowModal.show();
    }

    // Редактирование операции
    function editCashFlow(id) {
        currentCashFlowId = id;
        deleteCashFlowBtn.style.display = 'block'
        document.getElementById('modalTitle').textContent = 'Редактировать операцию';
        
        fetch(`${apiUrl}${id}/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('amount').value = data.amount;
                document.getElementById('description').value = data.description || '';
                cashFlowModal.show();
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Ошибка при загрузке данных', 'danger');
            });
    }

    // Сохранение операции
    function saveCashFlow() {
        const amount = parseInt(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        
        if (!amount) {
            showToast('Пожалуйста, введите сумму', 'warning');
            return;
        }

        const method = currentCashFlowId ? 'PUT' : 'POST';
        const url = currentCashFlowId ? `${apiUrl}${currentCashFlowId}/` : apiUrl;

        saveCashFlowBtn.disabled = true;
        saveCashFlowBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Сохранение...';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                amount: amount,
                description: description
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            showToast('Операция успешно сохранена', 'success');
            cashFlowModal.hide();
            loadCashFlows(date=dateFilter.value);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Ошибка при сохранении', 'danger');
        })
        .finally(() => {
            saveCashFlowBtn.disabled = false;
            saveCashFlowBtn.innerHTML = 'Сохранить';
        });
    }

    // Удаление операции
    function deleteCashFlow(id) {
        if (!confirm('Вы уверены, что хотите удалить эту операцию?')) return;

        fetch(`${apiUrl}${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            showToast('Операция удалена', 'success');
            loadCashFlows();
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Ошибка при удалении', 'danger');
        });
    }

    // Вспомогательные функции
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
        return container;
    }

    // Обработчики событий
    filterBtn.addEventListener('click', () => {
    const date = dateFilter.value;
    loadCashFlows(date);
    loadSupplies(date);
});
    addCashFlowBtn.addEventListener('click', addCashFlow);
    saveCashFlowBtn.addEventListener('click', saveCashFlow);
loadCashFlows();    
    loadSupplies();
});
