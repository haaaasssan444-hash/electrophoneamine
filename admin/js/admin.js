const store = window.ElectrophoneStore;
let products = store.getProducts();
let accessories = readArray('electrophone_accessories', 'بيانات الإكسسوارات المخزنة غير صالحة.');

const $ = id => document.getElementById(id);
const phoneForm = $('productForm');
const accessoryForm = $('accessoryForm');
const settingsForm = $('settingsForm');

function readArray(key, errorMessage) {
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  const items = JSON.parse(saved);
  if (!Array.isArray(items) || items.some(item => !item || typeof item !== 'object')) {
    throw new Error(errorMessage);
  }
  return items;
}

function getCart() {
  return readArray('cart', 'بيانات السلة المخزنة غير صالحة.');
}

function getViews() {
  const saved = localStorage.getItem('site_product_views');
  const views = saved ? JSON.parse(saved) : {};
  if (!views || typeof views !== 'object' || Array.isArray(views)) {
    throw new Error('بيانات مشاهدات المنتجات المخزنة غير صالحة.');
  }
  return views;
}

function getVisitHistory() {
  const saved = localStorage.getItem('site_visitor_history');
  const history = saved ? JSON.parse(saved) : {};
  if (!history || typeof history !== 'object' || Array.isArray(history)) {
    throw new Error('سجل زيارات الموقع المخزن غير صالح.');
  }
  return history;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getVisitorTotals() {
  const history = getVisitHistory();
  const today = new Date();
  const todayKey = dateKey(today);
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekStartKey = dateKey(weekStart);
  const todayCount = Number(history[todayKey]) || 0;
  const weekCount = Object.entries(history).reduce((total, [date, count]) =>
    date >= weekStartKey && date <= todayKey ? total + (Number(count) || 0) : total, 0
  );
  return { todayCount, weekCount };
}

function inventoryQuantity(item) {
  const quantity = Number(item.quantity);
  return Number.isFinite(quantity) && quantity >= 0 ? quantity : 1;
}

function itemKey(item, type) {
  return `${type}:${item.id}`;
}

function validateImage(value) {
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('رابط الصورة خاصو يبدا بـ http:// أو https://');
  }
  return url.href;
}

async function readImageFile(file) {
  if (!file) return '';
  if (!file.type.startsWith('image/')) {
    throw new Error('اختار ملف صورة صالح.');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('حجم الصورة كبير بزاف؛ اختار صورة أقل من 12 MB.');
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/webp', 0.8);
    if (image.length > 1_200_000) {
      throw new Error('الصورة مازالت كبيرة من بعد الضغط؛ اختار صورة أصغر.');
    }
    return image;
  } catch (error) {
    if (error instanceof Error && error.message.includes('الصورة')) throw error;
    throw new Error('ما قدرناش نقراو هاد الصورة. جرب صورة بصيغة JPG أو PNG أو WebP.');
  } finally {
    if (bitmap) bitmap.close();
  }
}

function previewImage(input, preview) {
  const file = input.files && input.files[0];
  if (!file) {
    preview.hidden = true;
    preview.removeAttribute('src');
    return;
  }
  if (!file.type.startsWith('image/')) {
    preview.hidden = true;
    preview.removeAttribute('src');
    return;
  }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
}

function setImagePreview(preview, image) {
  if (!image) {
    preview.hidden = true;
    preview.removeAttribute('src');
    return;
  }
  preview.src = store.resolveImage(image);
  preview.hidden = false;
}

