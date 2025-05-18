const cashFlowForm = document.querySelector('#cashFlowModal form');
const amountInput = document.getElementById('amountInput');
const descriptionText = document.getElementById('descriptionText');
const submitBtn = document.getElementById('submitCashFlow');

document.querySelectorAll('input[name="paymentType"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const cashGroup = document.getElementById('cashAmountGroup');
    const bankGroup = document.getElementById('bankAmountGroup');
    
    if (this.id === 'cashPayment') {
      cashGroup.style.display = 'block';
      bankGroup.style.display = 'none';
      document.getElementById('priceCashInput').value = document.getElementById('priceBankInput').value;
      document.getElementById('priceBankInput').value = ''
    } else if (this.id === 'bankPayment') {
      cashGroup.style.display = 'none';
      bankGroup.style.display = 'block';
      document.getElementById('priceBankInput').value = document.getElementById('priceCashInput').value;
      document.getElementById('priceCashInput').value = ''
    } else {
      cashGroup.style.display = 'block';
      bankGroup.style.display = 'block';
      // document.getElementById('priceCashInput').value = document.getElementById('priceBankInput').value
      // document.getElementById('priceBankInput').value = document.getElementById('priceCashInput').value;
      document.getElementById('priceBankInput').value = ''
      document.getElementById('priceCashInput').value = ''
    }
  });
});

// Аналогично для редактирования
document.querySelectorAll('input[name="editPaymentType"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const cashGroup = document.getElementById('editCashAmountGroup');
    const bankGroup = document.getElementById('editBankAmountGroup');
    
    if (this.id === 'editCashPayment') {
      cashGroup.style.display = 'block';
      bankGroup.style.display = 'none';
      document.getElementById('editPriceCashInput').value = document.getElementById('editPriceBankInput').value;
      document.getElementById('editPriceBankInput').value = '';
    } else if (this.id === 'editBankPayment') {
      cashGroup.style.display = 'none';
      bankGroup.style.display = 'block';
      document.getElementById('editPriceBankInput').value = document.getElementById('editPriceCashInput').value;
      document.getElementById('editPriceCashInput').value = '';
    } else {
      cashGroup.style.display = 'block';
      bankGroup.style.display = 'block';
    }
  });
});
cashFlowForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const amount = parseInt(amountInput.value);
    const description = descriptionText.value.trim();
    
    if (!amount) {
      alert('Пожалуйста, введите сумму');
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Сохранение...';
    
    try {
      const response = await fetch('/api/v1/cashflows/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({
          amount: amount,
          description: description
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка сохранения');
      }
      
      const result = await response.json();
      console.log('Успешно сохранено:', result);
      
      // Закрываем модальное окно
      const modal = bootstrap.Modal.getInstance(document.getElementById('cashFlowModal'));
      modal.hide();
      
      // Очищаем форму
      cashFlowForm.reset();
      
      // Обновляем список операций (если нужно)
      // refreshCashFlows();
      
      // Показываем уведомление
      showToast('Операция успешно сохранена!', 'success');
      
    } catch (error) {
      console.error('Ошибка:', error);
      showToast(error.message, 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Сохранить';
    }
  });
  function getCsrfToken() {
  const cookie = document.cookie.match(/csrftoken=([^ ;]+)/);
  return cookie ? cookie[1] : '';
}
  // Валидация суммы при вводе
  amountInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9-]/g, '');
  });
  
  // Автоматическое закрытие при успешном сохранении
  document.getElementById('cashFlowModal').addEventListener('hidden.bs.modal', function() {
    cashFlowForm.reset();
  });
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


