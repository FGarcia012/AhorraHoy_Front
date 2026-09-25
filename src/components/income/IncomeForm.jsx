import { LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { INCOME_FREQUENCY, INCOME_TYPE } from '../../utils/enums.js';
import { validateIncomeForm } from '../../shared/validators/validateIncomeForm';

const incomeTypes = Object.values(INCOME_TYPE);
const frequencies = Object.values(INCOME_FREQUENCY);

const FieldError = ({ message }) => (message ? <span className='income-field-error'>{message}</span> : null);

export const IncomeForm = ({ initialValue, onSubmit, isSubmitting, submitLabel }) => {
  const [form, setForm] = useState({ type: initialValue?.type || '', amount: initialValue?.amount ?? '', frequency: initialValue?.frequency || '', description: initialValue?.description || '' });
  const [formErrors, setFormErrors] = useState({});
  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: '' }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateIncomeForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || isSubmitting) return;
    await onSubmit(form);
  };

  return <form className='income-form' onSubmit={handleSubmit} noValidate><fieldset className='income-fieldset'><legend>Tipo de ingreso</legend><div className='income-option-grid'>{incomeTypes.map((incomeType) => <button className={`income-option ${form.type === incomeType.value ? 'income-option-selected' : ''}`} type='button' key={incomeType.value} onClick={() => updateField('type', incomeType.value)} aria-pressed={form.type === incomeType.value}>{incomeType.label}</button>)}</div><FieldError message={formErrors.type} /></fieldset><label className='income-field'>Monto<input type='number' min='0.01' step='0.01' value={form.amount} onChange={(event) => updateField('amount', event.target.value)} aria-invalid={Boolean(formErrors.amount)} placeholder='Ej. 1500' /><FieldError message={formErrors.amount} /></label><fieldset className='income-fieldset'><legend>Frecuencia</legend><div className='income-option-grid income-frequency-grid'>{frequencies.map((frequency) => <button className={`income-option ${form.frequency === frequency.value ? 'income-option-selected' : ''}`} type='button' key={frequency.value} onClick={() => updateField('frequency', frequency.value)} aria-pressed={form.frequency === frequency.value}>{frequency.label}</button>)}</div><FieldError message={formErrors.frequency} /></fieldset><label className='income-field'>Descripción <span>(opcional)</span><textarea rows='3' maxLength='200' value={form.description} onChange={(event) => updateField('description', event.target.value)} aria-invalid={Boolean(formErrors.description)} placeholder='Ej. Trabajo freelance' /><FieldError message={formErrors.description} /></label><button className='goal-primary-button' type='submit' disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Guardando...</> : <><Save size={18} aria-hidden='true' /> {submitLabel}</>}</button></form>;
};

IncomeForm.propTypes = { initialValue: PropTypes.shape({ type: PropTypes.string, amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), frequency: PropTypes.string, description: PropTypes.string }), onSubmit: PropTypes.func.isRequired, isSubmitting: PropTypes.bool, submitLabel: PropTypes.string.isRequired };
IncomeForm.defaultProps = { initialValue: null, isSubmitting: false };