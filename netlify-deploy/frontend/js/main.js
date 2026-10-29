const store = window.ElectrophoneStore;
let products = store.getProducts();
let accessories = readAccessories();
let cart = readCart();
let currentFilter = 'all';
let currentAccessoryFilter = 'all';
let searchQuery = '';
let currentLightboxImages = [];
let currentLightboxIndex = 0;

const $ = id => document.getElementById(id);
const productGrid = $('products');
const accessoryGrid = $('accessories');
const productModal = $('productModal');

function readArray(key, errorMessage) {
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  const items = JSON.parse(saved);
  if (!Array.isArray(items)) throw new Error(errorMessage);
  return items;
}

function readAccessories() {
  return readArray('electrophone_accessories', 'بيانات الإكسسوارات المخزنة غير صالحة.');
}

function readCart() {
  return readArray('cart', 'بيانات السلة المخزنة غير صالحة.');
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function syncCartPrices() {
  const prices = new Map(products.map(product => [String(product.id), Number(product.price) || 0]));
  let changed = false;
  cart = cart.map(item => {
    if (item.productType === 'accessory') return item;
    const price = prices.get(String(item.id));
    if (price === undefined || Number(item.price) === price) return item;
    changed = true;
    return { ...item, price };
  });
  if (changed) saveCart();
}

function recordVisit() {
  const total = Number(localStorage.getItem('site_visitors')) || 0;
  localStorage.setItem('site_visitors', String(total + 1));

  const historyKey = 'site_visitor_history';
  const history = localStorage.getItem(historyKey);
  const visitsByDate = history ? JSON.parse(history) : {};
  if (!visitsByDate || typeof visitsByDate !== 'object' || Array.isArray(visitsByDate)) {
    throw new Error('سجل زيارات الموقع المخزن غير صالح.');
  }
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  visitsByDate[date] = (Number(visitsByDate[date]) || 0) + 1;
  localStorage.setItem(historyKey, JSON.stringify(visitsByDate));

  const sessionKey = `analytics_visit_${date}`;
  if (!sessionStorage.getItem(sessionKey)) {
    sessionStorage.setItem(sessionKey, '1');
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'visit' })
    }).catch(() => {});
  }
}

function recordProductView(product) {
  const key = 'site_product_views';
  const saved = localStorage.getItem(key);
  const views = saved ? JSON.parse(saved) : {};
  if (!views || typeof views !== 'object' || Array.isArray(views)) {
    throw new Error('بيانات مشاهدات المنتجات المخزنة غير صالحة.');
  }
  const viewKey = `${product.productType || 'phone'}:${product.id}`;
  views[viewKey] = (Number(views[viewKey]) || 0) + 1;
  localStorage.setItem(key, JSON.stringify(views));

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'view', itemType: product.productType || 'phone', itemId: product.id })
  }).catch(() => {});
}

function productById(id, type) {
  const collection = type === 'accessory' ? accessories : products;
  return collection.find(item => String(item.id) === String(id));
}

function productHasPrice(product) {
  const price = Number(product.price);
  return Number.isFinite(price) && price > 0;
}

function normalizeSearchText(value) {
  return String(value == null ? '' : value)
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim();
}

function matchesSearch(item) {
  if (!searchQuery) return true;
  const searchable = [
    item.name,
    item.brand,
    item.model,
    item.storage,
    item.ram,
    item.summary,
    item.desc,
    item.condition,
    item.type,
    item.price
  ].join(' ');
  return normalizeSearchText(searchable).includes(searchQuery);
}