async function deleteSupply() {
  const supplyId = document.getElementById('editSupplyId').value;
  
  if (!confirm('Вы уверены, что хотите удалить эту поставку?')) return;
  
  try {
    const response = await fetch(`/api/v1/supplies/${supplyId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    // Закрываем модальное окно и обновляем данные
    bootstrap.Modal.getInstance(document.getElementById('editSupplyModal')).hide();
    showToast('Поставка успешно удалена')
    fetchSupplies();
    
  } catch (error) {
    console.error('Error deleting supply:', error);
    showToast(error.message, 'danger');
  }
}
function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

// Loader simulation
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

// Преобразование форматированной строки обратно в число
function parseCurrency(value) {
  if (!value) return 0;
  
  // Удаляем символ валюты, пробелы и точки (разделители тысяч)
  const numStr = value.replace(/[^\d]/g, '');
  
  // Преобразуем в число
  const num = parseFloat(numStr);
  
  return isNaN(num) ? 0 : num;
}

function setupCurrencyInput(inputId) {
  const input = document.getElementById(inputId);
  
  // Форматирование значения с разделителями
  const formatValue = (value) => {
    // Удаляем все нецифровые символы
    const numStr = value.replace(/\D/g, '');
    // Добавляем разделители тысяч
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  // Обработчик ввода - форматируем в реальном времени
  input.addEventListener('input', function(e) {
    // Сохраняем позицию курсора до форматирования
    const cursorPosition = this.selectionStart;
    const originalLength = this.value.length;
    
    // Получаем неформатированное значение
    const rawValue = this.value.replace(/\./g, '');
    
    // Форматируем значение
    this.value = formatValue(rawValue);
    
    // Корректируем позицию курсора
    const newLength = this.value.length;
    const lengthDiff = newLength - originalLength;
    const newCursorPosition = cursorPosition + lengthDiff;
    
    // Устанавливаем курсор на новую позицию
    this.setSelectionRange(newCursorPosition, newCursorPosition);
  });
  
  // При фокусе - показываем чистое число для удобства редактирования
  input.addEventListener('focus', function() {
    this.value = this.value.replace(/\./g, '');
  });
  
  // При потере фокуса - форматируем окончательно
  input.addEventListener('blur', function() {
    const numValue = this.value.replace(/\./g, '');
    if (numValue === '') {
      this.value = '0 ₸';
    } else {
      this.value = formatValue(numValue) + ' ₸';
    }
  });
  
  // Инициализация начального значения
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      this.blur(); // Применяем форматирование при нажатии Enter
    }
  });
  
  // Устанавливаем начальное значение
  input.value = input.value === '' ? '0 ₸' : formatValue(input.value.replace(/\./g, '')) + ' ₸';
}
document.getElementById('supplierInput').addEventListener('keydown', (e) => {
  const options = document.querySelectorAll('.supplier-option');
  let highlighted = document.querySelector('.supplier-option.highlighted');
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!highlighted) {
      options[0]?.classList.add('highlighted');
    } else {
      highlighted.classList.remove('highlighted');
      highlighted.nextElementSibling?.classList.add('highlighted');
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (highlighted) {
      highlighted.classList.remove('highlighted');
      highlighted.previousElementSibling?.classList.add('highlighted');
    }
  } else if (e.key === 'Enter' && highlighted) {
    e.preventDefault();
    selectSupplier(highlighted.dataset.value);
  }
});
window.addEventListener('load', function() {
  fetchSupplies();
  setTimeout(function() {
    document.querySelector('.loader-container').style.display = 'none';
  }, 1000);
});

// Function to fetch supplies from API
async function fetchSupplies() {
  try {
    const response = await fetch('/api/v1/supplies/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const supplies = await response.json();
    renderSupplies(supplies);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    showToast(`Ошибка при загрузке данных: ${error.message}`, 'danger');
  }
}

// Function to format date and time
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const dateStr = date.toLocaleDateString('ru-RU');
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} ${timeStr}`;
}

// Function to calculate time ago
function timeAgo(dateTimeStr) {
  const now = new Date();
  const date = new Date(dateTimeStr);
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'} назад`;
  } else {
    return 'только что';
  }
}

// Function to render supplies grouped by date
function renderSupplies(supplies) {
  // Группируем поставки по дате
  const groupedSupplies = {};
  supplies.forEach(supply => {
    const date = supply.delivery_date;
    if (!groupedSupplies[date]) {
      groupedSupplies[date] = [];
    }
    groupedSupplies[date].push(supply);
  });

  // Сортируем даты (новые сначала)
  const sortedDates = Object.keys(groupedSupplies).sort((a, b) => new Date(a) - new Date(b));
  
  // Получаем контейнер
  const container = document.querySelector('.container-custom');
  
  // Находим точку вставки перед кнопками навигации
  const buttons = document.querySelectorAll('.button-nav');
  const insertPoint = buttons.length > 0 ? buttons[0] : null;
  
  // Очищаем существующие группы
  const dateGroups = document.querySelectorAll('.date-title-general, .date_group');
  dateGroups.forEach(group => {
    if (!group.classList.contains('button-nav') && 
        group.id !== 'staticBackdrop' && 
        group.id !== 'customModal' &&
        !group.classList.contains('floating-action-button')) {
      group.remove();
    }
  });

  // Показываем фильтры, если есть сегодняшние поставки
  const todaySupplies = groupedSupplies[new Date().toISOString().split('T')[0]] || [];
  const filterSection = document.getElementById('todaySuppliesFilter');
  filterSection.style.display = todaySupplies.length > 0 ? 'block' : 'none';

  // Рендерим каждую группу дат
  sortedDates.forEach((date, index) => {
    const dateObj = new Date(date);
    const dateString = dateObj.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const dayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'long' });
    
    // Создаем заголовок даты
    const dateTitleDiv = document.createElement('div');
    dateTitleDiv.className = 'date-title-general';
    dateTitleDiv.innerHTML = `
      <div class="date-title" onclick="show_date_group('date_group_${index}')">
        ${dateString}, ${dayName}
        ${isToday(date) ? '<span class="badge bg-info ms-2">Сегодня</span>' : ''}
      </div>
     
    `;
    container.insertBefore(dateTitleDiv, insertPoint);

    // Создаем таблицу
    const table = document.createElement('table');
    table.className = `date_group_${index} date_group show_group table table-hover`;
    table.innerHTML = `
      <thead>
        <tr>
          <th>Поставщик</th>
          <th>Сумма</th>
          <th class="secondary-data">Бонус</th>
          <th class="secondary-data">Обмен</th>
          <th class="secondary-data">Комментарии</th>
          ${isToday(date) ? `<th class="secondary-data">Статус</th>` : ``}
        </tr>
      </thead>
      <tbody></tbody>
    `;

    // Добавляем поставки в таблицу
    const tbody = table.querySelector('tbody');
    groupedSupplies[date].forEach(supply => {
      const bonusClass = supply.bonus > 0 ? 'style="color:#218838; font-weight: bold;"' : '';
      const exchangeClass = supply.exchange > 0 ? 'style="color:#c82333; font-weight: bold;"' : '';
      const addedTime = formatDateTime(supply.date_added);
      const timeAgoStr = timeAgo(supply.date_added);
      const isTodaySupply = isToday(supply.delivery_date);
      
      const row = document.createElement('tr');
      row.id = `product${supply.id}`;
      row.setAttribute('confirmed', supply.is_confirmed);
      row.className = 'sessionSensible';
      row.innerHTML = `
        <td>
          <div class="supplier-info">
            <a href="#" class="supplier-name" style="text-decoration:none">${supply.supplier}</a>
            <span class="supplier-added-time secondary-data" title="${addedTime}">${timeAgoStr}</span>
          </div>
        </td>
        <td class="cost_cat" cost="${supply.price_cash+supply.price_bank}" confirmed="${supply.is_confirmed}">
          <span class="currency-text">${formatCurrency(supply.price_cash+supply.price_bank)}</span>
        </td>
        <td class="secondary-data" ${bonusClass}>
          ${supply.bonus > 0 ? '+' + supply.bonus : supply.bonus}
        </td>
        <td class="secondary-data" ${exchangeClass}>
          ${supply.exchange > 0 ? '-' + supply.exchange : supply.exchange}
        </td>
        <td class="secondary-data" title="${supply.comment || ''}">
          ${supply.comment ? supply.comment.substring(0, 50) + (supply.comment.length > 50 ? '...' : '') : ''}
        </td>
        
          ${isTodaySupply ? 
            `<td class="secondary-data"><span class="badge ${supply.is_confirmed ? 'bg-success' : 'bg-warning text-dark'}">
              ${supply.is_confirmed ? 'Подтверждено' : 'Ожидает'}
            </span></td>` : ''}
        
      `;
      
      // Добавляем обработчики кликов
      row.querySelectorAll('td:not(:last-child)').forEach(td => {
        td.addEventListener('click', () => redirectTo(supply.id));
      });
      
      tbody.appendChild(row);
    });

    container.insertBefore(table, insertPoint);
  });

  // Прикрепляем обработчики событий
  attachEventListeners();
  setupTodaySuppliesFilter();
}

