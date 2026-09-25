import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext.js';
import { getUserStatistics } from '../../services/statistics.js';

const getStatisticsFromResponse = (data) => data?.statistics || data?.statisticsDetails || data?.userStatistics || data?.statisticsData || data?.data || data;

const getErrorMessage = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors)) return validationErrors.map(({ msg }) => msg).filter(Boolean).join(' ');
  return error?.response?.data?.message || error?.response?.data?.error || 'No se pudieron cargar tus estadísticas.';
};

export const useStatistics = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getUserStatistics(user.uid);
      setStatistics(getStatisticsFromResponse(response.data));
    } catch (requestError) {
      setStatistics(null);
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      await loadStatistics();
    };
    load();
  }, [loadStatistics]);

  return { statistics, isLoading, error, loadStatistics };
};