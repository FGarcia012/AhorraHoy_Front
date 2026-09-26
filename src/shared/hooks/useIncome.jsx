import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/userContext.js';
import { createIncome, deleteIncome, getIncomeById, getUserIncomes, updateIncome } from '../../services/income.js';

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

const getIncomesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.incomes || data?.incomeDetails || data?.data || [];
};

const getIncomeFromResponse = (data) => data?.income || data?.incomeDetails || data?.data || data;

export const useIncome = () => {
  const { user } = useUser();
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadIncomes = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getUserIncomes(user.uid);
      setIncomes(getIncomesFromResponse(response.data));
    } catch (requestError) {
      setIncomes([]);
      setError(getErrorMessage(requestError, 'No se pudieron cargar tus ingresos.'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      await loadIncomes();
    };
    load();
  }, [loadIncomes]);

  const create = async (data) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await createIncome(user.uid, data);
      await loadIncomes();
      toast.success(response.data?.message || 'Ingreso registrado correctamente.');
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo registrar el ingreso.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const remove = async (iid) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await deleteIncome(iid);
      await loadIncomes();
      toast.success(response.data?.message || 'Ingreso eliminado correctamente.');
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo eliminar el ingreso.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  return { incomes, isLoading, isMutating, error, loadIncomes, create, remove };
};

export const useIncomeDetail = (iid) => {
  const [income, setIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadIncome = useCallback(async () => {
    if (!iid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getIncomeById(iid);
      setIncome(getIncomeFromResponse(response.data));
    } catch (requestError) {
      setIncome(null);
      setError(getErrorMessage(requestError, 'No se pudo cargar este ingreso.'));
    } finally {
      setIsLoading(false);
    }
  }, [iid]);

  useEffect(() => {
    const load = async () => {
      await loadIncome();
    };
    load();
  }, [loadIncome]);

  const update = async (data) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await updateIncome(iid, data);
      setIncome(getIncomeFromResponse(response.data));
      toast.success(response.data?.message || 'Ingreso actualizado correctamente.');
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo actualizar el ingreso.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const remove = async () => {
    setIsMutating(true);
    setError('');
    try {
      const response = await deleteIncome(iid);
      toast.success(response.data?.message || 'Ingreso eliminado correctamente.');
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo eliminar el ingreso.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  return { income, isLoading, isMutating, error, loadIncome, update, remove };
};