import { apiClient } from './api.jsx';

export const updateUser = (uid, data) => apiClient.put(`/user/updateUser/${uid}`, data);
export const updatePassword = (uid, data) => apiClient.patch(`/user/updatePassword/${uid}`, data);
export const updateProfilePicture = (uid, profilePicture) => {
  const formData = new FormData();
  formData.append('profilePicture', profilePicture);
  return apiClient.patch(`/user/updateProfilePicture/${uid}`, formData);
};
export const deleteUser = (uid) => apiClient.delete(`/user/deleteUser/${uid}`, { data: { confirm: 'yes' } });