import React, { useState } from 'react';

export default function CategoriesView({ categories, setCategories }) {
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('📁');
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategoryId) {
      setCategories(categories.map(cat => 
        cat.id === editingCategoryId ? { ...cat, name: catName, icon: catIcon } : cat
      ));
      setEditingCategoryId(null);
    } else {
      const newCat = { id: Date.now(), name: catName, icon: catIcon };
      setCategories([...categories, newCat]);
    }
    setCatName('');
    setCatIcon('📁');
  };

  const handleDeleteCategory = (id) => {
    if(confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div style={styles.gridTwoColumns}>
      <div style={styles.viewCard}>
        <h2 style={styles.sectionTitle}>
          {editingCategoryId ? '📝 Edytuj kategorię' : '➕ Utwórz nową kategorię'}
        </h2>
        <form onSubmit={handleSaveCategory} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nazwa nowej kategorii:</label>
            <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Wpisz nazwę, np. Kosmetyki" style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Wybierz ikonę:</label>
            <select value={catIcon} onChange={(e) => setCatIcon(e.target.value)} style={styles.select}>
              <optgroup label="Podstawowe">
                <option value="📁">📁 Ogólne / Inne</option>
                <option value="🛒">🛒 Zakupy</option>
                <option value="💡">💡 Opłaty stałe</option>
                <option value="🚌">🚌 Transport</option>
              </optgroup>
              <optgroup label="Życie i Rozrywka">
                <option value="🌴">🌴 Podróże / Wakacje</option>
                <option value="🛍️">🛍️ Ubrania / Shopping</option>
                <option value="🍔">🍔 Jedzenie / Restauracje</option>
                <option value="🎮">🎮 Gry / Rozrywka</option>
              </optgroup>
              <optgroup label="Inne">
                <option value="💊">💊 Apteka / Zdrowie</option>
                <option value="🏋️">🏋️ Sport / Siłownia</option>
              </optgroup>
            </select>
          </div>
          <button type="submit" style={styles.button}>
            {editingCategoryId ? '💾 Zapisz zmiany' : 'Dodaj'}
          </button>
          {editingCategoryId && (
            <button type="button" onClick={() => { setEditingCategoryId(null); setCatName(''); }} style={styles.cancelButton}>Anuluj edycję</button>
          )}
        </form>
      </div>

      <div style={styles.viewCard}>
        <h2 style={styles.sectionTitle}>📁 Aktywne kategorie wydatków</h2>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Ikona</th>
              <th style={styles.th}>Nazwa konfiguracji</th>
              <th style={styles.th}>Akcje zmian</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={styles.tr}>
                <td style={{ ...styles.td, fontSize: '24px' }}>{cat.icon}</td>
                <td style={{ ...styles.td, fontWeight: '700', color: '#111' }}>{cat.name}</td>
                <td style={styles.td}>
                  <button onClick={() => { setEditingCategoryId(cat.id); setCatName(cat.name); setCatIcon(cat.icon); }} style={styles.smallEditBtn}>Zmień</button>
                  <button onClick={() => handleDeleteCategory(cat.id)} style={styles.deleteBtn}>Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  gridTwoColumns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  viewCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid #ced4da' },
  sectionTitle: { margin: '0 0 15px 0', fontSize: '22px', color: '#111', fontWeight: '800', borderBottom: '2px solid #00CB99', paddingBottom: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '800', color: '#111' },
  input: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600' },
  select: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600', height: '48px' },
  button: { color: '#fff', backgroundColor: '#111', border: 'none', padding: '14px 24px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
  cancelButton: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', marginTop: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { borderBottom: '3px solid #111' },
  th: { padding: '14px 10px', color: '#111', fontWeight: '800', fontSize: '15px' },
  tr: { borderBottom: '1px solid #dee2e6' },
  td: { padding: '15px 10px', verticalAlign: 'middle' },
  smallEditBtn: { backgroundColor: '#0dcaf0', color: '#111', border: 'none', padding: '7px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', marginRight: '6px' },
  deleteBtn: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }
};
