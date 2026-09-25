import { ArrowLeft, CircleAlert, Coins, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { IncomeForm } from '../../components/income/IncomeForm';
import { useIncome } from '../../shared/hooks/useIncome';
import { formatIncomeDate, getIncomeId } from '../../utils/income.js';
import { INCOME_FREQUENCY, INCOME_TYPE } from '../../utils/enums.js';
import './IncomePage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

export const IncomePage = () => {
  const { incomes, isLoading, isMutating, error, create } = useIncome();

  return <main className='income-page'><Navbar /><section className='income-shell'><div className='income-topbar'><div><span className='goal-eyebrow'>Ingresos</span><h1>Registra el dinero que llega a tu vida.</h1><p className='income-intro'>Los ingresos registrados no son depósitos a una meta. Aquí puedes organizarlos para entender mejor tus posibilidades financieras.</p></div><Link className='goal-quiet-button' to='/goal'><ArrowLeft size={16} aria-hidden='true' /> Volver a mi meta</Link></div>{error && <div className='income-alert' role='alert'><CircleAlert size={18} aria-hidden='true' /> {error}</div>}<div className='income-layout'><section className='income-panel' aria-labelledby='income-list-title'><h2 id='income-list-title'>Mis ingresos</h2>{isLoading ? <div className='income-empty'><LoaderCircle className='spin' size={26} aria-hidden='true' /><p>Cargando ingresos...</p></div> : incomes.length === 0 ? <div className='income-empty'><Coins size={28} aria-hidden='true' /><p>Aún no tienes ingresos registrados.</p></div> : <div className='income-list'>{incomes.map((income) => { const incomeId = getIncomeId(income); const incomeType = INCOME_TYPE[income.type]; const frequency = INCOME_FREQUENCY[income.frequency]; return <article className='income-card' key={incomeId}><div><span className='income-badge'>{incomeType?.label || 'Ingreso'}</span><h3>{currency.format(Number(income.amount) || 0)}</h3><p>{frequency?.label || 'Frecuencia no indicada'} · {formatIncomeDate(income)}</p>{income.description && <p>{income.description}</p>}</div><Link className='income-card-action' to={`/income/${incomeId}`}>Ver y editar</Link></article>; })}</div>}</section><section className='income-panel' aria-labelledby='income-form-title'><h2 id='income-form-title'>Registrar ingreso</h2><IncomeForm onSubmit={create} isSubmitting={isMutating} submitLabel='Registrar ingreso' /></section></div></section><Footer /></main>;
};