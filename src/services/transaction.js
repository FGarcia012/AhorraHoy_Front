import { apiClient } from './api.jsx';

export const getGoalTransactions = (gid) => apiClient.get(`/transaction/getGoalTransactions/${gid}`);
export const getUserTransactions = (uid) => apiClient.get(`/transaction/getUserTransactions/${uid}`);
