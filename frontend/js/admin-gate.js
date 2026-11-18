(() => {
  const MAX_ATTEMPTS = 20;
  const LOCK_DURATION_MS = 30 * 60 * 1000;
  const ATTEMPTS_KEY = 'electrophone_admin_failed_attempts';
  const LOCK_KEY = 'electrophone_admin_lock_until';
  const SESSION_KEY = 'electrophone_admin_session';
  const WORKER_PORTAL_CODE = {
    iterations: 310000,
    salt: '027ce9a46ccf7cc5ae024cfe4699648a',
    hash: '0a2022800c6902e00fe69ee5de4d129cebb30d45e6bce78cf4728ef56474b08e'
  };

  function getLockUntil() {
    const value = Number(localStorage.getItem(LOCK_KEY) || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function isLocked() {
    const until = getLockUntil();
    if (until && Date.now() < until) return true;
    if (until && Date.now() >= until) {
      localStorage.removeItem(LOCK_KEY);
      localStorage.setItem(ATTEMPTS_KEY, '0');
    }
    return false;
  }

  function getRemainingMinutes() {
    return Math.max(1, Math.ceil((getLockUntil() - Date.now()) / 60000));
  }

  async function hashCode(value, credential) {
    const salt = Uint8Array.from(
      credential.salt.match(/.{2}/g).map(byte => parseInt(byte, 16))
    );
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(value),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: credential.iterations },
      key,
      256
    );
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function unlock(value) {
    if (isLocked()) return { success: false, locked: true, remainingMinutes: getRemainingMinutes() };
    const submitted = await hashCode(value.trim(), ADMIN_ACCESS_CODE);
    if (submitted === ADMIN_ACCESS_CODE.hash) {
      localStorage.setItem(SESSION_KEY, 'authenticated');
      localStorage.setItem(ATTEMPTS_KEY, '0');
      localStorage.removeItem(LOCK_KEY);
      return { success: true };
    }

    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(LOCK_KEY, String(Date.now() + LOCK_DURATION_MS));
      localStorage.setItem(SESSION_KEY, 'locked');
      return { success: false, locked: true, remainingMinutes: 30 };
    }
    return { success: false, locked: false, attemptsLeft: MAX_ATTEMPTS - attempts };
  }

  async function matchesWorkerPortalCode(value) {
    const normalized = String(value == null ? '' : value).replace(/\s+/g, '').toLocaleLowerCase();
    if (!normalized.startsWith('phone') || !normalized.endsWith('@@')) return false;
    return await hashCode(normalized, WORKER_PORTAL_CODE) === WORKER_PORTAL_CODE.hash;
  }

  window.ElectrophoneAdminGate = { isLocked, getRemainingMinutes, unlock, matchesWorkerPortalCode };
})();