function renderPhoneCards() {
  const grid = $('products');
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? products
    : products.filter(product =>
      String(product.brand || '').toLowerCase() === currentFilter
    );
  const searched = filtered.filter(matchesSearch);

  if ($('cartCount')) {
    $('cartCount').textContent = cart.reduce((total, item) => total + (Number(item.qty) || 1), 0);
  }
  if ($('productCount')) $('productCount').textContent = `${searched.length} هاتف`;

  if (searched.length === 0) {
    grid.innerHTML = `<p class="empty-products">${searchQuery ? 'ما لقيناش هاتف بهاد البحث.' : 'ما كايناش هواتف فهاد التصنيف دابا.'}</p>`;
    return;
  }

  grid.innerHTML = searched.map(product => {
    const id = store.escapeHTML(product.id);
    const safeName = store.escapeHTML(product.name || 'هاتف');
    const safeImg = store.escapeHTML(store.resolveImage(product.img || ''));
    const price = productHasPrice(product) ? Number(product.price) : null;
    const oldPrice = Number(product.oldPrice) || 0;
    const priceMarkup = price === null
      ? '<span class="price">الثمن قريباً</span>'
      : `<span class="price">${price.toLocaleString('fr-MA')} DH</span>`;
    return `
      <article class="product-card">
        <div class="card-img-wrap" data-open-product="${id}" data-type="phone" role="button" tabindex="0">
          <span class="badge">${store.escapeHTML(product.condition || product.cond || 'متوفر')}</span>
          ${safeImg ? `<img src="${safeImg}" alt="${safeName}" loading="lazy" onerror="this.hidden=true">` : ''}
        </div>
        <div class="card-info">
          <h3>${safeName}</h3>
          ${product.summary ? `<p class="desc">${store.escapeHTML(product.summary)}</p>` : ''}
          <div class="price-row">
            ${priceMarkup}
            ${price !== null && oldPrice > price ? `<span class="old-price">${oldPrice.toLocaleString('fr-MA')} DH</span>` : ''}
          </div>
          <div class="product-actions">
            ${price === null
              ? `<button class="btn-whatsapp" type="button" data-order-product="${id}" data-type="phone">سول على الثمن واتساب</button>`
              : `<button class="btn-buy" type="button" data-add-product="${id}" data-type="phone">أضف للسلة 🛒</button>
                 <button class="btn-whatsapp" type="button" data-order-product="${id}" data-type="phone">طلب واتساب</button>`}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderAccessoryCards() {
  const grid = $('accessories');
  if (!grid) return;
  const filtered = currentAccessoryFilter === 'all'
    ? accessories
    : accessories.filter(accessory => accessoryMatchesCategory(accessory, currentAccessoryFilter));
  const searched = filtered.filter(matchesSearch);
  if ($('accessoryCount')) $('accessoryCount').textContent = `${searched.length} إكسسوار`;
  if (!searched.length) {
    grid.innerHTML = `<p class="empty-products">${searchQuery ? 'ما لقيناش إكسسوار بهاد البحث.' : 'ما كايناش إكسسوارات منشورة دابا.'}</p>`;
    return;
  }

  grid.innerHTML = searched.map(accessory => {
    const id = store.escapeHTML(accessory.id);
    const name = store.escapeHTML(accessory.name || 'إكسسوار');
    const image = store.escapeHTML(store.resolveImage(accessory.img || ''));
    return `
      <article class="product-card accessory-card">
        <div class="card-img-wrap" data-open-product="${id}" data-type="accessory" role="button" tabindex="0">
          <span class="badge">${store.escapeHTML(accessory.type || 'إكسسوار')}</span>
          ${image ? `<img src="${image}" alt="${name}" loading="lazy" onerror="this.hidden=true">` : ''}
        </div>
        <div class="card-info">
          <h3>${name}</h3>
          <div class="price-row"><span class="price">${(Number(accessory.price) || 0).toLocaleString('fr-MA')} DH</span></div>
          <div class="product-actions">
            <button class="btn-buy" type="button" data-add-product="${id}" data-type="accessory">أضف للسلة 🛒</button>
            <button class="btn-whatsapp" type="button" data-order-product="${id}" data-type="accessory">طلب واتساب</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function accessoryMatchesCategory(accessory, category) {
  const primaryDetails = normalizeSearchText([
    accessory.type,
    accessory.name,
    accessory.brand,
    accessory.model
  ].join(' '));
  const includesAny = terms => terms.some(term => primaryDetails.includes(normalizeSearchText(term)));
  let accessoryCategory = '';

  if (includesAny(['airpods', 'airpod', 'ايربودز', 'ايربود'])) accessoryCategory = 'airpods';
  else if (includesAny(['شاحن', 'charger'])) accessoryCategory = 'chargers';
  else if (includesAny(['كابل', 'cable'])) accessoryCategory = 'cables';
  else if (includesAny(['سماعة', 'سماعات', 'headphone', 'headset', 'earphone'])) accessoryCategory = 'headphones';
  return accessoryCategory === category;
}

function setCatalog(catalog) {
  const showAccessories = catalog === 'accessories';
  const phoneSection = $('phoneSection');
  const accessorySection = $('accessorySection');
  const phoneFilters = document.querySelector('.phone-filters');
  const accessoryFilters = document.querySelector('.accessory-filters');

  if (phoneSection) phoneSection.hidden = showAccessories;
  if (accessorySection) accessorySection.hidden = !showAccessories;
  if (phoneFilters) phoneFilters.hidden = showAccessories;
  if (accessoryFilters) accessoryFilters.hidden = !showAccessories;

  document.querySelectorAll('[data-catalog]').forEach(link => {
    const active = link.dataset.catalog === catalog;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function renderSocialLinks() {
  const container = $('socialLinks');
  if (!container) return;

  const links = [];
  const phone = (localStorage.getItem('shopWhatsAppPhone') || '').replace(/\D/g, '');
  if (/^\d{8,15}$/.test(phone)) {
    links.push({ label: 'واتساب', icon: '◉', url: `https://wa.me/${phone}`, className: 'social-whatsapp' });
  }

  const saved = localStorage.getItem('electrophone_social_links');
  const profiles = saved ? JSON.parse(saved) : {};
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    throw new Error('بيانات حسابات التواصل المخزنة غير صالحة.');
  }
  [
    { key: 'instagram', label: 'إنستغرام', icon: '◎', className: 'social-instagram' },
    { key: 'facebook', label: 'فيسبوك', icon: 'f', className: 'social-facebook' }
  ].forEach(profile => {
    const value = String(profiles[profile.key] || '').trim();
    if (!value) return;
    let url;
    try {
      url = new URL(value);
    } catch (error) {
      throw new Error(`رابط ${profile.label} المخزن غير صالح.`);
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error(`رابط ${profile.label} خاصو يستعمل http أو https.`);
    }
    links.push({ ...profile, url: url.href });
  });

  container.replaceChildren();
  links.forEach(link => {
    const anchor = document.createElement('a');
    anchor.className = `social-link ${link.className}`;
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', link.label);

    const icon = document.createElement('span');
    icon.className = 'social-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = link.icon;
    const label = document.createElement('span');
    label.textContent = link.label;
    anchor.append(icon, label);
    container.append(anchor);
  });

  const footer = container.closest('.contact-footer');
  footer.hidden = links.length === 0 && !footer.querySelector('.location-section');
}

function addToCart(id, type = 'phone') {
  const product = productById(id, type);
  if (!product) return;
  if (!productHasPrice(product)) {
    window.alert('الثمن مازال ما تحددش لهاد الهاتف. تواصل معنا عبر واتساب لمعرفة الثمن.');
    return;
  }
  const existing = cart.find(item =>
    String(item.id) === String(id) && (item.productType || 'phone') === type
  );
  if (existing) {
    existing.qty = (Number(existing.qty) || 1) + 1;
    existing.price = Number(product.price) || 0;
  } else {
    cart.push({ ...product, productType: type, qty: 1 });
  }
  saveCart();
  renderPhoneCards();
}

function orderProductWhatsApp(id, type = 'phone') {
  const product = productById(id, type);
  if (!product) return;

  const phone = (localStorage.getItem('shopWhatsAppPhone') || '').replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(phone)) {
    window.alert('رقم واتساب ديال المحل مازال ما تحددش. تواصل مع المحل أو عاود من بعد.');
    return;
  }

  const name = product.name || product.type || 'منتج';
  const message = [
    'سلام، بغيت نطلب هاد المنتج:',
    `- ${name}`,
    `- الثمن: ${productHasPrice(product) ? `${Number(product.price).toLocaleString('fr-MA')} DH` : 'يرجى إخباري بالثمن'}`,
    `- الكمية: 1`
  ].join('\n');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

function openModal(id, type = 'phone') {
  const product = productById(id, type);
  if (!product || !$('modalBody')) return;
  recordProductView({ ...product, productType: type });

  const safeName = store.escapeHTML(product.name || 'منتج');
  const safeDesc = store.escapeHTML(product.desc || product.type || 'منتج متوفر لدى المحل.');
  const price = productHasPrice(product) ? Number(product.price) : null;
  const oldPrice = Number(product.oldPrice) || 0;
  const priceMarkup = price === null
    ? '<span class="price">الثمن قريباً</span>'
    : `<span class="price">${price.toLocaleString('fr-MA')} DH</span>`;
  const imageSources = Array.isArray(product.images) && product.images.length
    ? product.images
    : (product.img ? [product.img] : []);
  currentLightboxImages = imageSources.map(image => store.resolveImage(image));
  const safeImages = currentLightboxImages.map(image => store.escapeHTML(image));
  $('modalBody').innerHTML = `
    <div class="modal-product">
      ${safeImages.length ? `
        <div class="modal-image-gallery">
          <div class="modal-gallery-heading">
            <strong>صور المنتج</strong>
            <span>${safeImages.length} ${safeImages.length === 1 ? 'صورة' : 'صور'}</span>
          </div>
          <p class="modal-gallery-hint">اضغط على أي صورة باش تشوفها مكبّرة</p>
          <div class="modal-photo-grid" role="group" aria-label="جميع صور المنتج">
            ${safeImages.map((image, index) => `
              <button class="modal-photo-tile" type="button" data-lightbox-open="${index}" aria-label="تكبير الصورة ${index + 1}">
                <img src="${image}" alt="${safeName} - صورة ${index + 1}" loading="eager">
                <span class="modal-photo-number">${index + 1}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div class="modal-product-info">
        <h2>${safeName}</h2>
        <p>${safeDesc}</p>
        <div class="price-row">
          ${priceMarkup}
          ${price !== null && oldPrice > price ? `<span class="old-price">${oldPrice.toLocaleString('fr-MA')} DH</span>` : ''}
        </div>
        <div class="product-actions">
          ${price === null
            ? `<button class="btn-whatsapp" type="button" data-order-product="${store.escapeHTML(product.id)}" data-type="${type}">سول على الثمن واتساب</button>`
            : `<button class="btn-buy" type="button" data-add-product="${store.escapeHTML(product.id)}" data-type="${type}">أضف للسلة 🛒</button>
               <button class="btn-whatsapp" type="button" data-order-product="${store.escapeHTML(product.id)}" data-type="${type}">طلب واتساب</button>`}
        </div>
      </div>
    </div>
  `;
  $('productModal').classList.add('active');
}

function showLightboxImage(index) {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = (index + currentLightboxImages.length) % currentLightboxImages.length;
  const lightbox = $('imageLightbox');
  const image = $('lightboxImage');
  const counter = $('lightboxCounter');
  if (!lightbox || !image || !counter) return;
  image.src = currentLightboxImages[currentLightboxIndex];
  image.alt = `صورة المنتج ${currentLightboxIndex + 1}`;
  counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
  lightbox.hidden = false;
}

function closeLightbox() {
  const lightbox = $('imageLightbox');
  if (lightbox) lightbox.hidden = true;
}

function closeModal() {
  closeLightbox();
  if ($('productModal')) $('productModal').classList.remove('active');
}

document.querySelectorAll('[data-filter]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    currentFilter = link.dataset.filter || 'all';
    renderPhoneCards();
  });
});

document.querySelectorAll('[data-catalog]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const catalog = link.dataset.catalog === 'accessories' ? 'accessories' : 'phones';
    setCatalog(catalog);
    if (catalog === 'phones') {
      currentFilter = 'all';
      document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
      renderPhoneCards();
    } else {
      currentAccessoryFilter = 'all';
      document.querySelectorAll('[data-accessory-filter]').forEach(item => item.classList.toggle('active', item.dataset.accessoryFilter === 'all'));
      renderAccessoryCards();
    }
  });
});

document.querySelectorAll('[data-accessory-filter]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.querySelectorAll('[data-accessory-filter]').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    currentAccessoryFilter = link.dataset.accessoryFilter || 'all';
    renderAccessoryCards();
  });
});

