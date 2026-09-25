import { ArrowLeft, BarChart3, CircleAlert, LoaderCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useStatistics } from '../../shared/hooks/useStatistics';
import { INCOME_TYPE } from '../../utils/enums.js';
import './StatisticsPage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
const hasValue = (value) => value !== undefined && value !== null && value !== '';
const getPathValue = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
const getFirstPathValue = (statistics, paths) => paths.reduce((value, path) => (hasValue(value) ? value : getPathValue(statistics, path)), undefined);
const getAmount = (value) => {
  if (typeof value === 'object' && value !== null) return Number(value.total ?? value.amount ?? value.value ?? value.monthly ?? value.annual) || 0;
  return Number(value) || 0;
};
const formatAmount = (value) => currency.format(getAmount(value));
const getProgressValue = (progress) => getAmount(progress?.percentage ?? progress?.percent ?? progress?.progress ?? progress);
const getGroupedIncomes = (statistics) => getFirstPathValue(statistics, ['incomeByType', 'incomesByType', 'groupedIncome', 'incomeGroupedByType', 'income.annualIncomeByType']) || {};

const getIncomeLabel = (key) => INCOME_TYPE[key]?.label || key.replaceAll('_', ' ').toLowerCase();

export const StatisticsPage = () => {
  const { statistics, isLoading, error, loadStatistics } = useStatistics();
  const projectedMonthly = getFirstPathValue(statistics, ['projectedMonthlyIncome', 'monthlyProjectedIncome', 'projectedIncomeMonthly', 'monthlyIncome', 'projectedIncome.monthly', 'projectedIncome.monthlyIncome', 'projectedIncomes.monthly', 'income.projectedMonthlyIncome']);
  const projectedAnnual = getFirstPathValue(statistics, ['projectedAnnualIncome', 'annualProjectedIncome', 'projectedIncomeAnnual', 'annualIncome', 'projectedIncome.annual', 'projectedIncome.annualIncome', 'projectedIncomes.annual', 'income.projectedAnnualIncome']);
  const irregularIncome = getFirstPathValue(statistics, ['irregularIncome', 'irregularIncomes', 'totalIrregularIncome', 'irregularIncome.total', 'irregularIncomes.total', 'income.irregularIncome']);
  const deposited = getFirstPathValue(statistics, ['totalDeposited', 'totalDeposit', 'deposited', 'savings.totalDeposited']);
  const withdrawn = getFirstPathValue(statistics, ['totalWithdrawn', 'totalWithdraw', 'withdrawn', 'totalRetired', 'savings.totalWithdrawn']);
  const netSavings = getFirstPathValue(statistics, ['netSavings', 'netSaving', 'savingsNet', 'savings.netSavings']);
  const expenses = getFirstPathValue(statistics, ['expenses', 'totalExpenses', 'monthlyExpenses', 'financial.monthlyExpenses']);
  const availableMonthly = getFirstPathValue(statistics, ['availableMonthly', 'monthlyAvailableMoney', 'availableMoneyMonthly', 'availableMoney.monthly', 'availableMoney.monthlyMoney', 'available.monthly', 'financial.monthlyAvailableAmount']);
  const availableAnnual = getFirstPathValue(statistics, ['availableAnnual', 'annualAvailableMoney', 'availableMoneyAnnual', 'availableMoney.annual', 'availableMoney.annualMoney', 'available.annual', 'financial.annualAvailableAmount']);
  const goalProgress = getFirstPathValue(statistics, ['activeGoalProgress', 'goalProgress', 'progress', 'activeGoal.progress', 'activeGoal.progressPercentage', 'goal.progress', 'goal.progressPercentage']);
  const progressValue = Math.min(Math.max(getProgressValue(goalProgress), 0), 100);
  const groupedIncomes = getGroupedIncomes(statistics);
  const groupedEntries = Array.isArray(groupedIncomes) ? groupedIncomes : Object.entries(groupedIncomes).map(([type, amount]) => ({ type, amount }));

  if (isLoading) return <main className='statistics-page'><Navbar /><section className='statistics-empty'><LoaderCircle className='spin' size={32} aria-hidden='true' /><p>Cargando tus estadísticas...</p></section><Footer /></main>;
  if (error) return <main className='statistics-page'><Navbar /><section className='statistics-error'><CircleAlert size={32} aria-hidden='true' /><p>{error}</p><button className='goal-primary-button' type='button' onClick={loadStatistics}>Intentar de nuevo</button></section><Footer /></main>;
  if (!statistics) return <main className='statistics-page'><Navbar /><section className='statistics-empty'><BarChart3 size={32} aria-hidden='true' /><p>Aún no hay estadísticas disponibles.</p></section><Footer /></main>;

  return <main className='statistics-page'><Navbar /><section className='statistics-shell'><div className='statistics-topbar'><div><span className='goal-eyebrow'>Estadísticas</span><h1>Una mirada clara a tu avance.</h1><p className='statistics-intro'>Estos datos son calculados por tu información financiera, ingresos y movimientos registrados.</p></div><Link className='goal-quiet-button' to='/goal'><ArrowLeft size={16} aria-hidden='true' /> Volver a mi meta</Link></div><section className='statistics-section'><div className='statistics-section-heading'><span className='goal-eyebrow'>Proyección</span><h2>Ingresos y disponibilidad.</h2></div><div className='statistics-grid'><article className='statistics-card'><span>Ingresos proyectados mensuales</span><strong>{formatAmount(projectedMonthly)}</strong></article><article className='statistics-card'><span>Ingresos proyectados anuales</span><strong>{formatAmount(projectedAnnual)}</strong></article><article className='statistics-card'><span>Ingresos irregulares</span><strong>{formatAmount(irregularIncome)}</strong></article><article className='statistics-card statistics-card-accent'><span>Dinero disponible mensual</span><strong>{formatAmount(availableMonthly)}</strong></article><article className='statistics-card statistics-card-accent'><span>Dinero disponible anual</span><strong>{formatAmount(availableAnnual)}</strong></article></div></section><section className='statistics-section'><div className='statistics-section-heading'><span className='goal-eyebrow'>Movimientos</span><h2>Lo que ha pasado con tu ahorro.</h2></div><div className='statistics-grid'><article className='statistics-card'><span>Total depositado</span><strong>{formatAmount(deposited)}</strong></article><article className='statistics-card'><span>Total retirado</span><strong>{formatAmount(withdrawn)}</strong></article><article className='statistics-card statistics-card-accent'><span>Ahorro neto</span><strong>{formatAmount(netSavings)}</strong></article><article className='statistics-card'><span>Gastos</span><strong>{formatAmount(expenses)}</strong></article></div></section><section className='statistics-section'><div className='statistics-section-heading'><span className='goal-eyebrow'>Meta activa</span><h2>Progreso actual.</h2></div><div className='statistics-progress'><Target size={24} aria-hidden='true' /><div className='statistics-progress-line' aria-label={`${Math.round(progressValue)}% de progreso`}><span style={{ width: `${progressValue}%` }} /></div><div className='statistics-progress-caption'><span>{Math.round(progressValue)}% completado</span><span>{hasValue(goalProgress?.remaining) ? `${formatAmount(goalProgress.remaining)} restantes` : 'Según los datos de tu meta activa'}</span></div></div></section><section className='statistics-section'><div className='statistics-section-heading'><span className='goal-eyebrow'>Ingresos</span><h2>Distribución por tipo.</h2></div>{groupedEntries.length === 0 ? <div className='statistics-empty'><p>No hay ingresos agrupados por tipo.</p></div> : <div className='statistics-table-wrap'><table className='statistics-table'><thead><tr><th scope='col'>Tipo</th><th scope='col'>Monto</th></tr></thead><tbody>{groupedEntries.map((entry) => <tr key={entry.type || entry.name}><td>{getIncomeLabel(entry.type || entry.name)}</td><td>{formatAmount(entry.amount ?? entry.total ?? entry.value)}</td></tr>)}</tbody></table></div>}</section></section><Footer /></main>;
};