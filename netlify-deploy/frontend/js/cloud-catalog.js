(function () {
  const config = window.ELECTROPHONE_SUPABASE;
  if (!config || !window.supabase) return;

  const client = window.supabase.createClient(config.url, config.publishableKey);
  const CATALOG_MARKER_ID = '__electrophone_catalog_initialized_v1__';

  async function fetchTable(table) {
    const { data, error } = await client.from(table).select('id,data').order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || [])
      .filter(row => table !== 'phone_products' || row.id !== CATALOG_MARKER_ID)
      .map(row => ({ ...row.data, id: row.id }));
  }

  async function saveTable(table, items) {
    const rows = items.map(item => ({ id: String(item.id), data: item, updated_at: new Date().toISOString() }));
    if (table === 'phone_products') {
      rows.push({
        id: CATALOG_MARKER_ID,
        data: { initialized: true },
        updated_at: new Date().toISOString()
      });
    }
    if (rows.length) {
      const { error } = await client.from(table).upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }
    await pruneTable(table, rows);
  }

  async function pruneTable(table, items) {
    const ids = items.map(item => String(item.id));
    if (table === 'phone_products' && !ids.includes(CATALOG_MARKER_ID)) ids.push(CATALOG_MARKER_ID);
    let query = client.from(table).select('id');
    const { data, error } = await query;
    if (error) throw error;
    for (const row of data || []) {
      if (!ids.includes(String(row.id))) {
        const { error: deleteError } = await client.from(table).delete().eq('id', row.id);
        if (deleteError) throw deleteError;
      }
    }
  }

  async function loadSharedCatalog() {
    const phones = await fetchTable('phone_products');
    const accessories = await fetchTable('accessory_products');

    if (!phones.length && !accessories.length) {
      const { data: marker, error } = await client
        .from('phone_products')
        .select('id')
        .eq('id', CATALOG_MARKER_ID)
        .limit(1);
      if (error) throw error;
      if (marker && marker.length) {
        if (window.ElectrophoneStore) window.ElectrophoneStore.saveProducts([]);
        localStorage.setItem('electrophone_accessories', '[]');
        window.dispatchEvent(new CustomEvent('accessories:updated', { detail: [] }));
        return;
      }

      const localPhones = JSON.parse(localStorage.getItem('productsData') || '[]');
      const localAccessories = JSON.parse(localStorage.getItem('electrophone_accessories') || '[]');
      if (!Array.isArray(localPhones) || !Array.isArray(localAccessories)) {
        throw new TypeError('Stored catalog data must be arrays.');
      }
      await saveSharedCatalog(localPhones, localAccessories);
      return;
    }

    if (window.ElectrophoneStore) {
      window.ElectrophoneStore.saveProducts(phones);
    }
    localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    window.dispatchEvent(new CustomEvent('accessories:updated', { detail: accessories }));
  }

  async function saveSharedCatalog(products, accessories) {
    await saveTable('phone_products', products);
    await saveTable('accessory_products', accessories);
  }

  window.ElectrophoneCloud = { loadSharedCatalog, saveSharedCatalog, fetchTable };
  void loadSharedCatalog().catch(error => console.warn('Shared catalog unavailable:', error.message || error));
})();
