import React, { useState } from 'react';

export default function HistoryView({ transactions, onEditClick }) {
  // Stan dla wybranego filtra czasowego i dat niestandardowych
  const [dateFilter, setDateFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const parseToDateObject = (dateStr) => {
    if (!dateStr) return new Date();
    const months = [
      'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
      'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    const parts = dateStr.split(' ');
    if (parts.length !== 2) return new Date(); 
    
    const day = parseInt(parts[0], 10);
    const monthIndex = months.indexOf(parts[1]);
    
    return new Date(2026, monthIndex === -1 ? 5 : monthIndex, day);
  };

  //CHRONOLOGICZNE SORTOWANIE CAŁEJ BAZY
  const cronSortedTransactions = [...transactions].sort((a, b) => {
    return parseToDateObject(b.date) - parseToDateObject(a.date);
  });

  //FILTROWANIE TRANSAKCJI NA PODSTAWIE WYBRANEGO OKRESU
  const filteredTransactions = cronSortedTransactions.filter(tx => {
    const txDate = parseToDateObject(tx.date);
    
    const today = new Date(2026, 5, 2); 
    
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const txDateZero = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());

    const diffTime = startOfToday - txDateZero;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dateFilter === 'day') {
      return diffDays === 0;
    }
    if (dateFilter === 'week') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (dateFilter === 'month') {
      return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
    }
    if (dateFilter === '30days') {
      return diffDays >= 0 && diffDays <= 30;
    }
    if (dateFilter === '90days') {
      return diffDays >= 0 && diffDays <= 90;
    }
    if (dateFilter === 'custom') {
      if (!customStart && !customEnd) return true;
      let match = true;
      if (customStart) {
        const startLimit = new Date(customStart);
        startLimit.setHours(0,0,0,0);
        if (txDateZero < startLimit) match = false;
      }
      if (customEnd) {
        const endLimit = new Date(customEnd);
        endLimit.setHours(23,59,59,999);
        if (txDateZero > endLimit) match = false;
      }
      return match;
    }
    
    return true; // 'all'
  });

  //OBLICZENIA BILANSU
  const totalIncomes = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncomes - totalExpenses;

  const expenseTransactions = filteredTransactions.filter(t => t.amount < 0);
  const categoryTotals = {};
  expenseTransactions.forEach(t => {
    const cat = t.category || 'Inne';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
  });

  const colorPalette = {
    'Zakupy': '#FF6384',
    'Opłaty stałe': '#36A2EB',
    'Transport': '#FFCE56',
    'Podróże': '#4BC0C0',
    'Ubrania': '#9966FF',
    'Inne': '#C9CBCF'
  };

  const categoriesArray = Object.keys(categoryTotals).map(name => ({
    name,
    amount: categoryTotals[name],
    color: colorPalette[name] || '#6c757d'
  }));

  let accumulatedPercentage = 0;
  const gradientParts = categoriesArray.map(cat => {
    const percentage = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
    const start = accumulatedPercentage;
    accumulatedPercentage += percentage;
    return `${cat.color} ${start}% ${accumulatedPercentage}%`;
  });

  const pieChartStyle = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: totalExpenses > 0 ? `conic-gradient(${gradientParts.join(', ')})` : '#e9ecef',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  };

  return (
    <div style={styles.dashboardContainer}>
      
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderLeft: '6px solid #00CB99' }}>
          <span style={styles.cardLabel}>📈 PRZYCHODY W OKRESIE</span>
          <span style={{ ...styles.cardValue, color: '#00CB99' }}>+{totalIncomes.toFixed(2)} zł</span>
        </div>
        
        <div style={{ ...styles.summaryCard, borderLeft: '6px solid #dc3545' }}>
          <span style={styles.cardLabel}>📉 WYDATKI W OKRESIE</span>
          <span style={{ ...styles.cardValue, color: '#dc3545' }}>-{totalExpenses.toFixed(2)} zł</span>
        </div>

        <div style={{ 
          ...styles.summaryCard, 
          borderLeft: `6px solid ${netBalance >= 0 ? '#0056b3' : '#dc3545'}`,
          backgroundColor: netBalance >= 0 ? '#f0f4f8' : '#fff5f5' 
        }}>
          <span style={styles.cardLabel}>💰 BILANS OKRESU</span>
          <span style={{ ...styles.cardValue, color: netBalance >= 0 ? '#0056b3' : '#dc3545' }}>
            {netBalance.toFixed(2)} zł
          </span>
        </div>
      </div>

      <div style={styles.viewCard}>
        <h2 style={styles.sectionTitle}>📊 Struktura procentowa wydatków (wybrany okres)</h2>
        {totalExpenses > 0 ? (
          <div style={styles.chartFlexWrapper}>
            <div style={pieChartStyle}></div>
            <div style={styles.legendGrid}>
              {categoriesArray.map(cat => {
                const pct = ((cat.amount / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={cat.name} style={styles.legendItem}>
                    <span style={{ ...styles.colorDot, backgroundColor: cat.color }}></span>
                    <span style={styles.legendText}>
                      <strong>{cat.name}:</strong> {cat.amount.toFixed(2)} zł ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p style={styles.emptyText}>Brak zarejestrowanych wydatków w wybranym przedziale czasu.</p>
        )}
      </div>

      <div style={styles.viewCard}>
        <div style={styles.listHeaderRow}>
          <h2 style={{ ...styles.sectionTitle, borderBottom: 'none', margin: 0, paddingBottom: 0 }}>
            📜 Wyniki filtrowania ({filteredTransactions.length} pozycji)
          </h2>
          
          {/*pasek filtrów*/}
          <div style={styles.filterInlineWrapper}>
            <div style={styles.inputGroupRow}>
              <label style={styles.filterLabel}>Zakres:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                style={styles.filterSelect}
              >
                <option value="all">Wszystkie</option>
                <option value="day">Ten dzień</option>
                <option value="week">Ostatni tydzień</option>
                <option value="month">Ten miesiąc</option>
                <option value="30days">Ostatnie 30 dni</option>
                <option value="90days">Ostatnie 90 dni</option>
                <option value="custom">Zakres niestandardowy</option>
              </select>
            </div>

            {dateFilter === 'custom' && (
              <div style={styles.customDateWrapper}>
                <div style={styles.inputGroupRow}>
                  <label style={styles.filterLabel}>Od:</label>
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={styles.filterInput} />
                </div>
                <div style={styles.inputGroupRow}>
                  <label style={styles.filterLabel}>Do:</label>
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={styles.filterInput} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ borderBottom: '2px solid #111', marginBottom: '20px', marginTop: '10px' }}></div>

        {filteredTransactions.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Kategoria</th>
                <th style={styles.th}>Tytuł / Nazwa operacji</th>
                <th style={styles.th}>Wartość kwotowa</th>
                <th style={styles.th}>Działanie</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const isIncome = tx.amount > 0;
                return (
                  <tr key={tx.id} style={styles.tr}>
                    <td style={{ ...styles.td, color: '#6c757d', fontWeight: '600', width: '110px' }}>{tx.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: isIncome ? '#e2f7f1' : '#f8f9fa',
                        color: isIncome ? '#00aa7e' : '#111',
                        border: isIncome ? '1px solid #00CB99' : '1px solid #ced4da'
                      }}>
                        {tx.icon} {tx.category}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.txTitle}>{tx.title}</div>
                      {tx.description && <div style={styles.txDesc}>{tx.description}</div>}
                    </td>
                    <td style={{ 
                      ...styles.td, 
                      fontWeight: '800', 
                      fontSize: '15px',
                      color: isIncome ? '#00CB99' : '#dc3545' 
                    }}>
                      {isIncome ? `+${tx.amount.toFixed(2)}` : `${tx.amount.toFixed(2)}`} zł
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => onEditClick(tx.id)} style={styles.editBtn}>
                        ⚙️ Zmień
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={styles.emptyText}>Brak transakcji spełniających kryteria wybranego okresu.</p>
        )}
      </div>

    </div>
  );
}