function render() {
  const cart = getCart();
  const views = getViews();
  const visitorTotals = getVisitorTotals();
  const catalog = [
    ...products.map(item => ({ ...item, productType: 'phone' })),
    ...accessories.map(item => ({ ...item, productType: 'accessory' }))
  ];
  const orderCounts = new Map();
  cart.forEach(item => {
    const type = item.productType === 'accessory' ? 'accessory' : 'phone';
    const key = itemKey(item, type);
    orderCounts.set(key, (orderCounts.get(key) || 0) + (Number(item.qty) || 1));
  });

  $('totalProducts').textContent = catalog.length.toLocaleString('fr-MA');
  $('siteVisitors').textContent = (Number(localStorage.getItem('site_visitors')) || 0).toLocaleString('fr-MA');
  $('totalOrders').textContent = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0).toLocaleString('fr-MA');
  const inventoryValue = catalog.reduce((sum, item) =>
    sum + (Number(item.price) || 0) * inventoryQuantity(item), 0
  );
  $('inventoryValue').textContent = `${inventoryValue.toLocaleString('fr-MA')} DH`;
  $('visitorsToday').textContent = visitorTotals.todayCount.toLocaleString('fr-MA');
  $('visitorsWeek').textContent = visitorTotals.weekCount.toLocaleString('fr-MA');
  $('catalogCount').textContent = `${catalog.length} منتج`;

  $('emptyAnalytics').hidden = catalog.length > 0;
  $('analyticsRows').innerHTML = catalog.map(item => {
    const type = item.productType;
    const key = itemKey(item, type);
    const name = store.escapeHTML(item.name || 'منتج');
    const label = type === 'accessory' ? 'إكسسوار' : 'هاتف';
    return `
      <tr>
        <td><span class="table-product-name">${name}</span><small class="table-product-type">${label}</small></td>
        <td>${(orderCounts.get(key) || 0).toLocaleString('fr-MA')}</td>
        <td>${(Number(views[key]) || 0).toLocaleString('fr-MA')}</td>
        <td>${inventoryQuantity(item).toLocaleString('fr-MA')}</td>
        <td class="table-actions">
          <button class="edit-button" type="button" data-edit="${store.escapeHTML(item.id)}" data-type="${type}">تعديل</button>
          <button class="delete-product" type="button" data-delete="${store.escapeHTML(item.id)}" data-type="${type}" aria-label="حذف ${name}">×</button>
        </td>
      </tr>
    `;
  }).join('');
}

function phoneMessage(text, isError = false) {
  $('phoneMessage').textContent = text;
  $('phoneMessage').classList.toggle('error-message', isError);
}

function accessoryMessage(text, isError = false) {
  $('accessoryMessage').textContent = text;
  $('accessoryMessage').classList.toggle('error-message', isError);
}

function resetPhoneForm() {
  phoneForm.reset();
  $('productId').value = '';
  $('condition').value = 'متوفر';
  $('quantity').value = '1';
  $('phoneImagePreview').hidden = true;
  $('phoneImagePreview').removeAttribute('src');
  $('phoneSubmit').textContent = 'نشر الهاتف ✅';
  $('cancelPhoneEdit').hidden = true;
}

function resetAccessoryForm() {
  accessoryForm.reset();
  $('accessoryId').value = '';
  $('accessoryQuantity').value = '1';
  $('accessoryImagePreview').hidden = true;
  $('accessoryImagePreview').removeAttribute('src');
  $('accessorySubmit').textContent = 'نشر الإكسسوار ✅';
  $('cancelAccessoryEdit').hidden = true;
}

phoneForm.addEventListener('submit', async event => {
  event.preventDefault();
  const brand = $('brand').value.trim();
  const model = $('model').value.trim();
  const storage = $('storage').value.trim();
  const ram = $('ram').value.trim();
  const price = Number($('price').value);
  const oldPrice = $('oldPrice').value.trim() ? Number($('oldPrice').value) : 0;
  const quantity = Number($('quantity').value);
  const condition = $('condition').value.trim();
  const editingId = $('productId').value;

  if (!brand || !model || !storage || !ram || !condition ||
      !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(quantity) || quantity < 0) {
    phoneMessage('عمر جميع المعلومات المطلوبة والثمن والكمية بشكل صحيح.', true);
    return;
  }
  if (oldPrice && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
    phoneMessage('الثمن القديم خاصو يكون أكبر من الثمن الحالي.', true);
    return;
  }

  let image;
  try {
    image = $('phoneImageFile').files[0]
      ? await readImageFile($('phoneImageFile').files[0])
      : validateImage($('image').value.trim()) || (products.find(item => String(item.id) === editingId) || {}).img || '';
  } catch (error) {
    phoneMessage(error.message, true);
    return;
  }
  $('phoneSubmit').disabled = true;

  const existing = products.find(item => String(item.id) === editingId);
  let id = editingId || String(Date.now());
  while (!editingId && products.some(item => String(item.id) === id)) id = String(Number(id) + 1);
  const product = {
    ...(existing || {}),
    id: existing ? existing.id : id,
    brand: brand.toLowerCase(),
    model,
    storage,
    ram,
    name: [brand, model, storage, ram].filter(Boolean).join(' '),
    price,
    oldPrice: oldPrice || '',
    img: image,
    condition,
    quantity,
    desc: $('description').value.trim() || `${brand} ${model} بحالة ممتازة.`
  };
  if (existing && image !== existing.img) delete product.images;
  products = existing
    ? products.map(item => String(item.id) === editingId ? product : item)
    : [product, ...products];
  try {
    products = store.saveProducts(products);
  } catch (error) {
    phoneMessage('ما قدرناش نحفظو المنتج والصورة. مساحة التخزين المحلية عامرة؛ جرب صورة أصغر أو نقص من عدد الصور.', true);
    $('phoneSubmit').disabled = false;
    return;
  }
  $('phoneSubmit').disabled = false;
  resetPhoneForm();
  const savedProduct = products.find(item => String(item.id) === String(id));
  const priceMessage = savedProduct && savedProduct.oldPrice
    ? ` الثمن الحالي ${Number(savedProduct.price).toLocaleString('fr-MA')} DH، والثمن السابق ${Number(savedProduct.oldPrice).toLocaleString('fr-MA')} DH.`
    : '';
  phoneMessage(`${existing ? 'تبدلات معلومات الهاتف بنجاح ✅' : 'تزاد الهاتف ونشر فالمتجر بنجاح ✅'}${priceMessage}`);
  render();
});

