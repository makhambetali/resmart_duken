const cashFlowForm = document.querySelector('#cashFlowModal form');
const amountInput = document.getElementById('amount');
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
      
      
      document.getElementById('priceBankInput').value = ''
      document.getElementById('priceCashInput').value = ''
    }
  });
});


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
      
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('cashFlowModal'));
      modal.hide();
      
      
      cashFlowForm.reset();
      
      
      
      
      
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


function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '0 ₸';
  const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
  if (isNaN(num)) return '0 ₸';
  
  
  return num.toString()
    .replace(/\D/g, '') 
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.') 
    .replace(/^0+/, ''); 
}


function parseCurrency(value) {
  if (!value) return 0;
  
  
  const numStr = value.replace(/[^\d]/g, '');
  
  
  const num = parseFloat(numStr);
  
  return isNaN(num) ? 0 : num;
}

function setupCurrencyInput(inputId) {
  const input = document.getElementById(inputId);
  
  
  const formatValue = (value) => {
    
    const numStr = value.replace(/\D/g, '');
    
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  
  input.addEventListener('input', function(e) {
    
    const cursorPosition = this.selectionStart;
    const originalLength = this.value.length;
    
    
    const rawValue = this.value.replace(/\./g, '');
    
    
    this.value = formatValue(rawValue);
    
    
    const newLength = this.value.length;
    const lengthDiff = newLength - originalLength;
    const newCursorPosition = cursorPosition + lengthDiff;
    
    
    this.setSelectionRange(newCursorPosition, newCursorPosition);
  });
  
  
  input.addEventListener('focus', function() {
    this.value = this.value.replace(/\./g, '');
  });
  
  
  input.addEventListener('blur', function() {
    const numValue = this.value.replace(/\./g, '');
    if (numValue === '') {
      this.value = '0 ₸';
    } else {
      this.value = formatValue(numValue) + ' ₸';
    }
  });
  
  
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      this.blur(); 
    }
  });
  
  
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


function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const dateStr = date.toLocaleDateString('ru-RU');
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} ${timeStr}`;
}


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


function renderSupplies(supplies) {
  
  const groupedSupplies = {};
  supplies.forEach(supply => {
    const date = supply.delivery_date;
    if (!groupedSupplies[date]) {
      groupedSupplies[date] = [];
    }
    groupedSupplies[date].push(supply);
  });

  
  const sortedDates = Object.keys(groupedSupplies).sort((a, b) => new Date(a) - new Date(b));
  
  
  const container = document.querySelector('.container-custom');
  
  
  const buttons = document.querySelectorAll('.button-nav');
  const insertPoint = buttons.length > 0 ? buttons[0] : null;
  
  
  const dateGroups = document.querySelectorAll('.date-title-general, .date_group');
  dateGroups.forEach(group => {
    if (!group.classList.contains('button-nav') && 
        group.id !== 'staticBackdrop' && 
        group.id !== 'customModal' &&
        !group.classList.contains('floating-action-button')) {
      group.remove();
    }
  });

  
  const todaySupplies = groupedSupplies[new Date().toISOString().split('T')[0]] || [];
  const filterSection = document.getElementById('todaySuppliesFilter');
  filterSection.style.display = todaySupplies.length > 0 ? 'block' : 'none';

  
  sortedDates.forEach((date, index) => {
    const dateObj = new Date(date);
    const dateString = dateObj.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const dayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'long' });
    
    
    const dateTitleDiv = document.createElement('div');
    dateTitleDiv.className = 'date-title-general';
    dateTitleDiv.innerHTML = `
      <div class="date-title" onclick="show_date_group('date_group_${index}')">
        ${dateString}, ${dayName}
        ${isToday(date) ? '<span class="badge bg-info ms-2">Сегодня</span>' : ''}
      </div>
     
    `;
    container.insertBefore(dateTitleDiv, insertPoint);

    
    const table = document.createElement('table');
    table.className = `date_group_${index} date_group show_group table table-hover`;
    table.innerHTML = `
      <thead>
        <tr>
          <th>Поставщик</th>
          <th>Сумма</th>
          <th class="secondary-data hide-on-mobile">Бонус</th>
          <th class="secondary-data hide-on-mobile">Обмен</th>
          <th class="secondary-data hide-on-mobile">Комментарии</th>
          ${isToday(date) ? `<th class="secondary-data">Статус</th>` : ``}
        </tr>
      </thead>
      <tbody></tbody>
    `;

    
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
        <td class="secondary-data hide-on-mobile" ${bonusClass}>
          ${supply.bonus > 0 ? '+' + supply.bonus : supply.bonus}
        </td>
        <td class="secondary-data hide-on-mobile" ${exchangeClass}>
          ${supply.exchange > 0 ? '-' + supply.exchange : supply.exchange}
        </td>
        <td class="secondary-data hide-on-mobile" title="${supply.comment || ''}">
          ${supply.comment ? supply.comment.substring(0, 50) + (supply.comment.length > 50 ? '...' : '') : ''}
        </td>
        
          ${isTodaySupply ? 
            `<td class="secondary-data"><span class="badge ${supply.is_confirmed ? 'bg-success' : 'bg-warning text-dark'}">
              ${supply.is_confirmed ? `Подтверждено в ${supply.arrival_date.split('T')[1].split('.')[0]}` : 'Ожидает'}
            </span></td>` : ''}
        
      `;
      
      
      row.querySelectorAll('td:not(:last-child)').forEach(td => {
        td.addEventListener('click', () => redirectTo(supply.id));
      });
      
      tbody.appendChild(row);
    });

    container.insertBefore(table, insertPoint);
  });

  
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


