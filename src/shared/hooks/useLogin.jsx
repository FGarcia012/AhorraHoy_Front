import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext.js';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useUser();
  const navigate = useNavigate();

  const loginUser = async ({ email, password }) => {
    try {
      setIsLoading(true);

      const response = await login({ email, password });

      let userDetails;
      let token;

      if (response.data?.userDetails?.token) {
        const { token: userToken, ...userWithoutToken } = response.data.userDetails;
        userDetails = userWithoutToken;
        token = userToken;
      } else {
        userDetails = response.data?.userDetails;
        token = response.data?.token;
      }

      if (!userDetails) {
        toast.error('Detalles del usuario no encontrados en la respuesta.');
        return;
      }

      if (!token) {
        toast.error('Token de autenticación no encontrado en la respuesta.');
        return;
      }

      toast.success(response.data.message || 'Inicio de sesión exitoso');

      contextLogin({ ...userDetails, token });

      navigate('/', { replace: true });

    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      const errorMessage = Array.isArray(validationErrors)
        ? validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ')
        : error?.response?.data?.message || error?.response?.data?.error || '';

      toast.error(errorMessage || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};