accessoryForm.addEventListener('submit', async event => {
  event.preventDefault();
  const type = $('accessoryType').value.trim();
  const name = $('accessoryName').value.trim();
  const price = Number($('accessoryPrice').value);
  const quantity = Number($('accessoryQuantity').value);
  const editingId = $('accessoryId').value;
  if (!type || !name || !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(quantity) || quantity < 0) {
    accessoryMessage('عمر المعلومات المطلوبة والثمن والكمية بشكل صحيح.', true);
    return;
  }

  let image;
  try {
    image = $('accessoryImageFile').files[0]
      ? await readImageFile($('accessoryImageFile').files[0])
      : validateImage($('accessoryImage').value.trim()) || (accessories.find(item => String(item.id) === editingId) || {}).img || '';
  } catch (error) {
    accessoryMessage(error.message, true);
    return;
  }
  $('accessorySubmit').disabled = true;

  const existing = accessories.find(item => String(item.id) === editingId);
  let id = editingId || `accessory-${Date.now()}`;
  while (!editingId && accessories.some(item => String(item.id) === id)) id = `accessory-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const accessory = {
    ...(existing || {}),
    id: existing ? existing.id : id,
    type,
    name,
    price,
    quantity,
    img: image
  };
  accessories = existing
    ? accessories.map(item => String(item.id) === editingId ? accessory : item)
    : [accessory, ...accessories];
  try {
    localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
  } catch (error) {
    accessoryMessage('ما قدرناش نحفظو الإكسسوار والصورة. مساحة التخزين المحلية عامرة؛ جرب صورة أصغر أو نقص من عدد الصور.', true);
    $('accessorySubmit').disabled = false;
    return;
  }
  $('accessorySubmit').disabled = false;
  window.dispatchEvent(new CustomEvent('accessories:updated', { detail: accessories }));
  resetAccessoryForm();
  accessoryMessage(existing ? 'تبدلات معلومات الإكسسوار بنجاح ✅' : 'تنشر الإكسسوار فالمتجر بنجاح ✅');
  render();
});

function startEdit(item, type) {
  if (type === 'accessory') {
    $('accessoryId').value = item.id;
    $('accessoryType').value = item.type || '';
    $('accessoryName').value = item.name || '';
    $('accessoryPrice').value = Number(item.price) || '';
    $('accessoryQuantity').value = inventoryQuantity(item);
    $('accessoryImage').value = item.img && !item.img.startsWith('data:') ? item.img : '';
    $('accessoryImageFile').value = '';
    setImagePreview($('accessoryImagePreview'), item.img);
    $('accessorySubmit').textContent = 'حفظ التعديلات ✅';
    $('cancelAccessoryEdit').hidden = false;
    $('accessoryForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  $('productId').value = item.id;
  const brandOption = Array.from($('brand').options).find(option =>
    option.value.toLowerCase() === String(item.brand || '').toLowerCase()
  );
  $('brand').value = brandOption ? brandOption.value : '';
  $('model').value = item.model || item.name || '';
  $('storage').value = item.storage || '';
  $('ram').value = item.ram || '';
  $('condition').value = item.condition || item.cond || 'متوفر';
  $('price').value = Number(item.price) || '';
  $('oldPrice').value = Number(item.oldPrice) || '';
  $('quantity').value = inventoryQuantity(item);
  $('image').value = item.img && !item.img.startsWith('data:') && !item.img.startsWith('asset:') ? item.img : '';
  $('phoneImageFile').value = '';
  setImagePreview($('phoneImagePreview'), item.img);
  $('description').value = item.desc || '';
  $('phoneSubmit').textContent = 'حفظ التعديلات ✅';
  $('cancelPhoneEdit').hidden = false;
  phoneForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

$('phoneImageFile').addEventListener('change', () =>
  previewImage($('phoneImageFile'), $('phoneImagePreview'))
);
$('accessoryImageFile').addEventListener('change', () =>
  previewImage($('accessoryImageFile'), $('accessoryImagePreview'))
);

$('analyticsRows').addEventListener('click', event => {
  const button = event.target.closest('button[data-edit], button[data-delete]');
  if (!button) return;
  const type = button.dataset.type;
  const collection = type === 'accessory' ? accessories : products;
  const item = collection.find(entry => String(entry.id) === button.dataset.edit || String(entry.id) === button.dataset.delete);
  if (!item) return;

  if (button.hasAttribute('data-edit')) {
    startEdit(item, type);
    return;
  }
  if (!window.confirm('واش متأكد بغيتي تمسح هاد المنتج؟')) return;
  if (type === 'accessory') {
    accessories = accessories.filter(entry => String(entry.id) !== button.dataset.delete);
    localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
  } else {
    products = products.filter(entry => String(entry.id) !== button.dataset.delete);
    products = store.saveProducts(products);
  }
  render();
});

$('cancelPhoneEdit').addEventListener('click', () => {
  resetPhoneForm();
  phoneMessage('');
});
$('cancelAccessoryEdit').addEventListener('click', () => {
  resetAccessoryForm();
  accessoryMessage('');
});

const savedPhone = localStorage.getItem('shopWhatsAppPhone') || '';
$('shopPhone').value = savedPhone;
const savedSocialLinks = localStorage.getItem('electrophone_social_links');
const socialLinks = savedSocialLinks ? JSON.parse(savedSocialLinks) : {};
if (!socialLinks || typeof socialLinks !== 'object' || Array.isArray(socialLinks)) {
  throw new Error('بيانات حسابات التواصل المخزنة غير صالحة.');
}
$('instagramUrl').value = socialLinks.instagram || '';
$('facebookUrl').value = socialLinks.facebook || '';

function validateSocialUrl(value, platformName) {
  if (!value) return '';
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error(`دخل رابط ${platformName} صحيح كيبدا بـ https://`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`رابط ${platformName} خاصو يبدا بـ https://`);
  }
  return url.href;
}