function setupTodaySuppliesFilter() {
  const searchInput = document.getElementById('supplySearchInput');
  const confirmationFilter = document.getElementById('confirmationFilter');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  searchInput.addEventListener('input', filterTodaySupplies);
  confirmationFilter.addEventListener('change', filterTodaySupplies);
  clearFiltersBtn.addEventListener('click', clearFilters);
}
function filterTodaySupplies() {
  const searchTerm = document.getElementById('supplySearchInput').value.toLowerCase();
  const confirmationStatus = document.getElementById('confirmationFilter').value;
  
  const today = new Date().toISOString().split('T')[0];
  const todayTable = document.querySelector(`table[class*="date_group"]`);
  
  if (!todayTable) return;
  
  const rows = todayTable.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const supplier = row.querySelector('.supplier-name').textContent.toLowerCase();
    const comment = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
    const isConfirmed = row.getAttribute('confirmed') === 'true';
    
    const matchesSearch = supplier.includes(searchTerm) || comment.includes(searchTerm);
    const matchesConfirmation = 
      confirmationStatus === 'all' || 
      (confirmationStatus === 'confirmed' && isConfirmed) ||
      (confirmationStatus === 'unconfirmed' && !isConfirmed);
    
    row.style.display = matchesSearch && matchesConfirmation ? '' : 'none';
  });
}

