(function () {
  const store = window.ElectrophoneStore;
  let phones = [];
  let accessories = [];

  function readArray(key) {
    try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; }
    catch (_) { return []; }
  }
  function number(value) { const result = Number(value || 0); return Number.isFinite(result) ? result : 0; }
  function escapeText(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  }
  function productName(item, type) { return type === 'phone' ? item.name || [item.brand,item.model,item.storage].filter(Boolean).join(' ') : item.name || item.type || 'Accessoire'; }
  function rows() { return [...phones.map(item => ({item,type:'phone',category:'Téléphone'})),...accessories.map(item => ({item,type:'accessory',category:item.type || 'Accessoire'}))]; }
  function formatMoney(value) { return `${Math.round(value).toLocaleString('fr-MA')} DH`; }

  function renderStats() {
    const all = rows();
    const totalUnits = all.reduce((sum,row) => sum + Math.max(0,number(row.item.quantity)),0);
    const totalValue = all.reduce((sum,row) => sum + Math.max(0,number(row.item.quantity))*Math.max(0,number(row.item.price)),0);
    const outCount = all.filter(row => number(row.item.quantity)<=0).length;
    const cart = readArray('cart');
    const cartUnits = cart.reduce((sum,item) => sum + Math.max(0,number(item.quantity || item.qty || 1)),0);
    const cartValue = cart.reduce((sum,item) => sum + number(item.quantity || item.qty || 1)*number(item.price),0);
    document.getElementById('stockUnits').textContent = String(totalUnits);
    document.getElementById('stockUnitsNote').textContent = `${phones.length} téléphones · ${accessories.length} accessoires`;
    document.getElementById('stockValue').textContent = formatMoney(totalValue);
    document.getElementById('stockOut').textContent = String(outCount);
    document.getElementById('phoneCount').textContent = String(phones.length);
    document.getElementById('accessoryCount').textContent = String(accessories.length);
    document.getElementById('cartSummary').textContent = `${cartUnits} article${cartUnits > 1 ? 's' : ''} · ${formatMoney(cartValue)}`;
  }

  function renderTable() {
    const search = document.getElementById('stockSearch').value.trim().toLowerCase();
    const filter = document.getElementById('stockFilter').value;
    const visibleRows = rows().filter(row => {
      const quantity = number(row.item.quantity);
      const matchesSearch = productName(row.item,row.type).toLowerCase().includes(search);
      const matchesFilter = filter === 'all' || (filter === 'phone' && row.type === 'phone') || (filter === 'accessory' && row.type === 'accessory') || (filter === 'low' && quantity > 0 && quantity <= 2) || (filter === 'out' && quantity <= 0);
      return matchesSearch && matchesFilter;
    });
    document.getElementById('stockTableBody').innerHTML = visibleRows.length ? visibleRows.map(row => {
      const quantity = Math.max(0,number(row.item.quantity)), price = Math.max(0,number(row.item.price));
      const stateClass = quantity <= 2 ? 'stock-low' : 'stock-ok', state = quantity <= 0 ? 'Épuisé' : quantity <= 2 ? 'Stock faible' : 'Disponible';
      return `<tr data-type="${row.type}" data-id="${escapeText(row.item.id)}"><td class="stock-name"><strong>${escapeText(productName(row.item,row.type))}</strong><small>${escapeText(row.item.storage || row.item.condition || '')}</small></td><td>${escapeText(row.category)}</td><td>${formatMoney(price)}</td><td><input class="stock-qty" type="number" min="0" step="1" value="${quantity}" aria-label="Quantité"></td><td>${formatMoney(quantity*price)}</td><td><span class="${stateClass}">${state}</span></td></tr>`;
    }).join('') : '<tr><td colspan="6" style="text-align:center;color:#6b7280;padding:24px">Aucun produit trouvé</td></tr>';
  }

  function updateRowModel(input) {
    const tr = input.closest('tr'), id = String(tr.dataset.id), quantity = Math.max(0,Math.trunc(number(input.value)));
    if (tr.dataset.type === 'phone') phones = phones.map(item => String(item.id) === id ? {...item,quantity} : item);
    else accessories = accessories.map(item => String(item.id) === id ? {...item,quantity} : item);
    const row = rows().find(entry => entry.type === tr.dataset.type && String(entry.item.id) === id);
    if (row) {
      tr.querySelectorAll('td')[4].textContent = formatMoney(quantity*number(row.item.price));
      const state = tr.querySelector('td:last-child span');
      state.className = quantity <= 2 ? 'stock-low' : 'stock-ok';
      state.textContent = quantity <= 0 ? 'Épuisé' : quantity <= 2 ? 'Stock faible' : 'Disponible';
    }
    renderStats();
  }

  async function saveStock() {
    const button=document.getElementById('saveStock'), message=document.getElementById('stockMessage');
    button.disabled=true;
    try {
      phones=store.saveProducts(phones); localStorage.setItem('electrophone_accessories',JSON.stringify(accessories));
      if (!window.ElectrophoneCloud) throw new Error('Le service cloud n’est pas disponible.');
      await window.ElectrophoneCloud.saveSharedCatalog(phones,accessories);
      message.className='stock-message'; message.textContent='Stock enregistré et publié avec succès ✅'; renderTable();
    } catch(error) { message.className='stock-message error'; message.textContent=`Échec de la publication : ${error.message || error}`; }
    finally { button.disabled=false; }
  }
  async function loadAnalytics() {
    try {
      const response=await fetch('/api/analytics',{cache:'no-store'}); if(!response.ok) throw new Error();
      const analytics=await response.json(), today=new Date(), key=`${today.getUTCFullYear()}-${String(today.getUTCMonth()+1).padStart(2,'0')}-${String(today.getUTCDate()).padStart(2,'0')}`;
      document.getElementById('visitorTotal').textContent=String(number(analytics.visitorsTotal));
      document.getElementById('visitorToday').textContent=`Aujourd’hui : ${number(analytics.visitorsDaily&&analytics.visitorsDaily[key])}`;
    } catch(_) { document.getElementById('visitorTotal').textContent='—'; document.getElementById('visitorToday').textContent='Statistiques non disponibles'; }
  }
  document.getElementById('stockSearch').addEventListener('input',renderTable);
  document.getElementById('stockFilter').addEventListener('change',renderTable);
  document.getElementById('saveStock').addEventListener('click',saveStock);
  document.getElementById('logoutTop').addEventListener('click',()=>logout());
  document.getElementById('stockTableBody').addEventListener('input',event=>{if(event.target.matches('.stock-qty'))updateRowModel(event.target)});
  window.addEventListener('products:updated',event=>{if(Array.isArray(event.detail))phones=event.detail;renderStats();renderTable()});
  window.addEventListener('accessories:updated',event=>{if(Array.isArray(event.detail))accessories=event.detail;renderStats();renderTable()});
  async function initialize() {
    if(window.ElectrophoneCloud){try{await window.ElectrophoneCloud.loadSharedCatalog()}catch(_){}}
    phones=store.getProducts(); accessories=readArray('electrophone_accessories'); renderStats(); renderTable(); loadAnalytics();
  }
  initialize();
})();
