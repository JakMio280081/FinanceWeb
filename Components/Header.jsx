import React from 'react';

export default function Header({ currentView, setCurrentView }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerTop}>
        <h1 style={styles.logo}>FinanceApp <span style={styles.badge}>Control Center</span></h1>
        <p style={styles.subtitle}>Zarządzanie systemem finansowym</p>
      </div>
      
      <nav style={styles.navBar}>
        <button 
          style={{ 
            ...styles.navButton, 
            backgroundColor: currentView === 'history' ? '#008564' : '#144c3e',
            border: currentView === 'history' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.4)'
          }} 
          onClick={() => setCurrentView('history')}
        >
          📊 Lista i Modyfikacja Transakcji
        </button>
        <button 
          style={{ 
            ...styles.navButton, 
            backgroundColor: currentView === 'categories' ? '#008564' : '#144c3e',
            border: currentView === 'categories' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.4)'
          }} 
          onClick={() => setCurrentView('categories')}
        >
          📁 Zarządzanie Kategoriami
        </button>
        <button 
          style={{ 
            ...styles.navButton, 
            backgroundColor: currentView === 'addTransaction' ? '#008564' : '#144c3e',
            border: currentView === 'addTransaction' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.4)'
          }} 
          onClick={() => setCurrentView('addTransaction')}
        >
          ➕ Nowa Transakcja (Mobilna)
        </button>
      </nav>
    </header>
  );
}

const styles = {
  header: { backgroundColor: '#00CB99', color: '#fff', padding: '20px 40px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  headerTop: { marginBottom: '15px' },
  logo: { margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '0.5px' },
  badge: { backgroundColor: '#111', color: '#fff', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', marginLeft: '10px', fontWeight: '800' },
  subtitle: { margin: '5px 0 0 0', opacity: 1, color: '#f8f9fa', fontSize: '14px', fontWeight: '500' },
  navBar: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  navButton: { color: '#fff', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.15s ease-in-out', border: 'none' }
};
