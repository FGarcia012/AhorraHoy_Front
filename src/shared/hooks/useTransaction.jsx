import { useCallback, useEffect, useState } from 'react';
import { getGoalHistory } from '../../services/goal.js';
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

const getGoalId = (transaction) => typeof transaction?.goal === 'string'
  ? transaction.goal
  : transaction?.goal?._id || transaction?.goal?.gid || transaction?.goalId || transaction?.gid;

const getGoalsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.goals || data?.goalHistory || data?.data || [];
};

const getGoalNames = async (uid) => {
  try {
    const response = await getGoalHistory(uid);
    return new Map(getGoalsFromResponse(response.data).map((goal) => [goal._id || goal.gid || goal.id, goal.name]));
  } catch {
    return new Map();
  }
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
      const nextTransactions = getTransactionsFromResponse(response.data);
      const goalNames = scope === 'user' ? await getGoalNames(id) : new Map();
      setTransactions(nextTransactions.map((transaction) => {
        const goalName = transaction.goal?.name || transaction.goalName || transaction.goal?.goalName || goalNames.get(getGoalId(transaction));
        return goalName ? { ...transaction, goalName } : transaction;
      }));
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
