export const getIncomeId = (income) => income?._id || income?.iid || income?.id;

export const formatIncomeDate = (income) => {
  const date = income?.createdAt || income?.date || income?.incomeDate;
  return date ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium' }).format(new Date(date)) : 'Sin fecha';
};