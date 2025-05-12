
// Loader simulation
function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '0 ₸';
  const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
  if (isNaN(num)) return '0 ₸';
  
  // Форматируем с точками как разделителями тысяч
  return num.toString()
    .replace(/\D/g, '') // Оставляем только цифры
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Добавляем точки как разделители
    .replace(/^0+/, '') + ' ₸'; // Убираем ведущие нули и добавляем символ валюты
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
    alert('Ошибка при загрузке данных');
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
  // Group supplies by delivery date
  const groupedSupplies = {};
  supplies.forEach(supply => {
    const date = supply.delivery_date;
    if (!groupedSupplies[date]) {
      groupedSupplies[date] = [];
    }
    groupedSupplies[date].push(supply);
  });

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedSupplies).sort((a, b) => new Date(a) - new Date(b));
  
  // Get container element
  const container = document.querySelector('.container-custom');
  
  // Find the insert point before navigation buttons
  const buttons = document.querySelectorAll('.button-nav');
  const insertPoint = buttons.length > 0 ? buttons[0] : null;
  
  // Clear existing date groups
  const dateGroups = document.querySelectorAll('.date-title-general, .date_group');
  dateGroups.forEach(group => {
    if (!group.classList.contains('button-nav') && 
        group.id !== 'staticBackdrop' && 
        group.id !== 'customModal' &&
        !group.classList.contains('floating-action-button')) {
      group.remove();
    }
  });

  // Render each date group
  sortedDates.forEach((date, index) => {
    const dateObj = new Date(date);
    const dateString = dateObj.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const dayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'long' });
    
    // Create date title
    const dateTitleDiv = document.createElement('div');
    dateTitleDiv.className = 'date-title-general';
    dateTitleDiv.innerHTML = `
      <div class="date-title" onclick="show_date_group('date_group_${index}')">
        ${dateString}, ${dayName}
      </div>
      <button class="sum_button bi bi-calculator" 
              date="${date}" date_f="${dateString}" today="${new Date().toISOString().split('T')[0]}" 
              date_group="date_group_${index}" title="Посчитать сумму">
      </button>
    `;
    container.insertBefore(dateTitleDiv, insertPoint);

    // Create table
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
        </tr>
      </thead>
      <tbody></tbody>
    `;

    // Add supplies to table
    const tbody = table.querySelector('tbody');
    groupedSupplies[date].forEach(supply => {
      const bonusClass = supply.bonus > 0 ? 'style="color:#218838; font-weight: bold;"' : '';
      const exchangeClass = supply.exchange > 0 ? 'style="color:#c82333; font-weight: bold;"' : '';
      const addedTime = formatDateTime(supply.date_added);
      const timeAgoStr = timeAgo(supply.date_added);
      
      const row = document.createElement('tr');
      row.id = `product${supply.id}`;
      row.setAttribute('confirmed', 'true');
      row.className = 'sessionSensible';
      row.innerHTML = `
        <td>
          <div class="supplier-info">
            <a href="#" class="supplier-name" style="text-decoration:none">${supply.supplier}</a>
            <span class="supplier-added-time secondary-data" title="${addedTime}">${timeAgoStr}</span>
          </div>
        </td>
        <td class="cost_cat" cost="${supply.price}" confirmed="true">
          <span class="currency-text">${formatCurrency(supply.price)}</span>
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
      `;
      
      // Add click handlers
      row.querySelectorAll('td:not(:first-child)').forEach(td => {
        td.addEventListener('click', () => redirectTo(supply.id));
      });
      
      tbody.appendChild(row);
    });

    container.insertBefore(table, insertPoint);
  });

  // Re-attach event listeners to new elements
  attachEventListeners();
}

// Reattach event listeners after dynamic content load
function attachEventListeners() {
  const calcButtons = document.querySelectorAll('.sum_button');
  calcButtons.forEach(button => {
    button.addEventListener('click', function() {
      openCalcOptionsModal();
      date = this.getAttribute('date');
      const options = document.querySelectorAll('.custom-option');
      if (options[1]) {
        options[1].disabled = (this.getAttribute('today') != this.getAttribute('date_f'));
      }
    });
  });
}

// Toggle date group visibility
function show_date_group(arg) {
  const element = document.querySelector(`.${arg}`);
  if (element) {
    element.classList.toggle('show_group');
  }
}

// Modal functions
const calcOptionsModal = document.getElementById('customModal');

function openCalcOptionsModal() {
  if (calcOptionsModal) {
    calcOptionsModal.style.display = 'flex';
  }
}

function closeCalcOptionsModal() {
  if (calcOptionsModal) {
    calcOptionsModal.style.display = 'none';
  }
}

// Close modal when clicking outside
window.addEventListener("click", function(event) {
  if (event.target === calcOptionsModal) {
    closeCalcOptionsModal();
  }
});

// Redirect to edit page
function redirectTo(id) {
  console.log(`Redirecting to edit page for product ${id}`);
  window.location.href = `/supply/edit/${id}`;
}
// Fetch suppliers for dropdown
async function fetchSuppliers() {
  try {
    const response = await fetch('/api/v1/suppliers/');
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
  
  // Остальная инициализация (дата, изображения и т.д.)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('deliveryDate').value = today;
  checkDateForImageUpload();
  document.getElementById('deliveryDate').addEventListener('change', checkDateForImageUpload);
  document.getElementById('supplyImages').addEventListener('change', handleImageUpload);
  document.getElementById('saveSupplyBtn').addEventListener('click', saveSupply);
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
  
  if (deliveryDate === today) {
    imageUploadSection.style.display = 'block';
  } else {
    imageUploadSection.style.display = 'none';
    clearImagePreviews();
  }
}

// Handle image upload and preview
function handleImageUpload(event) {
  // alert()
  const files = event.target.files;
  const previewContainer = document.getElementById('imagePreviewContainer');
  console.log(files[0])
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
  // clearImagePreviews();
  previewContainer.innerHTML = '';  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(file)
    // Validate file type and size
    if (!allowedTypes.includes(file.type)) {
      alert(`Файл ${file.name} не является изображением (PNG, JPG, JPEG)`);
      continue;
    }
    
    if (file.size > MAX_SIZE) {
      alert(`Файл ${file.name} слишком большой (макс. 5 МБ)`);
      continue;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log(1)
      const previewDiv = document.createElement('div');
      previewDiv.className = 'image-preview';
      previewDiv.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <button type="button" class="delete-btn" data-index="${i}">&times;</button>
      `;
      previewContainer.appendChild(previewDiv);
      
      // Add delete button handler
      previewDiv.querySelector('.delete-btn').addEventListener('click', function() {
        removeImageFromList(i);
        previewDiv.remove();
      });
    };
    reader.readAsDataURL(file);
  }
}

