import { ArrowLeft, BriefcaseBusiness, CircleAlert, LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useFinancial } from '../../shared/hooks/useFinancial';
import { validateFinancialForm } from '../../shared/validators/validateFinancialForm';
import './FinancialPage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
const emptyForm = { hasJob: false, monthlySalary: '' };

const getFormFromFinancial = (financial) => ({
  hasJob: Boolean(financial?.hasJob),
  monthlySalary: financial?.monthlySalary ?? '',
});

const FieldError = ({ message }) => (message ? <span className='financial-field-error'>{message}</span> : null);

export const FinancialPage = () => {
  const { financial, isLoading, isMutating, error, save } = useFinancial();
  const [draft, setDraft] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const form = draft || (financial ? getFormFromFinancial(financial) : emptyForm);
  const updateField = (field, value) => {
    setDraft((previous) => ({ ...(previous || form), [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateFinancialForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || isMutating) return;
    await save(form);
  };

  if (isLoading) return <main className='financial-page'><Navbar /><section className='goal-state'><LoaderCircle className='spin' size={32} aria-hidden='true' /><p>Cargando tu situación financiera...</p></section><Footer /></main>;

  return <main className='financial-page'><Navbar /><section className='financial-shell'><div className='financial-topbar'><div><span className='goal-eyebrow'>Situación financiera</span><h1>Conoce lo que puedes hacer con tu dinero.</h1><p className='financial-intro'>Registra tu situación laboral y consulta el balance calculado con tus gastos.</p></div><Link className='goal-quiet-button' to='/goal'><ArrowLeft size={16} aria-hidden='true' /> Volver a mi meta</Link></div>{error && <div className='financial-alert' role='alert'><CircleAlert size={18} aria-hidden='true' /> {error}</div>}<form className='financial-form' onSubmit={handleSubmit} noValidate><div className='financial-form-heading'><BriefcaseBusiness size={22} aria-hidden='true' /><div><h2>Tu situación actual</h2><p>Estos datos se pueden actualizar cuando cambien tus circunstancias.</p></div></div><label className='financial-toggle'><input type='checkbox' checked={form.hasJob} onChange={(event) => { const hasJob = event.target.checked; updateField('hasJob', hasJob); if (!hasJob) updateField('monthlySalary', ''); }} /> Tengo un trabajo actualmente</label>{form.hasJob && <label className='financial-field'>Salario mensual<input type='number' min='0.01' step='0.01' value={form.monthlySalary} onChange={(event) => updateField('monthlySalary', event.target.value)} aria-invalid={Boolean(formErrors.monthlySalary)} placeholder='Ej. 5000' /><FieldError message={formErrors.monthlySalary} /></label>}<button className='goal-primary-button' type='submit' disabled={isMutating}>{isMutating ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Guardando...</> : <><Save size={18} aria-hidden='true' /> Guardar situación financiera</>}</button></form><section className='financial-summary' aria-label='Resumen financiero'>{financial?.hasJob && <div><span>Salario mensual</span><strong>{currency.format(Number(financial.monthlySalary) || 0)}</strong></div>}<div><span>Estado laboral</span><strong>{financial ? (financial.hasJob ? 'Con trabajo' : 'Sin trabajo') : 'Sin registrar'}</strong></div><div><span>Gastos mensuales</span><strong>{currency.format(Number(financial?.totalMonthlyExpenses) || 0)}</strong><Link to='/expenses'>Editar gastos</Link></div><div><span>Disponible mensual</span><strong>{currency.format(Number(financial?.availableAmount) || 0)}</strong></div></section></section><Footer /></main>;
};