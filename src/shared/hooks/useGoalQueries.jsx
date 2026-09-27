import { useCallback, useEffect, useState } from 'react';
import { getGoalById, getGoalHistory } from '../../services/goal.js';

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

const getGoalFromResponse = (data) => data?.goal || data?.goalDetails || data?.data || data;
const getGoalsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.goals || data?.goalHistory || data?.data || [];
};

export const useGoalHistory = (uid) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async () => {
    if (!uid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getGoalHistory(uid);
      setGoals(getGoalsFromResponse(response.data));
    } catch (requestError) {
      setGoals([]);
      setError(getErrorMessage(requestError, 'No se pudo cargar el historial de metas.'));
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    const load = async () => {
      await loadHistory();
    };
    load();
  }, [loadHistory]);

  return { goals, isLoading, error, loadHistory };
};

export const useGoalDetail = (gid) => {
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadGoal = useCallback(async () => {
    if (!gid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getGoalById(gid);
      setGoal(getGoalFromResponse(response.data));
    } catch (requestError) {
      setGoal(null);
      setError(getErrorMessage(requestError, 'No se pudo cargar esta meta.'));
    } finally {
      setIsLoading(false);
    }
  }, [gid]);

  useEffect(() => {
    const load = async () => {
      await loadGoal();
    };
    load();
  }, [loadGoal]);

  return { goal, isLoading, error, loadGoal };
};