// Remove image from file list
function removeImageFromList(index) {
  const input = document.getElementById('supplyImages');
  const files = Array.from(input.files);
  files.splice(index, 1);
  
  // Create new FileList (workaround as FileList is read-only)
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
}

// Clear all image previews
function clearImagePreviews() {
  document.getElementById('imagePreviewContainer').innerHTML = '';
  document.getElementById('supplyImages').value = '';
}

// Update saveSupply function to handle images
async function saveSupply() {
  const form = document.getElementById('addSupplyForm');
  const supplierInput = document.getElementById('supplierInput');
  
  // Проверяем, что выбран существующий поставщик
  const isValidSupplier = allSuppliers.some(
    supplier => supplier.name === supplierInput.value.trim()
  );
  
  if (!isValidSupplier) {
    supplierInput.classList.add('is-invalid');
    supplierInput.focus();
    return;
  }
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const formData = new FormData();
  formData.append('supplier', supplierInput.value.trim());
  formData.append('price', parseCurrency(document.getElementById('priceInput').value));
  formData.append('bonus', document.getElementById('bonusInput').value);
  formData.append('exchange', document.getElementById('exchangeInput').value);
  formData.append('delivery_date', document.getElementById('deliveryDate').value);
  formData.append('comment', document.getElementById('commentInput').value);
  
  // Add images if today's date
  const deliveryDate = document.getElementById('deliveryDate').value;
  const today = new Date().toISOString().split('T')[0];
  
  if (deliveryDate === today) {
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
      const errorText = await response.text();
      console.error('Ошибка от сервера:', errorText);
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Supply created:', result);
    
    // Close modal and refresh data
    bootstrap.Modal.getInstance(document.getElementById('addSupplyModal')).hide();
    fetchSupplies();
    
    // Reset form
    form.reset();
    currentSuppliers = []
    form.classList.remove('was-validated');
    document.getElementById('deliveryDate').value = new Date().toISOString().split('T')[0];
    clearImagePreviews();
    
  } catch (error) {
    console.error('Error saving supply:', error);
    alert('Ошибка при сохранении поставки');
  }
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
  
  IMask(
        document.querySelector('.currency-mask'),
        {
            mask: '₸ num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: '.'
                }
            }
        }
    );
  
  // Форматируем начальные значения
  document.getElementById('priceInput').value = '';
});