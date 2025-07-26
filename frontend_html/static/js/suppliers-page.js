document.addEventListener("DOMContentLoaded", () => {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const tableBody = document.querySelector("#suppliers-table tbody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resetSearchBtn = document.getElementById("resetSearchBtn");
  const addBtn = document.getElementById("addSupplierBtn");
  const noDataAlert = document.getElementById("noDataAlert");
  const addNewSupplierLink = document.getElementById("addNewSupplierLink");
  const perPageSelect = document.getElementById("perPageSelect");
  const paginationElement = document.getElementById("pagination");

  
  const supplierModal = new bootstrap.Modal(document.getElementById("supplierModal"));
  const supplierForm = document.getElementById("supplierForm");
  const modalTitle = document.getElementById("modalTitle");
  const supplierIdInput = document.getElementById("supplierId");
  const nameInput = document.getElementById("supplierName");
  const descInput = document.getElementById("supplierDescription");
  const supplierSupervisor = document.getElementById("supplierSupervisor")
  const supplierSupervisorPn = document.getElementById("supplierSupervisorPn")
  const supplierRepresentative = document.getElementById("supplierRepresentative")
  const supplierRepresentativePn = document.getElementById("supplierRepresentativePn")
  const supplierDelivery = document.getElementById("supplierDelivery")
  const supplierDeliveryPn = document.getElementById("supplierDeliveryPn")
  const deleteBtn = document.getElementById("deleteBtn");

  
  let searchQuery = '';
  let currentPage = 1;
  let perPage = 25;
  let totalItems = 0;
  let lastRequestKey = '';
  const requestCache = new Map();
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
  
  function init() {
    perPage = parseInt(perPageSelect.value);
    loadSuppliers();
    
    
    setupEventListeners();
  }

  function setupEventListeners() {
    
    const debouncedSearch = debounce(() => {
      const newQuery = searchInput.value.trim();
      if (newQuery !== searchQuery) {
        searchQuery = newQuery;
        currentPage = 1; 
        loadSuppliers();
      }
    }, 300);
    
    searchBtn.addEventListener("click", debouncedSearch);
    searchInput.addEventListener("input", debouncedSearch);

    resetSearchBtn.addEventListener("click", () => {
      if (searchQuery !== '') {
        searchInput.value = '';
        searchQuery = '';
        currentPage = 1;
        loadSuppliers();
      }
    });

    
    perPageSelect.addEventListener("change", () => {
      perPage = parseInt(perPageSelect.value);
      currentPage = 1;
      loadSuppliers();
    });
     
    addBtn.addEventListener("click", () => {
      modalTitle.textContent = "Добавить поставщика";
      nameInput.classList.remove('is-invalid');
      nameInput.nextElementSibling.textContent = '';
      supplierIdInput.value = "";
      
      nameInput.value = "";
      descInput.value = "";
      supplierSupervisor.value = "";
      supplierSupervisorPn.value = "";
      supplierRepresentative.value = "";
      supplierRepresentativePn.value = "";
      supplierDelivery.value = "";
      supplierDeliveryPn.value = "";
      deleteBtn.classList.add("d-none");
      
      supplierModal.show();
    });

    addNewSupplierLink.addEventListener("click", (e) => {
      e.preventDefault();
      addBtn.click();
    });

    
    supplierForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveSupplier();
    });

    
    deleteBtn.addEventListener("click", deleteSupplier);

    
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim()) {
        nameInput.classList.remove("is-invalid");
      }
    });
  }

  
  async function loadSuppliers() {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    params.append('page', currentPage);
    params.append('page_size', perPage);
    
    const url = `/api/v1/suppliers/?${params.toString()}`;
    const cacheKey = `${searchQuery}-${currentPage}-${perPage}`;

    
    if (requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      processResponse(cachedData);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();
      
      
      requestCache.set(cacheKey, data);
      processResponse(data);
    } catch (error) {
      console.error('Error:', error);
      showToast('Произошла ошибка при загрузке данных', "danger");
    }
  }

  function processResponse(data) {
    console.log('Обработка данных:', data);
    
    if (data.results && Array.isArray(data.results)) {
      totalItems = data.count || data.results.length;
      document.querySelector('.res_count').textContent = totalItems;
      renderSuppliers(data.results);
      renderPagination(data);
      toggleNoDataAlert(data.results.length === 0);
    } else {
      console.error('Неверный формат данных:', data);
      toggleNoDataAlert(true);
    }
  }

  
  function renderSuppliers(suppliers) {
    tableBody.innerHTML = '';
    
    if (!suppliers || suppliers.length === 0) {
      noDataAlert.classList.remove("d-none");
      return;
    }

    noDataAlert.classList.add("d-none");
    suppliers.forEach(supplier => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(supplier.name)}</td>
        <td>${supplier.description ? escapeHtml(supplier.description) : "-"}</td>
        <td>${formatDate(supplier.date_added)}</td>
        <td>${formatDate(supplier.last_accessed)}</td>
      `;
      row.addEventListener("click", () => openModal(supplier));
      row.style.cursor = "pointer";
      tableBody.appendChild(row);
    });
  }

  
  function renderPagination(data) {
    paginationElement.innerHTML = '';
    
    if (!data || !data.count || data.count <= perPage) return;

    const totalPages = Math.ceil(data.count / perPage);
    const maxVisiblePages = 5;
    addPaginationButton(pagination, '«', currentPage - 1, currentPage === 1);

    
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      addPaginationButton(pagination, i.toString(), i, false, i === currentPage);
    }

    
    addPaginationButton(pagination, '»', currentPage + 1, currentPage === totalPages);
  }

  function addPaginationButton(container, text, page, disabled = false, active = false) {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;

    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = text;

    if (!disabled) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (page !== currentPage) {
          currentPage = page;
          
          loadSuppliers(  )
          
        }
      });
    }

    li.appendChild(a);
    container.appendChild(li);
  }



  
  function openModal(supplier) {
    modalTitle.textContent = "Редактировать поставщика";

    nameInput.classList.remove('is-invalid');
      nameInput.nextElementSibling.textContent = '';
    supplierIdInput.value = supplier.id;
     supplierSupervisor.value = supplier.supervisor;
      supplierSupervisorPn.value = supplier.supervisor_pn;
      supplierRepresentative.value = supplier.representative;
      supplierRepresentativePn.value = supplier.representative_pn;
      supplierDelivery.value = supplier.delivery;
      supplierDeliveryPn.value = supplier.delivery_pn;
    // nameInput.value = randomInt(1000, 10000);
    nameInput.value = supplier.name
    
    descInput.value = supplier.description || "";
    deleteBtn.classList.remove("d-none");
    supplierModal.show();
  }

  
  function saveSupplier() {
    const id = supplierIdInput.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/v1/suppliers/${id}/` : "/api/v1/suppliers/";
    
    if (!nameInput.value.trim()) {
      nameInput.classList.add("is-invalid");
      return;
    }
    console.log(supplierRepresentativePn.value.trim())
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        description: descInput.value.trim(),
        supervisor: supplierSupervisor.value.trim(),
        supervisor_pn: supplierSupervisorPn.value.trim(),
        representative: supplierRepresentative.value.trim(),
        representative_pn: supplierRepresentativePn.value.trim(),
        delivery: supplierDelivery.value.trim(),
        delivery_pn: supplierDeliveryPn.value.trim()
      })
    })
    
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { 
          if (err.name && err.name[0].includes('уже существует')) {
            nameInput.classList.add("is-invalid");
            nameInput.nextElementSibling.textContent = err.name[0];
          }
          throw err; 
        });
      }
      return response.json();
    })
    .then(() => {
      supplierModal.hide();
      
      requestCache.clear();
      showToast(id ? 'Поставщик успешно изменен' : "Поставщик успешно добавлен")
      loadSuppliers();
    })
    .catch(error => {
      console.error("Error:", error);
      if (error.name) {
        showToast( "Произошла ошибка при сохранении", "danger");
      }
    });
  }

  
  function deleteSupplier() {
    const id = supplierIdInput.value;
    if (!id || !confirm("Вы уверены, что хотите удалить этого поставщика?")) return;
    
    fetch(`/api/v1/suppliers/${id}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCSRFToken()
      }
    })
    .then(response => {
      if (!response.ok) throw new Error("Ошибка при удалении");
      supplierModal.hide();
      
      requestCache.clear();
      showToast("Поставщик успешно удален")
      loadSuppliers();
    })
    .catch(error => {
      console.error("Error:", error);
      showToast("Произошла ошибка при удалении", "danger");
    });
  }

  
  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function toggleNoDataAlert(show) {
    if (show) {
      noDataAlert.classList.remove("d-none");
      tableBody.innerHTML = '';
      paginationElement.innerHTML = '';
    } else {
      noDataAlert.classList.add("d-none");
    }
  }

  function getCSRFToken() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  document.querySelectorAll('.phone-mask').forEach(each => {
    IMask(
    each,
    {
      mask: '+{7}(000)000-00-00'
    }
  )
  })
  init();
});