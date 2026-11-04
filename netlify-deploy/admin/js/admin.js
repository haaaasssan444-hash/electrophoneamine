const store = window.ElectrophoneStore;
let products = store.getProducts();
let accessories = [];
try { accessories = JSON.parse(localStorage.getItem("electrophone_accessories") || "[]"); } catch (_) { accessories = []; }
const $ = id => document.getElementById(id);

function validateImage(value) {
  if (!value) return "";
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Le lien de l’image doit commencer par http:// ou https://");
  return url.href;
}

async function readImageFile(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("Choisissez un fichier image valide.");
  if (file.size > 12 * 1024 * 1024) throw new Error("L’image est trop volumineuse ; choisissez une image de moins de 12 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/webp", 0.8);
    if (image.length > 1200000) throw new Error("L’image est encore trop grande ; choisissez une image plus petite.");
    return image;
  } finally { bitmap.close(); }
}

async function readImageFiles(files) {
  const selectedFiles = Array.from(files || []);
  const images = [];
  for (const file of selectedFiles) {
    images.push(await readImageFile(file));
  }
  return images.filter(Boolean);
}

function previewImage(input, preview) {
  const file = input.files && input.files[0];
  if (!file) { preview.hidden = true; preview.removeAttribute("src"); return; }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
}

function previewPhoneImages(input) {
  const preview = $("phoneImagesPreview");
  preview.replaceChildren();
  const files = Array.from(input.files || []);
  if (!files.length) { preview.hidden = true; return; }
  files.forEach(file => {
    const img = document.createElement("img");
    img.className = "image-preview";
    img.alt = "Aperçu du téléphone";
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });
  preview.hidden = false;
}

