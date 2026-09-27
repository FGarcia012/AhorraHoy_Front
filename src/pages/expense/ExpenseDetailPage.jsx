import { ArrowLeft, CircleAlert, CreditCard, LoaderCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { ExpenseForm } from '../../components/expense/ExpenseForm.jsx';
import { useExpenseDetail } from '../../shared/hooks/useExpense.jsx';
import { EXPENSE_CATEGORY, RECURRENCE_FREQUENCY } from '../../utils/enums.js';
import '../income/IncomePage.css';
import './ExpensePage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
export const ExpenseDetailPage = () => {
  const { eid } = useParams();
  const { expense, isLoading, isMutating, error, loadExpense, update } = useExpenseDetail(eid);
  const category = expense && EXPENSE_CATEGORY[expense.category];
  const frequency = expense && RECURRENCE_FREQUENCY[expense.frequency];
  return <main className='expense-page'><Navbar /><section className='income-shell'><div className='income-topbar'><div><span className='goal-eyebrow'>Detalle de gasto</span><h1>Revisa y actualiza este gasto.</h1></div><Link className='goal-quiet-button' to='/expenses'><ArrowLeft size={16} aria-hidden='true' /> Volver a gastos</Link></div>{isLoading ? <div className='income-empty'><LoaderCircle className='spin' size={30} aria-hidden='true' /><p>Cargando gasto...</p></div> : error ? <div className='income-empty income-alert' role='alert'><CircleAlert size={24} aria-hidden='true' /><p>{error}</p><button className='goal-secondary-button' type='button' onClick={loadExpense}>Intentar de nuevo</button></div> : expense ? <div className='income-layout'><section className='income-panel'><div className='income-form-heading'><CreditCard size={24} aria-hidden='true' /><div><span className='income-badge'>{category?.label || 'Gasto'}</span><h2>{currency.format(Number(expense.amount) || 0)}</h2><p>{frequency?.label || 'Frecuencia no indicada'}</p></div></div>{expense.description && <p className='income-intro'>{expense.description}</p>}</section><section className='income-panel'><h2>Editar gasto</h2><ExpenseForm key={eid} initialValue={expense} onSubmit={update} isSubmitting={isMutating} submitLabel='Guardar cambios' /></section></div> : <div className='income-empty'><CreditCard size={28} aria-hidden='true' /><p>No encontramos este gasto.</p></div>}</section><Footer /></main>;
};
