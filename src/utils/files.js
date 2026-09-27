const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3010';

export const getProfilePictureUrl = (filename) => {
  if (!filename) return null;
  return `${SERVER_URL}/uploads/profile-picture/${filename}`;
};

export const getGoalPictureUrl = (filename) => {
  if (!filename) return null;
  return `${SERVER_URL}/uploads/goal-picture/${filename}`;
};