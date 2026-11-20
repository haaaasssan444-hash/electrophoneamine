(() => {
  if (!window.StoreAuth) return;
  const ownerSession = localStorage.getItem('electrophone_admin_session');
  if (ownerSession !== 'authenticated') {
    location.replace('login.html');
    return;
  }

  const ACCOUNT_KEY = 'electrophone_store_accounts';
  const SALES_KEY = 'electrophone_sales_excel';
  const STOCK_KEY = 'electrophone_stock_excel';
  let accounts = [];
  let sales = [];
  let stock = [];
  let activityAvailable = false;

  async function load() {
    accounts = (() => {
      try {
        const saved = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
        return Array.isArray(saved) ? saved : [];
      } catch (_) { return []; }
    })();
    try {
      if (window.ElectrophoneCloud?.fetchTable) {
        const cloud = await window.ElectrophoneCloud.fetchTable('store_accounts');
        if (Array.isArray(cloud) && cloud.length) {
          const merged = new Map();
          accounts.forEach(account => merged.set(String(account.id), account));
          cloud.forEach(account => merged.set(String(account.id), account));
          accounts = [...merged.values()];
          localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
          await save();
        } else if (accounts.length) {
          await save();
        }
      }
    } catch (_) {}
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    await loadActivity();
  }

  function readLocalRows(key) {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const rows = JSON.parse(saved);
    if (!Array.isArray(rows)) throw new TypeError(`${key} data must be an array.`);
    return rows;
  }

  async function loadActivity() {
    const message = document.getElementById('activityMessage');
    const refreshButton = document.getElementById('refreshWorkerActivity');
    message.dataset.state = 'loading';
    message.textContent = 'Chargement des données de ventes et de stock…';
    if (refreshButton) refreshButton.disabled = true;
    try {
      if (window.ElectrophoneCloud?.fetchTable) {
        const [loadedSales, loadedStock] = await Promise.all([
          window.ElectrophoneCloud.fetchTable('business_sales'),
          window.ElectrophoneCloud.fetchTable('business_stock')
        ]);
        if (!Array.isArray(loadedSales) || !Array.isArray(loadedStock)) {
          throw new TypeError('Cloud sales and stock data must be arrays.');
        }
        sales = loadedSales;
        stock = loadedStock;
        message.textContent = 'Toutes les ventes et tout le stock enregistrés dans le cloud.';
      } else {
        sales = readLocalRows(SALES_KEY);
        stock = readLocalRows(STOCK_KEY);
        message.textContent = 'Les données affichées sont enregistrées uniquement sur cet appareil.';
      }
      activityAvailable = true;
      message.removeAttribute('data-state');
    } catch (error) {
      sales = [];
      stock = [];
      activityAvailable = false;
      message.dataset.state = 'error';
      message.textContent = `Impossible de charger les données de performance : ${error.message || error}`;
      console.warn('Worker activity load failed:', error);
    } finally {
      if (refreshButton) refreshButton.disabled = false;
      render();
    }
  }

  function number(value, fallback) {
    if (value == null || String(value).trim() === '') return fallback || 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : (fallback || 0);
  }

  function belongsToAccount(item, account, isStock) {
    const workerId = isStock ? (item.ownerId || item.workerId) : item.workerId;
    if (workerId != null && String(workerId) !== '') return String(workerId) === String(account.id);
    const workerName = String((isStock ? item.ownerName || item.workerName : item.workerName) || '')
      .trim()
      .toLocaleLowerCase();
    if (!workerName) return false;
    return [account.name, account.username]
      .some(name => String(name || '').trim().toLocaleLowerCase() === workerName);
  }

  function employeeStats(account) {
    const employeeSales = sales.filter(item => belongsToAccount(item, account, false));
    const employeeStock = stock.filter(item =>
      belongsToAccount(item, account, true) && number(item.quantity) > 0
    );
    const products = new Map();
    employeeSales.forEach(item => {
      const name = String(item.product || 'Produit non spécifié').trim() || 'Produit non spécifié';
      const key = name.toLocaleLowerCase();
      const product = products.get(key) || { name, quantity: 0, transactions: 0, total: 0 };
      product.quantity += number(item.quantity, 1);
      product.transactions += 1;
      product.total += number(item.total);
      products.set(key, product);
    });
    return {
      sales: employeeSales,
      stock: employeeStock,
      revenue: employeeSales.reduce((sum, item) => sum + number(item.total), 0),
      unitsSold: employeeSales.reduce((sum, item) => sum + number(item.quantity, 1), 0),
      stockUnits: employeeStock.reduce((sum, item) => sum + number(item.quantity), 0),
      products: [...products.values()].sort((a, b) => b.quantity - a.quantity)
    };
  }

  function money(value) {
    return `${number(value).toLocaleString('fr-MA')} DH`;
  }

  function renderDetails(stats) {
    if (!activityAvailable) return '<div class="empty-state">Les données de performance sont actuellement indisponibles.</div>';
    const soldProducts = stats.products.length
      ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Produit</th><th>Quantité</th><th>Transactions</th><th>Ventes</th></tr></thead><tbody>${stats.products.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>${item.transactions}</td><td><strong>${money(item.total)}</strong></td></tr>`).join('')}</tbody></table></div>`
      : '<div class="empty-state">Aucune vente enregistrée pour cet employé.</div>';
    const stockItems = stats.stock.length
      ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Produit</th><th>Référence</th><th>Quantité</th><th>Prix</th><th>Dernière mise à jour</th></tr></thead><tbody>${stats.stock.map(item => `<tr><td>${escapeHtml(item.product || 'Produit non spécifié')}</td><td>${escapeHtml(item.sku || '—')}</td><td><strong>${number(item.quantity)}</strong></td><td>${money(item.price)}</td><td>${escapeHtml(dateLabel(item.updatedAt))}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="empty-state">Aucun stock actuel enregistré pour cet employé.</div>';
    return `<div class="worker-details-grid">
      <section class="panel"><div class="panel-head"><h3>Produits vendus</h3></div>${soldProducts}</section>
      <section class="panel"><div class="panel-head"><h3>Stock enregistré</h3></div>${stockItems}</section>
    </div>`;
  }

  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-MA');
  }

  async function save() {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    try {
      if (window.ElectrophoneCloud?.saveTable) {
        await window.ElectrophoneCloud.saveTable('store_accounts', accounts);
        document.getElementById('accountsMessage').textContent = 'Compte enregistré ✅';
      } else {
        document.getElementById('accountsMessage').textContent = 'Enregistré uniquement sur cet appareil — activez la connexion cloud.';
      }
    } catch (error) {
      const detail = error?.message || error?.details || error?.hint || String(error || '');
      document.getElementById('accountsMessage').textContent = `Impossible d’enregistrer dans le cloud${detail ? ` : ${detail}` : '.'}`;
      console.warn('Store accounts cloud save failed:', error.message || error);
    }
    render();
  }

  function render() {
    const branches = {
      'branch-1': 'Magasin 1', 'branch-2': 'Magasin 2', 'branch-3': 'Magasin 3',
      'branch-4': 'Magasin 4'
    };
    const summaries = accounts.map(account => ({ account, stats: employeeStats(account) }));
    document.getElementById('activeWorkerCount').textContent = String(accounts.filter(account => account.active !== false).length);
    document.getElementById('workerSalesTotal').textContent = activityAvailable
      ? money(summaries.reduce((sum, item) => sum + item.stats.revenue, 0))
      : '—';
    document.getElementById('workerUnitsSold').textContent = activityAvailable
      ? String(summaries.reduce((sum, item) => sum + item.stats.unitsSold, 0))
      : '—';
    document.getElementById('workerStockUnits').textContent = activityAvailable
      ? String(summaries.reduce((sum, item) => sum + item.stats.stockUnits, 0))
      : '—';
    document.getElementById('accountsRows').innerHTML = summaries.length
      ? summaries.map(({ account, stats }) => {
        const branchId = String(account.branchId || '');
        const unknownBranchOption = branchId && !branches[branchId]
          ? `<option value="${escapeHtml(branchId)}" selected>Autre magasin (${escapeHtml(branchId)})</option>`
          : '';
        return `<tr>
          <td>${escapeHtml(account.username)}</td><td class="worker-account-name">${escapeHtml(account.name)}</td>
          <td>
            <select class="field-select account-branch-select" data-branch="${escapeHtml(account.id)}" aria-label="Magasin de ${escapeHtml(account.name || account.username)}">
              ${unknownBranchOption}${Object.entries(branches).map(([id, name]) => `<option value="${id}" ${branchId === id ? 'selected' : ''}>${name}</option>`).join('')}
            </select>
          </td>
          <td>${activityAvailable ? stats.sales.length : '—'}</td>
          <td><strong>${activityAvailable ? money(stats.revenue) : '—'}</strong></td>
          <td>${activityAvailable ? stats.unitsSold : '—'}</td>
          <td>${activityAvailable ? stats.stockUnits : '—'}</td>
          <td><span class="status-badge ${account.active === false ? 'danger' : ''}">${account.active === false ? 'Suspendu' : 'Actif'}</span></td>
          <td><div class="worker-row-actions">
            <button class="secondary-button" type="button" data-details="${escapeHtml(account.id)}" aria-expanded="false">Détails</button>
            <button class="secondary-button" type="button" data-toggle="${escapeHtml(account.id)}">${account.active === false ? 'Activer' : 'Désactiver'}</button>
            <button class="secondary-button" type="button" data-reset="${escapeHtml(account.id)}">Modifier le mot de passe</button>
            <button class="secondary-button danger-button" type="button" data-delete="${escapeHtml(account.id)}">Supprimer le compte</button>
          </div></td>
        </tr>
        <tr class="worker-details-row" data-details-row="${escapeHtml(account.id)}" hidden><td colspan="9">${renderDetails(stats)}</td></tr>`;
      }).join('')
      : '<tr><td colspan="9"><div class="empty-state">Aucun compte employé.</div></td></tr>';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  document.getElementById('accountForm').addEventListener('submit', async event => {
    event.preventDefault();
    const username = document.getElementById('accountUsername').value.trim().toLowerCase();
    if (!username) return;
    if (accounts.some(account => String(account.username).toLowerCase() === username)) {
      document.getElementById('accountsMessage').textContent = 'Ce nom d’utilisateur existe déjà.';
      return;
    }
    const password = document.getElementById('accountPassword').value;
    const credentials = await window.StoreAuth.hashPassword(password);
    accounts.push({
      id: `worker-${Date.now()}`,
      username,
      name: document.getElementById('accountName').value.trim(),
      branchId: document.getElementById('accountBranch').value,
      role: 'worker',
      active: true,
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash
    });
    await save();
    document.getElementById('accountForm').reset();
  });

  document.getElementById('accountsRows').addEventListener('change', async event => {
    const select = event.target.closest('[data-branch]');
    if (!select) return;
    const account = accounts.find(item => String(item.id) === String(select.dataset.branch));
    if (!account) return;
    account.branchId = select.value;
    await save();
  });

  document.getElementById('accountsRows').addEventListener('click', async event => {
    const detailsButton = event.target.closest('[data-details]');
    const toggleButton = event.target.closest('[data-toggle]');
    const resetButton = event.target.closest('[data-reset]');
    const deleteButton = event.target.closest('[data-delete]');
    if (detailsButton) {
      const accountId = String(detailsButton.dataset.details);
      const detailsRow = [...document.querySelectorAll('[data-details-row]')]
        .find(row => String(row.dataset.detailsRow) === accountId);
      if (!detailsRow) return;
      detailsRow.hidden = !detailsRow.hidden;
      detailsButton.setAttribute('aria-expanded', String(!detailsRow.hidden));
      detailsButton.textContent = detailsRow.hidden ? 'Détails' : 'Masquer les détails';
      return;
    }
    if (!toggleButton && !resetButton && !deleteButton) return;
    const id = toggleButton?.dataset.toggle || resetButton?.dataset.reset || deleteButton?.dataset.delete;
    const account = accounts.find(item => String(item.id) === String(id));
    if (!account) return;
    if (deleteButton) {
      if (!confirm(`Supprimer définitivement le compte de l’employé « ${account.name || account.username} » ?`)) return;
      accounts = accounts.filter(item => String(item.id) !== String(id));
      await save();
      return;
    }
    if (toggleButton) {
      account.active = account.active === false;
      await save();
      return;
    }
    const password = prompt(`Nouveau mot de passe pour ${account.name || account.username} :`);
    if (!password || password.trim().length < 4) return;
    const credentials = await window.StoreAuth.hashPassword(password.trim());
    account.passwordSalt = credentials.salt;
    account.passwordHash = credentials.hash;
    await save();
  });

  document.getElementById('ownerLogout').addEventListener('click', () => {
    localStorage.removeItem('electrophone_admin_session');
    location.replace('login.html');
  });
  document.getElementById('syncAccounts')?.addEventListener('click', async () => {
    const message = document.getElementById('accountsMessage');
    try {
      if (!window.ElectrophoneCloud?.saveTable) throw new Error('La connexion cloud est indisponible.');
      await window.ElectrophoneCloud.saveTable('store_accounts', accounts);
      const cloud = await window.ElectrophoneCloud.fetchTable('store_accounts');
      if (Array.isArray(cloud)) {
        accounts = cloud;
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
        message.textContent = `Synchronisation terminée ✅ (${accounts.length} comptes)`;
      }
      render();
    } catch (error) {
      const detail = error?.message || error?.details || error?.hint || String(error || '');
      message.textContent = `Impossible de se connecter au cloud${detail ? ` : ${detail}` : '.'}`;
      console.warn('Worker account sync failed:', error.message || error);
    }
  });
  document.getElementById('refreshWorkerActivity')?.addEventListener('click', loadActivity);
  load();
})();
