import React, { useState } from 'react';

export default function EditTransactionView({ tx, categories, onUpdate, onDelete, onCancel }) {
  const parsePolishDateToISO = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const months = [
      'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
      'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    const parts = dateStr.split(' ');
    if (parts.length !== 2) return new Date().toISOString().split('T')[0];
    const day = parts[0].padStart(2, '0');
    const monthIndex = months.indexOf(parts[1]);
    if (monthIndex === -1) return new Date().toISOString().split('T')[0];
    const month = String(monthIndex + 1).padStart(2, '0');
    return `2026-${month}-${day}`;
  };

  const formatToPolishDate = (dateStr) => {
    if (!dateStr) return '1 czerwca';
    const months = [
      'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
      'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]}`;
  };

  const [editTxTitle, setEditTxTitle] = useState(tx.title);
  const [editTxType, setEditTxType] = useState(tx.type || (tx.amount < 0 ? 'Expense' : 'Income'));
  const [editTxCategoryName, setEditTxCategoryName] = useState(tx.category === 'Przychód' ? categories[0]?.name : tx.category);
  const [editTxAmount, setEditTxAmount] = useState(Math.abs(tx.amount).toString());
  const [editTxDescription, setEditTxDescription] = useState(tx.description || '');
  const [editTxDate, setEditTxDate] = useState(parsePolishDateToISO(tx.date));

  const handleSubmit = (e) => {
    e.preventDefault();
    const isIncome = editTxType === 'Income';
    const selectedCat = isIncome ? null : categories.find(c => c.name === editTxCategoryName);
    
    const icon = isIncome ? '💵' : (selectedCat ? selectedCat.icon : '💰');
    const parsedAmount = parseFloat(editTxAmount);
    const finalAmount = isIncome ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);

    onUpdate({
      ...tx,
      title: editTxTitle,
      category: isIncome ? 'Przychód' : editTxCategoryName,
      icon: icon,
      amount: finalAmount,
      type: editTxType,
      description: editTxDescription,
      date: formatToPolishDate(editTxDate)
    });
  };

  return (
    <div style={{ ...styles.viewCard, maxWidth: '580px', margin: '0 auto', borderTop: '5px solid #0056b3' }}>
      <h2 style={styles.sectionTitle}>📝 Modyfikuj parametry transakcji</h2>
      <p style={{ fontSize: '14px', color: '#111', fontWeight: 'bold', marginBottom: '22px' }}>Edytujesz pozycję o ID: {tx.id}</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Zmień typ transakcji:</label>
          <select value={editTxType} onChange={(e) => setEditTxType(e.target.value)} style={styles.select}>
            <option value="Expense">Expense (Wydatek)</option>
            <option value="Income">Income (Przychód)</option>
          </select>
        </div>

        {editTxType === 'Expense' && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Przypisana kategoria:</label>
            <select value={editTxCategoryName} onChange={(e) => setEditTxCategoryName(e.target.value)} style={styles.select}>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Zmień datę transakcji:</label>
          <input type="date" value={editTxDate} onChange={(e) => setEditTxDate(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Wartość transakcji (zł):</label>
          <input type="number" step="0.01" value={editTxAmount} onChange={(e) => setEditTxAmount(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Zmień tytuł:</label>
          <input type="text" value={editTxTitle} onChange={(e) => setEditTxTitle(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Edytuj treść opisu:</label>
          <textarea value={editTxDescription} onChange={(e) => setEditTxDescription(e.target.value)} rows="3" style={styles.textarea}></textarea>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button type="submit" style={{ ...styles.button, backgroundColor: '#0056b3', flex: 2 }}>
            🔄 Update transaction
          </button>
          <button type="button" onClick={() => { if(confirm('Usunąć tę transakcję?')) onDelete(tx.id); }} style={styles.deleteBtn}>
            🗑️ Usuń
          </button>
        </div>
        
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Powrót bez zapisywania
        </button>
      </form>
    </div>
  );
}

const styles = {
  viewCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid #ced4da' },
  sectionTitle: { margin: '0 0 15px 0', fontSize: '22px', color: '#111', fontWeight: '800', borderBottom: '2px solid #0056b3', paddingBottom: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '800', color: '#111' },
  input: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600' },
  select: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600', height: '48px' },
  textarea: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600', fontFamily: 'inherit' },
  button: { color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
  deleteBtn: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', flex: 1 },
  cancelButton: { backgroundColor: '#495057', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', marginTop: '8px', width: '100%' }
};
