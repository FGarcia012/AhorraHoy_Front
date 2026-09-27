import { ArrowRight, BarChart3, ShieldCheck, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import './HomePage.css';

export const HomePage = () => {
	const navigate = useNavigate();

	return (
		<main className='home-page'>
			<Navbar />
			<section className='hero-section'>
				<div className='hero-copy'>
					<span className='eyebrow'>Tu dinero, con dirección</span>
					<h1>Convierte tus planes en ahorro real.</h1>
					<p>Organiza tus metas, entiende tus movimientos y avanza con una vista clara de tus finanzas.</p>
					<div className='hero-actions'>
						<button className='primary-action' type='button' onClick={() => navigate('/register')}>Crear mi cuenta <ArrowRight size={18} aria-hidden='true' /></button>
						<button className='secondary-action' type='button' onClick={() => navigate('/auth')}>Ya tengo una cuenta</button>
					</div>
				</div>
				<div className='hero-card' aria-label='Resumen de ahorro de ejemplo'>
					<div className='hero-card-topline'><span>Meta del mes</span><span className='status-pill'>En camino</span></div>
					<div className='goal-symbol'><Target size={28} aria-hidden='true' /></div>
					<h2>Viaje a la playa</h2>
					<p className='goal-amount'>Q 3,450 <span>/ Q 5,000</span></p>
					<div className='progress-track'><span /></div>
					<div className='progress-caption'><span>69% completado</span><span>Q 1,550 faltan</span></div>
					<div className='hero-stat-row'><span><BarChart3 size={16} aria-hidden='true' /> Aporte mensual</span><strong>Q 500</strong></div>
				</div>
			</section>
			<section id='beneficios' className='benefits-section'>
				<div className='section-heading'><span className='eyebrow'>Todo en un solo lugar</span><h2>Una forma más tranquila de tomar decisiones.</h2></div>
				<div className='benefit-grid'>
					<article className='benefit-card'><Target aria-hidden='true' /><h3>Metas visibles</h3><p>Conoce cuánto has avanzado y qué necesitas para llegar.</p></article>
					<article className='benefit-card'><BarChart3 aria-hidden='true' /><h3>Datos que ayudan</h3><p>Revisa ingresos, gastos y movimientos sin perder contexto.</p></article>
					<article className='benefit-card'><ShieldCheck aria-hidden='true' /><h3>Tu información, cuidada</h3><p>Accede a tu espacio personal con una sesión protegida.</p></article>
				</div>
			</section>
			<Footer />
		</main>
	);
};
