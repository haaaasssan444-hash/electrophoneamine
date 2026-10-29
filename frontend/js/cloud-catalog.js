(function () {
  const config = window.ELECTROPHONE_SUPABASE;
  if (!config || !window.supabase) return;

  const client = window.supabase.createClient(config.url, config.publishableKey);

  async function fetchTable(table) {
    const { data, error } = await client.from(table).select('id,data').order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => ({ ...row.data, id: row.id }));
  }

  async function saveTable(table, items) {
    const rows = items.map(item => ({ id: String(item.id), data: item, updated_at: new Date().toISOString() }));
    if (rows.length) {
      const { error } = await client.from(table).upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }
    await pruneTable(table, items);
  }

  async function pruneTable(table, items) {
    const ids = items.map(item => String(item.id));
    let query = client.from(table).select('id');
    const { data, error } = await query;
    if (error) throw error;
    for (const row of data || []) {
      if (!ids.includes(String(row.id))) {
        await client.from(table).delete().eq('id', row.id);
      }
    }
  }

  async function loadSharedCatalog() {
    const phones = await fetchTable('phone_products');
    const accessories = await fetchTable('accessory_products');
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
