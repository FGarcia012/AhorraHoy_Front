import { apiClient } from './api.jsx';

export const getUserStatistics = (uid) => apiClient.get(`/statistics/getUserStatistics/${uid}`);