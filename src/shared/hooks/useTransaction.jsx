import { useCallback, useEffect, useState } from 'react';
import { getGoalTransactions, getTransactionById, getUserTransactions } from '../../services/transaction.js';

const getTransactionsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.transactions || data?.transactionDetails || data?.data || [];
};

const getErrorMessage = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) {
    return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  }
  return error?.response?.data?.message || error?.response?.data?.error || 'No se pudo cargar el historial.';
};

export const useTransaction = (id, scope = 'goal') => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTransactions = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = scope === 'user' ? await getUserTransactions(id) : await getGoalTransactions(id);
      setTransactions(getTransactionsFromResponse(response.data));
    } catch (requestError) {
      setTransactions([]);
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [id, scope]);

  useEffect(() => {
    const load = async () => {
      await loadTransactions();
    };
    load();
  }, [loadTransactions]);

  return { transactions, isLoading, error, loadTransactions };
};

const getTransactionFromResponse = (data) => data?.transaction || data?.transactionDetails || data?.data || data;

export const useTransactionDetail = (tid) => {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTransaction = useCallback(async () => {
    if (!tid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getTransactionById(tid);
      setTransaction(getTransactionFromResponse(response.data));
    } catch (requestError) {
      setTransaction(null);
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [tid]);

  useEffect(() => {
    const load = async () => {
      await loadTransaction();
    };
    load();
  }, [loadTransaction]);

  return { transaction, isLoading, error, loadTransaction };
};
