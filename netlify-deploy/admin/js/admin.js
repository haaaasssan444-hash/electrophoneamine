const store = window.ElectrophoneStore;
let products = store.getProducts();
let accessories = [];
try { accessories = JSON.parse(localStorage.getItem("electrophone_accessories") || "[]"); } catch (_) { accessories = []; }
const $ = id => document.getElementById(id);

function validateImage(value) {
  if (!value) return "";
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("رابط الصورة خاصو يبدا بـ http:// أو https://");
  return url.href;
}

async function readImageFile(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("اختار ملف صورة صالح.");
  if (file.size > 12 * 1024 * 1024) throw new Error("حجم الصورة كبير بزاف؛ اختار صورة أقل من 12 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/webp", 0.8);
    if (image.length > 1200000) throw new Error("الصورة مازالت كبيرة؛ اختار صورة أصغر.");
    return image;
  } finally { bitmap.close(); }
}

function previewImage(input, preview) {
  const file = input.files && input.files[0];
  if (!file) { preview.hidden = true; preview.removeAttribute("src"); return; }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
}

function message(id, text, error = false) {
  const element = $(id);
  element.textContent = text;
  element.classList.toggle("error-message", error);
}

function resetPhone() {
  $("productForm").reset();
  $("condition").value = "متوفر";
  $("quantity").value = "1";
  $("phoneImagePreview").hidden = true;
  $("phoneImagePreview").removeAttribute("src");
  $("productId").value = "";
  $("phoneSubmit").textContent = "إضافة الهاتف ✅";
}

function resetAccessory() {
  $("accessoryForm").reset();
  $("accessoryQuantity").value = "1";
  $("accessoryImagePreview").hidden = true;
  $("accessoryImagePreview").removeAttribute("src");
  $("accessoryId").value = "";
  $("accessorySubmit").textContent = "إضافة الإكسسوار ✅";
}

async function saveCatalog() {
  if (!window.ElectrophoneCloud) throw new Error("الخدمة السحابية غير متوفرة.");
  await window.ElectrophoneCloud.saveSharedCatalog(products, accessories);
}

function imageSource(item) {
  if (!item) return "";
  return store.resolveImage ? store.resolveImage(item.img || (item.images && item.images[0]) || "") : (item.img || "");
}