const searchForm = document.querySelector('.search-box');
const searchInput = $('productSearch');
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    searchQuery = normalizeSearchText(searchInput.value);
    renderPhoneCards();
    renderAccessoryCards();
  });
  searchInput.addEventListener('input', () => {
    searchQuery = normalizeSearchText(searchInput.value);
    renderPhoneCards();
    renderAccessoryCards();
  });
}

function handleProductAction(event) {
  const lightboxClose = event.target.closest('[data-lightbox-close]');
  const lightbox = $('imageLightbox');
  if (lightboxClose || event.target === lightbox) {
    closeLightbox();
    return;
  }
  const lightboxNavigation = event.target.closest('[data-lightbox-step]');
  if (lightboxNavigation) {
    showLightboxImage(currentLightboxIndex + Number(lightboxNavigation.dataset.lightboxStep));
    return;
  }
  const galleryImage = event.target.closest('[data-lightbox-open]');
  if (galleryImage) {
    showLightboxImage(Number(galleryImage.dataset.lightboxOpen));
    return;
  }
  const orderButton = event.target.closest('[data-order-product]');
  if (orderButton) {
    orderProductWhatsApp(orderButton.dataset.orderProduct, orderButton.dataset.type);
    return;
  }
  const addButton = event.target.closest('[data-add-product]');
  if (addButton) {
    addToCart(addButton.dataset.addProduct, addButton.dataset.type);
    if ($('productModal').classList.contains('active')) closeModal();
    return;
  }
  const detailTarget = event.target.closest('[data-open-product]');
  if (detailTarget) openModal(detailTarget.dataset.openProduct, detailTarget.dataset.type);
}

