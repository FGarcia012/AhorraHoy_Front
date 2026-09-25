import { useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Camera, Check, CircleAlert, LoaderCircle, Pencil, Plus, Target, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer/Footer';
import { useGoal } from '../../shared/hooks/useGoal';
import { validateGoalForm } from '../../shared/validators/validateGoalForm';
import { getGoalPictureUrl } from '../../utils/files.js';
import { GOAL_SAVING_FREQUENCY, GOAL_STATUS } from '../../utils/enums.js';
import './GoalPage.css';

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
const frequencies = Object.values(GOAL_SAVING_FREQUENCY);
const activeStatus = GOAL_STATUS.ACTIVE.value;
const emptyForm = { name: '', targetAmount: '', savingAmount: '', savingFrequency: GOAL_SAVING_FREQUENCY.MONTHLY.value, goalPicture: null };

const getStatusLabel = (status) => Object.values(GOAL_STATUS).find((item) => item.value === status)?.label || status || 'Activa';

const FieldError = ({ message }) => (message ? <span className='goal-field-error'>{message}</span> : null);

export const GoalPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { goal, isLoading, isMutating, error, loadGoal, create, deposit, withdraw, update, changePicture, cancel } = useGoal();
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const errors = validateGoalForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || isMutating) return;
    await create(form);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    setAmountError('');
  };

  const handleDeposit = async (event) => {
    event.preventDefault();
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Ingresa un monto mayor que cero.');
      return;
    }
    const succeeded = await deposit(amount);
    if (succeeded) setAmount('');
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    const currentAmount = Number(goal?.currentAmount) || 0;
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Ingresa un monto mayor que cero.');
      return;
    }
    if (Number(amount) > currentAmount) {
      setAmountError('No puedes retirar más de lo que has ahorrado.');
      return;
    }
    if (!window.confirm('¿Seguro que quieres sacar dinero de tu meta? ¡Todo ahorro cuenta! :(')) return;
    const succeeded = await withdraw(amount);
    if (succeeded) setAmount('');
  };

  const startEditing = () => {
    setEditForm({
      name: goal.name || '',
      targetAmount: goal.targetAmount || '',
      savingAmount: goal.savingAmount ?? '',
      savingFrequency: goal.savingFrequency || GOAL_SAVING_FREQUENCY.MONTHLY.value,
    });
    setEditErrors({});
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const errors = validateGoalForm(editForm);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0 || isMutating) return;
    const succeeded = await update(editForm);
    if (succeeded) setEditForm(null);
  };

  const handlePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setAmountError('Selecciona una imagen JPG o PNG de máximo 5 MB.');
      return;
    }
    await changePicture(file);
    event.target.value = '';
  };

  const handleCancel = async () => {
    if (window.confirm('¿Seguro que quieres cancelar esta meta? Esta acción no se puede deshacer.')) {
      await cancel();
    }
  };

  if (isLoading) {
    return <main className='goal-page'><Navbar /><section className='goal-state'><LoaderCircle className='spin' size={32} aria-hidden='true' /><p>Cargando tu meta...</p></section><Footer /></main>;
  }

  if (!goal && error) {
    return <main className='goal-page'><Navbar /><section className='goal-state'><CircleAlert size={34} aria-hidden='true' /><h1>No pudimos cargar tu meta</h1><p>{error}</p><button className='goal-primary-button' type='button' onClick={loadGoal}>Intentar de nuevo</button></section><Footer /></main>;
  }

  if (!goal) {
    return (
      <main className='goal-page'><Navbar /><section className='goal-shell goal-empty-shell'><div className='goal-heading'><span className='goal-eyebrow'>Tu primera meta</span><h1>Dale un nombre a eso que quieres alcanzar.</h1><p>Define un objetivo claro y convierte cada aporte en un paso visible.</p></div><form className='goal-form goal-create-form' onSubmit={handleCreate} noValidate><div className='goal-form-heading'><Target size={22} aria-hidden='true' /><div><h2>Crear meta de ahorro</h2><p>Solo necesitas una intención y un monto objetivo.</p></div></div><label className='goal-field'>Nombre de la meta<input type='text' value={form.name} onChange={(event) => updateForm('name', event.target.value)} aria-invalid={Boolean(formErrors.name)} placeholder='Ej. Viaje a la playa' /><FieldError message={formErrors.name} /></label><div className='goal-form-grid'><label className='goal-field'>Monto objetivo<input type='number' min='0.01' step='0.01' value={form.targetAmount} onChange={(event) => updateForm('targetAmount', event.target.value)} aria-invalid={Boolean(formErrors.targetAmount)} placeholder='5000' /><FieldError message={formErrors.targetAmount} /></label><label className='goal-field'>Aporte planeado <span>(opcional)</span><input type='number' min='0' step='0.01' value={form.savingAmount} onChange={(event) => updateForm('savingAmount', event.target.value)} aria-invalid={Boolean(formErrors.savingAmount)} placeholder='500' /><FieldError message={formErrors.savingAmount} /></label></div><label className='goal-field'>Frecuencia del aporte<select value={form.savingFrequency} onChange={(event) => updateForm('savingFrequency', event.target.value)}>{frequencies.map((frequency) => <option key={frequency.value} value={frequency.value}>{frequency.label}</option>)}</select></label><label className='goal-file-field'>Imagen de la meta <span>(opcional)</span><input type='file' accept='image/jpeg,image/png' onChange={(event) => updateForm('goalPicture', event.target.files?.[0] || null)} /><small>JPG o PNG, máximo 5 MB.</small></label><button className='goal-primary-button' type='submit' disabled={isMutating}>{isMutating ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Creando meta...</> : <><Plus size={18} aria-hidden='true' /> Crear mi meta</>}</button></form></section><Footer /></main>
    );
  }

  const currentAmount = Number(goal.currentAmount) || 0;
  const targetAmount = Number(goal.targetAmount) || 0;
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const isActive = goal.status === activeStatus;
  const pictureUrl = getGoalPictureUrl(goal.goalPicture);

  return (
    <main className='goal-page'><Navbar /><section className='goal-shell'><div className='goal-topbar'><div><span className='goal-eyebrow'>Mi espacio</span><h1>Tu meta, paso a paso.</h1></div><button className='goal-quiet-button' type='button' onClick={() => navigate('/')}><ArrowDownToLine size={16} aria-hidden='true' /> Volver al inicio</button></div>{error && <div className='goal-alert' role='alert'><CircleAlert size={18} aria-hidden='true' />{error}</div>}<section className='goal-overview'><div className='goal-picture-wrap'>{pictureUrl ? <img src={pictureUrl} alt={`Imagen de ${goal.name}`} /> : <Target size={42} aria-hidden='true' />}<input ref={fileInputRef} className='visually-hidden' type='file' accept='image/jpeg,image/png' onChange={handlePictureChange} /><button className='goal-picture-button' type='button' onClick={() => fileInputRef.current?.click()} disabled={!isActive || isMutating} aria-label='Cambiar imagen de la meta'><Camera size={16} aria-hidden='true' /></button></div><div className='goal-overview-content'><div className='goal-title-row'><div><span className={`goal-status goal-status-${goal.status?.toLowerCase()}`}>{getStatusLabel(goal.status)}</span><h2>{goal.name}</h2></div>{isActive && <button className='goal-icon-button' type='button' onClick={startEditing} aria-label='Editar meta'><Pencil size={17} aria-hidden='true' /></button>}</div><div className='goal-amount-line'><strong>{currency.format(currentAmount)}</strong><span>de {currency.format(targetAmount)}</span></div><div className='goal-progress-track' aria-label={`${Math.round(progress)}% completado`}><span style={{ width: `${progress}%` }} /></div><div className='goal-progress-caption'><span>{Math.round(progress)}% completado</span><span>{currency.format(remainingAmount)} restantes</span></div><div className='goal-stats'><div><span>Ahorrado</span><strong>{currency.format(currentAmount)}</strong></div><div><span>Objetivo</span><strong>{currency.format(targetAmount)}</strong></div><div><span>Aporte {GOAL_SAVING_FREQUENCY[goal.savingFrequency]?.label?.toLowerCase() || 'planeado'}</span><strong>{currency.format(Number(goal.savingAmount) || 0)}</strong></div></div></div></section>{editForm && <form className='goal-form goal-edit-form' onSubmit={handleUpdate} noValidate><div className='goal-form-heading'><Pencil size={20} aria-hidden='true' /><div><h2>Editar meta</h2><p>Ajusta el objetivo o tu aporte planeado.</p></div></div><label className='goal-field'>Nombre de la meta<input type='text' value={editForm.name} onChange={(event) => setEditForm((previous) => ({ ...previous, name: event.target.value }))} aria-invalid={Boolean(editErrors.name)} /><FieldError message={editErrors.name} /></label><div className='goal-form-grid'><label className='goal-field'>Monto objetivo<input type='number' min='0.01' step='0.01' value={editForm.targetAmount} onChange={(event) => setEditForm((previous) => ({ ...previous, targetAmount: event.target.value }))} aria-invalid={Boolean(editErrors.targetAmount)} /><FieldError message={editErrors.targetAmount} /></label><label className='goal-field'>Aporte planeado<input type='number' min='0' step='0.01' value={editForm.savingAmount} onChange={(event) => setEditForm((previous) => ({ ...previous, savingAmount: event.target.value }))} aria-invalid={Boolean(editErrors.savingAmount)} /><FieldError message={editErrors.savingAmount} /></label></div><label className='goal-field'>Frecuencia<select value={editForm.savingFrequency} onChange={(event) => setEditForm((previous) => ({ ...previous, savingFrequency: event.target.value }))}>{frequencies.map((frequency) => <option key={frequency.value} value={frequency.value}>{frequency.label}</option>)}</select></label><div className='goal-form-actions'><button className='goal-secondary-button' type='button' onClick={() => setEditForm(null)}>Cerrar</button><button className='goal-primary-button' type='submit' disabled={isMutating}>{isMutating ? 'Guardando...' : 'Guardar cambios'}</button></div></form>}{isActive && <section className='goal-actions-section'><div className='goal-section-heading'><div><span className='goal-eyebrow'>Movimiento</span><h2>Haz que tu ahorro avance.</h2></div><Check size={24} aria-hidden='true' /></div><form className='goal-movement-form'><label className='goal-field'>Monto<input type='number' min='0.01' step='0.01' value={amount} onChange={handleAmountChange} placeholder='0.00' aria-invalid={Boolean(amountError)} /><FieldError message={amountError} /></label><div className='goal-movement-buttons'><button className='goal-primary-button' type='button' onClick={handleDeposit} disabled={isMutating}><ArrowUpFromLine size={17} aria-hidden='true' /> Depositar</button><button className='goal-secondary-button' type='button' onClick={handleWithdraw} disabled={isMutating}><ArrowDownToLine size={17} aria-hidden='true' /> Retirar</button></div></form></section>}{!isActive && <div className='goal-complete-note'><Check size={20} aria-hidden='true' /><span>Esta meta ya no admite nuevos movimientos.</span></div>}{isActive && <button className='goal-danger-button' type='button' onClick={handleCancel} disabled={isMutating}><Trash2 size={16} aria-hidden='true' /> Cancelar meta</button>}</section><Footer /></main>
  );
};
