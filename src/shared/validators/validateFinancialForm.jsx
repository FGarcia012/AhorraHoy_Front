export const validateFinancialForm = ({ hasJob, monthlySalary }) => {
  const errors = {};
  if (hasJob && (!Number.isFinite(Number(monthlySalary)) || Number(monthlySalary) <= 0)) {
    errors.monthlySalary = 'Ingresa un salario mensual mayor que cero.';
  }
  return errors;
};