// Сброс фильтров
function clearFilters() {
  document.getElementById('supplySearchInput').value = '';
  document.getElementById('confirmationFilter').value = 'all';
  filterTodaySupplies();
}
// Reattach event listeners after dynamic content load
function attachEventListeners() {
  // const calcButtons = document.querySelectorAll('.sum_button');
  // calcButtons.forEach(button => {
  //   button.addEventListener('click', function() {
  //     openCalcOptionsModal();
  //     date = this.getAttribute('date');
  //     const options = document.querySelectorAll('.custom-option');
  //     if (options[1]) {
  //       options[1].disabled = (this.getAttribute('today') != this.getAttribute('date_f'));
  //     }
  //   });
  // });
}

// Toggle date group visibility
function show_date_group(arg) {
  const element = document.querySelector(`.${arg}`);
  if (element) {
    element.classList.toggle('show_group');
  }
}

// Modal functions




// Redirect to edit page

// Функция для загрузки деталей поставки
async function fetchSupplyDetails(id) {
  try {
    // Загружаем основные данные поставки
    const supplyResponse = await fetch(`/api/v1/supplies/${id}/`);
    if (!supplyResponse.ok) throw new Error('Failed to fetch supply');
    
    // Загружаем изображения поставки
    const imagesResponse = await fetch(`/api/v1/supplies/${id}/images/`);
    if (!imagesResponse.ok) throw new Error('Failed to fetch supply images');
    
    const supply = await supplyResponse.json();
    supply.images = await imagesResponse.json();
    
    return supply;
  } catch (error) {
    console.error('Error fetching supply details:', error);
    throw error;
  }
}

