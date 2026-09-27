import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../contexts/userContext.js';
import {
  cancelGoal,
  createGoal,
  depositToGoal,
  getActiveGoal,
  updateGoal,
  updateGoalPicture,
  withdrawFromGoal,
} from '../../services/goal.js';

const getGoalFromResponse = (data) => data?.goal || data?.goalDetails || data?.data || data;
const getGoalId = (currentGoal) => currentGoal?._id || currentGoal?.gid || currentGoal?.id;

const getErrorMessage = (error, fallback) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) {
    return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  }
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

export const useGoal = () => {
  const { user } = useUser();
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadGoal = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getActiveGoal(user.uid);
        const nextGoal = getGoalFromResponse(response.data);
        setGoal(response.data?.estimatedTime ? { ...nextGoal, estimatedTime: response.data.estimatedTime } : nextGoal);
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setGoal(null);
      } else {
        setError(getErrorMessage(requestError, 'No se pudo cargar tu meta.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      await loadGoal();
    };
    load();
  }, [loadGoal]);

  const runMutation = async (request, successMessage) => {
    setIsMutating(true);
    setError('');
    try {
      const response = await request();
      await loadGoal();
      toast.success(response.data?.message || successMessage);
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'No se pudo actualizar la meta.');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const create = (data) => runMutation(() => createGoal(user.uid, data), 'Meta creada correctamente.');
  const deposit = (amount) => runMutation(() => depositToGoal(getGoalId(goal), amount), 'Depósito realizado correctamente.');
  const withdraw = (amount) => runMutation(() => withdrawFromGoal(getGoalId(goal), amount), 'Retiro realizado correctamente.');
  const update = (data) => runMutation(() => updateGoal(getGoalId(goal), data), 'Meta actualizada correctamente.');
  const changePicture = (file) => runMutation(() => updateGoalPicture(getGoalId(goal), file), 'Imagen actualizada correctamente.');
  const cancel = async () => {
    const succeeded = await runMutation(() => cancelGoal(getGoalId(goal)), 'Meta cancelada correctamente.');
    if (succeeded) setGoal(null);
    return succeeded;
  };

  return { goal, isLoading, isMutating, error, loadGoal, create, deposit, withdraw, update, changePicture, cancel };
};