function clearFilters() {
  document.getElementById('supplySearchInput').value = '';
  document.getElementById('confirmationFilter').value = 'all';
  filterTodaySupplies();
}

function attachEventListeners() {
  
  
  
  
  
  
  
  
  
  
  
}


function show_date_group(arg) {
  const element = document.querySelector(`.${arg}`);
  if (element) {
    element.classList.toggle('show_group');
  }
}









async function fetchSupplyDetails(id) {
  try {
    
    const supplyResponse = await fetch(`/api/v1/supplies/${id}/`);
    if (!supplyResponse.ok) throw new Error('Failed to fetch supply');
    
    
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
      
    });
  });
  return images
}

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
    const data = await response.json();  
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
  
  allSuppliers = await fetchSuppliers();
  
  
  const supplierInput = document.getElementById('supplierInput');
  const dropdown = document.querySelector('.supplier-dropdown');
  
  
  supplierInput.addEventListener('input', handleSupplierInput);
  supplierInput.addEventListener('focus', handleSupplierFocus);
  supplierInput.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.remove('show'), 200);
  });
  
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('deliveryDate').value = today;
  
  
  const paymentTypeGroup = document.querySelector('.btn-group[role="group"]');
  paymentTypeGroup.querySelectorAll('input').forEach(radio => {
    radio.disabled = false;
  });
  
  
  checkDateForImageUpload();
  document.getElementById('deliveryDate').addEventListener('change', checkDateForImageUpload);
  document.getElementById('supplyImages').addEventListener('change', handleImageUpload);
  document.getElementById('saveSupplyBtn').addEventListener('click', saveSupply);
  
  
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
  
  
  document.getElementById('priceCashInput').value = '';
  document.getElementById('priceBankInput').value = '';
}


