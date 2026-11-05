(() => {
  let session = window.StoreAuth.getSession();
  const loginGate = document.getElementById('workstationLoginGate');
  if (!session?.branchId && loginGate) loginGate.hidden = false;
  else if (loginGate) loginGate.hidden = true;
  const SALES_KEY = 'electrophone_sales_excel';
  const STOCK_KEY = 'electrophone_stock_excel';
  let sales = [];
  let stock = [];
  const money = value => `${Number(value || 0).toLocaleString('ar-MA')} DH`;

  function readSales() {
    try {
      const saved = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) { return []; }
  }

  function readStock() {
    try {
      const saved = JSON.parse(localStorage.getItem(STOCK_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) { return []; }
  }

  async function loadSales() {
    sales = readSales();
    stock = readStock();
    render();
    try {
      if (window.ElectrophoneCloud?.fetchTable) {
        const cloudSalesPromise = window.ElectrophoneCloud.fetchTable('business_sales');
        const cloudStockPromise = window.ElectrophoneCloud.fetchTable('business_stock');
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 3000));
        const cloudSales = await Promise.race([cloudSalesPromise, timeoutPromise]);
        const cloudStock = await Promise.race([cloudStockPromise, timeoutPromise]);
        if (cloudSales?.length || !sales.length) sales = cloudSales || sales;
        if (cloudStock?.length || !stock.length) stock = cloudStock || stock;
      }
    } catch (_) {}
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
    render();
  }

  async function saveSales() {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    if (window.ElectrophoneCloud?.saveTable) {
      try { await window.ElectrophoneCloud.saveTable('business_sales', sales); } catch (_) {}
    }
    render();
  }

  async function saveStock() {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
    if (window.ElectrophoneCloud?.saveTable) {
      try { await window.ElectrophoneCloud.saveTable('business_stock', stock); } catch (_) {}
    }
    render();
  }

  function render() {
    document.getElementById('storeTitle').textContent = session?.name || session?.username ? `مبيعات ${session.name || session.username}` : 'مبيعات المحل';
    const branchSales = session?.branchId
      ? sales.filter(item => String(item.branchId) === String(session.branchId))
      : [];
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todaySales = branchSales.filter(item => String(item.date || '').startsWith(today));
    const month = today.slice(0, 7);
    const monthSales = branchSales.filter(item => String(item.date || '').startsWith(month));
    document.getElementById('todaySales').textContent = money(todaySales.reduce((sum, item) => sum + Number(item.total || 0), 0));
    document.getElementById('todayCount').textContent = String(todaySales.length);
    document.getElementById('monthSales').textContent = money(monthSales.reduce((sum, item) => sum + Number(item.total || 0), 0));
    document.getElementById('storeSalesRows').innerHTML = branchSales.length
      ? [...branchSales].reverse().map(item => `<tr>
          <td>${item.date ? String(item.date).replace('T', ' ') : ''}</td><td>${escapeHtml(item.product)}</td><td>${escapeHtml(item.quantity || 1)}</td>
          <td><strong>${money(item.total)}</strong></td><td>${escapeHtml(item.payment)}</td><td>${escapeHtml(item.customer)}</td>
          <td><button type="button" class="row-actions delete" data-sale-delete="${escapeHtml(item.id)}" style="border:0;border-radius:7px;background:#fee2e2;color:#991b1b;padding:5px 8px">حذف</button></td>
        </tr>`).join('')
      : '<tr><td colspan="7"><div class="empty-state">لا توجد مبيعات مسجلة لهذا المحل</div></td></tr>';
    const branchStock = session?.branchId
      ? stock.filter(item => String(item.branchId) === String(session.branchId))
      : [];
    const stockRows = document.getElementById('storeStockRows');
    if (stockRows) {
      stockRows.innerHTML = branchStock.length
        ? branchStock.map(item => `<tr><td>${escapeHtml(item.product)}</td><td>${escapeHtml(item.sku)}</td><td><strong>${Number(item.quantity || 0)}</strong></td><td>${money(item.price)}</td><td>${Number(item.quantity || 0) > 0 ? 'متوفر' : 'نفد'}</td></tr>`).join('')
        : '<tr><td colspan="5"><div class="empty-state">لم يتم إدخال مخزون لهذا المحل بعد</div></td></tr>';
    }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  document.getElementById('saleDate').value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  document.getElementById('saveSale').addEventListener('click', async () => {
    if (!session?.branchId) {
      loginGate.hidden = false;
      document.getElementById('workstationLoginError').textContent = 'سجل الدخول أولاً قبل حفظ البيع.';
      return;
    }
    const form = document.getElementById('saleForm');
    if (!form.reportValidity()) return;
    const sale = {
      id: `sale-${Date.now()}`,
      date: document.getElementById('saleDate').value,
      branchId: session.branchId,
      product: document.getElementById('saleProduct').value.trim(),
      quantity: Number(document.getElementById('saleQuantity').value || 1),
      total: Number(document.getElementById('saleTotal').value || 0),
      payment: document.getElementById('salePayment').value,
      customer: document.getElementById('saleCustomer').value.trim(),
      notes: document.getElementById('saleNotes').value.trim(),
      workerId: session.id,
      workerName: session.name
    };
    sales.push(sale);
    const matchingStock = stock.find(item =>
      String(item.branchId) === String(session.branchId) &&
      String(item.product).trim().toLowerCase() === String(sale.product).trim().toLowerCase()
    );
    if (matchingStock) {
      matchingStock.quantity = Math.max(0, Number(matchingStock.quantity || 0) - sale.quantity);
      matchingStock.updatedAt = sale.date;
      matchingStock.workerName = session.name;
      await saveStock();
    }
    await saveSales();
    document.getElementById('saleProduct').value = '';
    document.getElementById('saleQuantity').value = '1';
    document.getElementById('saleTotal').value = '';
    document.getElementById('saleCustomer').value = '';
    document.getElementById('saleNotes').value = '';
    document.getElementById('saleDate').value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  document.getElementById('saveStock').addEventListener('click', async () => {
    if (!session?.branchId) {
      loginGate.hidden = false;
      document.getElementById('workstationLoginError').textContent = 'سجل الدخول أولاً قبل تعديل المخزون.';
      return;
    }
    const product = document.getElementById('stockProduct').value.trim();
    const quantity = Number(document.getElementById('stockQuantity').value);
    if (!product || !Number.isFinite(quantity) || quantity < 0) return;
    const sku = document.getElementById('stockSku').value.trim();
    const price = Number(document.getElementById('stockPrice').value || 0);
    const existing = stock.find(item =>
      String(item.branchId) === String(session.branchId) &&
      (sku ? String(item.sku || '').toLowerCase() === sku.toLowerCase() : String(item.product || '').toLowerCase() === product.toLowerCase())
    );
    if (existing) {
      existing.product = product;
      existing.sku = sku;
      existing.quantity = quantity;
      existing.price = price;
      existing.updatedAt = new Date().toISOString();
      existing.workerName = session.name;
    } else {
      stock.push({
        id: `stock-${session.branchId}-${Date.now()}`,
        branchId: session.branchId,
        product,
        sku,
        quantity,
        price,
        updatedAt: new Date().toISOString(),
        workerName: session.name
      });
    }
    await saveStock();
    document.getElementById('stockForm').reset();
  });

  document.getElementById('storeSalesRows').addEventListener('click', async event => {
    const button = event.target.closest('[data-sale-delete]');
    if (!button) return;
    const item = sales.find(sale => String(sale.id) === String(button.dataset.saleDelete));
    if (!item || String(item.branchId) !== String(session.branchId)) return;
    if (!confirm('حذف عملية البيع؟')) return;
    sales = sales.filter(sale => String(sale.id) !== String(button.dataset.saleDelete));
    await saveSales();
  });
  document.getElementById('workstationLoginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const error = document.getElementById('workstationLoginError');
    error.textContent = '';
    try {
      const authenticated = await window.StoreAuth.loginWorker(
        document.getElementById('workstationUsername').value,
        document.getElementById('workstationPassword').value
      );
      if (!authenticated) {
        error.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        return;
      }
      session = authenticated;
      loginGate.hidden = true;
      document.getElementById('workstationUsername').value = '';
      document.getElementById('workstationPassword').value = '';
      await loadSales();
    } catch (exception) {
      error.textContent = exception.message || 'تعذر تسجيل الدخول.';
    }
  });
  document.getElementById('workerLogout').addEventListener('click', window.StoreAuth.logoutWorker);
  loadSales();
})();
