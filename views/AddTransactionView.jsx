import React, { useState } from 'react';

export default function AddTransactionView({ categories, onAdd }) {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  const [txTitle, setTxTitle] = useState('');
  const [txType, setTxType] = useState('Expense');
  const [txCategoryName, setTxCategoryName] = useState(categories[0]?.name || 'Groceries');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(getTodayDateString());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return alert('Wypełnij tytuł i kwotę!');

    const isIncome = txType === 'Income';
    const selectedCat = isIncome ? null : categories.find(c => c.name === txCategoryName);
    
    const icon = isIncome ? '💵' : (selectedCat ? selectedCat.icon : '💰');
    const parsedAmount = parseFloat(txAmount);
    const finalAmount = isIncome ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);

    onAdd({
      id: Date.now(),
      title: txTitle,
      category: isIncome ? 'Przychód' : txCategoryName,
      icon: icon,
      amount: finalAmount,
      type: txType,
      description: txDescription,
      date: formatToPolishDate(txDate)
    });
  };

  return (
    <div style={{ ...styles.viewCard, maxWidth: '580px', margin: '0 auto' }}>
      <h2 style={styles.sectionTitle}>🔻 Dodaj nową transakcję</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Type (Typ operacji):</label>
          <select value={txType} onChange={(e) => setTxType(e.target.value)} style={styles.select}>
            <option value="Expense">Expense (Wydatek)</option>
            <option value="Income">Income (Przychód)</option>
          </select>
        </div>

        {txType === 'Expense' && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category (Kategoria wydatku):</label>
            <select value={txCategoryName} onChange={(e) => setTxCategoryName(e.target.value)} style={styles.select}>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Data transakcji:</label>
          <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Amount (Kwota w zł):</label>
          <input type="number" step="0.01" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="Wpisz np. 50.00" style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Expense/Income Title (Tytuł główny):</label>
          <input type="text" value={txTitle} onChange={(e) => setTxTitle(e.target.value)} placeholder="np. Zakupy Carrefour" style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description (Opis dodatkowy / Notatki):</label>
          <textarea value={txDescription} onChange={(e) => setTxDescription(e.target.value)} placeholder="Dodatkowe adnotacje..." rows="3" style={styles.textarea}></textarea>
        </div>

        <button type="submit" style={styles.button}>
          💾 Save transaction (Zapisz w bazie)
        </button>
      </form>
    </div>
  );
}

const styles = {
  viewCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid #ced4da' },
  sectionTitle: { margin: '0 0 15px 0', fontSize: '22px', color: '#111', fontWeight: '800', borderBottom: '2px solid #00CB99', paddingBottom: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '800', color: '#111' },
  input: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600' },
  select: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600', height: '48px' },
  textarea: { padding: '12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '15px', color: '#111111', backgroundColor: '#ffffff', fontWeight: '600', fontFamily: 'inherit' },
  button: { color: '#fff', backgroundColor: '#00CB99', border: 'none', padding: '14px 24px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }
};
