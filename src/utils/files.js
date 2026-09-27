const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3010';

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

export const getProfilePictureUrl = (value) => {
  if (!value) return null;
  return isAbsoluteUrl(value) ? value : `${SERVER_URL}/uploads/profile-picture/${value}`;
};

export const getGoalPictureUrl = (value) => {
  if (!value) return null;
  return isAbsoluteUrl(value) ? value : `${SERVER_URL}/uploads/goal-picture/${value}`;
};