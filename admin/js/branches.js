(() => {
  const schemas = {
    branches: {
      title: 'المحلات', table: 'business_branches',
      columns: [
        ['name', 'اسم المحل'], ['city', 'المدينة'], ['address', 'العنوان'],
        ['phone', 'الهاتف'], ['status', 'الحالة (نشط/موقوف)']
      ]
    },
    sales: {
      title: 'المبيعات', table: 'business_sales',
      columns: [
        ['date', 'التاريخ'], ['branchId', 'المحل'], ['customer', 'العميل'],
        ['product', 'المنتج'], ['quantity', 'الكمية'], ['total', 'المبلغ DH'],
        ['payment', 'الدفع (نقدا/تحويل/بطاقة)']
      ]
    },
    stock: {
      title: 'المخزون', table: 'business_stock',
      columns: [
        ['branchId', 'المحل'], ['product', 'المنتج'], ['sku', 'المرجع'],
        ['quantity', 'الكمية'], ['cost', 'سعر التكلفة'], ['price', 'سعر البيع']
      ]
    },
    customers: {
      title: 'العملاء', table: 'business_customers',
      columns: [['name', 'اسم العميل'], ['phone', 'الهاتف'], ['branchId', 'المحل'], ['notes', 'ملاحظات']]
    },
    suppliers: {
      title: 'الموردون', table: 'business_suppliers',
      columns: [['name', 'اسم المورد'], ['company', 'الشركة'], ['phone', 'الهاتف'], ['balance', 'الرصيد DH'], ['notes', 'ملاحظات']]
    },
    expenses: {
      title: 'المصاريف', table: 'business_expenses',
      columns: [
        ['date', 'التاريخ'], ['branchId', 'المحل'], ['category', 'التصنيف'],
        ['description', 'البيان'], ['amount', 'المبلغ DH']
      ]
    },
    employees: {
      title: 'الموظفون', table: 'business_employees',
      columns: [
        ['name', 'اسم الموظف'], ['phone', 'الهاتف'], ['branchId', 'المحل'],
        ['role', 'الدور'], ['salary', 'الراتب DH'], ['status', 'الحالة']
      ]
    }
  };

  const localKeys = Object.fromEntries(Object.entries(schemas).map(([key, value]) => [key, `electrophone_${key}_excel`]));
  const state = {};
  let currentSection = 'overview';
  let selectedCell = null;
  let saveTimer;
  const content = document.getElementById('sectionContent');
  const title = document.getElementById('sectionTitle');
  const number = value => {
    const result = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(result) ? result : 0;
  };
  const money = value => `${number(value).toLocaleString('ar-MA')} DH`;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function readLocal(section) {
    try {
      const saved = JSON.parse(localStorage.getItem(localKeys[section]) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) { return []; }
  }

  async function loadSection(section) {
    let items = readLocal(section);
    try {
      if (window.ElectrophoneCloud?.fetchTable) {
        const cloud = await window.ElectrophoneCloud.fetchTable(schemas[section].table);
        if (cloud.length || !items.length) items = cloud;
      }
    } catch (error) {
      console.warn(`تعذر تحميل ${schemas[section].title}:`, error.message || error);
    }
    state[section] = items;
    localStorage.setItem(localKeys[section], JSON.stringify(items));
  }

  async function saveSection(section) {
    localStorage.setItem(localKeys[section], JSON.stringify(state[section]));
    try {
      if (window.ElectrophoneCloud?.saveTable) await window.ElectrophoneCloud.saveTable(schemas[section].table, state[section]);
    } catch (error) {
      console.warn(`تم الحفظ محلياً فقط:`, error.message || error);
    }
  }

  function branchName(id) {
    const branch = (state.branches || []).find(item => String(item.id) === String(id));
    return branch?.name || String(id || '');
  }

  function branchChoices() {
    const items = state.branches || [];
    return `<option value="">غير محدد</option>${items.map(branch => `<option value="${escapeHtml(branch.id)}">${escapeHtml(branch.name)}</option>`).join('')}`;
  }

  function seedBranches() {
    if ((state.branches || []).length) return;
    state.branches = Array.from({ length: 7 }, (_, index) => ({
      id: `branch-${index + 1}`,
      name: `المحل ${index + 1}`,
      city: 'الدار البيضاء',
      address: '',
      phone: '',
      status: 'نشط'
    }));
    localStorage.setItem(localKeys.branches, JSON.stringify(state.branches));
    saveSection('branches');
  }

  function displayValue(section, key, value) {
    if (key === 'branchId') return branchName(value);
    if (['total', 'amount', 'cost', 'price', 'salary', 'balance'].includes(key)) return money(value);
    return String(value ?? '');
  }

  function normalizedCell(section, key, value, originalId) {
    let result = String(value ?? '').trim();
    if (key === 'branchId') {
      const branch = (state.branches || []).find(item => item.name === result);
      if (branch) result = branch.id;
    }
    if (['total', 'amount', 'cost', 'price', 'salary', 'balance', 'quantity'].includes(key)) result = number(result);
    return { key, result, originalId };
  }

  function renderExcel(section) {
    const schema = schemas[section];
    const rows = state[section] || [];
    const columnCount = schema.columns.length;
    content.innerHTML = `
      <div class="metric-grid" id="excelMetrics"></div>
      <div class="excel-panel">
        <div class="excel-toolbar"><span id="excelCellName" class="excel-cell-name">A1</span><input id="excelFormula" class="excel-formula" type="text" aria-label="محتوى الخلية"></div>
        <div class="excel-scroll"><table class="excel-table"><thead><tr><th></th>${schema.columns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join('')}<th>حذف</th></tr></thead><tbody id="excelBody"></tbody></table></div>
      </div>`;
    renderRows(section);
    updateMetrics(section);
    setupExcelFormula(section);
  }

  function setupExcelFormula(section) {
    const formula = document.getElementById('excelFormula');
    if (!formula) return;
    formula.oninput = () => {
      if (!selectedCell) return;
      selectedCell.textContent = formula.value;
      selectedCell.dataset.raw = formula.value;
      scheduleSave(section);
    };
  }

  function renderRows(section) {
    const schema = schemas[section];
    const body = document.getElementById('excelBody');
    if (!body) return;
    const rows = state[section] || [];
    body.innerHTML = rows.map((item, rowIndex) => `
      <tr>
        <th>${rowIndex + 1}</th>
        ${schema.columns.map(([key], columnIndex) => `<td><div class="excel-cell" contenteditable="true" spellcheck="false" data-row="${rowIndex}" data-key="${key}" data-column="${columnIndex}" aria-label="${escapeHtml(schema.columns[columnIndex][1])}">${escapeHtml(displayValue(section, key, item[key]))}</div></td>`).join('')}
        <td class="excel-row-delete"><button type="button" data-delete-row="${rowIndex}" aria-label="حذف السطر">×</button></td>
      </tr>`).join('') || '<tr><td colspan="100"><div class="empty-state">أضف سطراً جديداً من زر + سطر</div></td></tr>';
  }

  function updateMetrics(section) {
    const metrics = document.getElementById('excelMetrics');
    if (!metrics) return;
    const sales = state.sales || [];
    const expenses = state.expenses || [];
    const stock = state.stock || [];
    const employees = state.employees || [];
    if (section === 'sales') {
      const total = sales.reduce((sum, item) => sum + number(item.total), 0);
      metrics.innerHTML = `<article class="metric-card"><span>عدد العمليات</span><strong>${sales.length}</strong></article><article class="metric-card"><span>إجمالي المبيعات</span><strong>${money(total)}</strong></article>`;
    } else if (section === 'expenses') {
      const total = expenses.reduce((sum, item) => sum + number(item.amount), 0);
      metrics.innerHTML = `<article class="metric-card"><span>عدد المصاريف</span><strong>${expenses.length}</strong></article><article class="metric-card"><span>إجمالي المصاريف</span><strong>${money(total)}</strong></article>`;
    } else if (section === 'stock') {
      const units = stock.reduce((sum, item) => sum + number(item.quantity), 0);
      metrics.innerHTML = `<article class="metric-card"><span>عدد المنتجات</span><strong>${stock.length}</strong></article><article class="metric-card"><span>إجمالي الوحدات</span><strong>${units}</strong></article>`;
    } else if (section === 'employees') {
      const salaries = employees.reduce((sum, item) => sum + number(item.salary), 0);
      metrics.innerHTML = `<article class="metric-card"><span>عدد الموظفين</span><strong>${employees.length}</strong></article><article class="metric-card"><span>كتلة الرواتب</span><strong>${money(salaries)}</strong></article>`;
    } else {
      const count = (state[section] || []).length;
      metrics.innerHTML = `<article class="metric-card"><span>عدد السجلات</span><strong>${count}</strong></article>`;
    }
  }

  function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    cell.classList.add('selected');
    const td = cell.closest('td');
    const row = td.parentElement;
    const columnIndex = [...row.children].indexOf(td);
    const rowIndex = Number(cell.dataset.row) + 1;
    document.getElementById('excelCellName').textContent = `${columnName(columnIndex)}${rowIndex}`;
    document.getElementById('excelFormula').value = cell.dataset.raw ?? cell.textContent;
  }

  function columnName(index) {
    let value = index;
    let result = '';
    while (value > 0) {
      result = String.fromCharCode(65 + (value - 1) % 26) + result;
      value = Math.floor((value - 1) / 26);
    }
    return result;
  }

  function renderOverview() {
    const sales = state.sales || [];
    const expenses = state.expenses || [];
    const stock = state.stock || [];
    const branches = state.branches || [];
    const totalSales = sales.reduce((sum, item) => sum + number(item.total), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + number(item.amount), 0);
    const units = stock.reduce((sum, item) => sum + number(item.quantity), 0);
    title.textContent = 'نظرة عامة';
    content.innerHTML = `
      <div class="metric-grid">
        <article class="metric-card"><span>المحلات</span><strong>${branches.length}</strong><small>المحلات المسجلة</small></article>
        <article class="metric-card"><span>المبيعات</span><strong>${money(totalSales)}</strong><small>${sales.length} عملية</small></article>
        <article class="metric-card"><span>المخزون</span><strong>${units}</strong><small>وحدة متوفرة</small></article>
        <article class="metric-card"><span>الصافي</span><strong>${money(totalSales - totalExpenses)}</strong><small>بعد المصاريف المسجلة</small></article>
      </div>
      <div class="panel"><div class="panel-head"><h2>المبيعات والمخزون حسب المحل</h2></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>المحل</th><th>المبيعات</th><th>المخزون</th><th>المصاريف</th><th>الصافي</th></tr></thead><tbody>${branches.map(branch => {
        const id = String(branch.id);
        const branchSales = sales.filter(item => String(item.branchId) === id).reduce((sum, item) => sum + number(item.total), 0);
        const branchExpenses = expenses.filter(item => String(item.branchId) === id).reduce((sum, item) => sum + number(item.amount), 0);
        const branchUnits = stock.filter(item => String(item.branchId) === id).reduce((sum, item) => sum + number(item.quantity), 0);
        return `<tr><td>${escapeHtml(branch.name)}</td><td>${money(branchSales)}</td><td><strong>${branchUnits}</strong> وحدة</td><td>${money(branchExpenses)}</td><td><strong>${money(branchSales - branchExpenses)}</strong></td></tr>`;
      }).join('')}</tbody></table></div></div>`;
  }

  function renderReports() {
    title.textContent = 'التقارير';
    const sales = state.sales || [];
    const expenses = state.expenses || [];
    const stock = state.stock || [];
    const totalSales = sales.reduce((sum, item) => sum + number(item.total), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + number(item.amount), 0);
    const daily = {};
    sales.forEach(item => {
      const key = String(item.date || '').slice(0, 10) || 'غير محدد';
      daily[key] = (daily[key] || 0) + number(item.total);
    });
    const branchNames = Object.fromEntries((state.branches || []).map(branch => [String(branch.id), branch.name]));
    content.innerHTML = `
      <div class="metric-grid">
        <article class="metric-card"><span>إجمالي المبيعات</span><strong>${money(totalSales)}</strong></article>
        <article class="metric-card"><span>إجمالي المصاريف</span><strong>${money(totalExpenses)}</strong></article>
        <article class="metric-card"><span>صافي النتيجة</span><strong>${money(totalSales - totalExpenses)}</strong></article>
        <article class="metric-card"><span>عدد العمليات</span><strong>${sales.length}</strong></article>
      </div>
      <div class="report-grid">
      <div class="panel"><div class="panel-head"><h2>أداء المحلات</h2></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>المحل</th><th>المبيعات</th></tr></thead><tbody>${(state.branches || []).map(branch => {
        const branchSales = sales.filter(item => String(item.branchId) === String(branch.id)).reduce((sum, item) => sum + number(item.total), 0);
        return `<tr><td>${escapeHtml(branch.name)}</td><td>${money(branchSales)}</td></tr>`;
      }).join('')}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><h2>المبيعات اليومية</h2></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>اليوم</th><th>المبيعات</th><th>عدد العمليات</th></tr></thead><tbody>${Object.entries(daily).sort((a,b) => b[0].localeCompare(a[0])).map(([date,total]) => `<tr><td>${escapeHtml(date)}</td><td>${money(total)}</td><td>${sales.filter(item => String(item.date || '').slice(0,10) === date).length}</td></tr>`).join('') || '<tr><td colspan="3">لا توجد مبيعات</td></tr>'}</tbody></table></div></div>
      <div class="panel"><div class="panel-head"><h2>المخزون حسب المحل والمنتج</h2></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>المحل</th><th>المنتج</th><th>المرجع</th><th>الكمية</th><th>آخر عامل</th></tr></thead><tbody>${stock.map(item => `<tr><td>${escapeHtml(branchNames[String(item.branchId)] || item.branchId)}</td><td>${escapeHtml(item.product)}</td><td>${escapeHtml(item.sku)}</td><td><strong>${Number(item.quantity || 0)}</strong></td><td>${escapeHtml(item.workerName)}</td></tr>`).join('') || '<tr><td colspan="5">لا يوجد مخزون مسجل</td></tr>'}</tbody></table></div></div>
      </div>`;
  }

  async function renderSection(section) {
    currentSection = section;
    title.textContent = section === 'reports' ? 'التقارير' : section === 'overview' ? 'نظرة عامة' : schemas[section].title;
    const headingActions = document.querySelector('.heading-actions');
    if (headingActions) headingActions.hidden = !['sales', 'stock'].includes(section);
    if (section === 'overview') renderOverview();
    else if (section === 'reports') renderReports();
    else renderExcel(section);
  }

  function scheduleSave(section) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveSection(section), 400);
  }

  function bindExcel(section) {
    const formula = document.getElementById('excelFormula');
    content.addEventListener('mousedown', excelEventHandler, { once: false });
    content.addEventListener('input', excelInputHandler, { once: false });
    formula?.addEventListener('input', () => {
      if (!selectedCell) return;
      selectedCell.textContent = formula.value;
      selectedCell.dataset.raw = formula.value;
      scheduleSave(section);
    });
  }

  function excelEventHandler(event) {
    const cell = event.target.closest('.excel-cell');
    if (cell) selectCell(cell);
    const deleteButton = event.target.closest('[data-delete-row]');
    if (deleteButton && schemas[currentSection]) {
      if (!confirm('حذف هذا السطر؟')) return;
      state[currentSection].splice(Number(deleteButton.dataset.deleteRow), 1);
      saveSection(currentSection);
      renderRows(currentSection);
      updateMetrics(currentSection);
    }
  }

  function excelInputHandler(event) {
    const cell = event.target.closest('.excel-cell');
    if (!cell || !schemas[currentSection]) return;
    const rowIndex = Number(cell.dataset.row);
    const key = cell.dataset.key;
    let value = cell.textContent.trim();
    cell.dataset.raw = value;
    if (!state[currentSection][rowIndex]) {
      state[currentSection][rowIndex] = { id: `${currentSection}-${Date.now()}-${rowIndex}` };
    }
    const normalized = normalizedCell(currentSection, key, value);
    state[currentSection][rowIndex][key] = normalized.result;
    scheduleSave(currentSection);
    updateMetrics(currentSection);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;
    text = text.replace(/^\ufeff/, '');
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (char === '"' && text[index + 1] === '"' && quoted) { value += '"'; index += 1; }
      else if (char === '"') quoted = !quoted;
      else if (char === ',' && !quoted) { row.push(value); value = ''; }
      else if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && text[index + 1] === '\n') index += 1;
        row.push(value); rows.push(row); row = []; value = '';
      } else value += char;
    }
    if (value || row.length) { row.push(value); rows.push(row); }
    return rows;
  }

  document.getElementById('sectionNav').addEventListener('click', event => {
    const button = event.target.closest('[data-section]');
    if (!button) return;
    document.querySelectorAll('[data-section]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    if (selectedCell) selectedCell = null;
    if (['overview', 'reports'].includes(button.dataset.section)) renderSection(button.dataset.section);
    else renderSection(button.dataset.section);
  });

  document.getElementById('addRow').addEventListener('click', () => {
    if (!schemas[currentSection]) {
      currentSection = 'branches';
      document.querySelectorAll('[data-section]').forEach(item => item.classList.toggle('active', item.dataset.section === currentSection));
      renderSection(currentSection);
    }
    state[currentSection].push({ id: `${currentSection}-${Date.now()}` });
    saveSection(currentSection);
    renderRows(currentSection);
    updateMetrics(currentSection);
  });

  document.getElementById('clearRows').addEventListener('click', () => {
    if (!schemas[currentSection]) return;
    if (!confirm(`مسح جميع سجلات قسم ${schemas[currentSection].title}؟`)) return;
    state[currentSection] = [];
    saveSection(currentSection);
    renderRows(currentSection);
    updateMetrics(currentSection);
  });

  document.getElementById('exportCsv').addEventListener('click', () => {
    if (!schemas[currentSection]) return;
    const schema = schemas[currentSection];
    const csvRows = [
      schema.columns.map(([, label]) => label),
      ...(state[currentSection] || []).map(item => schema.columns.map(([key]) => displayValue(currentSection, key, item[key])))
    ].map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','));
    const url = URL.createObjectURL(new Blob(['\ufeff' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schemas[currentSection].title}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importCsv').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file || !schemas[currentSection]) return;
    const rows = parseCsv(await file.text());
    if (!rows.length) return;
    const first = rows[0];
    const schema = schemas[currentSection];
    const hasHeaders = first.some(value => schema.columns.some(([, label]) => label === value.trim()));
    const start = hasHeaders ? 1 : 0;
    state[currentSection] = rows.slice(start).filter(row => row.some(value => String(value).trim())).map((row, index) => {
      const item = { id: `${currentSection}-${Date.now()}-${index}` };
      schema.columns.forEach(([key], columnIndex) => {
        const normalized = normalizedCell(currentSection, key, row[columnIndex] || '');
        item[key] = normalized.result;
      });
      return item;
    });
    await saveSection(currentSection);
    renderRows(currentSection);
    updateMetrics(currentSection);
    event.target.value = '';
  });
  document.getElementById('logoutTop').addEventListener('click', () => logout());

  bindExcel('overview');
  content.addEventListener('focusout', event => {
    const cell = event.target.closest('.excel-cell');
    if (cell) cell.classList.remove('editing');
  });
  content.addEventListener('focusin', event => {
    const cell = event.target.closest('.excel-cell');
    if (cell) cell.classList.add('editing');
  });

  async function initialize() {
    await Promise.all(Object.keys(schemas).map(loadSection));
    seedBranches();
    renderSection('overview');
  }
  initialize();
})();
