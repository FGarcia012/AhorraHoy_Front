import { apiClient } from './api.jsx';

const toExpensePayload = ({ category, amount, frequency, description }) => {
  const payload = { category, amount: Number(amount), frequency };
  if (description?.trim()) payload.description = description.trim();
  return payload;
};

export const createExpense = (uid, data) => apiClient.post(`/expense/createExpense/${uid}`, toExpensePayload(data));
export const getExpenseById = (eid) => apiClient.get(`/expense/getExpenseById/${eid}`);
export const getUserExpenses = (uid) => apiClient.get(`/expense/getUserExpenses/${uid}`);
export const getExpenseSummary = (uid) => apiClient.get(`/expense/getExpenseSummary/${uid}`);
export const updateExpense = (eid, data) => apiClient.put(`/expense/updateExpense/${eid}`, toExpensePayload(data));
export const deleteExpense = (eid) => apiClient.delete(`/expense/deleteExpense/${eid}`);