function previewExistingPhoneImages(images) {
  const preview = $("phoneImagesPreview");
  preview.replaceChildren();
  if (!images.length) { preview.hidden = true; return; }
  images.forEach(image => {
    if (!/^https?:\/\//i.test(image) && !image.startsWith("asset:")) return;
    const img = document.createElement("img");
    img.className = "image-preview";
    img.alt = "Aperçu du téléphone";
    img.src = store.resolveImage ? store.resolveImage(image) : image;
    preview.appendChild(img);
  });
  preview.hidden = preview.children.length === 0;
}

function message(id, text, error = false) {
  const element = $(id);
  element.textContent = text;
  element.classList.toggle("error-message", error);
}

function resetPhone() {
  $("productForm").reset();
  $("condition").value = "Disponible";
  $("quantity").value = "1";
  $("phoneImagesPreview").replaceChildren();
  $("phoneImagesPreview").hidden = true;
  $("productId").value = "";
  $("phoneSubmit").textContent = "Ajouter le téléphone ✅";
  updateRamVisibility();
}

function updateRamVisibility() {
  const isIphone = $("brand").value.trim().toLowerCase() === "iphone";
  $("ramField").hidden = isIphone;
  if (isIphone) $("ram").value = "";
}

function resetAccessory() {
  $("accessoryForm").reset();
  $("accessoryQuantity").value = "1";
  $("accessoryImagePreview").hidden = true;
  $("accessoryImagePreview").removeAttribute("src");
  $("accessoryId").value = "";
  $("accessorySubmit").textContent = "Ajouter l'accessoire ✅";
}

async function saveCatalog() {
  if (!window.ElectrophoneCloud) throw new Error("Le service cloud n’est pas disponible.");
  await window.ElectrophoneCloud.saveSharedCatalog(products, accessories);
}

function publishCatalog(messageId, successText) {
  if (!window.ElectrophoneCloud) return;
  window.ElectrophoneCloud.saveSharedCatalog(products, accessories)
    .then(() => message(messageId, successText))
    .catch(error => message(messageId, "Modifié localement, mais la synchronisation cloud a échoué : " + (error.message || error), true));
}

function imageSource(item) {
  if (!item) return "";
  return store.resolveImage ? store.resolveImage(item.img || (item.images && item.images[0]) || "") : (item.img || "");
}

function escapeText(value) {
  return String(value == null ? "" : value).replace(/[&<>"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[char]);
}

function renderManagement() {
  $("phoneManageCount").textContent = `${products.length} téléphone${products.length > 1 ? 's' : ''}`;
  $("phoneManageList").innerHTML = products.length ? products.map(product => {
    const image = imageSource(product);
      const details = [product.storage, product.ram, store.toFrenchCatalogText ? store.toFrenchCatalogText(product.condition || "Disponible") : (product.condition || "Disponible")].filter(Boolean).join(" • ");
    return `<article class="manage-product"><div class="manage-product-image">${image ? `<img src="${escapeText(image)}" alt="${escapeText(product.name || "")}">` : "📱"}</div><div class="manage-product-copy"><strong>${escapeText(product.name || `${product.brand || ""} ${product.model || ""}`)}</strong><small>${escapeText(details)}</small><b>${Number(product.price || 0).toLocaleString("fr-MA")} DH</b></div><div class="manage-actions"><button type="button" class="edit-button" data-edit-phone="${escapeText(product.id)}">Modifier</button><button type="button" class="delete-product" data-delete-phone="${escapeText(product.id)}" aria-label="Supprimer">×</button></div></article>`;
  }).join("") : `<p class="empty-list">Aucun téléphone pour le moment.</p>`;

  $("accessoryManageCount").textContent = `${accessories.length} accessoire${accessories.length > 1 ? 's' : ''}`;
  $("accessoryManageList").innerHTML = accessories.length ? accessories.map(accessory => {
    const image = imageSource(accessory);
    return `<article class="manage-product"><div class="manage-product-image">${image ? `<img src="${escapeText(image)}" alt="${escapeText(accessory.name || "")}">` : "🎧"}</div><div class="manage-product-copy"><strong>${escapeText(accessory.name || accessory.type || "Accessoire")}</strong><small>${escapeText(`${accessory.type || ""} • Quantité : ${accessory.quantity ?? 1}`)}</small><b>${Number(accessory.price || 0).toLocaleString("fr-MA")} DH</b></div><div class="manage-actions"><button type="button" class="edit-button" data-edit-accessory="${escapeText(accessory.id)}">Modifier</button><button type="button" class="delete-product" data-delete-accessory="${escapeText(accessory.id)}" aria-label="Supprimer">×</button></div></article>`;
  }).join("") : `<p class="empty-list">Aucun accessoire pour le moment.</p>`;
}

function editPhone(id) {
  const product = products.find(item => String(item.id) === String(id));
  if (!product) return;
  $("productId").value = String(product.id);
  $("brand").value = String(product.brand || "").toLowerCase() === "iphone" ? "iPhone" : (String(product.brand || "")[0]?.toUpperCase() + String(product.brand || "").slice(1));
  $("model").value = product.model || "";
  $("storage").value = product.storage || "";
  $("ram").value = product.ram || "";
  $("condition").value = product.condition || "Disponible";
  $("price").value = product.price || "";
  $("oldPrice").value = product.oldPrice || "";
  $("quantity").value = product.quantity ?? 1;
  $("image").value = /^https?:\/\//i.test(product.img || "") ? product.img : "";
  $("description").value = product.desc || "";
  const existingImages = Array.isArray(product.images) ? product.images.filter(Boolean) : (product.img ? [product.img] : []);
  previewExistingPhoneImages(existingImages);
  updateRamVisibility();
  $("phoneSubmit").textContent = "Enregistrer les modifications ✅";
  $("productForm").scrollIntoView({ behavior: "smooth" });
}

function editAccessory(id) {
  const accessory = accessories.find(item => String(item.id) === String(id));
  if (!accessory) return;
  $("accessoryId").value = String(accessory.id);
  $("accessoryType").value = accessory.type || "Autre";
  $("accessoryName").value = accessory.name || "";
  $("accessoryPrice").value = accessory.price || "";
  $("accessoryQuantity").value = accessory.quantity ?? 1;
  $("accessoryImage").value = /^https?:\/\//i.test(accessory.img || "") ? accessory.img : "";
  $("accessorySubmit").textContent = "Enregistrer les modifications ✅";
  $("accessoryForm").scrollIntoView({ behavior: "smooth" });
}

$("phoneManageList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-phone]");
  if (editButton) return editPhone(editButton.dataset.editPhone);
  const deleteButton = event.target.closest("[data-delete-phone]");
  if (!deleteButton) return;
  if (!confirm("Voulez-vous vraiment supprimer ce téléphone ?")) return;
  products = products.filter(item => String(item.id) !== String(deleteButton.dataset.deletePhone));
  products = store.saveProducts(products);
  try { await saveCatalog(); message("phoneMessage", "Téléphone supprimé et modification publiée ✅"); }
  catch (error) { message("phoneMessage", "Supprimé localement, mais la sauvegarde cloud a échoué : " + error.message, true); }
  resetPhone(); renderManagement();
});

$("accessoryManageList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-accessory]");
  if (editButton) return editAccessory(editButton.dataset.editAccessory);
  const deleteButton = event.target.closest("[data-delete-accessory]");
  if (!deleteButton) return;
  if (!confirm("Voulez-vous vraiment supprimer cet accessoire ?")) return;
  accessories = accessories.filter(item => String(item.id) !== String(deleteButton.dataset.deleteAccessory));
  localStorage.setItem("electrophone_accessories", JSON.stringify(accessories));
  try { await saveCatalog(); message("accessoryMessage", "Accessoire supprimé et modification publiée ✅"); }
  catch (error) { message("accessoryMessage", "Supprimé localement, mais la sauvegarde cloud a échoué : " + error.message, true); }
  resetAccessory(); renderManagement();
});

