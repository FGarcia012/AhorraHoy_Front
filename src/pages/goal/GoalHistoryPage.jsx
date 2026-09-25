import { CircleAlert, LoaderCircle, Search, Target } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useUser } from '../../contexts/userContext.js';
import { useGoalHistory } from '../../shared/hooks/useGoalQueries';
import { getGoalPictureUrl } from '../../utils/files.js';
import { GOAL_STATUS } from '../../utils/enums.js';
import './GoalPage.css';
import './GoalCatalog.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
const getGoalId = (goal) => goal?._id || goal?.gid || goal?.id;
const getStatusLabel = (status) => Object.values(GOAL_STATUS).find((item) => item.value === status)?.label || status || 'Sin estado';

export const GoalHistoryPage = () => {
  const { user } = useUser();
  const { goals, isLoading, error, loadHistory } = useGoalHistory(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredGoals = goals.filter((goal) => (goal.name || 'Meta sin nombre').toLowerCase().includes(normalizedSearch));

  return <main className='goal-page'><Navbar /><section className='goal-shell'><div className='goal-topbar goal-history-topbar'><div><span className='goal-eyebrow'>Mis metas</span><h1>Todo lo que has querido alcanzar.</h1></div><Link className='goal-quiet-button' to='/goal'>Ver meta activa</Link></div>{isLoading ? <div className='goal-state'><LoaderCircle className='spin' size={32} aria-hidden='true' /><p>Cargando historial de metas...</p></div> : error ? <div className='goal-state'><CircleAlert size={32} aria-hidden='true' /><p>{error}</p><button className='goal-primary-button' type='button' onClick={loadHistory}>Intentar de nuevo</button></div> : goals.length === 0 ? <div className='goal-transactions-state goal-catalog-empty'><Target size={28} aria-hidden='true' /><span>Aún no tienes metas registradas.</span><Link className='goal-primary-button' to='/goal'>Crear una meta</Link></div> : <><label className='goal-search'><Search size={18} aria-hidden='true' /><span className='visually-hidden'>Buscar meta por nombre</span><input type='search' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder='Buscar meta por nombre' /></label>{filteredGoals.length === 0 ? <div className='goal-transactions-state goal-catalog-empty'><Target size={28} aria-hidden='true' /><span>No encontramos metas con ese nombre.</span></div> : <div className='goal-catalog'>{filteredGoals.map((goal) => { const goalId = getGoalId(goal); const currentAmount = Number(goal.currentAmount) || 0; const targetAmount = Number(goal.targetAmount) || 0; const pictureUrl = getGoalPictureUrl(goal.goalPicture); return <article className='goal-catalog-card' key={goalId}><div className='goal-catalog-card-header'><div><span className={`goal-status goal-status-${goal.status?.toLowerCase()}`}>{getStatusLabel(goal.status)}</span><h2>{goal.name || 'Meta sin nombre'}</h2></div><div className='goal-catalog-card-image'>{pictureUrl ? <img src={pictureUrl} alt={`Imagen de ${goal.name}`} /> : <Target size={28} aria-hidden='true' />}</div></div><div className='goal-catalog-card-stats'><div><span>Ahorrado</span><strong>{currency.format(currentAmount)}</strong></div><div><span>Objetivo</span><strong>{currency.format(targetAmount)}</strong></div></div><div className='goal-catalog-card-actions'><Link className='goal-secondary-button' to={`/goals/${goalId}`}>Ver meta y movimientos</Link></div></article>; })}</div>}</>}</section><Footer /></main>;
};