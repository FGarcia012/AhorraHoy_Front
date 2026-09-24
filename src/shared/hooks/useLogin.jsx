import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useUser();
  const navigate = useNavigate();

  const loginUser = async ({ email, name, password }) => {
    try {
      setIsLoading(true);

      const loginData = { password };
      if (email) {
        loginData.email = email;
      }
      if (name) {
        loginData.name = name;
      }

      const response = await login(loginData);

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
      const errorMessage = error?.response?.data?.error ||
                          error?.response?.data?.message || 
              '';

      if (errorMessage.toLowerCase().includes('credenciales invalidas')) {
        if (errorMessage.includes('usuario') || errorMessage.includes('correo')) {
          toast.error('Usuario o correo electrónico incorrecto');
        } else if (errorMessage.includes('contraseña')) {
          toast.error('Contraseña incorrecta');
        } else {
          toast.error('Credenciales inválidas');
        }
      } else {
        toast.error(errorMessage || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};