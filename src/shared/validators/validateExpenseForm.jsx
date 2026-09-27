export const validateExpenseForm = ({ category, amount, frequency, description }) => {
  const errors = {};
  if (!category) errors.category = 'Selecciona una categoría.';
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) errors.amount = 'Ingresa un monto mayor que cero.';
  if (!frequency) errors.frequency = 'Selecciona una frecuencia.';
  if (description?.length > 200) errors.description = 'La descripción no puede superar 200 caracteres.';
  return errors;
};
