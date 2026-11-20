(() => {
  const state = { sales: [], stock: [], branches: [] };
  const defaultBranches = Array.from({ length: 4 }, (_, index) => ({
    id: `branch-${index + 1}`,
    name: `Magasin ${index + 1}`
  }));
  const $ = id => document.getElementById(id);
  const number = value => {
    const result = Number(value || 0);
    return Number.isFinite(result) ? result : 0;
  };
  const money = value => `${Math.round(number(value)).toLocaleString('fr-MA')} DH`;
  const text = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const branchLabel = id => {
    const branch = state.branches.find(item => String(item.id) === String(id))
      || defaultBranches.find(item => String(item.id) === String(id));
    return branch?.name || (id ? `Magasin ${String(id).replace(/^branch-/, '')}` : 'Non spécifié');
  };
  const workerId = item => String(item.workerId || item.ownerId || '');
  const workerName = item => String(item.workerName || item.ownerName || 'Non spécifié');
  const productName = item => String(item.product || 'Produit non spécifié');

  function setStatus(message, error) {
    const status = $('managerStatus');
    status.textContent = message;
    status.dataset.state = error ? 'error' : 'ready';
  }

  function withTimeout(promise, milliseconds, message) {
    let timer;
    return Promise.race([
      promise,
      new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error(message)), milliseconds);
      })
    ]).finally(() => clearTimeout(timer));
  }

  function visibleSales() {
    const from = $('filterFrom').value;
    const to = $('filterTo').value;
    const branch = $('filterBranch').value;
    const worker = $('filterWorker').value;
    const query = $('filterProduct').value.trim().toLocaleLowerCase();
    return state.sales.filter(item => {
      const date = String(item.date || '').slice(0, 10);
      const matchesDate = (!from || (date && date >= from)) && (!to || (date && date <= to));
      const matchesBranch = branch === 'all' || String(item.branchId || '') === branch;
      const matchesWorker = worker === 'all' || workerId(item) === worker || workerName(item) === worker;
      const matchesProduct = !query || productName(item).toLocaleLowerCase().includes(query);
      return matchesDate && matchesBranch && matchesWorker && matchesProduct;
    });
  }

  function visibleStock() {
    const branch = $('filterBranch').value;
    const worker = $('filterWorker').value;
    const query = $('filterProduct').value.trim().toLocaleLowerCase();
    return state.stock.filter(item => {
      const matchesBranch = branch === 'all' || String(item.branchId || '') === branch;
      const matchesWorker = worker === 'all' || workerId(item) === worker || workerName(item) === worker;
      const matchesProduct = !query || productName(item).toLocaleLowerCase().includes(query);
      return matchesBranch && matchesWorker && matchesProduct;
    });
  }

  function renderFilters() {
    const branchSelect = $('filterBranch');
    const workerSelect = $('filterWorker');
    const previousBranch = branchSelect.value;
    const previousWorker = workerSelect.value;
    const branches = new Map(defaultBranches.map(branch => [String(branch.id), branch.name]));
    [...state.sales, ...state.stock].forEach(item => {
      if (item.branchId && branches.has(String(item.branchId))) {
        branches.set(String(item.branchId), branchLabel(item.branchId));
      }
    });
    state.branches.filter(branch => defaultBranches.some(item => String(item.id) === String(branch.id)))
      .forEach(branch => branches.set(String(branch.id), branch.name || branchLabel(branch.id)));
    branchSelect.innerHTML = '<option value="all">Tous les magasins</option>' +
      [...branches.entries()].sort((a, b) => a[1].localeCompare(b[1], 'ar'))
        .map(([id, name]) => `<option value="${text(id)}">${text(name)}</option>`).join('');
    const workers = new Map();
    [...state.sales, ...state.stock].forEach(item => {
      const id = workerId(item);
      const name = workerName(item);
      if (id || name !== 'Non spécifié') workers.set(id || name, name);
    });
    workerSelect.innerHTML = '<option value="all">Tous les employés</option>' +
      [...workers.entries()].sort((a, b) => a[1].localeCompare(b[1], 'ar'))
        .map(([id, name]) => `<option value="${text(id)}">${text(name)}</option>`).join('');
    if ([...branchSelect.options].some(option => option.value === previousBranch)) branchSelect.value = previousBranch;
    if ([...workerSelect.options].some(option => option.value === previousWorker)) workerSelect.value = previousWorker;
  }

  function render() {
    const sales = visibleSales();
    const stock = visibleStock();
    const total = sales.reduce((sum, item) => sum + number(item.total), 0);
    const sold = sales.reduce((sum, item) => sum + number(item.quantity || 1), 0);
    const units = stock.reduce((sum, item) => sum + Math.max(0, number(item.quantity)), 0);
    $('managerSalesTotal').textContent = money(total);
    $('managerSalesCount').textContent = String(sales.length);
    $('managerSoldUnits').textContent = String(sold);
    $('managerStockUnits').textContent = String(units);
    $('managerOutCount').textContent = String(stock.filter(item => number(item.quantity) <= 0).length);

    const products = new Map();
    sales.forEach(item => {
      const name = productName(item);
      const key = name.toLocaleLowerCase();
      const summary = products.get(key) || { name, quantity: 0, count: 0, total: 0 };
      summary.quantity += number(item.quantity || 1);
      summary.count += 1;
      summary.total += number(item.total);
      products.set(key, summary);
    });
    const productRows = [...products.values()].sort((a, b) => b.quantity - a.quantity);
    $('managerProductsRows').innerHTML = productRows.length
      ? productRows.map(item => `<tr><td><strong>${text(item.name)}</strong></td><td>${item.quantity}</td><td>${item.count}</td><td>${money(item.total)}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty-state">Aucune vente ne correspond à ces filtres.</td></tr>';

    const sortedSales = [...sales].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    $('managerSalesRows').innerHTML = sortedSales.length
      ? sortedSales.map(item => `<tr>
          <td>${text(String(item.date || '').replace('T', ' '))}</td>
          <td>${text(branchLabel(item.branchId))}</td><td>${text(productName(item))}</td>
          <td>${number(item.quantity || 1)}</td><td><strong>${money(item.total)}</strong></td>
          <td>${text(item.payment || '')}</td><td>${text(item.customer || '')}</td>
          <td>${text(workerName(item))}</td><td>${text(item.notes || '')}</td>
        </tr>`).join('')
      : '<tr><td colspan="9" class="empty-state">Aucune vente ne correspond à ces filtres.</td></tr>';

    const sortedStock = [...stock].sort((a, b) =>
      branchLabel(a.branchId).localeCompare(branchLabel(b.branchId), 'ar') || productName(a).localeCompare(productName(b), 'ar')
    );
    $('managerStockRows').innerHTML = sortedStock.length
      ? sortedStock.map(item => {
          const quantity = number(item.quantity);
          const stateClass = quantity <= 0 ? 'out' : quantity <= 2 ? 'low' : 'available';
          const label = quantity <= 0 ? 'Épuisé' : quantity <= 2 ? 'Faible' : 'Disponible';
          return `<tr>
            <td>${text(branchLabel(item.branchId))}</td><td><strong>${text(productName(item))}</strong></td>
            <td>${text(item.sku || '')}</td><td>${quantity}</td><td>${money(item.price)}</td>
            <td>${money(Math.max(0, quantity) * number(item.price))}</td>
            <td><span class="status-badge ${stateClass}">${label}</span></td>
            <td>${text(workerName(item))}</td><td>${text(item.updatedAt || '')}</td>
          </tr>`;
        }).join('')
      : '<tr><td colspan="9" class="empty-state">Aucun stock ne correspond à ces filtres.</td></tr>';
  }

  async function load() {
    const button = $('refreshManager');
    button.disabled = true;
    setStatus('Chargement des ventes et du stock depuis le cloud…', false);
    try {
      if (!window.ElectrophoneCloud?.fetchTable) throw new Error('Le service cloud est indisponible.');
      const [sales, stock] = await withTimeout(Promise.all([
        window.ElectrophoneCloud.fetchTable('business_sales'),
        window.ElectrophoneCloud.fetchTable('business_stock')
      ]), 12000, 'Le délai de chargement des données est dépassé.');
      if (!Array.isArray(sales) || !Array.isArray(stock)) {
        throw new TypeError('Les données cloud sont invalides.');
      }
      state.sales = sales;
      state.stock = stock;
      let branchWarning = '';
      try {
        const branches = await withTimeout(
          window.ElectrophoneCloud.fetchTable('business_branches'),
          4000,
          'Le délai de chargement des magasins est dépassé.'
        );
        if (Array.isArray(branches)) state.branches = branches;
      } catch (error) {
        state.branches = [];
        branchWarning = ' Impossible de charger les noms des magasins ; leurs identifiants sont affichés.';
        console.warn('Manager branch labels unavailable:', error.message || error);
      }
      renderFilters();
      render();
      setStatus(`Données actualisées depuis le cloud · ${new Date().toLocaleString('fr-MA')}${branchWarning}`, false);
    } catch (error) {
      setStatus(`Impossible de charger les données cloud : ${error.message || error}. Vérifiez la connexion et les paramètres Supabase.`, true);
    } finally {
      button.disabled = false;
    }
  }

  ['filterFrom', 'filterTo', 'filterBranch', 'filterWorker', 'filterProduct'].forEach(id => {
    $(id).addEventListener('input', render);
    $(id).addEventListener('change', render);
  });
  $('refreshManager').addEventListener('click', load);
  $('logoutTop').addEventListener('click', () => logout());
  load();
})();
