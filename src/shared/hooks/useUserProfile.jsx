import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/userContext.js';
import { deleteUser, updatePassword, updateProfilePicture, updateUser } from '../../services/user.js';

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

const getUserFromResponse = (data) => data?.userDetails || data?.user || data?.data || data;

export const useUserProfile = () => {
  const { user, updateUserData, logout } = useUser();
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const runRequest = async (request, successMessage, updateLocalUser = true) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await request();
      const nextUser = getUserFromResponse(response.data);
      if (updateLocalUser && nextUser) updateUserData(nextUser, false);
      toast.success(response.data?.message || successMessage);
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo actualizar tu perfil.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const saveProfile = (data) => runRequest(() => updateUser(user.uid, data), 'Perfil actualizado correctamente.');
  const savePassword = (data) => runRequest(() => updatePassword(user.uid, data), 'Contraseña actualizada correctamente.', false);
  const savePicture = (file) => runRequest(() => updateProfilePicture(user.uid, file), 'Imagen de perfil actualizada correctamente.');
  const removeAccount = () => runRequest(() => deleteUser(user.uid), 'Cuenta eliminada correctamente.', false).then((succeeded) => {
    if (succeeded) logout();
    return succeeded;
  });

  return { user, isMutating, error, saveProfile, savePassword, savePicture, removeAccount };
};