// Функция для отображения изображений в модальном окне редактирования
function renderEditImages(images, supply_id) {
  const container = document.getElementById('editImagePreviewContainer');
  container.innerHTML = '';
  
  if (!images || images.length === 0) return;
  
  images.forEach((image) => {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'image-preview';
    previewDiv.innerHTML = `
      <img src="${image.image}" alt="Preview">
      <button type="button" class="delete-btn" data-image-id="${image.id}">&times;</button>
    `;
    container.appendChild(previewDiv);
    
    previewDiv.querySelector('.delete-btn').addEventListener('click', function() {
      deleteSupplyImage(image.id, supply_id);
      // removeImageFromList(image.id, id='editSupplyImages')
    });
  });
  return images
}
// Удаление изображения поставки
async function deleteSupplyImage(imageId, supply_id) {
  try {
    const response = await fetch(`/api/v1/supplies/${supply_id}/images/${imageId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    });
    
    if (!response.ok) throw new Error('Failed to delete image');
    showToast('Изображение успешно удалено')
    // Обновляем список изображений
    const supplyId = document.getElementById('editSupplyId').value;
    const supply = await fetchSupplyDetails(supplyId);
    
    renderEditImages(supply.images, supplyId);
    
  } catch (error) {
    console.error('Error deleting image:', error);
    showToast(`Ошибка при удалении изображения: ${error.message}`, 'danger');
  }
}



async function fetchSuppliers() {
  try {
    const response = await fetch('/api/v1/all_suppliers/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();  // Прочитали тело один раз
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
}


let allSuppliers = [];
let currentSuppliers = [];
let selectedSupplier = null;

async function initAddSupplyModal() {
  // Загружаем поставщиков
  allSuppliers = await fetchSuppliers();
  
  // Находим элементы
  const supplierInput = document.getElementById('supplierInput');
  const dropdown = document.querySelector('.supplier-dropdown');
  
  // Обработчики событий
  supplierInput.addEventListener('input', handleSupplierInput);
  supplierInput.addEventListener('focus', handleSupplierFocus);
  supplierInput.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.remove('show'), 200);
  });
  
  // Устанавливаем сегодняшнюю дату по умолчанию
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('deliveryDate').value = today;
  
  // Инициализируем тип оплаты (разблокирован, так как дата сегодняшняя)
  const paymentTypeGroup = document.querySelector('.btn-group[role="group"]');
  paymentTypeGroup.querySelectorAll('input').forEach(radio => {
    radio.disabled = false;
  });
  
  // Остальная инициализация
  checkDateForImageUpload();
  document.getElementById('deliveryDate').addEventListener('change', checkDateForImageUpload);
  document.getElementById('supplyImages').addEventListener('change', handleImageUpload);
  document.getElementById('saveSupplyBtn').addEventListener('click', saveSupply);
  
  // Инициализация масок ввода
  document.querySelectorAll('.currency-mask').forEach(each => {
    IMask(
      each,
      {
        mask: 'num',
        blocks: {
          num: {
            mask: Number,
            thousandsSeparator: '.'
          }
        }
      }
    );
  });
  
  // Форматируем начальные значения
  document.getElementById('priceCashInput').value = '';
  document.getElementById('priceBankInput').value = '';
}


function handleSupplierInput(e) {
  const input = e.target;
  const dropdown = document.querySelector('.supplier-dropdown');
  const searchTerm = input.value.trim().toLowerCase();
  
  // Фильтруем поставщиков
  currentSuppliers = allSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm)
  );
  
  // Показываем варианты
  renderSupplierOptions(currentSuppliers);
  
  // Сбрасываем выбранного поставщика если текст изменился
  if (selectedSupplier !== input.value) {
    selectedSupplier = null;
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
  
  // Показываем/скрываем dropdown
  if (searchTerm.length > 0 && currentSuppliers.length > 0) {
    dropdown.classList.add('show');
  } else {
    dropdown.classList.remove('show');
  }
}

function handleSupplierFocus() {
  const dropdown = document.querySelector('.supplier-dropdown');
  if (currentSuppliers.length > 0) {
    dropdown.classList.add('show');
  }
}

function renderSupplierOptions(suppliers) {
  const dropdown = document.querySelector('.supplier-dropdown');
  dropdown.innerHTML = '';
  
  if (suppliers.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'supplier-option';
    noResults.textContent = 'Совпадений не найдено';
    dropdown.appendChild(noResults);
    return;
  }
  
  suppliers.forEach((supplier, index) => {
    const option = document.createElement('div');
    option.className = 'supplier-option';
    option.textContent = supplier.name;
    option.dataset.value = supplier.name;
    
    option.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectSupplier(supplier.name);
    });
    
    dropdown.appendChild(option);
  });
}

function selectSupplier(supplierName) {
  const input = document.getElementById('supplierInput');
  const dropdown = document.querySelector('.supplier-dropdown');
  
  input.value = supplierName;
  selectedSupplier = supplierName;
  dropdown.classList.remove('show');
  
  // Валидация
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}
// Check if selected date is today and show image upload section
function checkDateForImageUpload() {
  const deliveryDate = document.getElementById('deliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  const imageUploadSection = document.getElementById('imageUploadSection');
  const priceBankSection = document.getElementById('priceBankInput')
  if (deliveryDate === today) {
    imageUploadSection.style.display = 'block';
    
    // priceBankSection.setAttribute('readonly', false)
  } else {
    imageUploadSection.style.display = 'none';
    // priceBankSection.setAttribute('readonly', true)
    clearImagePreviews();
  }
}

// Handle image upload and preview
function handleImageUpload(event, containerId = 'imagePreviewContainer') {
  const files = event.target.files;
  const previewContainer = document.getElementById(containerId);
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
  previewContainer.innerHTML = '';
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Файл ${file.name} не является изображением (PNG, JPG, JPEG)`);
      continue;
    }
    
    if (file.size > MAX_SIZE) {
      alert(`Файл ${file.name} слишком большой (макс. 5 МБ)`);
      continue;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewDiv = document.createElement('div');
      previewDiv.className = 'image-preview';
      previewDiv.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <button type="button" class="delete-btn" data-index="${i}">&times;</button>
      `;
      previewContainer.appendChild(previewDiv);
      
      previewDiv.querySelector('.delete-btn').addEventListener('click', function() {
        removeImageFromList(event.target.id, i);
        previewDiv.remove();
      });
    };
    reader.readAsDataURL(file);
  }
}
function removeImageFromList(index, id = 'supplyImages') {
  const input = document.getElementById(id);
  const files = Array.from(input.files);
  files.splice(index, 1);
  
  // Create new FileList (workaround as FileList is read-only)
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
  console.log(input.files)
}

// Clear all image previews
function clearImagePreviews() {
  document.getElementById('imagePreviewContainer').innerHTML = '';
  document.getElementById('supplyImages').value = '';
}

async function saveSupply() {
  const form = document.getElementById('addSupplyForm');
  const supplierInput = document.getElementById('supplierInput');
  const deliveryDate = document.getElementById('deliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  
  // Проверка поставщика
  const isValidSupplier = allSuppliers.some(
    supplier => supplier.name === supplierInput.value.trim()
  );
  
  if (!isValidSupplier) {
    supplierInput.classList.add('is-invalid');
    supplierInput.focus();
    showToast('Пожалуйста, выберите поставщика из списка', 'warning');
    return;
  }
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const formData = new FormData();
  formData.append('supplier', supplierInput.value.trim());
  
  // Для не сегодняшних дат - только наличные
  if (deliveryDate !== today) {
    formData.append('price_cash', parseCurrency(document.getElementById('priceCashInput').value));
    formData.append('price_bank', '0');
  } else {
    formData.append('price_cash', parseCurrency(document.getElementById('priceCashInput').value));
    formData.append('price_bank', parseCurrency(document.getElementById('priceBankInput').value));
  }
  
  formData.append('bonus', document.getElementById('bonusInput').value);
  formData.append('exchange', document.getElementById('exchangeInput').value);
  formData.append('delivery_date', deliveryDate);
  formData.append('comment', document.getElementById('commentInput').value);
  if (isToday(deliveryDate)) {
    formData.append('is_confirmed', document.getElementById('isConfirmedCheckbox').checked);
    const files = document.getElementById('supplyImages').files;
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  }

  // // Загрузка изображений только для сегодняшней даты
  // if (deliveryDate === today) {
    
  // }

  try {
    const response = await fetch('/api/v1/supplies/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка сохранения');
    }

    const result = await response.json();
    showToast(`Поставка для ${supplierInput.value.trim()} успешно добавлена!`, 'success');
    
    // Закрываем модальное окно и обновляем данные
    bootstrap.Modal.getInstance(document.getElementById('addSupplyModal')).hide();
    fetchSupplies();
    
    // Сбрасываем форму
    form.reset();
    document.getElementById('deliveryDate').value = today;
    clearImagePreviews();
    
  } catch (error) {
    console.error('Error saving supply:', error);
    showToast(error.message || 'Ошибка при сохранении поставки', 'danger');
  }
}

// Обновленная функция редактирования поставки
async function updateSupply() {
  const supplyId = document.getElementById('editSupplyId').value;
  const deliveryDate = document.getElementById('editDeliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  const isToday = deliveryDate === today;
  
  try {
    const formData = new FormData();
    formData.append('supplier', document.getElementById('editSupplierInput').value);
    
    // Для не сегодняшних дат - только наличные
    if (!isToday) {
      formData.append('price_cash', parseCurrency(document.getElementById('editPriceCashInput').value));
      formData.append('price_bank', '0');
    } else {
      formData.append('price_cash', parseCurrency(document.getElementById('editPriceCashInput').value));
      formData.append('price_bank', parseCurrency(document.getElementById('editPriceBankInput').value));
      formData.append('is_confirmed', document.getElementById('editIsConfirmedCheckbox').checked);
    }
    
    formData.append('bonus', document.getElementById('editBonusInput').value);
    formData.append('exchange', document.getElementById('editExchangeInput').value);
    formData.append('delivery_date', deliveryDate);
    formData.append('comment', document.getElementById('editCommentInput').value);

    // Загрузка новых изображений только для сегодняшней даты
    if (isToday) {
      const files = document.getElementById('editSupplyImages').files;
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }

    const response = await fetch(`/api/v1/supplies/${supplyId}/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка обновления');
    }

    showToast('Поставка успешно обновлена!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('editSupplyModal')).hide();
    fetchSupplies();
    
  } catch (error) {
    console.error('Error updating supply:', error);
    showToast(error.message || 'Ошибка при обновлении поставки', 'danger');
  }
}

