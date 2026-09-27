import { apiClient } from './api.jsx';

export const getFinancial = (uid) => apiClient.get(`/financial/getFinancial/${uid}`);

export const updateFinancial = (uid, { hasJob, monthlySalary }) => apiClient.put(`/financial/updateFinancial/${uid}`, {
  hasJob: Boolean(hasJob),
  monthlySalary: hasJob ? Number(monthlySalary) : null,
});