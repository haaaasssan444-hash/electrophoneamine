(() => {
  const MAX_ATTEMPTS = 20;
  const LOCK_DURATION_MS = 30 * 60 * 1000;
  const ATTEMPTS_KEY = 'electrophone_admin_failed_attempts';
  const LOCK_KEY = 'electrophone_admin_lock_until';
  const SESSION_KEY = 'electrophone_admin_session';

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

  async function hashAccessCode(value) {
    const salt = Uint8Array.from(
      ADMIN_ACCESS_CODE.salt.match(/.{2}/g).map(byte => parseInt(byte, 16))
    );
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(value),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ADMIN_ACCESS_CODE.iterations },
      key,
      256
    );
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function unlock(value) {
    if (isLocked()) return { success: false, locked: true, remainingMinutes: getRemainingMinutes() };
    const submitted = await hashAccessCode(value.trim());
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

  window.ElectrophoneAdminGate = { isLocked, getRemainingMinutes, unlock };
})();
