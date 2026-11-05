const ADMIN_SESSION_KEY = 'electrophone_admin_session';
const ADMIN_ATTEMPTS_KEY = 'electrophone_admin_failed_attempts';
const ADMIN_LOCK_KEY = 'electrophone_admin_lock_until';
const MAX_ADMIN_ATTEMPTS = 20;
const ADMIN_LOCK_DURATION_MS = 30 * 60 * 1000;
const isLoginPage = /\/login(?:\.html)?\/?$/.test(window.location.pathname);

function getAdminLockUntil() {
  const value = Number(localStorage.getItem(ADMIN_LOCK_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function isAdminLocked() {
  const until = getAdminLockUntil();
  if (until && Date.now() < until) return true;
  if (until && Date.now() >= until) {
    localStorage.removeItem(ADMIN_LOCK_KEY);
    localStorage.setItem(ADMIN_ATTEMPTS_KEY, '0');
  }
  return false;
}

if (isAdminLocked()) {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  if (!isLoginPage) window.location.replace('login.html');
}

if (!isLoginPage) {
  if (localStorage.getItem(ADMIN_SESSION_KEY) !== 'authenticated') {
    window.location.replace('login.html');
  } else {
    document.body.classList.add('authenticated');
  }
} else if (localStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated') {
  window.location.replace('index.html');
}

async function hashAccessCode(value) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Votre navigateur ne prend pas en charge la vérification du code. Utilisez HTTPS ou localhost.');
  }
  const salt = Uint8Array.from(
    ADMIN_ACCESS_CODE.salt.match(/.{2}/g),
    byte => parseInt(byte, 16)
  );
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(value),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ADMIN_ACCESS_CODE.iterations },
    key,
    256
  );
  return Array.from(new Uint8Array(bits), byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const input = document.getElementById('accessCode');
  const error = document.getElementById('error');
  if (isAdminLocked()) {
    const remaining = Math.max(1, Math.ceil((getAdminLockUntil() - Date.now()) / 60000));
    input.disabled = true;
    error.textContent = `الإدارة مقفلة مؤقتاً لمدة ${remaining} دقيقة بسبب كثرة المحاولات.`;
  }
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (isAdminLocked()) return;
    error.textContent = '';
    try {
      const submittedHash = await hashAccessCode(input.value);
      if (submittedHash === ADMIN_ACCESS_CODE.hash) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
        localStorage.setItem(ADMIN_ATTEMPTS_KEY, '0');
        localStorage.removeItem(ADMIN_LOCK_KEY);
        window.location.replace('index.html');
        return;
      }
      const attempts = Number(localStorage.getItem(ADMIN_ATTEMPTS_KEY) || 0) + 1;
      localStorage.setItem(ADMIN_ATTEMPTS_KEY, String(attempts));
      if (attempts >= MAX_ADMIN_ATTEMPTS) {
        localStorage.setItem(ADMIN_LOCK_KEY, String(Date.now() + ADMIN_LOCK_DURATION_MS));
        input.disabled = true;
        error.textContent = 'تم قفل الإدارة لمدة 30 دقيقة بسبب 20 محاولة خاطئة.';
        return;
      }
      input.value = '';
      error.textContent = `❌ Code d’accès incorrect. ${MAX_ADMIN_ATTEMPTS - attempts} محاولات متبقية.`;
      input.focus();
    } catch (exception) {
      error.textContent = exception.message || 'Une erreur est survenue. Vérifiez le code.';
    }
  });
}

function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.replace('login.html');
}
