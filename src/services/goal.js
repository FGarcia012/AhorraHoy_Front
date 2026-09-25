import { apiClient } from './api.jsx';

const toGoalPayload = ({ name, targetAmount, savingAmount, savingFrequency, goalPicture }) => {
	const payload = { name, targetAmount };
	if (savingAmount !== undefined && savingAmount !== '') payload.savingAmount = Number(savingAmount);
	if (savingFrequency) payload.savingFrequency = savingFrequency;
	if (goalPicture) {
		const formData = new FormData();
		Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
		formData.append('goalPicture', goalPicture);
		return formData;
	}
	return payload;
};

export const createGoal = (uid, data) => apiClient.post(`/goal/createGoal/${uid}`, toGoalPayload(data));
export const getActiveGoal = (uid) => apiClient.get(`/goal/getActiveGoal/${uid}`);
export const getGoalById = (gid) => apiClient.get(`/goal/getGoalById/${gid}`);
export const getGoalHistory = (uid) => apiClient.get(`/goal/getGoalHistory/${uid}`);
export const updateGoal = (gid, data) => apiClient.put(`/goal/updateGoal/${gid}`, toGoalPayload(data));
export const updateGoalPicture = (gid, goalPicture) => {
	const formData = new FormData();
	formData.append('goalPicture', goalPicture);
	return apiClient.patch(`/goal/updateGoalPicture/${gid}`, formData);
};
export const depositToGoal = (gid, amount) => apiClient.post(`/goal/deposit/${gid}`, { amount: Number(amount) });
export const withdrawFromGoal = (gid, amount) => apiClient.post(`/goal/withdraw/${gid}`, { amount: Number(amount) });
export const cancelGoal = (gid) => apiClient.patch(`/goal/cancelGoal/${gid}`);
