import { CircleAlert, History, LoaderCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useUser } from '../../contexts/userContext.js';
import { useTransaction } from '../../shared/hooks/useTransaction';
import { TRANSACTION_TYPE } from '../../utils/enums.js';
import '../goal/GoalPage.css';
import './Transaction.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

export const TransactionPage = () => {
  const { user } = useUser();
  const { transactions, isLoading, error, loadTransactions } = useTransaction(user?.uid, 'user');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTransactions = transactions.filter((transaction) => {
    const goalName = transaction.goal?.name || transaction.goalName || transaction.goal?.goalName || '';
    const amount = String(transaction.amount ?? '');
    const dateValue = transaction.createdAt || transaction.date || transaction.transactionDate;
    const transactionDate = dateValue ? new Date(dateValue).toISOString().slice(0, 10) : '';
    const matchesSearch = !normalizedSearch || goalName.toLowerCase().includes(normalizedSearch) || amount.includes(normalizedSearch);
    return matchesSearch && (!dateFilter || transactionDate === dateFilter);
  });

  return (
    <main className='goal-page'>
      <Navbar />
      <section className='goal-shell'>
        <div className='goal-topbar'>
          <div><span className='goal-eyebrow'>Historial personal</span><h1>Todos tus movimientos.</h1></div>
          <Link className='goal-quiet-button' to='/goal'>Volver a mi meta</Link>
        </div>
        {isLoading ? <div className='goal-transactions-state'><LoaderCircle className='spin' size={24} aria-hidden='true' /><span>Cargando movimientos...</span></div> : error ? <div className='goal-transactions-state goal-transactions-error' role='alert'><CircleAlert size={20} aria-hidden='true' /><span>{error}</span><button className='goal-secondary-button' type='button' onClick={loadTransactions}>Intentar de nuevo</button></div> : transactions.length === 0 ? <div className='goal-transactions-state'><History size={22} aria-hidden='true' /><span>Aún no tienes movimientos registrados.</span></div> : <><div className='transaction-filters'><label className='goal-search'><Search size={18} aria-hidden='true' /><span className='visually-hidden'>Buscar por nombre de meta o monto</span><input type='search' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder='Buscar por meta o monto' /></label><label className='transaction-date-filter'>Fecha<input type='date' value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label></div>{filteredTransactions.length === 0 ? <div className='goal-transactions-state'><History size={22} aria-hidden='true' /><span>No encontramos movimientos con esos filtros.</span></div> : <div className='goal-transactions-table-wrap'><table className='goal-transactions-table'><caption className='visually-hidden'>Todos tus movimientos</caption><thead><tr><th scope='col'>Tipo</th><th scope='col'>Meta</th><th scope='col'>Monto</th><th scope='col'>Fecha</th><th scope='col'>Acción</th></tr></thead><tbody>{filteredTransactions.map((transaction) => { const transactionType = TRANSACTION_TYPE[transaction.type]; const transactionDate = transaction.createdAt || transaction.date || transaction.transactionDate; const goalName = transaction.goal?.name || transaction.goalName || 'Meta de ahorro'; const transactionId = transaction._id || transaction.tid || transaction.id; return <tr key={transactionId}><td><span className={`goal-transaction-type goal-transaction-${transaction.type?.toLowerCase()}`}>{transactionType?.label || 'Movimiento'}</span></td><td>{goalName}</td><td className='goal-transaction-amount'>{currency.format(Number(transaction.amount) || 0)}</td><td>{transactionDate ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(transactionDate)) : 'Sin fecha'}</td><td><Link to={`/transactions/${transactionId}`}>Ver detalle</Link></td></tr>; })}</tbody></table></div>}</>}
      </section>
      <Footer />
    </main>
  );
};