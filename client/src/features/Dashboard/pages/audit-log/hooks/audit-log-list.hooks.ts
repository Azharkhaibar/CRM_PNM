// hooks/audit-log-list.hooks.ts
import { useState, useEffect, useCallback } from 'react';
import auditLogServices from '../services/audit-log.services';

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  start_date?: string;
  end_date?: string;
  action?: string;
  module?: string;
  search?: string;
}

interface User {
  user_id: number;
  userID: string;
  role: string;
  gender: string;
}

interface AuditLog {
  id: number;
  userId: number | null;
  user: User | null;
  action: string;
  module: string;
  description: string;
  endpoint: string | null;
  ip_address: string;
  isSuccess: boolean;
  timestamp: string;
  metadata: any;
}

interface AuditLogResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useAuditLogList = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async (page: number = 1, filters: Filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page,
        limit: 20,
        ...filters,
      };

      console.log('📡 Fetching audit logs with params:', queryParams);

      const response: AuditLogResponse = await auditLogServices.getAuditLogs(queryParams);

      console.log('✅ Audit logs response:', {
        dataCount: response.data?.length,
        total: response.total,
        page: response.page,
        hasUserData: response.data?.some((log) => log.user !== null),
      });

      response.data?.forEach((log, index) => {
        console.log(`📝 Log di useAuditLog ${index + 1}:`, {
          id: log.id,
          userId: log.userId,
          hasUser: !!log.user,
          userID: log.user?.userID,
          userRole: log.user?.role,
          userGender: log.user?.gender,
        });
      });

      setAuditLogs(response.data || []);
      setTotal(response.total || 0);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 20,
        totalPages: response.totalPages || 1,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data audit';
      setError(errorMessage);
      console.error('❌ Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAuditLog = useCallback(
    async (logId: number): Promise<{ message: string }> => {
      try {
        setLoading(true);
        setError(null);
        const result = await auditLogServices.deleteAuditLog(logId);
        await fetchAuditLogs(pagination.page);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'gagal hapus log audit';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAuditLogs, pagination.page]
  );

  const deleteMultipleAuditLogs = useCallback(
    async (logIds: number[]): Promise<{ message: string; deletedCount: number }> => {
      try {
        setLoading(true);
        setError(null);

        if (!logIds || logIds.length === 0) {
          throw new Error('Tidak ada log yang dipilih untuk dihapus');
        }

        const result = await auditLogServices.deleteMultipleAuditLogs(logIds);

        await fetchAuditLogs(pagination.page);

        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal menghapus log audit';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAuditLogs, pagination.page]
  );

  const handleSearch = useCallback(
    (search: string) => {
      fetchAuditLogs(1, { search });
    },
    [fetchAuditLogs]
  );

  const handleFilter = useCallback(
    (filters: Filters) => {
      fetchAuditLogs(1, filters);
    },
    [fetchAuditLogs]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchAuditLogs(page);
    },
    [fetchAuditLogs]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchAuditLogs(pagination.page);
  }, [fetchAuditLogs, pagination.page]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return {
    auditLogs,
    total,
    pagination,
    loading,
    error,
    handleSearch,
    handleFilter,
    handlePageChange,
    deleteAuditLog,
    deleteMultipleAuditLogs,

    clearError,
    refresh,
  };
};