const styles = {
  dashboardContainer: { display: 'flex', flexDirection: 'column', gap: '25px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
  summaryCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '6px' },
  cardLabel: { fontSize: '12px', fontWeight: '800', color: '#6c757d', letterSpacing: '0.5px' },
  cardValue: { fontSize: '24px', fontWeight: '900' },
  viewCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '25px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid #ced4da' },
  sectionTitle: { fontSize: '18px', color: '#111', fontWeight: '800', borderBottom: '2px solid #111', paddingBottom: '8px' },
  chartFlexWrapper: { display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 0' },
  legendGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 30px', marginLeft: '20px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  colorDot: { width: '12px', height: '12px', borderRadius: '3px', display: 'inline-block' },
  legendText: { fontSize: '14px', color: '#111' },
  emptyText: { color: '#6c757d', fontStyle: 'italic', margin: 0, padding: '10px 0' },
  
  listHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
  filterInlineWrapper: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  customDateWrapper: { display: 'flex', gap: '15px', alignItems: 'center' },
  inputGroupRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  filterLabel: { fontSize: '13px', fontWeight: '800', color: '#111' },
  filterSelect: { padding: '6px 12px', borderRadius: '6px', border: '2px solid #495057', fontSize: '13px', fontWeight: '700', backgroundColor: '#fff', color: '#111', height: '36px' },
  filterInput: { padding: '4px 8px', borderRadius: '6px', border: '2px solid #495057', fontSize: '13px', fontWeight: '600', backgroundColor: '#fff', color: '#111', height: '36px' },

  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '3px solid #111' },
  th: { padding: '12px 10px', color: '#111', fontWeight: '800', fontSize: '14px' },
  tr: { borderBottom: '1px solid #dee2e6' },
  td: { padding: '14px 10px', verticalAlign: 'middle', fontSize: '14px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' },
  txTitle: { fontWeight: '700', color: '#111' },
  txDesc: { fontSize: '12px', color: '#6c757d', marginTop: '2px' },
  editBtn: { backgroundColor: '#111', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }
};
