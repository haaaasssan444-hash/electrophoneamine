(() => {
  if (!window.StoreAuth) return;
  const ownerSession = localStorage.getItem('electrophone_admin_session');
  if (ownerSession !== 'authenticated') {
    location.replace('login.html');
    return;
  }

  const ACCOUNT_KEY = 'electrophone_store_accounts';
  let accounts = [];

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
    render();
  }

  async function save() {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    try {
      if (window.ElectrophoneCloud?.saveTable) {
        await window.ElectrophoneCloud.saveTable('store_accounts', accounts);
        document.getElementById('accountsMessage').textContent = 'تم حفظ الحساب ✅';
      } else {
        document.getElementById('accountsMessage').textContent = 'تم الحفظ على هذا الجهاز فقط — شغل الاتصال السحابي.';
      }
    } catch (error) {
      const detail = error?.message || error?.details || error?.hint || String(error || '');
      document.getElementById('accountsMessage').textContent = `تعذر الحفظ في السحابة${detail ? `: ${detail}` : '.'}`;
      console.warn('Store accounts cloud save failed:', error.message || error);
    }
    render();
  }

  function render() {
    const branches = {
      'branch-1': 'المحل 1', 'branch-2': 'المحل 2', 'branch-3': 'المحل 3',
      'branch-4': 'المحل 4', 'branch-5': 'المحل 5', 'branch-6': 'المحل 6', 'branch-7': 'المحل 7'
    };
    document.getElementById('accountsRows').innerHTML = accounts.length
      ? accounts.map(account => `<tr>
          <td>${escapeHtml(account.username)}</td><td>${escapeHtml(account.name)}</td>
          <td>${escapeHtml(branches[account.branchId] || account.branchId)}</td>
          <td><span class="status-badge ${account.active === false ? 'danger' : ''}">${account.active === false ? 'موقف' : 'نشط'}</span></td>
          <td>
            <button class="secondary-button" type="button" data-toggle="${escapeHtml(account.id)}">${account.active === false ? 'تفعيل' : 'تعطيل'}</button>
            <button class="secondary-button" type="button" data-reset="${escapeHtml(account.id)}">تغيير كلمة المرور</button>
            <button class="secondary-button danger-button" type="button" data-delete="${escapeHtml(account.id)}">حذف الحساب</button>
          </td>
        </tr>`).join('')
      : '<tr><td colspan="5"><div class="empty-state">لا توجد حسابات العمال</div></td></tr>';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  document.getElementById('accountForm').addEventListener('submit', async event => {
    event.preventDefault();
    const username = document.getElementById('accountUsername').value.trim().toLowerCase();
    if (!username) return;
    if (accounts.some(account => String(account.username).toLowerCase() === username)) {
      document.getElementById('accountsMessage').textContent = 'اسم المستخدم موجود بالفعل.';
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

  document.getElementById('accountsRows').addEventListener('click', async event => {
    const toggleButton = event.target.closest('[data-toggle]');
    const resetButton = event.target.closest('[data-reset]');
    const deleteButton = event.target.closest('[data-delete]');
    if (!toggleButton && !resetButton && !deleteButton) return;
    const id = toggleButton?.dataset.toggle || resetButton?.dataset.reset || deleteButton?.dataset.delete;
    const account = accounts.find(item => String(item.id) === String(id));
    if (!account) return;
    if (deleteButton) {
      if (!confirm(`حذف حساب العامل "${account.name || account.username}" نهائياً؟`)) return;
      accounts = accounts.filter(item => String(item.id) !== String(id));
      await save();
      return;
    }
    if (toggleButton) {
      account.active = account.active === false;
      await save();
      return;
    }
    const password = prompt(`كلمة مرور جديدة للعامل ${account.name || account.username}:`);
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
      if (!window.ElectrophoneCloud?.saveTable) throw new Error('الاتصال السحابي غير متاح');
      await window.ElectrophoneCloud.saveTable('store_accounts', accounts);
      const cloud = await window.ElectrophoneCloud.fetchTable('store_accounts');
      if (Array.isArray(cloud)) {
        accounts = cloud;
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
        message.textContent = `تمت المزامنة ✅ (${accounts.length} حساب)`;
      }
      render();
    } catch (error) {
      const detail = error?.message || error?.details || error?.hint || String(error || '');
      message.textContent = `تعذر الاتصال السحابي${detail ? `: ${detail}` : '.'}`;
      console.warn('Worker account sync failed:', error.message || error);
    }
  });
  load();
})();
