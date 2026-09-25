import { CircleAlert, History, LoaderCircle } from 'lucide-react';
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

  return (
    <main className='goal-page'>
      <Navbar />
      <section className='goal-shell'>
        <div className='goal-topbar'>
          <div><span className='goal-eyebrow'>Historial personal</span><h1>Todos tus movimientos.</h1></div>
          <Link className='goal-quiet-button' to='/goal'>Volver a mi meta</Link>
        </div>
        {isLoading ? <div className='goal-transactions-state'><LoaderCircle className='spin' size={24} aria-hidden='true' /><span>Cargando movimientos...</span></div> : error ? <div className='goal-transactions-state goal-transactions-error' role='alert'><CircleAlert size={20} aria-hidden='true' /><span>{error}</span><button className='goal-secondary-button' type='button' onClick={loadTransactions}>Intentar de nuevo</button></div> : transactions.length === 0 ? <div className='goal-transactions-state'><History size={22} aria-hidden='true' /><span>Aún no tienes movimientos registrados.</span></div> : <div className='goal-transactions-table-wrap'><table className='goal-transactions-table'><caption className='visually-hidden'>Todos tus movimientos</caption><thead><tr><th scope='col'>Tipo</th><th scope='col'>Meta</th><th scope='col'>Monto</th><th scope='col'>Fecha</th></tr></thead><tbody>{transactions.map((transaction) => { const transactionType = TRANSACTION_TYPE[transaction.type]; const transactionDate = transaction.createdAt || transaction.date || transaction.transactionDate; const goalName = transaction.goal?.name || transaction.goalName || 'Meta de ahorro'; return <tr key={transaction._id || transaction.tid || transaction.id}><td><span className={`goal-transaction-type goal-transaction-${transaction.type?.toLowerCase()}`}>{transactionType?.label || 'Movimiento'}</span></td><td>{goalName}</td><td className='goal-transaction-amount'>{currency.format(Number(transaction.amount) || 0)}</td><td>{transactionDate ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(transactionDate)) : 'Sin fecha'}</td></tr>; })}</tbody></table></div>}
      </section>
      <Footer />
    </main>
  );
};