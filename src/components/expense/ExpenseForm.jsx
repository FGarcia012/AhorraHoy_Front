import { LoaderCircle, Save } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { EXPENSE_CATEGORY, RECURRENCE_FREQUENCY } from '../../utils/enums.js';
import { validateExpenseForm } from '../../shared/validators/validateExpenseForm.jsx';

const categories = Object.values(EXPENSE_CATEGORY);
const frequencies = Object.values(RECURRENCE_FREQUENCY);
const FieldError = ({ message }) => (message ? <span className='income-field-error'>{message}</span> : null);

export const ExpenseForm = ({ initialValue, onSubmit, isSubmitting, submitLabel }) => {
  const [form, setForm] = useState({ category: initialValue?.category || '', amount: initialValue?.amount ?? '', frequency: initialValue?.frequency || '', description: initialValue?.description || '' });
  const [formErrors, setFormErrors] = useState({});
  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: '' }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateExpenseForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length || isSubmitting) return;
    await onSubmit(form);
  };

  return <form className='income-form' onSubmit={handleSubmit} noValidate><fieldset className='income-fieldset'><legend>Categoría del gasto</legend><div className='income-option-grid'>{categories.map((category) => <button className={`income-option ${form.category === category.value ? 'income-option-selected' : ''}`} type='button' key={category.value} onClick={() => updateField('category', category.value)} aria-pressed={form.category === category.value}>{category.label}</button>)}</div><FieldError message={formErrors.category} /></fieldset><label className='income-field'>Monto<input type='number' min='0.01' step='0.01' value={form.amount} onChange={(event) => updateField('amount', event.target.value)} aria-invalid={Boolean(formErrors.amount)} placeholder='Ej. 850' /><FieldError message={formErrors.amount} /></label><fieldset className='income-fieldset'><legend>Frecuencia</legend><div className='income-option-grid income-frequency-grid'>{frequencies.map((frequency) => <button className={`income-option ${form.frequency === frequency.value ? 'income-option-selected' : ''}`} type='button' key={frequency.value} onClick={() => updateField('frequency', frequency.value)} aria-pressed={form.frequency === frequency.value}>{frequency.label}</button>)}</div><FieldError message={formErrors.frequency} /></fieldset><label className='income-field'>Descripción <span>(opcional)</span><textarea rows='3' maxLength='200' value={form.description} onChange={(event) => updateField('description', event.target.value)} aria-invalid={Boolean(formErrors.description)} placeholder='Ej. Alquiler del apartamento' /><FieldError message={formErrors.description} /></label><button className='goal-primary-button' type='submit' disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Guardando...</> : <><Save size={18} aria-hidden='true' /> {submitLabel}</>}</button></form>;
};

ExpenseForm.propTypes = { initialValue: PropTypes.shape({ category: PropTypes.string, amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), frequency: PropTypes.string, description: PropTypes.string }), onSubmit: PropTypes.func.isRequired, isSubmitting: PropTypes.bool, submitLabel: PropTypes.string.isRequired };
ExpenseForm.defaultProps = { initialValue: null, isSubmitting: false };
