import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/userContext.js';
import { createExpense, deleteExpense, getExpenseById, getExpenseSummary, getUserExpenses, updateExpense } from '../../services/expense.js';

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};
const getList = (data) => Array.isArray(data) ? data : data?.expenses || data?.expenseDetails || data?.data || [];
const getOne = (data) => data?.expense || data?.expenseDetails || data?.data || data;

export const useExpense = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError('');
    try {
      const [listResponse, summaryResponse] = await Promise.all([getUserExpenses(user.uid), getExpenseSummary(user.uid)]);
      setExpenses(getList(listResponse.data));
      setSummary(summaryResponse.data?.summary || summaryResponse.data?.data || summaryResponse.data);
    } catch (requestError) {
      setExpenses([]);
      setSummary(null);
      setError(getErrorMessage(requestError, 'No se pudieron cargar tus gastos.'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadExpenses = async () => { await load(); };
    loadExpenses();
  }, [load]);

  const create = async (data) => {
    setIsMutating(true); setError('');
    try { const response = await createExpense(user.uid, data); await load(); toast.success(response.data?.message || 'Gasto registrado correctamente.'); return true; }
    catch (requestError) { const message = getErrorMessage(requestError, 'No se pudo registrar el gasto.'); setError(message); toast.error(message); return false; }
    finally { setIsMutating(false); }
  };
  const remove = async (eid) => {
    setIsMutating(true); setError('');
    try { const response = await deleteExpense(eid); await load(); toast.success(response.data?.message || 'Gasto eliminado correctamente.'); return true; }
    catch (requestError) { const message = getErrorMessage(requestError, 'No se pudo eliminar el gasto.'); setError(message); toast.error(message); return false; }
    finally { setIsMutating(false); }
  };

  return { expenses, summary, isLoading, isMutating, error, load, create, remove };
};

export const useExpenseSummary = () => {
  const { user } = useUser();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const loadSummary = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const response = await getExpenseSummary(user.uid);
      setSummary(response.data?.summary || response.data?.data || response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo calcular el ahorro sugerido.'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => { await loadSummary(); };
    load();
  }, [loadSummary]);

  return { summary, isLoading, error, loadSummary };
};

export const useExpenseDetail = (eid) => {
  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const loadExpense = useCallback(async () => {
    if (!eid) return;
    setIsLoading(true); setError('');
    try { const response = await getExpenseById(eid); setExpense(getOne(response.data)); }
    catch (requestError) { setExpense(null); setError(getErrorMessage(requestError, 'No se pudo cargar este gasto.')); }
    finally { setIsLoading(false); }
  }, [eid]);
  useEffect(() => {
    const loadOneExpense = async () => { await loadExpense(); };
    loadOneExpense();
  }, [loadExpense]);
  const update = async (data) => {
    setIsMutating(true); setError('');
    try { const response = await updateExpense(eid, data); setExpense(getOne(response.data)); toast.success(response.data?.message || 'Gasto actualizado correctamente.'); return true; }
    catch (requestError) { const message = getErrorMessage(requestError, 'No se pudo actualizar el gasto.'); setError(message); toast.error(message); return false; }
    finally { setIsMutating(false); }
  };
  return { expense, isLoading, isMutating, error, loadExpense, update };
};
