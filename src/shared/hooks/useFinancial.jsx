import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/userContext.js';
import { getFinancial, updateFinancial } from '../../services/financial.js';

const getFinancialFromResponse = (data) => data?.financial || data?.financialDetails || data?.data || data;

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

export const useFinancial = () => {
  const { user } = useUser();
  const [financial, setFinancial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadFinancial = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getFinancial(user.uid);
      setFinancial(getFinancialFromResponse(response.data));
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setFinancial(null);
      } else {
        setError(getErrorMessage(requestError, 'No se pudo cargar tu situación financiera.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      await loadFinancial();
    };
    load();
  }, [loadFinancial]);

  const save = async (data) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await updateFinancial(user.uid, data);
      setFinancial(getFinancialFromResponse(response.data));
      toast.success(response.data?.message || 'Situación financiera guardada correctamente.');
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo guardar tu situación financiera.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  return { financial, isLoading, isMutating, error, loadFinancial, save };
};