settingsForm.addEventListener('submit', event => {
  event.preventDefault();
  const phone = $('shopPhone').value.trim();
  const normalizedPhone = phone.replace(/^\+/, '');
  if (phone && !/^\d{8,15}$/.test(normalizedPhone)) {
    $('settingsMessage').textContent = 'دخل رقم واتساب صحيح بالصيغة الدولية، من 8 حتى 15 رقم.';
    $('settingsMessage').classList.add('error-message');
    return;
  }
  let instagram;
  let facebook;
  try {
    instagram = validateSocialUrl($('instagramUrl').value.trim(), 'إنستغرام');
    facebook = validateSocialUrl($('facebookUrl').value.trim(), 'فيسبوك');
  } catch (error) {
    $('settingsMessage').textContent = error.message;
    $('settingsMessage').classList.add('error-message');
    return;
  }

  if (normalizedPhone) localStorage.setItem('shopWhatsAppPhone', normalizedPhone);
  else localStorage.removeItem('shopWhatsAppPhone');
  localStorage.setItem('electrophone_social_links', JSON.stringify({ instagram, facebook }));
  $('settingsMessage').textContent = 'تحفظات حسابات التواصل بنجاح ✅';
  $('settingsMessage').classList.remove('error-message');
});

$('logout').addEventListener('click', () => logout());
window.addEventListener('storage', event => {
  if (event.key === 'productsData' || event.key === 'electrophone_products') {
    products = store.getProducts();
    render();
  } else if (event.key === 'electrophone_accessories') {
    accessories = readArray('electrophone_accessories', 'بيانات الإكسسوارات المخزنة غير صالحة.');
    render();
  } else if (event.key === 'cart' || event.key === 'site_visitors' ||
      event.key === 'site_visitor_history' || event.key === 'site_product_views') {
    render();
  }
});
window.addEventListener('products:updated', event => {
  products = event.detail;
  render();
});

render();
