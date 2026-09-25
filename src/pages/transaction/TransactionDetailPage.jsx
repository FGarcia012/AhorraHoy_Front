import { ArrowLeft, CircleAlert, History, LoaderCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useTransactionDetail } from '../../shared/hooks/useTransaction';
import { TRANSACTION_TYPE } from '../../utils/enums.js';
import '../goal/GoalPage.css';
import './Transaction.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

const getTransactionDate = (transaction) => transaction?.createdAt || transaction?.date || transaction?.transactionDate;

export const TransactionDetailPage = () => {
  const { tid } = useParams();
  const { transaction, isLoading, error, loadTransaction } = useTransactionDetail(tid);
  const transactionType = transaction && TRANSACTION_TYPE[transaction.type];
  const transactionDate = getTransactionDate(transaction);

  return (
    <main className='goal-page'>
      <Navbar />
      <section className='goal-shell'>
        <div className='goal-topbar'><div><span className='goal-eyebrow'>Detalle del movimiento</span><h1>Consulta tu transacción.</h1></div><Link className='goal-quiet-button' to='/transactions'><ArrowLeft size={16} aria-hidden='true' /> Volver al historial</Link></div>
        {isLoading ? <div className='goal-transactions-state'><LoaderCircle className='spin' size={24} aria-hidden='true' /><span>Cargando transacción...</span></div> : error ? <div className='goal-transactions-state goal-transactions-error' role='alert'><CircleAlert size={20} aria-hidden='true' /><span>{error}</span><button className='goal-secondary-button' type='button' onClick={loadTransaction}>Intentar de nuevo</button></div> : transaction ? <section className='transaction-detail' aria-labelledby='transaction-detail-title'><div className='transaction-detail-heading'><History size={28} aria-hidden='true' /><div><span className={`goal-transaction-type goal-transaction-${transaction.type?.toLowerCase()}`}>{transactionType?.label || 'Movimiento'}</span><h2 id='transaction-detail-title'>Movimiento registrado</h2></div></div><dl className='transaction-detail-list'><div><dt>Monto</dt><dd>{currency.format(Number(transaction.amount) || 0)}</dd></div><div><dt>Fecha</dt><dd>{transactionDate ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(transactionDate)) : 'Sin fecha'}</dd></div><div><dt>Meta</dt><dd>{transaction.goal?.name || transaction.goalName || 'Meta de ahorro'}</dd></div><div><dt>Descripción</dt><dd>{transaction.description || 'Sin descripción'}</dd></div></dl></section> : <div className='goal-transactions-state'><History size={22} aria-hidden='true' /><span>No encontramos esta transacción.</span></div>}
      </section>
      <Footer />
    </main>
  );
};