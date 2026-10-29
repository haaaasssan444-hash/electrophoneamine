const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'electrophone-catalog-v1';
const DATA_KEY = 'catalog';

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'cache-control': 'no-store'
  };
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  const headers = { ...corsHeaders(), 'content-type': 'application/json; charset=utf-8' };
  try {
    const store = getStore(STORE_NAME);

    if (event.httpMethod === 'GET') {
      const catalog = (await store.get(DATA_KEY, { type: 'json' })) || { products: [], accessories: [], updatedAt: null };
      return { statusCode: 200, headers, body: JSON.stringify(catalog) };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    if (!Array.isArray(body.products) || !Array.isArray(body.accessories)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'products and accessories must be arrays' }) };
    }

    const catalog = {
      products: body.products,
      accessories: body.accessories,
      updatedAt: new Date().toISOString()
    };
    await store.setJSON(DATA_KEY, catalog);
    return { statusCode: 200, headers, body: JSON.stringify(catalog) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Catalog unavailable' }) };
  }
};