function handleProductKeydown(event) {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-product]')) {
    event.preventDefault();
    openModal(event.target.dataset.openProduct, event.target.dataset.type);
  }
}

if (productGrid) {
  productGrid.addEventListener('click', handleProductAction);
  productGrid.addEventListener('keydown', handleProductKeydown);
}
if (accessoryGrid) {
  accessoryGrid.addEventListener('click', handleProductAction);
  accessoryGrid.addEventListener('keydown', handleProductKeydown);
}
if (productModal) productModal.addEventListener('click', handleProductAction);
document.addEventListener('keydown', event => {
  const lightbox = $('imageLightbox');
  if (lightbox && !lightbox.hidden) {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showLightboxImage(currentLightboxIndex + 1);
    if (event.key === 'ArrowRight') showLightboxImage(currentLightboxIndex - 1);
    return;
  }
  if (event.key === 'Escape') closeModal();
});

window.addToCart = addToCart;
window.openModal = openModal;
window.closeModal = closeModal;

window.addEventListener('storage', event => {
  if (event.key === 'productsData' || event.key === 'electrophone_products') {
    products = store.getProducts();
    syncCartPrices();
    renderPhoneCards();
  } else if (event.key === 'electrophone_accessories') {
    accessories = readAccessories();
    renderAccessoryCards();
  } else if (event.key === 'cart') {
    cart = readCart();
    renderPhoneCards();
  } else if (event.key === 'shopWhatsAppPhone' || event.key === 'electrophone_social_links') {
    renderSocialLinks();
  }
});
window.addEventListener('products:updated', event => {
  products = event.detail;
  syncCartPrices();
  renderPhoneCards();
});

function injectProductStructuredData() {
  const items = products.filter(productHasPrice).map((product, index) => {
    const image = store.resolveImage(product.img || '');
    const absoluteImage = image ? new URL(image, window.location.origin + '/').href : undefined;
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name || 'هاتف',
        description: product.desc || product.summary || '',
        sku: String(product.id),
        brand: { '@type': 'Brand', name: product.brand || 'ElectrophoneAmine' },
        ...(absoluteImage ? { image: absoluteImage } : {}),
        offers: {
          '@type': 'Offer',
          url: 'https://marketphone.shop/',
          priceCurrency: 'MAD',
          price: Number(product.price),
          availability: Number(product.quantity) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'ElectrophoneAmine' }
        }
      }
    };
  });

  if (!items.length) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'هواتف متوفرة لدى ElectrophoneAmine',
    numberOfItems: items.length,
    itemListElement: items
  });
  document.head.appendChild(script);
}

syncCartPrices();
recordVisit();
renderPhoneCards();
renderAccessoryCards();
renderSocialLinks();
injectProductStructuredData();