// Обновленная функция redirectTo (заполнение формы редактирования)
function redirectTo(id) {
  fetchSupplyDetails(id).then(supply => {
    document.getElementById('editSupplyId').value = supply.id;
    document.getElementById('editSupplierInput').value = supply.supplier;
    
    const today = new Date().toISOString().split('T')[0];
    const isToday = supply.delivery_date === today;
    const paymentTypeGroup = document.querySelector('input[name="editPaymentType"]').closest('.btn-group');
     const isTodaySupply = isToday;
    const editConfirmationContainer = document.getElementById('editConfirmationCheckboxContainer');
    
    editConfirmationContainer.style.display = isTodaySupply ? 'block' : 'none';
    if (isTodaySupply) {
      document.getElementById('editIsConfirmedCheckbox').checked = supply.is_confirmed;
    }
    // Устанавливаем тип оплаты
    if (isToday) {
      if (supply.price_cash > 0 && supply.price_bank > 0) {
        document.getElementById('editMixedPayment').checked = true;
        document.getElementById('editCashAmountGroup').style.display = 'block';
        document.getElementById('editBankAmountGroup').style.display = 'block';
      } else if (supply.price_bank > 0) {
        document.getElementById('editBankPayment').checked = true;
        document.getElementById('editCashAmountGroup').style.display = 'none';
        document.getElementById('editBankAmountGroup').style.display = 'block';
      } else {
        document.getElementById('editCashPayment').checked = true;
        document.getElementById('editCashAmountGroup').style.display = 'block';
        document.getElementById('editBankAmountGroup').style.display = 'none';
      }
      
      // Разблокируем выбор типа оплаты
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        radio.disabled = false;
      });
    } else {
      // Блокируем выбор типа оплаты и устанавливаем наличные
      document.getElementById('editCashPayment').checked = true;
      document.getElementById('editCashAmountGroup').style.display = 'block';
      document.getElementById('editBankAmountGroup').style.display = 'none';
      
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        if (radio.id !== 'editCashPayment') {
          radio.disabled = true;
        }
      });
    }
    
    document.getElementById('editPriceCashInput').value = formatCurrency(supply.price_cash);
    document.getElementById('editPriceBankInput').value = formatCurrency(supply.price_bank);
    document.getElementById('editBonusInput').value = supply.bonus;
    document.getElementById('editExchangeInput').value = supply.exchange;
    document.getElementById('editDeliveryDate').value = supply.delivery_date;
    document.getElementById('editCommentInput').value = supply.comment || '';
    
    // Показываем/скрываем загрузку изображений
    document.getElementById('editImageUploadSection').style.display = 
      isToday ? 'block' : 'none';
    
    // Загружаем изображения
    renderEditImages(supply.images || [], supply.id);
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('editSupplyModal'));
    modal.show();
    
  }).catch(error => {
    console.error('Error fetching supply details:', error);
    showToast('Ошибка при загрузке данных поставки', 'danger');
  });
}



