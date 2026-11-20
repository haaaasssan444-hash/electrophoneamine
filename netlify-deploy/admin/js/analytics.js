(function () {
  const countFormatter = new Intl.NumberFormat('fr-MA');
  const dateFormatter = new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC'
  });
  const elements = {
    status: document.getElementById('analyticsStatus'),
    error: document.getElementById('analyticsError'),
    total: document.getElementById('visitsTotal'),
    today: document.getElementById('visitsToday'),
    productViews: document.getElementById('productViewsTotal'),
    updated: document.getElementById('analyticsUpdated'),
    chart: document.getElementById('dailyChart'),
    chartEmpty: document.getElementById('dailyEmpty'),
    topProducts: document.getElementById('topProducts'),
    refresh: document.getElementById('refreshAnalytics')
  };

  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function readCount(value, label) {
    const count = Number(value);
    if (!Number.isFinite(count) || count < 0) {
      throw new Error(`Valeur invalide dans les statistiques : ${label}`);
    }
    return Math.floor(count);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function dayKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function renderChart(dailyVisits) {
    const today = new Date();
    const days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 13 + index));
      const key = dayKey(date);
      return { key, label: dateFormatter.format(date), count: readCount(dailyVisits[key] || 0, key) };
    });
    const maximum = Math.max(1, ...days.map(day => day.count));
    const hasVisits = days.some(day => day.count > 0);

    elements.chart.innerHTML = days.map(day => {
      const height = day.count ? Math.max(3, Math.round(day.count / maximum * 100)) : 0;
      return `<div class="daily-point" role="listitem" aria-label="${escapeHtml(day.key)} : ${countFormatter.format(day.count)} visites">
        <span class="daily-count">${countFormatter.format(day.count)}</span>
        <span class="daily-bar-track"><span class="daily-bar" style="--bar-height:${height}%"></span></span>
        <span class="daily-date">${escapeHtml(day.label)}</span>
      </div>`;
    }).join('');
    elements.chartEmpty.hidden = hasVisits;
  }

  function renderTopProducts(views) {
    const products = Object.entries(views)
      .map(([key, value]) => {
        const separator = key.indexOf(':');
        if (separator < 0 || !isRecord(value)) {
          throw new Error('Les données de consultation des produits sont invalides.');
        }
        return {
          id: key.slice(separator + 1),
          type: key.slice(0, separator) === 'accessory' ? 'Accessoire' : 'Téléphone',
          total: readCount(value.total, `views.${key}.total`)
        };
      })
      .sort((first, second) => second.total - first.total)
      .slice(0, 10);

    elements.productViews.textContent = countFormatter.format(
      Object.values(views).reduce((sum, view) => sum + readCount(view.total, 'views.total'), 0)
    );
    elements.topProducts.innerHTML = products.length
      ? products.map(product => `<tr><td>${escapeHtml(product.id || '—')}</td><td>${product.type}</td><td>${countFormatter.format(product.total)}</td></tr>`).join('')
      : '<tr><td colspan="3" class="analytics-empty">Aucune consultation enregistrée pour le moment.</td></tr>';
  }

  function setUnavailable(message) {
    elements.status.textContent = 'Statistiques indisponibles';
    elements.status.classList.add('error');
    elements.total.textContent = '—';
    elements.today.textContent = '—';
    elements.productViews.textContent = '—';
    elements.updated.textContent = 'Dernière mise à jour : —';
    elements.chart.replaceChildren();
    elements.chartEmpty.hidden = false;
    elements.chartEmpty.textContent = 'Impossible de charger les données de visites.';
    elements.topProducts.innerHTML = '<tr><td colspan="3" class="analytics-empty">Données indisponibles.</td></tr>';
    elements.error.textContent = message;
    elements.error.hidden = false;
  }

  async function loadAnalytics() {
    elements.refresh.disabled = true;
    elements.status.classList.remove('error');
    elements.status.textContent = 'Chargement des statistiques…';
    elements.error.hidden = true;

    try {
      const response = await fetch('/api/analytics', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Impossible de récupérer les statistiques (HTTP ${response.status}). Vérifiez que l’API Analytics est active sur l’hébergement.`);
      }

      const analytics = await response.json();
      if (!isRecord(analytics)
        || !isRecord(analytics.visitorsDaily)
        || !isRecord(analytics.views)) {
        throw new Error('La réponse de l’API des statistiques est invalide.');
      }

      const total = readCount(analytics.visitorsTotal, 'visitorsTotal');
      const today = new Date();
      const todayCount = readCount(analytics.visitorsDaily[dayKey(today)] || 0, 'visitorsDaily.today');
      elements.total.textContent = countFormatter.format(total);
      elements.today.textContent = countFormatter.format(todayCount);
      renderTopProducts(analytics.views);
      renderChart(analytics.visitorsDaily);

      const updatedAt = analytics.updatedAt ? new Date(analytics.updatedAt) : null;
      elements.updated.textContent = updatedAt && Number.isFinite(updatedAt.getTime())
        ? `Dernière mise à jour : ${new Intl.DateTimeFormat('fr-MA', { dateStyle: 'medium', timeStyle: 'short' }).format(updatedAt)}`
        : 'Aucune visite enregistrée';
      elements.status.textContent = 'Statistiques actualisées';
    } catch (error) {
      setUnavailable(error.message || 'Impossible de charger les statistiques.');
    } finally {
      elements.refresh.disabled = false;
    }
  }

  elements.refresh.addEventListener('click', loadAnalytics);
  document.getElementById('logoutTop').addEventListener('click', () => logout());
  loadAnalytics();
})();
