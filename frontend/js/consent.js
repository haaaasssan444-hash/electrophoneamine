(() => {
  const consentKey = 'electrophone_cookie_consent';
  const banner = document.createElement('section');
  let choice = null;

  try {
    choice = localStorage.getItem(consentKey);
  } catch (error) {
    console.warn('Cookie preferences cannot be read from local storage.', error);
  }

  function hasAnalyticsConsent() {
    return choice === 'accepted';
  }

  function loadConsentedContent() {
    document.querySelectorAll('[data-consent-src]').forEach(element => {
      const note = element.parentElement.querySelector('.map-consent-note');
      if (hasAnalyticsConsent() && !element.hasAttribute('src')) {
        element.setAttribute('src', element.getAttribute('data-consent-src'));
        if (note) note.hidden = true;
      } else if (!hasAnalyticsConsent()) {
        element.removeAttribute('src');
        if (note) note.hidden = false;
      }
    });
  }

  function saveChoice(value) {
    choice = value;
    try {
      localStorage.setItem(consentKey, value);
    } catch (error) {
      console.warn('Cookie preferences could not be saved.', error);
      status.textContent = 'Votre choix est appliqué pour cette page seulement.';
    }
    banner.hidden = true;
    loadConsentedContent();
    document.dispatchEvent(new CustomEvent('electrophone:consent-change', { detail: value }));
  }

  banner.className = 'cookie-consent';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Préférences de confidentialité');
  banner.innerHTML = `
    <p>Les statistiques de fréquentation et la carte Google ne sont activées qu’avec votre accord. Les fonctions nécessaires au panier restent actives. <a href="/privacy/">En savoir plus</a></p>
    <div class="cookie-consent-actions">
      <button type="button" data-cookie-refuse>Refuser</button>
      <button type="button" data-cookie-accept>Accepter</button>
    </div>
    <span class="cookie-consent-status" role="status" aria-live="polite"></span>`;
  const status = banner.querySelector('.cookie-consent-status');
  document.body.appendChild(banner);
  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => saveChoice('accepted'));
  banner.querySelector('[data-cookie-refuse]').addEventListener('click', () => saveChoice('refused'));

  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('[data-cookie-refuse]').focus();
    });
  });

  banner.hidden = choice === 'accepted' || choice === 'refused';
  window.ElectrophoneConsent = { hasAnalyticsConsent };
  loadConsentedContent();
})();
