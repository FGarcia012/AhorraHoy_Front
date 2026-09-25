import { apiClient } from './api.jsx';

const toIncomePayload = ({ type, amount, frequency, description }) => {
  const payload = { type, amount: Number(amount), frequency };
  if (description?.trim()) payload.description = description.trim();
  return payload;
};

export const createIncome = (uid, data) => apiClient.post(`/income/createIncome/${uid}`, toIncomePayload(data));
export const getIncomeById = (iid) => apiClient.get(`/income/getIncomeById/${iid}`);
export const getUserIncomes = (uid) => apiClient.get(`/income/getUserIncomes/${uid}`);
export const updateIncome = (iid, data) => apiClient.put(`/income/updateIncome/${iid}`, toIncomePayload(data));