function escapeText(value) {
  return String(value == null ? "" : value).replace(/[&<>"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[char]);
}

function renderManagement() {
  $("phoneManageCount").textContent = `${products.length} هاتف`;
  $("phoneManageList").innerHTML = products.length ? products.map(product => {
    const image = imageSource(product);
    return `<article class="manage-product"><div class="manage-product-image">${image ? `<img src="${escapeText(image)}" alt="${escapeText(product.name || "")}">` : "📱"}</div><div class="manage-product-copy"><strong>${escapeText(product.name || `${product.brand || ""} ${product.model || ""}`)}</strong><small>${escapeText(`${product.storage || ""} • ${product.ram || ""} • ${product.condition || "متوفر"}`)}</small><b>${Number(product.price || 0).toLocaleString("fr-MA")} DH</b></div><div class="manage-actions"><button type="button" class="edit-button" data-edit-phone="${escapeText(product.id)}">تعديل</button><button type="button" class="delete-product" data-delete-phone="${escapeText(product.id)}" aria-label="حذف">×</button></div></article>`;
  }).join("") : `<p class="empty-list">ما كايناش هواتف دابا.</p>`;

  $("accessoryManageCount").textContent = `${accessories.length} إكسسوار`;
  $("accessoryManageList").innerHTML = accessories.length ? accessories.map(accessory => {
    const image = imageSource(accessory);
    return `<article class="manage-product"><div class="manage-product-image">${image ? `<img src="${escapeText(image)}" alt="${escapeText(accessory.name || "")}">` : "🎧"}</div><div class="manage-product-copy"><strong>${escapeText(accessory.name || accessory.type || "إكسسوار")}</strong><small>${escapeText(`${accessory.type || ""} • الكمية: ${accessory.quantity ?? 1}`)}</small><b>${Number(accessory.price || 0).toLocaleString("fr-MA")} DH</b></div><div class="manage-actions"><button type="button" class="edit-button" data-edit-accessory="${escapeText(accessory.id)}">تعديل</button><button type="button" class="delete-product" data-delete-accessory="${escapeText(accessory.id)}" aria-label="حذف">×</button></div></article>`;
  }).join("") : `<p class="empty-list">ما كايناش إكسسوارات دابا.</p>`;
}

function editPhone(id) {
  const product = products.find(item => String(item.id) === String(id));
  if (!product) return;
  $("productId").value = String(product.id);
  $("brand").value = String(product.brand || "").toLowerCase() === "iphone" ? "iPhone" : (String(product.brand || "")[0]?.toUpperCase() + String(product.brand || "").slice(1));
  $("model").value = product.model || "";
  $("storage").value = product.storage || "";
  $("ram").value = product.ram || "";
  $("condition").value = product.condition || "متوفر";
  $("price").value = product.price || "";
  $("oldPrice").value = product.oldPrice || "";
  $("quantity").value = product.quantity ?? 1;
  $("image").value = /^https?:\/\//i.test(product.img || "") ? product.img : "";
  $("description").value = product.desc || "";
  $("phoneSubmit").textContent = "حفظ التعديل ✅";
  $("productForm").scrollIntoView({ behavior: "smooth" });
}

function editAccessory(id) {
  const accessory = accessories.find(item => String(item.id) === String(id));
  if (!accessory) return;
  $("accessoryId").value = String(accessory.id);
  $("accessoryType").value = accessory.type || "أخرى";
  $("accessoryName").value = accessory.name || "";
  $("accessoryPrice").value = accessory.price || "";
  $("accessoryQuantity").value = accessory.quantity ?? 1;
  $("accessoryImage").value = /^https?:\/\//i.test(accessory.img || "") ? accessory.img : "";
  $("accessorySubmit").textContent = "حفظ التعديل ✅";
  $("accessoryForm").scrollIntoView({ behavior: "smooth" });
}

$("phoneManageList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-phone]");
  if (editButton) return editPhone(editButton.dataset.editPhone);
  const deleteButton = event.target.closest("[data-delete-phone]");
  if (!deleteButton) return;
  if (!confirm("متأكد بغيتي تمسح هاد الهاتف من المتجر؟")) return;
  products = products.filter(item => String(item.id) !== String(deleteButton.dataset.deletePhone));
  products = store.saveProducts(products);
  try { await saveCatalog(); message("phoneMessage", "تم حذف الهاتف ونشر التغيير ✅"); }
  catch (error) { message("phoneMessage", "حذف محليًا ولكن فشل الحفظ السحابي: " + error.message, true); }
  resetPhone(); renderManagement();
});

$("accessoryManageList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-accessory]");
  if (editButton) return editAccessory(editButton.dataset.editAccessory);
  const deleteButton = event.target.closest("[data-delete-accessory]");
  if (!deleteButton) return;
  if (!confirm("متأكد بغيتي تمسح هاد الإكسسوار من المتجر؟")) return;
  accessories = accessories.filter(item => String(item.id) !== String(deleteButton.dataset.deleteAccessory));
  localStorage.setItem("electrophone_accessories", JSON.stringify(accessories));
  try { await saveCatalog(); message("accessoryMessage", "تم حذف الإكسسوار ونشر التغيير ✅"); }
  catch (error) { message("accessoryMessage", "حذف محليًا ولكن فشل الحفظ السحابي: " + error.message, true); }
  resetAccessory(); renderManagement();
});

renderManagement();
window.addEventListener("products:updated", event => { products = Array.isArray(event.detail) ? event.detail : store.getProducts(); renderManagement(); });
window.addEventListener("accessories:updated", event => { accessories = Array.isArray(event.detail) ? event.detail : accessories; renderManagement(); });
$("logoutTop")?.addEventListener("click", () => logout());

$("phoneImageFile").addEventListener("change", () => previewImage($("phoneImageFile"), $("phoneImagePreview")));
$("accessoryImageFile").addEventListener("change", () => previewImage($("accessoryImageFile"), $("accessoryImagePreview")));

