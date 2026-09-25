export const validateFinancialForm = ({ hasJob, monthlySalary, monthlyExpenses }) => {
  const errors = {};
  if (hasJob && (!Number.isFinite(Number(monthlySalary)) || Number(monthlySalary) <= 0)) {
    errors.monthlySalary = 'Ingresa un salario mensual mayor que cero.';
  }
  if (monthlyExpenses === '' || !Number.isFinite(Number(monthlyExpenses)) || Number(monthlyExpenses) < 0) {
    errors.monthlyExpenses = 'Ingresa gastos mensuales iguales o mayores que cero.';
  }
  return errors;
};