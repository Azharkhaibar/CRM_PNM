import { useState, useEffect } from 'react';
import { useAuditLog } from './audit-log.hooks';
export const useAuditLogStats = () => {
  const [stats, setStats] = useState({
    today: [],
    week: [],
    month: [],
    modules: [],
  });

  const { loading, error, data, getStats: fetchStats, clearError } = useAuditLog();

  const loadStats = async () => {
    try {
      await fetchStats();
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    if (data) {
      setStats({
        today: data.today || [],
        week: data.week || [],
        month: data.month || [],
        modules: data.modules || [],
      });
    }
  }, [data]);

  useEffect(() => {
    loadStats();
  }, []);

  const refreshStats = () => {
    loadStats();
  };

  return {
    stats,
    loading: loading,
    error,
    refreshStats,
    clearError,
  };
};
