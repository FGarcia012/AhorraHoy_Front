export const validateGoalForm = ({ name, targetAmount, savingAmount }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Ingresa un nombre para tu meta.';
  if (!Number.isFinite(Number(targetAmount)) || Number(targetAmount) <= 0) {
    errors.targetAmount = 'Ingresa un monto objetivo mayor que cero.';
  }
  if (savingAmount !== '' && (!Number.isFinite(Number(savingAmount)) || Number(savingAmount) < 0)) {
    errors.savingAmount = 'El aporte planeado no puede ser negativo.';
  }
  return errors;
};
