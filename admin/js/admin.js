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
}

function resetAccessory() {
  $("accessoryForm").reset();
  $("accessoryQuantity").value = "1";
  $("accessoryImagePreview").hidden = true;
  $("accessoryImagePreview").removeAttribute("src");
}

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
  let id = String(Date.now());
  while (products.some(item => String(item.id) === id)) id = String(Number(id) + 1);
  const product = {
    id, brand: brand.toLowerCase(), model, storage, ram,
    name: [brand, model, storage, ram].filter(Boolean).join(" "),
    price, oldPrice: oldPrice || "", img: image, condition, quantity,
    desc: $("description").value.trim() || `${brand} ${model} بحالة ممتازة.`
  };
  products = [product, ...products];
  try { products = store.saveProducts(products); }
  catch (_) { $("phoneSubmit").disabled = false; message("phoneMessage", "ما قدرناش نحفظو الهاتف والصورة؛ جرب صورة أصغر.", true); return; }
  $("phoneSubmit").disabled = false;
  resetPhone();
  window.dispatchEvent(new CustomEvent("products:updated", { detail: products }));
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
  const accessory = { id: `accessory-${Date.now()}`, type, name, price, quantity, img: image };
  accessories = [accessory, ...accessories];
  try { localStorage.setItem("electrophone_accessories", JSON.stringify(accessories)); }
  catch (_) { $("accessorySubmit").disabled = false; message("accessoryMessage", "ما قدرناش نحفظو الإكسسوار والصورة؛ جرب صورة أصغر.", true); return; }
  $("accessorySubmit").disabled = false;
  window.dispatchEvent(new CustomEvent("accessories:updated", { detail: accessories }));
  resetAccessory();
  message("accessoryMessage", "تزاد الإكسسوار ونشر فالمتجر بنجاح ✅");
});

$("logout").addEventListener("click", () => logout());
