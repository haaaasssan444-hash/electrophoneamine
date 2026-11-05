(() => {
  const ACCOUNT_KEY = 'electrophone_store_accounts';
  const SESSION_KEY = 'electrophone_store_session';
  const isLogin = /store-login\.html/.test(location.pathname);
  const ENTRY_KEY = 'electrophone_worker_entry_unlocked';
  const ENTRY_PASSWORD = 'phone123456@@';

  async function hashPassword(password, saltHex) {
    const salt = saltHex
      ? Uint8Array.from(saltHex.match(/.{2}/g).map(byte => parseInt(byte, 16)))
      : crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 310000 }, key, 256);
    const hash = Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
    const saltString = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('');
    return { hash, salt: saltString };
  }

  function localAccounts() {
    try {
      const value = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }

  const entryGate = document.getElementById('workerEntryGate');
  if (entryGate && isLogin) {
    if (sessionStorage.getItem(ENTRY_KEY) === 'true') {
      entryGate.hidden = true;
    }
    document.getElementById('workerEntryForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('workerEntryPassword');
      const error = document.getElementById('workerEntryError');
      if (input.value === ENTRY_PASSWORD) {
        sessionStorage.setItem(ENTRY_KEY, 'true');
        entryGate.hidden = true;
        error.textContent = '';
        input.value = '';
        document.getElementById('workerUsername')?.focus();
        return;
      }
      input.value = '';
      error.textContent = 'رمز الدخول غير صحيح.';
      input.focus();
    });
  }

  async function sessionAccounts() {
    let accounts = localAccounts();
    try {
      if (window.ElectrophoneCloud?.fetchTable) {
        const cloudPromise = window.ElectrophoneCloud.fetchTable('store_accounts');
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 3000));
        const cloud = await Promise.race([cloudPromise, timeoutPromise]);
        if (!cloud) return accounts;
        if (Array.isArray(cloud) && cloud.length) accounts = cloud;
      }
    } catch (error) {
      console.warn('Worker accounts cloud unavailable:', error.message || error);
    }
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    return accounts;
  }

  const loginForm = document.getElementById('workerLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const error = document.getElementById('workerLoginError');
      const username = document.getElementById('workerUsername').value.trim().toLowerCase();
      const password = document.getElementById('workerPassword').value;
      error.textContent = '';
      try {
        const accounts = await sessionAccounts();
        const account = accounts.find(item => String(item.username).toLowerCase() === username && item.active !== false);
        if (!account || !account.passwordSalt || !account.passwordHash) {
          error.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
          return;
        }
        const result = await hashPassword(password, account.passwordSalt);
        if (result.hash !== account.passwordHash) {
          error.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
          return;
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          id: account.id,
          username: account.username,
          name: account.name,
          branchId: account.branchId,
          role: account.role || 'worker'
        }));
        location.href = 'store-workstation.html';
      } catch (exception) {
        error.textContent = exception.message || 'تعذر تسجيل الدخول.';
      }
    });
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function requireWorker() {
    const session = getSession();
    if (!session?.branchId) {
      location.replace('store-login.html');
      return null;
    }
    return session;
  }

  function logoutWorker() {
    localStorage.removeItem(SESSION_KEY);
    location.replace('store-login.html');
  }

  async function loginWorker(username, password) {
    const normalizedUsername = String(username || '').trim().toLowerCase();
    const accounts = await sessionAccounts();
    const account = accounts.find(item => String(item.username).toLowerCase() === normalizedUsername && item.active !== false);
    if (!account || !account.passwordSalt || !account.passwordHash) return null;
    const result = await hashPassword(password, account.passwordSalt);
    if (result.hash !== account.passwordHash) return null;
    const session = {
      id: account.id,
      username: account.username,
      name: account.name,
      branchId: account.branchId,
      role: account.role || 'worker'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  window.StoreAuth = { hashPassword, sessionAccounts, getSession, requireWorker, logoutWorker, loginWorker, localAccounts };
})();