$("productForm").addEventListener("submit", async event => {
  event.preventDefault();
  const brand = $("brand").value.trim();
  const model = $("model").value.trim();
  const storage = $("storage").value.trim();
  const ram = $("ram").value.trim();
  const price = Number($("price").value);
  const oldPrice = $("oldPrice").value.trim() ? Number($("oldPrice").value) : 0;
  const quantity = Number($("quantity").value);
  const condition = $("condition").value.trim();
  if (!brand || !model || !storage || !ram || !condition || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) {
    message("phoneMessage", "عمر المعلومات المطلوبة والثمن والكمية بشكل صحيح.", true); return;
  }
  if (oldPrice && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
    message("phoneMessage", "الثمن القديم خاصو يكون أكبر من الثمن الحالي.", true); return;
  }
  let image;
  try {
    image = $("phoneImageFile").files[0] ? await readImageFile($("phoneImageFile").files[0]) : validateImage($("image").value.trim());
  } catch (error) { message("phoneMessage", error.message, true); return; }
  $("phoneSubmit").disabled = true;
  const editingId = $("productId").value;
  let id = editingId;
  if (!id) {
    id = String(Date.now());
    while (products.some(item => String(item.id) === id)) id = String(Number(id) + 1);
  }
  const existing = products.find(item => String(item.id) === String(id));
  const product = {
    id, brand: brand.toLowerCase(), model, storage, ram,
    name: [brand, model, storage, ram].filter(Boolean).join(" "),
    price, oldPrice: oldPrice || "", img: image || existing?.img || "", condition, quantity,
    desc: $("description").value.trim() || existing?.desc || `${brand} ${model} بحالة ممتازة.`
  };
  products = editingId ? products.map(item => String(item.id) === String(editingId) ? product : item) : [product, ...products];
  try { products = store.saveProducts(products); }
  catch (_) { $("phoneSubmit").disabled = false; message("phoneMessage", "ما قدرناش نحفظو الهاتف والصورة؛ جرب صورة أصغر.", true); return; }
  try {
    if (window.ElectrophoneCloud) await window.ElectrophoneCloud.saveSharedCatalog(products, accessories);
  } catch (error) {
    $("phoneSubmit").disabled = false;
    message("phoneMessage", "تزاد الهاتف محليًا ولكن ما قدرناش نرسلو للسحابة: " + (error.message || error), true);
    return;
  }
  $("phoneSubmit").disabled = false;
  resetPhone();
  window.dispatchEvent(new CustomEvent("products:updated", { detail: products }));
  renderManagement();
  message("phoneMessage", "تزاد الهاتف ونشر فالمتجر بنجاح ✅");
});

$("accessoryForm").addEventListener("submit", async event => {
  event.preventDefault();
  const type = $("accessoryType").value.trim();
  const name = $("accessoryName").value.trim();
  const price = Number($("accessoryPrice").value);
  const quantity = Number($("accessoryQuantity").value);
  if (!type || !name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) {
    message("accessoryMessage", "عمر المعلومات المطلوبة والثمن والكمية بشكل صحيح.", true); return;
  }
  let image;
  try {
    image = $("accessoryImageFile").files[0] ? await readImageFile($("accessoryImageFile").files[0]) : validateImage($("accessoryImage").value.trim());
  } catch (error) { message("accessoryMessage", error.message, true); return; }
  $("accessorySubmit").disabled = true;
  const editingId = $("accessoryId").value;
  const existing = accessories.find(item => String(item.id) === String(editingId));
  const accessory = { id: editingId || `accessory-${Date.now()}`, type, name, price, quantity, img: image || existing?.img || "" };
  accessories = editingId ? accessories.map(item => String(item.id) === String(editingId) ? accessory : item) : [accessory, ...accessories];
  try { localStorage.setItem("electrophone_accessories", JSON.stringify(accessories)); }
  catch (_) { $("accessorySubmit").disabled = false; message("accessoryMessage", "ما قدرناش نحفظو الإكسسوار والصورة؛ جرب صورة أصغر.", true); return; }
  try {
    if (window.ElectrophoneCloud) await window.ElectrophoneCloud.saveSharedCatalog(products, accessories);
  } catch (error) {
    $("accessorySubmit").disabled = false;
    message("accessoryMessage", "تزاد الإكسسوار محليًا ولكن ما قدرناش نرسلو للسحابة: " + (error.message || error), true);
    return;
  }
  $("accessorySubmit").disabled = false;
  window.dispatchEvent(new CustomEvent("accessories:updated", { detail: accessories }));
  resetAccessory();
  renderManagement();
  message("accessoryMessage", "تزاد الإكسسوار ونشر فالمتجر بنجاح ✅");
});

$("logout").addEventListener("click", () => logout());
