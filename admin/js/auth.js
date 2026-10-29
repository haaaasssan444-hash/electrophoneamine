const ADMIN_SESSION_KEY = 'electrophone_admin_session';
const isLoginPage = /\/login(?:\.html)?\/?$/.test(window.location.pathname);

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
    throw new Error('المتصفح ما كيدعمش التحقق من الكود. افتح الموقع عبر HTTPS أو localhost.');
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
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.getElementById('accessCode');
    const error = document.getElementById('error');
    error.textContent = '';
    try {
      const submittedHash = await hashAccessCode(input.value);
      if (submittedHash === ADMIN_ACCESS_CODE.hash) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
        window.location.replace('index.html');
        return;
      }
      input.value = '';
      error.textContent = '❌ كود الدخول غير صحيح.';
      input.focus();
    } catch (exception) {
      error.textContent = exception.message || 'وقع مشكل فتحقق من الكود.';
    }
  });
}

function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.replace('login.html');
}
