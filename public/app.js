const API_URL = '/api/inventory';

const addItemForm = document.getElementById('addItemForm');
const filterForm = document.getElementById('filterForm');
const clearFiltersBtn = document.getElementById('clearFilters');
const refreshBtn = document.getElementById('refreshBtn');
const itemGrid = document.getElementById('itemGrid');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');

const showToast = (message, isError = false) => {
  toast.textContent = message;
  toast.classList.add('show');
  toast.classList.toggle('error', isError);

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || 'Something went wrong.');
  }

  return body;
};

const buildQuery = () => {
  const formData = new FormData(filterForm);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (String(value).trim() !== '') {
      params.append(key, String(value).trim());
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    itemGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  itemGrid.innerHTML = items
    .map(
      (item) => `
      <article class="item-card" data-id="${item.id}">
        <p class="item-name">${escapeHtml(item.name)}</p>
        <p class="meta">Category: ${escapeHtml(item.category)}</p>
        <span class="quantity-pill">Quantity: ${item.quantity}</span>

        <div class="card-actions">
          <div class="card-row">
            <input class="qty-input" type="number" min="0" value="${item.quantity}" />
            <button class="btn-primary update-btn" type="button">Update</button>
          </div>
          <button class="delete-btn" type="button">Delete</button>
        </div>
      </article>
    `
    )
    .join('');
};

const loadItems = async () => {
  try {
    const result = await request(`${API_URL}${buildQuery()}`);
    renderItems(result.data || []);
  } catch (error) {
    showToast(error.message, true);
  }
};

addItemForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: addItemForm.name.value.trim(),
    category: addItemForm.category.value.trim(),
    quantity: Number(addItemForm.quantity.value),
  };

  try {
    await request(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    addItemForm.reset();
    showToast('Item added successfully.');
    await loadItems();
  } catch (error) {
    showToast(error.message, true);
  }
});

filterForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadItems();
});

clearFiltersBtn.addEventListener('click', async () => {
  filterForm.reset();
  await loadItems();
});

refreshBtn.addEventListener('click', loadItems);

itemGrid.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }

  const card = button.closest('.item-card');
  const itemId = card ? Number(card.dataset.id) : NaN;

  if (!Number.isInteger(itemId)) {
    showToast('Invalid item selected.', true);
    return;
  }

  if (button.classList.contains('delete-btn')) {
    try {
      await request(`${API_URL}/${itemId}`, { method: 'DELETE' });
      showToast('Item deleted successfully.');
      await loadItems();
    } catch (error) {
      showToast(error.message, true);
    }
    return;
  }

  if (button.classList.contains('update-btn')) {
    const qtyInput = card.querySelector('.qty-input');
    const quantity = Number(qtyInput.value);

    try {
      await request(`${API_URL}/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      showToast('Quantity updated.');
      await loadItems();
    } catch (error) {
      showToast(error.message, true);
    }
  }
});

loadItems();
