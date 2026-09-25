export const validateIncomeForm = ({ type, amount, frequency, description }) => {
  const errors = {};
  if (!type) errors.type = 'Selecciona un tipo de ingreso.';
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) errors.amount = 'Ingresa un monto mayor que cero.';
  if (!frequency) errors.frequency = 'Selecciona una frecuencia.';
  if (description && description.length > 200) errors.description = 'La descripción no puede superar 200 caracteres.';
  return errors;
};