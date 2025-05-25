// clients.js
class ClientsManager {
  constructor() {
    // Инициализация модальных окон
    this.clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
    this.confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    this.confirmDeleteDebtModal = new bootstrap.Modal(document.getElementById('confirmDeleteDebtModal'));
    this.toast = new bootstrap.Modal(document.getElementById('toast'));

    // Текущие выбранные ID
    this.currentClientId = null;
    this.currentDebtId = null;

    // Кэш данных
    this.cache = {
      clients: null,
      lastFetch: 0,
      currentPage: 1,
      perPage: 10,
      searchQuery: '',
      filterType: 'latest',
      abortController: null
    };

    // Инициализация
    this.initEventListeners();
    this.loadClients();
  }

  // Инициализация обработчиков событий
  initEventListeners() {
    // Кнопки управления
    document.getElementById('addClientBtn').addEventListener('click', () => this.openAddClientModal());
    document.getElementById('addNewClientBtn').addEventListener('click', () => this.openAddClientModal());
    document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
    document.getElementById('resetSearchBtn').addEventListener('click', () => this.resetSearch());

    // Фильтры
    document.getElementById('filterSelect').addEventListener('change', (e) => {
      this.cache.filterType = e.target.value;
      this.cache.currentPage = 1;
      this.loadClients();
    });

    document.getElementById('perPageSelect').addEventListener('change', (e) => {
      this.cache.perPage = parseInt(e.target.value);
      this.cache.currentPage = 1;
      this.loadClients();
    });

    // Форма клиента
    document.getElementById('saveClientBtn').addEventListener('click', () => this.saveClient());
    document.getElementById('deleteClientBtn').addEventListener('click', () => this.showDeleteConfirmation());
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.deleteClient());

    // Управление долгами
    document.getElementById('addDebtBtn').addEventListener('click', () => this.showDebtForm());
    document.getElementById('saveDebtBtn').addEventListener('click', () => this.saveDebt());
    document.getElementById('cancelDebtBtn').addEventListener('click', () => this.hideDebtForm());
    document.getElementById('confirmDeleteDebtBtn').addEventListener('click', () => this.deleteDebt());

