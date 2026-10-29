const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'electrophone-analytics-v1';
const DATA_KEY = 'analytics';

function emptyAnalytics() {
  return { visitorsTotal: 0, visitorsDaily: {}, views: {}, updatedAt: null };
}

function todayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

function corsHeaders() {
  return { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type', 'cache-control': 'no-store' };
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };

  const headers = { ...corsHeaders(), 'content-type': 'application/json; charset=utf-8' };
  try {
    const store = getStore(STORE_NAME);
    let analytics = (await store.get(DATA_KEY, { type: 'json' })) || emptyAnalytics();

    if (event.httpMethod === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(analytics) };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const today = todayKey();
    if (body.type === 'visit') {
      analytics.visitorsTotal = Number(analytics.visitorsTotal) || 0;
      analytics.visitorsDaily[today] = (Number(analytics.visitorsDaily[today]) || 0) + 1;
      analytics.visitorsTotal += 1;
    } else if (body.type === 'view' && body.itemId) {
      const key = `${body.itemType === 'accessory' ? 'accessory' : 'phone'}:${String(body.itemId).slice(0, 200)}`;
      if (!analytics.views[key]) analytics.views[key] = { total: 0, daily: {} };
      analytics.views[key].total = (Number(analytics.views[key].total) || 0) + 1;
      analytics.views[key].daily[today] = (Number(analytics.views[key].daily[today]) || 0) + 1;
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid tracking event' }) };
    }

    analytics.updatedAt = new Date().toISOString();
    await store.setJSON(DATA_KEY, analytics);
    return { statusCode: 200, headers, body: JSON.stringify(analytics) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Analytics unavailable' }) };
  }
};
