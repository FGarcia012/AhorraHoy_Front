import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { useState } from 'react'
import toast from 'react-hot-toast';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async ({
    name,
    surname,
    email,
    password,
    profilePicture = null
  }) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('email', email);
      formData.append('password', password);
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await register(formData);

      toast.success(response.data.message || 'Cuenta registrada exitosamente');
      navigate('/auth', { replace: true });
      return response.data;
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      const errorMessage = Array.isArray(validationErrors)
        ? validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ')
        : error?.response?.data?.message || error?.response?.data?.error || 'Error al registrar la cuenta';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};