// Helper function to get CSRF token
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initAddSupplyModal();
  
  document.getElementById('updateSupplyBtn').addEventListener('click', updateSupply);
  document.getElementById('deleteSupplyBtn').addEventListener('click', deleteSupply);
  
  // Обработчик загрузки изображений в модальном окне редактирования
  document.getElementById('editSupplyImages').addEventListener('change', function(e) {
    handleImageUpload(e, 'editImagePreviewContainer');
  });
  
  // Проверка даты при изменении в модальном окне редактирования
  document.getElementById('editDeliveryDate').addEventListener('change', function() {
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = this.value;
    const paymentTypeGroup = document.querySelector('input[name="editPaymentType"]').closest('.btn-group');
    
    if (selectedDate === today) {
      // Разблокируем выбор типа оплаты
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        radio.disabled = false;
      });
      document.getElementById('editImageUploadSection').style.display = 'block';
    } else {
      // Блокируем выбор типа оплаты и устанавливаем наличные
      document.getElementById('editCashPayment').checked = true;
      document.getElementById('editCashAmountGroup').style.display = 'block';
      document.getElementById('editBankAmountGroup').style.display = 'none';
      document.getElementById('editPriceBankInput').value = '0';
      
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        if (radio.id !== 'editCashPayment') {
          radio.disabled = true;
        }
      });
      document.getElementById('editImageUploadSection').style.display = 'none';
    }
  });
});