function handleSupplierInput(e) {
  const input = e.target;
  const dropdown = document.querySelector('.supplier-dropdown');
  const searchTerm = input.value.trim().toLowerCase();
  
  
  currentSuppliers = allSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm)
  );
  
  
  renderSupplierOptions(currentSuppliers);
  
  
  if (selectedSupplier !== input.value) {
    selectedSupplier = null;
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
  
  
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
  
  
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

function checkDateForImageUpload() {
  const deliveryDate = document.getElementById('deliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  const imageUploadSection = document.getElementById('imageUploadSection');
  const priceBankSection = document.getElementById('priceBankInput')
  if (deliveryDate === today) {
    imageUploadSection.style.display = 'block';
    
    
  } else {
    imageUploadSection.style.display = 'none';
    
    clearImagePreviews();
  }
}


function handleImageUpload(event, containerId = 'imagePreviewContainer') {
  const files = event.target.files;
  const previewContainer = document.getElementById(containerId);
  const MAX_SIZE = 5 * 1024 * 1024; 
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
  
  
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
  console.log(input.files)
}


function clearImagePreviews() {
  document.getElementById('imagePreviewContainer').innerHTML = '';
  document.getElementById('supplyImages').value = '';
}

async function saveSupply() {
  const form = document.getElementById('addSupplyForm');
  const supplierInput = document.getElementById('supplierInput');
  const deliveryDate = document.getElementById('deliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  
  
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
    
    
    bootstrap.Modal.getInstance(document.getElementById('addSupplyModal')).hide();
    fetchSupplies();
    
    
    form.reset();
    document.getElementById('deliveryDate').value = today;
    clearImagePreviews();
    
  } catch (error) {
    console.error('Error saving supply:', error);
    showToast(error.message || 'Ошибка при сохранении поставки', 'danger');
  }
}


async function updateSupply() {
  const supplyId = document.getElementById('editSupplyId').value;
  const deliveryDate = document.getElementById('editDeliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  const isToday = deliveryDate === today;
  
  try {
    const formData = new FormData();
    formData.append('supplier', document.getElementById('editSupplierInput').value);
    
    
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
      
      
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        radio.disabled = false;
      });
    } else {
      
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
    
    
    document.getElementById('editImageUploadSection').style.display = 
      isToday ? 'block' : 'none';
    
    
    renderEditImages(supply.images || [], supply.id);
    
    
    const modal = new bootstrap.Modal(document.getElementById('editSupplyModal'));
    modal.show();
    
  }).catch(error => {
    console.error('Error fetching supply details:', error);
    showToast('Ошибка при загрузке данных поставки', 'danger');
  });
}




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


document.addEventListener('DOMContentLoaded', function() {
  initAddSupplyModal();
  
  document.getElementById('updateSupplyBtn').addEventListener('click', updateSupply);
  document.getElementById('deleteSupplyBtn').addEventListener('click', deleteSupply);
  
  
  document.getElementById('editSupplyImages').addEventListener('change', function(e) {
    handleImageUpload(e, 'editImagePreviewContainer');
  });
  
  
  document.getElementById('editDeliveryDate').addEventListener('change', function() {
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = this.value;
    const paymentTypeGroup = document.querySelector('input[name="editPaymentType"]').closest('.btn-group');
    
    if (selectedDate === today) {
      
      paymentTypeGroup.querySelectorAll('input').forEach(radio => {
        radio.disabled = false;
      });
      document.getElementById('editImageUploadSection').style.display = 'block';
    } else {
      
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
  
   const paymentTypeGroup = document.querySelector('.btn-group[role="group"]');
  console.log(paymentTypeGroup)
  if (selectedDate === today) {
    
    paymentTypeGroup.querySelectorAll('input').forEach(radio => {
      radio.disabled = false;
    });
  } else {
    
    document.getElementById('cashPayment').checked = true;
    document.getElementById('cashAmountGroup').style.display = 'block';
    document.getElementById('bankAmountGroup').style.display = 'none';
    
    
    paymentTypeGroup.querySelectorAll('input').forEach(radio => {
      if (radio.id !== 'cashPayment') {
        radio.disabled = true;
      }
    });
  }
  const isToday = isToday(this.value);
    const confirmationContainer = document.getElementById('confirmationCheckboxContainer');
    
    
    confirmationContainer.style.display = isToday ? 'block' : 'none';
    if (!isToday) {
      document.getElementById('isConfirmedCheckbox').checked = false;
    }
  
  checkDateForImageUpload();
});