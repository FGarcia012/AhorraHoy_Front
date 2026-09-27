import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext.js';
import { googleAuth } from '../../services/api';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useUser();
  const navigate = useNavigate();

  const loginWithGoogle = async (idToken) => {
    try {
      setIsLoading(true);

      const response = await googleAuth({ idToken });
      const { token, ...userWithoutToken } = response.data.userDetails;

      toast.success(response.data.message || 'Sesión iniciada con Google');
      contextLogin({ ...userWithoutToken, token });
      navigate('/goal', { replace: true });

    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Error al iniciar sesión con Google';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithGoogle, isLoading };
};