renderManagement();
window.addEventListener("products:updated", event => { products = Array.isArray(event.detail) ? event.detail : store.getProducts(); renderManagement(); });
window.addEventListener("accessories:updated", event => { accessories = Array.isArray(event.detail) ? event.detail : accessories; renderManagement(); });
$("logoutTop")?.addEventListener("click", () => logout());

$("phoneImageFile").addEventListener("change", () => previewPhoneImages($("phoneImageFile")));
$("accessoryImageFile").addEventListener("change", () => previewImage($("accessoryImageFile"), $("accessoryImagePreview")));
$("brand").addEventListener("change", updateRamVisibility);
updateRamVisibility();

$("productForm").addEventListener("submit", async event => {
  event.preventDefault();
  const brand = $("brand").value.trim();
  const model = $("model").value.trim();
  const storage = $("storage").value.trim();
  const ram = brand.toLowerCase() === "iphone" ? "" : $("ram").value.trim();
  const price = Number($("price").value);
  const oldPrice = $("oldPrice").value.trim() ? Number($("oldPrice").value) : 0;
  const quantity = Number($("quantity").value);
  const condition = $("condition").value.trim();
  if (!brand || !model || !storage || !condition || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) {
    message("phoneMessage", "Veuillez renseigner correctement les informations, le prix et la quantité.", true); return;
  }
  if (oldPrice && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
    message("phoneMessage", "L’ancien prix doit être supérieur au prix actuel.", true); return;
  }
  let image;
  let uploadedImages = [];
  try {
    uploadedImages = $("phoneImageFile").files.length
      ? await readImageFiles($("phoneImageFile").files)
      : [];
    image = uploadedImages.length ? uploadedImages[0] : validateImage($("image").value.trim());
  } catch (error) { message("phoneMessage", error.message, true); return; }
  $("phoneSubmit").disabled = true;
  const editingId = $("productId").value;
  let id = editingId;
  if (!id) {
    id = String(Date.now());
    while (products.some(item => String(item.id) === id)) id = String(Number(id) + 1);
  }
  const existing = products.find(item => String(item.id) === String(id));
  const existingImages = Array.isArray(existing?.images)
    ? existing.images.filter(Boolean)
    : (existing?.img ? [existing.img] : []);
  const images = uploadedImages.length
    ? uploadedImages
    : (image ? [image] : existingImages);
  const product = {
    id, brand: brand.toLowerCase(), model, storage, ram,
    name: [brand, model, storage, ram].filter(Boolean).join(" "),
    price, oldPrice: oldPrice || "", img: images[0] || "", images, condition, quantity,
    desc: $("description").value.trim() || existing?.desc || `${brand} ${model} en excellent état.`
  };
  products = editingId ? products.map(item => String(item.id) === String(editingId) ? product : item) : [product, ...products];
  try { products = store.saveProducts(products); }
  catch (_) { $("phoneSubmit").disabled = false; message("phoneMessage", "Impossible d’enregistrer le téléphone et l’image ; essayez une image plus petite.", true); return; }
  $("phoneSubmit").disabled = false;
  resetPhone();
  window.dispatchEvent(new CustomEvent("products:updated", { detail: products }));
  renderManagement();
  message("phoneMessage", "Le téléphone a été mis à jour dans la boutique ✅");
  publishCatalog("phoneMessage", editingId ? "Modification du téléphone enregistrée et publiée ✅" : "Téléphone ajouté et publié avec succès ✅");
});

$("accessoryForm").addEventListener("submit", async event => {
  event.preventDefault();
  const type = $("accessoryType").value.trim();
  const name = $("accessoryName").value.trim();
  const price = Number($("accessoryPrice").value);
  const quantity = Number($("accessoryQuantity").value);
  if (!type || !name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) {
    message("accessoryMessage", "Veuillez renseigner correctement les informations, le prix et la quantité.", true); return;
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
  catch (_) { $("accessorySubmit").disabled = false; message("accessoryMessage", "Impossible d’enregistrer l’accessoire et l’image ; essayez une image plus petite.", true); return; }
  $("accessorySubmit").disabled = false;
  window.dispatchEvent(new CustomEvent("accessories:updated", { detail: accessories }));
  resetAccessory();
  renderManagement();
  message("accessoryMessage", "L’accessoire a été mis à jour dans la boutique ✅");
  publishCatalog("accessoryMessage", editingId ? "Modification de l’accessoire enregistrée et publiée ✅" : "Accessoire ajouté et publié avec succès ✅");
});

$("logout").addEventListener("click", () => logout());