document.getElementById('deliveryDate').addEventListener('change', function() {
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = this.value;
  // const paymentTypeGroup = document.querySelector('.btn-group[name="paymentType"]');
   const paymentTypeGroup = document.querySelector('.btn-group[role="group"]');
  console.log(paymentTypeGroup)
  if (selectedDate === today) {
    // Разблокируем выбор типа оплаты
    paymentTypeGroup.querySelectorAll('input').forEach(radio => {
      radio.disabled = false;
    });
  } else {
    // Блокируем выбор типа оплаты и устанавливаем наличные
    document.getElementById('cashPayment').checked = true;
    document.getElementById('cashAmountGroup').style.display = 'block';
    document.getElementById('bankAmountGroup').style.display = 'none';
    // document.getElementById('priceBankInput').value = '0';
    
    paymentTypeGroup.querySelectorAll('input').forEach(radio => {
      if (radio.id !== 'cashPayment') {
        radio.disabled = true;
      }
    });
  }
  const isToday = isToday(this.value);
    const confirmationContainer = document.getElementById('confirmationCheckboxContainer');
    
    // Показываем чекбокс подтверждения только для сегодняшней даты
    confirmationContainer.style.display = isToday ? 'block' : 'none';
    if (!isToday) {
      document.getElementById('isConfirmedCheckbox').checked = false;
    }
  // Проверяем нужно ли показывать загрузку изображений
  checkDateForImageUpload();
});