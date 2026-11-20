(() => {
  const WORKER_PORTAL_CODE = {
    iterations: 310000,
    salt: '027ce9a46ccf7cc5ae024cfe4699648a',
    hash: '0a2022800c6902e00fe69ee5de4d129cebb30d45e6bce78cf4728ef56474b08e'
  };

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

  async function matchesWorkerPortalCode(value) {
    const normalized = String(value == null ? '' : value).replace(/\s+/g, '').toLocaleLowerCase();
    if (!normalized.startsWith('phone') || !normalized.endsWith('@@')) return false;
    return await hashCode(normalized, WORKER_PORTAL_CODE) === WORKER_PORTAL_CODE.hash;
  }

  window.ElectrophoneAdminGate = { matchesWorkerPortalCode };
})();
