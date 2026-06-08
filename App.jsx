import React, { useState } from 'react';
import Header from './components/Header';
import HistoryView from './views/HistoryView';
import CategoriesView from './views/CategoriesView';
import AddTransactionView from './views/AddTransactionView';
import EditTransactionView from './views/EditTransactionView';

export default function App() {
  const [currentView, setCurrentView] = useState('history');
  const [selectedTxId, setSelectedTxId] = useState(null);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Zakupy', icon: '🛒' },
    { id: 2, name: 'Opłaty stałe', icon: '💡' },
    { id: 3, name: 'Transport', icon: '🚌' },
    { id: 4, name: 'Podróże', icon: '🌴' },
    { id: 5, name: 'Ubrania', icon: '🛍️' },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Zakupy spożywcze', category: 'Zakupy', icon: '🛒', amount: -65.00, date: '27 maja', type: 'Expense', description: 'Różne drobiazgi w markecie' },
    { id: 2, title: 'Rachunek za prąd', category: 'Opłaty stałe', icon: '💡', amount: -140.00, date: '27 maja', type: 'Expense', description: 'Opłata za maj' },
    { id: 3, title: 'Bilet miesięczny', category: 'Transport', icon: '🚌', amount: -30.54, date: '24 maja', type: 'Expense', description: 'Komunikacja miejska' },
    { id: 4, title: 'Rezerwacja hotelu', category: 'Podróże', icon: '🌴', amount: -250.00, date: '23 maja', type: 'Expense', description: 'Zaliczka na weekend' },
    { id: 5, title: 'Kurtka wiosenna', category: 'Ubrania', icon: '🛍️', amount: -180.00, date: '22 maja', type: 'Expense', description: 'Zakupy w galerii' },
    { id: 6, title: 'Wypłata główna', category: 'Przychód', icon: '💵', amount: 3200.00, date: '28 maja', type: 'Income', description: 'Przelew miesięczny' },
  ]);

  const selectedTx = transactions.find(t => t.id === selectedTxId);

  return (
    <div style={{ ...styles.appContainer }}>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main style={{ padding: '30px 40px' }}>
        {currentView === 'history' && (
          <HistoryView 
            transactions={transactions} 
            onEditClick={(id) => { setSelectedTxId(id); setCurrentView('editTransaction'); }} 
          />
        )}
        
        {currentView === 'categories' && (
          <CategoriesView categories={categories} setCategories={setCategories} />
        )}
        
        {currentView === 'addTransaction' && (
          <AddTransactionView 
            categories={categories} 
            onAdd={(newTx) => { setTransactions([newTx, ...transactions]); setCurrentView('history'); }} 
          />
        )}
        
        {currentView === 'editTransaction' && selectedTx && (
          <EditTransactionView 
            tx={selectedTx} 
            categories={categories}
            onUpdate={(updatedTx) => {
              setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
              setCurrentView('history');
            }}
            onDelete={(id) => {
              setTransactions(transactions.filter(t => t.id !== id));
              setCurrentView('history');
            }}
            onCancel={() => setCurrentView('history')}
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  appContainer: { fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#e9ecef', minHeight: '100vh', paddingBottom: '60px' }
};
