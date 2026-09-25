import { ArrowLeft, CircleAlert, Coins, LoaderCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { IncomeForm } from '../../components/income/IncomeForm';
import { useIncomeDetail } from '../../shared/hooks/useIncome';
import { formatIncomeDate } from '../../utils/income.js';
import { INCOME_FREQUENCY, INCOME_TYPE } from '../../utils/enums.js';
import './IncomePage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

export const IncomeDetailPage = () => {
  const { iid } = useParams();
  const { income, isLoading, isMutating, error, loadIncome, update } = useIncomeDetail(iid);
  const incomeType = income && INCOME_TYPE[income.type];
  const frequency = income && INCOME_FREQUENCY[income.frequency];

  return <main className='income-page'><Navbar /><section className='income-shell'><div className='income-topbar'><div><span className='goal-eyebrow'>Detalle de ingreso</span><h1>Revisa y actualiza este ingreso.</h1></div><Link className='goal-quiet-button' to='/income'><ArrowLeft size={16} aria-hidden='true' /> Volver a ingresos</Link></div>{isLoading ? <div className='income-empty'><LoaderCircle className='spin' size={30} aria-hidden='true' /><p>Cargando ingreso...</p></div> : error ? <div className='income-empty income-alert' role='alert'><CircleAlert size={24} aria-hidden='true' /><p>{error}</p><button className='goal-secondary-button' type='button' onClick={loadIncome}>Intentar de nuevo</button></div> : income ? <div className='income-layout'><section className='income-panel'><div className='income-form-heading'><Coins size={24} aria-hidden='true' /><div><span className='income-badge'>{incomeType?.label || 'Ingreso'}</span><h2>{currency.format(Number(income.amount) || 0)}</h2><p>{frequency?.label || 'Frecuencia no indicada'} · {formatIncomeDate(income)}</p></div></div>{income.description && <p className='income-intro'>{income.description}</p>}</section><section className='income-panel'><h2>Editar ingreso</h2><IncomeForm key={iid} initialValue={income} onSubmit={update} isSubmitting={isMutating} submitLabel='Guardar cambios' /></section></div> : <div className='income-empty'><Coins size={28} aria-hidden='true' /><p>No encontramos este ingreso.</p></div>}</section><Footer /></main>;
};