    // Дебаунс для поиска
    document.getElementById('searchInput').addEventListener('input', this.debounce(() => {
      this.handleSearch();
    }, 300));
  }

  // ==================== API Methods ====================

  async loadClients() {
    // Отмена предыдущего запроса
    if (this.cache.abortController) {
      this.cache.abortController.abort();
    }

    this.showLoader(true);

    try {
      const params = new URLSearchParams({
        page: this.cache.currentPage,
        page_size: this.cache.perPage,
        filter_tag: this.cache.filterType,
        q: this.cache.searchQuery
      });

      this.cache.abortController = new AbortController();
      const response = await fetch(`/api/v1/clients/?${params}`, {
        signal: this.cache.abortController.signal
      });

      if (!response.ok) throw new Error('Ошибка загрузки клиентов');

      this.cache.clients = await response.json();
      this.renderClients();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading clients:', error);
        this.showToast('Ошибка при загрузке клиентов', 'error');
      }
    } finally {
      this.showLoader(false);
      this.cache.abortController = null;
    }
  }

  async loadClientDebts(clientId) {
    try {
      const response = await fetch(`/api/v1/clients/${clientId}/get_debts/`);
      if (!response.ok) throw new Error('Ошибка загрузки долгов');

      const debts = await response.json();
      this.renderDebts(debts);
    } catch (error) {
      console.error('Error loading debts:', error);
      this.showToast('Ошибка при загрузке долгов', 'error');
    }
  }

  async saveClient() {
    const clientId = document.getElementById('clientId').value;
    const form = document.getElementById('clientForm');
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const clientData = {
      name: document.getElementById('clientName').value.trim(),
      phone_number: document.getElementById('clientPhone').value.trim(),
      description: document.getElementById('clientDescription').value.trim() ,
      is_chosen: document.getElementById('clientIsChosen').checked
    };
    console.log(clientData)
    this.showLoader(true);

    try {
      const method = clientId ? 'PUT' : 'POST';
      const url = clientId ? `/api/v1/clients/${clientId}/` : '/api/v1/clients/';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCsrfToken()
        },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.name) {
          document.getElementById('clientName').classList.add('is-invalid');
          document.getElementById('clientName').nextElementSibling.textContent = errorData.name[0];
          return;
        }
        throw new Error('Ошибка сохранения клиента');
      }

      this.showToast(clientId ? 'Клиент обновлен' : 'Клиент добавлен', 'success');
      this.clientModal.hide();
      this.loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
      this.showToast('Ошибка при сохранении клиента', 'error');
    } finally {
      this.showLoader(false);
    }
  }

  async deleteClient() {
    this.showLoader(true);
    this.confirmDeleteModal.hide();

    try {
      const response = await fetch(`/api/v1/clients/${this.currentClientId}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': this.getCsrfToken()
        }
      });

      if (!response.ok) throw new Error('Ошибка удаления клиента');

      this.showToast('Клиент удален', 'success');
      this.clientModal.hide();
      this.loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      this.showToast('Ошибка при удалении клиента', 'error');
    } finally {
      this.showLoader(false);
      this.currentClientId = null;
    }
  }

  async saveDebt() {
    const debtValue = parseFloat(document.getElementById('debtValue').value);
    if (isNaN(debtValue) || debtValue === 0) {
      this.showToast('Введите корректную сумму долга', 'warning');
      return;
    }

    this.showLoader(true);

    try {
      const response = await fetch(`/api/v1/clients/${this.currentClientId}/add_debt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCsrfToken()
        },
        body: JSON.stringify({ debt_value: debtValue })
      });

      if (!response.ok) throw new Error('Ошибка добавления долга');

      this.showToast('Долг добавлен', 'success');
      this.hideDebtForm();
      document.getElementById('debtValue').value = '';
      this.loadClientDebts(this.currentClientId);
      this.loadClients();
    } catch (error) {
      console.error('Error adding debt:', error);
      this.showToast('Ошибка при добавлении долга', 'error');
    } finally {
      this.showLoader(false);
    }
  }

  async deleteDebt() {
    this.showLoader(true);
    this.confirmDeleteDebtModal.hide();
    // alert()
    try {
      const response = await fetch(`/api/v1/clients/delete_debt/${this.currentDebtId}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': this.getCsrfToken()
        }
      });
      console.log(response)

      // if (!response.ok) throw new Error('Ошибка удаления долга');

      this.showToast('Долг удален', 'success');
      console.log(12345)
      this.loadClientDebts(this.currentClientId);
      this.loadClients();
    } catch (error) {
      console.error('Error deleting debt:', error);
      this.showToast('Ошибка при удалении долга', 'error');
    } 
  }

  // ==================== Modal Methods ====================

  openClientModal(client) {
    this.currentClientId = client.id;
    document.querySelector('.addDebtSection').classList.remove('d-none')
    document.querySelector('.debtList').classList.remove('d-none')
    document.getElementById('clientModalLabel').textContent = client.name;
    document.getElementById('clientId').value = client.id;
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone_number || '';
    document.getElementById('clientDescription').value = client.description || '';
    document.getElementById('clientIsChosen').checked = client.is_chosen;
    
    // Сброс валидации
    document.getElementById('clientForm').classList.remove('was-validated');
    document.getElementById('clientName').classList.remove('is-invalid');
    
    this.hideDebtForm();
    this.loadClientDebts(client.id);
    this.clientModal.show();
  }

  openAddClientModal() {
    this.currentClientId = null;
    
    document.getElementById('clientModalLabel').textContent = 'Добавить клиента';
    document.getElementById('clientForm').reset();
    document.querySelector('.addDebtSection').classList.add('d-none')
    document.querySelector('.debtList').classList.add('d-none')
    document.getElementById('clientForm').classList.remove('was-validated');
    document.getElementById('clientId').value = '';
    
    // Очистка таблицы долгов
    document.getElementById('debtsTableBody').innerHTML = `
      <tr><td colspan="3" class="text-center">Нет записей о долгах</td></tr>`;
    
    this.hideDebtForm();
    this.clientModal.show();
  }

  showDeleteConfirmation() {
    if (!this.currentClientId) return;
    this.confirmDeleteModal.show();
  }

  showDebtForm() {
    document.getElementById('debtFormContainer').classList.remove('d-none');
    document.getElementById('debtValue').focus();
  }

  hideDebtForm() {
    document.getElementById('debtFormContainer').classList.add('d-none');
  }

  showDeleteDebtConfirmation(debtId) {
    // alert()
    this.confirmDeleteDebtModal.show()
    if (!confirm('Вы уверены, что хотите удалить эту операцию?')) return;
    this.currentDebtId = debtId;
    // // alert
    // this.confirmDeleteDebtModal.show();
    this.deleteDebt(debtId)
  }

  // ==================== Render Methods ====================

  renderClients() {
    const tbody = document.querySelector('#clientsTable tbody');
    tbody.innerHTML = '';

    if (!this.cache.clients || this.cache.clients.results.length === 0) {
      document.getElementById('noDataAlert').style.display = 'flex';
      document.getElementById('pagination').innerHTML = '';
      document.getElementById('resultsCount').textContent = '0';
      document.getElementById('currentPage').textContent = '1';
      return;
    }

    document.getElementById('noDataAlert').style.display = 'none';
    document.getElementById('resultsCount').textContent = this.cache.clients.count;
    document.getElementById('currentPage').textContent = this.cache.currentPage;

    this.cache.clients.results.forEach(client => {
      const row = document.createElement('tr');
      row.dataset.id = client.id;
      row.innerHTML = `
        <td>${this.escapeHtml(client.name)}</td>
        <td>${client.phone_number || '-'}</td>
        <td class="${client.debt > 0 ? 'debt-positive' : 'debt-negative'}">
          ${this.formatCurrency(client.debt)}
        </td>
        <td>${this.formatDateTime(client.last_accessed)}</td>
      `;
      row.addEventListener('click', () => this.openClientModal(client));
      tbody.appendChild(row);
    });

    this.renderPagination();
  }

  renderDebts(debts) {
    const tbody = document.getElementById('debtsTableBody');
    tbody.innerHTML = '';

    if (!debts || debts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">Нет записей о долгах</td></tr>';
      return;
    }

    debts.forEach(debt => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${this.formatDate(debt.date_added)}</td>
        <td class="${debt.debt_value > 0 ? 'debt-positive' : 'debt-negative'}">
          ${this.formatCurrency(debt.debt_value)}
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger delete-debt-btn" data-debt-id="${debt.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-debt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // alert()
        // e.defaultPrevented()
        // alert()
        this.showDeleteDebtConfirmation(btn.dataset.debtId);
      });
    });
  }

  renderPagination() {
    // this.showDeleteDebtConfirmation(4)
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (!this.cache.clients || this.cache.clients.count <= this.cache.perPage) return;

    const totalPages = Math.ceil(this.cache.clients.count / this.cache.perPage);
    const currentPage = this.cache.currentPage;
    const maxVisiblePages = 5;

    // Кнопка "Назад"
    this.addPaginationButton(pagination, '«', currentPage - 1, currentPage === 1);

    // Основные страницы
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      this.addPaginationButton(pagination, i.toString(), i, false, i === currentPage);
    }

    // Кнопка "Вперед"
    this.addPaginationButton(pagination, '»', currentPage + 1, currentPage === totalPages);
  }

  addPaginationButton(container, text, page, disabled = false, active = false) {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;

    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = text;

    if (!disabled) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (page !== this.cache.currentPage) {
          this.cache.currentPage = page;
          this.loadClients();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    li.appendChild(a);
    container.appendChild(li);
  }

  // ==================== Utility Methods ====================

  handleSearch() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (this.cache.searchQuery !== searchValue) {
      this.cache.searchQuery = searchValue;
      this.cache.currentPage = 1;
      this.loadClients();
    }
  }

  resetSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterSelect').value = 'latest';

    if (this.cache.searchQuery || this.cache.filterType !== 'latest') {
      this.cache.searchQuery = '';
      this.cache.filterType = 'latest';
      this.cache.currentPage = 1;
      this.loadClients();
    }
  }

  showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
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

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
        return container;
    }

  showLoader(show) {
    document.getElementById('loader').style.display = show ? 'flex' : 'none';
  }

  getCsrfToken() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  }

  debounce(func, wait, immediate = false) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(value) + ' ₸';
  }

  formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
  }

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new ClientsManager();
});